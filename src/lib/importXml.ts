import { XMLMapping, Product } from './types';
import { ProductModel } from './db/models/productModel';
import { v4 as uuidv4 } from 'uuid';

/**
 * Аналіз структури XML для автоматичного мапінгу
 */
export const analyzeXmlStructure = async (
  xmlString: string
): Promise<{ 
  success: boolean; 
  structure?: any; 
  suggestions?: any; 
  error?: string 
}> => {
  try {
    console.log('Початок аналізу XML структури');
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlString, "text/xml");
    
    // Перевіряємо, чи є помилки парсингу
    const parseError = xmlDoc.getElementsByTagName("parsererror");
    if (parseError.length > 0) {
      return { 
        success: false, 
        error: "Неправильний формат XML: " + parseError[0].textContent 
      };
    }
    
    // Отримуємо кореневий елемент
    const rootElement = xmlDoc.documentElement;
    if (!rootElement) {
      return { success: false, error: "Не вдалося знайти кореневий елемент" };
    }
    
    // Аналізуємо структуру
    const structure = analyzeElement(rootElement);
    
    // Пошук можливих елементів товарів
    const productElements = findPotentialProductElements(rootElement);
    
    // Генеруємо пропозиції для мапінгу
    const suggestions = generateMappingSuggestions(rootElement, productElements);
    
    return {
      success: true,
      structure,
      suggestions
    };
  } catch (error) {
    console.error('Помилка аналізу XML:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : String(error) 
    };
  }
};

/**
 * Рекурсивний аналіз елемента XML
 */
const analyzeElement = (element: Element, maxDepth = 3, currentDepth = 0): any => {
  if (currentDepth > maxDepth) {
    return { name: element.tagName, hasChildren: element.children.length > 0 };
  }
  
  const result: any = {
    name: element.tagName,
    attributes: {},
    children: [],
    count: 1
  };
  
  // Аналіз атрибутів
  for (let i = 0; i < element.attributes.length; i++) {
    const attr = element.attributes[i];
    result.attributes[attr.name] = attr.value;
  }
  
  // Аналіз дочірніх елементів
  const childElements: Record<string, Element[]> = {};
  
  for (let i = 0; i < element.children.length; i++) {
    const child = element.children[i];
    if (!childElements[child.tagName]) {
      childElements[child.tagName] = [];
    }
    childElements[child.tagName].push(child);
  }
  
  // Додавання інформації про дочірні елементи
  for (const [tagName, elements] of Object.entries(childElements)) {
    // Аналізуємо лише перший дочірній елемент кожного типу для економії ресурсів
    const childAnalysis = analyzeElement(elements[0], maxDepth, currentDepth + 1);
    childAnalysis.count = elements.length;
    result.children.push(childAnalysis);
  }
  
  return result;
};

/**
 * Пошук потенційних елементів товарів
 */
const findPotentialProductElements = (rootElement: Element): any[] => {
  const result: any[] = [];
  const potentialNames = ['item', 'product', 'offer', 'good', 'article', 'товар'];
  
  // Обходимо всі елементи, які мають багато однакових дочірніх елементів
  const processElement = (element: Element, path: string[] = []) => {
    const currentPath = [...path, element.tagName];
    
    // Спочатку шукаємо елементи з характерними іменами
    for (const name of potentialNames) {
      const matchingElements = element.getElementsByTagName(name);
      if (matchingElements.length > 5) { // Якщо знайдено більше 5 елементів з таким ім'ям
        const childElement = matchingElements[0];
        const fields = extractFieldsInfo(childElement);
        
        result.push({
          path: [...currentPath, name].join('/'),
          elementName: name,
          count: matchingElements.length,
          score: 100, // Найвищий пріоритет для відомих імен
          fields
        });
      }
    }
    
    // Шукаємо елементи, які повторюються багато разів
    const childTagCounts: Record<string, Element[]> = {};
    for (let i = 0; i < element.children.length; i++) {
      const child = element.children[i];
      if (!childTagCounts[child.tagName]) {
        childTagCounts[child.tagName] = [];
      }
      childTagCounts[child.tagName].push(child);
    }
    
    for (const [tagName, elements] of Object.entries(childTagCounts)) {
      if (elements.length > 10) { // Якщо є більше 10 однакових елементів
        const fields = extractFieldsInfo(elements[0]);
        
        // Перевіряємо, чи має елемент поля, характерні для товару
        const productFieldScore = calculateProductFieldScore(fields);
        
        if (productFieldScore > 30) { // Якщо елемент має достатньо характерних полів
          result.push({
            path: [...currentPath, tagName].join('/'),
            elementName: tagName,
            count: elements.length,
            score: productFieldScore,
            fields
          });
        }
      }
    }
    
    // Рекурсивно обходимо унікальні дочірні елементи
    for (const [tagName, elements] of Object.entries(childTagCounts)) {
      if (elements.length === 1) { // Рекурсія тільки для унікальних дочірніх елементів
        processElement(elements[0], currentPath);
      }
    }
  };
  
  processElement(rootElement);
  
  // Сортуємо за рейтингом
  return result.sort((a, b) => b.score - a.score);
};

