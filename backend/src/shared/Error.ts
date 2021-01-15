export default class APIError extends Error {
  public status?: number;

  constructor(message: string) {
    super(message);
    this.name = "APIError";
  }
}
