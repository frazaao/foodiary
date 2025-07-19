import z from "zod";
import { Controller } from "../contracts/controller";
import { HttpResponse } from "../http/http-response";
import { ProtectedHttpRequest } from "../http/protected-http-request";
import { db } from "../db";
import { and, eq } from "drizzle-orm";
import { mealsTable } from "../db/schema";

const schema = z.object({
  mealId: z.string(),
});

export class GetMealByIdController extends Controller {
  async handle(request: ProtectedHttpRequest): Promise<HttpResponse> {
    const { data } = schema.safeParse(request.queryParams);

    const meal = await db.query.mealsTable.findFirst({
      columns: {
        id: true,
        foods: true,
        createdAt: true,
        icon: true,
        name: true,
      },
      where: and(
        eq(mealsTable.id, data!.mealId),
        eq(mealsTable.userId, request.userId)
      ),
    });

    return HttpResponse.ok({ meal });
  }
}

export const getMealByIdController = new GetMealByIdController();
