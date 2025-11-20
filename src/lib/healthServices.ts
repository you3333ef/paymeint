// Health Services Configuration for all GCC countries
export interface HealthService {
  id: string;
  key: string;
  name: string;
  description: string;
  category: "consultation" | "lab" | "pharmacy" | "insurance";
}

export const healthServices: Record<string, HealthService[]> = {
  // Saudi Arabia - السعودية
  SA: [
    {
      id: "sa-seha",
      key: "seha",
      name: "صحة",
      description: "الهيئة العامة للشؤون الصحية",
      category: "consultation"
    },
    {
      id: "sa-moh",
      key: "moh",
      name: "وزارة الصحة",
      description: "الوزارة الرسمية للخدمات الصحية",
      category: "consultation"
    },
    {
      id: "sa-nphies",
      key: "nphies",
      name: "نفيس",
      description: "شركة التأمين الصحي التعاوني",
      category: "insurance"
    },
    {
      id: "sa-lab",
      key: "alborg",
      name: "مختبر البرج",
      description: "مختبرات طبية متخصصة",
      category: "lab"
    }
  ],

  // UAE - الإمارات
  AE: [
    {
      id: "ae-dha",
      key: "dha",
      name: "هيئة الصحة بدبي",
      description: "Dubai Health Authority",
      category: "consultation"
    },
    {
      id: "ae-doh",
      key: "doh",
      name: "هيئة الصحة أبوظبي",
      description: "Department of Health Abu Dhabi",
      category: "consultation"
    },
    {
      id: "ae-seha",
      key: "seha",
      name: "صحة",
      description: "Abu Dhabi Health Services Company",
      category: "consultation"
    },
    {
      id: "ae-lab",
      key: "alborg",
      name: "مختبر البرج",
      description: "Al Borg Medical Laboratories",
      category: "lab"
    }
  ],

  // Kuwait - الكويت
  KW: [
    {
      id: "kw-moh",
      key: "moh",
      name: "وزارة الصحة",
      description: "الوزارة الرسمية للخدمات الصحية",
      category: "consultation"
    },
    {
      id: "kw-lab",
      key: "labcare",
      name: "مختبر كير",
      description: "مختبرات طبية متطورة",
      category: "lab"
    }
  ],

  // Qatar - قطر
  QA: [
    {
      id: "qa-moph",
      key: "moph",
      name: "وزارة الصحة العامة",
      description: "Ministry of Public Health Qatar",
      category: "consultation"
    },
    {
      id: "qa-hmc",
      key: "hmc",
      name: "مؤسسة حمد الطبية",
      description: "Hamad Medical Corporation",
      category: "consultation"
    }
  ],

  // Oman - عُمان
  OM: [
    {
      id: "om-moh",
      key: "moh",
      name: "وزارة الصحة",
      description: "الوزارة الرسمية للخدمات الصحية",
      category: "consultation"
    },
    {
      id: "om-squ",
      key: "squ",
      name: "جامعة السلطان قابوس",
      description: "مستشفى جامعة السلطان قابوس",
      category: "consultation"
    }
  ],

  // Bahrain - البحرين
  BH: [
    {
      id: "bh-moh",
      key: "moh",
      name: "وزارة الصحة",
      description: "الوزارة الرسمية للخدمات الصحية",
      category: "consultation"
    },
    {
      id: "bh-scfh",
      key: "scfh",
      name: "مجلس الصحة الخليجي",
      description: "The Executive Board of the Health Ministers' Council",
      category: "consultation"
    }
  ]
};

export const getHealthServicesByCountry = (countryCode: string): HealthService[] => {
  return healthServices[countryCode.toUpperCase()] || [];
};
