import { VendureAdminClient } from '../../src/client/vendure-admin-client';
import { getProducts, getProduct, createProduct, updateProduct, deleteProduct } from '../../src/api/products';
import * as auth from '../../src/api/auth';

// Mock the auth module and VendureAdminClient
jest.mock('../../src/api/auth');
jest.mock('../../src/client/vendure-admin-client');

describe('Products API', () => {
  const mockClient = {
    query: jest.fn(),
    mutate: jest.fn()
  };

  beforeEach(() => {
    jest.clearAllMocks();
    
    // Mock the getClient function to return our mock client
    (auth.getClient as jest.Mock).mockReturnValue(mockClient);
  });

  describe('getProducts', () => {
    it('should fetch products with default options', async () => {
      const mockProducts = {
        items: [
          { id: 'product-1', name: 'Test Product 1' },
          { id: 'product-2', name: 'Test Product 2' }
        ],
        totalItems: 2
      };
      
      mockClient.query.mockResolvedValue({
        products: mockProducts
      });
      
      const result = await getProducts();
      
      expect(result).toEqual(mockProducts);
      expect(mockClient.query).toHaveBeenCalledWith(
        expect.anything(),
        { options: {} }
      );
    });

    it('should fetch products with specified options', async () => {
      const mockOptions = { take: 5, skip: 10 };
      
      await getProducts(mockOptions);
      
      expect(mockClient.query).toHaveBeenCalledWith(
        expect.anything(),
        { options: mockOptions }
      );
    });
  });

  describe('getProduct', () => {
    it('should fetch a product by ID', async () => {
      const mockProduct = { id: 'product-1', name: 'Test Product' };
      
      mockClient.query.mockResolvedValue({
        product: mockProduct
      });
      
      const result = await getProduct('product-1');
      
      expect(result).toEqual(mockProduct);
      expect(mockClient.query).toHaveBeenCalledWith(
        expect.anything(),
        { id: 'product-1' }
      );
    });
  });

  describe('createProduct', () => {
    it('should create a product', async () => {
      const mockInput = { name: 'New Product', slug: 'new-product' };
      const mockProduct = { id: 'new-product-id', ...mockInput };
      
      mockClient.mutate.mockResolvedValue({
        createProduct: mockProduct
      });
      
      const result = await createProduct(mockInput);
      
      expect(result).toEqual(mockProduct);
      expect(mockClient.mutate).toHaveBeenCalledWith(
        expect.anything(),
        { input: mockInput }
      );
    });
  });

  describe('updateProduct', () => {
    it('should update a product', async () => {
      const mockInput = { id: 'product-1', name: 'Updated Product' };
      const mockProduct = { ...mockInput };
      
      mockClient.mutate.mockResolvedValue({
        updateProduct: mockProduct
      });
      
      const result = await updateProduct(mockInput);
      
      expect(result).toEqual(mockProduct);
      expect(mockClient.mutate).toHaveBeenCalledWith(
        expect.anything(),
        { input: mockInput }
      );
    });
  });

  describe('deleteProduct', () => {
    it('should delete a product', async () => {
      mockClient.mutate.mockResolvedValue({
        deleteProduct: { success: true }
      });
      
      const result = await deleteProduct('product-1');
      
      expect(result).toBe(true);
      expect(mockClient.mutate).toHaveBeenCalledWith(
        expect.anything(),
        { id: 'product-1' }
      );
    });
  });
});
