import { VendureAdminClientConfig } from '../core/config/client-config';
import { GraphQLClientService } from '../core/graphql/graphql-client.service';
import { Container } from '../core/di/container';
import { AuthService } from '../services/auth.service';
import { ProductService } from '../services/product.service';
import { OrderService } from '../services/order.service';
import { CustomerService } from '../services/customer.service';
import { SettingsService } from '../services/settings.service';
import { AuthRepository } from '../repositories/auth.repository';
import { ProductRepository } from '../repositories/product.repository';
import { OrderRepository } from '../repositories/order.repository';
import { CustomerRepository } from '../repositories/customer.repository';
import { SettingsRepository } from '../repositories/settings.repository';

/**
 * Main client class for interacting with the Vendure Admin API
 * Provides access to all service modules via a clean, fluent interface
 */
export class VendureAdminClient {
  /**
   * Authentication service
   */
  public readonly auth: AuthService;

  /**
   * Product service
   */
  public readonly products: ProductService;

  /**
   * Order service
   */
  public readonly orders: OrderService;

  /**
   * Customer service
   */
  public readonly customers: CustomerService;

  /**
   * Settings service
   */
  public readonly settings: SettingsService;

  /**
   * GraphQL client service
   */
  private readonly graphQLClient: GraphQLClientService;

  /**
   * Dependency injection container
   */
  private readonly container: Container;

  /**
   * Initialize the client with configuration
   * @param config - Client configuration
   */
  constructor(config: VendureAdminClientConfig) {
    this.container = Container.getInstance();
    
    // Initialize GraphQL client
    this.graphQLClient = new GraphQLClientService(config);
    this.container.register('GraphQLClientService', this.graphQLClient);
    
    // Initialize repositories
    const authRepository = new AuthRepository(this.graphQLClient);
    const productRepository = new ProductRepository(this.graphQLClient);
    const orderRepository = new OrderRepository(this.graphQLClient);
    const customerRepository = new CustomerRepository(this.graphQLClient);
    const settingsRepository = new SettingsRepository(this.graphQLClient);
    
    this.container.register('AuthRepository', authRepository);
    this.container.register('ProductRepository', productRepository);
    this.container.register('OrderRepository', orderRepository);
    this.container.register('CustomerRepository', customerRepository);
    this.container.register('SettingsRepository', settingsRepository);
    
    // Initialize services
    this.auth = new AuthService(authRepository);
    this.products = new ProductService(productRepository);
    this.orders = new OrderService(orderRepository);
    this.customers = new CustomerService(customerRepository);
    this.settings = new SettingsService(settingsRepository);
    
    this.container.register('AuthService', this.auth);
    this.container.register('ProductService', this.products);
    this.container.register('OrderService', this.orders);
    this.container.register('CustomerService', this.customers);
    this.container.register('SettingsService', this.settings);
  }
}
