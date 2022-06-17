import { IncomingMessage, ServerResponse } from 'http';
import { model } from '../models/userModel';
import { User } from '../types/interfaces';

const { findAll, findById, create, update, remove } = model;

class Controller {
  /**
   * @description - Gets all users
   * @route GET /api/users
   * @param {IncomingMessage} _ - The request object
   * @param {ServerResponse} res - The response object
   * @returns {void}
   */
  async getUsers(_: IncomingMessage, res: ServerResponse): Promise<void> {
    try {
      const users = await findAll();
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(users));
    } catch (error) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ message: 'Something went wrong on the server' }));
    }
  }

  /**
   * @description - Gets a user by id
   * @route GET /api/users/:id
   * @param {IncomingMessage} _ - The request object
   * @param {ServerResponse} res - The response object
   * @param {string} id - The user id
   * @returns {void}
   * @memberof Controller
   * @throws {Error} - If the user id is not a valid string
   * @throws {Error} - If the user id is not found
   */
  async getUser(_: IncomingMessage, res: ServerResponse, id: string): Promise<void> {
    try {
      const user = await findById(id);

      if (!user) {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: `User doesn't exist` }));
      } else {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(user));
      }
    } catch (error) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ message: (error as Error).message }));
    }
  }
  /**
   * @description - Creates a user
   * @route POST /api/users
   * @param {IncomingMessage} req - The request object
   * @param {ServerResponse} res - The response object
   * @returns {void}
   * @memberof Controller
   * @throws {Error} - If the user id is not a valid string
   * @throws {Error} - If the user id is not found
   */
  async createUser(req: IncomingMessage, res: ServerResponse): Promise<void> {
    try {
      const body = await Controller.getPostData(req, res);
      if (!body) {
        throw new Error('No data sent');
      }
      const { username, age, hobbies }: Omit<User, 'id'> = body;
      const user: Omit<User, 'id'> = {
        username,
        age,
        hobbies,
      };
      await create(user);
      res.writeHead(201, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ user }));
    } catch (error) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ message: (error as Error).message }));
    }
  }

  /**
   * @description - Update User
   * @route PUT /api/users/:id
   * @param {IncomingMessage} req - The request object
   * @param {ServerResponse} res - The response object
   * @param {string} id - The user id
   * @returns {void}
   * @memberof Controller
   * @throws {Error} - If the user id is not a valid string
   * @throws {Error} - If the user id is not found
   */
  async updateUser(req: IncomingMessage, res: ServerResponse, id: string): Promise<void> {
    try {
      const user = await findById(id);
      if (!user) {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: `User doesn't exist` }));
      } else {
        const body = await Controller.getPostData(req, res, false);
        if (!body) {
          throw new Error('No data sent');
        }
        Controller.checkKeysUser(body);
        const { username, age, hobbies }: Omit<User, 'id'> = body;
        const userData: Omit<User, 'id'> = {
          username: username || user.username,
          age: age || user.age,
          hobbies: hobbies || user.hobbies,
        };
        await update(id, userData);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'User updated' }));
      }
    } catch (error) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ message: (error as Error).message }));
    }
  }

  /**
   * @description - Remove a user by id
   * @route DELETE /api/users/:id
   * @param {IncomingMessage} req - The request object
   * @param {ServerResponse} res - The response object
   * @param {string} id - The user id
   * @returns {void}
   * @memberof Controller
   * @throws {Error} - If the user id is not a valid string
   * @throws {Error} - If the user id is not found
   */
  async removeUser(_: IncomingMessage, res: ServerResponse, id: string): Promise<void> {
    try {
      const user = await findById(id);

      if (!user) {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: `User doesn't exist` }));
      } else {
        await remove(id);
        res.writeHead(204, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: `User ${user.username} removed` }));
      }
    } catch (error) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ message: (error as Error).message }));
    }
  }

  private static getPostData = (
    req: IncomingMessage,
    res: ServerResponse,
    isMethodPOST = true,
  ): Promise<Omit<User, 'id'> | undefined> => {
    return new Promise((resolve, reject) => {
      try {
        let body = '';
        req
          .on('data', (chunk) => {
            body += chunk.toString();
          })
          .on('end', () => {
            if (isMethodPOST) resolve(Controller.checkRequiredFields(body, res));
            else {
              resolve(JSON.parse(body));
            }
          });
      } catch (error) {
        reject(error);
      }
    });
  };

  /**
   * @description - Checks if the required fields are present in the request body
   * @param {string} body - The request body
   * @param {ServerResponse} res - The response object
   * @returns {void}
   * @memberof Controller
   * @throws {Error} - If the required fields are not present
   * @throws {Error} - If the required fields are not valid
   * @throws {Error} - If the required fields are not a valid types
   */
  private static checkRequiredFields(body: string, res: ServerResponse): Omit<User, 'id'> | undefined {
    try {
      const user: Omit<User, 'id'> = JSON.parse(body);
      const len = Object.keys(user).length;
      if (len < 3) {
        throw new Error('Missing required fields');
      } else if (len > 3) {
        throw new Error('Too many fields');
      } else {
        Controller.checkKeysUser(user);
        return user;
      }
    } catch (error) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ message: (error as Error).message }));
    }
  }

  /**
   * @description - Checks if the keys of the user are valid
   * @param {Omit<User, 'id'>} user - The user object
   * @returns {void}
   * @memberof Controller
   * @throws {Error} - If the keys of the user are not valid
   * @throws {Error} - If the keys of the user are not a valid types
   */
  private static checkKeysUser(user: Omit<User, 'id'>): void {
    try {
      const keys = ['username', 'age', 'hobbies'];
      for (let i = 0; i < Object.keys(user).length; i++) {
        if (!keys.includes(Object.keys(user)[i])) {
          throw new Error(`Missing required field ${keys[i]}`);
        }
      }
      Controller.checkFieldUsername(user);
      Controller.checkFieldAge(user);
      Controller.checkFieldHobbies(user);
    } catch (error) {
      if (error) {
        throw error;
      }
    }
  }

  /**
   * @description - Checks if the username field is valid
   * @param {Omit<User, 'id'>} user - The user object
   * @returns {void}
   * @memberof Controller
   * @throws {Error} - If the username field is not valid
   */
  private static checkFieldUsername({ username }: Omit<User, 'id'>): void {
    try {
      if (typeof username !== 'string') {
        throw new Error('The username field must be a string');
      }
    } catch (error) {
      if (error) {
        throw error;
      }
    }
  }

  /**
   * @description - Checks if the age field is valid
   * @param {Omit<User, 'id'>} user - The user object
   * @returns {void}
   * @memberof Controller
   * @throws {Error} - If the age field is not valid
   */
  private static checkFieldAge({ age }: Omit<User, 'id'>): void {
    try {
      if (typeof age !== 'number') {
        throw new Error('The age field must be a number');
      }
    } catch (error) {
      if (error) {
        throw error;
      }
    }
  }

  /**
   * @description - Checks if the hobbies field is valid
   * @param {Omit<User, 'id'>} user - The user object
   * @returns {void}
   * @memberof Controller
   * @throws {Error} - If the hobbies field is not valid
   * @throws {Error} - If the hobbies field is not an array
   * @throws {Error} - If the hobbies field is not a valid type
   */
  private static checkFieldHobbies({ hobbies }: Omit<User, 'id'>): void {
    try {
      if (
        !Array.isArray(hobbies) ||
        hobbies.length === 0 ||
        Object.values(hobbies).every((hobby) => typeof hobby !== 'string')
      ) {
        throw new Error('The hobby field must be of type array of strings');
      }
    } catch (error) {
      if (error) {
        throw error;
      }
    }
  }
}

export const controller = new Controller();
