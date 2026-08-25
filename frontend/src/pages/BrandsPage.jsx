import React from 'react';
import { Search, ChevronRight, Star } from 'lucide-react';

const BrandsPage = () => {
  const brands = [
    { id: 1, name: 'Apple', logo: 'https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg', items: 124, featured: true },
    { id: 2, name: 'Samsung', logo: 'https://upload.wikimedia.org/wikipedia/commons/2/24/Samsung_Logo.svg', items: 342, featured: true },
    { id: 3, name: 'Nike', logo: 'https://upload.wikimedia.org/wikipedia/commons/a/a6/Logo_NIKE.svg', items: 89, featured: true },
    { id: 4, name: 'Xiaomi', logo: 'https://upload.wikimedia.org/wikipedia/commons/2/29/Xiaomi_logo.svg', items: 210, featured: false },
    { id: 5, name: 'Sony', logo: 'https://upload.wikimedia.org/wikipedia/commons/c/ca/Sony_logo.svg', items: 56, featured: false },
  ];

  const featuredBrands = brands.filter(b => b.featured);
  const otherBrands = brands.filter(b => !b.featured);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-gradient-to-r from-[#7000ff] to-[#8f33ff] rounded-2xl p-8 mb-10 text-white shadow-lg">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">Rasmiy do'konlar va brendlar</h1>
        <p className="text-lg opacity-90 mb-6 max-w-2xl">
          Faqat original mahsulotlar. Barcha brendlar rasmiy kafolatga ega va to'g'ridan-to'g'ri ishlab chiqaruvchilardan yetkazib beriladi.
        </p>
        <div className="relative max-w-md text-gray-800">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input 
            type="text" 
            placeholder="Brend nomini qidiring..." 
            className="w-full pl-12 pr-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-white/50 border-0"
          />
        </div>
      </div>

      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
          <Star className="text-yellow-400 fill-yellow-400" />
          Tavsiya etilgan brendlar
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {featuredBrands.map(brand => (
            <div key={brand.id} className="bg-white border rounded-xl p-6 flex flex-col items-center justify-center gap-4 hover:shadow-lg transition-shadow cursor-pointer group">
              <div className="h-16 flex items-center justify-center">
                <img src={brand.logo} alt={brand.name} className="max-h-full max-w-full object-contain grayscale group-hover:grayscale-0 transition-all opacity-70 group-hover:opacity-100" />
              </div>
              <div className="text-center">
                <h3 className="font-bold text-gray-800">{brand.name}</h3>
                <p className="text-xs text-gray-500">{brand.items} mahsulot</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-6">Barcha brendlar (A-Z)</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {otherBrands.map(brand => (
            <div key={brand.id} className="border rounded-lg p-4 flex items-center justify-between hover:border-[#7000ff] hover:text-[#7000ff] cursor-pointer transition-colors group">
              <span className="font-medium">{brand.name}</span>
              <ChevronRight size={16} className="text-gray-300 group-hover:text-[#7000ff]" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BrandsPage;
