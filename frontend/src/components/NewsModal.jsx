import React from 'react';
import { X, Calendar, Eye, Tag } from 'lucide-react';

export const NewsModal = ({ news, onClose }) => {
  if (!news) return null;

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('uz-UZ', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div 
        className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden relative max-h-[90vh] flex flex-col animate-in fade-in zoom-in duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center transition backdrop-blur-sm"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Hero image */}
        <div className="h-56 sm:h-72 w-full relative bg-gray-900 flex-shrink-0">
          <img
            src={news.image_url}
            alt={news.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent flex flex-col justify-end p-6">
            <span className="inline-block self-start text-xs font-bold px-2.5 py-1 rounded-full bg-purple-600 text-white mb-2 shadow">
              {news.tag || 'Aksiya'}
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-white leading-snug">
              {news.title}
            </h2>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-4">
          <div className="flex items-center gap-4 text-xs text-gray-500 border-b border-gray-100 pb-3">
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-purple-600" />
              {formatDate(news.created_at)}
            </span>
            <span className="flex items-center gap-1">
              <Eye className="w-3.5 h-3.5 text-gray-400" />
              {news.views_count} marta ko'rildi
            </span>
          </div>

          <div className="text-sm font-semibold text-gray-800 bg-purple-50/70 p-4 rounded-2xl border border-purple-100">
            {news.summary}
          </div>

          <div className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">
            {news.content}
          </div>
        </div>
      </div>
    </div>
  );
};
