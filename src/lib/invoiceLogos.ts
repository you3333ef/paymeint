// Invoice Services Branding - All GCC invoice services
export const invoiceLogos: Record<string, { logo: string; colors: { primary: string; secondary: string }; ogImage?: string; heroImage?: string; description?: string }> = {
  // Zoho Invoice - Available in all countries
  zoho_invoice: {
    logo: "https://www.zoho.com/invoice/images/zoho-invoice-logo.svg",
    colors: {
      primary: "#D83B01",
      secondary: "#F97316"
    },
    ogImage: "/og-zoho-invoice.jpg",
    heroImage: "/hero-zoho-invoice.jpg",
    description: "منصة إنشاء وإدارة الفواتير الإلكترونية"
  },

  // QuickBooks - Multiple countries
  quickbooks: {
    logo: "https://quickbooks.intuit.com/content/dam/intuit/quickbooks/branding/marketing/logos/Intuit_QuickBooks_Logo.svg",
    colors: {
      primary: "#2CA01C",
      secondary: "#7BC143"
    },
    ogImage: "/og-quickbooks.jpg",
    heroImage: "/hero-quickbooks.jpg",
    description: "نظام محاسبة وفواتير متكامل للشركات"
  },

  // FreshBooks
  freshbooks: {
    logo: "https://www.freshbooks.com/images/freshbooks-logo-dark.svg",
    colors: {
      primary: "#375585",
      secondary: "#5B7DB1"
    },
    ogImage: "/og-freshbooks.jpg",
    heroImage: "/hero-freshbooks.jpg",
    description: "Cloud-based invoicing for professionals"
  },

  // Wave - Simple invoicing
  wave: {
    logo: "https://cdn.waveapps.com/images/wave-logo-blue.svg",
    colors: {
      primary: "#1E40AF",
      secondary: "#3B82F6"
    },
    ogImage: "/og-wave.jpg",
    heroImage: "/hero-wave.jpg",
    description: "فواتير بسيطة وسهلة الاستخدام"
  }
};

export const getInvoiceBranding = (serviceName: string) => {
  const key = serviceName.toLowerCase();
  return invoiceLogos[key] || {
    logo: "",
    colors: {
      primary: "#0EA5E9",
      secondary: "#06B6D4"
    },
    ogImage: "/og-aramex.jpg",
    heroImage: "/og-aramex.jpg",
    description: "خدمة فواتير موثوقة"
  };
};
