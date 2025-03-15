import { CustomerService } from '../../src/services/customer.service';
import { CustomerRepository } from '../../src/repositories/customer.repository';
import { Customer, CreateCustomerInput, UpdateCustomerInput } from '../../src/models/customer.model';
import { PaginatedResult } from '../../src/models/common/filter.model';

// Mock the CustomerRepository
jest.mock('../../src/repositories/customer.repository');

describe('CustomerService', () => {
  let customerService: CustomerService;
  let mockCustomerRepository: jest.Mocked<CustomerRepository>;

  const mockCustomer: Customer = {
    id: 'customer-1',
    firstName: 'John',
    lastName: 'Doe',
    emailAddress: 'john.doe@example.com',
    phoneNumber: '+44123456789',
    user: {
      id: 'user-1',
      verified: true,
      lastLogin: new Date().toISOString()
    },
    addresses: [
      {
        id: 'address-1',
        fullName: 'John Doe',
        streetLine1: '123 Test Street',
        city: 'Testville',
        postalCode: 'TE12 3ST',
        country: 'United Kingdom',
        defaultShippingAddress: true,
        defaultBillingAddress: true
      }
    ]
  };

  const mockCustomerList: Customer[] = [
    mockCustomer,
    {
      id: 'customer-2',
      firstName: 'Jane',
      lastName: 'Smith',
      emailAddress: 'jane.smith@example.com'
    }
  ];

  const mockPaginatedResult: PaginatedResult<Customer> = {
    items: mockCustomerList,
    totalItems: 2,
    currentPage: 1,
    totalPages: 1,
    perPage: 10
  };

  const mockCreateInput: CreateCustomerInput = {
    firstName: 'New',
    lastName: 'Customer',
    emailAddress: 'new.customer@example.com',
    phoneNumber: '+44987654321'
  };

  const mockUpdateInput: UpdateCustomerInput = {
    id: 'customer-1',
    lastName: 'Updated',
    phoneNumber: '+44555555555'
  };

  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
    
    // Create a fresh mock repository
    mockCustomerRepository = {
      findById: jest.fn().mockResolvedValue(mockCustomer),
      findAll: jest.fn().mockResolvedValue(mockCustomerList),
      create: jest.fn().mockResolvedValue(mockCustomer),
      update: jest.fn().mockResolvedValue({...mockCustomer, lastName: 'Updated'}),
      delete: jest.fn().mockResolvedValue(true),
      findWithPagination: jest.fn().mockResolvedValue(mockPaginatedResult)
    } as unknown as jest.Mocked<CustomerRepository>;
    
    // Initialize the service with the mock repository
    customerService = new CustomerService(mockCustomerRepository);
  });

  describe('getById', () => {
    it('should call repository findById with provided id', async () => {
      const result = await customerService.getById('customer-1');
      
      expect(mockCustomerRepository.findById).toHaveBeenCalledWith('customer-1');
      expect(result).toEqual(mockCustomer);
    });
  });

  describe('getAll', () => {
    it('should call repository findAll', async () => {
      const result = await customerService.getAll();
      
      expect(mockCustomerRepository.findAll).toHaveBeenCalled();
      expect(result).toEqual(mockCustomerList);
    });

    it('should pass filter to repository findAll', async () => {
      const filter = { firstName: { eq: 'John' } };
      await customerService.getAll(filter);
      
      expect(mockCustomerRepository.findAll).toHaveBeenCalledWith(filter);
    });
  });

  describe('getPaginated', () => {
    it('should call repository findWithPagination with options', async () => {
      const options = { take: 10, skip: 0 };
      const result = await customerService.getPaginated(options);
      
      expect(mockCustomerRepository.findWithPagination).toHaveBeenCalledWith(options);
      expect(result).toEqual(mockPaginatedResult);
    });
  });

  describe('createCustomer', () => {
    it('should call repository create with input', async () => {
      await customerService.createCustomer(mockCreateInput);
      
      expect(mockCustomerRepository.create).toHaveBeenCalledWith(mockCreateInput);
    });
  });

  describe('updateCustomer', () => {
    it('should call repository update with id and data', async () => {
      const { id, ...data } = mockUpdateInput;
      await customerService.updateCustomer(mockUpdateInput);
      
      expect(mockCustomerRepository.update).toHaveBeenCalledWith(id, data);
    });
  });

  describe('getCustomerByEmail', () => {
    it('should filter customers by email', async () => {
      const email = 'john.doe@example.com';
      
      // Mock filtered result
      mockCustomerRepository.findAll.mockResolvedValueOnce([mockCustomer]);
      
      const result = await customerService.getCustomerByEmail(email);
      
      expect(mockCustomerRepository.findAll).toHaveBeenCalledWith({
        emailAddress: { eq: email }
      });
      expect(result).toEqual(mockCustomer);
    });

    it('should return null if no customer found with email', async () => {
      mockCustomerRepository.findAll.mockResolvedValueOnce([]);
      
      const result = await customerService.getCustomerByEmail('nonexistent@example.com');
      
      expect(result).toBeNull();
    });
  });

  describe('searchCustomers', () => {
    it('should call repository findWithPagination with search options', async () => {
      const searchTerm = 'John';
      const options = { take: 10 };
      
      await customerService.searchCustomers(searchTerm, options);
      
      expect(mockCustomerRepository.findWithPagination).toHaveBeenCalledWith({
        ...options,
        filter: {
          or: [
            { firstName: { contains: searchTerm } },
            { lastName: { contains: searchTerm } },
            { emailAddress: { contains: searchTerm } }
          ]
        }
      });
    });
  });
});
