import { VendureAdminClient } from '../src/client/vendure-admin-client';

describe('VendureAdminClient', () => {
  const apiUrl = 'https://example.com/admin-api';
  let client: VendureAdminClient;

  beforeEach(() => {
    client = new VendureAdminClient({ apiUrl });
  });

  it('should initialize without an auth token', () => {
    expect(client.getAuthToken()).toBeNull();
    expect(client.isAuthenticated()).toBe(false);
  });

  it('should initialize with an auth token', () => {
    const tokenClient = new VendureAdminClient({ 
      apiUrl, 
      authToken: 'test-token' 
    });
    
    expect(tokenClient.getAuthToken()).toBe('test-token');
    expect(tokenClient.isAuthenticated()).toBe(true);
  });

  it('should set auth token', () => {
    client.setAuthToken('new-token');
    
    expect(client.getAuthToken()).toBe('new-token');
    expect(client.isAuthenticated()).toBe(true);
  });

  it('should clear auth token on logout', () => {
    client.setAuthToken('test-token');
    client.logout();
    
    expect(client.getAuthToken()).toBeNull();
    expect(client.isAuthenticated()).toBe(false);
  });

  it('should login and set token', async () => {
    const response = await client.login('admin', 'password');
    
    expect(response.token).toBeDefined();
    expect(response.expires).toBeDefined();
    expect(client.getAuthToken()).toBe(response.token);
    expect(client.isAuthenticated()).toBe(true);
  });

  it('should execute a query', async () => {
    const result = await client.query('{ test }');
    
    expect(result).toEqual({ success: true });
  });

  it('should execute a mutation', async () => {
    const result = await client.mutate('mutation { test }');
    
    expect(result).toEqual({ success: true });
  });
});
