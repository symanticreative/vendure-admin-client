import { getClient } from './auth';
import { ListQueryOptions, PaginatedResponse, Product } from '../types';
import { 
  GET_PRODUCTS, 
  GET_PRODUCT, 
  CREATE_PRODUCT,
  UPDATE_PRODUCT,
  DELETE_PRODUCT
} from '../graphql/products';

/**
 * Get a paginated list of products
 * 
 * @param options - Query options for pagination, sorting and filtering
 * @returns Promise resolving to paginated products response
 */
export async function getProducts(
  options: ListQueryOptions = {}
): Promise<PaginatedResponse<Product>> {
  const client = getClient();
  const result = await client.query<{
    products: PaginatedResponse<Product>;
  }>(GET_PRODUCTS, { options });
  
  return result.products;
}

/**
 * Get a single product by ID
 * 
 * @param id - Product ID
 * @returns Promise resolving to the product
 */
export async function getProduct(id: string): Promise<Product> {
  const client = getClient();
  const result = await client.query<{
    product: Product;
  }>(GET_PRODUCT, { id });
  
  return result.product;
}

/**
 * Create a new product
 * 
 * @param input - Product creation input
 * @returns Promise resolving to the created product
 */
export async function createProduct(
  input: Partial<Product>
): Promise<Product> {
  const client = getClient();
  const result = await client.mutate<{
    createProduct: Product;
  }>(CREATE_PRODUCT, { input });
  
  return result.createProduct;
}

/**
 * Update an existing product
 * 
 * @param input - Product update input with ID
 * @returns Promise resolving to the updated product
 */
export async function updateProduct(
  input: { id: string } & Partial<Product>
): Promise<Product> {
  const client = getClient();
  const result = await client.mutate<{
    updateProduct: Product;
  }>(UPDATE_PRODUCT, { input });
  
  return result.updateProduct;
}

/**
 * Delete a product
 * 
 * @param id - Product ID
 * @returns Promise resolving to true if deletion was successful
 */
export async function deleteProduct(id: string): Promise<boolean> {
  const client = getClient();
  const result = await client.mutate<{
    deleteProduct: { success: boolean };
  }>(DELETE_PRODUCT, { id });
  
  return result.deleteProduct.success;
}
