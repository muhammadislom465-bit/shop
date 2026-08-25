import React, { useState, useEffect } from 'react';
import { BannerSlider } from '../components/BannerSlider';
import FlashSaleBanner from '../components/FlashSaleBanner';
import { ProductCard } from '../components/ProductCard';
import { ProductDetailModal } from '../components/ProductDetailModal';
import { NewsModal } from '../components/NewsModal';
import { productsApi, newsApi } from '../services/api';
import { Flame, Sparkles, Filter, ChevronRight, Newspaper, AlertCircle } from 'lucide-react';

export const HomePage = ({ 
  selectedCategory, 
  searchQuery, 
  onSelectCategory,
  onNavigateNews
}) => {
  const [products, setProducts] = useState([]);
  const [newsList, setNewsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedNews, setSelectedNews] = useState(null);
  const [sortBy, setSortBy] = useState('newest');

  useEffect(() => {
    fetchData();
  }, [selectedCategory, searchQuery, sortBy]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const params = {};
      if (selectedCategory) params.category_slug = selectedCategory;
      if (searchQuery) params.search = searchQuery;
      if (sortBy) params.sort_by = sortBy;

      const [productsRes, newsRes] = await Promise.all([
        productsApi.getAll(params),
        newsApi.getAll({ limit: 4 })
      ]);

      setProducts(productsRes.data);
      setNewsList(newsRes.data);
    } catch (err) {
      console.error("Ma'lumotlarni yuklashda xatolik:", err);
    } finally {
      setLoading(false);
    }
  };

  const popularProducts = products.filter(p => p.is_popular).slice(0, 4);

  return (
    <div className="max-w-7xl mx-auto px-4 py-4 space-y-8">
      {/* Banner slider only when not searching or in specific subcategory */}
      {!searchQuery && !selectedCategory && (
        <>
          <BannerSlider onNewsClick={onNavigateNews} />
          <FlashSaleBanner />
        </>
      )}

      {/* Popular Products Carousel / Highlight */}
      {!searchQuery && !selectedCategory && popularProducts.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center">
                <Flame className="w-5 h-5 fill-amber-500 text-amber-500" />
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-gray-900">
                Eng ko'p sotilganlar
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
            {popularProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onProductClick={(p) => setSelectedProduct(p)}
              />
            ))}
          </div>
        </section>
      )}

      {/* Promotional News Banner Cards */}
      {!searchQuery && !selectedCategory && newsList.length > 0 && (
        <section className="bg-purple-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <Newspaper className="w-6 h-6 text-yellow-300" />
                <h3 className="text-xl sm:text-2xl font-black">
                  Aksiyalar va Yangiliklar
                </h3>
              </div>
              <button
                onClick={onNavigateNews}
                className="text-xs sm:text-sm text-purple-200 hover:text-white font-bold flex items-center gap-1 transition"
              >
                Barchasini ko'rish <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {newsList.slice(0, 3).map((item) => (
                <div
                  key={item.id}
                  onClick={() => setSelectedNews(item)}
                  className="bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-2xl p-4 cursor-pointer transition flex flex-col justify-between border border-white/10"
                >
                  <div>
                    <span className="inline-block text-[10px] uppercase font-extrabold bg-yellow-400 text-gray-950 px-2 py-0.5 rounded mb-2">
                      {item.tag || 'Aksiya'}
                    </span>
                    <h4 className="font-bold text-sm text-white line-clamp-2">
                      {item.title}
                    </h4>
                    <p className="text-xs text-purple-100/80 mt-1.5 line-clamp-2">
                      {item.summary}
                    </p>
                  </div>
                  <span className="text-[11px] text-yellow-300 font-bold mt-3 inline-flex items-center gap-1">
                    Batafsil tanishish →
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Main Catalog Section */}
      <section className="space-y-4 pt-2">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-200 pb-3">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-gray-900 flex items-center gap-2">
              {searchQuery ? `Qidiruv natijalari: "${searchQuery}"` : selectedCategory ? `Kategoriya: ${selectedCategory}` : "Barcha Mahsulotlar"}
              <span className="text-sm font-normal text-gray-500">
                ({products.length} ta mahsulot)
              </span>
            </h2>
          </div>

          {/* Sort Selector */}
          <div className="flex items-center gap-2 self-end sm:self-auto">
            <span className="text-xs text-gray-500 font-medium hidden sm:inline">Saralash:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-white border border-gray-200 text-xs font-semibold text-gray-700 py-2 px-3 rounded-xl focus:outline-none focus:border-purple-600 shadow-sm"
            >
              <option value="newest">Yangi qo'shilganlar</option>
              <option value="rating">Reyting bo'yicha</option>
              <option value="price_asc">Arzonroq</option>
              <option value="price_desc">Qimmatroq</option>
            </select>
          </div>
        </div>

        {/* Loading state */}
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 py-12">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl p-4 border border-gray-100 animate-pulse space-y-3">
                <div className="bg-gray-200 h-44 rounded-xl w-full" />
                <div className="bg-gray-200 h-4 rounded w-3/4" />
                <div className="bg-gray-200 h-4 rounded w-1/2" />
                <div className="bg-gray-200 h-6 rounded w-1/3" />
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl border border-gray-100 shadow-sm p-8">
            <AlertCircle className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-gray-700">Hech qanday mahsulot topilmadi</h3>
            <p className="text-xs text-gray-500 mt-1 max-w-sm mx-auto">
              Qidiruv so'zini o'zgartirib ko'ring yoki barcha kategoriyalar bo'limiga o'ting.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-3 sm:gap-4">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onProductClick={(p) => setSelectedProduct(p)}
              />
            ))}
          </div>
        )}
      </section>

      {/* Modals */}
      {selectedProduct && (
        <ProductDetailModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
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
