import React from 'react';
import { ShieldCheck, Truck, RefreshCw, Headphones, Heart } from 'lucide-react';

export const Footer = ({ onNavigateFAQ, onNavigatePVZ, onNavigateSeller, onNavigateWarranty, onNavigateBrands }) => {
  return (
    <footer className="bg-white border-t border-gray-200 mt-16 text-gray-600">
      {/* Advantages Banner */}
      <div className="border-b border-gray-100 bg-[#fafafa]">
        <div className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-purple-50 flex items-center justify-center text-purple-600 flex-shrink-0">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-gray-900">1 kunda yetkazib berish</h4>
              <p className="text-xs text-gray-500">O'zbekiston bo'ylab eng tezkor xizmat</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-purple-50 flex items-center justify-center text-purple-600 flex-shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-gray-900">Xavfsiz to'lov va kafolat</h4>
              <p className="text-xs text-gray-500">100% asl va kafolatlangan tovarlar</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-purple-50 flex items-center justify-center text-purple-600 flex-shrink-0">
              <RefreshCw className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-gray-900">Oson qaytarish</h4>
              <p className="text-xs text-gray-500">10 kun ichida tovarlarni qaytarish imkoni</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-purple-50 flex items-center justify-center text-purple-600 flex-shrink-0">
              <Headphones className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-gray-900">24/7 Qo'llab-quvvatlash</h4>
              <p className="text-xs text-gray-500">Har qanday savolga tezkor javoblar</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-2 md:grid-cols-4 gap-8 text-sm">
        <div>
          <h5 className="font-bold text-gray-900 mb-4">Biz haqimizda</h5>
          <ul className="space-y-2.5 text-xs text-gray-500">
            <li>
              <button onClick={onNavigatePVZ} className="hover:text-purple-600 transition text-left">
                Topshirish punktlari (PVZ)
              </button>
            </li>
            <li>
              <button onClick={onNavigateBrands} className="hover:text-purple-600 transition text-left">
                Rasmiy Brendlar
              </button>
            </li>
            <li><a href="#" className="hover:text-purple-600 transition">Vakansiyalar</a></li>
            <li><a href="#" className="hover:text-purple-600 transition">Kompaniya haqida</a></li>
          </ul>
        </div>

        <div>
          <h5 className="font-bold text-gray-900 mb-4">Foydalanuvchilarga</h5>
          <ul className="space-y-2.5 text-xs text-gray-500">
            <li><a href="#" className="hover:text-purple-600 transition">Biz bilan bog'lanish</a></li>
            <li>
              <button onClick={onNavigateFAQ} className="hover:text-purple-600 transition text-left">
                Savol-Javob (FAQ)
              </button>
            </li>
            <li>
              <button onClick={onNavigateWarranty} className="hover:text-purple-600 transition text-left">
                Kafolat va Qaytarish
              </button>
            </li>
            <li><a href="#" className="hover:text-purple-600 transition">Muddatli to'lov (Nasiya)</a></li>
          </ul>
        </div>

        <div>
          <h5 className="font-bold text-gray-900 mb-4">Tadbirkorlarga</h5>
          <ul className="space-y-2.5 text-xs text-gray-500">
            <li>
              <button onClick={onNavigateSeller} className="hover:text-purple-600 transition text-left font-semibold text-purple-700">
                Uzumda soting (Sotuvchi bo'lish)
              </button>
            </li>
            <li>
              <button onClick={onNavigatePVZ} className="hover:text-purple-600 transition text-left">
                Topshirish punkti ochish
              </button>
            </li>
          </ul>
        </div>

        <div>
          <h5 className="font-bold text-gray-900 mb-4">Ilovani yuklab oling</h5>
          <p className="text-xs text-gray-500 mb-3">Harid qilish yanada osonroq va qulayroq bo'lsin</p>
          <div className="flex flex-col gap-2">
            <div className="bg-gray-100 rounded-xl p-2.5 text-xs font-semibold text-center text-gray-800 cursor-pointer hover:bg-gray-200 transition">
              📱 App Store & Google Play
            </div>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="border-t border-gray-100 bg-gray-50 py-4 text-center text-xs text-gray-400">
        <p className="flex items-center justify-center gap-1">
          © 2026 Uzum Market klon loyihasi. Barcha huquqlar himoyalangan.
        </p>
      </div>
    </footer>
  );
};
