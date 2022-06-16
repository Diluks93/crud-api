import { v4, validate } from 'uuid';

import { User } from '../types/interfaces';

class Model {
  /**
   * @description {db} - The in-memory database
   * @type {User[]}
   */
  static #db: User[] = [];
  /**
   * @description - Gets all users
   * @returns {User[]} - The users
   */
  findAll: () => Promise<User[]> = (): Promise<User[]> => {
    return new Promise((resolve) => {
      resolve(Model.#db);
    });
  };

  /**
   * @description - Gets a user by id
   * @param {string} id - The user id
   * @returns {User | undefined} - The user
   * @throws {Error} - If the user id is not a valid string
   * @throws {Error} - If the user id is not found
   */
  findById = (id: string): Promise<User | undefined> => {
    return new Promise((resolve) => {
      if (validate(id)) {
        const user = Model.#db.find((user) => user.id === id);
        resolve(user);
      } else {
        throw new Error('Invalid user id');
      }
    });
  };

  create(user: Omit<User, 'id'>): Promise<User> {
    return new Promise((resolve) => {
      const newUser = { id: v4(), ...user };
      Model.#db.push(newUser);
      resolve(newUser);
    });
  }
}

export const model = new Model();
