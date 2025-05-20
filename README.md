# GraphQL Prefix Transformer

A functional programming utility that adds a prefix to all entity names in a GraphQL schema.

## Features

- Adds a prefix to all GraphQL entity names (types, interfaces, enums, unions, inputs, scalars)
- Preserves reserved GraphQL types (Query, Mutation, built-in scalars, introspection types)
- Ensures consistent renaming throughout the schema
- Handles references correctly
- Works with stdin/stdout for easy pipeline integration

## Installation

```bash
# Install from npm
npm install -g graphql-prefix-transformer

# Or run directly with npx
npx graphql-prefix-transformer --prefix YourPrefix < schema.graphql
```

## Usage

```bash
# Basic usage
cat schema.graphql | npx graphql-prefix-transformer --prefix Shopify > prefixed-schema.graphql

# Using with a file
npx graphql-prefix-transformer --prefix Shopify < schema.graphql > prefixed-schema.graphql
```

## Example

Input schema:
```graphql
type Order {
  id: ID!
  items: [OrderItem!]!
  customer: Customer
}

type Customer {
  id: ID!
  name: String!
}
```

Output with `--prefix Shopify`:
```graphql
type ShopifyOrder {
  id: ID!
  items: [ShopifyOrderItem!]!
  customer: ShopifyCustomer
}

type ShopifyCustomer {
  id: ID!
  name: String!
}
```

## Publishing to npm

This package is configured to automatically publish to npm when you create a GitHub release:

1. Set up your GitHub repository with the code
2. Add your NPM_TOKEN to GitHub repository secrets
3. Create a new release in GitHub
4. The GitHub Action will automatically publish to npm

Once published, users can run it with `npx` without installing:

```bash
npx graphql-prefix-transformer --prefix YourPrefix < schema.graphql
```

## Development

```bash
# Clone the repository
git clone <repository-url>
cd graphql-prefix-transformer

# Install dependencies
npm install

# Run tests
npm test
```

## Implementation Details

This tool uses:
- `graphql` - The official GraphQL.js library for parsing and printing schemas
- Functional programming principles with pure functions and immutability
- AST transformation to ensure correct and consistent renaming

## License

ISC
