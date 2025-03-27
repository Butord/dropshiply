import { query, queryOne } from '../config';
import { Product } from '../../types';
import { v4 as uuidv4 } from 'uuid';

export class ProductModel {
  // Отримати всі товари
  static async getAll(): Promise<Product[]> {
    const result = await query<any>(`
      SELECT p.*, GROUP_CONCAT(DISTINCT pi.url) as images_concat, GROUP_CONCAT(DISTINCT pt.tag) as tags_concat
      FROM products p
      LEFT JOIN product_images pi ON p.id = pi.productId
      LEFT JOIN product_tags pt ON p.id = pt.productId
      GROUP BY p.id
    `);

    return result.map(product => ({
      ...product,
      images: product.images_concat ? product.images_concat.split(',') : [],
      tags: product.tags_concat ? product.tags_concat.split(',') : [],
      createdAt: new Date(product.createdAt).toISOString(),
      updatedAt: new Date(product.updatedAt).toISOString()
    }));
  }

  // Отримати товар за id
  static async getById(id: string): Promise<Product | null> {
    const result = await queryOne<any>(`
      SELECT p.*, GROUP_CONCAT(DISTINCT pi.url) as images_concat, GROUP_CONCAT(DISTINCT pt.tag) as tags_concat
      FROM products p
      LEFT JOIN product_images pi ON p.id = pi.productId
      LEFT JOIN product_tags pt ON p.id = pt.productId
      WHERE p.id = ?
      GROUP BY p.id
    `, [id]);

    if (!result) return null;

    return {
      ...result,
      images: result.images_concat ? result.images_concat.split(',') : [],
      tags: result.tags_concat ? result.tags_concat.split(',') : [],
      createdAt: new Date(result.createdAt).toISOString(),
      updatedAt: new Date(result.updatedAt).toISOString()
    };
  }

  // Створити новий товар
  static async create(product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Promise<Product> {
    const id = uuidv4();
    const now = new Date().toISOString();

    await query(`
      INSERT INTO products (id, name, description, price, compareAtPrice, category, sku, stock)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `, [id, product.name, product.description, product.price, product.compareAtPrice, product.category, product.sku, product.stock]);

    // Додаємо зображення
    if (product.images && product.images.length > 0) {
      for (let i = 0; i < product.images.length; i++) {
        await query(`
          INSERT INTO product_images (id, productId, url, sortOrder)
          VALUES (?, ?, ?, ?)
        `, [uuidv4(), id, product.images[i], i]);
      }
    }

    // Додаємо теги
    if (product.tags && product.tags.length > 0) {
      for (const tag of product.tags) {
        await query(`
          INSERT INTO product_tags (productId, tag)
          VALUES (?, ?)
        `, [id, tag]);
      }
    }

    return {
      id,
      ...product,
      createdAt: now,
      updatedAt: now
    };
  }

  // Оновити товар
  static async update(id: string, product: Partial<Product>): Promise<boolean> {
    try {
      // Починаємо транзакцію
      await query('START TRANSACTION');

      // Оновлюємо основні дані товару
      const updateFields = [];
      const updateValues = [];

      if (product.name !== undefined) {
        updateFields.push('name = ?');
        updateValues.push(product.name);
      }
      if (product.description !== undefined) {
        updateFields.push('description = ?');
        updateValues.push(product.description);
      }
      if (product.price !== undefined) {
        updateFields.push('price = ?');
        updateValues.push(product.price);
      }
      if (product.compareAtPrice !== undefined) {
        updateFields.push('compareAtPrice = ?');
        updateValues.push(product.compareAtPrice);
      }
      if (product.category !== undefined) {
        updateFields.push('category = ?');
        updateValues.push(product.category);
      }
      if (product.sku !== undefined) {
        updateFields.push('sku = ?');
        updateValues.push(product.sku);
      }
      if (product.stock !== undefined) {
        updateFields.push('stock = ?');
        updateValues.push(product.stock);
      }

      if (updateFields.length > 0) {
        await query(
          `UPDATE products SET ${updateFields.join(', ')} WHERE id = ?`,
          [...updateValues, id]
        );
      }

      // Оновлюємо зображення, якщо вони надані
      if (product.images !== undefined) {
        // Видаляємо існуючі зображення
        await query('DELETE FROM product_images WHERE productId = ?', [id]);
        
        // Додаємо нові зображення
        for (let i = 0; i < product.images.length; i++) {
          await query(`
            INSERT INTO product_images (id, productId, url, sortOrder)
            VALUES (?, ?, ?, ?)
          `, [uuidv4(), id, product.images[i], i]);
        }
      }

      // Оновлюємо теги, якщо вони надані
      if (product.tags !== undefined) {
        // Видаляємо існуючі теги
        await query('DELETE FROM product_tags WHERE productId = ?', [id]);
        
        // Додаємо нові теги
        for (const tag of product.tags) {
          await query(`
            INSERT INTO product_tags (productId, tag)
            VALUES (?, ?)
          `, [id, tag]);
        }
      }

      // Підтверджуємо транзакцію
      await query('COMMIT');
      return true;
    } catch (error) {
      // Відміняємо транзакцію у випадку помилки
      await query('ROLLBACK');
      console.error('Помилка оновлення товару:', error);
      return false;
    }
  }

  // Видалити товар
  static async delete(id: string): Promise<boolean> {
    try {
      await query('DELETE FROM products WHERE id = ?', [id]);
      return true;
    } catch (error) {
      console.error('Помилка видалення товару:', error);
      return false;
    }
  }
}
