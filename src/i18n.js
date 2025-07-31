import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import HttpBackend from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector';

i18n
  .use(HttpBackend) // โหลดไฟล์ JSON
  .use(LanguageDetector) // ตรวจจับภาษาของเบราว์เซอร์
  .use(initReactI18next) // เชื่อมกับ React
  .init({
    fallbackLng: 'en', // ใช้ภาษาอังกฤษเป็นค่าปริยาย
    debug: true,
    interpolation: {
      escapeValue: true // ปิดการ escape HTML
    },
    detection: {
      order: ["localStorage", "querystring", "cookie", "sessionStorage", "navigator", "htmlTag"],
      lookupLocalStorage: "i18nextLng",
      caches: []
    },
    initImmediate: false, // เลื่อนการ initialize
    backend: {
      loadPath: '/locales/{{lng}}/translation.json' // เส้นทางไฟล์ JSON
    }
  });

export default i18n;
