import React, { useState } from 'react';
import { Heart, ArrowLeft, ShoppingBag } from 'lucide-react';
import { useWishlist } from '../context/WishlistContext';
import { ProductCard } from '../components/ProductCard';
import { ProductDetailModal } from '../components/ProductDetailModal';

export const WishlistPage = ({ onContinueShopping }) => {
  const { wishlist } = useWishlist();
  const [selectedProduct, setSelectedProduct] = useState(null);

  if (wishlist.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <div className="bg-white rounded-3xl p-8 sm:p-12 shadow-sm border border-gray-100 space-y-4">
          <div className="w-20 h-20 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto">
            <Heart className="w-10 h-10 stroke-1" />
          </div>
          <h2 className="text-2xl font-black text-gray-900">Sevimlilar ro'yxati bo'sh</h2>
          <p className="text-xs text-gray-500 max-w-sm mx-auto">
            O'zingizga yoqqan mahsulotlarning yurakcha belgisini bosib, keyinroq xarid qilish uchun saqlab qo'ying.
          </p>
          <button
            onClick={onContinueShopping}
            className="mt-4 inline-flex items-center gap-2 py-3 px-6 bg-[#7000ff] hover:bg-[#6000e6] text-white font-bold rounded-xl text-sm shadow-lg shadow-purple-600/25 transition"
          >
            <ArrowLeft className="w-4 h-4" />
            Mahsulotlarni ko'rish
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
      <div className="flex items-center gap-3">
        <button
          onClick={onContinueShopping}
          className="p-2 bg-white rounded-xl border border-gray-200 hover:bg-gray-50 text-gray-700 transition"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-2xl font-black text-gray-900 flex items-center gap-2">
          Sevimlilar <span className="text-sm font-normal text-gray-500">({wishlist.length} ta mahsulot)</span>
        </h1>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
        {wishlist.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onProductClick={(p) => setSelectedProduct(p)}
          />
        ))}
      </div>

      {selectedProduct && (
        <ProductDetailModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}
    </div>
  );
};
