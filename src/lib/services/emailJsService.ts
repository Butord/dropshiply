
import emailjs from 'emailjs-com';
import { OrderNotification, EmailSettings } from '../types';
import { prepareTemplate, prepareTemplateVariables } from './emailTemplateService';

/**
 * Ініціалізація EmailJS з ID користувача
 * Зверніть увагу: у безкоштовному плані доступно до 200 листів на місяць
 */
export const initEmailService = (userId: string) => {
  emailjs.init(userId);
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
    // Підготовка змінних для шаблону
    const variables = prepareTemplateVariables(notification);
    
    // Заміна змінних у шаблоні
    const content = prepareTemplate(settings.template, variables);
    
    // Відправка листа
    const response = await emailjs.send(
      serviceId,
      templateId,
      {
        to_email: notification.customerEmail,
        to_name: notification.customerName,
        from_name: settings.senderName || '  Ваш магазин',
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
