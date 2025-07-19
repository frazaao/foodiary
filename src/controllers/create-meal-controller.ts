import z from "zod";
import { Controller } from "../contracts/controller";
import { HttpResponse } from "../http/http-response";
import { ProtectedHttpRequest } from "../http/protected-http-request";
import { db } from "../db";
import { mealsTable } from "../db/schema";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { randomUUID } from "crypto";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { s3Client } from "../services/s3-client";

const schema = z.object({
  fileType: z.enum(["audio/m4a", "image/jpeg"]),
});

export class CreateMealController extends Controller {
  async handle(request: ProtectedHttpRequest): Promise<HttpResponse> {
    const { success, error, data } = schema.safeParse(request.body);

    if (!success) return HttpResponse.badRequest({ errors: error.issues });

    const fileId = randomUUID();
    const fileExt = data.fileType === "audio/m4a" ? "m4a" : "jpg";
    const fileKey = `${fileId}.${fileExt}`;

    const command = new PutObjectCommand({
      Bucket: process.env.BUCKET_NAME,
      Key: fileKey,
    });

    const presignedUrl = await getSignedUrl(s3Client, command, {
      expiresIn: 600,
    });

    const [meal] = await db
      .insert(mealsTable)
      .values({
        userId: request.userId,
        inputFileKey: fileKey,
        inputType: data?.fileType === "audio/m4a" ? "audio" : "picture",
        status: "uploading",

        icon: "",
        name: "",
        foods: "",
      })
      .returning({ id: mealsTable.id });

    return HttpResponse.created({ mealId: meal.id, uploadUrl: presignedUrl });
  }
}

export const createMealController = new CreateMealController();
