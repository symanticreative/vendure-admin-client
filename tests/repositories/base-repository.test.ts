import { GraphQLClientService } from '../../src/core/graphql/graphql-client.service';
import { TestRepository, TestPaginatedRepository, TestEntity } from './base/test-repository';

// Mock GraphQLClientService
jest.mock('../../src/core/graphql/graphql-client.service');

describe('BaseRepository', () => {
  let testRepository: TestRepository;
  let mockGraphQLClient: jest.Mocked<GraphQLClientService>;

  const mockEntity: TestEntity = {
    id: 'test-1',
    name: 'Test Entity',
    description: 'This is a test entity'
  };

  const mockEntityList: TestEntity[] = [
    mockEntity,
    {
      id: 'test-2',
      name: 'Another Test Entity'
    }
  ];

  beforeEach(() => {
    jest.clearAllMocks();

    // Create a mock GraphQLClient
    mockGraphQLClient = {
      query: jest.fn().mockImplementation((query) => {
        // Mock response based on query
        if (query.includes('GetTest')) {
          return Promise.resolve({ test: mockEntity });
        } else if (query.includes('GetTests')) {
          return Promise.resolve({ tests: mockEntityList });
        } else if (query.includes('GetTestsWithPagination')) {
          return Promise.resolve({
            tests: {
              items: mockEntityList,
              totalItems: 2,
              currentPage: 1,
              totalPages: 1,
              perPage: 10
            }
          });
        }
        return Promise.resolve({});
      }),
      mutate: jest.fn().mockImplementation((mutation) => {
        // Mock response based on mutation
        if (mutation.includes('CreateTest')) {
          return Promise.resolve({ createTest: mockEntity });
        } else if (mutation.includes('UpdateTest')) {
          return Promise.resolve({ updateTest: { ...mockEntity, name: 'Updated Entity' } });
        } else if (mutation.includes('DeleteTest')) {
          return Promise.resolve({ deleteTest: { success: true } });
        }
        return Promise.resolve({});
      })
    } as unknown as jest.Mocked<GraphQLClientService>;

    // Initialize repository with mock client
    testRepository = new TestRepository(mockGraphQLClient);
    
    // Override the getResultByPath method for testing
    testRepository['getResultByPath'] = jest.fn().mockImplementation((result, path) => {
      if (path === 'test') return mockEntity;
      if (path === 'tests') return mockEntityList;
      if (path === 'createTest') return mockEntity;
      if (path === 'updateTest') return { ...mockEntity, name: 'Updated Entity' };
      if (path === 'deleteTest.success') return true;
      return result;
    });
  });

  describe('findById', () => {
    it('should call query with correct parameters and return the entity', async () => {
      const result = await testRepository.findById('test-1');

      expect(mockGraphQLClient.query).toHaveBeenCalledWith(
        expect.stringContaining('GetTest'),
        { id: 'test-1' }
      );
      expect(result).toEqual(mockEntity);
    });
  });

  describe('findAll', () => {
    it('should call query with correct parameters and return entities', async () => {
      const result = await testRepository.findAll();

      expect(mockGraphQLClient.query).toHaveBeenCalledWith(
        expect.stringContaining('GetTests'),
        { filter: undefined }
      );
      expect(result).toEqual(mockEntityList);
    });

    it('should pass filter to the query', async () => {
      const filter = { name: { contains: 'Test' } };
      await testRepository.findAll(filter);

      expect(mockGraphQLClient.query).toHaveBeenCalledWith(
        expect.stringContaining('GetTests'),
        { filter }
      );
    });
  });

  describe('create', () => {
    it('should call mutate with correct parameters and return the entity', async () => {
      const input = { name: 'New Entity', description: 'A new entity description' };
      const result = await testRepository.create(input);

      expect(mockGraphQLClient.mutate).toHaveBeenCalledWith(
        expect.stringContaining('CreateTest'),
        { input }
      );
      expect(result).toEqual(mockEntity);
    });
  });

  describe('update', () => {
    it('should call mutate with correct parameters and return the updated entity', async () => {
      const id = 'test-1';
      const data = { name: 'Updated Entity' };
      const result = await testRepository.update(id, data);

      expect(mockGraphQLClient.mutate).toHaveBeenCalledWith(
        expect.stringContaining('UpdateTest'),
        { input: { id, ...data } }
      );
      expect(result).toEqual({ ...mockEntity, name: 'Updated Entity' });
    });
  });

  describe('delete', () => {
    it('should call mutate with correct parameters and return success status', async () => {
      const result = await testRepository.delete('test-1');

      expect(mockGraphQLClient.mutate).toHaveBeenCalledWith(
        expect.stringContaining('DeleteTest'),
        { id: 'test-1' }
      );
      expect(result).toBe(true);
    });
  });

  describe('getResultByPath', () => {
    it('should extract data from nested paths', () => {
      const data = {
        level1: {
          level2: {
            level3: 'value'
          }
        }
      };
      
      const originalGetResultByPath = testRepository['getResultByPath'];
      testRepository['getResultByPath'] = jest.requireActual('../../src/repositories/base.repository').BaseRepository.prototype.getResultByPath;

      // @ts-ignore - accessing protected method
      const result = testRepository['getResultByPath'](data, 'level1.level2.level3');
      
      // Restore mock
      testRepository['getResultByPath'] = originalGetResultByPath;
      
      expect(result).toBe('value');
    });

    it('should handle empty paths', () => {
      const data = { value: 'test' };
      
      const originalGetResultByPath = testRepository['getResultByPath'];
      testRepository['getResultByPath'] = jest.requireActual('../../src/repositories/base.repository').BaseRepository.prototype.getResultByPath;

      // @ts-ignore - accessing protected method
      const result = testRepository['getResultByPath'](data, '');
      
      // Restore mock
      testRepository['getResultByPath'] = originalGetResultByPath;
      
      expect(result).toEqual(data);
    });

    it('should handle null or undefined values', () => {
      const data = { level1: null };
      
      const originalGetResultByPath = testRepository['getResultByPath'];
      testRepository['getResultByPath'] = jest.requireActual('../../src/repositories/base.repository').BaseRepository.prototype.getResultByPath;

      // @ts-ignore - accessing protected method
      const result = testRepository['getResultByPath'](data, 'level1.level2');
      
      // Restore mock
      testRepository['getResultByPath'] = originalGetResultByPath;
      
      expect(result).toBeNull();
    });
  });
});

