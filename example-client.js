const { VendureAdminClientFactory } = require('./dist');

// Create a client instance
const client = VendureAdminClientFactory.createClient({
  apiUrl: 'https://api.shopeazy.co/admin-api',
});

console.log('Created VendureAdminClient instance successfully');
console.log(client);
