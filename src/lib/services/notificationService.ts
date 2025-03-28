
import { EmailSettings, OrderNotification } from '../types';
import { sendOrderConfirmationEmail, sendEmailViaFormSubmit } from './emailService';

// Тут зберігаємо поточні налаштування повідомлень
// В реальній програмі ці дані були б збережені в базі даних
let emailSettings: EmailSettings = {
  enabled: true,
  senderEmail: 'notify@yourstore.com',
  senderName: 'Ваш Магазин',
  subject: 'Ваше замовлення #{{orderNumber}} було успішно оформлено',
  template: `Шановний(а) {{name}},

Дякуємо за ваше замовлення #{{orderNumber}}.

Деталі замовлення:
{{items}}

Сума до сплати: {{amount}} грн

Обраний спосіб оплати: {{paymentMethod}}
{{paymentDetails}}

Ми повідомимо вас, коли замовлення буде відправлено.

З повагою,
Команда вашого магазину`
};

// ID сервісу і шаблону для EmailJS (необхідно отримати в особистому кабінеті EmailJS)
const EMAIL_JS_SERVICE_ID = 'your_service_id'; // Замініть на ваш service ID
const EMAIL_JS_TEMPLATE_ID = 'your_template_id'; // Замініть на ваш template ID
const EMAIL_JS_USER_ID = 'your_user_id'; // Замініть на ваш user ID

// Ці налаштування в реальній програмі мали б завантажуватись з адмін-панелі
export const getEmailSettings = (): EmailSettings => {
  return emailSettings;
};

export const updateEmailSettings = (settings: Partial<EmailSettings>): void => {
  emailSettings = { ...emailSettings, ...settings };
};

// Метод для відправки сповіщення про замовлення
export const sendOrderNotification = async (notification: OrderNotification): Promise<boolean> => {
  if (!emailSettings.enabled) {
    console.log('Відправка email відключена в налаштуваннях');
    return false;
  }
  
  // Використовуємо EmailJS (потребує реєстрації)
  // return await sendOrderConfirmationEmail(
  //   notification,
  //   emailSettings,
  //   EMAIL_JS_SERVICE_ID,
  //   EMAIL_JS_TEMPLATE_ID
  // );
  
  // Використовуємо безкоштовний сервіс formsubmit.co
  return await sendEmailViaFormSubmit(notification, emailSettings);
};

// Генерація унікального номера замовлення
export const generateOrderNumber = (): string => {
  const date = new Date();
  const year = date.getFullYear().toString().slice(2);
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  
  return `ORD-${year}${month}${day}-${random}`;
};

