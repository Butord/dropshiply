
import { XMLSource, Product } from '../types';
import { XMLSourceModel } from '../db/models/xmlSourceModel';
import { parseXmlProducts, saveImportedProducts } from '../importXml';

export const importProductsFromSource = async (sourceId: string): Promise<{
  success: boolean;
  importedCount: number;
  errors: string[];
}> => {
  try {
    // Отримуємо джерело XML
    const source = await XMLSourceModel.getById(sourceId);
    if (!source) {
      return {
        success: false,
        importedCount: 0,
        errors: ['Джерело XML не знайдено']
      };
    }

    // Завантажуємо XML з URL
    const response = await fetch(source.url);
    if (!response.ok) {
      return {
        success: false,
        importedCount: 0,
        errors: [`Помилка завантаження XML: ${response.status} ${response.statusText}`]
      };
    }

    const xmlString = await response.text();

    // Парсимо XML у товари
    const parseResult = await parseXmlProducts(xmlString, source.mappingSchema);
    if (!parseResult.success) {
      return {
        success: false,
        importedCount: 0,
        errors: parseResult.errors
      };
    }

    // Зберігаємо товари в базу даних
    const saveResult = await saveImportedProducts(parseResult.products);

    // Оновлюємо дату останнього імпорту
    await XMLSourceModel.updateLastImport(sourceId);

    return {
      success: saveResult.success,
      importedCount: saveResult.saved,
      errors: [...parseResult.errors, ...saveResult.errors]
    };
  } catch (error) {
    return {
      success: false,
      importedCount: 0,
      errors: [`Помилка імпорту: ${error instanceof Error ? error.message : String(error)}`]
    };
  }
};
