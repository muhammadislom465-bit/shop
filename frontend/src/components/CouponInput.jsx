import React, { useState } from 'react';
import { Tag, Check, X, Loader2, AlertCircle, Gift } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { couponsApi } from '../services/api';

export const CouponInput = ({ orderTotal, onApplyCoupon, onRemoveCoupon, appliedCoupon }) => {
  const { token, openLogin } = useAuth();
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [validationResult, setValidationResult] = useState(null);

  const handleValidate = async (e) => {
    e.preventDefault();
    if (!token) { openLogin(); return; }
    if (!code.trim()) { setError('Promo kodni kiriting.'); return; }
    
    setLoading(true);
    setError('');
    try {
      const res = await couponsApi.validate({ code: code.trim(), order_total: orderTotal });
      if (res.data.valid) {
        setValidationResult(res.data);
        onApplyCoupon({
          code: code.trim().toUpperCase(),
          discount_amount: res.data.discount_amount,
          coupon: res.data.coupon
        });
        setError('');
      } else {
        setError(res.data.message);
        setValidationResult(null);
      }
    } catch (err) {
      setError(err.response?.data?.detail || 'Promo kodni tekshirishda xatolik.');
      setValidationResult(null);
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = () => {
    setCode('');
    setValidationResult(null);
    setError('');
    onRemoveCoupon();
  };

  const formatPrice = (amount) => {
    if (!amount) return '0';
    return new Intl.NumberFormat('uz-UZ').format(amount) + " so'm";
  };

  if (appliedCoupon) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-2xl p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-green-100 rounded-xl flex items-center justify-center">
              <Gift className="w-4 h-4 text-green-600" />
            </div>
            <div>
              <p className="text-xs font-bold text-green-700 flex items-center gap-1">
                <Check className="w-3.5 h-3.5" /> Promo kod qo'llanildi!
              </p>
              <p className="text-[11px] text-green-600 mt-0.5">
                <span className="font-black">{appliedCoupon.code}</span> — chegirma: <span className="font-black">{formatPrice(appliedCoupon.discount_amount)}</span>
              </p>
            </div>
          </div>
          <button
            onClick={handleRemove}
            className="p-1.5 text-green-600 hover:text-red-500 hover:bg-red-50 rounded-lg transition"
            title="Promo kodni bekor qilish"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-purple-50 border border-purple-100 rounded-2xl p-4">
      <div className="flex items-center gap-2 mb-3">
        <Tag className="w-4 h-4 text-[#7000ff]" />
        <span className="text-xs font-bold text-gray-700">Promo kod bormi?</span>
      </div>
      <form onSubmit={handleValidate} className="flex gap-2">
        <input
          type="text"
          value={code}
          onChange={(e) => { setCode(e.target.value.toUpperCase()); setError(''); }}
          placeholder="UZUM10"
          className="flex-1 px-4 py-2.5 border border-purple-200 rounded-xl text-sm font-bold text-gray-900 bg-white focus:outline-none focus:border-[#7000ff] uppercase tracking-wider placeholder:text-gray-400 placeholder:font-normal"
          maxLength={20}
        />
        <button
          type="submit"
          disabled={loading || !code.trim()}
          className="px-5 py-2.5 bg-[#7000ff] text-white text-xs font-bold rounded-xl hover:bg-[#6000e6] transition flex items-center gap-1.5 disabled:opacity-50"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
          Qo'llash
        </button>
      </form>
      {error && (
        <div className="mt-2 text-xs text-red-500 font-semibold flex items-center gap-1">
          <AlertCircle className="w-3.5 h-3.5" /> {error}
        </div>
      )}
    </div>
  );
};
