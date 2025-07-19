import { APIGatewayProxyEventV2 } from "aws-lambda";
import { signUpController } from "../controllers/sign-up-controller";
import { HttpEventMapper } from "../mappers/http-event-mapper";

export const handler = async (event: APIGatewayProxyEventV2) => {
  const response = await signUpController.handle(
    HttpEventMapper.eventToRequest(event)
  );

  return HttpEventMapper.responseToEvent(response);
};
