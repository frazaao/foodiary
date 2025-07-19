export class HttpResponse {
  constructor(
    public readonly statusCode: number,
    public readonly body?: Record<string, any>
  ) {}

  toLambda() {
    return {
      statusCode: this.statusCode,
      body: this.body ? JSON.stringify(this.body) : undefined,
    };
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

  static unprocessableEntity(body?: Record<string, any>): HttpResponse {
    return new HttpResponse(422, body);
  }

  static conflict(body?: Record<string, any>): HttpResponse {
    return new HttpResponse(409, body);
  }
}
