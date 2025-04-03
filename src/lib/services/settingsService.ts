
import { EmailSettings, TelegramSettings } from '../types';

// Завантаження налаштувань з localStorage або використання значень за замовчуванням
export const getStoredEmailSettings = (): EmailSettings => {
  const storedSettings = localStorage.getItem('emailSettings');
  if (storedSettings) {
    try {
      return JSON.parse(storedSettings);
    } catch (error) {
      console.error('Помилка при завантаженні email налаштувань з localStorage:', error);
    }
  }
  return {
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
    formSubmitActivated: false
  };
};

export const getStoredTelegramSettings = (): TelegramSettings => {
  const storedSettings = localStorage.getItem('telegramSettings');
  if (storedSettings) {
    try {
      return JSON.parse(storedSettings);
    } catch (error) {
      console.error('Помилка при завантаженні Telegram налаштувань з localStorage:', error);
    }
  }
  return {
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
};

// Збереження налаштувань email в localStorage
export const saveEmailSettings = (settings: EmailSettings): void => {
  try {
    localStorage.setItem('emailSettings', JSON.stringify(settings));
    console.log("Email налаштування збережено в localStorage");
  } catch (error) {
    console.error("Помилка при збереженні email налаштувань в localStorage:", error);
  }
};

// Збереження налаштувань Telegram в localStorage
export const saveTelegramSettings = (settings: TelegramSettings): void => {
  try {
    localStorage.setItem('telegramSettings', JSON.stringify(settings));
    console.log("Telegram налаштування збережено в localStorage");
  } catch (error) {
    console.error("Помилка при збереженні Telegram налаштувань в localStorage:", error);
  }
};
