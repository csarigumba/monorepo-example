const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient, GetCommand, PutCommand, UpdateCommand, DeleteCommand, ScanCommand } = require('@aws-sdk/lib-dynamodb');
const { v4: uuidv4 } = require('uuid');
const { logger } = require('@company/logger');

class UserService {
  constructor() {
    const client = new DynamoDBClient({
      region: process.env.AWS_REGION || 'us-east-1',
    });
    this.dynamoDb = DynamoDBDocumentClient.from(client);
    this.tableName = process.env.USERS_TABLE || 'users';
  }

  async createUser(userData) {
    const user = {
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

  async getUser(userId) {
    const command = new GetCommand({
      TableName: this.tableName,
      Key: { id: userId },
    });

    try {
      const result = await this.dynamoDb.send(command);
      return result.Item || null;
    } catch (error) {
      logger.error('Error getting user', { userId, error });
      throw new Error('Failed to get user');
    }
  }

  async getAllUsers() {
    const command = new ScanCommand({
      TableName: this.tableName,
    });

    try {
      const result = await this.dynamoDb.send(command);
      return result.Items || [];
    } catch (error) {
      logger.error('Error getting all users', { error });
      throw new Error('Failed to get users');
    }
  }

  async updateUser(userId, userData) {
    const updateExpression = [];
    const expressionAttributeNames = {};
    const expressionAttributeValues = {};

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
      return result.Attributes;
    } catch (error) {
      logger.error('Error updating user', { userId, error });
      throw new Error('Failed to update user');
    }
  }

  async deleteUser(userId) {
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

module.exports = { UserService };
