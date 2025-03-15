import { BaseRepository, BasePaginatedRepository } from '../../../src/repositories/base.repository';
import { GraphQLClientService } from '../../../src/core/graphql/graphql-client.service';

// Sample entity for testing
export interface TestEntity {
  id: string;
  name: string;
  description?: string;
}

// Implementation of BaseRepository for TestEntity
export class TestRepository extends BaseRepository<TestEntity, string> {
  constructor(graphqlClient: GraphQLClientService) {
    super(graphqlClient);
  }

  protected getFindByIdQuery(): string {
    return `
      query GetTest($id: ID!) {
        test(id: $id) {
          id
          name
          description
        }
      }
    `;
  }

  protected getFindAllQuery(): string {
    return `
      query GetTests($filter: TestFilterInput) {
        tests(filter: $filter) {
          id
          name
          description
        }
      }
    `;
  }

  protected getCreateMutation(): string {
    return `
      mutation CreateTest($input: CreateTestInput!) {
        createTest(input: $input) {
          id
          name
          description
        }
      }
    `;
  }

  protected getUpdateMutation(): string {
    return `
      mutation UpdateTest($input: UpdateTestInput!) {
        updateTest(input: $input) {
          id
          name
          description
        }
      }
    `;
  }

  protected getDeleteMutation(): string {
    return `
      mutation DeleteTest($id: ID!) {
        deleteTest(id: $id) {
          success
        }
      }
    `;
  }

  protected getFindByIdResultPath(): string {
    return 'test';
  }

  protected getFindAllResultPath(): string {
    return 'tests';
  }

  protected getCreateResultPath(): string {
    return 'createTest';
  }

  protected getUpdateResultPath(): string {
    return 'updateTest';
  }

  protected getDeleteResultPath(): string {
    return 'deleteTest.success';
  }
}

// Implementation of BasePaginatedRepository for TestEntity
export class TestPaginatedRepository extends BasePaginatedRepository<TestEntity, string> {
  constructor(graphqlClient: GraphQLClientService) {
    super(graphqlClient);
  }

  protected getFindByIdQuery(): string {
    return `
      query GetTest($id: ID!) {
        test(id: $id) {
          id
          name
          description
        }
      }
    `;
  }

  protected getFindAllQuery(): string {
    return `
      query GetTests($filter: TestFilterInput) {
        tests(filter: $filter) {
          id
          name
          description
        }
      }
    `;
  }

  protected getCreateMutation(): string {
    return `
      mutation CreateTest($input: CreateTestInput!) {
        createTest(input: $input) {
          id
          name
          description
        }
      }
    `;
  }

  protected getUpdateMutation(): string {
    return `
      mutation UpdateTest($input: UpdateTestInput!) {
        updateTest(input: $input) {
          id
          name
          description
        }
      }
    `;
  }

  protected getDeleteMutation(): string {
    return `
      mutation DeleteTest($id: ID!) {
        deleteTest(id: $id) {
          success
        }
      }
    `;
  }

  protected getFindWithPaginationQuery(): string {
    return `
      query GetTestsWithPagination($options: TestPaginationOptions) {
        tests(options: $options) {
          items {
            id
            name
            description
          }
          totalItems
          currentPage
          totalPages
          perPage
        }
      }
    `;
  }

  protected getFindByIdResultPath(): string {
    return 'test';
  }

  protected getFindAllResultPath(): string {
    return 'tests';
  }

  protected getCreateResultPath(): string {
    return 'createTest';
  }

  protected getUpdateResultPath(): string {
    return 'updateTest';
  }

  protected getDeleteResultPath(): string {
    return 'deleteTest.success';
  }

  protected getFindWithPaginationResultPath(): string {
    return 'tests';
  }
}
