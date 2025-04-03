
import { OrderNotification } from '../types';
import { getEmailSettings } from './emailSettingsService';
import { getTelegramSettings, sendTelegramNotification } from './telegramService';
import { sendEmailNotification } from './emailService';

// Перекспорт функцій з інших сервісів для зворотної сумісності
export { getEmailSettings, updateEmailSettings, activateFormSubmit } from './emailSettingsService';
export { getTelegramSettings, updateTelegramSettings } from './telegramService';

// Метод для відправки сповіщення про замовлення
export const sendOrderNotification = async (notification: OrderNotification): Promise<boolean> => {
  console.log('notificationService: Відправляємо сповіщення про замовлення:', notification);
  
  const emailSettings = getEmailSettings();
  const telegramSettings = getTelegramSettings();
  
  console.log('notificationService: Поточні налаштування email:', emailSettings);
  console.log('notificationService: Поточні налаштування Telegram:', telegramSettings);
  
  let emailSent = false;
  let telegramSent = false;
  
  // Відправка email
  if (emailSettings.enabled) {
    console.log('notificationService: Спроба відправки email через FormSubmit');
    console.log('notificationService: FormSubmit активовано:', emailSettings.formSubmitActivated);
    console.log('notificationService: Email відправника:', emailSettings.senderEmail);
    
    if (!emailSettings.formSubmitActivated) {
      console.warn('notificationService: FormSubmit не активовано! Перевірте налаштування в адмін-панелі.');
    }
    
    if (!emailSettings.senderEmail) {
      console.warn('notificationService: Email відправника не вказано! Перевірте налаштування в адмін-панелі.');
    }
    
    // Використовуємо оновлену функцію sendEmailNotification
    emailSent = await sendEmailNotification(notification, emailSettings);
    console.log('notificationService: Результат відправки email:', emailSent ? 'Успішно' : 'Невдало');
  } else {
    console.log('notificationService: Відправка email вимкнена в налаштуваннях');
  }
  
  // Відправка Telegram
  if (telegramSettings.enabled) {
    console.log('notificationService: Спроба відправки повідомлення в Telegram');
    telegramSent = await sendTelegramNotification(notification);
    console.log('notificationService: Результат відправки в Telegram:', telegramSent ? 'Успішно' : 'Невдало');
  } else {
    console.log('notificationService: Відправка Telegram вимкнена в налаштуваннях');
  }
  
  // Повертаємо true, якщо хоча б один канал спрацював
  const result = emailSent || telegramSent;
  console.log('notificationService: Загальний результат відправки сповіщень:', result ? 'Успішно' : 'Невдало');
  
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
