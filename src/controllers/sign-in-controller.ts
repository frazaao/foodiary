import { eq } from "drizzle-orm";
import { Controller } from "../contracts/controller";
import { db } from "../db";
import { HttpRequest } from "../http/http-request";
import { HttpResponse } from "../http/http-response";
import { z } from "zod";

const schema = z.object({
  email: z.email(),
  password: z.string().min(8),
});

export class SignInController extends Controller {
  async handle(request: HttpRequest): Promise<HttpResponse> {
    const { success, error, data } = schema.safeParse(request.body);

    if (!success) return HttpResponse.badRequest({ errors: error.issues });

    return HttpResponse.created({
      data,
    });
  }
}

export const signInController = new SignInController();
