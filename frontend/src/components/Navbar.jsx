import React, { useState } from 'react';
import { 
  Search, 
  ShoppingCart, 
  Heart, 
  User as UserIcon, 
  LayoutGrid, 
  MapPin, 
  ShieldCheck, 
  LogOut, 
  Package, 
  Sparkles,
  Newspaper,
  ChevronDown,
  HelpCircle,
  X
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';

export const Navbar = ({ 
  categories = [], 
  selectedCategory, 
  onSelectCategory, 
  searchQuery, 
  setSearchQuery,
  currentPage,
  setCurrentPage
}) => {
  const { user, isAdmin, logout, openLogin, openRegister } = useAuth();
  const { cartCount, cartTotal } = useCart();
  const { wishlistCount } = useWishlist();
  
  const [catalogOpen, setCatalogOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('uz-UZ').format(price) + " so'm";
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (currentPage !== 'home') {
      setCurrentPage('home');
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white shadow-sm">
      {/* Top micro bar */}
      <div className="bg-[#f2f4f7] text-xs text-gray-600 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-1.5 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <button 
              onClick={() => setCurrentPage('pvz')} 
              className={`flex items-center gap-1.5 hover:text-purple-600 transition font-medium ${currentPage === 'pvz' ? 'text-purple-600 font-bold' : 'text-gray-700'}`}
            >
              <MapPin className="w-3.5 h-3.5 text-purple-600" />
              <span>Topshirish punktlari (PVZ)</span>
            </button>
            <button 
              onClick={() => setCurrentPage('brands')} 
              className={`hidden sm:inline-block hover:text-purple-600 transition ${currentPage === 'brands' ? 'text-purple-600 font-bold' : 'text-gray-500'}`}
            >
              Rasmiy Brendlar
            </button>
            <button 
              onClick={() => setCurrentPage('seller')} 
              className={`hidden md:inline-block text-purple-600 hover:text-purple-800 transition font-semibold ${currentPage === 'seller' ? 'underline' : ''}`}
            >
              Uzumda soting
            </button>
          </div>
          <div className="flex items-center space-x-4 text-gray-600">
            <button 
              onClick={() => setCurrentPage('compare')} 
              className={`hover:text-purple-600 transition flex items-center gap-1 font-medium ${currentPage === 'compare' ? 'text-purple-600 font-bold' : ''}`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              Taqqoslash
            </button>
            <span className="text-gray-300">|</span>
            <button 
              onClick={() => setCurrentPage('news')} 
              className={`hover:text-purple-600 transition flex items-center gap-1 font-medium ${currentPage === 'news' ? 'text-purple-600 font-bold' : ''}`}
            >
              <Newspaper className="w-3.5 h-3.5" />
              Aksiyalar
            </button>
            <span className="text-gray-300">|</span>
            <button 
              onClick={() => setCurrentPage('orders')} 
              className="hover:text-purple-600 transition flex items-center gap-1"
            >
              <Package className="w-3.5 h-3.5" />
              Buyurtmalarim
            </button>
            <span className="text-gray-300">|</span>
            <button onClick={() => setCurrentPage('faq')} className="hover:text-purple-600 transition">
              Yordam
            </button>
          </div>
        </div>
      </div>

      {/* Main navigation header */}
      <div className="max-w-7xl mx-auto px-4 py-3.5">
        <div className="flex items-center justify-between gap-4">
          
          {/* Brand Logo */}
          <div 
            onClick={() => { setCurrentPage('home'); onSelectCategory(null); }}
            className="flex items-center gap-2 cursor-pointer select-none group flex-shrink-0"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-700 to-[#9b42f5] flex items-center justify-center shadow-md shadow-purple-500/20 group-hover:scale-105 transition-transform">
              <span className="text-white font-extrabold text-xl tracking-tighter">u</span>
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-black tracking-tight text-[#7000ff] leading-none">
                uzum <span className="text-gray-900 font-extrabold">market</span>
              </span>
              <span className="text-[10px] text-gray-400 font-semibold tracking-wider uppercase">Online do'kon</span>
            </div>
          </div>

          {/* Catalog Button */}
          <div className="relative">
            <button
              onClick={() => setCatalogOpen(!catalogOpen)}
              className="flex items-center gap-2 bg-[#f0e7ff] text-[#7000ff] hover:bg-[#e4d4ff] font-semibold px-4 py-2.5 rounded-xl transition duration-150 flex-shrink-0 shadow-sm"
            >
              <LayoutGrid className="w-5 h-5" />
              <span className="hidden sm:inline">Katalog</span>
            </button>

            {/* Catalog Dropdown Drawer */}
            {catalogOpen && (
              <div 
                className="absolute top-12 left-0 w-72 sm:w-80 bg-white rounded-2xl shadow-2xl border border-gray-100 p-3 z-50 animate-in fade-in zoom-in duration-150"
                onMouseLeave={() => setCatalogOpen(false)}
              >
                <div className="text-xs font-bold text-gray-400 px-3 py-1.5 uppercase tracking-wider">Kategoriyalar</div>
                <div className="space-y-1">
                  <button
                    onClick={() => {
                      onSelectCategory(null);
                      setCatalogOpen(false);
                      setCurrentPage('home');
                    }}
                    className={`w-full text-left px-3 py-2.5 rounded-xl text-sm font-medium transition flex items-center justify-between ${!selectedCategory ? 'bg-purple-50 text-purple-700 font-bold' : 'hover:bg-gray-50 text-gray-700'}`}
                  >
                    <span>Barcha mahsulotlar</span>
                    <Sparkles className="w-4 h-4 text-amber-500" />
                  </button>

                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => {
                        onSelectCategory(cat.slug);
                        setCatalogOpen(false);
                        setCurrentPage('home');
                      }}
                      className={`w-full text-left px-3 py-2.5 rounded-xl text-sm font-medium transition flex items-center justify-between ${selectedCategory === cat.slug ? 'bg-purple-50 text-purple-700 font-bold' : 'hover:bg-gray-50 text-gray-700'}`}
                    >
                      <span>{cat.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Search Bar */}
          <form onSubmit={handleSearchSubmit} className="flex-1 max-w-2xl relative">
            <div className="relative flex items-center">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Mahsulotlar va toifalarni qidirish..."
                className="w-full pl-4 pr-12 py-2.5 bg-gray-100/90 hover:bg-gray-100 focus:bg-white text-sm rounded-xl border border-transparent focus:border-purple-600 focus:outline-none transition shadow-inner"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-10 text-gray-400 hover:text-gray-600 p-1"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
              <button
                type="submit"
                className="absolute right-2 p-1.5 text-gray-500 hover:text-purple-600 transition"
              >
                <Search className="w-5 h-5" />
              </button>
            </div>
          </form>

          {/* Actions & Profile */}
          <div className="flex items-center space-x-1 sm:space-x-3">
            
            {/* User Login/Profile */}
            <div className="relative">
              {user ? (
                <div>
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-gray-100 text-gray-800 transition"
                  >
                    <div className="w-8 h-8 rounded-full bg-purple-100 text-purple-700 font-bold flex items-center justify-center text-sm border border-purple-200">
                      {user.username.charAt(0).toUpperCase()}
                    </div>
                    <div className="hidden lg:flex flex-col text-left">
                      <span className="text-xs font-semibold leading-tight">{user.username}</span>
                      {isAdmin && (
                        <span className="text-[10px] text-purple-600 font-bold flex items-center gap-0.5">
                          <ShieldCheck className="w-3 h-3" /> Admin
                        </span>
                      )}
                    </div>
                    <ChevronDown className="w-3.5 h-3.5 text-gray-400 hidden sm:block" />
                  </button>

                  {userMenuOpen && (
                    <div 
                      className="absolute right-0 top-12 w-56 bg-white rounded-2xl shadow-xl border border-gray-100 p-2 z-50 animate-in fade-in duration-150"
                      onMouseLeave={() => setUserMenuOpen(false)}
                    >
                      <div className="px-3 py-2 border-b border-gray-100 mb-1">
                        <p className="text-xs text-gray-400">Tizimga kirilgan</p>
                        <p className="text-sm font-bold text-gray-800 truncate">{user.username}</p>
                        <p className="text-xs text-gray-500 truncate">{user.email}</p>
                      </div>

                      {isAdmin && (
                        <button
                          onClick={() => {
                            setCurrentPage('admin');
                            setUserMenuOpen(false);
                          }}
                          className="w-full text-left px-3 py-2 rounded-xl text-sm font-semibold text-purple-700 bg-purple-50 hover:bg-purple-100 transition flex items-center gap-2 mb-1"
                        >
                          <ShieldCheck className="w-4 h-4 text-purple-600" />
                          Admin Paneli
                        </button>
                      )}

                      <button
                        onClick={() => {
                          setCurrentPage('profile');
                          setUserMenuOpen(false);
                        }}
                        className="w-full text-left px-3 py-2 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition flex items-center gap-2"
                      >
                        <UserIcon className="w-4 h-4 text-gray-500" />
                        Mening Profilim
                      </button>

                      <button
                        onClick={() => {
                          setCurrentPage('orders');
                          setUserMenuOpen(false);
                        }}
                        className="w-full text-left px-3 py-2 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition flex items-center gap-2"
                      >
                        <Package className="w-4 h-4 text-gray-500" />
                        Mening Buyurtmalarim
                      </button>

                      <button
                        onClick={() => {
                          setCurrentPage('faq');
                          setUserMenuOpen(false);
                        }}
                        className="w-full text-left px-3 py-2 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition flex items-center gap-2"
                      >
                        <HelpCircle className="w-4 h-4 text-gray-500" />
                        Yordam & FAQ
                      </button>

                      <button
                        onClick={() => {
                          logout();
                          setUserMenuOpen(false);
                        }}
                        className="w-full text-left px-3 py-2 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 transition flex items-center gap-2 mt-1 border-t border-gray-100"
                      >
                        <LogOut className="w-4 h-4 text-red-500" />
                        Chiqish
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center gap-1">
                  <button
                    onClick={openLogin}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-100 transition"
                  >
                    <UserIcon className="w-5 h-5 text-gray-600" />
                    <span className="hidden sm:inline">Kirish</span>
                  </button>
                </div>
              )}
            </div>

            {/* Wishlist */}
            <button
              onClick={() => setCurrentPage('wishlist')}
              className="relative p-2.5 rounded-xl hover:bg-gray-100 text-gray-700 transition"
              title="Sevimlilar"
            >
              <Heart className={`w-5 h-5 ${wishlistCount > 0 ? 'text-red-500 fill-red-500' : 'text-gray-700'}`} />
              {wishlistCount > 0 && (
                <span className="absolute top-1 right-1 bg-red-500 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center shadow">
                  {wishlistCount}
                </span>
              )}
            </button>

            {/* Cart */}
            <button
              onClick={() => setCurrentPage('cart')}
              className="relative flex items-center gap-2 p-2.5 sm:px-3.5 sm:py-2 bg-purple-50 hover:bg-purple-100 rounded-xl text-purple-700 transition font-semibold text-sm"
              title="Savat"
            >
              <div className="relative">
                <ShoppingCart className="w-5 h-5 text-purple-700" />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-purple-600 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center shadow">
                    {cartCount}
                  </span>
                )}
              </div>
              <span className="hidden md:inline">Savat</span>
            </button>

          </div>
        </div>

        {/* Categories Bar */}
        <div className="flex items-center space-x-2 overflow-x-auto py-2.5 scrollbar-none text-xs font-medium border-t border-gray-100 mt-2">
          <button
            onClick={() => { onSelectCategory(null); setCurrentPage('home'); }}
            className={`whitespace-nowrap px-3.5 py-1.5 rounded-full transition ${!selectedCategory && currentPage === 'home' ? 'bg-[#7000ff] text-white font-bold' : 'text-gray-600 hover:bg-gray-100'}`}
          >
            Barchasi
          </button>
          
          <button
            onClick={() => setCurrentPage('news')}
            className={`whitespace-nowrap px-3.5 py-1.5 rounded-full transition flex items-center gap-1.5 ${currentPage === 'news' ? 'bg-[#7000ff] text-white font-bold' : 'text-purple-700 bg-purple-50 hover:bg-purple-100 font-semibold'}`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            Aksiyalar va Yangiliklar
          </button>

          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => { onSelectCategory(cat.slug); setCurrentPage('home'); }}
              className={`whitespace-nowrap px-3.5 py-1.5 rounded-full transition ${selectedCategory === cat.slug && currentPage === 'home' ? 'bg-[#7000ff] text-white font-bold' : 'text-gray-600 hover:bg-gray-100'}`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>
    </header>
  );
};
