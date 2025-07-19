import { Controller } from "../contracts/controller";
import { JsonResponse } from "../http/json-response";
import { HttpRequest, HttpResponse } from "../types/http";

export class SignUpController extends Controller {
  async handle(request: HttpRequest): Promise<HttpResponse> {
    return JsonResponse.created();
  }
}

export const signUpController = new SignUpController();
