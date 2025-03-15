import { Injectable } from '../core/di/injectable.decorator';
import { BasePaginatedService } from './base.service';
import { CustomerRepository } from '../repositories/customer.repository';
import { Customer, CreateCustomerInput, UpdateCustomerInput } from '../models/customer.model';

/**
 * Service for customer operations
 */
@Injectable()
export class CustomerService extends BasePaginatedService<Customer, string> {
  constructor(private customerRepository: CustomerRepository) {
    super(customerRepository);
  }

  /**
   * Create a new customer
   * @param input - Customer creation input
   * @returns Promise resolving to created customer
   */
  async createCustomer(input: CreateCustomerInput): Promise<Customer> {
    // Add any business logic, validation, or transformations here
    return this.create(input);
  }

  /**
   * Update an existing customer
   * @param input - Customer update input
   * @returns Promise resolving to updated customer
   */
  async updateCustomer(input: UpdateCustomerInput): Promise<Customer> {
    const { id, ...data } = input;
    // Add any business logic, validation, or transformations here
    return this.update(id, data);
  }

  /**
   * Get customer by email
   * @param email - Customer email
   * @returns Promise resolving to customer or null
   */
  async getCustomerByEmail(email: string): Promise<Customer | null> {
    // This would typically be a direct repository call
    // For now, we'll implement it using the filter mechanism
    const customers = await this.getAll({ emailAddress: { eq: email } });
    return customers.length > 0 ? customers[0] : null;
  }

  /**
   * Search customers
   * @param term - Search term
   * @param options - Pagination options
   * @returns Promise resolving to paginated customers
   */
  async searchCustomers(term: string, options: any = {}): Promise<any> {
    // Search by name or email
    const searchOptions = {
      ...options,
      filter: {
        ...(options.filter || {}),
        // This is a simplified approach, actual implementation would depend on the API capabilities
        or: [
          { firstName: { contains: term } },
          { lastName: { contains: term } },
          { emailAddress: { contains: term } }
        ]
      }
    };
    
    return this.getPaginated(searchOptions);
  }
}
