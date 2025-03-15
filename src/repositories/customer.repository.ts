import { Injectable } from '../core/di/injectable.decorator';
import { BasePaginatedRepository } from './base.repository';
import { GraphQLClientService } from '../core/graphql/graphql-client.service';
import { Customer } from '../models/customer.model';
import { 
  GET_CUSTOMER, 
  GET_CUSTOMERS, 
  CREATE_CUSTOMER, 
  UPDATE_CUSTOMER 
} from '../graphql/customer.queries';

/**
 * Repository for customer operations
 */
@Injectable()
export class CustomerRepository extends BasePaginatedRepository<Customer, string> {
  constructor(graphqlClient: GraphQLClientService) {
    super(graphqlClient);
  }

  /**
   * Get the GraphQL query for finding by ID
   */
  protected getFindByIdQuery(): string {
    return GET_CUSTOMER;
  }

  /**
   * Get the GraphQL query for finding all
   */
  protected getFindAllQuery(): string {
    return GET_CUSTOMERS;
  }

  /**
   * Get the GraphQL mutation for creating
   */
  protected getCreateMutation(): string {
    return CREATE_CUSTOMER;
  }

  /**
   * Get the GraphQL mutation for updating
   */
  protected getUpdateMutation(): string {
    return UPDATE_CUSTOMER;
  }

  /**
   * Get the GraphQL mutation for deleting
   * Note: Deleting customers is typically not supported or is done differently
   */
  protected getDeleteMutation(): string {
    throw new Error('Deleting customers is not supported directly');
  }

  /**
   * Get the GraphQL query for pagination
   */
  protected getFindWithPaginationQuery(): string {
    return GET_CUSTOMERS;
  }

  /**
   * Get the result path for finding by ID
   */
  protected getFindByIdResultPath(): string {
    return 'customer';
  }

  /**
   * Get the result path for finding all
   */
  protected getFindAllResultPath(): string {
    return 'customers.items';
  }

  /**
   * Get the result path for creating
   */
  protected getCreateResultPath(): string {
    return 'createCustomer.customer';
  }

  /**
   * Get the result path for updating
   */
  protected getUpdateResultPath(): string {
    return 'updateCustomer.customer';
  }

  /**
   * Get the result path for deleting
   */
  protected getDeleteResultPath(): string {
    throw new Error('Deleting customers is not supported directly');
  }

  /**
   * Get the result path for pagination
   */
  protected getFindWithPaginationResultPath(): string {
    return 'customers';
  }

  /**
   * Delete is intentionally overridden to throw an error
   * since this operation might not be supported in the API
   */
  async delete(id: string): Promise<boolean> {
    throw new Error('Deleting customers is not supported directly');
  }
}
