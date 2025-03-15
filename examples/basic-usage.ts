import { VendureAdminClient } from '../src/index';

// This is a simple example of how to use the Vendure Admin Client

async function main() {
  // Initialize the client
  const client = new VendureAdminClient({
    apiUrl: 'https://example-vendure.com/admin-api',
  });

  try {
    // Login
    console.log('Logging in...');
    const authResult = await client.login('admin', 'admin123');
    console.log('Login successful, token:', authResult.token);

    // Example query to get products
    console.log('Fetching products...');
    const productsResult = await client.query(`
      query {
        products(options: { take: 10 }) {
          items {
            id
            name
          }
          totalItems
        }
      }
    `);
    console.log('Products result:', productsResult);

    // Example mutation to create a product
    console.log('Creating a product...');
    const createResult = await client.mutate(`
      mutation CreateProduct($input: CreateProductInput!) {
        createProduct(input: $input) {
          id
          name
        }
      }
    `, {
      input: {
        name: 'Test Product',
        slug: 'test-product',
      }
    });
    console.log('Create result:', createResult);

    // Logout
    console.log('Logging out...');
    client.logout();
    console.log('Logged out, authenticated:', client.isAuthenticated());
  } catch (error) {
    console.error('Error:', error);
  }
}

// Run the example
main().catch(console.error);
