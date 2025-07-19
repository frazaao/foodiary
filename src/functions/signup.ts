import { APIGatewayProxyEventV2 } from "aws-lambda";
import { signUpController } from "../controllers/sign-up-controller";
import { HttpRequest } from "../http/http-request";

export const handler = async (event: APIGatewayProxyEventV2) => {
  const response = await signUpController.handle(HttpRequest.fromEvent(event));
  return response.toLambda();
};
