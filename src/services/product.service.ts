import { Injectable } from '../core/di/injectable.decorator';
import { BasePaginatedService } from './base.service';
import { ProductRepository } from '../repositories/product.repository';
import { Product, CreateProductInput, UpdateProductInput } from '../models/product.model';

/**
 * Service for product operations
 */
@Injectable()
export class ProductService extends BasePaginatedService<Product, string> {
  constructor(private productRepository: ProductRepository) {
    super(productRepository);
  }

  /**
   * Create a new product
   * @param input - Product creation input
   * @returns Promise resolving to the created product
   */
  async createProduct(input: CreateProductInput): Promise<Product> {
    // Add any business logic, validation, or transformations here
    return this.create(input);
  }

  /**
   * Update an existing product
   * @param input - Product update input
   * @returns Promise resolving to the updated product
   */
  async updateProduct(input: UpdateProductInput): Promise<Product> {
    const { id, ...data } = input;
    // Add any business logic, validation, or transformations here
    return this.update(id, data);
  }

  /**
   * Get product by slug
   * @param slug - Product slug
   * @returns Promise resolving to product or null
   */
  async getProductBySlug(slug: string): Promise<Product | null> {
    // This would typically be implemented in the repository
    // For now, we'll get all products and filter
    const products = await this.getAll();
    return products.find(product => product.slug === slug) || null;
  }

  /**
   * Search products by term
   * @param term - Search term
   * @param options - Pagination options
   * @returns Promise resolving to paginated products
   */
  async searchProducts(term: string, options: any = {}): Promise<any> {
    // Implement product search functionality
    // This might require a custom repository method or GraphQL query
    const searchOptions = {
      ...options,
      filter: {
        ...(options.filter || {}),
        name: { contains: term }
      }
    };
    
    return this.getPaginated(searchOptions);
  }
}
