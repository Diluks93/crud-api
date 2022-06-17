import { IncomingMessage, ServerResponse } from 'http';
import { model } from '../models/userModel';
import { User } from '../types/interfaces';
import { AppError } from './appError';

const { findAll, findById, create, update, remove } = model;

class Controller {
  /**
   * @description - Gets all users
   * @route GET /api/users
   * @param {ServerResponse} res - The response object
   * @returns {void}
   * @memberof Controller
   */
  async getUsers(res: ServerResponse): Promise<void> {
    try {
      const users = await findAll();
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(users));
    } catch (error) {
      Controller.handlerError(error as AppError, res);
    }
  }

  /**
   * @description - Gets a user by id
   * @route GET /api/users/:id
   * @param {ServerResponse} res - The response object
   * @param {string} id - The user id
   * @returns {void}
   * @memberof Controller
   * @throws {AppError} - If the user id is not a valid string
   * @throws {AppError} - If the user id is not found
   */
  async getUser(res: ServerResponse, id: string): Promise<void> {
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
      Controller.handlerError(error as AppError, res);
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
      Controller.handlerError(error as AppError, res);
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
        res.end(JSON.stringify(userData));
      }
    } catch (error) {
      Controller.handlerError(error as AppError, res);
    }
  }

  /**
   * @description - Remove a user by id
   * @route DELETE /api/users/:id
   * @param {ServerResponse} res - The response object
   * @param {string} id - The user id
   * @returns {void}
   * @memberof Controller
   * @throws {Error} - If the user id is not a valid string
   * @throws {Error} - If the user id is not found
   */
  async removeUser(res: ServerResponse, id: string): Promise<void> {
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
      Controller.handlerError(error as AppError, res);
    }
  }

  private static handlerError({ name, message }: AppError, res: ServerResponse): void {
    if (name === 'AppError') {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ message: message }));
    } else {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ message: 'Something went wrong on the server' }));
    }
  }

  private static getPostData = (
    req: IncomingMessage,
    res: ServerResponse,
    isMethodPOST = true,
  ): Promise<Omit<User, 'id'> | undefined> => {
    return new Promise((resolve) => {
      try {
        let body = '';
        req
          .on('data', (chunk) => {
            body += chunk.toString();
          })
          .on('end', () => {
            if (isMethodPOST) resolve(Controller.checkRequiredFields(body, res));
            else {
              try {
                const data = JSON.parse(body);
                resolve(data);
              } catch (error) {
                Controller.handlerError(error as AppError, res);
              }
            }
          });
      } catch (error) {
        Controller.handlerError(error as AppError, res);
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
        throw new AppError('Missing required fields');
      } else if (len > 3) {
        throw new AppError('Too many fields');
      } else {
        Controller.checkKeysUser(user);
        return user;
      }
    } catch (error) {
      Controller.handlerError(error as AppError, res);
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
          throw new AppError(`Missing required field ${keys[i]}`);
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
    if (!username) {
      return;
    }
    try {
      if (typeof username !== 'string') {
        throw new AppError('The username field must be a string');
      } else if (username.length > 33) {
        throw new AppError('The username field must be less than 32 characters');
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
    if (!age) {
      return;
    }
    try {
      if (typeof age !== 'number') {
        throw new AppError('The age field must be a number and less than 150');
      } else if (age > 150) {
        throw new AppError('The age field must be less than 150');
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
    if (!hobbies) {
      return;
    }
    const len = hobbies.length;
    const isHobbiesOfTypeString = Controller.isArrayOfTypeString(Object.values(hobbies));
    try {
      if (!Array.isArray(hobbies)) {
        throw new AppError('The hobby field must be of type array of strings ore empty');
      } else if (len !== 0 && isHobbiesOfTypeString) {
        throw new AppError('The hobby field must be of type array of strings ore empty');
      }
    } catch (error) {
      if (error) {
        throw error;
      }
    }
  }

  private static isArrayOfTypeString(array: string[]): boolean {
    return array.every((el) => typeof el !== 'string');
  }
}

export const controller = new Controller();
