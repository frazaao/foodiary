import z from "zod";
import { Controller } from "../contracts/controller";
import { HttpRequest } from "../http/http-request";
import { HttpResponse } from "../http/http-response";
import { db } from "../db";
import { eq } from "drizzle-orm";
import { usersTable } from "../db/schema";

const schema = z.object({
  goal: z.enum(["lose", "maintain", "gain"]),
  gender: z.enum(["male", "female"]),
  birthDate: z.iso.date(),
  height: z.number(),
  weight: z.number(),
  activityLevel: z.number().min(1).max(5),
  name: z.string().min(1),
  email: z.email(),
  password: z.string().min(8),
});

export class SignUpController extends Controller {
  async handle(request: HttpRequest): Promise<HttpResponse> {
    const { success, error, data } = schema.safeParse(request.body);

    if (!success) return HttpResponse.badRequest({ errors: error.issues });

    const userAlreadyExists = await db.query.usersTable.findFirst({
      columns: {
        email: true,
      },
      where: eq(usersTable.email, data.email),
    });

    if (userAlreadyExists)
      return HttpResponse.unprocessableEntity({
        error: "This email is already in use.",
      });

    const [user] = await db
      .insert(usersTable)
      .values({
        ...data,
        callories: 0,
        carbohydrates: 0,
        fats: 0,
        proteins: 0,
      })
      .returning({ id: usersTable.id });

    return HttpResponse.created({
      userId: user.id,
    });
  }
}

export const signUpController = new SignUpController();
