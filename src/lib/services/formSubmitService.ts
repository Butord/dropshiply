
import { OrderNotification, EmailSettings } from '../types';
import { prepareTemplate, prepareTemplateVariables } from './emailTemplateService';

/**
 * Формує правильний URL для FormSubmit
 */
export const getFormSubmitUrl = (email: string): string => {
  // Очистка від можливих зайвих пробілів
  const cleanEmail = email.trim();
  
  // Базовий URL FormSubmit
  let formSubmitUrl = `https://formsubmit.co/${cleanEmail}`;
  
  // Запобігаємо подвійному https:// в URL
  if (formSubmitUrl.includes('https://') && formSubmitUrl.indexOf('https://') > 0) {
    formSubmitUrl = formSubmitUrl.replace(/https:\/\/(.*?)https:\/\//, 'https://');
  }
  
  console.log(`formSubmitService: Сформовано URL для FormSubmit: ${formSubmitUrl}`);
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
    console.log('formSubmitService: Початок відправки через FormSubmit');
    
    // Перевірка налаштувань FormSubmit
    if (!settings.senderEmail || !settings.formSubmitActivated) {
      console.error('formSubmitService: FormSubmit не активовано або відсутня email адреса відправника:', {
        senderEmail: settings.senderEmail,
        formSubmitActivated: settings.formSubmitActivated
      });
      return false;
    }
    
    // Перевірка наявності email отримувача
    if (!notification.customerEmail) {
      console.error('formSubmitService: Відсутня email адреса отримувача');
      return false;
    }
    
    // Підготовка змінних для шаблону
    const variables = prepareTemplateVariables(notification);
    
    // Якщо шаблон або тема відсутні, використовуємо значення за замовчуванням
    const defaultTemplate = "Замовлення {{orderNumber}} прийнято. Дякуємо, {{name}}!<br>Сума замовлення: {{amount}} грн<br>Спосіб оплати: {{paymentMethod}}";
    const defaultSubject = "Замовлення {{orderNumber}} успішно оформлено";
    
    const template = settings.template || defaultTemplate;
    const subjectTemplate = settings.subject || defaultSubject;
    
    const content = prepareTemplate(template, variables);
    const subject = prepareTemplate(subjectTemplate, variables);
    
    console.log(`formSubmitService: Підготовлено повідомлення для відправки`);
    console.log(`formSubmitService: Відправник: ${settings.senderEmail}`);
    console.log(`formSubmitService: Отримувач: ${notification.customerEmail}`);
    console.log(`formSubmitService: Тема: ${subject}`);
    console.log(`formSubmitService: Вміст повідомлення: ${content.substring(0, 100)}...`);
    
    // Використання formsubmit.co API
    const formData = new FormData();
    formData.append('email', notification.customerEmail);
    formData.append('_subject', subject);
    formData.append('message', content);
    formData.append('_template', 'box');
    formData.append('_captcha', 'false'); // Вимикаємо капчу
    
    // Зворотна адреса (від кого лист)
    formData.append('_replyto', settings.senderEmail); 
    // Спеціальні поля FormSubmit для покращення доставки листів
    formData.append('_cc', settings.senderEmail); // Копія листа на адресу відправника
    formData.append('_autoresponse', 'Ваше замовлення успішно прийнято!'); // Автовідповідь
    
    // Використовуємо правильний URL для FormSubmit
    const formSubmitUrl = getFormSubmitUrl(settings.senderEmail);
    
    console.log(`formSubmitService: Надсилаємо запит на: ${formSubmitUrl}`);
    
    const response = await fetch(formSubmitUrl, {
      method: 'POST',
      body: formData,
      headers: {
        'Accept': 'application/json'
      }
    });
    
    console.log(`formSubmitService: Отримано відповідь зі статусом: ${response.status}`);
    
    if (response.ok) {
      try {
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          const result = await response.json();
          console.log('formSubmitService: Відповідь від formsubmit.co (JSON):', result);
        } else {
          console.log('formSubmitService: Отримано не-JSON відповідь від formsubmit.co');
          const text = await response.text();
          console.log('formSubmitService: Відповідь (текст):', text.substring(0, 300));
          
          // Перевіряємо, чи є маркери успіху або помилки в HTML відповіді
          if (text.includes('Thank you') || text.includes('success') || text.includes('Success')) {
            console.log('formSubmitService: Лист відправлено через formsubmit.co успішно');
          } else if (text.includes('confirm') || text.includes('confirm your email') || text.includes('activation')) {
            console.log('formSubmitService: FormSubmit вимагає підтвердження email. Перевірте свою поштову скриньку і підтвердіть активацію FormSubmit.');
            return false;
          }
        }
        
        // Повідомляємо про успішну відправку
        console.log('formSubmitService: Лист відправлено через formsubmit.co');
        return true;
      } catch (parseError) {
        console.error('formSubmitService: Помилка розбору відповіді:', parseError);
        return response.ok; // Повертаємо true, якщо статус відповіді був успішним
      }
    } else {
      const errorText = await response.text();
      console.error(`formSubmitService: Помилка відправки через formsubmit.co. Статус: ${response.status}`);
      console.error('formSubmitService: Текст помилки:', errorText);
      return false;
    }
  } catch (error) {
    console.error('formSubmitService: Помилка відправки email через formsubmit.co:', error);
    return false;
  }
};

