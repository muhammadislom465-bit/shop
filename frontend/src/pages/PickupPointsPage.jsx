import React, { useState } from 'react';
import { Search, MapPin, Map, List, Clock } from 'lucide-react';

const PickupPointsPage = () => {
  const [view, setView] = useState('list');
  const [search, setSearch] = useState('');
  
  // Mock data
  const points = [
    { id: 1, address: 'Chilonzor tumani, 9-mavze, 2A-uy', city: 'Toshkent', hours: '09:00 - 21:00', hasFittingRoom: true },
    { id: 2, address: 'Yunusobod tumani, 19-mavze, 45-uy', city: 'Toshkent', hours: '09:00 - 21:00', hasFittingRoom: false },
    { id: 3, address: 'Samarqand sh., Mirzo Ulug\'bek ko\'chasi, 14-uy', city: 'Samarqand', hours: '10:00 - 20:00', hasFittingRoom: true },
  ];

  const filteredPoints = points.filter(p => p.address.toLowerCase().includes(search.toLowerCase()) || p.city.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Topshirish punktlari (Uzum PVZ)</h1>
      
      <div className="flex flex-col md:flex-row gap-4 mb-6 justify-between items-start md:items-center">
        <div className="relative w-full md:w-[400px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input 
            type="text" 
            placeholder="Shahar, ko'cha yoki manzilni qidiring" 
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7000ff]/50"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        
        <div className="flex bg-gray-100 rounded-lg p-1">
          <button 
            className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${view === 'list' ? 'bg-white shadow-sm text-[#7000ff]' : 'text-gray-600'}`}
            onClick={() => setView('list')}
          >
            <List size={18} /> Ro'yxat
          </button>
          <button 
            className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${view === 'map' ? 'bg-white shadow-sm text-[#7000ff]' : 'text-gray-600'}`}
            onClick={() => setView('map')}
          >
            <Map size={18} /> Xarita
          </button>
        </div>
      </div>

      {view === 'list' ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredPoints.map(point => (
            <div key={point.id} className="border border-gray-200 rounded-xl p-5 hover:shadow-md transition-shadow">
              <div className="flex items-start gap-3 mb-3">
                <div className="bg-[#7000ff]/10 p-2 rounded-full text-[#7000ff] shrink-0">
                  <MapPin size={20} />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">{point.address}</h3>
                  <p className="text-sm text-gray-500">{point.city}</p>
                </div>
              </div>
              
              <div className="flex flex-col gap-2 mt-4 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <Clock size={16} /> {point.hours}
                </div>
                {point.hasFittingRoom && (
                  <div className="text-green-600 font-medium bg-green-50 w-fit px-2 py-1 rounded">
                    Kiyib ko'rish xonasi mavjud
                  </div>
                )}
              </div>
              
              <button className="w-full mt-4 border border-[#7000ff] text-[#7000ff] hover:bg-[#7000ff]/5 py-2 rounded-lg font-medium transition-colors">
                Shu yerni tanlash
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-gray-200 rounded-xl w-full h-[500px] flex items-center justify-center border border-gray-300">
          <p className="text-gray-500 flex flex-col items-center gap-2">
            <Map size={48} className="text-gray-400" />
            Xarita integratsiyasi bu yerda bo'ladi (Masalan, Yandex Maps API)
          </p>
        </div>
      )}
    </div>
  );
};

export default PickupPointsPage;