describe('BasePaginatedRepository', () => {
  let testRepository: TestPaginatedRepository;
  let mockGraphQLClient: jest.Mocked<GraphQLClientService>;

  const mockEntity: TestEntity = {
    id: 'test-1',
    name: 'Test Entity',
    description: 'This is a test entity'
  };

  const mockEntityList: TestEntity[] = [
    mockEntity,
    {
      id: 'test-2',
      name: 'Another Test Entity'
    }
  ];

  const mockPaginatedResult = {
    items: mockEntityList,
    totalItems: 2,
    currentPage: 1,
    totalPages: 1,
    perPage: 10
  };

  beforeEach(() => {
    jest.clearAllMocks();

    // Create a mock GraphQLClient
    mockGraphQLClient = {
      query: jest.fn().mockImplementation((query) => {
        // Mock response based on query
        if (query.includes('GetTestsWithPagination')) {
          return Promise.resolve({ tests: mockPaginatedResult });
        }
        return Promise.resolve({});
      })
    } as unknown as jest.Mocked<GraphQLClientService>;

    // Initialize repository with mock client
    testRepository = new TestPaginatedRepository(mockGraphQLClient);
    
    // Override the getResultByPath method for testing
    testRepository['getResultByPath'] = jest.fn().mockImplementation((result, path) => {
      if (path === 'tests') return mockPaginatedResult;
      return result;
    });
  });

  describe('findWithPagination', () => {
    it('should call query with correct parameters and return paginated result', async () => {
      const options = { take: 10, skip: 0 };
      const result = await testRepository.findWithPagination(options);

      expect(mockGraphQLClient.query).toHaveBeenCalledWith(
        expect.stringContaining('GetTestsWithPagination'),
        { options }
      );
      expect(result).toEqual(mockPaginatedResult);
    });

    it('should include filter in options if provided', async () => {
      const options = {
        take: 10,
        skip: 0,
        filter: { name: { contains: 'test' } }
      };
      await testRepository.findWithPagination(options);

      expect(mockGraphQLClient.query).toHaveBeenCalledWith(
        expect.stringContaining('GetTestsWithPagination'),
        { options }
      );
    });

    it('should include sort in options if provided', async () => {
      const options = {
        take: 10,
        skip: 0,
        sort: { name: 'ASC' as const }
      };
      await testRepository.findWithPagination(options);

      expect(mockGraphQLClient.query).toHaveBeenCalledWith(
        expect.stringContaining('GetTestsWithPagination'),
        { options }
      );
    });
  });
});
