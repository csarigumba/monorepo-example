#### 1. **Overview**

This document outlines the necessary AWS services and infrastructure components required for building a cloud-native application where an actor (user) interacts with an API Gateway (API GW), triggering AWS Lambda functions that interact with Amazon DynamoDB.

---

#### 2. **Architecture Components**

1. **API Gateway (APIGW)**
   - **Purpose**: Acts as the entry point for external requests.
   - **Requirement**:
     - Configure API Gateway with RESTful API endpoints.
     - Enable integration with AWS Lambda to forward requests.

2. **AWS Lambda**
   - **Purpose**: Handles business logic execution when triggered by API Gateway requests.

3. **DynamoDB**
   - **Purpose**: NoSQL database to store and retrieve data.
