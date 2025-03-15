import { FilterCriteria, PaginationOptions, PaginatedResult } from '../models/common/filter.model';
import { IRepository, IPaginatedRepository } from '../core/interfaces/repository.interface';
import { IService, IPaginatedService } from '../core/interfaces/service.interface';

/**
 * Base service implementation
 * Implements common service methods using a repository
 * Note: Abstract classes don't need @Injectable decorator
 */
export abstract class BaseService<T, ID> implements IService<T, ID> {
  constructor(protected repository: IRepository<T, ID>) {}

  /**
   * Get entity by ID
   * @param id - Entity identifier
   * @returns Promise resolving to entity
   */
  async getById(id: ID): Promise<T> {
    return this.repository.findById(id);
  }

  /**
   * Get all entities with optional filtering
   * @param filter - Optional filter criteria
   * @returns Promise resolving to array of entities
   */
  async getAll(filter?: FilterCriteria): Promise<T[]> {
    return this.repository.findAll(filter);
  }

  /**
   * Create a new entity
   * @param data - Entity data
   * @returns Promise resolving to created entity
   */
  async create(data: Partial<T>): Promise<T> {
    return this.repository.create(data);
  }

  /**
   * Update an existing entity
   * @param id - Entity identifier
   * @param data - Updated entity data
   * @returns Promise resolving to updated entity
   */
  async update(id: ID, data: Partial<T>): Promise<T> {
    return this.repository.update(id, data);
  }

  /**
   * Delete an entity
   * @param id - Entity identifier
   * @returns Promise resolving to boolean indicating success
   */
  async delete(id: ID): Promise<boolean> {
    return this.repository.delete(id);
  }
}

/**
 * Base paginated service implementation
 * Extends base service with pagination capabilities
 * Note: Abstract classes don't need @Injectable decorator
 */
export abstract class BasePaginatedService<T, ID> 
  extends BaseService<T, ID> 
  implements IPaginatedService<T, ID> {

  constructor(protected paginatedRepository: IPaginatedRepository<T, ID>) {
    super(paginatedRepository);
  }

  /**
   * Get entities with pagination
   * @param options - Pagination options
   * @returns Promise resolving to paginated result
   */
  async getPaginated(options: PaginationOptions): Promise<PaginatedResult<T>> {
    return this.paginatedRepository.findWithPagination(options);
  }
}
