import React, { useState } from 'react';
import { X, Star, Heart, ShoppingBag, Truck, ShieldCheck, RefreshCw, Check, Share2 } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { ReviewSection } from './ReviewSection';

export const ProductDetailModal = ({ product, onClose }) => {
  if (!product) return null;

  const { addToCart, cartItems } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const [quantity, setQuantity] = useState(1);
  const [addedNotice, setAddedNotice] = useState(false);

  const isLiked = isInWishlist(product.id);
  const inCart = cartItems.some((item) => item.product_id === product.id);

  const formatPrice = (amount) => {
    if (!amount) return '0';
    return new Intl.NumberFormat('uz-UZ').format(amount) + " so'm";
  };

  const currentPrice = product.discount_price || product.price;
  const discountPercent = product.discount_price && product.price > product.discount_price
    ? Math.round(((product.price - product.discount_price) / product.price) * 100)
    : null;

  const handleAdd = () => {
    addToCart(product, quantity);
    setAddedNotice(true);
    setTimeout(() => setAddedNotice(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div 
        className="bg-white w-full max-w-4xl rounded-3xl shadow-2xl overflow-hidden relative flex flex-col md:flex-row my-auto max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 flex items-center justify-center transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Left Side: Product Image */}
        <div className="w-full md:w-1/2 bg-gray-50 flex items-center justify-center p-6 sm:p-8 relative min-h-[300px]">
          <img
            src={product.image_url}
            alt={product.title}
            className="max-h-80 w-auto object-contain transition-transform hover:scale-105 duration-300"
          />
          {discountPercent && (
            <span className="absolute top-4 left-4 bg-[#ff0055] text-white text-xs font-black px-2.5 py-1 rounded-md shadow">
              -{discountPercent}% chegirma
            </span>
          )}
        </div>

        {/* Right Side: Product Information & Purchase */}
        <div className="w-full md:w-1/2 p-6 sm:p-8 flex flex-col justify-between overflow-y-auto max-h-[90vh]">
          <div>
            {/* Rating & Stock */}
            <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                <span className="font-bold text-gray-800">{product.rating || 4.8}</span>
                <span>({product.reviews_count || 0} sharh)</span>
              </div>
              <span className="text-green-600 font-semibold bg-green-50 px-2 py-0.5 rounded">
                Omborda: {product.stock} dona mavjud
              </span>
            </div>

            {/* Title */}
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 leading-snug">
              {product.title}
            </h2>

            {/* Description */}
            <p className="text-sm text-gray-600 mt-3 leading-relaxed">
              {product.description || "Yuqori sifatli mahsulot. Uzum Market kafolati bilan 1 kunda tezkor yetkazib beriladi."}
            </p>

            {/* Installment Badge */}
            {product.installment_price && (
              <div className="mt-4 p-3 bg-amber-50 rounded-2xl border border-amber-200/70 flex items-center justify-between">
                <div>
                  <span className="text-xs text-amber-800 font-medium block">Muddatli to'lov:</span>
                  <span className="text-sm font-extrabold text-gray-900">
                    {formatPrice(product.installment_price)} / oyiga
                  </span>
                </div>
                <span className="bg-[#ffbe00] text-gray-950 font-bold text-xs px-2.5 py-1 rounded-lg">
                  0-0-12 Nasiya
                </span>
              </div>
            )}

            {/* Price section */}
            <div className="mt-5">
              <span className="text-xs text-gray-400 block">Narxi:</span>
              <div className="flex items-baseline gap-3">
                <span className="text-2xl sm:text-3xl font-black text-gray-900">
                  {formatPrice(currentPrice)}
                </span>
                {product.discount_price && (
                  <span className="text-sm text-gray-400 line-through">
                    {formatPrice(product.price)}
                  </span>
                )}
              </div>
            </div>

            {/* Delivery & Assurance */}
            <div className="mt-6 space-y-2 border-t border-gray-100 pt-4 text-xs text-gray-600">
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-purple-600" />
                <span>1 kunda bepul yetkazib berish (Toshkent va viloyatlarga)</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-purple-600" />
                <span>100% asl mahsulot va kafolat</span>
              </div>
              <div className="flex items-center gap-2">
                <RefreshCw className="w-4 h-4 text-purple-600" />
                <span>10 kun ichida qulay qaytarish</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-6 pt-4 border-t border-gray-100">
              <div className="flex items-center gap-3">
                {/* Quantity selector */}
                <div className="flex items-center border border-gray-200 rounded-xl bg-gray-50">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-2 text-gray-600 hover:text-gray-900 font-bold"
                  >
                    -
                  </button>
                  <span className="px-2 text-sm font-bold text-gray-800">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-3 py-2 text-gray-600 hover:text-gray-900 font-bold"
                  >
                    +
                  </button>
                </div>

                {/* Add to Cart Button */}
                <button
                  onClick={handleAdd}
                  className="flex-1 py-3 px-4 bg-[#7000ff] hover:bg-[#6000e6] text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition shadow-lg shadow-purple-600/25"
                >
                  {addedNotice ? (
                    <>
                      <Check className="w-5 h-5" /> Qo'shildi!
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-5 h-5" /> Savatga qo'shish
                    </>
                  )}
                </button>

                {/* Wishlist Button */}
                <button
                  onClick={() => toggleWishlist(product)}
                  className={`p-3 rounded-xl border transition ${
                    isLiked ? 'bg-red-50 border-red-200 text-red-500' : 'bg-gray-50 border-gray-200 text-gray-600 hover:text-red-500'
                  }`}
                >
                  <Heart className={`w-5 h-5 ${isLiked ? 'fill-red-500 text-red-500' : ''}`} />
                </button>
              </div>
            </div>

            {/* Reviews Section Component */}
            <ReviewSection productId={product.id} />
          </div>
        </div>
      </div>
    </div>
  );
};

