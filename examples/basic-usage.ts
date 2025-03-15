import { 
  setAdminCredentials, 
  loginAdmin, 
  logoutAdmin,
  getProducts,
  createProduct,
  getOrders,
  getCustomers
} from '../src/index';

// This is a simple example of how to use the Vendure Admin Client

async function main() {
  try {
    // Set up the client with API URL
    console.log('Initializing client...');
    setAdminCredentials({
      apiUrl: 'https://example-vendure.com/admin-api',
    });

    // Login
    console.log('Logging in...');
    const authResult = await loginAdmin({
      email: 'admin@example.com',
      password: 'admin123'
    });
    console.log('Login successful, token:', authResult.token);

    // Example: Get products
    console.log('Fetching products...');
    const products = await getProducts({ take: 10, skip: 0 });
    console.log(`Retrieved ${products.totalItems} products. First page:`);
    products.items.forEach(product => {
      console.log(`- ${product.name} (${product.id})`);
    });

    // Example: Create a product
    console.log('Creating a product...');
    const newProduct = await createProduct({
      name: 'Test Product',
      slug: 'test-product',
      description: 'A test product created via API'
    });
    console.log('Created product:', newProduct);

    // Example: Get orders
    console.log('Fetching orders...');
    const orders = await getOrders({ take: 5 });
    console.log(`Retrieved ${orders.totalItems} orders. First page:`);
    orders.items.forEach(order => {
      console.log(`- Order ${order.code} (${order.state}): ${order.total} ${order.currencyCode}`);
    });

    // Example: Get customers
    console.log('Fetching customers...');
    const customers = await getCustomers({ take: 5 });
    console.log(`Retrieved ${customers.totalItems} customers. First page:`);
    customers.items.forEach(customer => {
      console.log(`- ${customer.firstName} ${customer.lastName} (${customer.emailAddress})`);
    });

    // Logout
    console.log('Logging out...');
    await logoutAdmin();
    console.log('Logged out successfully');
  } catch (error) {
    console.error('Error:', error);
  }
}

// Run the example
main().catch(console.error);
