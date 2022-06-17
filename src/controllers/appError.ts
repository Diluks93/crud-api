export class AppError extends Error {
  public message: string;
  public name = 'AppError';

  constructor(message: string) {
    super();
    this.message = message || 'Something went wrong';
  }
}
