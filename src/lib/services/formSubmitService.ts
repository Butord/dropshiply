
import { OrderNotification, EmailSettings } from '../types';
import { prepareTemplate, prepareTemplateVariables } from './emailTemplateService';

/**
 * Формує правильний URL для FormSubmit
 */
export const getFormSubmitUrl = (email: string): string => {
  let formSubmitUrl = `https://formsubmit.co/${email}`;
  
  // Запобігаємо подвійному https:// в URL
  if (formSubmitUrl.includes('https://') && formSubmitUrl.indexOf('https://') > 0) {
    formSubmitUrl = formSubmitUrl.replace(/https:\/\/(.*?)https:\/\//, 'https://');
  }
  
  return formSubmitUrl;
};

/**
 * Відправка email через FormSubmit.co API
 */
export const sendEmailViaFormSubmit = async (
  notification: OrderNotification,
  settings: EmailSettings
): Promise<boolean> => {
  try {
    // Перевірка налаштувань FormSubmit
    if (!settings.senderEmail || !settings.formSubmitActivated) {
      console.error('FormSubmit не активовано або відсутня email адреса відправника');
      return false;
    }
    
    // Підготовка змінних для шаблону
    const variables = prepareTemplateVariables(notification);
    
    const content = prepareTemplate(settings.template, variables);
    const subject = prepareTemplate(settings.subject, variables);
    
    console.log(`Відправляємо повідомлення через FormSubmit. Email відправника: ${settings.senderEmail}`);
    console.log(`Отримувач: ${notification.customerEmail}`);
    console.log(`Тема: ${subject}`);
    console.log(`Вміст повідомлення: ${content.substring(0, 100)}...`);
    
    // Використання formsubmit.co API
    const formData = new FormData();
    formData.append('email', notification.customerEmail);
    formData.append('_subject', subject);
    formData.append('message', content);
    formData.append('_template', 'box');
    formData.append('_captcha', 'false'); // Вимикаємо капчу
    
    // Використовуємо правильний URL для FormSubmit
    const formSubmitUrl = getFormSubmitUrl(settings.senderEmail);
    
    console.log(`Надсилаємо запит на: ${formSubmitUrl}`);
    
    const response = await fetch(formSubmitUrl, {
      method: 'POST',
      body: formData,
      headers: {
        'Accept': 'application/json'
      }
    });
    
    if (response.ok) {
      try {
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          const result = await response.json();
          console.log('Відповідь від formsubmit.co:', result);
        } else {
          console.log('Отримано не-JSON відповідь від formsubmit.co');
          const text = await response.text();
          console.log('Відповідь:', text.substring(0, 300));
        }
        console.log('Лист відправлено через formsubmit.co');
        return true;
      } catch (parseError) {
        console.error('Помилка розбору відповіді:', parseError);
        return response.ok; // Повертаємо true, якщо статус відповіді був успішним
      }
    } else {
      const errorText = await response.text();
      console.error(`Помилка відправки через formsubmit.co. Статус: ${response.status}`);
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
    // Переконуємося, що email не порожній
    if (!email || email.trim() === '') {
      console.error('Email адреса порожня');
      return false;
    }
    
    // Формуємо коректний URL для FormSubmit
    const formSubmitUrl = getFormSubmitUrl(email);
    
    console.log(`Перевірка активації FormSubmit для ${email}`);
    console.log(`Надсилаємо тестовий запит на: ${formSubmitUrl}`);
    
    const testFormData = new FormData();
    testFormData.append('email', email); // Відправляємо на той самий email
    testFormData.append('_subject', 'FormSubmit Activation Test');
    testFormData.append('message', 'This is a test message to activate FormSubmit for your email');
    testFormData.append('_template', 'box');
    testFormData.append('_captcha', 'false');
    
    const response = await fetch(formSubmitUrl, {
      method: 'POST',
      body: testFormData,
      headers: {
        'Accept': 'application/json'
      }
    });
    
    console.log(`Отримано відповідь зі статусом: ${response.status}`);
    
    if (response.ok) {
      try {
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          const result = await response.json();
          console.log('FormSubmit активовано успішно:', result);
        } else {
          // Якщо відповідь не JSON, це все одно може бути успішно
          const text = await response.text();
          console.log('Отримано не-JSON відповідь від formsubmit.co');
          console.log('Текст відповіді:', text.substring(0, 300));
          
          // Перевіряємо, чи містить відповідь маркери успіху
          if (text.includes('success') || text.includes('thank') || text.includes('confirmation')) {
            console.log('Відповідь містить маркери успіху');
          }
        }
        return true; // Якщо статус 200, вважаємо успішним
      } catch (parseError) {
        console.log('Помилка розбору JSON, але статус відповіді успішний:', parseError);
        return true; // Якщо статус 200, навіть якщо не можемо розібрати JSON
      }
    } else {
      console.error(`Помилка активації FormSubmit. Статус: ${response.status}`);
      
      try {
        const errorText = await response.text();
        console.error('Текст помилки:', errorText.substring(0, 300));
      } catch (e) {
        console.error('Не вдалося отримати текст помилки');
      }
      
      return false;
    }
  } catch (error) {
    console.error('Помилка перевірки активації FormSubmit:', error);
    return false;
  }
};
