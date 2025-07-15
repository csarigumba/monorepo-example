import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';
import { logger } from '@company/logger';

let dynamoDbClient: DynamoDBDocumentClient;

export const getDynamoDbClient = (): DynamoDBDocumentClient => {
  if (!dynamoDbClient) {
    const client = new DynamoDBClient({
      region: process.env.AWS_REGION || 'us-east-1',
    });
    dynamoDbClient = DynamoDBDocumentClient.from(client);
    logger.info('DynamoDB client initialized');
  }
  return dynamoDbClient;
};

export class BaseRepository<T> {
  protected dynamoDb: DynamoDBDocumentClient;
  protected tableName: string;

  constructor(tableName: string) {
    this.dynamoDb = getDynamoDbClient();
    this.tableName = tableName;
  }

  protected handleError(operation: string, error: any): never {
    logger.error(`Database operation failed: ${operation}`, { error });
    throw new Error(`Database operation failed: ${operation}`);
  }
}

export * from '@aws-sdk/lib-dynamodb';