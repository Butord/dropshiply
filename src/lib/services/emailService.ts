
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

  // Перевірка активації FormSubmit і наявності email адрес
  if (!settings.formSubmitActivated) {
    console.warn('emailService.sendEmailNotification: FormSubmit не активовано. Сповіщення не буде відправлено.');
    return false;
  }

  if (!settings.senderEmail) {
    console.warn('emailService.sendEmailNotification: Email відправника не вказано. Сповіщення не буде відправлено.');
    return false;
  }

  if (!notification.customerEmail) {
    console.warn('emailService.sendEmailNotification: Email отримувача не вказано. Сповіщення не буде відправлено.');
    return false;
  }

  // Використовуємо FormSubmit для відправки
  try {
    console.log('emailService.sendEmailNotification: Спроба відправки через FormSubmit');
    console.log('emailService.sendEmailNotification: Параметри відправки:', {
      від: settings.senderEmail,
      кому: notification.customerEmail,
      замовлення: notification.orderNumber
    });
    
    const result = await sendEmailViaFormSubmit(notification, settings);
    console.log('emailService.sendEmailNotification: Результат відправки FormSubmit:', result ? 'Успішно' : 'Невдало');
    
    if (!result) {
      console.error('emailService.sendEmailNotification: FormSubmit не зміг відправити лист. Перевірте налаштування і повторіть спробу.');
    }
    
    return result;
  } catch (error) {
    console.error('emailService.sendEmailNotification: Помилка відправки через FormSubmit:', error);
    return false;
  }
};
