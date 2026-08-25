import React from 'react';
import { Star, Heart, ShoppingBag, Check } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';

export const ProductCard = ({ product, onProductClick }) => {
  const { addToCart, cartItems } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  const isLiked = isInWishlist(product.id);
  const inCart = cartItems.some((item) => item.product_id === product.id);

  const formatPrice = (amount) => {
    if (!amount) return '0';
    return new Intl.NumberFormat('uz-UZ').format(amount) + " so'm";
  };

  const discountPercent = product.discount_price && product.price > product.discount_price
    ? Math.round(((product.price - product.discount_price) / product.price) * 100)
    : null;

  const currentPrice = product.discount_price || product.price;

  const handleAddToCart = (e) => {
    e.stopPropagation();
    addToCart(product, 1);
  };

  const handleLike = (e) => {
    e.stopPropagation();
    toggleWishlist(product);
  };

  return (
    <div 
      onClick={() => onProductClick(product)}
      className="bg-white rounded-2xl border border-gray-100/90 hover:border-purple-200 overflow-hidden flex flex-col justify-between transition-all duration-200 hover:shadow-lg group cursor-pointer relative"
    >
      {/* Image & Badges */}
      <div className="relative pt-[100%] bg-gray-50 overflow-hidden">
        <img
          src={product.image_url}
          alt={product.title}
          className="absolute inset-0 w-full h-full object-contain p-3 group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />

        {/* Discount Badge */}
        {discountPercent && (
          <span className="absolute bottom-2 left-2 bg-[#ff0055] text-white text-[11px] font-black px-2 py-0.5 rounded-md shadow-sm">
            -{discountPercent}%
          </span>
        )}

        {/* Wishlist Button */}
        <button
          onClick={handleLike}
          className="absolute top-2 right-2 w-8 h-8 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white flex items-center justify-center text-gray-400 hover:text-red-500 transition shadow-sm"
          title={isLiked ? "Sevimlilardan o'chirish" : "Sevimlilarga qo'shish"}
        >
          <Heart className={`w-4 h-4 ${isLiked ? 'text-red-500 fill-red-500' : 'stroke-current'}`} />
        </button>
      </div>

      {/* Content */}
      <div className="p-3.5 flex flex-col flex-1 justify-between gap-2">
        <div>
          {/* Title */}
          <h3 className="text-xs sm:text-sm font-medium text-gray-800 line-clamp-2 leading-snug group-hover:text-purple-600 transition">
            {product.title}
          </h3>

          {/* Rating */}
          <div className="flex items-center gap-1 mt-1.5 text-[11px] text-gray-500">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            <span className="font-semibold text-gray-700">{product.rating || 4.8}</span>
            <span>({product.reviews_count || 0} sharh)</span>
          </div>
        </div>

        <div>
          {/* Monthly Installment Badge (Uzum style) */}
          {product.installment_price && (
            <div className="mb-2">
              <span className="inline-block bg-[#ffbe00] text-gray-950 text-[10px] sm:text-[11px] font-bold px-2 py-0.5 rounded-md">
                {formatPrice(product.installment_price)} / oy
              </span>
            </div>
          )}

          {/* Pricing & Add to Cart */}
          <div className="flex items-end justify-between gap-1 pt-1">
            <div className="flex flex-col">
              {product.discount_price && (
                <span className="text-[11px] text-gray-400 line-through leading-tight">
                  {formatPrice(product.price)}
                </span>
              )}
              <span className="text-sm sm:text-base font-extrabold text-gray-900 leading-tight">
                {formatPrice(currentPrice)}
              </span>
            </div>

            {/* Cart Button */}
            <button
              onClick={handleAddToCart}
              className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all ${
                inCart
                  ? 'bg-green-600 text-white shadow-md shadow-green-600/20'
                  : 'bg-purple-50 hover:bg-[#7000ff] text-[#7000ff] hover:text-white border border-purple-200/60'
              }`}
              title={inCart ? "Savatda mavjud" : "Savatga qo'shish"}
            >
              {inCart ? <Check className="w-4 h-4" /> : <ShoppingBag className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
