import z from "zod";
import { Controller } from "../contracts/controller";
import { HttpRequest } from "../http/http-request";
import { HttpResponse } from "../http/http-response";
import { db } from "../db";
import { eq } from "drizzle-orm";
import { mealsTable } from "../db/schema";

const schema = z.object({
  fileKey: z.string(),
});

export class ProcessMealController extends Controller {
  async handle(request: HttpRequest): Promise<HttpResponse> {
    const { success, error, data } = schema.safeParse(request.body);

    if (!success) return HttpResponse.badRequest({ errors: error.issues });

    const meal = await db.query.mealsTable.findFirst({
      where: eq(mealsTable.inputFileKey, data.fileKey),
    });

    if (!meal) return HttpResponse.badRequest({ errors: "Meal not found" });

    if (meal.status === "failed" || meal.status === "success")
      return HttpResponse.ok();

    await db
      .update(mealsTable)
      .set({ status: "processing" })
      .where(eq(mealsTable.id, meal.id));

    try {
      // Call AI

      await db
        .update(mealsTable)
        .set({
          status: "success",
          name: "Café da manhã",
          icon: "",
          foods: [
            {
              name: "Pão",
              quantity: "2 fatias",
              callories: 100,
              proteins: 200,
              carbohydrates: 100,
              fats: 10,
            },
          ],
        })
        .where(eq(mealsTable.id, meal.id));

      return HttpResponse.ok();
    } catch {
      await db
        .update(mealsTable)
        .set({ status: "failed" })
        .where(eq(mealsTable.id, meal.id));

      return HttpResponse.badRequest({ error: "Could not process meal" });
    }
  }
}

export const processMealController = new ProcessMealController();
