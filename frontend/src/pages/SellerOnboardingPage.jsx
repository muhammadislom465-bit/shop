import React, { useState } from 'react';
import { Store, TrendingUp, Calculator, ShieldCheck, ArrowRight } from 'lucide-react';

const SellerOnboardingPage = () => {
  const [cost, setCost] = useState(100000);
  const commission = 0.05; // 5% base commission

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-[#7000ff] text-white pt-16 pb-24 px-4 text-center">
        <div className="container mx-auto max-w-4xl">
          <Store size={64} className="mx-auto mb-6 opacity-90" />
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Uzum Marketda o'z biznesingizni boshlang</h1>
          <p className="text-xl opacity-90 mb-10 max-w-2xl mx-auto">
            O'zbekistondagi eng yirik marketpleysda millionlab xaridorlarga o'z mahsulotlaringizni soting. Ro'yxatdan o'tish mutlaqo bepul.
          </p>
          <button className="bg-yellow-400 text-gray-900 hover:bg-yellow-300 px-8 py-4 rounded-xl font-bold text-lg transition-colors flex items-center justify-center gap-2 mx-auto">
            Sotuvchi bo'lish <ArrowRight size={20} />
          </button>
        </div>
      </div>

      <div className="container mx-auto px-4 -mt-12 relative z-10 pb-16">
        <div className="grid md:grid-cols-3 gap-6 mb-16">
          <div className="bg-white rounded-2xl p-6 shadow-xl shadow-gray-200/50 flex flex-col items-center text-center">
            <div className="bg-blue-100 p-4 rounded-full text-blue-600 mb-4">
              <TrendingUp size={32} />
            </div>
            <h3 className="text-xl font-bold mb-2">Katta auditoriya</h3>
            <p className="text-gray-600">Oyiga 10 milliondan ortiq faol foydalanuvchilar sizning mahsulotingizni ko'radi.</p>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-xl shadow-gray-200/50 flex flex-col items-center text-center">
            <div className="bg-purple-100 p-4 rounded-full text-[#7000ff] mb-4">
              <ShieldCheck size={32} />
            </div>
            <h3 className="text-xl font-bold mb-2">Logistika va ombor</h3>
            <p className="text-gray-600">Yetkazib berish, saqlash va to'lovlarni qabul qilishni o'z zimmamizga olamiz.</p>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-xl shadow-gray-200/50 flex flex-col items-center text-center">
            <div className="bg-green-100 p-4 rounded-full text-green-600 mb-4">
              <Calculator size={32} />
            </div>
            <h3 className="text-xl font-bold mb-2">Foydali komissiya</h3>
            <p className="text-gray-600">Sotilgan mahsulotlardan atigi 5% dan boshlanuvchi adolatli komissiya tizimi.</p>
          </div>
        </div>

        {/* Calculator Section */}
        <div className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-gray-100 max-w-4xl mx-auto mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">Foydani hisoblang</h2>
          
          <div className="flex flex-col md:flex-row gap-8 items-center">
            <div className="flex-1 w-full">
              <label className="block text-sm font-medium text-gray-700 mb-2">Mahsulot narxi (so'm)</label>
              <input 
                type="range" 
                min="10000" 
                max="10000000" 
                step="10000"
                value={cost} 
                onChange={(e) => setCost(Number(e.target.value))}
                className="w-full accent-[#7000ff] mb-4"
              />
              <div className="text-2xl font-bold text-[#7000ff]">{cost.toLocaleString('uz-UZ')} so'm</div>
            </div>

            <div className="flex-1 bg-gray-50 rounded-2xl p-6 w-full">
              <div className="flex justify-between mb-3 text-sm">
                <span className="text-gray-500">Uzum komissiyasi (5%):</span>
                <span className="font-medium text-red-500">- {(cost * commission).toLocaleString('uz-UZ')} so'm</span>
              </div>
              <div className="flex justify-between mb-3 text-sm">
                <span className="text-gray-500">Logistika va xizmatlar:</span>
                <span className="font-medium text-red-500">- 5 000 so'm</span>
              </div>
              <div className="h-px bg-gray-200 my-4"></div>
              <div className="flex justify-between items-center">
                <span className="font-semibold text-gray-700">Sof foydangiz:</span>
                <span className="text-2xl font-bold text-green-600">
                  {Math.max(0, cost - (cost * commission) - 5000).toLocaleString('uz-UZ')} so'm
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SellerOnboardingPage;
