import { User } from '../types/interfaces.js';

class Model {
  /**
   * @description {db} - The inmemory database
   * @type {User[]}
   */
  #db: User[] = [];

  /**
   * @description - Gets all users
   * @returns {User[]} - The users
   */
  findAll: () => Promise<User[]> = () => {
    return new Promise((resolve) => {
      resolve(this.#db);
    });
  };

  /**
   * @description - Gets a user by id
   * @param {string} id - The user id
   * @returns {User} - The user
   * @throws {Error} - If the user id is not a valid string
   * @throws {Error} - If the user id is not found
   */
  findById = (id: string) => {
    return new Promise((resolve) => {
      const user = this.#db.find((user) => user.id === id);
      resolve(user);
    });
  };
}

export const model = new Model();
