
import { XMLMapping, Product } from './types';
import { ProductModel } from './db/models/productModel';
import { v4 as uuidv4 } from 'uuid';

/**
 * Парсинг XML строки та витягування продуктів згідно зі схемою мапінгу
 */
export const parseXmlProducts = async (
  xmlString: string, 
  mapping: XMLMapping
): Promise<{ success: boolean; products: Product[]; errors: string[] }> => {
  const products: Product[] = [];
  const errors: string[] = [];
  
  try {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlString, "text/xml");
    
    // Знаходимо кореневий елемент
    const rootElement = xmlDoc.getElementsByTagName(mapping.rootElement)[0];
    if (!rootElement) {
      errors.push(`Кореневий елемент "${mapping.rootElement}" не знайдено в XML`);
      return { success: false, products, errors };
    }
    
    // Знаходимо елемент, що містить список товарів (shop для yml_catalog)
    const shopElement = rootElement.getElementsByTagName('shop')[0];
    if (!shopElement) {
      errors.push(`Елемент "shop" не знайдено в XML`);
      return { success: false, products, errors };
    }
    
    // Знаходимо всі елементи товарів
    const productElements = shopElement.getElementsByTagName(mapping.productElement);
    
    if (productElements.length === 0) {
      errors.push(`Елементи товарів "${mapping.productElement}" не знайдені в XML`);
      return { success: false, products, errors };
    }
    
    // Обробка кожного товару
    for (let i = 0; i < productElements.length; i++) {
      const productElement = productElements[i];
      
      try {
        const product = mapElementToProduct(productElement, mapping);
        products.push(product);
      } catch (error) {
        errors.push(`Помилка обробки товару #${i + 1}: ${error instanceof Error ? error.message : String(error)}`);
      }
    }
    
    return { 
      success: products.length > 0, 
      products, 
      errors 
    };
  } catch (error) {
    errors.push(`Помилка парсингу XML: ${error instanceof Error ? error.message : String(error)}`);
    return { success: false, products, errors };
  }
};

/**
 * Перетворення XML елемента в об'єкт товару згідно зі схемою мапінгу
 */
const mapElementToProduct = (element: Element, mapping: XMLMapping): Product => {
  // Базові поля товару
  const now = new Date().toISOString();
  const product: Product = {
    id: uuidv4(),
    name: '',
    description: '',
    price: 0,
    images: [],
    category: '',
    tags: [],
    sku: '',
    stock: 0,
    createdAt: now,
    updatedAt: now
  };
  
  // ID товару (якщо є в мапінгу або береться з атрибуту id)
  if (mapping.fieldMappings.id) {
    product.id = getElementTextContent(element, mapping.fieldMappings.id) || element.getAttribute('id') || uuidv4();
  } else if (element.getAttribute('id')) {
    product.id = element.getAttribute('id') || uuidv4();
  }
  
  // Назва товару (обов'язкове поле)
  product.name = getElementTextContent(element, mapping.fieldMappings.name) || '';
  if (!product.name) {
    throw new Error('Назва товару не знайдена');
  }
  
  // Ціна (обов'язкове поле)
  const priceText = getElementTextContent(element, mapping.fieldMappings.price);
  if (!priceText) {
    throw new Error('Ціна товару не знайдена');
  }
  
  // Застосовуємо трансформацію для ціни, якщо вона вказана
  let priceValue = priceText;
  if (mapping.transforms && mapping.transforms.price) {
    priceValue = applyTransform(priceValue, mapping.transforms.price);
  }
  
  // Конвертуємо ціну в число
  product.price = parseFloat(priceValue);
  if (isNaN(product.price)) {
    throw new Error(`Неправильний формат ціни: ${priceText}`);
  }
  
  // Опис
  if (mapping.fieldMappings.description) {
    product.description = getElementTextContent(element, mapping.fieldMappings.description) || '';
    
    // Застосовуємо трансформацію для опису, якщо вона вказана
    if (mapping.transforms && mapping.transforms.description) {
      product.description = applyTransform(product.description, mapping.transforms.description);
    }
  }
  
  // Зображення
  if (mapping.fieldMappings.images) {
    // Перевіряємо, чи є декілька елементів зображень
    const imageElements = element.getElementsByTagName(mapping.fieldMappings.images);
    if (imageElements.length > 0) {
      for (let i = 0; i < imageElements.length; i++) {
        const imageUrl = imageElements[i].textContent;
        if (imageUrl) {
          product.images.push(imageUrl);
        }
      }
    } else {
      const imageUrl = getElementTextContent(element, mapping.fieldMappings.images);
      if (imageUrl) {
        product.images.push(imageUrl);
      }
    }
  }
  
  // Категорія
  if (mapping.fieldMappings.category) {
    product.category = getElementTextContent(element, mapping.fieldMappings.category) || '';
    
    // Якщо категорія вказана як ID, то можна спробувати знайти її назву в окремому елементі
    // Перевіряємо наявність поля categoryIdToName, щоб уникнути помилки TypeScript
    if (product.category && mapping.fieldMappings.categoryIdToName) {
      const categoryId = product.category;
      // Тут можна було б реалізувати пошук назви категорії за ID
      // Але для простоти використовуємо як категорію її ID
    }
  }
  
  // Теги
  if (mapping.fieldMappings.tags) {
    const tagsText = getElementTextContent(element, mapping.fieldMappings.tags);
    if (tagsText) {
      // Застосовуємо трансформацію для тегів, якщо вона вказана
      if (mapping.transforms && mapping.transforms.tags && mapping.transforms.tags.type === 'split') {
        const separator = mapping.transforms.tags.separator || ',';
        product.tags = tagsText.split(separator).map(tag => tag.trim());
      } else {
        product.tags = [tagsText];
      }
    }
  }
  
  // SKU або артикул
  if (mapping.fieldMappings.sku) {
    product.sku = getElementTextContent(element, mapping.fieldMappings.sku) || '';
  }
  
  // Наявність на складі
  if (mapping.fieldMappings.stock) {
    const stockText = getElementTextContent(element, mapping.fieldMappings.stock);
    if (stockText) {
      product.stock = parseInt(stockText, 10);
      if (isNaN(product.stock)) {
        product.stock = 0;
      }
    }
    
    // Якщо є атрибут доступності (available)
    const availableAttr = element.getAttribute('available');
    if (availableAttr !== null) {
      product.stock = availableAttr === 'true' ? 10 : 0; // За замовчуванням 10 одиниць, якщо доступно
    }
  }
  
  // Ціна порівняння (стара ціна)
  if (mapping.fieldMappings.compareAtPrice) {
    const compareAtPriceText = getElementTextContent(element, mapping.fieldMappings.compareAtPrice);
    if (compareAtPriceText) {
      product.compareAtPrice = parseFloat(compareAtPriceText);
    }
  }
  
  return product;
};

