import { APIGatewayProxyEventV2 } from "aws-lambda";
import { ProtectedHttpRequest } from "../http/protected-http-request";
import { getMealByIdController } from "../controllers/get-meal-by-id-controller";

export const handler = async (event: APIGatewayProxyEventV2) => {
  const response = await getMealByIdController.handle(
    ProtectedHttpRequest.fromEvent(event)
  );
  return response.toLambda();
};