/**
 * Витягування інформації про поля елемента
 */
const extractFieldsInfo = (element: Element): any[] => {
  const fields: any[] = [];
  const nodeNameToFieldType: Record<string, string> = {
    'name': 'name',
    'title': 'name',
    'product_name': 'name',
    'price': 'price',
    'cost': 'price',
    'description': 'description',
    'desc': 'description',
    'text': 'description',
    'image': 'images',
    'picture': 'images',
    'img': 'images',
    'photo': 'images',
    'category': 'category',
    'categoryId': 'categoryIdToName',
    'category_id': 'categoryIdToName',
    'stock': 'stock',
    'quantity': 'stock',
    'artikul': 'sku',
    'sku': 'sku',
    'code': 'sku',
    'vendorCode': 'sku',
    'vendor_code': 'sku',
    'barcode': 'sku',
    'ean': 'sku',
    'upc': 'sku',
  };
  
  // Витягуємо атрибути
  for (let i = 0; i < element.attributes.length; i++) {
    const attr = element.attributes[i];
    const fieldType = nodeNameToFieldType[attr.name.toLowerCase()] || null;
    fields.push({
      name: attr.name,
      type: 'attribute',
      fieldType,
      example: attr.value
    });
  }
  
  // Витягуємо дочірні елементи
  for (let i = 0; i < element.children.length; i++) {
    const child = element.children[i];
    const fieldType = nodeNameToFieldType[child.tagName.toLowerCase()] || null;
    fields.push({
      name: child.tagName,
      type: 'element',
      fieldType,
      example: child.textContent
    });
  }
  
  return fields;
};

/**
 * Обчислення рейтингу елемента як потенційного товару
 */
const calculateProductFieldScore = (fields: any[]): number => {
  let score = 0;
  
  // Бали за наявність ключових полів товару
  const fieldScores: Record<string, number> = {
    'name': 30,
    'price': 30,
    'description': 15,
    'images': 15,
    'category': 10,
    'sku': 10,
    'stock': 5,
    'categoryIdToName': 5
  };
  
  // Перевіряємо наявність полів
  const presentFieldTypes = new Set<string>();
  for (const field of fields) {
    if (field.fieldType) {
      presentFieldTypes.add(field.fieldType);
    }
  }
  
  // Рахуємо бали
  for (const [fieldType, fieldScore] of Object.entries(fieldScores)) {
    if (presentFieldTypes.has(fieldType)) {
      score += fieldScore;
    }
  }
  
  return score;
};

/**
 * Генерація пропозицій для мапінгу
 */
const generateMappingSuggestions = (rootElement: Element, productElements: any[]): any => {
  if (productElements.length === 0) {
    return null;
  }
  
  // Беремо найбільш вірогідний елемент товару
  const bestProduct = productElements[0];
  
  // Визначаємо шлях до кореневого елементу
  let rootPath = '';
  if (bestProduct.path.includes('/')) {
    rootPath = bestProduct.path.split('/').slice(0, -1).join('/');
  }
  
  // Визначаємо найкращі поля для кожного типу
  const bestFields: Record<string, any> = {};
  for (const field of bestProduct.fields) {
    if (field.fieldType && (!bestFields[field.fieldType] || field.name.toLowerCase() === field.fieldType.toLowerCase())) {
      bestFields[field.fieldType] = field;
    }
  }
  
  // Створюємо пропозицію схеми
  const mappingSchema: any = {
    rootElement: rootPath || rootElement.tagName,
    productElement: bestProduct.elementName,
    fieldMappings: {}
  };
  
  // Заповнюємо схему мапінгу
  for (const [fieldType, field] of Object.entries(bestFields)) {
    mappingSchema.fieldMappings[fieldType] = field.name;
  }
  
  // Додаємо обов'язкові поля, якщо вони відсутні
  if (!mappingSchema.fieldMappings.name) {
    mappingSchema.fieldMappings.name = 'name';
  }
  
  if (!mappingSchema.fieldMappings.price) {
    mappingSchema.fieldMappings.price = 'price';
  }
  
  return {
    schema: mappingSchema,
    confidence: bestProduct.score,
    productCount: bestProduct.count,
    sampleData: getSampleData(rootElement, bestProduct, mappingSchema)
  };
};

