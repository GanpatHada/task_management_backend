export default class ApiResponse {
  statusCode: number;
  data: any;
  message: string;
  success: boolean;
  constructor(statusCode: number, data: any, message: string) {
    this.statusCode = statusCode;
    this.message = message;
    this.success = statusCode < 300;
    this.data = data;
  }
}
