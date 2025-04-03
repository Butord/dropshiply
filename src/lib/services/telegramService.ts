
import { OrderNotification, TelegramSettings } from '../types';
import { getStoredTelegramSettings, saveTelegramSettings } from './settingsService';

// Ініціалізація з localStorage
let telegramSettings: TelegramSettings = getStoredTelegramSettings();

// Отримання налаштувань Telegram
export const getTelegramSettings = (): TelegramSettings => {
  return telegramSettings;
};

// Оновлення налаштувань Telegram
export const updateTelegramSettings = (settings: Partial<TelegramSettings>): void => {
  telegramSettings = { ...telegramSettings, ...settings };
  console.log('Оновлено налаштування Telegram:', telegramSettings);
  
  // Збереження в localStorage
  saveTelegramSettings(telegramSettings);
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