/**
 * Отримання прикладу даних для візуалізації
 */
const getSampleData = (rootElement: Element, productInfo: any, mappingSchema: any): any => {
  // Знаходимо елемент продуктів
  const pathParts = productInfo.path.split('/');
  let currentElement = rootElement;
  
  // Переходимо до батьківського елемента товарів
  for (let i = 1; i < pathParts.length - 1; i++) {
    const elements = currentElement.getElementsByTagName(pathParts[i]);
    if (elements.length > 0) {
      currentElement = elements[0];
    } else {
      return null;
    }
  }
  
  // Отримуємо всі елементи товарів
  const productElements = currentElement.getElementsByTagName(pathParts[pathParts.length - 1]);
  if (productElements.length === 0) {
    return null;
  }
  
  // Беремо до 5 перших товарів для прикладу
  const sampleCount = Math.min(5, productElements.length);
  const samples = [];
  
  for (let i = 0; i < sampleCount; i++) {
    const productElement = productElements[i];
    const sample: Record<string, any> = {};
    
    // Заповнюємо зразок даними
    for (const [fieldType, fieldName] of Object.entries(mappingSchema.fieldMappings)) {
      if (typeof fieldName === 'string') {
        // Перевіряємо, чи це атрибут
        if (productElement.hasAttribute(fieldName)) {
          sample[fieldType] = productElement.getAttribute(fieldName);
        } else {
          // Шукаємо як елемент
          const elements = productElement.getElementsByTagName(fieldName);
          if (elements.length > 0) {
            sample[fieldType] = elements[0].textContent;
          }
        }
      }
    }
    
    samples.push(sample);
  }
  
  return samples;
};

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
    console.log('Початок парсингу XML');
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlString, "text/xml");
    
    // Перевіряємо, чи є помилки парсингу
    const parseError = xmlDoc.getElementsByTagName("parsererror");
    if (parseError.length > 0) {
      errors.push(`Помилка парсингу XML: ${parseError[0].textContent}`);
      return { success: false, products, errors };
    }
    
    // Знаходимо кореневий елемент
    let rootElement: Element;
    
    if (mapping.rootElement.includes('/')) {
      // Якщо шлях містить /, розбиваємо його
      const pathParts = mapping.rootElement.split('/');
      let currentElement: Element | null = xmlDoc.documentElement;
      
      for (let i = 1; i < pathParts.length; i++) {
        if (!currentElement) break;
        const elements = currentElement.getElementsByTagName(pathParts[i]);
        if (elements.length === 0) {
          errors.push(`Елемент "${pathParts[i]}" не знайдено в шляху "${mapping.rootElement}"`);
          return { success: false, products, errors };
        }
        currentElement = elements[0];
      }
      
      if (!currentElement) {
        errors.push(`Не вдалося знайти кореневий елемент за шляхом "${mapping.rootElement}"`);
        return { success: false, products, errors };
      }
      
      rootElement = currentElement;
    } else {
      // Звичайний випадок - просто беремо елемент за іменем
      rootElement = xmlDoc.getElementsByTagName(mapping.rootElement)[0];
      if (!rootElement) {
        errors.push(`Кореневий елемент "${mapping.rootElement}" не знайдено в XML`);
        return { success: false, products, errors };
      }
    }
    
    console.log(`Кореневий елемент "${mapping.rootElement}" знайдено`);
    
    // Для yml_catalog шукаємо елемент shop
    let shopElement = rootElement;
    if (mapping.rootElement === 'yml_catalog' || rootElement.tagName === 'yml_catalog') {
      shopElement = rootElement.getElementsByTagName('shop')[0];
      if (!shopElement) {
        errors.push(`Елемент "shop" не знайдено в XML`);
        return { success: false, products, errors };
      }
      console.log('Елемент "shop" знайдено');
    }
    
    // Знаходимо всі елементи товарів
    const productElements = shopElement.getElementsByTagName(mapping.productElement);
    
    console.log(`Знайдено елементів товарів: ${productElements.length}`);
    
    if (productElements.length === 0) {
      errors.push(`Елементи товарів "${mapping.productElement}" не знайдені в XML`);
      return { success: false, products, errors };
    }
    
    // Отримуємо категорії, якщо вони є
    const categoriesMap = new Map<string, string>();
    const categoryElements = shopElement.getElementsByTagName('category');
    for (let i = 0; i < categoryElements.length; i++) {
      const categoryEl = categoryElements[i];
      const categoryId = categoryEl.getAttribute('id');
      if (categoryId) {
        categoriesMap.set(categoryId, categoryEl.textContent || '');
      }
    }
    
    // Обробка кожного товару
    for (let i = 0; i < productElements.length; i++) {
      const productElement = productElements[i];
      
      try {
        const product = mapElementToProduct(productElement, mapping, categoriesMap);
        products.push(product);
      } catch (error) {
        console.error(`Помилка обробки товару #${i + 1}:`, error);
        errors.push(`Помилка обробки товару #${i + 1}: ${error instanceof Error ? error.message : String(error)}`);
      }
    }
    
    console.log(`Успішно розпізнано товарів: ${products.length}`);
    
    return { 
      success: products.length > 0, 
      products, 
      errors 
    };
  } catch (error) {
    console.error('Помилка парсингу XML:', error);
    errors.push(`Помилка парсингу XML: ${error instanceof Error ? error.message : String(error)}`);
    return { success: false, products, errors };
  }
};

