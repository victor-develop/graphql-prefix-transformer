#!/usr/bin/env node

/**
 * GraphQL Schema Prefix Transformer
 * 
 * This script takes a GraphQL schema as input, adds a prefix to all entity names,
 * and outputs the transformed schema.
 * 
 * Usage: cat schema.graphql | npx graphql-prefix-transformer --prefix Shopify
 */

const { parse, print } = require('graphql');
const { visit } = require('graphql/language/visitor');
const { getStdin } = require('get-stdin');

// Parse command line arguments
const args = process.argv.slice(2);
let prefix = '';

for (let i = 0; i < args.length; i++) {
  if (args[i] === '--prefix' && i + 1 < args.length) {
    prefix = args[i + 1];
    break;
  }
}

if (!prefix) {
  console.error('Error: Prefix is required. Use --prefix <PREFIX>');
  process.exit(1);
}

/**
 * Adds prefix to type names in the GraphQL schema
 * @param {string} schemaString - The original GraphQL schema
 * @param {string} prefix - The prefix to add to type names
 * @returns {string} - The transformed schema
 */
function addPrefixToSchema(schemaString, prefix) {
  try {
    // Parse the schema into an AST
    const ast = parse(schemaString);
    
    // Names that should not be prefixed
    const reservedNames = new Set([
      'Query', 'Mutation', 'Subscription', 
      'String', 'Int', 'Float', 'Boolean', 'ID',
      '__Schema', '__Type', '__TypeKind', '__Field', 
      '__InputValue', '__EnumValue', '__Directive',
      '__DirectiveLocation'
    ]);
    
    // Track renamed types to ensure consistent renaming
    const renamedTypes = new Map();
    
    // Visit the AST and transform type names
    const transformedAst = visit(ast, {
      // Handle named type references
      NamedType: {
        leave(node) {
          if (!reservedNames.has(node.name.value)) {
            const originalName = node.name.value;
            if (renamedTypes.has(originalName)) {
              return {
                ...node,
                name: {
                  ...node.name,
                  value: renamedTypes.get(originalName)
                }
              };
            }
            
            const newName = `${prefix}${originalName}`;
            renamedTypes.set(originalName, newName);
            
            return {
              ...node,
              name: {
                ...node.name,
                value: newName
              }
            };
          }
        }
      },
      // Handle type definitions
      ObjectTypeDefinition: {
        leave(node) {
          if (!reservedNames.has(node.name.value)) {
            const originalName = node.name.value;
            if (renamedTypes.has(originalName)) {
              return {
                ...node,
                name: {
                  ...node.name,
                  value: renamedTypes.get(originalName)
                }
              };
            }
            
            const newName = `${prefix}${originalName}`;
            renamedTypes.set(originalName, newName);
            
            return {
              ...node,
              name: {
                ...node.name,
                value: newName
              }
            };
          }
        }
      },
      // Handle interface definitions
      InterfaceTypeDefinition: {
        leave(node) {
          if (!reservedNames.has(node.name.value)) {
            const originalName = node.name.value;
            if (renamedTypes.has(originalName)) {
              return {
                ...node,
                name: {
                  ...node.name,
                  value: renamedTypes.get(originalName)
                }
              };
            }
            
            const newName = `${prefix}${originalName}`;
            renamedTypes.set(originalName, newName);
            
            return {
              ...node,
              name: {
                ...node.name,
                value: newName
              }
            };
          }
        }
      },
      // Handle enum definitions
      EnumTypeDefinition: {
        leave(node) {
          if (!reservedNames.has(node.name.value)) {
            const originalName = node.name.value;
            if (renamedTypes.has(originalName)) {
              return {
                ...node,
                name: {
                  ...node.name,
                  value: renamedTypes.get(originalName)
                }
              };
            }
            
            const newName = `${prefix}${originalName}`;
            renamedTypes.set(originalName, newName);
            
            return {
              ...node,
              name: {
                ...node.name,
                value: newName
              }
            };
          }
        }
      },
      // Handle input object definitions
      InputObjectTypeDefinition: {
        leave(node) {
          if (!reservedNames.has(node.name.value)) {
            const originalName = node.name.value;
            if (renamedTypes.has(originalName)) {
              return {
                ...node,
                name: {
                  ...node.name,
                  value: renamedTypes.get(originalName)
                }
              };
            }
            
            const newName = `${prefix}${originalName}`;
            renamedTypes.set(originalName, newName);
            
            return {
              ...node,
              name: {
                ...node.name,
                value: newName
              }
            };
          }
        }
      },
      // Handle scalar definitions
      ScalarTypeDefinition: {
        leave(node) {
          if (!reservedNames.has(node.name.value)) {
            const originalName = node.name.value;
            if (renamedTypes.has(originalName)) {
              return {
                ...node,
                name: {
                  ...node.name,
                  value: renamedTypes.get(originalName)
                }
              };
            }
            
            const newName = `${prefix}${originalName}`;
            renamedTypes.set(originalName, newName);
            
            return {
              ...node,
              name: {
                ...node.name,
                value: newName
              }
            };
          }
        }
      },
      // Handle union definitions
      UnionTypeDefinition: {
        leave(node) {
          if (!reservedNames.has(node.name.value)) {
            const originalName = node.name.value;
            if (renamedTypes.has(originalName)) {
              return {
                ...node,
                name: {
                  ...node.name,
                  value: renamedTypes.get(originalName)
                }
              };
            }
            
            const newName = `${prefix}${originalName}`;
            renamedTypes.set(originalName, newName);
            
            return {
              ...node,
              name: {
                ...node.name,
                value: newName
              }
            };
          }
        }
      }
    });
    
    // Convert the transformed AST back to a string
    return print(transformedAst);
  } catch (error) {
    console.error('Error transforming schema:', error);
    process.exit(1);
  }
}

// Main function
async function main() {
  try {
    // Read schema from stdin
    const schemaString = await getStdin();
    
    if (!schemaString) {
      console.error('Error: No schema provided. Pipe a GraphQL schema to this script.');
      process.exit(1);
    }
    
    // Transform the schema
    const transformedSchema = addPrefixToSchema(schemaString, prefix);
    
    // Output the transformed schema
    console.log(transformedSchema);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

main();
