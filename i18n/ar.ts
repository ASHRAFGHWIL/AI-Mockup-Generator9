import { en } from './en';

// This is a placeholder for Arabic translations.
// In a real application, these would be translated by a professional.
export const ar: typeof en = Object.keys(en).reduce((acc, key) => {
  // A simple placeholder logic
  acc[key as keyof typeof en] = `(ar) ${en[key as keyof typeof en]}`;
  return acc;
}, {} as typeof en);

// Overwrite some specific keys for better RTL experience
ar.appTitle = "مولد النماذج بالذكاء الاصطناعي";
ar.generateButton = "إنشاء نموذج";
ar.generatingButton = "جاري الإنشاء...";
ar.productTypeLabel = "نوع المنتج";
ar.designSubjectLabel = "موضوع التصميم";
ar.backgroundImageLabel = "صورة الخلفية (اختياري)";

// Translations for share functionality
ar.shareMockupButton = "مشاركة";
ar.shareSuccess = "تم نسخ الصورة إلى الحافظة!";
ar.shareError = "تعذر مشاركة أو نسخ الصورة.";