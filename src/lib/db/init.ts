
import { query } from './config';

// SQL-запити для створення таблиць
const CREATE_PRODUCTS_TABLE = `
CREATE TABLE IF NOT EXISTS products (
  id VARCHAR(36) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  compareAtPrice DECIMAL(10, 2),
  category VARCHAR(255),
  sku VARCHAR(100),
  stock INT NOT NULL DEFAULT 0,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
)`;

const CREATE_PRODUCT_IMAGES_TABLE = `
CREATE TABLE IF NOT EXISTS product_images (
  id VARCHAR(36) PRIMARY KEY,
  productId VARCHAR(36) NOT NULL,
  url VARCHAR(255) NOT NULL,
  sortOrder INT NOT NULL DEFAULT 0,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (productId) REFERENCES products(id) ON DELETE CASCADE
)`;

const CREATE_CATEGORIES_TABLE = `
CREATE TABLE IF NOT EXISTS categories (
  id VARCHAR(36) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL UNIQUE,
  description TEXT,
  image VARCHAR(255),
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
)`;

const CREATE_PRODUCT_TAGS_TABLE = `
CREATE TABLE IF NOT EXISTS product_tags (
  productId VARCHAR(36) NOT NULL,
  tag VARCHAR(100) NOT NULL,
  PRIMARY KEY (productId, tag),
  FOREIGN KEY (productId) REFERENCES products(id) ON DELETE CASCADE
)`;

const CREATE_XML_SOURCES_TABLE = `
CREATE TABLE IF NOT EXISTS xml_sources (
  id VARCHAR(36) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  url VARCHAR(2000) NOT NULL,
  lastImport TIMESTAMP NULL,
  updateSchedule VARCHAR(255) NULL,
  mappingSchema JSON NOT NULL,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
)`;

const CREATE_CUSTOMERS_TABLE = `
CREATE TABLE IF NOT EXISTS customers (
  id VARCHAR(36) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  phone VARCHAR(50),
  street VARCHAR(255),
  city VARCHAR(255),
  state VARCHAR(100),
  postalCode VARCHAR(20),
  country VARCHAR(100),
  status ENUM('active', 'inactive') DEFAULT 'active',
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
)`;

const CREATE_ORDERS_TABLE = `
CREATE TABLE IF NOT EXISTS orders (
  id VARCHAR(36) PRIMARY KEY,
  orderNumber VARCHAR(50) NOT NULL UNIQUE,
  customerId VARCHAR(36) NOT NULL,
  subtotal DECIMAL(10, 2) NOT NULL,
  tax DECIMAL(10, 2) NOT NULL,
  shipping DECIMAL(10, 2) NOT NULL,
  discount DECIMAL(10, 2) NOT NULL,
  total DECIMAL(10, 2) NOT NULL,
  paymentMethod VARCHAR(50) NOT NULL,
  paymentStatus ENUM('pending', 'paid', 'failed', 'refunded') NOT NULL,
  fulfillmentStatus ENUM('unfulfilled', 'processing', 'shipped', 'delivered', 'cancelled', 'returned') NOT NULL,
  shippingStreet VARCHAR(255) NOT NULL,
  shippingCity VARCHAR(255) NOT NULL,
  shippingState VARCHAR(100) NOT NULL,
  shippingPostalCode VARCHAR(20) NOT NULL,
  shippingCountry VARCHAR(100) NOT NULL,
  billingStreet VARCHAR(255),
  billingCity VARCHAR(255),
  billingState VARCHAR(100),
  billingPostalCode VARCHAR(20),
  billingCountry VARCHAR(100),
  notes TEXT,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (customerId) REFERENCES customers(id)
)`;

const CREATE_ORDER_ITEMS_TABLE = `
CREATE TABLE IF NOT EXISTS order_items (
  id VARCHAR(36) PRIMARY KEY,
  orderId VARCHAR(36) NOT NULL,
  productId VARCHAR(36) NOT NULL,
  name VARCHAR(255) NOT NULL,
  quantity INT NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  total DECIMAL(10, 2) NOT NULL,
  FOREIGN KEY (orderId) REFERENCES orders(id) ON DELETE CASCADE,
  FOREIGN KEY (productId) REFERENCES products(id)
)`;

// Функція для ініціалізації бази даних
export async function initializeDatabase() {
  try {
    console.log('Початок ініціалізації бази даних...');
    
    // Створення таблиць
    await query(CREATE_PRODUCTS_TABLE);
    await query(CREATE_PRODUCT_IMAGES_TABLE);
    await query(CREATE_CATEGORIES_TABLE);
    await query(CREATE_PRODUCT_TAGS_TABLE);
    await query(CREATE_XML_SOURCES_TABLE);
    await query(CREATE_CUSTOMERS_TABLE);
    await query(CREATE_ORDERS_TABLE);
    await query(CREATE_ORDER_ITEMS_TABLE);
    
    console.log('База даних успішно ініціалізована');
    return true;
  } catch (error) {
    console.error('Помилка ініціалізації бази даних:', error);
    return false;
  }
}
