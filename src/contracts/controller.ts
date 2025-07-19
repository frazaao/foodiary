import { HttpRequest, HttpResponse } from "../types/http";

export abstract class Controller {
  abstract handle(request: HttpRequest): Promise<HttpResponse>;
}
