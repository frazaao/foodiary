import { Controller } from "../contracts/controller";
import { JsonResponse } from "../http/json-response";
import { HttpRequest, HttpResponse } from "../types/http";

export class SignInController extends Controller {
  async handle(request: HttpRequest): Promise<HttpResponse> {
    return JsonResponse.ok({ accessToken: "accessToken" });
  }
}

export const signInController = new SignInController();
