import {
  FilterCriteria,
  PaginationOptions as PaginationOptionsModel,
  PaginatedResult as PaginatedResultModel
} from '../../models/common/filter.model';

/**
 * Re-export these types for use in repositories
 */
export type PaginationOptions = PaginationOptionsModel;
export type PaginatedResult<T> = PaginatedResultModel<T>;

/**
 * Base repository interface defining common repository operations
 * All repositories should implement this interface
 */
export interface IRepository<T, ID> {
  /**
   * Find entity by ID
   * @param id - Entity identifier
   */
  findById(id: ID): Promise<T>;
  
  /**
   * Find all entities with optional filtering
   * @param filter - Optional filter criteria
   */
  findAll(filter?: FilterCriteria): Promise<T[]>;
  
  /**
   * Create a new entity
   * @param entity - Entity data to create
   */
  create(entity: Partial<T>): Promise<T>;
  
  /**
   * Update an existing entity
   * @param id - Entity identifier
   * @param entity - Updated entity data
   */
  update(id: ID, entity: Partial<T>): Promise<T>;
  
  /**
   * Delete an entity
   * @param id - Entity identifier
   */
  delete(id: ID): Promise<boolean>;
}

/**
 * Base paginated repository interface
 * Extends the base repository with pagination capabilities
 */
export interface IPaginatedRepository<T, ID> extends IRepository<T, ID> {
  /**
   * Find entities with pagination
   * @param options - Pagination options
   */
  findWithPagination(options: PaginationOptions): Promise<PaginatedResult<T>>;
}
