import { User } from '../types/interfaces';

class Model {
  /**
   * @description {db} - The in-memory database
   * @type {User[]}
   */
  #db: User[] = [];

  /**
   * @description - Gets all users
   * @returns {User[]} - The users
   */
  findAll: () => Promise<User[]> = (): Promise<User[]> => {
    return new Promise((resolve) => {
      resolve(this.#db);
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
      const user = this.#db.find((user) => user.id === id);
      resolve(user);
    });
  };
}

export const model = new Model();
