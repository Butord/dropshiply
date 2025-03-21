
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
