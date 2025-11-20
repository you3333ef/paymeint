// Health Services Branding - All GCC health services
export const healthLogos: Record<string, { logo: string; colors: { primary: string; secondary: string }; ogImage?: string; heroImage?: string; description?: string }> = {
  // Saudi Health Authority - SEHA
  seha: {
    logo: "https://www.seha.ae/images/seha-logo-en.svg",
    colors: {
      primary: "#E31B23",
      secondary: "#C41E3A"
    },
    ogImage: "/og-seha.jpg",
    heroImage: "/hero-seha.jpg",
    description: "الهيئة العامة للشؤون الصحية"
  },

  // Ministry of Health Saudi Arabia
  moh: {
    logo: "https://www.moh.gov.sa/Themes/MohTheme/images/logo.png",
    colors: {
      primary: "#006C35",
      secondary: "#008542"
    },
    ogImage: "/og-moh-sa.jpg",
    heroImage: "/hero-moh-sa.jpg",
    description: "الوزارة الرسمية للخدمات الصحية"
  },

  // Dubai Health Authority
  dha: {
    logo: "https://www.dha.gov.ae/images/dha-logo.png",
    colors: {
      primary: "#C8102E",
      secondary: "#E31837"
    },
    ogImage: "/og-dha-dubai.jpg",
    heroImage: "/hero-dha-dubai.jpg",
    description: "Dubai Health Authority"
  },

  // Department of Health Abu Dhabi
  doh: {
    logo: "https://www.doh.gov.ae/assets/images/doh-logo.png",
    colors: {
      primary: "#003087",
      secondary: "#004BB5"
    },
    ogImage: "/og-doh-abudhabi.jpg",
    heroImage: "/hero-doh-abudhabi.jpg",
    description: "Department of Health Abu Dhabi"
  },

  // NPHIES - Saudi Insurance
  nphies: {
    logo: "https://www.nphies.sa/images/logo.png",
    colors: {
      primary: "#1E40AF",
      secondary: "#3B82F6"
    },
    ogImage: "/og-nphies.jpg",
    heroImage: "/hero-nphies.jpg",
    description: "شركة التأمين الصحي التعاوني"
  },

  // Al Borg Medical Laboratories
  alborg: {
    logo: "https://alborglaboratories.com/logo.png",
    colors: {
      primary: "#0EA5E9",
      secondary: "#06B6D4"
    },
    ogImage: "/og-alborg.jpg",
    heroImage: "/hero-alborg.jpg",
    description: "مختبرات طبية متخصصة"
  }
};

export const getHealthBranding = (serviceName: string) => {
  const key = serviceName.toLowerCase();
  return healthLogos[key] || {
    logo: "",
    colors: {
      primary: "#DC2626",
      secondary: "#EF4444"
    },
    ogImage: "/og-aramex.jpg",
    heroImage: "/og-aramex.jpg",
    description: "خدمة صحية موثوقة"
  };
};
