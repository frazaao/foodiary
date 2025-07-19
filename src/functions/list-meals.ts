import { APIGatewayProxyEventV2 } from "aws-lambda";
import { ProtectedHttpRequest } from "../http/protected-http-request";
import { listMealsController } from "../controllers/list-meals-controller";

export const handler = async (event: APIGatewayProxyEventV2) => {
  try {
    const response = await listMealsController.handle(
      ProtectedHttpRequest.fromEvent(event)
    );
    return response.toLambda();
  } catch (error) {
    if (error instanceof Error)
      return {
        statusCode: 400,
        error: error.message,
      };
  }
};
