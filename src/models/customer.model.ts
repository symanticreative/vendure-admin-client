/**
 * Customer interface
 */
export interface Customer {
  id: string;
  firstName: string;
  lastName: string;
  emailAddress: string;
  phoneNumber?: string;
  user?: {
    id: string;
    verified: boolean;
    lastLogin?: string;
  };
  addresses?: Address[];
  orders?: {
    id: string;
    code: string;
    state: string;
    total: number;
    currencyCode: string;
    orderPlacedAt?: string;
  }[];
  [key: string]: any;
}

/**
 * Address interface
 */
export interface Address {
  id: string;
  fullName: string;
  company?: string;
  streetLine1: string;
  streetLine2?: string;
  city: string;
  province?: string;
  postalCode: string;
  country: string;
  phoneNumber?: string;
  defaultBillingAddress?: boolean;
  defaultShippingAddress?: boolean;
  [key: string]: any;
}

/**
 * Customer creation input
 */
export interface CreateCustomerInput {
  firstName: string;
  lastName: string;
  emailAddress: string;
  phoneNumber?: string;
  [key: string]: any;
}

/**
 * Customer update input
 */
export interface UpdateCustomerInput extends Partial<Omit<Customer, 'id'>> {
  id: string;
}
