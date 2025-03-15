/**
 * Comparison operators for filter conditions
 */
export type ComparisonOperator = 
  | { eq: string | number | boolean | null }
  | { contains: string }
  | { in: Array<string | number> }
  | { notIn: Array<string | number> }
  | { lt: number }
  | { lte: number }
  | { gt: number }
  | { gte: number }
  | { between: [number, number] }
  | { isNull: boolean };

/**
 * Logical operators for combining filters
 */
export type LogicalOperator<T = FilterCriteria> = {
  and?: T[];
  or?: T[];
  not?: T;
};

/**
 * Generic filter value type supporting various filter conditions
 */
export type FilterValue = 
  | string 
  | number 
  | boolean 
  | null 
  | Array<string | number | boolean>
  | ComparisonOperator;

/**
 * Generic filter criteria for filtering operations
 */
export type FilterCriteria = LogicalOperator | Record<string, FilterValue | FilterCriteria>;

/**
 * Sort direction
 */
export type SortDirection = 'ASC' | 'DESC';

/**
 * Sort options for ordering results
 */
export type SortOptions = Record<string, SortDirection>;

/**
 * Pagination options interface
 */
export interface PaginationOptions {
  take?: number;
  skip?: number;
  sort?: SortOptions;
  filter?: FilterCriteria;
}

/**
 * Paginated result interface
 */
export interface PaginatedResult<T> {
  items: T[];
  totalItems: number;
  currentPage: number;
  totalPages: number;
  perPage: number;
}
