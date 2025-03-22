
import { Order } from './types';

export const mockOrders: Order[] = [
  {
    id: '1',
    orderNumber: 'ORD-2023-1001',
    customer: {
      id: 'cust-1',
      name: 'John Doe',
      email: 'john.doe@example.com',
      phone: '+1 555-123-4567'
    },
    products: [
      {
        productId: '1',
        name: 'Wireless Noise-Cancelling Headphones',
        quantity: 1,
        price: 299.99,
        total: 299.99
      },
      {
        productId: '5',
        name: 'Smart Home Hub',
        quantity: 1,
        price: 129.99,
        total: 129.99
      }
    ],
    shippingAddress: {
      street: '123 Main St',
      city: 'New York',
      state: 'NY',
      postalCode: '10001',
      country: 'USA'
    },
    billingAddress: {
      street: '123 Main St',
      city: 'New York',
      state: 'NY',
      postalCode: '10001',
      country: 'USA'
    },
    paymentMethod: 'Credit Card',
    paymentStatus: 'paid',
    fulfillmentStatus: 'delivered',
    subtotal: 429.98,
    tax: 38.70,
    shipping: 15.00,
    discount: 0,
    total: 483.68,
    notes: 'Leave at front door',
    createdAt: '2023-10-15T14:30:00Z',
    updatedAt: '2023-10-15T14:35:00Z'
  },
  {
    id: '2',
    orderNumber: 'ORD-2023-1002',
    customer: {
      id: 'cust-2',
      name: 'Jane Smith',
      email: 'jane.smith@example.com',
      phone: '+1 555-987-6543'
    },
    products: [
      {
        productId: '3',
        name: 'Smart Watch Series 5',
        quantity: 1,
        price: 399.99,
        total: 399.99
      }
    ],
    shippingAddress: {
      street: '456 Oak Ave',
      city: 'Los Angeles',
      state: 'CA',
      postalCode: '90001',
      country: 'USA'
    },
    billingAddress: {
      street: '456 Oak Ave',
      city: 'Los Angeles',
      state: 'CA',
      postalCode: '90001',
      country: 'USA'
    },
    paymentMethod: 'PayPal',
    paymentStatus: 'paid',
    fulfillmentStatus: 'shipped',
    subtotal: 399.99,
    tax: 36.00,
    shipping: 10.00,
    discount: 20.00,
    total: 425.99,
    createdAt: '2023-10-16T09:45:00Z',
    updatedAt: '2023-10-16T10:00:00Z'
  },
  {
    id: '3',
    orderNumber: 'ORD-2023-1003',
    customer: {
      id: 'cust-3',
      name: 'Robert Johnson',
      email: 'robert.johnson@example.com',
      phone: '+1 555-456-7890'
    },
    products: [
      {
        productId: '6',
        name: 'Professional Digital Camera',
        quantity: 1,
        price: 2499.99,
        total: 2499.99
      },
      {
        productId: '4',
        name: 'Premium Wireless Earbuds',
        quantity: 2,
        price: 149.99,
        total: 299.98
      }
    ],
    shippingAddress: {
      street: '789 Pine Blvd',
      city: 'Chicago',
      state: 'IL',
      postalCode: '60007',
      country: 'USA'
    },
    billingAddress: {
      street: '789 Pine Blvd',
      city: 'Chicago',
      state: 'IL',
      postalCode: '60007',
      country: 'USA'
    },
    paymentMethod: 'Credit Card',
    paymentStatus: 'pending',
    fulfillmentStatus: 'processing',
    subtotal: 2799.97,
    tax: 252.00,
    shipping: 0.00, // Free shipping
    discount: 100.00,
    total: 2951.97,
    notes: 'Gift wrap requested',
    createdAt: '2023-10-17T16:20:00Z',
    updatedAt: '2023-10-17T16:25:00Z'
  },
  {
    id: '4',
    orderNumber: 'ORD-2023-1004',
    customer: {
      id: 'cust-4',
      name: 'Maria Garcia',
      email: 'maria.garcia@example.com',
      phone: '+1 555-789-0123'
    },
    products: [
      {
        productId: '2',
        name: 'Ultra-Slim Laptop 15"',
        quantity: 1,
        price: 1299.99,
        total: 1299.99
      }
    ],
    shippingAddress: {
      street: '101 Maple Dr',
      city: 'Miami',
      state: 'FL',
      postalCode: '33101',
      country: 'USA'
    },
    billingAddress: {
      street: '101 Maple Dr',
      city: 'Miami',
      state: 'FL',
      postalCode: '33101',
      country: 'USA'
    },
    paymentMethod: 'Credit Card',
    paymentStatus: 'failed',
    fulfillmentStatus: 'unfulfilled',
    subtotal: 1299.99,
    tax: 117.00,
    shipping: 25.00,
    discount: 0.00,
    total: 1441.99,
    createdAt: '2023-10-18T11:10:00Z',
    updatedAt: '2023-10-18T11:15:00Z'
  },
  {
    id: '5',
    orderNumber: 'ORD-2023-1005',
    customer: {
      id: 'cust-5',
      name: 'David Wilson',
      email: 'david.wilson@example.com',
      phone: '+1 555-234-5678'
    },
    products: [
      {
        productId: '1',
        name: 'Wireless Noise-Cancelling Headphones',
        quantity: 1,
        price: 299.99,
        total: 299.99
      },
      {
        productId: '4',
        name: 'Premium Wireless Earbuds',
        quantity: 1,
        price: 149.99,
        total: 149.99
      }
    ],
    shippingAddress: {
      street: '202 Elm St',
      city: 'Seattle',
      state: 'WA',
      postalCode: '98101',
      country: 'USA'
    },
    billingAddress: {
      street: '202 Elm St',
      city: 'Seattle',
      state: 'WA',
      postalCode: '98101',
      country: 'USA'
    },
    paymentMethod: 'PayPal',
    paymentStatus: 'refunded',
    fulfillmentStatus: 'returned',
    subtotal: 449.98,
    tax: 40.50,
    shipping: 15.00,
    discount: 45.00,
    total: 460.48,
    notes: 'Customer requested refund',
    createdAt: '2023-10-19T15:50:00Z',
    updatedAt: '2023-10-25T09:30:00Z'
  }
];
