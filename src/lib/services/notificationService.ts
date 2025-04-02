import { EmailSettings, OrderNotification, TelegramSettings } from '../types';
import { sendOrderConfirmationEmail, sendEmailViaFormSubmit, verifyFormSubmitActivation } from './emailService';

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
  console.log("getEmailSettings - поточні налаштування:", emailSettings);
  return emailSettings;
};

// Оновлення налаштувань пошти
export const updateEmailSettings = (settings: Partial<EmailSettings>): void => {
  console.log("updateEmailSettings - попередні налаштування:", emailSettings);
  emailSettings = { ...emailSettings, ...settings };
  console.log("updateEmailSettings - оновлені налаштування:", emailSettings);
};

// Отримання налаштувань Telegram
export const getTelegramSettings = (): TelegramSettings => {
  return telegramSettings;
};

// Оновлення налаштувань Telegram
export const updateTelegramSettings = (settings: Partial<TelegramSettings>): void => {
  telegramSettings = { ...telegramSettings, ...settings };
  console.log('Оновлено налаштування Telegram:', telegramSettings);
};

// Активація FormSubmit
export const activateFormSubmit = async (email: string): Promise<boolean> => {
  try {
    console.log(`Спроба активації FormSubmit для email: ${email}`);
    
    if (!email || email.trim() === '') {
      console.error("Помилка активації: Email адреса порожня");
      return false;
    }
    
    // Оновлюємо налаштування перед активацією
    updateEmailSettings({
      senderEmail: email
    });
    
    // Перевіряємо активацію через реальну відправку
    const activationResult = await verifyFormSubmitActivation(email);
    
    if (activationResult) {
      console.log(`FormSubmit успішно активовано для ${email}`);
      
      // Оновлюємо налаштування
      updateEmailSettings({
        formSubmitActivated: true,
        senderEmail: email,
        enabled: true
      });
      
      // Перевіряємо оновлені налаштування
      console.log("Після активації налаштування:", emailSettings);
      
      return true;
    } else {
      console.error(`Не вдалося активувати FormSubmit для ${email}`);
      return false;
    }
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
    
    console.log('Відправляємо повідомлення через Telegram Bot API');
    console.log(`Bot Token: ${telegramSettings.botToken.slice(0, 5)}...`);
    console.log(`Chat ID: ${telegramSettings.chatId}`);
    
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
      const result = await response.json();
      console.log('Повідомлення успішно відправлено в Telegram:', result);
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
  console.log('Відправляємо сповіщення про замовлення:', notification);
  console.log('Поточні налаштування email:', emailSettings);
  console.log('Поточні налаштування Telegram:', telegramSettings);
  
  let emailSent = false;
  let telegramSent = false;
  
  // Відправка email
  if (emailSettings.enabled) {
    console.log('Спроба відправки email через FormSubmit');
    console.log('FormSubmit активовано:', emailSettings.formSubmitActivated);
    console.log('Email відправника:', emailSettings.senderEmail);
    
    if (!emailSettings.formSubmitActivated) {
      console.warn('FormSubmit не активовано! Перевірте налаштування в адмін-панелі.');
    }
    
    if (!emailSettings.senderEmail) {
      console.warn('Email відправника не вказано! Перевірте налаштування в адмін-панелі.');
    }
    
    // Використовуємо FormSubmit (безкоштовний сервіс)
    emailSent = await sendEmailViaFormSubmit(notification, emailSettings);
    console.log('Результат відправки email:', emailSent ? 'Успішно' : 'Невдало');
  } else {
    console.log('Відправка email вимкнена в налаштуваннях');
  }
  
  // Відправка Telegram
  if (telegramSettings.enabled) {
    console.log('Спроба відправки повідомлення в Telegram');
    telegramSent = await sendTelegramNotification(notification);
    console.log('Результат відправки в Telegram:', telegramSent ? 'Успішно' : 'Невдало');
  } else {
    console.log('Відправка Telegram вимкнена в налаштуваннях');
  }
  
  // Повертаємо true, якщо хоча б один канал спрацював
  const result = emailSent || telegramSent;
  console.log('Загальний результат відправки сповіщень:', result ? 'Успішно' : 'Невдало');
  
  return result;
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
