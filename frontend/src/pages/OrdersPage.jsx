import React, { useState, useEffect } from 'react';
import { Package, Calendar, Clock, CheckCircle, XCircle, ArrowLeft, ArrowRight } from 'lucide-react';
import { ordersApi } from '../services/api';
import { useAuth } from '../context/AuthContext';

export const OrdersPage = ({ onContinueShopping }) => {
  const { user, openLogin } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchMyOrders();
    } else {
      setLoading(false);
    }
  }, [user]);

  const fetchMyOrders = async () => {
    setLoading(true);
    try {
      const res = await ordersApi.getMyOrders();
      setOrders(res.data);
    } catch (err) {
      console.error("Buyurtmalarni yuklashda xatolik:", err);
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (amount) => {
    return new Intl.NumberFormat('uz-UZ').format(amount) + " so'm";
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('uz-UZ', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'yetkazildi':
        return <span className="bg-green-100 text-green-700 px-2.5 py-1 rounded-full text-xs font-bold flex items-center gap-1">Yetkazildi</span>;
      case 'yetkazilmoqda':
        return <span className="bg-blue-100 text-blue-700 px-2.5 py-1 rounded-full text-xs font-bold flex items-center gap-1">Yetkazilmoqda</span>;
      case 'bekor_qilindi':
        return <span className="bg-red-100 text-red-700 px-2.5 py-1 rounded-full text-xs font-bold flex items-center gap-1">Bekor qilindi</span>;
      default:
        return <span className="bg-amber-100 text-amber-800 px-2.5 py-1 rounded-full text-xs font-bold flex items-center gap-1">Kutilmoqda</span>;
    }
  };

  if (!user) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center">
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 space-y-4">
          <div className="w-16 h-16 bg-purple-50 text-purple-600 rounded-full flex items-center justify-center mx-auto">
            <Package className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-gray-900">Buyurtmalarni ko'rish uchun kiring</h2>
          <p className="text-xs text-gray-500">
            Shaxsiy kabinetingizga kirib, barcha rasmiylashtirilgan buyurtmalaringiz holatini kuzatib boring.
          </p>
          <button
            onClick={openLogin}
            className="w-full py-3 bg-[#7000ff] hover:bg-[#6000e6] text-white font-bold rounded-xl text-sm shadow-lg shadow-purple-600/25 transition"
          >
            Tizimga kirish
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 space-y-6">
      <div className="flex items-center gap-3">
        <button
          onClick={onContinueShopping}
          className="p-2 bg-white rounded-xl border border-gray-200 hover:bg-gray-50 text-gray-700 transition"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-2xl font-black text-gray-900">
            Mening Buyurtmalarim
          </h1>
          <p className="text-xs text-gray-500">Barcha xaridlaringiz tarixi va yetkazilish holati</p>
        </div>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1, 2].map((i) => (
            <div key={i} className="bg-white rounded-3xl p-6 border border-gray-100 animate-pulse space-y-4">
              <div className="bg-gray-200 h-6 w-1/4 rounded" />
              <div className="bg-gray-200 h-16 w-full rounded-2xl" />
            </div>
          ))}
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-gray-100 p-8 space-y-4">
          <Package className="w-16 h-16 text-gray-300 mx-auto" />
          <h3 className="text-lg font-bold text-gray-700">Sizda hali buyurtmalar mavjud emas</h3>
          <p className="text-xs text-gray-500 max-w-sm mx-auto">
            Yoqtirgan tovarlaringizni savatga qo'shib, 1 daqiqada buyurtma bering!
          </p>
          <button
            onClick={onContinueShopping}
            className="inline-flex items-center gap-2 py-2.5 px-6 bg-[#7000ff] hover:bg-[#6000e6] text-white font-bold rounded-xl text-sm shadow-md transition"
          >
            Xarid qilishni boshlash
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order.id}
              className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm space-y-4"
            >
              {/* Order Header */}
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-100 pb-4">
                <div>
                  <div className="flex items-center gap-3">
                    <span className="text-base font-black text-gray-900">
                      Buyurtma #{order.id}
                    </span>
                    {getStatusBadge(order.status)}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-400 mt-1">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{formatDate(order.created_at)}</span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-xs text-gray-400 block">Jami summa:</span>
                  <span className="text-base sm:text-lg font-black text-[#7000ff]">
                    {formatPrice(order.total_amount)}
                  </span>
                </div>
              </div>

              {/* Items List */}
              <div className="space-y-2.5">
                {order.items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between gap-3 bg-gray-50/70 p-3 rounded-2xl"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-12 h-12 rounded-xl bg-white p-1 border border-gray-100 flex-shrink-0 flex items-center justify-center">
                        <img
                          src={item.image_url}
                          alt={item.title}
                          className="w-full h-full object-contain"
                        />
                      </div>
                      <div className="truncate">
                        <p className="text-xs sm:text-sm font-semibold text-gray-900 truncate">
                          {item.title}
                        </p>
                        <p className="text-[11px] text-gray-500">
                          {item.quantity} dona × {formatPrice(item.price)}
                        </p>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-gray-900 flex-shrink-0">
                      {formatPrice(item.price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Delivery Details */}
              <div className="text-xs text-gray-500 bg-purple-50/50 p-3 rounded-2xl flex flex-wrap justify-between gap-2">
                <span>Manzil: <strong className="text-gray-800">{order.shipping_address}</strong></span>
                <span>To'lov usuli: <strong className="text-gray-800 capitalize">{order.payment_method}</strong></span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
