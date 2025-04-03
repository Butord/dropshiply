
/**
 * Utility service for handling email templates and variable substitution
 */

/**
 * Підготовка шаблону повідомлення з заміною змінних
 */
export const prepareTemplate = (template: string, variables: Record<string, string | number>) => {
  let result = template;
  
  Object.entries(variables).forEach(([key, value]) => {
    const regex = new RegExp(`{{${key}}}`, 'g');
    result = result.replace(regex, String(value));
  });
  
  return result;
};

/**
 * Підготовує список товарів для відображення в шаблоні
 */
export const prepareItemsList = (items: Array<{name: string, quantity: number, price: number}>) => {
  return items
    .map(item => `${item.name} x ${item.quantity} - ${item.price} грн`)
    .join('\n');
};

/**
 * Підготовка змінних для шаблону повідомлення
 */
export const prepareTemplateVariables = (notification: {
  customerName: string;
  orderNumber: string;
  amount: number;
  items: Array<{name: string, quantity: number, price: number}>;
  paymentMethod: string;
  paymentDetails?: string;
}) => {
  const itemsList = prepareItemsList(notification.items);
  
  return {
    name: notification.customerName,
    orderNumber: notification.orderNumber,
    amount: notification.amount,
    items: itemsList,
    paymentMethod: notification.paymentMethod,
    paymentDetails: notification.paymentDetails || ''
  };
};
