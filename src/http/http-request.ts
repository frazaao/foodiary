import { APIGatewayProxyEventV2 } from "aws-lambda";

export class HttpRequest {
  constructor(
    public readonly body: Record<string, any>,
    public readonly queryParams: Record<string, any>,
    public readonly params: Record<string, any>
  ) {}

  static fromEvent(event: APIGatewayProxyEventV2): HttpRequest {
    const body = JSON.parse(event.body ?? "{}");
    const params = event.pathParameters ?? {};
    const queryParams = event.queryStringParameters ?? {};
    return new HttpRequest(body, params, queryParams);
  }
}
