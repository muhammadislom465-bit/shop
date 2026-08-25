import React, { useState } from 'react';
import { Trash2, Plus, Minus, ArrowLeft, ShoppingBag, ShieldCheck, Truck, CheckCircle2 } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { ordersApi } from '../services/api';
import { CouponInput } from '../components/CouponInput';
import confetti from 'canvas-confetti';

export const CartPage = ({ onContinueShopping, onOrderSuccess }) => {
  const { cartItems, updateQuantity, removeFromCart, clearCart, cartTotal, cartSavings } = useCart();
  const { user, openLogin } = useAuth();

  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [formData, setFormData] = useState({
    customer_name: user ? user.username : '',
    customer_phone: '+998 ',
    shipping_address: '',
    payment_method: 'cash', // 'cash', 'card', 'installment'
  });

  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [orderCreated, setOrderCreated] = useState(null);

  const discountAmount = appliedCoupon ? appliedCoupon.discount_amount : 0;
  const finalTotal = Math.max(0, cartTotal - discountAmount);


  const formatPrice = (amount) => {
    return new Intl.NumberFormat('uz-UZ').format(amount) + " so'm";
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCheckout = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!formData.customer_name || !formData.customer_phone || !formData.shipping_address) {
      setErrorMessage("Iltimos, barcha yetkazib berish ma'lumotlarini to'ldiring.");
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        customer_name: formData.customer_name,
        customer_phone: formData.customer_phone,
        shipping_address: formData.shipping_address,
        payment_method: formData.payment_method,
        items: cartItems.map((item) => ({
          product_id: item.product_id,
          title: item.title,
          price: item.price,
          quantity: item.quantity,
          image_url: item.image_url,
        })),
      };

      const res = await ordersApi.create(payload);
      setOrderCreated(res.data);
      clearCart();

      // Trigger confetti celebration
      confetti({
        particleCount: 120,
        spread: 70,
        origin: { y: 0.6 },
      });
    } catch (err) {
      console.error('Order error:', err);
      setErrorMessage(err.response?.data?.detail || "Buyurtmani rasmiylashtirishda xatolik yuz berdi.");
    } finally {
      setSubmitting(false);
    }
  };

  // Success Screen
  if (orderCreated) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <div className="bg-white rounded-3xl p-8 sm:p-12 shadow-xl border border-gray-100 space-y-6">
          <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div>
            <span className="text-xs font-bold text-green-600 uppercase tracking-wider bg-green-50 px-3 py-1 rounded-full">
              Muvaffaqiyatli qabul qilindi
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-gray-900 mt-3">
              Buyurtmangiz uchun tashakkur!
            </h2>
            <p className="text-sm text-gray-500 mt-2">
              Buyurtma raqami: <span className="font-bold text-purple-700">#{orderCreated.id}</span>
            </p>
          </div>

          <div className="bg-gray-50 rounded-2xl p-4 text-xs text-gray-600 space-y-1.5 text-left border border-gray-100">
            <div className="flex justify-between">
              <span>Qabul qiluvchi:</span>
              <span className="font-semibold text-gray-900">{orderCreated.customer_name}</span>
            </div>
            <div className="flex justify-between">
              <span>Telefon:</span>
              <span className="font-semibold text-gray-900">{orderCreated.customer_phone}</span>
            </div>
            <div className="flex justify-between">
              <span>Yetkazish manzili:</span>
              <span className="font-semibold text-gray-900">{orderCreated.shipping_address}</span>
            </div>
            <div className="flex justify-between">
              <span>To'lov usuli:</span>
              <span className="font-semibold text-gray-900 capitalize">{orderCreated.payment_method}</span>
            </div>
            <div className="flex justify-between border-t border-gray-200 pt-1.5 text-sm font-bold text-gray-900">
              <span>Jami to'lov:</span>
              <span className="text-purple-700">{formatPrice(orderCreated.total_amount)}</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button
              onClick={onContinueShopping}
              className="flex-1 py-3 px-6 bg-purple-50 hover:bg-purple-100 text-purple-700 font-bold rounded-xl text-sm transition"
            >
              Xaridni davom ettirish
            </button>
            <button
              onClick={onOrderSuccess}
              className="flex-1 py-3 px-6 bg-[#7000ff] hover:bg-[#6000e6] text-white font-bold rounded-xl text-sm shadow-lg shadow-purple-600/25 transition"
            >
              Buyurtmalarim bo'limiga o'tish
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Empty Cart State
  if (cartItems.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <div className="bg-white rounded-3xl p-8 sm:p-12 shadow-sm border border-gray-100 space-y-4">
          <div className="w-20 h-20 bg-purple-50 text-purple-600 rounded-full flex items-center justify-center mx-auto">
            <ShoppingBag className="w-10 h-10 stroke-1" />
          </div>
          <h2 className="text-2xl font-black text-gray-900">Savatda hozircha hech narsa yo'q</h2>
          <p className="text-xs text-gray-500 max-w-sm mx-auto">
            Bosh sahifadagi to'plamlar yoki qidiruvdan foydalanib o'zingizga ma'qul mahsulotlarni toping.
          </p>
          <button
            onClick={onContinueShopping}
            className="mt-4 inline-flex items-center gap-2 py-3 px-6 bg-[#7000ff] hover:bg-[#6000e6] text-white font-bold rounded-xl text-sm shadow-lg shadow-purple-600/25 transition"
          >
            <ArrowLeft className="w-4 h-4" />
            Bosh sahifaga qaytish
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={onContinueShopping}
          className="p-2 bg-white rounded-xl border border-gray-200 hover:bg-gray-50 text-gray-700 transition"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-2xl font-black text-gray-900">
          Savat <span className="text-sm font-normal text-gray-500">({cartItems.length} xil mahsulot)</span>
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Cart Items List */}
        <div className="lg:col-span-2 space-y-3">
          <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm flex justify-between items-center text-xs">
            <span className="text-gray-500">
              Yetkazib berish: <strong className="text-green-600">1 kunda bepul</strong>
            </span>
            <button
              onClick={clearCart}
              className="text-red-500 hover:text-red-700 font-semibold"
            >
              Savatni tozalash
            </button>
          </div>

          {cartItems.map((item) => (
            <div
              key={item.product_id}
              className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm flex items-center justify-between gap-4"
            >
              {/* Product Thumbnail */}
              <div className="w-20 h-20 bg-gray-50 rounded-xl overflow-hidden flex-shrink-0 flex items-center justify-center p-1 border border-gray-100">
                <img
                  src={item.image_url}
                  alt={item.title}
                  className="w-full h-full object-contain"
                />
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <h4 className="text-xs sm:text-sm font-semibold text-gray-900 line-clamp-2">
                  {item.title}
                </h4>
                <div className="mt-1 flex items-baseline gap-2">
                  <span className="text-sm font-black text-gray-900">
                    {formatPrice(item.price)}
                  </span>
                  {item.discount_price && (
                    <span className="text-xs text-gray-400 line-through">
                      {formatPrice(item.original_price)}
                    </span>
                  )}
                </div>
              </div>

              {/* Quantity Controls */}
              <div className="flex items-center gap-1 sm:gap-2">
                <div className="flex items-center border border-gray-200 rounded-xl bg-gray-50">
                  <button
                    onClick={() => updateQuantity(item.product_id, item.quantity - 1)}
                    className="p-1.5 text-gray-600 hover:text-gray-900"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="px-2 text-xs font-bold text-gray-800">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => updateQuantity(item.product_id, item.quantity + 1)}
                    className="p-1.5 text-gray-600 hover:text-gray-900"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Remove Button */}
                <button
                  onClick={() => removeFromCart(item.product_id)}
                  className="p-2 text-gray-400 hover:text-red-500 rounded-xl hover:bg-red-50 transition"
                  title="O'chirish"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Right: Checkout Summary Form */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-xl sticky top-24 space-y-4">
            <h3 className="text-lg font-black text-gray-900 border-b border-gray-100 pb-3">
              Buyurtmani rasmiylashtirish
            </h3>

            {/* Error notice */}
            {errorMessage && (
              <div className="p-3 bg-red-50 text-red-700 text-xs rounded-xl border border-red-100">
                {errorMessage}
              </div>
            )}

            <form onSubmit={handleCheckout} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Ismingiz va Familiyangiz *
                </label>
                <input
                  type="text"
                  name="customer_name"
                  value={formData.customer_name}
                  onChange={handleInputChange}
                  placeholder="Masalan: Sardor Rustamov"
                  required
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs sm:text-sm focus:bg-white focus:border-purple-600 focus:outline-none transition"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Telefon raqamingiz *
                </label>
                <input
                  type="text"
                  name="customer_phone"
                  value={formData.customer_phone}
                  onChange={handleInputChange}
                  placeholder="+998 90 123 45 67"
                  required
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs sm:text-sm focus:bg-white focus:border-purple-600 focus:outline-none transition"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Yetkazib berish manzili *
                </label>
                <textarea
                  name="shipping_address"
                  value={formData.shipping_address}
                  onChange={handleInputChange}
                  placeholder="Shahar, tuman, ko'cha, uy raqami yoki mo'ljal"
                  rows={2}
                  required
                  className="w-full px-3.5 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs sm:text-sm focus:bg-white focus:border-purple-600 focus:outline-none transition resize-none"
                />
              </div>

              {/* Payment Method */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  To'lov usuli
                </label>
                <div className="grid grid-cols-3 gap-2 text-center text-xs">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, payment_method: 'cash' })}
                    className={`py-2 px-1 rounded-xl border font-bold transition ${
                      formData.payment_method === 'cash'
                        ? 'border-purple-600 bg-purple-50 text-purple-700'
                        : 'border-gray-200 bg-gray-50 text-gray-700'
                    }`}
                  >
                    💵 Naqd pul
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, payment_method: 'card' })}
                    className={`py-2 px-1 rounded-xl border font-bold transition ${
                      formData.payment_method === 'card'
                        ? 'border-purple-600 bg-purple-50 text-purple-700'
                        : 'border-gray-200 bg-gray-50 text-gray-700'
                    }`}
                  >
                    💳 Uzcard/Humo
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, payment_method: 'installment' })}
                    className={`py-2 px-1 rounded-xl border font-bold transition ${
                      formData.payment_method === 'installment'
                        ? 'border-purple-600 bg-purple-50 text-purple-700'
                        : 'border-gray-200 bg-gray-50 text-gray-700'
                    }`}
                  >
                    ⚡ Nasiya
                  </button>
                </div>
              </div>

              {/* Promo code component */}
              <CouponInput
                orderTotal={cartTotal}
                appliedCoupon={appliedCoupon}
                onApplyCoupon={(c) => setAppliedCoupon(c)}
                onRemoveCoupon={() => setAppliedCoupon(null)}
              />

              {/* Price Calculation */}
              <div className="border-t border-gray-100 pt-3 space-y-1.5 text-xs text-gray-600">
                <div className="flex justify-between">
                  <span>Mahsulotlar narxi:</span>
                  <span>{formatPrice(cartTotal + cartSavings)}</span>
                </div>
                {cartSavings > 0 && (
                  <div className="flex justify-between text-red-500 font-medium">
                    <span>Sizning tejamkorligingiz:</span>
                    <span>-{formatPrice(cartSavings)}</span>
                  </div>
                )}
                {discountAmount > 0 && (
                  <div className="flex justify-between text-green-600 font-bold">
                    <span>Promo kod chegirmasi ({appliedCoupon?.code}):</span>
                    <span>-{formatPrice(discountAmount)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Yetkazib berish:</span>
                  <span className="text-green-600 font-bold">Bepul (1 kun)</span>
                </div>
                <div className="flex justify-between text-base font-black text-gray-900 border-t border-gray-100 pt-2">
                  <span>Jami to'lov:</span>
                  <span className="text-[#7000ff]">{formatPrice(finalTotal)}</span>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3.5 bg-[#7000ff] hover:bg-[#6000e6] text-white font-bold rounded-xl text-sm shadow-xl shadow-purple-600/30 transition flex items-center justify-center gap-2 mt-2 disabled:opacity-60"
              >
                {submitting ? (
                  <span className="inline-block animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4" />
                    <span>Buyurtmani tasdiqlash</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
