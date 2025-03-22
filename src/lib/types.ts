
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  compareAtPrice?: number;
  images: string[];
  category: string;
  tags: string[];
  sku: string;
  stock: number;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
}

export interface XMLSource {
  id: string;
  name: string;
  url: string;
  lastImport?: string;
  mappingSchema: XMLMapping;
  updateSchedule?: string; // cron format
}

export interface XMLMapping {
  // From XML to our Product format
  rootElement: string;
  productElement: string;
  fieldMappings: {
    id?: string;
    name: string;
    description?: string;
    price: string;
    compareAtPrice?: string;
    images?: string;
    category?: string;
    tags?: string;
    sku?: string;
    stock?: string;
  };
  transforms?: {
    [key: string]: {
      type: 'regex' | 'replace' | 'split' | 'join' | 'custom';
      pattern?: string;
      replacement?: string;
      separator?: string;
      function?: string;
    };
  };
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'manager';
  avatar?: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  customer: {
    id: string;
    name: string;
    email: string;
    phone?: string;
  };
  products: {
    productId: string;
    name: string;
    quantity: number;
    price: number;
    total: number;
  }[];
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  billingAddress?: {
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  paymentMethod: string;
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  fulfillmentStatus: 'unfulfilled' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'returned';
  subtotal: number;
  tax: number;
  shipping: number;
  discount: number;
  total: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}