/**
 * Пряма перевірка активації FormSubmit
 * FormSubmit вимагає спочатку надіслати форму один раз для активації
 */
export const verifyFormSubmitActivation = async (email: string): Promise<boolean> => {
  try {
    console.log(`formSubmitService: Початок перевірки активації FormSubmit для ${email}`);
    
    // Переконуємося, що email не порожній
    if (!email || email.trim() === '') {
      console.error('formSubmitService: Email адреса порожня');
      return false;
    }
    
    // Формуємо коректний URL для FormSubmit
    const formSubmitUrl = getFormSubmitUrl(email.trim());
    
    console.log(`formSubmitService: Надсилаємо тестовий запит на: ${formSubmitUrl}`);
    
    const testFormData = new FormData();
    testFormData.append('email', email); // Відправляємо на той самий email
    testFormData.append('_subject', 'FormSubmit Activation Test');
    testFormData.append('message', 'This is a test message to activate FormSubmit for your email');
    testFormData.append('_template', 'box');
    testFormData.append('_captcha', 'false');
    testFormData.append('_replyto', email); // Зворотна адреса
    testFormData.append('_cc', email); // Додаємо копію для підвищення шансів доставки
    testFormData.append('name', 'Test FormSubmit Activation'); // Додаємо ім'я для кращої доставки
    
    const response = await fetch(formSubmitUrl, {
      method: 'POST',
      body: testFormData,
      headers: {
        'Accept': 'application/json'
      }
    });
    
    console.log(`formSubmitService: Отримано відповідь зі статусом: ${response.status}`);
    
    if (response.ok) {
      try {
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          const result = await response.json();
          console.log('formSubmitService: FormSubmit активовано успішно (JSON):', result);
        } else {
          // Якщо відповідь не JSON, це все одно може бути успішно
          const text = await response.text();
          console.log('formSubmitService: Отримано не-JSON відповідь від formsubmit.co');
          console.log('formSubmitService: Текст відповіді:', text.substring(0, 300));
          
          // Перевіряємо, чи містить відповідь маркери успіху або потребує активації
          if (text.includes('Thank you') || text.includes('success') || text.includes('Success')) {
            console.log('formSubmitService: FormSubmit успішно активовано');
          } else if (text.includes('confirm') || text.includes('confirm your email') || text.includes('activation')) {
            console.log('formSubmitService: FormSubmit вимагає підтвердження email. Перевірте свою поштову скриньку і підтвердіть активацію.');
            // Повідомляємо користувачу, що потрібно перевірити пошту для активації
            return false;
          }
        }
        
        console.log('formSubmitService: FormSubmit успішно активовано або вже активовано раніше');
        return true; // Якщо статус 200, вважаємо успішним
      } catch (parseError) {
        console.log('formSubmitService: Помилка розбору JSON, але статус відповіді успішний:', parseError);
        return true; // Якщо статус 200, навіть якщо не можемо розібрати JSON
      }
    } else {
      console.error(`formSubmitService: Помилка активації FormSubmit. Статус: ${response.status}`);
      
      try {
        const errorText = await response.text();
        console.error('formSubmitService: Текст помилки:', errorText.substring(0, 300));
      } catch (e) {
        console.error('formSubmitService: Не вдалося отримати текст помилки');
      }
      
      return false;
    }
  } catch (error) {
    console.error('formSubmitService: Помилка перевірки активації FormSubmit:', error);
    return false;
  }
};
