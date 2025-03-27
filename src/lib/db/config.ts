
import mysql from 'mysql2/promise';

// Функція для створення пулу підключень до бази даних
export const createPool = () => {
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
};

// Експортуємо пул підключень як синглтон
export const pool = createPool();

// Функція для виконання SQL-запитів
export async function query<T = any>(sql: string, params?: any[]): Promise<T[]> {
  try {
    const [rows] = await pool.execute(sql, params);
    return rows as T[];
  } catch (error) {
    console.error('Помилка виконання SQL-запиту:', error);
    throw error;
  }
}

// Функція для отримання одного запису
export async function queryOne<T = any>(sql: string, params?: any[]): Promise<T | null> {
  const results = await query<T>(sql, params);
  return results.length > 0 ? results[0] : null;
}
