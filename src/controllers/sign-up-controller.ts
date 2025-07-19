import z from "zod";
import { Controller } from "../contracts/controller";
import { HttpRequest } from "../http/http-request";
import { HttpResponse } from "../http/http-response";

const schema = z.object({
  goal: z.enum(["lose", "maintain", "gain"]),
  gender: z.enum(["male", "female"]),
  birthDate: z.iso.date(),
  height: z.number(),
  weight: z.number(),
  activityLevel: z.number().min(1).max(5),
  account: z.object({
    name: z.string().min(1),
    email: z.email(),
    password: z.string().min(8),
  }),
});

export class SignUpController extends Controller {
  async handle(request: HttpRequest): Promise<HttpResponse> {
    const { success, error, data } = schema.safeParse(request.body);

    if (!success) return HttpResponse.badRequest({ errors: error.issues });

    return HttpResponse.created({
      data,
    });
  }
}

export const signUpController = new SignUpController();
