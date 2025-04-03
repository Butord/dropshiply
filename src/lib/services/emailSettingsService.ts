
import { EmailSettings } from '../types';
import { getStoredEmailSettings, saveEmailSettings } from './settingsService';
import { verifyFormSubmitActivation } from './formSubmitService';

// Ініціалізація з localStorage
let emailSettings: EmailSettings = getStoredEmailSettings();

// Отримання налаштувань пошти
export const getEmailSettings = (): EmailSettings => {
  return emailSettings;
};

// Оновлення налаштувань пошти
export const updateEmailSettings = (settings: Partial<EmailSettings>): void => {
  console.log("updateEmailSettings - попередні налаштування:", emailSettings);
  emailSettings = { ...emailSettings, ...settings };
  console.log("updateEmailSettings - оновлені налаштування:", emailSettings);
  
  // Збереження в localStorage
  saveEmailSettings(emailSettings);
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
