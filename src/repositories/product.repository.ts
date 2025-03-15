import { Injectable } from '../core/di/injectable.decorator';
import { BasePaginatedRepository } from './base.repository';
import { GraphQLClientService } from '../core/graphql/graphql-client.service';
import { Product } from '../models/product.model';
import { 
  GET_PRODUCT, 
  GET_PRODUCTS, 
  CREATE_PRODUCT, 
  UPDATE_PRODUCT, 
  DELETE_PRODUCT 
} from '../graphql/product.queries';

/**
 * Repository for product operations
 */
@Injectable()
export class ProductRepository extends BasePaginatedRepository<Product, string> {
  constructor(graphqlClient: GraphQLClientService) {
    super(graphqlClient);
  }

  /**
   * Get the GraphQL query for finding by ID
   */
  protected getFindByIdQuery(): string {
    return GET_PRODUCT;
  }

  /**
   * Get the GraphQL query for finding all
   */
  protected getFindAllQuery(): string {
    return GET_PRODUCTS;
  }

  /**
   * Get the GraphQL mutation for creating
   */
  protected getCreateMutation(): string {
    return CREATE_PRODUCT;
  }

  /**
   * Get the GraphQL mutation for updating
   */
  protected getUpdateMutation(): string {
    return UPDATE_PRODUCT;
  }

  /**
   * Get the GraphQL mutation for deleting
   */
  protected getDeleteMutation(): string {
    return DELETE_PRODUCT;
  }

  /**
   * Get the GraphQL query for pagination
   */
  protected getFindWithPaginationQuery(): string {
    return GET_PRODUCTS;
  }

  /**
   * Get the result path for finding by ID
   */
  protected getFindByIdResultPath(): string {
    return 'product';
  }

  /**
   * Get the result path for finding all
   */
  protected getFindAllResultPath(): string {
    return 'products.items';
  }

  /**
   * Get the result path for creating
   */
  protected getCreateResultPath(): string {
    return 'createProduct';
  }

  /**
   * Get the result path for updating
   */
  protected getUpdateResultPath(): string {
    return 'updateProduct';
  }

  /**
   * Get the result path for deleting
   */
  protected getDeleteResultPath(): string {
    return 'deleteProduct.success';
  }

  /**
   * Get the result path for pagination
   */
  protected getFindWithPaginationResultPath(): string {
    return 'products';
  }
}
