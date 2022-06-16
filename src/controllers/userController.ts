import { IncomingMessage, ServerResponse } from 'http';
import { model } from '../models/userModel';
import { User } from '../types/interfaces';

const { findAll, findById, create } = model;

class Controller {
  /**
   * @description - Gets all users
   * @route GET /api/users
   * @param {IncomingMessage} req - The request object
   * @param {ServerResponse} res - The response object
   * @returns {void}
   */
  async getUsers(req: IncomingMessage, res: ServerResponse): Promise<void> {
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
   * @param {IncomingMessage} req - The request object
   * @param {ServerResponse} res - The response object
   * @param {string} id - The user id
   * @returns {void}
   * @memberof Controller
   * @throws {Error} - If the user id is not a valid string
   * @throws {Error} - If the user id is not found
   */
  async getUser(req: IncomingMessage, res: ServerResponse, id: string): Promise<void> {
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
      let body = '';
      req.on('data', (chunk) => {
        body += chunk.toString();
        Controller.checkRequiredFields(body, res);
      });
      req.on('end', async () => {
        const { username, age, hobbies }: Omit<User, 'id'> = JSON.parse(body);
        const user: Omit<User, 'id'> = {
          username,
          age,
          hobbies,
        };
        await create(user);
        res.writeHead(201, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'User created' }));
      });
    } catch (error) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ message: 'Something went wrong on the server' }));
    }
  }

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
  private static checkRequiredFields(body: string, res: ServerResponse): void {
    const user: Omit<User, 'id'> = JSON.parse(body);
    switch (Object.keys(user).length) {
      case 0:
      case 1:
      case 2:
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Missing required fields' }));
        break;
      case 3:
        Controller.checkKeysUser(user, res);
        break;
      default:
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Too many fields' }));
    }
  }

  /**
   * @description - Checks if the keys of the user are valid
   * @param {Omit<User, 'id'>} user - The user object
   * @param {ServerResponse} res - The response object
   * @returns {void}
   * @memberof Controller
   * @throws {Error} - If the keys of the user are not valid
   * @throws {Error} - If the keys of the user are not a valid types
   */
  private static checkKeysUser(user: Omit<User, 'id'>, res: ServerResponse): void {
    const keys = ['username', 'age', 'hobbies'];
    for (let i = 0; i < keys.length; i++) {
      if (!keys.includes(Object.keys(user)[i])) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: `Missing required field ${keys[i]}` }));
        return;
      }
    }
    Controller.checkFieldUsername(user, res);
    Controller.checkFieldAge(user, res);
    Controller.checkFieldHobbies(user, res);
  }

  /**
   * @description - Checks if the username field is valid
   * @param {Omit<User, 'id'>} user - The user object
   * @param {ServerResponse} res - The response object
   * @returns {void}
   * @memberof Controller
   * @throws {Error} - If the username field is not valid
   */
  private static checkFieldUsername({ username }: Omit<User, 'id'>, res: ServerResponse): void {
    if (typeof username !== 'string') {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ message: 'The username field must be a string' }));
    }
  }

  /**
   * @description - Checks if the age field is valid
   * @param {Omit<User, 'id'>} user - The user object
   * @param {ServerResponse} res - The response object
   * @returns {void}
   * @memberof Controller
   * @throws {Error} - If the age field is not valid
   */
  private static checkFieldAge({ age }: Omit<User, 'id'>, res: ServerResponse): void {
    if (typeof age !== 'number') {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ message: 'The age field must be a number' }));
    }
  }

  /**
   * @description - Checks if the hobbies field is valid
   * @param {Omit<User, 'id'>} user - The user object
   * @param {ServerResponse} res - The response object
   * @returns {void}
   * @memberof Controller
   * @throws {Error} - If the hobbies field is not valid
   * @throws {Error} - If the hobbies field is not an array
   * @throws {Error} - If the hobbies field is not a valid type
   */
  private static checkFieldHobbies({ hobbies }: Omit<User, 'id'>, res: ServerResponse): void {
    if (
      !Array.isArray(hobbies) ||
      hobbies.length === 0 ||
      Object.values(hobbies).every((hobby) => typeof hobby !== 'string')
    ) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ message: 'The hobby field must be of type array of strings' }));
    }
  }
}

export const controller = new Controller();