/**
 * Отримання текстового вмісту елемента за шляхом
 */
const getElementTextContent = (element: Element, path: string): string | null => {
  // Розділяємо шлях, якщо він містить підпапки (наприклад: "details/name")
  const parts = path.split('/');
  
  let currentElement: Element | null = element;
  
  // Проходимо по шляху
  for (let i = 0; i < parts.length - 1; i++) {
    if (currentElement === null) break;
    const childElements = currentElement.getElementsByTagName(parts[i]);
    if (childElements.length === 0) {
      currentElement = null;
      break;
    }
    currentElement = childElements[0];
  }
  
  if (currentElement === null) return null;
  
  // Останній елемент шляху
  const targetElements = currentElement.getElementsByTagName(parts[parts.length - 1]);
  if (targetElements.length === 0) return null;
  
  return targetElements[0].textContent;
};

/**
 * Застосування трансформації до значення
 */
const applyTransform = (value: string, transform: any): string => {
  if (!value) return value;
  
  switch (transform.type) {
    case 'regex':
      if (transform.pattern) {
        const regex = new RegExp(transform.pattern, 'g');
        return value.replace(regex, transform.replacement || '');
      }
      return value;
      
    case 'replace':
      if (transform.pattern) {
        return value.replace(transform.pattern, transform.replacement || '');
      }
      return value;
      
    case 'split':
      // Для split трансформація повертає масив, але ця функція повертає string
      // Тому ми повертаємо оригінальне значення
      return value;
      
    case 'join':
      // Аналогічно, для join потрібен масив як вхідні дані
      return value;
      
    default:
      return value;
  }
};

/**
 * Зберігання імпортованих товарів у базу даних
 */
export const saveImportedProducts = async (products: Product[]): Promise<{ success: boolean; saved: number; errors: string[] }> => {
  const errors: string[] = [];
  let savedCount = 0;
  
  for (const product of products) {
    try {
      await ProductModel.create(product);
      savedCount++;
    } catch (error) {
      errors.push(`Помилка збереження товару "${product.name}": ${error instanceof Error ? error.message : String(error)}`);
    }
  }
  
  return {
    success: savedCount > 0,
    saved: savedCount,
    errors
  };
};
