// Contract Services Configuration for all GCC countries
export interface ContractService {
  id: string;
  key: string;
  name: string;
  description: string;
  type: "rental" | "service" | "employment" | "sale";
}

export const contractServices: Record<string, ContractService[]> = {
  // Saudi Arabia - السعودية
  SA: [
    {
      id: "sa-ejari",
      key: "ejari",
      name: "إيجار",
      description: "منصة إيجار الموحدة",
      type: "rental"
    },
    {
      id: "sa-notary",
      key: "notary",
      name: "كاتب العدل",
      description: "وزارة العدل - كتابات العدل",
      type: "service"
    },
    {
      id: "sa-mandob",
      key: "mandob",
      name: "مندوب",
      description: "منصة مندوب للعقود",
      type: "service"
    },
    {
      id: "sa-najiz",
      key: "najiz",
      name: "ناجز",
      description: "منصة ناجز للخدمات العدلية",
      type: "service"
    }
  ],

  // UAE - الإمارات
  AE: [
    {
      id: "ae-rera",
      key: "rera",
      name: "ريرا",
      description: "هيئة تنظيم الأشغال العقارية - دبي",
      type: "rental"
    },
    {
      id: "ae-adrpc",
      key: "adrpc",
      name: "دائرة الأراضي والأملاك",
      description: "Abu Dhabi Department of Municipalities and Transport",
      type: "rental"
    },
    {
      id: "ae-notary",
      key: "notary",
      name: "كت العدل",
      description: "وزارة العدل الإماراتية",
      type: "service"
    },
    {
      id: "ae-mofa",
      key: "mofa",
      name: "وزارة الخارجية",
      description: "وزارة الخارجية والتعاون الدولي",
      type: "service"
    }
  ],

  // Kuwait - الكويت
  KW: [
    {
      id: "kw-mj",
      key: "mj",
      name: "وزارة العدل",
      description: "الوزارة الرسمية للعدالة",
      type: "service"
    },
    {
      id: "kw-realestate",
      key: "realestate",
      name: "التسجيل العقاري",
      description: "إدارة التسجيل العقاري",
      type: "rental"
    }
  ],

  // Qatar - قطر
  QA: [
    {
      id: "qa-qid",
      key: "qid",
      name: "قيد",
      description: "منصة قيق",
      type: "service"
    },
    {
      id: "qa-mcj",
      key: "mcj",
      name: "وزارة العدل",
      description: "Ministry of Justice Qatar",
      type: "service"
    },
    {
      id: "qa-moph",
      key: "moph",
      name: "وزارة التخطيط",
      description: "Ministry of Municipality and Environment",
      type: "rental"
    }
  ],

  // Oman - عُمان
  OM: [
    {
      id: "om-ministry-justice",
      key: "moj",
      name: "وزارة العدل والشؤون القانونية",
      description: "الوزارة الرسمية للعدالة",
      type: "service"
    },
    {
      id: "om-mahd",
      key: "mahd",
      name: "ماجد",
      description: "منصة ماجد للخدمات",
      type: "service"
    }
  ],

  // Bahrain - البحرين
  BH: [
    {
      id: "bh-ld",
      key: "ld",
      name: "أراضي البحرين",
      description: "إدارة أراضي وملكية الدولة",
      type: "rental"
    },
    {
      id: "bh-moj",
      key: "moj",
      name: "وزارة العدل",
      description: "Ministry of Justice Bahrain",
      type: "service"
    }
  ]
};

export const getContractServicesByCountry = (countryCode: string): ContractService[] => {
  return contractServices[countryCode.toUpperCase()] || [];
};
