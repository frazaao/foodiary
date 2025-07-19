import z from "zod";
import { Controller } from "../contracts/controller";
import { HttpResponse } from "../http/http-response";
import { db } from "../db";
import { and, eq, gte, lte } from "drizzle-orm";
import { mealsTable } from "../db/schema";
import { ProtectedHttpRequest } from "../http/protected-http-request";

const schema = z.object({
  date: z.iso.date().transform((dateStr) => new Date(dateStr)),
});

export class ListMealsController extends Controller {
  async handle(request: ProtectedHttpRequest): Promise<HttpResponse> {
    const { success, error, data } = schema.safeParse(request.params);

    if (!success) return HttpResponse.badRequest({ errors: error.issues });

    const endDate = new Date(data.date);
    endDate.setUTCHours(23, 59, 59);

    const meals = await db.query.mealsTable.findMany({
      columns: {
        id: true,
        foods: true,
        createdAt: true,
        icon: true,
        name: true,
      },
      where: and(
        eq(mealsTable.userId, request.userId),
        gte(mealsTable.createdAt, data!.date),
        lte(mealsTable.createdAt, endDate),
        eq(mealsTable.status, "success")
      ),
    });

    return HttpResponse.ok({ meals });
  }
}

export const listMealsController = new ListMealsController();
