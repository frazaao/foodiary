import { signInController } from "../controllers/sign-in-controller";
import { APIGatewayProxyEventV2 } from "aws-lambda";
import { HttpRequest } from "../http/http-request";

export const handler = async (event: APIGatewayProxyEventV2) => {
  const response = await signInController.handle(HttpRequest.fromEvent(event));
  return response.toLambda();
};
