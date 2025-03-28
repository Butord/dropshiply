
import { query, queryOne } from '../config';
import { XMLSource } from '../../types';
import { v4 as uuidv4 } from 'uuid';

export class XMLSourceModel {
  // Отримати всі джерела XML
  static async getAll(): Promise<XMLSource[]> {
    const sources = await query<XMLSource>('SELECT * FROM xml_sources');
    
    return sources.map(source => ({
      ...source,
      mappingSchema: typeof source.mappingSchema === 'string' 
        ? JSON.parse(source.mappingSchema) 
        : source.mappingSchema,
      lastImport: source.lastImport ? new Date(source.lastImport).toISOString() : undefined
    }));
  }

  // Отримати джерело XML за id
  static async getById(id: string): Promise<XMLSource | null> {
    const source = await queryOne<XMLSource>('SELECT * FROM xml_sources WHERE id = ?', [id]);
    
    if (!source) return null;
    
    return {
      ...source,
      mappingSchema: typeof source.mappingSchema === 'string' 
        ? JSON.parse(source.mappingSchema) 
        : source.mappingSchema,
      lastImport: source.lastImport ? new Date(source.lastImport).toISOString() : undefined
    };
  }

  // Створити нове джерело XML
  static async create(source: Omit<XMLSource, 'id'>): Promise<XMLSource> {
    const id = uuidv4();
    
    await query(`
      INSERT INTO xml_sources (id, name, url, updateSchedule, mappingSchema)
      VALUES (?, ?, ?, ?, ?)
    `, [
      id, 
      source.name, 
      source.url, 
      source.updateSchedule || null, 
      JSON.stringify(source.mappingSchema)
    ]);

    return {
      id,
      ...source
    };
  }

  // Оновити джерело XML
  static async update(id: string, source: Partial<XMLSource>): Promise<boolean> {
    try {
      const updateFields = [];
      const updateValues = [];

      if (source.name !== undefined) {
        updateFields.push('name = ?');
        updateValues.push(source.name);
      }
      if (source.url !== undefined) {
        updateFields.push('url = ?');
        updateValues.push(source.url);
      }
      if (source.updateSchedule !== undefined) {
        updateFields.push('updateSchedule = ?');
        updateValues.push(source.updateSchedule);
      }
      if (source.lastImport !== undefined) {
        updateFields.push('lastImport = ?');
        updateValues.push(source.lastImport);
      }
      if (source.mappingSchema !== undefined) {
        updateFields.push('mappingSchema = ?');
        updateValues.push(JSON.stringify(source.mappingSchema));
      }

      if (updateFields.length > 0) {
        await query(
          `UPDATE xml_sources SET ${updateFields.join(', ')} WHERE id = ?`,
          [...updateValues, id]
        );
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Помилка оновлення джерела XML:', error);
      return false;
    }
  }

  // Видалити джерело XML
  static async delete(id: string): Promise<boolean> {
    try {
      await query('DELETE FROM xml_sources WHERE id = ?', [id]);
      return true;
    } catch (error) {
      console.error('Помилка видалення джерела XML:', error);
      return false;
    }
  }

  // Оновити дату останнього імпорту
  static async updateLastImport(id: string): Promise<boolean> {
    try {
      await query('UPDATE xml_sources SET lastImport = NOW() WHERE id = ?', [id]);
      return true;
    } catch (error) {
      console.error('Помилка оновлення дати імпорту:', error);
      return false;
    }
  }
}
