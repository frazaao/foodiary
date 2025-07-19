export class HttpResponse {
  constructor(
    public readonly statusCode: number,
    public readonly body?: Record<string, any>,
    public readonly headers?: Record<string, any>
  ) {}

  toLambda() {
    return {
      statusCode: this.statusCode,
      body: this.body ? JSON.stringify(this.body) : undefined,
      headers: {
        ...this.headers,
        "Content-Type": "application/json",
      },
    };
  }

  isSuccess(): boolean {
    if (this.statusCode >= 200 && this.statusCode <= 299) return true;
    return false;
  }

  static ok(body?: Record<string, any>): HttpResponse {
    return new HttpResponse(200, body);
  }

  static created(body?: Record<string, any>): HttpResponse {
    return new HttpResponse(201, body);
  }

  static badRequest(body?: Record<string, any>): HttpResponse {
    return new HttpResponse(400, body);
  }

  static unauthorized(body?: Record<string, any>): HttpResponse {
    return new HttpResponse(401, body);
  }

  static unprocessableEntity(body?: Record<string, any>): HttpResponse {
    return new HttpResponse(422, body);
  }

  static conflict(body?: Record<string, any>): HttpResponse {
    return new HttpResponse(409, body);
  }
}
