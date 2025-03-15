import { getClient } from './auth';
import { ListQueryOptions, Order, PaginatedResponse } from '../types';
import { 
  GET_ORDERS, 
  GET_ORDER, 
  UPDATE_ORDER_STATUS
} from '../graphql/orders';

/**
 * Get a paginated list of orders
 * 
 * @param options - Query options for pagination, sorting and filtering
 * @returns Promise resolving to paginated orders response
 */
export async function getOrders(
  options: ListQueryOptions = {}
): Promise<PaginatedResponse<Order>> {
  const client = getClient();
  const result = await client.query<{
    orders: PaginatedResponse<Order>;
  }>(GET_ORDERS, { options });
  
  return result.orders;
}

/**
 * Get a single order by ID
 * 
 * @param id - Order ID
 * @returns Promise resolving to the order
 */
export async function getOrder(id: string): Promise<Order> {
  const client = getClient();
  const result = await client.query<{
    order: Order;
  }>(GET_ORDER, { id });
  
  return result.order;
}

/**
 * Update the status of an order
 * 
 * @param input - Order status update input
 * @returns Promise resolving to the updated order
 */
export async function updateOrderStatus(
  input: { orderId: string; status: string }
): Promise<Order> {
  const client = getClient();
  const result = await client.mutate<{
    transitionOrderToState: Order;
  }>(UPDATE_ORDER_STATUS, { 
    id: input.orderId, 
    state: input.status 
  });
  
  return result.transitionOrderToState;
}
