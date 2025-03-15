/**
 * GraphQL query for getting a paginated list of products
 */
export const GET_PRODUCTS = `
  query GetProducts($options: ProductListOptions) {
    products(options: $options) {
      items {
        id
        name
        slug
        description
        enabled
        featuredAsset {
          id
          preview
        }
        variants {
          id
          name
          price
          sku
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
 * GraphQL query for getting a single product by ID
 */
export const GET_PRODUCT = `
  query GetProduct($id: ID!) {
    product(id: $id) {
      id
      name
      slug
      description
      enabled
      featuredAsset {
        id
        preview
      }
      assets {
        id
        preview
        source
      }
      variants {
        id
        name
        price
        sku
        stockLevel
        stockOnHand
        assets {
          id
          preview
        }
      }
    }
  }
`;

/**
 * GraphQL mutation for creating a product
 */
export const CREATE_PRODUCT = `
  mutation CreateProduct($input: CreateProductInput!) {
    createProduct(input: $input) {
      id
      name
      slug
      description
      enabled
    }
  }
`;

/**
 * GraphQL mutation for updating a product
 */
export const UPDATE_PRODUCT = `
  mutation UpdateProduct($input: UpdateProductInput!) {
    updateProduct(input: $input) {
      id
      name
      slug
      description
      enabled
    }
  }
`;

/**
 * GraphQL mutation for deleting a product
 */
export const DELETE_PRODUCT = `
  mutation DeleteProduct($id: ID!) {
    deleteProduct(id: $id) {
      result
      message
      success
    }
  }
`;
