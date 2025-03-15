import { getClient } from './auth';
import { Customer, ListQueryOptions, PaginatedResponse } from '../types';
import { 
  GET_CUSTOMERS, 
  GET_CUSTOMER, 
  CREATE_CUSTOMER,
  UPDATE_CUSTOMER
} from '../graphql/customers';

/**
 * Get a paginated list of customers
 * 
 * @param options - Query options for pagination, sorting and filtering
 * @returns Promise resolving to paginated customers response
 */
export async function getCustomers(
  options: ListQueryOptions = {}
): Promise<PaginatedResponse<Customer>> {
  const client = getClient();
  const result = await client.query<{
    customers: PaginatedResponse<Customer>;
  }>(GET_CUSTOMERS, { options });
  
  return result.customers;
}

/**
 * Get a single customer by ID
 * 
 * @param id - Customer ID
 * @returns Promise resolving to the customer
 */
export async function getCustomer(id: string): Promise<Customer> {
  const client = getClient();
  const result = await client.query<{
    customer: Customer;
  }>(GET_CUSTOMER, { id });
  
  return result.customer;
}

/**
 * Create a new customer
 * 
 * @param input - Customer creation input
 * @returns Promise resolving to the created customer
 */
export async function createCustomer(
  input: Partial<Customer>
): Promise<Customer> {
  const client = getClient();
  const result = await client.mutate<{
    createCustomer: { customer: Customer };
  }>(CREATE_CUSTOMER, { input });
  
  return result.createCustomer.customer;
}

/**
 * Update an existing customer
 * 
 * @param input - Customer update input with ID
 * @returns Promise resolving to the updated customer
 */
export async function updateCustomer(
  input: { id: string } & Partial<Customer>
): Promise<Customer> {
  const client = getClient();
  const result = await client.mutate<{
    updateCustomer: { customer: Customer };
  }>(UPDATE_CUSTOMER, { input });
  
  return result.updateCustomer.customer;
}
