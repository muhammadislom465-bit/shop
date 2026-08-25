import React, { useState } from 'react';
import { FileText, Search, AlertCircle, Upload, CheckCircle } from 'lucide-react';

const WarrantyPage = () => {
  const [step, setStep] = useState(1);
  const [orderId, setOrderId] = useState('');
  const [reason, setReason] = useState('');

  const submitClaim = (e) => {
    e.preventDefault();
    setStep(3);
  };

  return (
    <div className="container mx-auto px-4 py-10 max-w-3xl">
      <h1 className="text-3xl font-bold mb-2">Kafolat va qaytarish</h1>
      <p className="text-gray-600 mb-8">Nuqsonli mahsulotlarni qaytarish yoki kafolatli xizmat ko'rsatish uchun ariza qoldiring.</p>

      <div className="flex mb-10 border-b">
        <div className={`pb-4 px-4 font-medium text-sm flex-1 text-center ${step >= 1 ? 'border-b-2 border-[#7000ff] text-[#7000ff]' : 'text-gray-400'}`}>1. Buyurtmani topish</div>
        <div className={`pb-4 px-4 font-medium text-sm flex-1 text-center ${step >= 2 ? 'border-b-2 border-[#7000ff] text-[#7000ff]' : 'text-gray-400'}`}>2. Muammoni tasvirlash</div>
        <div className={`pb-4 px-4 font-medium text-sm flex-1 text-center ${step >= 3 ? 'border-b-2 border-[#7000ff] text-[#7000ff]' : 'text-gray-400'}`}>3. Tasdiqlash</div>
      </div>

      {step === 1 && (
        <div className="bg-white p-6 rounded-xl border shadow-sm">
          <label className="block font-medium mb-2 text-gray-700">Buyurtma raqamini kiriting</label>
          <div className="flex gap-2 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input 
                type="text" 
                placeholder="Masalan: UZ-12345678"
                value={orderId}
                onChange={(e) => setOrderId(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:border-[#7000ff]"
              />
            </div>
            <button 
              onClick={() => orderId && setStep(2)}
              className="bg-[#7000ff] text-white px-6 py-3 rounded-lg font-medium hover:bg-[#5c00d2]"
            >
              Topish
            </button>
          </div>
          <div className="bg-blue-50 text-blue-800 p-4 rounded-lg flex items-start gap-3 text-sm">
            <AlertCircle size={20} className="shrink-0 mt-0.5" />
            <p>Siz o'z buyurtma raqamingizni "Mening buyurtmalarim" bo'limidan yoki elektron pochtangizga kelgan xatdan topishingiz mumkin.</p>
          </div>
        </div>
      )}

      {step === 2 && (
        <form onSubmit={submitClaim} className="bg-white p-6 rounded-xl border shadow-sm">
          <div className="mb-6">
            <label className="block font-medium mb-2 text-gray-700">Qaytarish sababi</label>
            <select 
              required
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full p-3 border rounded-lg focus:outline-none focus:border-[#7000ff]"
            >
              <option value="">Tanlang...</option>
              <option value="defective">Zavod nuqsoni / ishlamayapti</option>
              <option value="wrong_item">Boshqa mahsulot keldi</option>
              <option value="damaged">Tashish paytida shikastlangan</option>
              <option value="not_liked">Yoqmadi / Mos kelmadi (faqat kiyim-kechak uchun)</option>
            </select>
          </div>

          <div className="mb-6">
            <label className="block font-medium mb-2 text-gray-700">Batafsil izoh</label>
            <textarea 
              required
              rows="4"
              placeholder="Muammoni batafsil tasvirlab bering..."
              className="w-full p-3 border rounded-lg focus:outline-none focus:border-[#7000ff] resize-none"
            ></textarea>
          </div>

          <div className="mb-8">
            <label className="block font-medium mb-2 text-gray-700">Rasm yoki video yuklash (ixtiyoriy)</label>
            <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:bg-gray-50 transition-colors cursor-pointer flex flex-col items-center">
              <Upload size={32} className="text-gray-400 mb-2" />
              <p className="text-sm text-gray-600 font-medium">Fayllarni bu yerga tashlang yoki tanlang</p>
              <p className="text-xs text-gray-400 mt-1">JPG, PNG, MP4 (Max 10MB)</p>
            </div>
          </div>

          <div className="flex gap-3 justify-end">
            <button type="button" onClick={() => setStep(1)} className="px-6 py-3 border rounded-lg font-medium hover:bg-gray-50 text-gray-700">
              Ortga
            </button>
            <button type="submit" className="px-6 py-3 bg-[#7000ff] text-white rounded-lg font-medium hover:bg-[#5c00d2]">
              Arizani yuborish
            </button>
          </div>
        </form>
      )}

      {step === 3 && (
        <div className="bg-white p-10 rounded-xl border shadow-sm text-center">
          <div className="w-20 h-20 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle size={40} />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Ariza qabul qilindi!</h2>
          <p className="text-gray-600 mb-6 max-w-md mx-auto">
            Sizning arizangiz muvaffaqiyatli qabul qilindi. Mutaxassislarimiz tez orada siz bilan bog'lanishadi. Ariza raqami: <span className="font-mono font-bold text-black">RET-98234</span>
          </p>
          <button onClick={() => window.location.href = '/'} className="px-8 py-3 bg-gray-100 text-gray-800 rounded-lg font-medium hover:bg-gray-200">
            Bosh sahifaga qaytish
          </button>
        </div>
      )}
    </div>
  );
};

export default WarrantyPage;
