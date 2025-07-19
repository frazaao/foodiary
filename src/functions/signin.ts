import { signInController } from "../controllers/sign-in-controller";
import { APIGatewayProxyEventV2 } from "aws-lambda";
import { HttpEventMapper } from "../mappers/http-event-mapper";

export const handler = async (event: APIGatewayProxyEventV2) => {
  const response = await signInController.handle(
    HttpEventMapper.eventToRequest(event)
  );
  return HttpEventMapper.responseToEvent(response);
};
