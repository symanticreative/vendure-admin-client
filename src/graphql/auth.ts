/**
 * GraphQL mutation for logging in to the Vendure Admin API
 */
export const LOGIN_MUTATION = `
  mutation login($username: String!, $password: String!, $rememberMe: Boolean) {
    login(username: $username, password: $password, rememberMe: $rememberMe) {
      ... on CurrentUser {
        id
        identifier
      }
      ... on ErrorResult {
        errorCode
        message
      }
    }
  }
`;

/**
 * GraphQL mutation for logging out from the Vendure Admin API
 */
export const LOGOUT_MUTATION = `
  mutation logout {
    logout {
      success
    }
  }
`;

/**
 * GraphQL query for getting the current user
 */
export const GET_CURRENT_USER = `
  query getCurrentUser {
    me {
      id
      identifier
      channels {
        id
        code
        token
      }
    }
  }
`;
