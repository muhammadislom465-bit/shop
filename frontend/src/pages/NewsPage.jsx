import React, { useState, useEffect } from 'react';
import { Newspaper, Calendar, Eye, Sparkles, Tag, ArrowLeft } from 'lucide-react';
import { newsApi } from '../services/api';
import { NewsModal } from '../components/NewsModal';

export const NewsPage = ({ onBackHome }) => {
  const [newsList, setNewsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedNews, setSelectedNews] = useState(null);
  const [activeTag, setActiveTag] = useState(null);

  useEffect(() => {
    fetchNews();
  }, [activeTag]);

  const fetchNews = async () => {
    setLoading(true);
    try {
      const params = activeTag ? { tag: activeTag } : {};
      const res = await newsApi.getAll(params);
      setNewsList(res.data);
    } catch (err) {
      console.error("Yangiliklarni yuklashda xatolik:", err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('uz-UZ', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const tags = ['Aksiya', 'Chegirma', 'Nasiya 0%', 'Yangi', 'Muhim'];

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200 pb-4">
        <div className="flex items-center gap-3">
          <button
            onClick={onBackHome}
            className="p-2 bg-white rounded-xl border border-gray-200 hover:bg-gray-50 text-gray-700 transition"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-gray-900 flex items-center gap-2">
              <Sparkles className="w-7 h-7 text-[#7000ff]" />
              Aksiyalar va Yangiliklar
            </h1>
            <p className="text-xs text-gray-500 mt-0.5">
              Uzum Marketdagi so'nggi chegirmalar, aksiyalar va muhim xabarlar
            </p>
          </div>
        </div>

        {/* Filter Tags */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          <button
            onClick={() => setActiveTag(null)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
              activeTag === null
                ? 'bg-[#7000ff] text-white shadow-md shadow-purple-600/20'
                : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
            }`}
          >
            Barchasi
          </button>
          {tags.map((t) => (
            <button
              key={t}
              onClick={() => setActiveTag(t)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                activeTag === t
                  ? 'bg-[#7000ff] text-white shadow-md shadow-purple-600/20'
                  : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Content Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 py-8">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white rounded-3xl p-4 border border-gray-100 animate-pulse space-y-3">
              <div className="bg-gray-200 h-48 rounded-2xl w-full" />
              <div className="bg-gray-200 h-5 rounded w-3/4" />
              <div className="bg-gray-200 h-4 rounded w-full" />
            </div>
          ))}
        </div>
      ) : newsList.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-gray-100 p-8">
          <Newspaper className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-gray-700">Hech qanday yangilik topilmadi</h3>
          <p className="text-xs text-gray-500 mt-1">Boshqa toifani tanlab ko'ring.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {newsList.map((item) => (
            <div
              key={item.id}
              onClick={() => setSelectedNews(item)}
              className="bg-white rounded-3xl border border-gray-100 hover:border-purple-200 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col justify-between cursor-pointer group"
            >
              <div>
                {/* Image */}
                <div className="h-48 w-full bg-gray-100 overflow-hidden relative">
                  <img
                    src={item.image_url}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <span className="absolute top-3 left-3 bg-[#7000ff] text-white text-[11px] font-black px-2.5 py-0.5 rounded-full shadow">
                    {item.tag || 'Aksiya'}
                  </span>
                </div>

                {/* Body */}
                <div className="p-5 space-y-2">
                  <div className="flex items-center gap-3 text-[11px] text-gray-400">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-purple-600" />
                      {formatDate(item.created_at)}
                    </span>
                    <span className="flex items-center gap-1">
                      <Eye className="w-3.5 h-3.5" />
                      {item.views_count}
                    </span>
                  </div>

                  <h3 className="font-bold text-base text-gray-900 group-hover:text-purple-600 transition leading-snug line-clamp-2">
                    {item.title}
                  </h3>

                  <p className="text-xs text-gray-500 line-clamp-3 leading-relaxed">
                    {item.summary}
                  </p>
                </div>
              </div>

              <div className="p-5 pt-0">
                <span className="text-xs font-bold text-[#7000ff] group-hover:underline flex items-center gap-1">
                  Batafsil o'qish →
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedNews && (
        <NewsModal
          news={selectedNews}
          onClose={() => setSelectedNews(null)}
        />
      )}
    </div>
  );
};
