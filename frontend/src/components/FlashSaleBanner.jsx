import React, { useState, useEffect } from 'react';
import { Clock, Gift } from 'lucide-react';

const FlashSaleBanner = ({ endTime = new Date(Date.now() + 86400000).getTime() }) => {
  const [timeLeft, setTimeLeft] = useState(endTime - Date.now());

  useEffect(() => {
    const timer = setInterval(() => {
      const remaining = endTime - Date.now();
      if (remaining > 0) {
        setTimeLeft(remaining);
      } else {
        clearInterval(timer);
        setTimeLeft(0);
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [endTime]);

  const formatTime = (ms) => {
    const totalSeconds = Math.floor(ms / 1000);
    const h = Math.floor(totalSeconds / 3600).toString().padStart(2, '0');
    const m = Math.floor((totalSeconds % 3600) / 60).toString().padStart(2, '0');
    const s = (totalSeconds % 60).toString().padStart(2, '0');
    return `${h}:${m}:${s}`;
  };

  return (
    <div className="bg-[#7000ff] text-white py-3 px-4 rounded-lg flex flex-col md:flex-row items-center justify-between shadow-lg mb-6">
      <div className="flex items-center gap-3 mb-3 md:mb-0">
        <Gift size={24} className="animate-bounce text-yellow-300" />
        <div>
          <h3 className="font-bold text-lg leading-tight">Super Chegirma!</h3>
          <p className="text-sm opacity-90">Tanlangan tovarlarga 70% gacha chegirma</p>
        </div>
      </div>
      
      <div className="flex flex-col items-end">
        <div className="flex items-center gap-2 mb-1">
          <Clock size={16} />
          <span className="font-mono font-bold text-xl">{formatTime(timeLeft)}</span>
        </div>
        <div className="w-48 bg-white/20 h-2 rounded-full overflow-hidden">
          <div className="bg-yellow-400 h-full w-3/4 rounded-full" />
        </div>
        <span className="text-xs mt-1 text-white/80">75% sotildi</span>
      </div>
    </div>
  );
};

export default FlashSaleBanner;
