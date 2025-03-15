import { Injectable } from '../core/di/injectable.decorator';
import { BasePaginatedRepository } from './base.repository';
import { GraphQLClientService } from '../core/graphql/graphql-client.service';
import { Order, OrderStatusUpdateInput } from '../models/order.model';
import { 
  GET_ORDER, 
  GET_ORDERS, 
  UPDATE_ORDER_STATUS 
} from '../graphql/orders/order.queries';

/**
 * Repository for order operations
 */
@Injectable()
export class OrderRepository extends BasePaginatedRepository<Order, string> {
  constructor(graphqlClient: GraphQLClientService) {
    super(graphqlClient);
  }

  /**
   * Get the GraphQL query for finding by ID
   */
  protected getFindByIdQuery(): string {
    return GET_ORDER;
  }

  /**
   * Get the GraphQL query for finding all
   */
  protected getFindAllQuery(): string {
    return GET_ORDERS;
  }

  /**
   * Get the GraphQL mutation for creating
   * Note: Orders are typically created through the storefront, not admin
   */
  protected getCreateMutation(): string {
    throw new Error('Creating orders through admin API is not supported');
  }

  /**
   * Get the GraphQL mutation for updating
   * Note: Instead of a general update, we'll use status updates
   */
  protected getUpdateMutation(): string {
    throw new Error('Use updateOrderStatus instead of general update');
  }

  /**
   * Get the GraphQL mutation for deleting
   * Note: Orders are typically not deleted but canceled
   */
  protected getDeleteMutation(): string {
    throw new Error('Deleting orders is not supported, use status transitions instead');
  }

  /**
   * Get the GraphQL query for pagination
   */
  protected getFindWithPaginationQuery(): string {
    return GET_ORDERS;
  }

  /**
   * Get the result path for finding by ID
   */
  protected getFindByIdResultPath(): string {
    return 'order';
  }

  /**
   * Get the result path for finding all
   */
  protected getFindAllResultPath(): string {
    return 'orders.items';
  }

  /**
   * Get the result path for creating
   */
  protected getCreateResultPath(): string {
    throw new Error('Creating orders through admin API is not supported');
  }

  /**
   * Get the result path for updating
   */
  protected getUpdateResultPath(): string {
    throw new Error('Use updateOrderStatus instead of general update');
  }

  /**
   * Get the result path for deleting
   */
  protected getDeleteResultPath(): string {
    throw new Error('Deleting orders is not supported, use status transitions instead');
  }

  /**
   * Get the result path for pagination
   */
  protected getFindWithPaginationResultPath(): string {
    return 'orders';
  }

  /**
   * Update order status
   * @param input - Order status update input
   * @returns Promise resolving to updated order
   */
  async updateOrderStatus(input: OrderStatusUpdateInput): Promise<Order> {
    const variables = { 
      id: input.orderId, 
      state: input.status 
    };
    
    const result = await this.graphqlClient.mutate<{
      transitionOrderToState: Order;
    }>(UPDATE_ORDER_STATUS, variables);
    
    return result.transitionOrderToState;
  }
}
