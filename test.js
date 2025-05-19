const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Create a test directory
const testDir = path.join(__dirname, 'test');
if (!fs.existsSync(testDir)) {
  fs.mkdirSync(testDir);
}

// Test schema
const testSchema = `
type Query {
  getOrder(id: ID!): Order
  getCustomer(id: ID!): Customer
}

type Order {
  id: ID!
  orderNumber: String!
  customer: Customer!
  items: [OrderItem!]!
  totalAmount: Float!
  status: OrderStatus!
  createdAt: String!
}

type Customer {
  id: ID!
  name: String!
  email: String!
  orders: [Order!]!
}

type OrderItem {
  id: ID!
  product: Product!
  quantity: Int!
  price: Float!
}

type Product {
  id: ID!
  name: String!
  description: String
  price: Float!
}

enum OrderStatus {
  PENDING
  PROCESSING
  SHIPPED
  DELIVERED
  CANCELLED
}

interface Node {
  id: ID!
}

union SearchResult = Order | Product | Customer

input OrderInput {
  customerId: ID!
  items: [OrderItemInput!]!
}

input OrderItemInput {
  productId: ID!
  quantity: Int!
}

scalar DateTime
`;

// Write test schema to file
const schemaPath = path.join(testDir, 'schema.graphql');
fs.writeFileSync(schemaPath, testSchema);

// Run the tests
console.log('Running GraphQL Schema Prefix Transformer tests...');

// Test with prefix "Shopify"
try {
  // Run the transformer
  const transformedSchema = execSync(
    `node ${path.join(__dirname, 'index.js')} --prefix Shopify`,
    { input: testSchema }
  ).toString();
  
  // Verify the transformation
  console.log('\nTest 1: Prefix "Shopify"');
  
  // Check if types are correctly prefixed
  const checks = [
    { original: 'type Order', expected: 'type ShopifyOrder' },
    { original: 'type Customer', expected: 'type ShopifyCustomer' },
    { original: 'type OrderItem', expected: 'type ShopifyOrderItem' },
    { original: 'type Product', expected: 'type ShopifyProduct' },
    { original: 'enum OrderStatus', expected: 'enum ShopifyOrderStatus' },
    { original: 'interface Node', expected: 'interface ShopifyNode' },
    { original: 'union SearchResult', expected: 'union ShopifySearchResult' },
    { original: 'input OrderInput', expected: 'input ShopifyOrderInput' },
    { original: 'input OrderItemInput', expected: 'input ShopifyOrderItemInput' },
    { original: 'scalar DateTime', expected: 'scalar ShopifyDateTime' }
  ];
  
  let allPassed = true;
  
  checks.forEach(({ original, expected }) => {
    if (transformedSchema.includes(expected)) {
      console.log(`✓ "${original}" was correctly transformed to "${expected}"`);
    } else {
      console.log(`✗ "${original}" was NOT correctly transformed to "${expected}"`);
      allPassed = false;
    }
  });
  
  // Check if references are also updated
  const referenceChecks = [
    { original: ': Order', expected: ': ShopifyOrder' },
    { original: ': Customer', expected: ': ShopifyCustomer' },
    { original: ': [Order', expected: ': [ShopifyOrder' },
    { original: ': OrderStatus', expected: ': ShopifyOrderStatus' }
  ];
  
  referenceChecks.forEach(({ original, expected }) => {
    if (transformedSchema.includes(expected)) {
      console.log(`✓ Reference "${original}" was correctly transformed to "${expected}"`);
    } else {
      console.log(`✗ Reference "${original}" was NOT correctly transformed to "${expected}"`);
      allPassed = false;
    }
  });
  
  // Check if reserved types are not prefixed
  const reservedChecks = [
    'type Query',
    'ID!',
    'String!',
    'Int!',
    'Float!'
  ];
  
  reservedChecks.forEach((reserved) => {
    if (transformedSchema.includes(reserved)) {
      console.log(`✓ Reserved type "${reserved}" was correctly NOT prefixed`);
    } else {
      console.log(`✗ Reserved type "${reserved}" was incorrectly prefixed or removed`);
      allPassed = false;
    }
  });
  
  // Test with a different prefix
  console.log('\nTest 2: Prefix "Custom"');
  const customPrefixSchema = execSync(
    `node ${path.join(__dirname, 'index.js')} --prefix Custom`,
    { input: testSchema }
  ).toString();
  
  if (customPrefixSchema.includes('type CustomOrder')) {
    console.log('✓ Prefix "Custom" was correctly applied');
  } else {
    console.log('✗ Prefix "Custom" was NOT correctly applied');
    allPassed = false;
  }
  
  // Final result
  if (allPassed) {
    console.log('\n✅ All tests passed!');
  } else {
    console.log('\n❌ Some tests failed!');
    process.exit(1);
  }
} catch (error) {
  console.error('Test failed with error:', error.message);
  process.exit(1);
}
