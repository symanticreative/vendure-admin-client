import { Injectable } from '../core/di/injectable.decorator';
import { BasePaginatedService } from './base.service';
import { OrderRepository } from '../repositories/order.repository';
import { Order, OrderStatusUpdateInput } from '../models/order.model';

/**
 * Service for order operations
 */
@Injectable()
export class OrderService extends BasePaginatedService<Order, string> {
  constructor(private orderRepository: OrderRepository) {
    super(orderRepository);
  }

  /**
   * Update order status
   * @param input - Order status update input
   * @returns Promise resolving to updated order
   */
  async updateOrderStatus(input: OrderStatusUpdateInput): Promise<Order> {
    // Add any business logic, validation, or transformations here
    return this.orderRepository.updateOrderStatus(input);
  }

  /**
   * Get orders by customer
   * @param customerId - Customer ID
   * @param options - Pagination options
   * @returns Promise resolving to paginated orders
   */
  async getOrdersByCustomer(customerId: string, options: any = {}): Promise<any> {
    const orderOptions = {
      ...options,
      filter: {
        ...(options.filter || {}),
        customer: { id: { eq: customerId } }
      }
    };
    
    return this.getPaginated(orderOptions);
  }

  /**
   * Get orders by status
   * @param status - Order status
   * @param options - Pagination options
   * @returns Promise resolving to paginated orders
   */
  async getOrdersByStatus(status: string, options: any = {}): Promise<any> {
    const orderOptions = {
      ...options,
      filter: {
        ...(options.filter || {}),
        state: { eq: status }
      }
    };
    
    return this.getPaginated(orderOptions);
  }

  /**
   * Search orders by term
   * @param term - Search term
   * @param options - Pagination options
   * @returns Promise resolving to paginated orders
   */
  async searchOrders(term: string, options: any = {}): Promise<any> {
    // Search in order code or customer name/email
    const searchOptions = {
      ...options,
      filter: {
        ...(options.filter || {}),
        code: { contains: term }
        // Note: In a real implementation, we would also search by customer
      }
    };
    
    return this.getPaginated(searchOptions);
  }
}
