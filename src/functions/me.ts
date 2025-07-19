import { signInController } from "../controllers/sign-in-controller";
import { APIGatewayProxyEventV2 } from "aws-lambda";
import { HttpRequest } from "../http/http-request";
import { ProtectedHttpRequest } from "../http/protected-http-request";
import { meController } from "../controllers/me-controller";

export const handler = async (event: APIGatewayProxyEventV2) => {
  try {
    const response = await meController.handle(
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
