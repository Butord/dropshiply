
import { query, queryOne } from '../config';
import { Category } from '../../types';
import { v4 as uuidv4 } from 'uuid';

export class CategoryModel {
  // Отримати всі категорії
  static async getAll(): Promise<Category[]> {
    const categories = await query<Category>('SELECT * FROM categories');
    return categories;
  }

  // Отримати категорію за id
  static async getById(id: string): Promise<Category | null> {
    return await queryOne<Category>('SELECT * FROM categories WHERE id = ?', [id]);
  }

  // Отримати категорію за slug
  static async getBySlug(slug: string): Promise<Category | null> {
    return await queryOne<Category>('SELECT * FROM categories WHERE slug = ?', [slug]);
  }

  // Створити нову категорію
  static async create(category: Omit<Category, 'id'>): Promise<Category> {
    const id = uuidv4();
    
    await query(`
      INSERT INTO categories (id, name, slug, description, image)
      VALUES (?, ?, ?, ?, ?)
    `, [id, category.name, category.slug, category.description || null, category.image || null]);

    return {
      id,
      ...category
    };
  }

  // Оновити категорію
  static async update(id: string, category: Partial<Category>): Promise<boolean> {
    try {
      const updateFields = [];
      const updateValues = [];

      if (category.name !== undefined) {
        updateFields.push('name = ?');
        updateValues.push(category.name);
      }
      if (category.slug !== undefined) {
        updateFields.push('slug = ?');
        updateValues.push(category.slug);
      }
      if (category.description !== undefined) {
        updateFields.push('description = ?');
        updateValues.push(category.description);
      }
      if (category.image !== undefined) {
        updateFields.push('image = ?');
        updateValues.push(category.image);
      }

      if (updateFields.length > 0) {
        await query(
          `UPDATE categories SET ${updateFields.join(', ')} WHERE id = ?`,
          [...updateValues, id]
        );
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Помилка оновлення категорії:', error);
      return false;
    }
  }

  // Видалити категорію
  static async delete(id: string): Promise<boolean> {
    try {
      await query('DELETE FROM categories WHERE id = ?', [id]);
      return true;
    } catch (error) {
      console.error('Помилка видалення категорії:', error);
      return false;
    }
  }
}
