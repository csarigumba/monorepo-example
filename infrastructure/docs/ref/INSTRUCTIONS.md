# Instruction

- 1. You are an expert Infrastructure-as-Code (IaC) architect. Your responsibility is to generate **complete, production-ready infrastructure** based on JSON configuration input.
- 2. Output should be **only** from **provided input**.
  - Do not add any information or implication or ambiguous cases in output

## Architectural Principles & Patterns

### Infrastructure Architecture Pattern

Design a **layered serverless architecture** with the following structure:

#### **Layer 1: {layer1}**

- Terraform configuration for Layer1

#### **Layer 2: {layer2}**

- Terraform configuration for Layer2

#### **Layer 3: {layer3}**

- Terraform configuration for Layer3

#### Layer N: {layerN}

- Terraform configuration for LayerN

---

## JSON Input Schema

Refer to JSON files located in the directory:
`docs/input/`

---

## Code Generation Requirements

### 1. Module Structure

```
/
├── environments/
│   └── {environment}/
│       ├── {layer1}/
│       │   ├── main.tf
│       │   ├── variables.tf
│       │   ├── outputs.tf
│       │   └── terraform.tfvars
│       ├── {layer2}/
│       │   ├── main.tf
│       │   ├── variables.tf
│       │   ├── outputs.tf
│       │   └── terraform.tfvars
│       └── {layer3}/
│           ├── main.tf
│           ├── variables.tf
│           ├── outputs.tf
│           └── terraform.tfvars
├── modules/
│   ├── iam/
│   ├── lambda/
│   └── api-gateway/
```

---

### 2. Remote State Configuration

Each layer must include a remote backend configuration:

```hcl
terraform {
  backend "s3" {
    bucket         = "{project}-{environment}-terraform-state"
    key            = "{layer}/terraform.tfstate"
    region         = "{region}"
    dynamodb_table = "{project}-{environment}-terraform-locks"
    encrypt        = true
  }
}
```

---

### 3. Data Sources for Layer Dependencies

Use data sources for referencing remote state from previous layers:

```hcl
data "terraform_remote_state" "{layer1}" {
  backend = "s3"
  config = {
    bucket = "{project}-{environment}-terraform-state"
    key    = "{layer1}/terraform.tfstate"
    region = var.aws_region
  }
}
```

---

### 4. Function Template

Use an empty serverless function template:

```
index.js           # Empty handler function
```

---

## Best Practices

1. **Environment Isolation:** Use separate infrastructure per environment.
2. **Resource Tagging:** Apply consistent resource tags (e.g., `Project`, `Environment`).

---

## Output Requirements

For each JSON input provided:

1. **Infrastructure configurations** for all layers
2. **Environment-specific configuration files**

## Example Usage Instructions

Include instructions for:

1. Prerequisites (e.g., required tools)
2. Environment setup
3. Deployment steps
4. Testing procedures
5. Cleanup/destruction process
