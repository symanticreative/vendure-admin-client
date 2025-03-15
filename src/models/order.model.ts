import type { Customer, Address } from './customer.model';

/**
 * Order interface
 */
export interface Order {
  id: string;
  code: string;
  state: string;
  active: boolean;
  total: number;
  currencyCode: string;
  customer?: Customer;
  lines?: OrderLine[];
  shippingAddress?: Address;
  billingAddress?: Address;
  payments?: Payment[];
  fulfillments?: Fulfillment[];
  [key: string]: any;
}

/**
 * Order line interface
 */
export interface OrderLine {
  id: string;
  productVariant: {
    id: string;
    name: string;
    sku: string;
    product: {
      id: string;
      name: string;
      slug: string;
    };
  };
  unitPrice: number;
  quantity: number;
  totalPrice: number;
  [key: string]: any;
}

/**
 * Payment interface
 */
export interface Payment {
  id: string;
  amount: number;
  method: string;
  state: string;
  transactionId?: string;
  metadata?: Record<string, any>;
  [key: string]: any;
}

/**
 * Fulfillment interface
 */
export interface Fulfillment {
  id: string;
  state: string;
  method: string;
  trackingCode?: string;
  [key: string]: any;
}

/**
 * Order status update input
 */
export interface OrderStatusUpdateInput {
  orderId: string;
  status: string;
}
