
import emailjs from 'emailjs-com';
import { EmailSettings, OrderNotification } from '../types';

/**
 * Ініціалізація EmailJS з ID користувача
 * Зверніть увагу: у безкоштовному плані доступно до 200 листів на місяць
 */
export const initEmailService = (userId: string) => {
  emailjs.init(userId);
};

/**
 * Підготовка шаблону повідомлення з заміною змінних
 */
export const prepareTemplate = (template: string, variables: Record<string, string | number>) => {
  let result = template;
  
  Object.entries(variables).forEach(([key, value]) => {
    const regex = new RegExp(`{{${key}}}`, 'g');
    result = result.replace(regex, String(value));
  });
  
  return result;
};

/**
 * Відправка повідомлення через EmailJS
 */
export const sendOrderConfirmationEmail = async (
  notification: OrderNotification,
  settings: EmailSettings,
  serviceId: string,
  templateId: string
): Promise<boolean> => {
  try {
    // Підготовка даних для шаблону
    const itemsList = notification.items
      .map(item => `${item.name} x ${item.quantity} - ${item.price} грн`)
      .join('\n');
    
    // Підготовка змінних для шаблону
    const variables = {
      name: notification.customerName,
      orderNumber: notification.orderNumber,
      amount: notification.amount,
      items: itemsList,
      paymentMethod: notification.paymentMethod,
      paymentDetails: notification.paymentDetails || ''
    };
    
    // Заміна змінних у шаблоні
    const content = prepareTemplate(settings.template, variables);
    
    // Відправка листа
    const response = await emailjs.send(
      serviceId,
      templateId,
      {
        to_email: notification.customerEmail,
        to_name: notification.customerName,
        from_name: settings.senderName || 'Ваш магазин',
        subject: prepareTemplate(settings.subject, variables),
        message: content
      }
    );
    
    console.log('Email успішно відправлено:', response);
    return true;
  } catch (error) {
    console.error('Помилка відправки email:', error);
    return false;
  }
};

/**
 * Відправка email через FormSubmit.co API
 */
export const sendEmailViaFormSubmit = async (
  notification: OrderNotification,
  settings: EmailSettings
): Promise<boolean> => {
  try {
    // Підготовка даних
    const itemsList = notification.items
      .map(item => `${item.name} x ${item.quantity} - ${item.price} грн`)
      .join('\n');
    
    // Підготовка змінних для шаблону
    const variables = {
      name: notification.customerName,
      orderNumber: notification.orderNumber,
      amount: notification.amount,
      items: itemsList,
      paymentMethod: notification.paymentMethod,
      paymentDetails: notification.paymentDetails || ''
    };

    const content = prepareTemplate(settings.template, variables);
    const subject = prepareTemplate(settings.subject, variables);
    
    // Перевірка налаштувань FormSubmit
    if (!settings.senderEmail || !settings.formSubmitActivated) {
      console.error('FormSubmit не активовано або відсутня email адреса відправника');
      return false;
    }
    
    console.log(`Відправляємо повідомлення через FormSubmit. Email відправника: ${settings.senderEmail}`);
    console.log(`Отримувач: ${notification.customerEmail}`);
    
    // Використання formsubmit.co API
    const formData = new FormData();
    formData.append('email', notification.customerEmail);
    formData.append('_subject', subject);
    formData.append('message', content);
    formData.append('_template', 'box');
    formData.append('_captcha', 'false'); // Вимикаємо капчу
    
    // Формуємо URL для FormSubmit з активованою електронною адресою
    const formSubmitUrl = `https://formsubmit.co/${settings.senderEmail}`;
    
    console.log(`Надсилаємо запит на: ${formSubmitUrl}`);
    
    const response = await fetch(formSubmitUrl, {
      method: 'POST',
      body: formData,
      headers: {
        'Accept': 'application/json'
      }
    });
    
    if (response.ok) {
      const result = await response.json();
      console.log('Відповідь від formsubmit.co:', result);
      console.log('Лист відправлено через formsubmit.co');
      return true;
    } else {
      const errorText = await response.text();
      console.error('Помилка відправки через formsubmit.co. Статус:', response.status);
      console.error('Текст помилки:', errorText);
      return false;
    }
  } catch (error) {
    console.error('Помилка відправки email через formsubmit.co:', error);
    return false;
  }
};

/**
 * Пряма перевірка активації FormSubmit
 * FormSubmit вимагає спочатку надіслати форму один раз для активації
 */
export const verifyFormSubmitActivation = async (email: string): Promise<boolean> => {
  try {
    const testFormData = new FormData();
    testFormData.append('email', email); // Відправляємо на той самий email
    testFormData.append('_subject', 'FormSubmit Activation Test');
    testFormData.append('message', 'This is a test message to activate FormSubmit for your email');
    testFormData.append('_template', 'box');
    testFormData.append('_captcha', 'false');
    
    // URL для FormSubmit
    const formSubmitUrl = `https://formsubmit.co/${email}`;
    
    console.log(`Перевірка активації FormSubmit для ${email}`);
    console.log(`Надсилаємо тестовий запит на: ${formSubmitUrl}`);
    
    const response = await fetch(formSubmitUrl, {
      method: 'POST',
      body: testFormData,
      headers: {
        'Accept': 'application/json'
      }
    });
    
    if (response.ok) {
      console.log('FormSubmit активовано успішно:', await response.json());
      return true;
    } else {
      console.error('Помилка активації FormSubmit. Статус:', response.status);
      console.error('Текст помилки:', await response.text());
      return false;
    }
  } catch (error) {
    console.error('Помилка перевірки активації FormSubmit:', error);
    return false;
  }
};
