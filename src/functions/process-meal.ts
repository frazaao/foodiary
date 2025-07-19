import { SQSEvent } from "aws-lambda";
import { processMealController } from "../controllers/process-meal-controller";
import { HttpRequest } from "../http/http-request";

export const handler = async (event: SQSEvent) => {
  await Promise.all(
    event.Records.map(async (record) => {
      const body = JSON.parse(record.body);

      const response = await processMealController.handle(
        new HttpRequest({ fileKey: body.fileKey }, {}, {})
      );

      if (response.isSuccess()) return response.toLambda();
      throw new Error(JSON.stringify(response.body));
    })
  );
};
