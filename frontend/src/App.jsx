import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { AuthModal } from './components/AuthModal';
import { HomePage } from './pages/HomePage';
import { CartPage } from './pages/CartPage';
import { WishlistPage } from './pages/WishlistPage';
import { NewsPage } from './pages/NewsPage';
import { OrdersPage } from './pages/OrdersPage';
import { AdminDashboard } from './pages/AdminDashboard';
import { ProfilePage } from './pages/ProfilePage';
import { FAQPage } from './pages/FAQPage';
import PickupPointsPage from './pages/PickupPointsPage';
import ComparePage from './pages/ComparePage';
import BrandsPage from './pages/BrandsPage';
import SellerOnboardingPage from './pages/SellerOnboardingPage';
import WarrantyPage from './pages/WarrantyPage';
import SupportChatWidget from './components/SupportChatWidget';
import { categoriesApi } from './services/api';
import { useAuth } from './context/AuthContext';

export function AppContent() {
  const [currentPage, setCurrentPage] = useState('home');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [categories, setCategories] = useState([]);
  const { isAdmin } = useAuth();

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await categoriesApi.getAll();
      setCategories(res.data);
    } catch (err) {
      console.error("Kategoriyalarni yuklashda xatolik:", err);
    }
  };

  const handleSelectCategory = (slug) => {
    setSelectedCategory(slug);
    setSearchQuery('');
    setCurrentPage('home');
  };

  return (
    <div className="min-h-screen flex flex-col justify-between bg-[#f8f9fa] text-[#1f2026]">
      {/* Navbar */}
      {currentPage !== 'admin' && (
        <Navbar
          categories={categories}
          selectedCategory={selectedCategory}
          onSelectCategory={handleSelectCategory}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
        />
      )}

      {/* Main Page Routing */}
      <main className="flex-grow">
        {currentPage === 'home' && (
          <HomePage
            selectedCategory={selectedCategory}
            searchQuery={searchQuery}
            onSelectCategory={handleSelectCategory}
            onNavigateNews={() => setCurrentPage('news')}
          />
        )}

        {currentPage === 'cart' && (
          <CartPage
            onContinueShopping={() => setCurrentPage('home')}
            onOrderSuccess={() => setCurrentPage('orders')}
          />
        )}

        {currentPage === 'wishlist' && (
          <WishlistPage
            onContinueShopping={() => setCurrentPage('home')}
          />
        )}

        {currentPage === 'compare' && (
          <ComparePage
            onContinueShopping={() => setCurrentPage('home')}
          />
        )}

        {currentPage === 'pvz' && (
          <PickupPointsPage
            onBackHome={() => setCurrentPage('home')}
          />
        )}

        {currentPage === 'brands' && (
          <BrandsPage
            onBackHome={() => setCurrentPage('home')}
          />
        )}

        {currentPage === 'seller' && (
          <SellerOnboardingPage
            onBackHome={() => setCurrentPage('home')}
          />
        )}

        {currentPage === 'warranty' && (
          <WarrantyPage
            onBackHome={() => setCurrentPage('home')}
          />
        )}

        {currentPage === 'news' && (
          <NewsPage
            onBackHome={() => setCurrentPage('home')}
          />
        )}

        {currentPage === 'orders' && (
          <OrdersPage
            onContinueShopping={() => setCurrentPage('home')}
          />
        )}

        {currentPage === 'profile' && (
          <ProfilePage
            onContinueShopping={() => setCurrentPage('home')}
            onGoToOrders={() => setCurrentPage('orders')}
          />
        )}

        {currentPage === 'faq' && (
          <FAQPage
            onBackHome={() => setCurrentPage('home')}
          />
        )}

        {currentPage === 'admin' && (
          <AdminDashboard
            onBackHome={() => setCurrentPage('home')}
          />
        )}
      </main>

      {/* Floating Customer Support Chat */}
      {currentPage !== 'admin' && <SupportChatWidget />}

      {/* Footer */}
      {currentPage !== 'admin' && (
        <Footer
          onNavigateFAQ={() => setCurrentPage('faq')}
          onNavigatePVZ={() => setCurrentPage('pvz')}
          onNavigateSeller={() => setCurrentPage('seller')}
          onNavigateWarranty={() => setCurrentPage('warranty')}
          onNavigateBrands={() => setCurrentPage('brands')}
        />
      )}

      {/* Global Auth Modal */}
      <AuthModal onAdminLogin={() => setCurrentPage('admin')} />
    </div>
  );
}

export default function App() {
  return <AppContent />;
}
