import { OrderService } from '../../src/services/order.service';
import { OrderRepository } from '../../src/repositories/order.repository';
import { Order, OrderStatusUpdateInput } from '../../src/models/order.model';
import { PaginatedResult } from '../../src/models/common/filter.model';

// Mock the OrderRepository
jest.mock('../../src/repositories/order.repository');

describe('OrderService', () => {
  let orderService: OrderService;
  let mockOrderRepository: jest.Mocked<OrderRepository>;

  const mockOrder: Order = {
    id: 'order-1',
    code: 'TEST-001',
    state: 'PaymentAuthorized',
    active: true,
    total: 4500,
    currencyCode: 'GBP',
    customer: {
      id: 'customer-1',
      firstName: 'John',
      lastName: 'Doe',
      emailAddress: 'john.doe@example.com'
    },
    lines: [
      {
        id: 'line-1',
        productVariant: {
          id: 'variant-1',
          name: 'Test Product',
          sku: 'TEST-SKU-1',
          product: {
            id: 'product-1',
            name: 'Test Product',
            slug: 'test-product'
          }
        },
        unitPrice: 1500,
        quantity: 3,
        totalPrice: 4500
      }
    ],
    shippingAddress: {
      id: 'address-1',
      fullName: 'John Doe',
      streetLine1: '123 Test Street',
      city: 'Testville',
      postalCode: 'TE12 3ST',
      country: 'United Kingdom'
    }
  };

  const mockOrderList: Order[] = [
    mockOrder,
    {
      id: 'order-2',
      code: 'TEST-002',
      state: 'Delivered',
      active: false,
      total: 2500,
      currencyCode: 'GBP'
    }
  ];

  const mockPaginatedResult: PaginatedResult<Order> = {
    items: mockOrderList,
    totalItems: 2,
    currentPage: 1,
    totalPages: 1,
    perPage: 10
  };

  const mockStatusUpdateInput: OrderStatusUpdateInput = {
    orderId: 'order-1',
    status: 'PaymentSettled'
  };

    beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
    
    // Create a fresh mock repository
    mockOrderRepository = {
      findById: jest.fn().mockResolvedValue(mockOrder),
      findAll: jest.fn().mockResolvedValue(mockOrderList),
      create: jest.fn().mockRejectedValue(new Error('Creating orders through admin API is not supported')),
      update: jest.fn().mockRejectedValue(new Error('Use updateOrderStatus instead of general update')),
      delete: jest.fn().mockRejectedValue(new Error('Deleting orders is not supported, use status transitions instead')),
      findWithPagination: jest.fn().mockResolvedValue(mockPaginatedResult),
      updateOrderStatus: jest.fn().mockResolvedValue({
        ...mockOrder,
        state: 'PaymentSettled'
      })
    } as unknown as jest.Mocked<OrderRepository>;
    
    // Initialize the service with the mock repository
    orderService = new OrderService(mockOrderRepository);
  });

  describe('getById', () => {
    it('should call repository findById with provided id', async () => {
      const result = await orderService.getById('order-1');
      
      expect(mockOrderRepository.findById).toHaveBeenCalledWith('order-1');
      expect(result).toEqual(mockOrder);
    });
  });

  describe('getAll', () => {
    it('should call repository findAll', async () => {
      const result = await orderService.getAll();
      
      expect(mockOrderRepository.findAll).toHaveBeenCalled();
      expect(result).toEqual(mockOrderList);
    });

    it('should pass filter to repository findAll', async () => {
      const filter = { state: { eq: 'PaymentAuthorized' } };
      await orderService.getAll(filter);
      
      expect(mockOrderRepository.findAll).toHaveBeenCalledWith(filter);
    });
  });

  describe('getPaginated', () => {
    it('should call repository findWithPagination with options', async () => {
      const options = { take: 10, skip: 0 };
      const result = await orderService.getPaginated(options);
      
      expect(mockOrderRepository.findWithPagination).toHaveBeenCalledWith(options);
      expect(result).toEqual(mockPaginatedResult);
    });
  });

  describe('updateOrderStatus', () => {
    it('should call repository updateOrderStatus with input', async () => {
      const result = await orderService.updateOrderStatus(mockStatusUpdateInput);
      
      expect(mockOrderRepository.updateOrderStatus).toHaveBeenCalledWith(mockStatusUpdateInput);
      expect(result.state).toEqual('PaymentSettled');
    });
  });

  describe('getOrdersByCustomer', () => {
    it('should call getPaginated with customer filter', async () => {
      const customerId = 'customer-1';
      const options = { take: 10 };
      
      await orderService.getOrdersByCustomer(customerId, options);
      
      expect(mockOrderRepository.findWithPagination).toHaveBeenCalledWith({
        ...options,
        filter: {
          customer: { id: { eq: customerId } }
        }
      });
    });
  });

  describe('getOrdersByStatus', () => {
    it('should call getPaginated with status filter', async () => {
      const status = 'PaymentAuthorized';
      const options = { take: 10 };
      
      await orderService.getOrdersByStatus(status, options);
      
      expect(mockOrderRepository.findWithPagination).toHaveBeenCalledWith({
        ...options,
        filter: {
          state: { eq: status }
        }
      });
    });
  });

  describe('searchOrders', () => {
    it('should call getPaginated with search filter', async () => {
      const term = 'TEST';
      const options = { take: 10 };
      
      await orderService.searchOrders(term, options);
      
      expect(mockOrderRepository.findWithPagination).toHaveBeenCalledWith({
        ...options,
        filter: {
          code: { contains: term }
        }
      });
    });
  });
  
  describe('delete', () => {
    it('should throw an error when attempting to delete an order', async () => {
      await expect(orderService.delete('order-1')).rejects.toThrow('Deleting orders is not supported, use status transitions instead');
    });
  });

  describe('create', () => {
    it('should throw an error when attempting to create an order', async () => {
      await expect(orderService.create({})).rejects.toThrow('Creating orders through admin API is not supported');
    });
  });

  describe('update', () => {
    it('should throw an error when attempting to update an order', async () => {
      await expect(orderService.update('order-1', {})).rejects.toThrow('Use updateOrderStatus instead of general update');
    });
  });
});
