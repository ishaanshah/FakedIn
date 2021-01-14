export default class APIError extends Error {
  public statusCode?: number;

  constructor(message: string) {
    super(message);
    this.name = "APIError";
  }
}
