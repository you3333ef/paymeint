// Contract Services Branding - All GCC contract services
export const contractLogos: Record<string, { logo: string; colors: { primary: string; secondary: string }; ogImage?: string; heroImage?: string; description?: string }> = {
  // Ejari - Saudi Arabia
  ejari: {
    logo: "https://www.ejari.sa/images/logo.png",
    colors: {
      primary: "#0052A3",
      secondary: "#FFB500"
    },
    ogImage: "/og-ejari.jpg",
    heroImage: "/hero-ejari.jpg",
    description: "منصة إيجار الموحدة"
  },

  // Notary - Saudi Arabia
  notary: {
    logo: "https://www.moj.gov.sa/Themes/MinistryPortal/images/logo.png",
    colors: {
      primary: "#006C35",
      secondary: "#00A651"
    },
    ogImage: "/og-notary.jpg",
    heroImage: "/hero-notary.jpg",
    description: "وزارة العدل - كتابات العدل"
  },

  // Mandob - Saudi Arabia
  mandob: {
    logo: "https://www.mandob.sa/images/logo.png",
    colors: {
      primary: "#E31B23",
      secondary: "#C41E3A"
    },
    ogImage: "/og-mandob.jpg",
    heroImage: "/hero-mandob.jpg",
    description: "منصة مندوب للعقود"
  },

  // RERA - Dubai UAE
  rera: {
    logo: "https://www.rera.ae/images/logo.png",
    colors: {
      primary: "#C8102E",
      secondary: "#E31B23"
    },
    ogImage: "/og-rera.jpg",
    heroImage: "/hero-rera.jpg",
    description: "هيئة تنظيم الأشغال العقارية - دبي"
  },

  // ADRPC - Abu Dhabi UAE
  adrpc: {
    logo: "https://www.dmt.gov.ae/themes/dmt2023/assets/images/logo.svg",
    colors: {
      primary: "#003087",
      secondary: "#0052CC"
    },
    ogImage: "/og-adrpc.jpg",
    heroImage: "/hero-adrpc.jpg",
    description: "دائرة الأراضي والأملاك - أبوظبي"
  },

  // QID - Qatar
  qid: {
    logo: "https://www.qid.gov.qa/images/logo.png",
    colors: {
      primary: "#8E1838",
      secondary: "#B71C1C"
    },
    ogImage: "/og-qid.jpg",
    heroImage: "/hero-qid.jpg",
    description: "منصة قيق"
  },

  // MOJ - Bahrain
  moj: {
    logo: "https://www.moj.gov.bh/images/logo.png",
    colors: {
      primary: "#CE1126",
      secondary: "#E31B23"
    },
    ogImage: "/og-moj.jpg",
    heroImage: "/hero-moj.jpg",
    description: "وزارة العدل - البحرين"
  }
};

export const getContractBranding = (serviceName: string) => {
  const key = serviceName.toLowerCase();
  return contractLogos[key] || {
    logo: "",
    colors: {
      primary: "#D97706",
      secondary: "#F59E0B"
    },
    ogImage: "/og-aramex.jpg",
    heroImage: "/og-aramex.jpg",
    description: "خدمة عقود موثوقة"
  };
};
