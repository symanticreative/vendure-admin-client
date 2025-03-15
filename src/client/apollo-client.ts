import { ApolloClient, InMemoryCache, createHttpLink, from, NormalizedCacheObject } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import fetch from 'cross-fetch';

/**
 * Creates and configures an Apollo Client instance for the Vendure Admin API
 * 
 * @param apiUrl - The URL of the Vendure Admin API
 * @param getAuthToken - Function that returns the current auth token
 * @returns Configured Apollo Client instance
 */
export function createApolloClient(
  apiUrl: string,
  getAuthToken: () => string | null
): ApolloClient<NormalizedCacheObject> {
  // Create HTTP link to the GraphQL endpoint
  const httpLink = createHttpLink({
    uri: apiUrl,
    fetch
  });

  // Add auth token to each request
  const authLink = setContext((_, { headers }) => {
    const token = getAuthToken();
    return {
      headers: {
        ...headers,
        authorization: token ? `Bearer ${token}` : '',
      },
    };
  });

  // Create and return the Apollo Client
  return new ApolloClient({
    link: from([authLink, httpLink]),
    cache: new InMemoryCache(),
    defaultOptions: {
      query: {
        fetchPolicy: 'network-only', // Don't use cache for queries by default
        errorPolicy: 'all'
      },
      mutate: {
        errorPolicy: 'all'
      },
      watchQuery: {
        fetchPolicy: 'network-only',
        errorPolicy: 'all'
      }
    }
  });
}
