/**
 * GraphQL query for getting a paginated list of orders
 */
export const GET_ORDERS = `
  query GetOrders($options: OrderListOptions) {
    orders(options: $options) {
      items {
        id
        code
        state
        total
        currencyCode
        customer {
          id
          firstName
          lastName
          emailAddress
        }
        shippingAddress {
          fullName
          streetLine1
          streetLine2
          city
          province
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
 * GraphQL query for getting a single order by ID
 */
export const GET_ORDER = `
  query GetOrder($id: ID!) {
    order(id: $id) {
      id
      code
      state
      active
      total
      currencyCode
      customer {
        id
        firstName
        lastName
        emailAddress
        phoneNumber
      }
      lines {
        id
        productVariant {
          id
          name
          sku
          product {
            id
            name
            slug
          }
        }
        unitPrice
        quantity
        totalPrice
      }
      shippingAddress {
        fullName
        company
        streetLine1
        streetLine2
        city
        province
        postalCode
        country
        phoneNumber
      }
      billingAddress {
        fullName
        company
        streetLine1
        streetLine2
        city
        province
        postalCode
        country
        phoneNumber
      }
      payments {
        id
        amount
        method
        state
        transactionId
        metadata
      }
      fulfillments {
        id
        state
        method
        trackingCode
      }
    }
  }
`;

/**
 * GraphQL mutation for updating an order's status
 */
export const UPDATE_ORDER_STATUS = `
  mutation TransitionOrderToState($id: ID!, $state: String!) {
    transitionOrderToState(id: $id, state: $state) {
      id
      code
      state
    }
  }
`;
