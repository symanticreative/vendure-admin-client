/**
 * GraphQL query for getting a paginated list of customers
 */
export const GET_CUSTOMERS = `
  query GetCustomers($options: CustomerListOptions) {
    customers(options: $options) {
      items {
        id
        firstName
        lastName
        emailAddress
        phoneNumber
        user {
          id
          verified
        }
        addresses {
          id
          fullName
          streetLine1
          city
          postalCode
          country
        }
      }
      totalItems
      currentPage
      totalPages
      perPage
    }
  }
`;

/**
 * GraphQL query for getting a single customer by ID
 */
export const GET_CUSTOMER = `
  query GetCustomer($id: ID!) {
    customer(id: $id) {
      id
      firstName
      lastName
      emailAddress
      phoneNumber
      user {
        id
        verified
        lastLogin
      }
      addresses {
        id
        fullName
        company
        streetLine1
        streetLine2
        city
        province
        postalCode
        country
        phoneNumber
        defaultBillingAddress
        defaultShippingAddress
      }
      orders {
        id
        code
        state
        total
        currencyCode
        orderPlacedAt
      }
    }
  }
`;

/**
 * GraphQL mutation for creating a customer
 */
export const CREATE_CUSTOMER = `
  mutation CreateCustomer($input: CreateCustomerInput!) {
    createCustomer(input: $input) {
      customer {
        id
        firstName
        lastName
        emailAddress
        phoneNumber
      }
    }
  }
`;

/**
 * GraphQL mutation for updating a customer
 */
export const UPDATE_CUSTOMER = `
  mutation UpdateCustomer($input: UpdateCustomerInput!) {
    updateCustomer(input: $input) {
      customer {
        id
        firstName
        lastName
        emailAddress
        phoneNumber
      }
    }
  }
`;
