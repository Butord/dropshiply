
import emailjs from 'emailjs-com';
import { EmailSettings, OrderNotification } from '../types';

/**
 * Ініціалізація EmailJS з ID користувача
 * Зверніть увагу: у безкоштовному плані доступно до 200 листів на місяць
 */
export const initEmailService = (userId: string) => {
  emailjs.init(userId);
};

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
 * Відправка повідомлення через EmailJS
 */
export const sendOrderConfirmationEmail = async (
  notification: OrderNotification,
  settings: EmailSettings,
  serviceId: string,
  templateId: string
): Promise<boolean> => {
  try {
    // Підготовка даних для шаблону
    const itemsList = notification.items
      .map(item => `${item.name} x ${item.quantity} - ${item.price} грн`)
      .join('\n');
    
    // Підготовка змінних для шаблону
    const variables = {
      name: notification.customerName,
      orderNumber: notification.orderNumber,
      amount: notification.amount,
      items: itemsList,
      paymentMethod: notification.paymentMethod,
      paymentDetails: notification.paymentDetails || ''
    };
    
    // Заміна змінних у шаблоні
    const content = prepareTemplate(settings.template, variables);
    
    // Відправка листа
    const response = await emailjs.send(
      serviceId,
      templateId,
      {
        to_email: notification.customerEmail,
        to_name: notification.customerName,
        from_name: settings.senderName || 'Ваш магазин',
        subject: prepareTemplate(settings.subject, variables),
        message: content
      }
    );
    
    console.log('Email успішно відправлено:', response);
    return true;
  } catch (error) {
    console.error('Помилка відправки email:', error);
    return false;
  }
};

/**
 * Альтернативний метод відправки листів через веб-API (безкоштовний спосіб)
 * 
 * Примітка: Цей метод використовує сторонній сервіс formsubmit.co
 * Для використання необхідно спочатку активувати email, надіславши форму вручну
 */
export const sendEmailViaFormSubmit = async (
  notification: OrderNotification,
  settings: EmailSettings
): Promise<boolean> => {
  try {
    // Підготовка даних
    const variables = {
      name: notification.customerName,
      orderNumber: notification.orderNumber,
      amount: notification.amount
    };

    const content = prepareTemplate(settings.template, variables);
    const subject = prepareTemplate(settings.subject, variables);
    
    // Використання formsubmit.co API
    const formData = new FormData();
    formData.append('email', notification.customerEmail);
    formData.append('_subject', subject);
    formData.append('message', content);
    formData.append('_template', 'box');
    
    // Замініть на ваш активований email для formsubmit.co
    const response = await fetch(`https://formsubmit.co/${settings.senderEmail}`, {
      method: 'POST',
      body: formData,
      headers: {
        'Accept': 'application/json'
      }
    });
    
    const result = await response.json();
    console.log('Лист відправлено через formsubmit.co:', result);
    return response.ok;
  } catch (error) {
    console.error('Помилка відправки email через formsubmit.co:', error);
    return false;
  }
};