/**
 * Перетворення XML елемента в об'єкт товару згідно зі схемою мапінгу
 */
const mapElementToProduct = (
  element: Element, 
  mapping: XMLMapping, 
  categoriesMap: Map<string, string> = new Map()
): Product => {
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
  }
  
  // Якщо категорія вказана як ID, то спробуємо знайти її назву
  if (!product.category && mapping.fieldMappings.categoryIdToName) {
    const categoryIdText = getElementTextContent(element, mapping.fieldMappings.categoryIdToName);
    if (categoryIdText && categoriesMap.has(categoryIdText)) {
      product.category = categoriesMap.get(categoryIdText) || '';
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
  } else {
    // Спробуємо знайти vendor code як SKU
    const vendorCode = getElementTextContent(element, 'vendorCode');
    if (vendorCode) {
      product.sku = vendorCode;
    }
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
  }
  
  // Якщо є атрибут доступності (available)
  const availableAttr = element.getAttribute('available');
  if (availableAttr !== null) {
    product.stock = availableAttr === 'true' ? 10 : 0; // За замовчуванням 10 одиниць, якщо доступно
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
 * Отримання текстового вмісту елемента за тегом
 */
const getElementTextContent = (element: Element, path: string): string | null => {
  if (!path) return null;
  
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
      // Для split трансформації повертає масив, але ця функція повертає string
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
  
  console.log(`Початок збереження ${products.length} товарів`);
  
  for (const product of products) {
    try {
      // Перевіряємо, чи товар з таким ID або SKU вже існує
      const existingProduct = await ProductModel.getById(product.id);
      
      if (existingProduct) {
        // Оновлюємо існуючий товар
        const updated = await ProductModel.update(product.id, product);
        if (updated) {
          savedCount++;
          console.log(`Оновлено товар: ${product.name}`);
        } else {
          errors.push(`Помилка оновлення товару "${product.name}"`);
        }
      } else {
        // Створюємо новий товар без ID, бо він генерується автоматично
        const { id, createdAt, updatedAt, ...productData } = product;
        await ProductModel.create(productData);
        savedCount++;
        console.log(`Створено товар: ${product.name}`);
      }
    } catch (error) {
      console.error(`Помилка збереження товару "${product.name}":`, error);
      errors.push(`Помилка збереження товару "${product.name}": ${error instanceof Error ? error.message : String(error)}`);
    }
  }
  
  console.log(`Збережено товарів: ${savedCount}, помилок: ${errors.length}`);
  
  return {
    success: savedCount > 0,
    saved: savedCount,
    errors
  };
};
