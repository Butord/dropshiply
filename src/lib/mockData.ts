
import { Product, Category, XMLSource, User } from './types';

export const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Wireless Noise-Cancelling Headphones',
    description: 'Premium wireless headphones with active noise cancellation for immersive sound experience.',
    price: 299.99,
    compareAtPrice: 349.99,
    images: [
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=1000',
      'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?q=80&w=1000',
    ],
    category: 'Electronics',
    tags: ['headphones', 'wireless', 'noise-cancelling', 'premium'],
    sku: 'WH-1000XM4',
    stock: 45,
    createdAt: '2023-03-15T14:30:00Z',
    updatedAt: '2023-05-20T09:15:00Z',
  },
  {
    id: '2',
    name: 'Ultra-Slim Laptop 15"',
    description: 'Powerful and lightweight laptop with all-day battery life and stunning display.',
    price: 1299.99,
    compareAtPrice: 1499.99,
    images: [
      'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?q=80&w=1000',
      'https://images.unsplash.com/photo-1588702547923-7093a6c3ba33?q=80&w=1000',
    ],
    category: 'Electronics',
    tags: ['laptop', 'ultrabook', 'lightweight', 'powerful'],
    sku: 'UL-15X-PRO',
    stock: 12,
    createdAt: '2023-04-10T11:20:00Z',
    updatedAt: '2023-05-18T13:45:00Z',
  },
  {
    id: '3',
    name: 'Smart Watch Series 5',
    description: 'Advanced health monitoring, fitness tracking, and seamless smartphone integration.',
    price: 399.99,
    images: [
      'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?q=80&w=1000',
      'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?q=80&w=1000',
    ],
    category: 'Wearables',
    tags: ['smartwatch', 'fitness', 'health', 'tech'],
    sku: 'SW-S5-44',
    stock: 38,
    createdAt: '2023-02-05T08:40:00Z',
    updatedAt: '2023-05-15T10:30:00Z',
  },
  {
    id: '4',
    name: 'Premium Wireless Earbuds',
    description: 'Compact earbuds with exceptional sound quality and long battery life.',
    price: 149.99,
    compareAtPrice: 199.99,
    images: [
      'https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?q=80&w=1000',
      'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?q=80&w=1000',
    ],
    category: 'Electronics',
    tags: ['earbuds', 'wireless', 'audio', 'portable'],
    sku: 'PWE-200',
    stock: 27,
    createdAt: '2023-04-22T16:15:00Z',
    updatedAt: '2023-05-21T14:10:00Z',
  },
  {
    id: '5',
    name: 'Smart Home Hub',
    description: 'Control all your smart home devices from one central hub with voice commands.',
    price: 129.99,
    images: [
      'https://images.unsplash.com/photo-1558002038-1055907df827?q=80&w=1000',
      'https://images.unsplash.com/photo-1551808525-3833924f63b3?q=80&w=1000',
    ],
    category: 'Smart Home',
    tags: ['smart home', 'IoT', 'voice control', 'automation'],
    sku: 'SHH-X1',
    stock: 50,
    createdAt: '2023-03-30T09:50:00Z',
    updatedAt: '2023-05-19T11:25:00Z',
  },
  {
    id: '6',
    name: 'Professional Digital Camera',
    description: 'High-resolution camera with advanced features for professional photography.',
    price: 2499.99,
    compareAtPrice: 2799.99,
    images: [
      'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?q=80&w=1000',
      'https://images.unsplash.com/photo-1581591524425-c7e0978865fc?q=80&w=1000',
    ],
    category: 'Photography',
    tags: ['camera', 'professional', 'DSLR', 'high-res'],
    sku: 'PDC-5000D',
    stock: 8,
    createdAt: '2023-01-18T13:20:00Z',
    updatedAt: '2023-05-17T15:40:00Z',
  },
];

export const mockCategories: Category[] = [
  {
    id: '1',
    name: 'Electronics',
    slug: 'electronics',
    description: 'Latest electronic devices and gadgets',
    image: 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?q=80&w=1000',
  },
  {
    id: '2',
    name: 'Wearables',
    slug: 'wearables',
    description: 'Smart watches and fitness trackers',
    image: 'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?q=80&w=1000',
  },
  {
    id: '3',
    name: 'Smart Home',
    slug: 'smart-home',
    description: 'Smart devices for your home',
    image: 'https://images.unsplash.com/photo-1558002038-1055907df827?q=80&w=1000',
  },
  {
    id: '4',
    name: 'Photography',
    slug: 'photography',
    description: 'Cameras and photography equipment',
    image: 'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?q=80&w=1000',
  },
];

export const mockXMLSources: XMLSource[] = [
  {
    id: '1',
    name: 'Electronics Supplier',
    url: 'https://example.com/feeds/electronics.xml',
    lastImport: '2023-05-20T14:30:00Z',
    updateSchedule: '0 0 * * *', // Daily at midnight
    mappingSchema: {
      rootElement: 'products',
      productElement: 'product',
      fieldMappings: {
        id: 'product_id',
        name: 'title',
        description: 'description',
        price: 'price',
        compareAtPrice: 'compare_price',
        images: 'images/image',
        category: 'category',
        tags: 'tags',
        sku: 'sku',
        stock: 'inventory',
      },
      transforms: {
        price: {
          type: 'regex',
          pattern: '[^0-9.]',
          replacement: '',
        },
        tags: {
          type: 'split',
          separator: ',',
        },
      },
    },
  },
  {
    id: '2',
    name: 'Fashion Products',
    url: 'https://example.com/feeds/fashion.xml',
    lastImport: '2023-05-19T10:15:00Z',
    updateSchedule: '0 0 */2 * *', // Every 2 days at midnight
    mappingSchema: {
      rootElement: 'catalog',
      productElement: 'item',
      fieldMappings: {
        id: 'id',
        name: 'product_name',
        description: 'description',
        price: 'price',
        images: 'images/url',
        category: 'category',
        sku: 'article',
        stock: 'quantity',
      },
    },
  },
];

export const mockUsers: User[] = [
  {
    id: '1',
    name: 'Admin User',
    email: 'admin@example.com',
    role: 'admin',
    avatar: 'https://i.pravatar.cc/150?img=1',
  },
  {
    id: '2',
    name: 'Manager User',
    email: 'manager@example.com',
    role: 'manager',
    avatar: 'https://i.pravatar.cc/150?img=2',
  },
];
