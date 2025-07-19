import { HttpResponse as HttpResponseType } from "../types/http";

export class JsonResponse {
  static ok(body: HttpResponseType["body"]): HttpResponseType {
    return {
      statusCode: 200,
      body,
    };
  }

  static created(body?: HttpResponseType["body"]): HttpResponseType {
    return {
      statusCode: 201,
      body,
    };
  }
}
