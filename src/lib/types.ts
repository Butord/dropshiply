
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

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address?: {
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  orders: number;
  totalSpent: number;
  lastOrderDate: string;
  createdAt: string;
  status: 'active' | 'inactive';
}

// Інтерфейси для налаштувань повідомлень
export interface EmailSettings {
  enabled: boolean;
  senderEmail: string;
  senderName?: string;
  subject: string;
  template: string;
  smtpSettings?: {
    host: string;
    port: number;
    secure: boolean;
    auth: {
      user: string;
      pass: string;
    }
  };
  formSubmitActivated?: boolean;
}

// Новий інтерфейс для налаштувань Telegram
export interface TelegramSettings {
  enabled: boolean;
  botToken: string;
  chatId: string;
  messageTemplate: string;
}

// Інтерфейс для всіх налаштувань сповіщень
export interface NotificationSettings {
  email: EmailSettings;
  telegram: TelegramSettings;
}

// Updating the OrderNotification interface to match how we're using it
export interface OrderNotification {
  orderNumber: string;
  orderId?: string; // Making orderId optional
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  amount: number;
  paymentMethod: string;
  paymentDetails?: string;
  items: {
    name: string;
    quantity: number;
    price: number;
  }[];
}
