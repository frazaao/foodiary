import { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from "aws-lambda";
import { ProtectedHttpRequest } from "../http/protected-http-request";
import { createMealController } from "../controllers/create-meal-controller";

export const handler = async (event: APIGatewayProxyEventV2) => {
  try {
    const response = await createMealController.handle(
      ProtectedHttpRequest.fromEvent(event)
    );
    return response.toLambda();
  } catch (error) {
    if (error instanceof Error)
      return {
        statusCode: 400,
        body: JSON.stringify({ error: error.message }),
      };
  }
};
