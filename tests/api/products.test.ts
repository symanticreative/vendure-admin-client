import { ApolloQueryResult, FetchResult, DocumentNode } from '@apollo/client';
import { getProducts, getProduct, createProduct, updateProduct, deleteProduct } from '../../src/api/products';
import { VendureAdminClient } from '../../src/client/vendure-admin-client';

// Create a mock client type that matches VendureAdminClient's interface
interface MockVendureAdminClient {
  query<T = any>(query: DocumentNode, variables?: Record<string, any>): Promise<ApolloQueryResult<T>>;
  mutate<T = any>(mutation: DocumentNode, variables?: Record<string, any>): Promise<FetchResult<T>>;
}

// Mock the VendureAdminClient class
jest.mock('../../src/client/vendure-admin-client');

describe('Products API', () => {
  let mockClient: MockVendureAdminClient;

  beforeEach(() => {
    // Create fresh mocks for each test
    mockClient = {
      query: jest.fn(),
      mutate: jest.fn()
    };

    // Reset all mocks and provide fresh mock instance
    jest.clearAllMocks();
    (VendureAdminClient.getInstance as jest.Mock).mockReturnValue(mockClient);
  });

  describe('getProducts', () => {
    it('should get products with default options', async () => {
      const mockResponse: ApolloQueryResult<ProductsResponse> = {
        data: {
          products: {
            items: [{ id: '1', name: 'Product 1' }],
            totalItems: 1
          }
        },
        loading: false,
        networkStatus: 7
      };
      
      (mockClient.query as jest.Mock).mockResolvedValueOnce(mockResponse);

      const result = await getProducts();
      
      expect(mockClient.query).toHaveBeenCalled();
      expect(result.items).toHaveLength(1);
      expect(result.totalItems).toBe(1);
    });

    it('should get products with custom options', async () => {
      const mockResponse: ApolloQueryResult<ProductsResponse> = {
        data: {
          products: {
            items: [{ id: '1', name: 'Product 1' }],
            totalItems: 1
          }
        },
        loading: false,
        networkStatus: 7
      };
      
      (mockClient.query as jest.Mock).mockResolvedValueOnce(mockResponse);

      const options = { take: 5, skip: 10 };
      await getProducts(options);
      
      expect(mockClient.query).toHaveBeenCalledWith(
        expect.anything(),
        { options }
      );
    });
  });

  describe('getProduct', () => {
    it('should get a single product by ID', async () => {
      const mockResponse: ApolloQueryResult<ProductResponse> = {
        data: {
          product: { id: '1', name: 'Product 1' }
        },
        loading: false,
        networkStatus: 7
      };
      
      (mockClient.query as jest.Mock).mockResolvedValueOnce(mockResponse);

      const result = await getProduct('1');
      
      expect(mockClient.query).toHaveBeenCalledWith(
        expect.anything(),
        { id: '1' }
      );
      expect(result.id).toBe('1');
    });
  });

  describe('createProduct', () => {
    it('should create a product', async () => {
      const mockResponse: FetchResult<CreateProductResponse> = {
        data: {
          createProduct: { id: '1', name: 'New Product' }
        }
      };
      
      (mockClient.mutate as jest.Mock).mockResolvedValueOnce(mockResponse);

      const input = { name: 'New Product', slug: 'new-product' };
      const result = await createProduct(input);
      
      expect(mockClient.mutate).toHaveBeenCalledWith(
        expect.anything(),
        { input }
      );
      expect(result.id).toBe('1');
    });
  });

  describe('updateProduct', () => {
    it('should update a product', async () => {
      const mockResponse: FetchResult<UpdateProductResponse> = {
        data: {
          updateProduct: { id: '1', name: 'Updated Product' }
        }
      };
      
      (mockClient.mutate as jest.Mock).mockResolvedValueOnce(mockResponse);

      const input = { id: '1', name: 'Updated Product' };
      const result = await updateProduct(input);
      
      expect(mockClient.mutate).toHaveBeenCalledWith(
        expect.anything(),
        { input }
      );
      expect(result.name).toBe('Updated Product');
    });
  });

  describe('deleteProduct', () => {
    it('should delete a product', async () => {
      const mockResponse: FetchResult<DeleteProductResponse> = {
        data: {
          deleteProduct: { success: true }
        }
      };
      
      (mockClient.mutate as jest.Mock).mockResolvedValueOnce(mockResponse);

      const result = await deleteProduct('1');
      
      expect(mockClient.mutate).toHaveBeenCalledWith(
        expect.anything(),
        { id: '1' }
      );
      expect(result).toBe(true);
    });
  });
});

// Define interfaces for our responses
interface ProductsResponse {
  products: {
    items: Array<{ id: string; name: string }>;
    totalItems: number;
  };
}

interface ProductResponse {
  product: {
    id: string;
    name: string;
  };
}

interface CreateProductResponse {
  createProduct: {
    id: string;
    name: string;
  };
}

interface UpdateProductResponse {
  updateProduct: {
    id: string;
    name: string;
  };
}

interface DeleteProductResponse {
  deleteProduct: {
    success: boolean;
  };
}