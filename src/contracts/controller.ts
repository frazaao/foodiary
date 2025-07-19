import { HttpRequest } from "../http/http-request";
import { HttpResponse } from "../http/http-response";

export abstract class Controller {
  abstract handle(request: HttpRequest): Promise<HttpResponse>;
}
