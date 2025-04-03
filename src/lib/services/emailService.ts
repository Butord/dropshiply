
/**
 * Головний сервіс для роботи з email сповіщеннями
 * Перенаправляє запити до відповідних спеціалізованих сервісів
 */

// Реекспорт функцій з інших сервісів для зворотної сумісності
export { initEmailService, sendOrderConfirmationEmail } from './emailJsService';
export { sendEmailViaFormSubmit, verifyFormSubmitActivation } from './formSubmitService';
export { prepareTemplate, prepareTemplateVariables } from './emailTemplateService';
