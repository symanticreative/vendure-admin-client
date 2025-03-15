import { Injectable } from '../core/di/injectable.decorator';
import { GraphQLClientService } from '../core/graphql/graphql-client.service';
import { IRepository, IPaginatedRepository, PaginationOptions, PaginatedResult } from '../core/interfaces/repository.interface';

/**
 * Base repository implementation for GraphQL operations
 * Implements common repository methods
 */
@Injectable()
export abstract class BaseRepository<T, ID> implements IRepository<T, ID> {
  constructor(protected graphqlClient: GraphQLClientService) {}

  /**
   * Abstract method to be implemented by concrete repositories
   * Gets the GraphQL query for finding by ID
   */
  protected abstract getFindByIdQuery(): string;

  /**
   * Abstract method to be implemented by concrete repositories
   * Gets the GraphQL query for finding all
   */
  protected abstract getFindAllQuery(): string;

  /**
   * Abstract method to be implemented by concrete repositories
   * Gets the GraphQL mutation for creating
   */
  protected abstract getCreateMutation(): string;

  /**
   * Abstract method to be implemented by concrete repositories
   * Gets the GraphQL mutation for updating
   */
  protected abstract getUpdateMutation(): string;

  /**
   * Abstract method to be implemented by concrete repositories
   * Gets the GraphQL mutation for deleting
   */
  protected abstract getDeleteMutation(): string;

  /**
   * Abstract method to be implemented by concrete repositories
   * Gets the result path for finding by ID
   */
  protected abstract getFindByIdResultPath(): string;

  /**
   * Abstract method to be implemented by concrete repositories
   * Gets the result path for finding all
   */
  protected abstract getFindAllResultPath(): string;

  /**
   * Abstract method to be implemented by concrete repositories
   * Gets the result path for creating
   */
  protected abstract getCreateResultPath(): string;

  /**
   * Abstract method to be implemented by concrete repositories
   * Gets the result path for updating
   */
  protected abstract getUpdateResultPath(): string;

  /**
   * Abstract method to be implemented by concrete repositories
   * Gets the result path for deleting
   */
  protected abstract getDeleteResultPath(): string;

  /**
   * Find entity by ID
   * @param id - Entity identifier
   * @returns Promise resolving to the entity
   */
  async findById(id: ID): Promise<T> {
    const variables = { id };
    const query = this.getFindByIdQuery();
    const resultPath = this.getFindByIdResultPath();

    const result = await this.graphqlClient.query<any>(query, variables);
    return this.getResultByPath(result, resultPath);
  }

  /**
   * Find all entities with optional filtering
   * @param filter - Optional filter criteria
   * @returns Promise resolving to array of entities
   */
  async findAll(filter?: Record<string, any>): Promise<T[]> {
    const variables = { filter };
    const query = this.getFindAllQuery();
    const resultPath = this.getFindAllResultPath();

    const result = await this.graphqlClient.query<any>(query, variables);
    return this.getResultByPath(result, resultPath);
  }

  /**
   * Create a new entity
   * @param entity - Entity data
   * @returns Promise resolving to created entity
   */
  async create(entity: Partial<T>): Promise<T> {
    const variables = { input: entity };
    const mutation = this.getCreateMutation();
    const resultPath = this.getCreateResultPath();

    const result = await this.graphqlClient.mutate<any>(mutation, variables);
    return this.getResultByPath(result, resultPath);
  }

  /**
   * Update an existing entity
   * @param id - Entity identifier
   * @param entity - Updated entity data
   * @returns Promise resolving to updated entity
   */
  async update(id: ID, entity: Partial<T>): Promise<T> {
    const variables = { input: { id, ...entity } };
    const mutation = this.getUpdateMutation();
    const resultPath = this.getUpdateResultPath();

    const result = await this.graphqlClient.mutate<any>(mutation, variables);
    return this.getResultByPath(result, resultPath);
  }

  /**
   * Delete an entity
   * @param id - Entity identifier
   * @returns Promise resolving to boolean indicating success
   */
  async delete(id: ID): Promise<boolean> {
    const variables = { id };
    const mutation = this.getDeleteMutation();
    const resultPath = this.getDeleteResultPath();

    const result = await this.graphqlClient.mutate<any>(mutation, variables);
    return this.getResultByPath(result, resultPath);
  }

  /**
   * Helper method to get result by path
   * @param result - GraphQL result
   * @param path - Path to result in the object
   * @returns Extracted result
   */
  protected getResultByPath(result: any, path: string): any {
    if (!path) return result;
    const pathParts = path.split('.');
    let currentValue = result;
    
    for (const part of pathParts) {
      if (currentValue === undefined || currentValue === null) {
        return null;
      }
      currentValue = currentValue[part];
    }
    
    return currentValue;
  }
}

/**
 * Base paginated repository implementation
 * Extends base repository with pagination capabilities
 */
@Injectable()
export abstract class BasePaginatedRepository<T, ID> 
  extends BaseRepository<T, ID> 
  implements IPaginatedRepository<T, ID> {
  
  /**
   * Abstract method to be implemented by concrete repositories
   * Gets the GraphQL query for paginated results
   */
  protected abstract getFindWithPaginationQuery(): string;

  /**
   * Abstract method to be implemented by concrete repositories
   * Gets the result path for paginated results
   */
  protected abstract getFindWithPaginationResultPath(): string;

  /**
   * Find entities with pagination
   * @param options - Pagination options
   * @returns Promise resolving to paginated result
   */
  async findWithPagination(options: PaginationOptions): Promise<PaginatedResult<T>> {
    const variables = { options };
    const query = this.getFindWithPaginationQuery();
    const resultPath = this.getFindWithPaginationResultPath();

    const result = await this.graphqlClient.query<any>(query, variables);
    return this.getResultByPath(result, resultPath);
  }
}
