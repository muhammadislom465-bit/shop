import React, { useState } from 'react';
import { Calculator, X } from 'lucide-react';

const InstallmentCalculatorModal = ({ isOpen, onClose, price = 1200000 }) => {
  const [months, setMonths] = useState(12);
  
  if (!isOpen) return null;

  const calculateMonthly = (price, months) => {
    // Mock calculation for markup based on months
    const markupRate = months === 3 ? 0.05 : months === 6 ? 0.1 : months === 12 ? 0.2 : 0.35;
    const total = price * (1 + markupRate);
    return Math.round(total / months);
  };

  const monthlyPayment = calculateMonthly(price, months);
  
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl relative">
        <button onClick={onClose} className="absolute right-4 top-4 text-gray-400 hover:text-gray-600">
          <X size={24} />
        </button>
        
        <div className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-[#7000ff]/10 p-3 rounded-full text-[#7000ff]">
              <Calculator size={24} />
            </div>
            <h2 className="text-xl font-bold text-gray-800">Muddatli to'lov kalkulyatori</h2>
          </div>

          <div className="mb-6">
            <p className="text-sm text-gray-500 mb-1">Tovarning umumiy narxi</p>
            <p className="text-2xl font-bold text-gray-900">{price.toLocaleString('uz-UZ')} so'm</p>
          </div>

          <div className="mb-8">
            <p className="text-sm text-gray-500 mb-3">To'lov muddatini tanlang (oy)</p>
            <div className="grid grid-cols-4 gap-2">
              {[3, 6, 12, 24].map((m) => (
                <button
                  key={m}
                  onClick={() => setMonths(m)}
                  className={`py-2 px-3 rounded-lg border-2 text-sm font-semibold transition-all ${
                    months === m 
                      ? 'border-[#7000ff] bg-[#7000ff]/5 text-[#7000ff]' 
                      : 'border-gray-200 text-gray-600 hover:border-gray-300'
                  }`}
                >
                  {m} oy
                </button>
              ))}
            </div>
          </div>

          <div className="bg-gray-50 rounded-xl p-5 border border-gray-100">
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-600">Oylik to'lov:</span>
              <span className="text-xl font-bold text-[#7000ff]">
                {monthlyPayment.toLocaleString('uz-UZ')} so'm/oy
              </span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-500">Umumiy qaytarish:</span>
              <span className="font-semibold text-gray-700">
                {(monthlyPayment * months).toLocaleString('uz-UZ')} so'm
              </span>
            </div>
          </div>
          
          <button className="w-full mt-6 bg-[#7000ff] hover:bg-[#5c00d2] text-white py-3 rounded-xl font-semibold transition-colors">
            Muddatli to'lovga rasmiylashtirish
          </button>
        </div>
      </div>
    </div>
  );
};

export default InstallmentCalculatorModal;
