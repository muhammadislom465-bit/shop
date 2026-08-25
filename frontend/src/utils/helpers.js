/**
 * Uzum Market - Yordamchi funksiyalar
 * Barcha sahifalarda ishlatilishi mumkin bo'lgan umumiy yordamchi funksiyalar to'plami
 */

/**
 * Narxni formatlash (UZS)
 * @param {number} amount - Narx miqdori
 * @returns {string} Formatlangan narx
 */
export const formatPrice = (amount) => {
  if (!amount && amount !== 0) return "0 so'm";
  return new Intl.NumberFormat('uz-UZ').format(Math.round(amount)) + " so'm";
};

/**
 * Sanani formatlash
 * @param {string} dateStr - ISO format sana
 * @param {string} format - 'short', 'long', 'relative'
 * @returns {string} Formatlangan sana
 */
export const formatDate = (dateStr, format = 'short') => {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  
  if (format === 'relative') {
    const now = new Date();
    const diff = now - date;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    
    if (minutes < 1) return 'Hozirgina';
    if (minutes < 60) return `${minutes} daqiqa oldin`;
    if (hours < 24) return `${hours} soat oldin`;
    if (days < 7) return `${days} kun oldin`;
    if (days < 30) return `${Math.floor(days / 7)} hafta oldin`;
    if (days < 365) return `${Math.floor(days / 30)} oy oldin`;
    return `${Math.floor(days / 365)} yil oldin`;
  }
  
  if (format === 'long') {
    return date.toLocaleDateString('uz-UZ', {
      year: 'numeric', month: 'long', day: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });
  }
  
  return date.toLocaleDateString('uz-UZ', {
    year: 'numeric', month: 'short', day: 'numeric'
  });
};

/**
 * Chegirma foizini hisoblash
 * @param {number} originalPrice - Asl narx
 * @param {number} discountPrice - Chegirmali narx
 * @returns {number} Chegirma foizi
 */
export const calculateDiscountPercentage = (originalPrice, discountPrice) => {
  if (!originalPrice || !discountPrice || discountPrice >= originalPrice) return 0;
  return Math.round(((originalPrice - discountPrice) / originalPrice) * 100);
};

/**
 * Matnni qisqartirish
 * @param {string} text - Asl matn
 * @param {number} maxLength - Maksimal uzunlik
 * @returns {string} Qisqartirilgan matn
 */
export const truncateText = (text, maxLength = 100) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength).trim() + '...';
};

/**
 * Buyurtma holati tarjimasi
 * @param {string} status - Holat kodi
 * @returns {{ label: string, color: string, bgColor: string }}
 */
export const getOrderStatusInfo = (status) => {
  const statusMap = {
    'kutilmoqda': { label: 'Kutilmoqda', color: 'text-yellow-700', bgColor: 'bg-yellow-50 border-yellow-200' },
    'yetkazilmoqda': { label: 'Yetkazilmoqda', color: 'text-blue-700', bgColor: 'bg-blue-50 border-blue-200' },
    'yetkazildi': { label: 'Yetkazildi', color: 'text-green-700', bgColor: 'bg-green-50 border-green-200' },
    'bekor_qilindi': { label: 'Bekor qilindi', color: 'text-red-700', bgColor: 'bg-red-50 border-red-200' }
  };
  return statusMap[status] || { label: status, color: 'text-gray-700', bgColor: 'bg-gray-50 border-gray-200' };
};

/**
 * To'lov usuli tarjimasi
 * @param {string} method - To'lov usuli kodi
 * @returns {string} O'zbek tilidagi tarjima
 */
export const getPaymentMethodLabel = (method) => {
  const methods = {
    'cash': 'Naqd pul',
    'card': 'Plastik karta',
    'installment': 'Muddatli to\'lov (Nasiya)'
  };
  return methods[method] || method;
};

/**
 * Telefon raqamini formatlash
 * @param {string} phone - Telefon raqami
 * @returns {string} Formatlangan raqam
 */
export const formatPhoneNumber = (phone) => {
  if (!phone) return '';
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.length === 12) {
    return `+${cleaned.slice(0, 3)} ${cleaned.slice(3, 5)} ${cleaned.slice(5, 8)} ${cleaned.slice(8, 10)} ${cleaned.slice(10)}`;
  }
  if (cleaned.length === 9) {
    return `+998 ${cleaned.slice(0, 2)} ${cleaned.slice(2, 5)} ${cleaned.slice(5, 7)} ${cleaned.slice(7)}`;
  }
  return phone;
};

/**
 * Reyting yulduzchalarini generatsiya qilish
 * @param {number} rating - Reyting qiymati (1-5)
 * @returns {{ full: number, half: boolean, empty: number }}
 */
export const getRatingStars = (rating) => {
  const full = Math.floor(rating);
  const half = rating % 1 >= 0.5;
  const empty = 5 - full - (half ? 1 : 0);
  return { full, half, empty };
};

/**
 * Sonni qisqartirish (1000 -> 1K, 1000000 -> 1M)
 * @param {number} num - Son
 * @returns {string} Qisqartirilgan son
 */
export const shortenNumber = (num) => {
  if (!num) return '0';
  if (num >= 1000000) return (num / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
  if (num >= 1000) return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
  return String(num);
};

/**
 * LocalStorage bilan ishlash (xavfsiz)
 */
export const storage = {
  get: (key, defaultValue = null) => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch {
      return defaultValue;
    }
  },
  set: (key, value) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (err) {
      console.warn('LocalStorage yozishda xatolik:', err);
    }
  },
  remove: (key) => {
    try {
      localStorage.removeItem(key);
    } catch (err) {
      console.warn('LocalStorage o\'chirishda xatolik:', err);
    }
  }
};

/**
 * Debounce funksiyasi (qidiruv uchun)
 * @param {Function} func - Funksiya
 * @param {number} delay - Kechikish (ms)
 * @returns {Function} Debounced funksiya
 */
export const debounce = (func, delay = 300) => {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};

/**
 * Klasslarni birlashtirish (conditional classNames)
 * @param  {...string} classes - CSS klasslar
 * @returns {string} Birlashtirilgan klasslar
 */
export const cn = (...classes) => {
  return classes.filter(Boolean).join(' ');
};

/**
 * O'zbekiston viloyatlari ro'yxati
 */
export const UZBEKISTAN_REGIONS = [
  'Toshkent shahri',
  'Toshkent viloyati',
  'Andijon viloyati',
  'Buxoro viloyati',
  'Farg\'ona viloyati',
  'Jizzax viloyati',
  'Xorazm viloyati',
  'Namangan viloyati',
  'Navoiy viloyati',
  'Qashqadaryo viloyati',
  'Qoraqalpog\'iston Respublikasi',
  'Samarqand viloyati',
  'Sirdaryo viloyati',
  'Surxondaryo viloyati'
];

/**
 * Tag ranglarini olish
 * @param {string} color - Rang nomi
 * @returns {{ bg: string, text: string }}
 */
export const getTagColors = (color) => {
  const colors = {
    'purple': { bg: 'bg-purple-100', text: 'text-purple-700' },
    'red': { bg: 'bg-red-100', text: 'text-red-700' },
    'green': { bg: 'bg-green-100', text: 'text-green-700' },
    'blue': { bg: 'bg-blue-100', text: 'text-blue-700' },
    'amber': { bg: 'bg-amber-100', text: 'text-amber-700' },
    'yellow': { bg: 'bg-yellow-100', text: 'text-yellow-700' }
  };
  return colors[color] || colors['purple'];
};
