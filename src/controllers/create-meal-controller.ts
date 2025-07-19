import z from "zod";
import { Controller } from "../contracts/controller";
import { HttpResponse } from "../http/http-response";
import { ProtectedHttpRequest } from "../http/protected-http-request";
import { db } from "../db";
import { mealsTable } from "../db/schema";

const schema = z.object({
  fileType: z.enum(["audio/m4a", "image/jpeg"]),
});

export class CreateMealController extends Controller {
  async handle(request: ProtectedHttpRequest): Promise<HttpResponse> {
    const { success, error, data } = schema.safeParse(request.body);

    if (!success) return HttpResponse.badRequest({ errors: error.issues });

    const [meal] = await db
      .insert(mealsTable)
      .values({
        userId: request.userId,
        inputFileKey: "input_file_key",
        inputType: data?.fileType === "audio/m4a" ? "audio" : "picture",
        status: "uploading",

        icon: "",
        name: "",
        foods: "",
      })
      .returning({ id: mealsTable.id });

    return HttpResponse.created({ mealId: meal.id });
  }
}

export const createMealController = new CreateMealController();
