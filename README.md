# **Symantic Creative Vendure Admin Client** 🚀  

## **Overview**  
`@symanticreative/vendure-admin-client` is a **TypeScript GraphQL client** for integrating with the **Vendure Admin API**. It simplifies admin authentication, product management, order handling, and customer interactions—allowing seamless **Next.js and serverless** integrations with Vendure.

## **Why Use This?**  
✅ **TypeScript-first** – Ensures strong typing for API interactions.  
✅ **GraphQL-powered** – Uses **Apollo Client** for efficient data fetching.  
✅ **Admin Authentication** – Built-in session handling with token storage.  
✅ **Modular API Clients** – Import only the parts you need.  
✅ **Custom Config Support** – API credentials must be set by the consuming project.  
✅ **Optimized for Next.js & Serverless** – Works seamlessly in modern environments.  
✅ **Singleton Pattern** – Ensures only one client instance exists throughout your application.

---

## **🚀 Installation**  
Install the package using npm or yarn:  
```sh
npm install @symanticreative/vendure-admin-client
# or
yarn add @symanticreative/vendure-admin-client
```

---

## **🛠 Configuration**  
Unlike other API clients, **this package does not assume a fixed API URL or credentials**.  
Instead, **the consuming project must initialize the client** with its own API details.

### **Initialize the Client**  
Before making any API calls, you must **initialize the client singleton**:
```ts
import { VendureAdminClient } from '@symanticreative/vendure-admin-client';

// Initialize the singleton client
VendureAdminClient.getInstance({
  apiUrl: process.env.VENDURE_ADMIN_API_URL,  // Your Vendure Admin API URL
  authToken: process.env.VENDURE_ADMIN_AUTH_TOKEN,  // Optional: Authentication token for API requests
});
```
- **API calls will fail unless the client is initialized first.**
- **No `.env` files are used inside the package**—configurations must come from the importing project.

### **Next.js Integration**
For **Next.js projects**, set up environment variables and initialize the client:

1. Create a `.env.local` file in your project root:
```
VENDURE_ADMIN_API_URL=https://your-vendure-instance.com/admin-api
```

2. In your `lib` directory, create a vendure-client initialization file:

```ts
// lib/vendure-client.ts
import { VendureAdminClient } from '@symanticreative/vendure-admin-client';

export function getVendureClient() {
  // Only initialize on server side
  if (typeof window === 'undefined') {
    return VendureAdminClient.getInstance({
      apiUrl: process.env.VENDURE_ADMIN_API_URL!,
    });
  }
  
  return VendureAdminClient.getInstance();
}
```

3. Initialize the client in your app's entry point:

```ts
// app/layout.tsx or app/_lib/init.ts
import { getVendureClient } from '@/lib/vendure-client';

// Initialize on server side
if (typeof window === 'undefined') {
  getVendureClient();
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
```

4. For server actions, you can authenticate within the action:

```ts
// app/actions/admin-actions.ts
'use server'

import { loginAdmin, getProducts } from '@symanticreative/vendure-admin-client';
import { getVendureClient } from '@/lib/vendure-client';

export async function fetchProducts() {
  // Ensure client is initialized
  getVendureClient();
  
  // Authenticate (consider using a more secure approach for credentials in production)
  await loginAdmin({ 
    email: process.env.VENDURE_ADMIN_EMAIL!,
    password: process.env.VENDURE_ADMIN_PASSWORD!
  });
  
  // Fetch data
  return getProducts({ take: 10 });
}
```

---

## **🔧 API Usage**  
Once configured, you can **import and use API functions**.

### **🔑 Authentication**
Admin login/logout management:
```ts
import { loginAdmin, logoutAdmin } from '@symanticreative/vendure-admin-client';

const token = await loginAdmin({ email: 'admin@example.com', password: 'securepass' });
await logoutAdmin();
```

### **📦 Products API**
Retrieve and update products:
```ts
import { getProducts, updateProduct } from '@symanticreative/vendure-admin-client';

const products = await getProducts({ take: 10, skip: 0 });
await updateProduct({ id: '123', name: 'Updated Product Name' });
```

### **🛒 Orders API**
Manage customer orders:
```ts
import { getOrders, updateOrderStatus } from '@symanticreative/vendure-admin-client';

const orders = await getOrders({ take: 5 });
await updateOrderStatus({ orderId: '456', status: 'Shipped' });
```

### **👥 Customers API**
Retrieve and create customers:
```ts
import { getCustomers, createCustomer } from '@symanticreative/vendure-admin-client';

const customers = await getCustomers({ take: 20 });

await createCustomer({
  email: 'newuser@example.com',
  firstName: 'John',
  lastName: 'Doe',
});
```

### **⚙️ Settings API**
Fetch and modify admin settings:
```ts
import { getAdminSettings, updateAdminSettings } from '@symanticreative/vendure-admin-client';

const settings = await getAdminSettings();
await updateAdminSettings({ currency: 'ZAR', defaultLanguage: 'en' });
```

### **🔄 Custom Queries**
Execute custom GraphQL operations:
```ts
import { executeCustomOperation } from '@symanticreative/vendure-admin-client';

const customQuery = `
  query GetSpecialProducts {
    products(options: { filter: { custom: true } }) {
      items {
        id
        name
        customFields {
          specialFeature
        }
      }
    }
  }
`;

const result = await executeCustomOperation(customQuery);
```

---

## **🔬 Testing**
This package includes **unit and integration tests** using Jest. To run tests:
```sh
npm test
```

---

## **📄 Example Next.js Integration**
For a **fully working example**, check out the **Next.js example** included in this package:
```sh
# Basic example
cd examples/nextjs-example

# Singleton pattern example (recommended)
cd examples/nextjs-singleton-example
```
These provide implementation examples for different integration approaches.

---

## **🔗 Resources**
📖 **Vendure Documentation**: [https://www.vendure.io/docs](https://www.vendure.io/docs)  
💬 **Vendure Community**: [https://www.vendure.io/community](https://www.vendure.io/community)  
🔧 **Vendure Admin API Reference**: [https://docs.vendure.io/reference/graphql-api/admin](https://docs.vendure.io/reference/graphql-api/admin)  

---

## **📜 License**
This package is **open-source**, built on Vendure, and licensed under the **MIT License**.
