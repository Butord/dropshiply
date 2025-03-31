import { EmailSettings, OrderNotification, TelegramSettings } from '../types';
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
Команда вашого магазину`,
  formSubmitActivated: false // За замовчуванням не активовано
};

// Налаштування Telegram
let telegramSettings: TelegramSettings = {
  enabled: false,
  botToken: '',
  chatId: '',
  messageTemplate: `Нове замовлення #{{orderNumber}}
  
Клієнт: {{name}}
Email: {{email}}
  
Деталі замовлення:
{{items}}
  
Сума: {{amount}} грн
Оплата: {{paymentMethod}}`
};

// ID сервісу і шаблону для EmailJS (необхідно отримати в особистому кабінеті EmailJS)
const EMAIL_JS_SERVICE_ID = 'your_service_id'; // Замініть на ваш service ID
const EMAIL_JS_TEMPLATE_ID = 'your_template_id'; // Замініть на ваш template ID
const EMAIL_JS_USER_ID = 'your_user_id'; // Замініть на ваш user ID

// Отримання налаштувань пошти
export const getEmailSettings = (): EmailSettings => {
  return emailSettings;
};

// Оновлення налаштувань пошти
export const updateEmailSettings = (settings: Partial<EmailSettings>): void => {
  emailSettings = { ...emailSettings, ...settings };
};

// Отримання налаштувань Telegram
export const getTelegramSettings = (): TelegramSettings => {
  return telegramSettings;
};

// Оновлення налаштувань Telegram
export const updateTelegramSettings = (settings: Partial<TelegramSettings>): void => {
  telegramSettings = { ...telegramSettings, ...settings };
};

// Активація FormSubmit
export const activateFormSubmit = async (email: string): Promise<boolean> => {
  try {
    // В реальному додатку тут було б відправлення тестового листа
    // для активації email на formsubmit.co
    console.log(`Відправка активаційного листа на ${email}`);
    
    // Імітуємо успішну активацію
    emailSettings.formSubmitActivated = true;
    emailSettings.senderEmail = email;
    
    return true;
  } catch (error) {
    console.error('Помилка активації FormSubmit:', error);
    return false;
  }
};

// Відправка повідомлення в Telegram
export const sendTelegramNotification = async (notification: OrderNotification): Promise<boolean> => {
  if (!telegramSettings.enabled || !telegramSettings.botToken || !telegramSettings.chatId) {
    console.log('Відправка Telegram відключена або не налаштована');
    return false;
  }
  
  try {
    // Підготовка даних для шаблону
    const itemsList = notification.items
      .map(item => `${item.name} x ${item.quantity} - ${item.price} грн`)
      .join('\n');
    
    // Підготовка змінних для шаблону
    const variables = {
      name: notification.customerName,
      email: notification.customerEmail,
      orderNumber: notification.orderNumber,
      amount: notification.amount,
      items: itemsList,
      paymentMethod: notification.paymentMethod,
      paymentDetails: notification.paymentDetails || ''
    };
    
    // Заміна змінних у шаблоні
    let messageText = telegramSettings.messageTemplate;
    
    Object.entries(variables).forEach(([key, value]) => {
      const regex = new RegExp(`{{${key}}}`, 'g');
      messageText = messageText.replace(regex, String(value));
    });
    
    // Відправка повідомлення через Telegram Bot API
    const telegramUrl = `https://api.telegram.org/bot${telegramSettings.botToken}/sendMessage`;
    
    const response = await fetch(telegramUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: telegramSettings.chatId,
        text: messageText,
        parse_mode: 'HTML'
      })
    });
    
    if (response.ok) {
      console.log('Повідомлення успішно відправлено в Telegram');
      return true;
    } else {
      const result = await response.json();
      console.error('Помилка відправки повідомлення в Telegram:', result);
      return false;
    }
  } catch (error) {
    console.error('Помилка відправки повідомлення в Telegram:', error);
    return false;
  }
};

// Метод для відправки сповіщення про замовлення
export const sendOrderNotification = async (notification: OrderNotification): Promise<boolean> => {
  let emailSent = true;
  let telegramSent = true;
  
  // Відправка email
  if (emailSettings.enabled) {
    // Використовуємо FormSubmit (безкоштовний сервіс)
    emailSent = await sendEmailViaFormSubmit(notification, emailSettings);
  }
  
  // Відправка Telegram
  if (telegramSettings.enabled) {
    telegramSent = await sendTelegramNotification(notification);
  }
  
  // Повертаємо true, якщо хоча б один канал спрацював
  return emailSent || telegramSent;
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
