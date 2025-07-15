import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, GetCommand, PutCommand, UpdateCommand, DeleteCommand, ScanCommand } from '@aws-sdk/lib-dynamodb';
import { v4 as uuidv4 } from 'uuid';
import { logger } from '@company/logger';
import { User, CreateUserRequest, UpdateUserRequest } from '@company/types';

export class UserService {
  private dynamoDb: DynamoDBDocumentClient;
  private tableName: string;

  constructor() {
    const client = new DynamoDBClient({
      region: process.env.AWS_REGION || 'us-east-1',
    });
    this.dynamoDb = DynamoDBDocumentClient.from(client);
    this.tableName = process.env.USERS_TABLE || 'users';
  }

  async createUser(userData: CreateUserRequest): Promise<User> {
    const user: User = {
      id: uuidv4(),
      email: userData.email,
      name: userData.name,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const command = new PutCommand({
      TableName: this.tableName,
      Item: user,
      ConditionExpression: 'attribute_not_exists(id)',
    });

    try {
      await this.dynamoDb.send(command);
      logger.info('User created successfully', { userId: user.id });
      return user;
    } catch (error) {
      logger.error('Error creating user', { error });
      throw new Error('Failed to create user');
    }
  }

  async getUser(userId: string): Promise<User | null> {
    const command = new GetCommand({
      TableName: this.tableName,
      Key: { id: userId },
    });

    try {
      const result = await this.dynamoDb.send(command);
      return result.Item as User || null;
    } catch (error) {
      logger.error('Error getting user', { userId, error });
      throw new Error('Failed to get user');
    }
  }

  async getAllUsers(): Promise<User[]> {
    const command = new ScanCommand({
      TableName: this.tableName,
    });

    try {
      const result = await this.dynamoDb.send(command);
      return result.Items as User[] || [];
    } catch (error) {
      logger.error('Error getting all users', { error });
      throw new Error('Failed to get users');
    }
  }

  async updateUser(userId: string, userData: UpdateUserRequest): Promise<User> {
    const updateExpression = [];
    const expressionAttributeNames: Record<string, string> = {};
    const expressionAttributeValues: Record<string, any> = {};

    if (userData.name) {
      updateExpression.push('#name = :name');
      expressionAttributeNames['#name'] = 'name';
      expressionAttributeValues[':name'] = userData.name;
    }

    if (userData.email) {
      updateExpression.push('#email = :email');
      expressionAttributeNames['#email'] = 'email';
      expressionAttributeValues[':email'] = userData.email;
    }

    updateExpression.push('#updatedAt = :updatedAt');
    expressionAttributeNames['#updatedAt'] = 'updatedAt';
    expressionAttributeValues[':updatedAt'] = new Date().toISOString();

    const command = new UpdateCommand({
      TableName: this.tableName,
      Key: { id: userId },
      UpdateExpression: `SET ${updateExpression.join(', ')}`,
      ExpressionAttributeNames: expressionAttributeNames,
      ExpressionAttributeValues: expressionAttributeValues,
      ReturnValues: 'ALL_NEW',
    });

    try {
      const result = await this.dynamoDb.send(command);
      logger.info('User updated successfully', { userId });
      return result.Attributes as User;
    } catch (error) {
      logger.error('Error updating user', { userId, error });
      throw new Error('Failed to update user');
    }
  }

  async deleteUser(userId: string): Promise<void> {
    const command = new DeleteCommand({
      TableName: this.tableName,
      Key: { id: userId },
    });

    try {
      await this.dynamoDb.send(command);
      logger.info('User deleted successfully', { userId });
    } catch (error) {
      logger.error('Error deleting user', { userId, error });
      throw new Error('Failed to delete user');
    }
  }
}