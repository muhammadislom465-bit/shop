import React from 'react';
import { useCompare } from '../context/CompareContext';
import { Trash2, ShoppingCart, CheckCircle } from 'lucide-react';
const ComparePage = ({ onContinueShopping }) => {
  const { compareItems, removeFromCompare, clearCompare } = useCompare();

  if (compareItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center max-w-lg">
        <div className="bg-gray-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle size={40} className="text-gray-400" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Taqqoslash ro'yxati bo'sh</h2>
        <p className="text-gray-500 mb-8">Siz hali birorta ham mahsulotni taqqoslash uchun qo'shmadingiz.</p>
        <button 
          onClick={onContinueShopping} 
          className="bg-[#7000ff] text-white px-8 py-3 rounded-xl font-semibold hover:bg-[#5c00d2] transition-colors"
        >
          Bosh sahifaga qaytish
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 overflow-x-auto">
      <div className="flex justify-between items-center mb-6 min-w-[800px]">
        <h1 className="text-3xl font-bold text-gray-800">Taqqoslash ({compareItems.length}/4)</h1>
        <button 
          onClick={clearCompare}
          className="text-red-500 hover:text-red-700 font-medium flex items-center gap-2"
        >
          <Trash2 size={18} /> Ro'yxatni tozalash
        </button>
      </div>

      <div className="flex min-w-[800px] border rounded-xl overflow-hidden bg-white shadow-sm">
        {/* Characteristics Column */}
        <div className="w-1/5 bg-gray-50 border-r p-4 shrink-0 flex flex-col justify-end">
          <div className="space-y-6 font-medium text-gray-600 text-sm">
            <div className="h-10 border-b flex items-center">Narx</div>
            <div className="h-10 border-b flex items-center">Kategoriya</div>
            <div className="h-10 border-b flex items-center">Reyting</div>
            <div className="h-10 border-b flex items-center">Omborda</div>
          </div>
        </div>

        {/* Product Columns */}
        {compareItems.map(item => (
          <div key={item.id} className="flex-1 border-r last:border-r-0 p-4 shrink-0 relative group min-w-[200px]">
            <button 
              onClick={() => removeFromCompare(item.id)}
              className="absolute top-2 right-2 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity bg-white rounded-full p-1 shadow-sm"
            >
              <Trash2 size={16} />
            </button>
            
            <div className="mb-4 h-[200px] flex flex-col items-center">
              <img src={item.image || 'https://via.placeholder.com/150'} alt={item.name} className="h-32 object-contain mb-3" />
              <h3 className="font-semibold text-gray-800 text-sm text-center line-clamp-2">{item.name}</h3>
            </div>

            <button className="w-full bg-[#7000ff]/10 text-[#7000ff] hover:bg-[#7000ff] hover:text-white py-2 rounded-lg text-sm font-semibold transition-colors flex items-center justify-center gap-2 mb-6">
              <ShoppingCart size={16} /> Savatga
            </button>

            <div className="space-y-6 text-sm">
              <div className="h-10 border-b flex items-center font-bold text-gray-900">
                {item.price?.toLocaleString('uz-UZ') || '0'} so'm
              </div>
              <div className="h-10 border-b flex items-center text-gray-600">
                {item.category || 'Noma\'lum'}
              </div>
              <div className="h-10 border-b flex items-center text-yellow-500 font-medium">
                ★ {item.rating || '0.0'}
              </div>
              <div className="h-10 border-b flex items-center text-green-600">
                {item.stock > 0 ? 'Mavjud' : 'Tugagan'}
              </div>
            </div>
          </div>
        ))}
        
        {/* Empty slots placeholders if < 4 */}
        {Array.from({ length: 4 - compareItems.length }).map((_, idx) => (
          <div key={`empty-${idx}`} className="flex-1 border-r last:border-r-0 p-4 bg-gray-50/50 flex items-center justify-center min-w-[200px]">
            <p className="text-gray-400 text-sm text-center">Mahsulot qo'shing</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ComparePage;
