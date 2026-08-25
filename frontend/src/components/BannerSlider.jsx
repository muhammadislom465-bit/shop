import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';

export const BannerSlider = ({ onNewsClick }) => {
  const slides = [
    {
      id: 1,
      title: "Katta Bahorgi Chegirmalar!",
      subtitle: "Barcha toifalarga 60% gacha chegirma va 1 kunda yetkazish",
      bgGradient: "from-[#7000ff] via-[#8c2bff] to-[#450099]",
      textColor: "text-white",
      badge: "KATTA CHEGIRMA",
      badgeColor: "bg-yellow-400 text-gray-950 font-black",
      imageUrl: "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=800&q=80",
      btnText: "Batafsil ko'rish",
    },
    {
      id: 2,
      title: "Smartfonlar Nasiya 0-0-12",
      subtitle: "Boshlang'ich to'lovsiz va 0% ustama bilan 12 oyga bo'lib to'lang",
      bgGradient: "from-[#0f172a] via-[#1e1b4b] to-[#311042]",
      textColor: "text-white",
      badge: "NASIYA 0%",
      badgeColor: "bg-purple-500 text-white font-bold",
      imageUrl: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&q=80",
      btnText: "Tanlash",
    },
    {
      id: 3,
      title: "Yangi Mavsumiy Kiyimlar To'plami",
      subtitle: "2026-yilning eng so'nggi urfdagi brend kiyimlari to'plami",
      bgGradient: "from-[#ec4899] via-[#8b5cf6] to-[#6366f1]",
      textColor: "text-white",
      badge: "YANGI TO'PLAM",
      badgeColor: "bg-white text-purple-900 font-bold",
      imageUrl: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&q=80",
      btnText: "Xarid qilish",
    }
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % slides.length);
  };

  const current = slides[currentIndex];

  return (
    <div className="relative overflow-hidden rounded-3xl shadow-xl my-4 group">
      <div 
        className={`w-full h-56 sm:h-72 md:h-80 bg-gradient-to-r ${current.bgGradient} flex items-center transition-all duration-700 relative`}
      >
        <div className="max-w-7xl w-full mx-auto px-6 sm:px-12 flex items-center justify-between z-10">
          <div className="max-w-md sm:max-w-lg">
            <span className={`inline-block text-xs uppercase px-3 py-1 rounded-full mb-3 tracking-wider ${current.badgeColor}`}>
              {current.badge}
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
              {current.title}
            </h2>
            <p className="text-sm sm:text-base text-purple-100 mt-2 line-clamp-2">
              {current.subtitle}
            </p>
            <button
              onClick={onNewsClick}
              className="mt-4 px-6 py-2.5 bg-white text-purple-900 hover:bg-yellow-300 font-bold text-sm rounded-xl shadow-lg transition-transform transform active:scale-95 flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-purple-700" />
              {current.btnText}
            </button>
          </div>

          <div className="hidden sm:block w-48 h-48 md:w-64 md:h-64 rounded-2xl overflow-hidden shadow-2xl border-4 border-white/20 transform rotate-2 group-hover:rotate-0 transition-transform duration-300">
            <img 
              src={current.imageUrl} 
              alt={current.title} 
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Slide Controls */}
        <button
          onClick={prevSlide}
          className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/30 hover:bg-black/60 text-white flex items-center justify-center backdrop-blur-sm transition opacity-0 group-hover:opacity-100"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/30 hover:bg-black/60 text-white flex items-center justify-center backdrop-blur-sm transition opacity-0 group-hover:opacity-100"
        >
          <ChevronRight className="w-5 h-5" />
        </button>

        {/* Indicators */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex space-x-1.5 z-10">
          {slides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`h-2 rounded-full transition-all ${currentIndex === idx ? 'w-6 bg-white' : 'w-2 bg-white/40'}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
