
// Conditional import for mysql2 - only used on the server side
let mysql: any = null;
try {
  // This will only work in a Node.js environment
  if (typeof window === 'undefined') {
    mysql = require('mysql2/promise');
  }
} catch (error) {
  console.warn('MySQL module not available in browser environment');
}

// Pool for database connections
let poolInstance: any = null;

// Function to create a pool of database connections
export const createPool = () => {
  // Only create pool in Node.js environment
  if (typeof window === 'undefined' && mysql) {
    return mysql.createPool({
      host: process.env.VITE_DB_HOST || 'localhost',
      port: Number(process.env.VITE_DB_PORT) || 3306,
      user: process.env.VITE_DB_USER || 'dropshiply_user',
      password: process.env.VITE_DB_PASSWORD || 'dropshiply_password',
      database: process.env.VITE_DB_NAME || 'dropshiply',
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0
    });
  }
  return null;
};

// Export pool as a singleton
export const getPool = () => {
  if (!poolInstance && typeof window === 'undefined') {
    poolInstance = createPool();
  }
  return poolInstance;
};

// Function to execute SQL queries
export async function query<T = any>(sql: string, params?: any[]): Promise<T[]> {
  // In browser environment, return mock data
  if (typeof window !== 'undefined') {
    console.warn('Database operations are not supported in browser environment');
    return [] as T[];
  }

  try {
    const pool = getPool();
    if (!pool) {
      throw new Error('Database connection pool not available');
    }
    const [rows] = await pool.execute(sql, params);
    return rows as T[];
  } catch (error) {
    console.error('Помилка виконання SQL-запиту:', error);
    throw error;
  }
}

// Function to get a single record
export async function queryOne<T = any>(sql: string, params?: any[]): Promise<T | null> {
  // In browser environment, return null
  if (typeof window !== 'undefined') {
    console.warn('Database operations are not supported in browser environment');
    return null;
  }

  const results = await query<T>(sql, params);
  return results.length > 0 ? results[0] : null;
}
