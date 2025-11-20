// Logistics Services Branding - All GCC logistics services
export const logisticsLogos: Record<string, { logo: string; colors: { primary: string; secondary: string }; ogImage?: string; heroImage?: string; description?: string }> = {
  // Naqel Express - Saudi Arabia
  naqel: {
    logo: "https://www.naqelexpress.com/images/logo.png",
    colors: {
      primary: "#0052A3",
      secondary: "#FF6B00"
    },
    ogImage: "/og-naqel.jpg",
    heroImage: "/hero-naqel.jpg",
    description: "شركة ناقل للخدمات اللوجستية"
  },

  // DP World - UAE
  dpworld: {
    logo: "https://www.dpworld.com/images/dp-world-logo.svg",
    colors: {
      primary: "#E31B23",
      secondary: "#FF6B6B"
    },
    ogImage: "/og-dpworld.jpg",
    heroImage: "/hero-dpworld.jpg",
    description: "DP World - Global Trade Enabler"
  },

  // BRN - Saudi Arabia
  brn: {
    logo: "https://www.brn.sa/images/logo.png",
    colors: {
      primary: "#007A33",
      secondary: "#00A651"
    },
    ogImage: "/og-brn.jpg",
    heroImage: "/hero-brn.jpg",
    description: "الخدمات اللوجستية المتقدمة"
  },

  // Al Salam - Saudi Arabia
  alsalam: {
    logo: "https://www.alsalam-logistics.com/images/logo.png",
    colors: {
      primary: "#1C4587",
      secondary: "#4285F4"
    },
    ogImage: "/og-alsalam.jpg",
    heroImage: "/hero-alsalam.jpg",
    description: "شركة السلام للخدمات اللوجستية"
  },

  // Damco - UAE
  damco: {
    logo: "https://www.damco.com/images/damco-logo.png",
    colors: {
      primary: "#0052CC",
      secondary: "#0077FF"
    },
    ogImage: "/og-damco.jpg",
    heroImage: "/hero-damco.jpg",
    description: "خدمات الشحن والتخليص"
  },

  // Al Futtaim Logistics - UAE
  alfutaim: {
    logo: "https://www.alfuttaim.com/images/logo.png",
    colors: {
      primary: "#8E1838",
      secondary: "#B71C1C"
    },
    ogImage: "/og-alfuttaim.jpg",
    heroImage: "/hero-alfuttaim.jpg",
    description: "Al Futtaim Logistics"
  }
};

export const getLogisticsBranding = (serviceName: string) => {
  const key = serviceName.toLowerCase();
  return logisticsLogos[key] || {
    logo: "",
    colors: {
      primary: "#7C3AED",
      secondary: "#A78BFA"
    },
    ogImage: "/og-aramex.jpg",
    heroImage: "/og-aramex.jpg",
    description: "خدمة لوجستية موثوقة"
  };
};
