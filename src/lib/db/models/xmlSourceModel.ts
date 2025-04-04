
import { query, queryOne } from '../config';
import { XMLSource } from '../../types';
import { v4 as uuidv4 } from 'uuid';
import { parseXmlProducts, saveImportedProducts, analyzeXmlStructure } from '../../importXml';

export class XMLSourceModel {
  // Отримати всі джерела XML
  static async getAll(): Promise<XMLSource[]> {
    try {
      console.log('Отримання списку XML джерел');
      const sources = await query<XMLSource>('SELECT * FROM xml_sources');
      
      return sources.map(source => ({
        ...source,
        mappingSchema: typeof source.mappingSchema === 'string' 
          ? JSON.parse(source.mappingSchema) 
          : source.mappingSchema,
        lastImport: source.lastImport ? new Date(source.lastImport).toISOString() : undefined
      }));
    } catch (error) {
      console.error('Помилка отримання джерел XML:', error);
      return [];
    }
  }

  // Отримати джерело XML за id
  static async getById(id: string): Promise<XMLSource | null> {
    try {
      console.log(`Отримання XML джерела з ID: ${id}`);
      const source = await queryOne<XMLSource>('SELECT * FROM xml_sources WHERE id = ?', [id]);
      
      if (!source) return null;
      
      return {
        ...source,
        mappingSchema: typeof source.mappingSchema === 'string' 
          ? JSON.parse(source.mappingSchema) 
          : source.mappingSchema,
        lastImport: source.lastImport ? new Date(source.lastImport).toISOString() : undefined
      };
    } catch (error) {
      console.error(`Помилка отримання джерела XML з ID ${id}:`, error);
      return null;
    }
  }

  // Створити нове джерело XML
  static async create(source: Omit<XMLSource, 'id'>): Promise<XMLSource> {
    try {
      const id = uuidv4();
      console.log(`Створення нового XML джерела: ${source.name} з ID: ${id}`);
      
      // Переконаємося, що mappingSchema є строкою для збереження в базі даних
      const mappingSchemaStr = typeof source.mappingSchema === 'object' 
        ? JSON.stringify(source.mappingSchema) 
        : source.mappingSchema;
      
      await query(`
        INSERT INTO xml_sources (id, name, url, updateSchedule, mappingSchema)
        VALUES (?, ?, ?, ?, ?)
      `, [
        id, 
        source.name, 
        source.url, 
        source.updateSchedule || null, 
        mappingSchemaStr
      ]);
      
      console.log(`Створено нове джерело XML: ${source.name} з ID: ${id}`);

      return {
        id,
        ...source
      };
    } catch (error) {
      console.error('Помилка створення джерела XML:', error);
      throw error;
    }
  }

  // Оновити джерело XML
  static async update(id: string, source: Partial<XMLSource>): Promise<boolean> {
    try {
      console.log(`Оновлення XML джерела з ID: ${id}`, source);
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
        const schemaValue = typeof source.mappingSchema === 'object' 
          ? JSON.stringify(source.mappingSchema) 
          : source.mappingSchema;
        updateValues.push(schemaValue);
        console.log('Оновлення схеми мапінгу:', schemaValue);
      }

      if (updateFields.length > 0) {
        console.log(`Виконання SQL запиту на оновлення XML джерела ${id}:`, updateFields.join(', '));
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
  
  // Аналізувати структуру XML для підказок мапінгу
  static async analyzeXmlStructure(url: string): Promise<{ 
    success: boolean; 
    structure?: any;
    suggestions?: any;
    errorMessage?: string 
  }> {
    try {
      console.log(`Завантажуємо XML з ${url} для аналізу`);
      
      // Завантажуємо XML
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP помилка: ${response.status}`);
      }
      
      const xmlString = await response.text();
      console.log(`XML завантажено успішно, розмір: ${xmlString.length} символів`);
      
      // Аналізуємо структуру XML
      const analysisResult = await analyzeXmlStructure(xmlString);
      
      if (!analysisResult.success) {
        return { 
          success: false, 
          errorMessage: `Помилка аналізу XML: ${analysisResult.error}` 
        };
      }
      
      return {
        success: true,
        structure: analysisResult.structure,
        suggestions: analysisResult.suggestions
      };
    } catch (error) {
      console.error('Помилка аналізу XML:', error);
      return { 
        success: false, 
        errorMessage: `Помилка аналізу: ${error instanceof Error ? error.message : String(error)}` 
      };
    }
  }
  
  // Імпортувати товари з XML
  static async importProductsFromXml(id: string): Promise<{ success: boolean; importedCount: number; errorMessage?: string }> {
    try {
      // Отримуємо джерело за ID
      console.log(`Початок імпорту з джерела: ${id}`);
      const source = await this.getById(id);
      if (!source) {
        console.error('Джерело XML не знайдено з ID:', id);
        return { success: false, importedCount: 0, errorMessage: 'Джерело XML не знайдено' };
      }
      
      // Отримуємо XML з URL
      console.log(`Завантажуємо XML з ${source.url}`);
      
      try {
        const response = await fetch(source.url);
        if (!response.ok) {
          const errorMsg = `HTTP помилка: ${response.status}`;
          console.error(errorMsg);
          throw new Error(errorMsg);
        }
        
        const xmlString = await response.text();
        console.log(`XML завантажено успішно, розмір: ${xmlString.length} символів`);
        
        // Перевіримо, чи є схема мапінгу
        if (!source.mappingSchema || 
            !source.mappingSchema.productElement || 
            !source.mappingSchema.fieldMappings) {
          const errorMsg = 'Відсутня схема мапінгу для імпорту';
          console.error(errorMsg, source.mappingSchema);
          return { 
            success: false, 
            importedCount: 0, 
            errorMessage: errorMsg
          };
        }
        
        // Парсимо XML та отримуємо товари
        console.log('Початок парсингу XML з наступною схемою мапінгу:', JSON.stringify(source.mappingSchema));
        const parseResult = await parseXmlProducts(xmlString, source.mappingSchema);
        
        if (!parseResult.success) {
          const errorMsg = `Помилка парсингу XML: ${parseResult.errors.join('; ')}`;
          console.error(errorMsg);
          return { 
            success: false, 
            importedCount: 0, 
            errorMessage: errorMsg
          };
        }
        
        console.log(`Розпізнано товарів: ${parseResult.products.length}`);
        if (parseResult.products.length > 0) {
          console.log('Приклад товару:', JSON.stringify(parseResult.products[0], null, 2));
        }
        
        // Зберігаємо товари в базу даних
        const saveResult = await saveImportedProducts(parseResult.products);
        console.log(`Результат збереження: ${JSON.stringify(saveResult)}`);
        
        // Оновлюємо дату останнього імпорту
        await this.updateLastImport(id);
        
        return { 
          success: saveResult.success, 
          importedCount: saveResult.saved,
          errorMessage: saveResult.errors.length > 0 ? saveResult.errors.join('; ') : undefined
        };
      } catch (error) {
        console.error('Помилка завантаження XML:', error);
        return { 
          success: false, 
          importedCount: 0, 
          errorMessage: `Помилка завантаження XML: ${error instanceof Error ? error.message : String(error)}` 
        };
      }
    } catch (error) {
      console.error('Помилка імпорту товарів з XML:', error);
      return { 
        success: false, 
        importedCount: 0, 
        errorMessage: `Помилка імпорту: ${error instanceof Error ? error.message : String(error)}` 
      };
    }
  }
}
