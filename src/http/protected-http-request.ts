import { APIGatewayProxyEventV2 } from "aws-lambda";
import { HttpRequest } from "./http-request";
import { jwtEncryptor } from "../utils/jwt-encryptor";
import { JwtPayload } from "jsonwebtoken";

export class ProtectedHttpRequest extends HttpRequest {
  constructor(
    body: Record<string, any>,
    queryParams: Record<string, any>,
    params: Record<string, any>,
    public readonly userId: string
  ) {
    super(body, queryParams, params);
  }

  static fromEvent(event: APIGatewayProxyEventV2): ProtectedHttpRequest {
    const body = JSON.parse(event.body ?? "{}");
    const params = event.pathParameters ?? {};
    const queryParams = event.queryStringParameters ?? {};
    const authorization = event.headers.authorization;

    if (!authorization) throw new Error("Access token not provided");

    const [, accessToken] = authorization.split(" ");

    const jwt = jwtEncryptor.verify(accessToken);

    if (!jwt) throw new Error("Invalid access token");

    return new ProtectedHttpRequest(body, params, queryParams, jwt.userId);
  }
}
