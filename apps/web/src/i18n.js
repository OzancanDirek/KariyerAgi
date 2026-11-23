import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { en } from './locales/en.js';
import enGenerated from './locales/en.generated.json';
import enDynamic from './locales/en.dynamic.json';
import enRemaining from './locales/en.remaining.json';

const savedLanguage = window.localStorage.getItem('careerpath:language');
const initialLanguage = savedLanguage === 'tr' || savedLanguage === 'en'
  ? savedLanguage : navigator.language.toLowerCase().startsWith('tr') ? 'tr' : 'en';

i18n.use(initReactI18next).init({
  lng: initialLanguage,
  fallbackLng: 'tr',
  supportedLngs: ['tr', 'en'],
  keySeparator: false,
  nsSeparator: false,
  resources: { tr: { translation: {} }, en: { translation: { ...enGenerated, ...enDynamic, ...enRemaining, ...en } } },
  interpolation: { escapeValue: false },
  returnNull: false,
});

document.documentElement.lang = initialLanguage;
i18n.on('languageChanged', (language) => {
  const selected = language === 'en' ? 'en' : 'tr';
  window.localStorage.setItem('careerpath:language', selected);
  document.documentElement.lang = selected;
});

export default i18n;
