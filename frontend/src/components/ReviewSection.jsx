import React, { useState, useEffect } from 'react';
import { Star, ThumbsUp, User, Check, AlertCircle, Send } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { reviewsApi } from '../services/api';

export const ReviewSection = ({ productId }) => {
  const { token, openLogin } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('newest');
  const [showForm, setShowForm] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });

  const [form, setForm] = useState({ rating: 5, title: '', comment: '' });
  const [hoverRating, setHoverRating] = useState(0);

  useEffect(() => {
    if (productId) loadReviews();
  }, [productId, sortBy]);

  const loadReviews = async () => {
    setLoading(true);
    try {
      const [reviewsRes, statsRes] = await Promise.all([
        reviewsApi.getProductReviews(productId, sortBy),
        reviewsApi.getProductStats(productId)
      ]);
      setReviews(reviewsRes.data);
      setStats(statsRes.data);
    } catch (err) {
      console.error('Sharhlarni yuklashda xatolik:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!token) {
      openLogin();
      return;
    }
    setSubmitLoading(true);
    setMessage({ text: '', type: '' });
    try {
      await reviewsApi.create({
        product_id: productId,
        rating: form.rating,
        title: form.title || null,
        comment: form.comment || null
      });
      setMessage({ text: "Sharhingiz muvaffaqiyatli qo'shildi!", type: 'success' });
      setForm({ rating: 5, title: '', comment: '' });
      setShowForm(false);
      loadReviews();
    } catch (err) {
      setMessage({ text: err.response?.data?.detail || 'Sharh yozishda xatolik!', type: 'error' });
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleHelpful = async (reviewId) => {
    if (!token) { openLogin(); return; }
    try {
      await reviewsApi.markHelpful(reviewId);
      loadReviews();
    } catch (err) {
      console.error('Xatolik:', err);
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString('uz-UZ', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  const ratingLabels = { 5: "A'lo", 4: 'Yaxshi', 3: "O'rtacha", 2: 'Yomon', 1: 'Juda yomon' };

  return (
    <div className="mt-6 border-t border-gray-100 pt-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-black text-gray-900">Xaridorlar Sharhlari</h3>
        <button
          onClick={() => {
            if (!token) { openLogin(); return; }
            setShowForm(!showForm);
          }}
          className="px-4 py-2 bg-[#7000ff] text-white text-xs font-bold rounded-xl hover:bg-[#6000e6] transition flex items-center gap-1.5"
        >
          <Star className="w-4 h-4" /> Sharh Yozish
        </button>
      </div>

      {message.text && (
        <div className={`p-3 rounded-xl mb-4 text-xs font-semibold flex items-center gap-2 ${
          message.type === 'error' ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'
        }`}>
          {message.type === 'error' ? <AlertCircle className="w-4 h-4" /> : <Check className="w-4 h-4" />}
          {message.text}
        </div>
      )}

      {stats && stats.total_reviews > 0 && (
        <div className="bg-gray-50 rounded-3xl p-6 mb-6 flex flex-col md:flex-row gap-6">
          <div className="text-center md:text-left flex-shrink-0">
            <div className="text-4xl font-black text-gray-900">{stats.average_rating}</div>
            <div className="flex items-center gap-1 mt-1 justify-center md:justify-start">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star key={s} className={`w-4 h-4 ${
                  s <= Math.round(stats.average_rating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'
                }`} />
              ))}
            </div>
            <p className="text-xs text-gray-500 mt-1">{stats.total_reviews} ta sharh</p>
          </div>

          <div className="flex-1 space-y-1.5">
            {[5, 4, 3, 2, 1].map((star) => {
              const count = stats.rating_distribution[String(star)] || 0;
              const percentage = stats.total_reviews > 0 ? (count / stats.total_reviews) * 100 : 0;
              return (
                <div key={star} className="flex items-center gap-2 text-xs">
                  <span className="w-3 font-bold text-gray-600">{star}</span>
                  <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                  <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full bg-yellow-400 rounded-full transition-all" style={{ width: `${percentage}%` }} />
                  </div>
                  <span className="w-8 text-right text-gray-500">{count}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {showForm && (
        <div className="bg-white rounded-3xl border border-purple-200 p-6 mb-6 shadow-lg shadow-purple-50">
          <h4 className="font-bold text-sm text-gray-900 mb-4">Sharh yozish</h4>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-gray-600 block mb-2">Baholash</label>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((s) => (
                  <button
                    key={s}
                    type="button"
                    onMouseEnter={() => setHoverRating(s)}
                    onMouseLeave={() => setHoverRating(0)}
                    onClick={() => setForm({ ...form, rating: s })}
                    className="p-0.5"
                  >
                    <Star className={`w-7 h-7 transition ${
                      s <= (hoverRating || form.rating)
                        ? 'text-yellow-400 fill-yellow-400 scale-110'
                        : 'text-gray-300'
                    }`} />
                  </button>
                ))}
                <span className="text-xs text-gray-500 ml-2 font-semibold">
                  {ratingLabels[hoverRating || form.rating]}
                </span>
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-600 block mb-1">Sarlavha (ixtiyoriy)</label>
              <input
                type="text"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="w-full p-3 border rounded-xl text-sm focus:outline-none focus:border-[#7000ff]"
                placeholder="Qisqa xulosa..."
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-600 block mb-1">Izoh (ixtiyoriy)</label>
              <textarea
                value={form.comment}
                onChange={(e) => setForm({ ...form, comment: e.target.value })}
                rows={3}
                className="w-full p-3 border rounded-xl text-sm focus:outline-none focus:border-[#7000ff] resize-none"
                placeholder="Mahsulot haqida fikringizni yozing..."
              />
            </div>

            <div className="flex items-center gap-3">
              <button
                type="submit"
                disabled={submitLoading}
                className="px-6 py-3 bg-[#7000ff] text-white font-bold rounded-xl hover:bg-[#6000e6] transition flex items-center gap-2 disabled:opacity-50"
              >
                <Send className="w-4 h-4" /> {submitLoading ? 'Yuborilmoqda...' : 'Yuborish'}
              </button>
              <button type="button" onClick={() => setShowForm(false)} className="px-4 py-3 text-gray-500 font-bold text-sm hover:text-gray-700">
                Bekor qilish
              </button>
            </div>
          </form>
        </div>
      )}

      {reviews.length > 0 && (
        <div className="flex items-center gap-2 mb-4">
          <span className="text-xs text-gray-500 font-semibold">Saralash:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="text-xs font-bold text-[#7000ff] bg-purple-50 border border-purple-200 px-3 py-1.5 rounded-xl focus:outline-none"
          >
            <option value="newest">Eng yangi</option>
            <option value="highest">Eng yuqori baho</option>
            <option value="lowest">Eng past baho</option>
            <option value="helpful">Eng foydali</option>
          </select>
        </div>
      )}

      {loading ? (
        <div className="text-center py-8">
          <div className="w-6 h-6 border-2 border-[#7000ff] border-t-transparent rounded-full animate-spin mx-auto"></div>
        </div>
      ) : reviews.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-3xl">
          <Star className="w-10 h-10 text-gray-300 mx-auto mb-2" />
          <p className="text-sm text-gray-500">Hali sharhlar yo'q. Birinchi bo'lib sharh yozing!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => (
            <div key={review.id} className="bg-white rounded-2xl border border-gray-100 p-5 hover:border-gray-200 transition">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-full bg-purple-100 text-[#7000ff] flex items-center justify-center text-sm font-bold flex-shrink-0">
                    {review.username?.charAt(0).toUpperCase() || <User className="w-4 h-4" />}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-gray-900">{review.username || 'Anonim'}</span>
                      {review.is_verified_purchase && (
                        <span className="text-[9px] bg-green-100 text-green-700 px-1.5 py-0.5 rounded font-bold flex items-center gap-0.5">
                          <Check className="w-2.5 h-2.5" /> Xaridor
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-1 mt-0.5">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star key={s} className={`w-3 h-3 ${
                          s <= review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'
                        }`} />
                      ))}
                      <span className="text-[10px] text-gray-400 ml-1">{formatDate(review.created_at)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {review.title && <h4 className="font-bold text-sm text-gray-800 mt-3">{review.title}</h4>}
              {review.comment && <p className="text-xs text-gray-600 mt-1 leading-relaxed">{review.comment}</p>}

              <div className="mt-3 flex items-center gap-3">
                <button
                  onClick={() => handleHelpful(review.id)}
                  className="text-xs text-gray-400 hover:text-[#7000ff] flex items-center gap-1 transition"
                >
                  <ThumbsUp className="w-3.5 h-3.5" /> Foydali ({review.helpful_count})
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
