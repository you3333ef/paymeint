// Logistics Services Configuration for all GCC countries
export interface LogisticsService {
  id: string;
  key: string;
  name: string;
  description: string;
  type: "freight" | "warehouse" | "customs" | "delivery";
}

export const logisticsServices: Record<string, LogisticsService[]> = {
  // Saudi Arabia - السعودية
  SA: [
    {
      id: "sa-naqel",
      key: "naqel",
      name: "ناقل إكسبرس",
      description: "شركة ناقل للخدمات اللوجستية",
      type: "freight"
    },
    {
      id: "sa-brn",
      key: "brn",
      name: "برن",
      description: "الخدمات اللوجستية المتقدمة",
      type: "freight"
    },
    {
      id: "sa-alsalam",
      key: "alsalam",
      name: "السلام للشحن",
      description: "شركة السلام للخدمات اللوجستية",
      type: "warehouse"
    },
    {
      id: "sa-spl",
      key: "spl",
      name: "الشركة السعودية للخدمات اللوجستية",
      description: "خدمات لوجستية متكاملة",
      type: "customs"
    }
  ],

  // UAE - الإمارات
  AE: [
    {
      id: "ae-dpworld",
      key: "dpworld",
      name: "DP World",
      description: "DP World - Global Trade Enabler",
      type: "freight"
    },
    {
      id: "ae-damco",
      key: "damco",
      name: "دامكو",
      description: "خدمات الشحن والتخليص",
      type: "customs"
    },
    {
      id: "ae-al-futtaim",
      key: "alfuttaim",
      name: "الفطيم اللوجستية",
      description: "Al Futtaim Logistics",
      type: "warehouse"
    },
    {
      id: "ae-aramex",
      key: "aramex",
      name: "أرامكس",
      description: "خدمات الشحن السريع",
      type: "delivery"
    }
  ],

  // Kuwait - الكويت
  KW: [
    {
      id: "kw-post",
      key: "kwpost",
      name: "بريد الكويت",
      description: "المشغل الوطني للبريد",
      type: "delivery"
    },
    {
      id: "kw-agility",
      key: "agility",
      name: "جلوبال لوجستيكس",
      description: "خدمات لوجستية متطورة",
      type: "freight"
    }
  ],

  // Qatar - قطر
  QA: [
    {
      id: "qa-marsa",
      key: "marsa",
      name: "مارسا قطر",
      description: "Qatar Ports Management Company",
      type: "freight"
    },
    {
      id: "qa-dpworld",
      key: "dpworld",
      name: "DP World",
      description: "DP World Qatar",
      type: "freight"
    },
    {
      id: "qa-qatar-post",
      key: "qpost",
      name: "بريد قطر",
      description: "Qatar Post",
      type: "delivery"
    }
  ],

  // Oman - عُمان
  OM: [
    {
      id: "om-oman-port",
      key: "omanport",
      name: "موانئ عمان",
      description: "Oman Ports and Free Zone",
      type: "freight"
    },
    {
      id: "om-post",
      key: "omanpost",
      name: "بريد عمان",
      description: "Oman Post",
      type: "delivery"
    }
  ],

  // Bahrain - البحرين
  BH: [
    {
      id: "bh-port",
      key: "bahrainport",
      name: "ميناء البحرين",
      description: "Bahrain Port",
      type: "freight"
    },
    {
      id: "bh-post",
      key: "bahpost",
      name: "بريد البحرين",
      description: "Bahrain Post",
      type: "delivery"
    }
  ]
};

export const getLogisticsServicesByCountry = (countryCode: string): LogisticsService[] => {
  return logisticsServices[countryCode.toUpperCase()] || [];
};
