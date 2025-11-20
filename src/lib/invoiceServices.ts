// Invoice Services Configuration for all GCC countries
export interface InvoiceService {
  id: string;
  key: string;
  name: string;
  description: string;
}

export const invoiceServices: Record<string, InvoiceService[]> = {
  // Saudi Arabia - السعودية
  SA: [
    {
      id: "sa-zoho",
      key: "zoho_invoice",
      name: "زوهو إنفويز",
      description: "منصة إنشاء وإدارة الفواتير الإلكترونية"
    },
    {
      id: "sa-quickbooks",
      key: "quickbooks",
      name: "كويكبوكس",
      description: "نظام محاسبة وفواتير متكامل للشركات"
    },
    {
      id: "sa-wave",
      key: "wave",
      name: "Wave",
      description: "فواتير بسيطة وسهلة الاستخدام"
    }
  ],

  // UAE - الإمارات
  AE: [
    {
      id: "ae-zoho",
      key: "zoho_invoice",
      name: "Zoho Invoice",
      description: "Professional Invoice Management"
    },
    {
      id: "ae-freshbooks",
      key: "freshbooks",
      name: "FreshBooks",
      description: "Cloud-based invoicing for professionals"
    },
    {
      id: "ae-quickbooks",
      key: "quickbooks",
      name: "QuickBooks",
      description: "Complete accounting and invoicing solution"
    }
  ],

  // Kuwait - الكويت
  KW: [
    {
      id: "kw-zoho",
      key: "zoho_invoice",
      name: "زوهو إنفويز",
      description: "إنشاء فواتير احترافية"
    },
    {
      id: "kw-wave",
      key: "wave",
      name: "Wave",
      description: "نظام فواتير سهل وبسيط"
    }
  ],

  // Qatar - قطر
  QA: [
    {
      id: "qa-zoho",
      key: "zoho_invoice",
      name: "Zoho Invoice",
      description: "Professional invoicing platform"
    },
    {
      id: "qa-quickbooks",
      key: "quickbooks",
      name: "QuickBooks",
      description: "Complete accounting solution"
    }
  ],

  // Oman - عُمان
  OM: [
    {
      id: "om-zoho",
      key: "zoho_invoice",
      name: "Zoho Invoice",
      description: "إنشاء فواتير إلكترونية"
    },
    {
      id: "om-wave",
      key: "wave",
      name: "Wave",
      description: "نظام فواتير مرن وسهل"
    }
  ],

  // Bahrain - البحرين
  BH: [
    {
      id: "bh-zoho",
      key: "zoho_invoice",
      name: "Zoho Invoice",
      description: "Professional invoice management"
    },
    {
      id: "bh-freshbooks",
      key: "freshbooks",
      name: "FreshBooks",
      description: "Cloud-based invoicing"
    }
  ]
};

export const getInvoiceServicesByCountry = (countryCode: string): InvoiceService[] => {
  return invoiceServices[countryCode.toUpperCase()] || [];
};
