import { eq } from "drizzle-orm";
import { Controller } from "../contracts/controller";
import { db } from "../db";
import { HttpResponse } from "../http/http-response";
import { ProtectedHttpRequest } from "../http/protected-http-request";
import { usersTable } from "../db/schema";

export class MeController extends Controller {
  async handle(request: ProtectedHttpRequest): Promise<HttpResponse> {
    const user = await db.query.usersTable.findFirst({
      where: eq(usersTable.id, request.userId),
    });

    if (!user) return HttpResponse.badRequest({ error: "User not found" });

    return HttpResponse.ok({
      id: user.id,
      email: user.email,
      name: user.name,
      callories: user.callories,
      proteins: user.proteins,
      carbohydrates: user.carbohydrates,
      fats: user.fats,
    });
  }
}

export const meController = new MeController();
