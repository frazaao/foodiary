import { S3Event } from "aws-lambda";
import { sqsClient } from "../services/sqs-client";
import { SendMessageCommand } from "@aws-sdk/client-sqs";

export const handler = async (event: S3Event) => {
  await Promise.all(
    event.Records.map(async (record) => {
      const command = new SendMessageCommand({
        QueueUrl: process.env.MEALS_QUEUE_URL!,
        MessageBody: JSON.stringify({ fileKey: record.s3.object.key }),
      });
      await sqsClient.send(command);
    })
  );
};
