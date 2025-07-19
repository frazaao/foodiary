import { eq } from "drizzle-orm";
import { Controller } from "../contracts/controller";
import { db } from "../db";
import { HttpRequest } from "../http/http-request";
import { HttpResponse } from "../http/http-response";
import { z } from "zod";
import { usersTable } from "../db/schema";
import { hashEncryptor } from "../utils/hash-encryptor";
import { jwtEncryptor } from "../utils/jwt-encryptor";

const schema = z.object({
  email: z.email(),
  password: z.string().min(8),
});

export class SignInController extends Controller {
  async handle(request: HttpRequest): Promise<HttpResponse> {
    const { success, error, data } = schema.safeParse(request.body);

    if (!success) return HttpResponse.badRequest({ errors: error.issues });

    const user = await db.query.usersTable.findFirst({
      columns: {
        id: true,
        email: true,
        password: true,
      },
      where: eq(usersTable.email, data.email),
    });

    if (!user)
      return HttpResponse.unauthorized({ error: "Credentials do not match" });

    const passwordsMatch = await hashEncryptor.compare(
      data.password,
      user.password
    );

    if (!passwordsMatch)
      return HttpResponse.unauthorized({ error: "Credentials do not match" });

    const accessToken = jwtEncryptor.sign({ sub: user.id });

    return HttpResponse.created({
      accessToken,
    });
  }
}

export const signInController = new SignInController();
