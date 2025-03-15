import { ProductService } from '../../src/services/product.service';
import { ProductRepository } from '../../src/repositories/product.repository';
import { Product, CreateProductInput, UpdateProductInput } from '../../src/models/product.model';
import { PaginatedResult } from '../../src/models/common/filter.model';

// Mock the ProductRepository
jest.mock('../../src/repositories/product.repository');

describe('ProductService', () => {
  let productService: ProductService;
  let mockProductRepository: jest.Mocked<ProductRepository>;

  const mockProduct: Product = {
    id: 'product-1',
    name: 'Test Product',
    slug: 'test-product',
    description: 'A test product description',
    enabled: true,
    variants: [
      {
        id: 'variant-1',
        name: 'Test Variant',
        sku: 'TEST-SKU-1',
        price: 1999,
        stockLevel: 'IN_STOCK',
        stockOnHand: 100,
      }
    ],
    featuredAsset: {
      id: 'asset-1',
      preview: 'https://example.com/image.jpg'
    }
  };

  const mockProductList: Product[] = [
    mockProduct,
    {
      id: 'product-2',
      name: 'Test Product 2',
      slug: 'test-product-2',
      enabled: false,
    }
  ];

  const mockPaginatedResult: PaginatedResult<Product> = {
    items: mockProductList,
    totalItems: 2,
    currentPage: 1,
    totalPages: 1,
    perPage: 10
  };

  const mockCreateInput: CreateProductInput = {
    name: 'New Product',
    slug: 'new-product',
    description: 'A new product'
  };

  const mockUpdateInput: UpdateProductInput = {
    id: 'product-1',
    name: 'Updated Product',
    enabled: false
  };

  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
    
    // Create a fresh mock repository
    mockProductRepository = {
      findById: jest.fn().mockResolvedValue(mockProduct),
      findAll: jest.fn().mockResolvedValue(mockProductList),
      create: jest.fn().mockResolvedValue(mockProduct),
      update: jest.fn().mockResolvedValue({...mockProduct, name: 'Updated Product'}),
      delete: jest.fn().mockResolvedValue(true),
      findWithPagination: jest.fn().mockResolvedValue(mockPaginatedResult)
    } as unknown as jest.Mocked<ProductRepository>;
    
    // Initialize the service with the mock repository
    productService = new ProductService(mockProductRepository);
  });

  describe('getById', () => {
    it('should call repository findById with provided id', async () => {
      const result = await productService.getById('product-1');
      
      expect(mockProductRepository.findById).toHaveBeenCalledWith('product-1');
      expect(result).toEqual(mockProduct);
    });
  });

  describe('getAll', () => {
    it('should call repository findAll', async () => {
      const result = await productService.getAll();
      
      expect(mockProductRepository.findAll).toHaveBeenCalled();
      expect(result).toEqual(mockProductList);
    });

    it('should pass filter to repository findAll', async () => {
      const filter = { enabled: { eq: true } };
      await productService.getAll(filter);
      
      expect(mockProductRepository.findAll).toHaveBeenCalledWith(filter);
    });
  });

  describe('getPaginated', () => {
    it('should call repository findWithPagination with options', async () => {
      const options = { take: 10, skip: 0 };
      const result = await productService.getPaginated(options);
      
      expect(mockProductRepository.findWithPagination).toHaveBeenCalledWith(options);
      expect(result).toEqual(mockPaginatedResult);
    });
  });

  describe('createProduct', () => {
    it('should call repository create with input', async () => {
      await productService.createProduct(mockCreateInput);
      
      expect(mockProductRepository.create).toHaveBeenCalledWith(mockCreateInput);
    });
  });

  describe('updateProduct', () => {
    it('should call repository update with id and data', async () => {
      const { id, ...data } = mockUpdateInput;
      await productService.updateProduct(mockUpdateInput);
      
      expect(mockProductRepository.update).toHaveBeenCalledWith(id, data);
    });
  });

  describe('getProductBySlug', () => {
    it('should filter products by slug', async () => {
      mockProductRepository.findAll.mockResolvedValueOnce(
        mockProductList.filter(p => p.slug === 'test-product')
      );
      
      const result = await productService.getProductBySlug('test-product');
      
      expect(mockProductRepository.findAll).toHaveBeenCalled();
      expect(result).toEqual(mockProduct);
    });

    it('should return null if no product found with slug', async () => {
      mockProductRepository.findAll.mockResolvedValueOnce([]);
      
      const result = await productService.getProductBySlug('non-existent');
      
      expect(result).toBeNull();
    });
  });

  describe('searchProducts', () => {
    it('should call repository findWithPagination with search options', async () => {
      const searchTerm = 'product';
      const options = { take: 10 };
      
      await productService.searchProducts(searchTerm, options);
      
      expect(mockProductRepository.findWithPagination).toHaveBeenCalledWith({
        ...options,
        filter: {
          name: { contains: searchTerm }
        }
      });
    });
  });
});
