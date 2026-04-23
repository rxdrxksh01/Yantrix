export class AppResponse {
  public readonly statusCode: number;
  public readonly data: object | null;
  public readonly message: string;
  public readonly success: boolean;
  constructor(statusCode: number, data: object | null, message = "Success") {
    ((this.statusCode = statusCode),
      (this.data = data),
      (this.message = message),
      (this.success = statusCode < 400));
  }
}
