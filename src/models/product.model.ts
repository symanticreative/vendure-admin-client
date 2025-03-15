/**
 * Product interface
 */
export interface Product {
  id: string;
  name: string;
  slug: string;
  description?: string;
  enabled: boolean;
  variants?: ProductVariant[];
  featuredAsset?: Asset;
  assets?: Asset[];
  [key: string]: any;
}

/**
 * Product variant interface
 */
export interface ProductVariant {
  id: string;
  name: string;
  sku: string;
  price: number;
  stockLevel?: string;
  stockOnHand?: number;
  assets?: Asset[];
  [key: string]: any;
}

/**
 * Asset interface
 */
export interface Asset {
  id: string;
  preview: string;
  source?: string;
  [key: string]: any;
}

/**
 * Product creation input
 */
export interface CreateProductInput {
  name: string;
  slug: string;
  description?: string;
  [key: string]: any;
}

/**
 * Product update input
 */
export interface UpdateProductInput extends Partial<Omit<Product, 'id'>> {
  id: string;
}
