
/**
 * Головний сервіс для роботи з email сповіщеннями
 * Перенаправляє запити до відповідних спеціалізованих сервісів
 */

// Реекспорт функцій з інших сервісів для зворотної сумісності
export { initEmailService, sendOrderConfirmationEmail } from './emailJsService';
export { sendEmailViaFormSubmit, verifyFormSubmitActivation } from './formSubmitService';
export { prepareTemplate, prepareTemplateVariables } from './emailTemplateService';

// Додаємо функцію для відправки сповіщень про замовлення через email
import { OrderNotification, EmailSettings } from '../types';
import { sendEmailViaFormSubmit } from './formSubmitService';

/**
 * Основна функція для відправки email сповіщень
 */
export const sendEmailNotification = async (
  notification: OrderNotification,
  settings: EmailSettings
): Promise<boolean> => {
  console.log('emailService.sendEmailNotification: Відправляємо email сповіщення', { 
    notification,
    settings
  });

  // Використовуємо FormSubmit для відправки
  try {
    const result = await sendEmailViaFormSubmit(notification, settings);
    console.log('emailService.sendEmailNotification: Результат відправки FormSubmit:', result);
    return result;
  } catch (error) {
    console.error('emailService.sendEmailNotification: Помилка відправки через FormSubmit:', error);
    return false;
  }
};
