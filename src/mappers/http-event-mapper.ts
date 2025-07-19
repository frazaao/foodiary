import { APIGatewayProxyEventV2 } from "aws-lambda";
import { HttpRequest, HttpResponse } from "../types/http";

export class HttpEventMapper {
  static eventToRequest(event: APIGatewayProxyEventV2): HttpRequest {
    const body = JSON.parse(event.body ?? "{}");
    const params = event.pathParameters ?? {};
    const queryParams = event.queryStringParameters ?? {};

    return {
      body,
      params,
      queryParams,
    };
  }

  static responseToEvent({ statusCode, body }: HttpResponse) {
    return {
      statusCode,
      body: body ? JSON.stringify(body) : undefined,
    };
  }
}
