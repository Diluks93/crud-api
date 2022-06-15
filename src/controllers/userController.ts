import { IncomingMessage, ServerResponse } from 'http';
import { model } from '../models/userModel.js';

const { findAll, findById } = model;

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
      res.end(
        JSON.stringify({ message: 'Something went wrong on the server' })
      );
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
  async getUser(
    req: IncomingMessage,
    res: ServerResponse,
    id: string
  ): Promise<void> {
    try {
      const user = await findById(id);

      if (!user) {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'User not found' }));
      } else {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(user));
      }
    } catch (error) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(
        JSON.stringify({ message: 'Something went wrong on the server' })
      );
    }
  }
}

export const controller = new Controller();
