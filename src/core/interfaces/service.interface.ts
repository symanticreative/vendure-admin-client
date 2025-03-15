import {
  FilterCriteria,
  PaginationOptions,
  PaginatedResult
} from '../../models/common/filter.model';

/**
 * Base service interface defining common service operations
 * All services should implement this interface
 */
export interface IService<T, ID> {
  /**
   * Get entity by ID
   * @param id - Entity identifier
   */
  getById(id: ID): Promise<T>;
  
  /**
   * Get all entities with optional filtering
   * @param filter - Optional filter criteria
   */
  getAll(filter?: FilterCriteria): Promise<T[]>;
  
  /**
   * Create a new entity
   * @param data - Entity data to create
   */
  create(data: Partial<T>): Promise<T>;
  
  /**
   * Update an existing entity
   * @param id - Entity identifier
   * @param data - Updated entity data
   */
  update(id: ID, data: Partial<T>): Promise<T>;
  
  /**
   * Delete an entity
   * @param id - Entity identifier
   */
  delete(id: ID): Promise<boolean>;
}

/**
 * Base paginated service interface
 * Extends the base service with pagination capabilities
 */
export interface IPaginatedService<T, ID> extends IService<T, ID> {
  /**
   * Get entities with pagination
   * @param options - Pagination options
   */
  getPaginated(options: PaginationOptions): Promise<PaginatedResult<T>>;
}
