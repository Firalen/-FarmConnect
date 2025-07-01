import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      welcome: 'Welcome to FarmConnect!',
      login: 'Login',
      register: 'Register',
      dashboard: 'Dashboard',
      products: 'Products',
      articles: 'Articles',
      chat: 'Chat',
      admin: 'Admin',
    },
  },
  am: {
    translation: {
      welcome: 'እንኳን ወደ FarmConnect በደህና መጡ!',
      login: 'ግባ',
      register: 'ይመዝገቡ',
      dashboard: 'ዳሽቦርድ',
      products: 'ምርቶች',
      articles: 'መጣጥፎች',
      chat: 'ውይይት',
      admin: 'አስተዳዳሪ',
    },
  },
  om: {
    translation: {
      welcome: 'Baga nagaan dhuftan FarmConnect!',
      login: 'Seeni',
      register: 'Galmaai',
      dashboard: 'Daashboordii',
      products: 'Oomishaalee',
      articles: 'Barreeffamoota',
      chat: 'Waliigalte',
      admin: 'Bulchaa',
    },
  },
  // Add other languages here
};

i18n.use(initReactI18next).init({
  resources,
  lng: 'en',
  fallbackLng: 'en',
  interpolation: { escapeValue: false },
});

export default i18n; 