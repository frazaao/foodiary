import z from "zod";
import { Controller } from "../contracts/controller";
import { HttpRequest } from "../http/http-request";
import { HttpResponse } from "../http/http-response";
import { db } from "../db";
import { eq } from "drizzle-orm";
import { usersTable } from "../db/schema";
import { hashEncryptor } from "../utils/hash-encryptor";
import { goalCalculator } from "../services/goal-calculator";
import { jwtEncryptor } from "../utils/jwt-encryptor";

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

    const hashedPassword = await hashEncryptor.hash(data.password);

    const goals = goalCalculator.calculateGoals({
      activityLevel: data.activityLevel,
      birthDate: new Date(data.birthDate),
      gender: data.gender,
      goal: data.goal,
      height: data.height,
      weight: data.weight,
    });

    const [user] = await db
      .insert(usersTable)
      .values({
        ...data,
        ...goals,
        password: hashedPassword,
      })
      .returning({ id: usersTable.id });

    const accessToken = jwtEncryptor.sign({ sub: user.id });

    return HttpResponse.created({
      accessToken,
    });
  }
}

export const signUpController = new SignUpController();
