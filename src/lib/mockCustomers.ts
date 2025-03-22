
import { Customer } from './types';

export const mockCustomers: Customer[] = [
  {
    id: 'cust-1',
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+1 555-123-4567',
    address: {
      street: '123 Main St',
      city: 'New York',
      state: 'NY',
      postalCode: '10001',
      country: 'USA'
    },
    orders: 5,
    totalSpent: 2458.75,
    lastOrderDate: '2023-10-15T14:30:00Z',
    createdAt: '2022-06-12T10:30:00Z',
    status: 'active'
  },
  {
    id: 'cust-2',
    name: 'Jane Smith',
    email: 'jane.smith@example.com',
    phone: '+1 555-987-6543',
    address: {
      street: '456 Oak Ave',
      city: 'Los Angeles',
      state: 'CA',
      postalCode: '90001',
      country: 'USA'
    },
    orders: 3,
    totalSpent: 825.99,
    lastOrderDate: '2023-10-16T09:45:00Z',
    createdAt: '2022-08-25T14:20:00Z',
    status: 'active'
  },
  {
    id: 'cust-3',
    name: 'Robert Johnson',
    email: 'robert.johnson@example.com',
    phone: '+1 555-456-7890',
    address: {
      street: '789 Pine Blvd',
      city: 'Chicago',
      state: 'IL',
      postalCode: '60007',
      country: 'USA'
    },
    orders: 1,
    totalSpent: 2951.97,
    lastOrderDate: '2023-10-17T16:20:00Z',
    createdAt: '2023-05-17T11:15:00Z',
    status: 'active'
  },
  {
    id: 'cust-4',
    name: 'Maria Garcia',
    email: 'maria.garcia@example.com',
    phone: '+1 555-789-0123',
    address: {
      street: '101 Maple Dr',
      city: 'Miami',
      state: 'FL',
      postalCode: '33101',
      country: 'USA'
    },
    orders: 2,
    totalSpent: 1441.99,
    lastOrderDate: '2023-10-18T11:10:00Z',
    createdAt: '2023-01-05T09:30:00Z',
    status: 'inactive'
  },
  {
    id: 'cust-5',
    name: 'David Wilson',
    email: 'david.wilson@example.com',
    phone: '+1 555-234-5678',
    address: {
      street: '202 Elm St',
      city: 'Seattle',
      state: 'WA',
      postalCode: '98101',
      country: 'USA'
    },
    orders: 4,
    totalSpent: 1890.48,
    lastOrderDate: '2023-10-19T15:50:00Z',
    createdAt: '2022-11-12T15:45:00Z',
    status: 'active'
  },
  {
    id: 'cust-6',
    name: 'Emily Brown',
    email: 'emily.brown@example.com',
    phone: '+1 555-345-6789',
    address: {
      street: '303 Cedar Ave',
      city: 'Boston',
      state: 'MA',
      postalCode: '02108',
      country: 'USA'
    },
    orders: 7,
    totalSpent: 3245.65,
    lastOrderDate: '2023-10-20T13:25:00Z',
    createdAt: '2022-04-18T10:20:00Z',
    status: 'active'
  },
  {
    id: 'cust-7',
    name: 'Michael Taylor',
    email: 'michael.taylor@example.com',
    phone: '+1 555-456-7890',
    address: {
      street: '404 Birch St',
      city: 'Philadelphia',
      state: 'PA',
      postalCode: '19102',
      country: 'USA'
    },
    orders: 0,
    totalSpent: 0,
    lastOrderDate: '',
    createdAt: '2023-09-30T16:40:00Z',
    status: 'inactive'
  }
];
