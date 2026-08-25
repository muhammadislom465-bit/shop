import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Package, 
  ShoppingBag, 
  Users, 
  DollarSign, 
  Newspaper, 
  Plus, 
  Edit3, 
  Trash2, 
  Sparkles, 
  Check, 
  X, 
  Clock, 
  Eye, 
  ArrowLeft,
  AlertCircle,
  Zap,
  TrendingUp,
  ShieldAlert,
  LogOut,
  ExternalLink,
  Search,
  Filter,
  Activity,
  CheckCircle2,
  Lock,
  Smartphone
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { adminApi, productsApi, categoriesApi, newsApi, ordersApi } from '../services/api';

export const AdminDashboard = ({ onBackHome }) => {
  const { user, isAdmin, logout } = useAuth();
  
  const [activeTab, setActiveTab] = useState('overview'); // 'overview', 'products', 'news', 'templates', 'orders', 'users', 'security'
  const [stats, setStats] = useState(null);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [newsList, setNewsList] = useState([]);
  const [templates, setTemplates] = useState([]);
  const [orders, setOrders] = useState([]);
  const [usersList, setUsersList] = useState([]);
  const [securityLogs, setSecurityLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  // Search in Admin
  const [productSearch, setProductSearch] = useState('');

  // Modals state
  const [productModalOpen, setProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [productForm, setProductForm] = useState({
    title: '',
    description: '',
    category_id: 1,
    price: '',
    discount_price: '',
    installment_price: '',
    image_url: '',
    stock: 50,
    is_popular: false,
    is_featured: false,
  });

  const [newsModalOpen, setNewsModalOpen] = useState(false);
  const [editingNews, setEditingNews] = useState(null);
  const [newsForm, setNewsForm] = useState({
    title: '',
    summary: '',
    content: '',
    image_url: '',
    tag: 'Aksiya',
    badge_color: 'purple',
    is_published: true,
  });

  const [templateModalOpen, setTemplateModalOpen] = useState(false);
  const [templateForm, setTemplateForm] = useState({
    title: '',
    category_type: 'chegirma',
    default_tag: 'Aksiya',
    badge_color: 'purple',
    description: '',
    default_content: '',
    image_url: '',
  });

  const [notification, setNotification] = useState({ show: false, message: '', type: 'success' });

  const showNotification = (msg, type = 'success') => {
    setNotification({ show: true, message: msg, type });
    setTimeout(() => setNotification({ show: false, message: '', type: 'success' }), 3000);
  };

  useEffect(() => {
    if (isAdmin) {
      loadAllData();
    }
  }, [isAdmin]);

  const loadAllData = async () => {
    setLoading(true);
    try {
      const [statsRes, prodRes, catRes, newsRes, tmplRes, ordRes, usersRes, secRes] = await Promise.all([
        adminApi.getStats(),
        productsApi.getAll(),
        categoriesApi.getAll(),
        newsApi.getAll({ only_published: false }),
        newsApi.getTemplates(),
        ordersApi.getAllOrders(),
        adminApi.getUsers(),
        adminApi.getSecurityLogs(50),
      ]);

      setStats(statsRes.data);
      setProducts(prodRes.data);
      setCategories(catRes.data);
      setNewsList(newsRes.data);
      setTemplates(tmplRes.data);
      setOrders(ordRes.data);
      setUsersList(usersRes.data);
      setSecurityLogs(secRes.data);
    } catch (err) {
      console.error("Admin ma'lumotlarini yuklashda xatolik:", err);
      showNotification("Ma'lumotlarni yuklashda xatolik!", 'error');
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (amount) => {
    if (!amount) return '0';
    return new Intl.NumberFormat('uz-UZ').format(amount) + " so'm";
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('uz-UZ', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // --- PRODUCT HANDLERS ---
  const handleOpenAddProduct = () => {
    setEditingProduct(null);
    setProductForm({
      title: '',
      description: '',
      category_id: categories.length > 0 ? categories[0].id : 1,
      price: '',
      discount_price: '',
      installment_price: '',
      image_url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=700&q=80',
      stock: 50,
      is_popular: false,
      is_featured: false,
    });
    setProductModalOpen(true);
  };

  const handleOpenEditProduct = (prod) => {
    setEditingProduct(prod);
    setProductForm({
      title: prod.title,
      description: prod.description || '',
      category_id: prod.category_id,
      price: prod.price,
      discount_price: prod.discount_price || '',
      installment_price: prod.installment_price || '',
      image_url: prod.image_url,
      stock: prod.stock,
      is_popular: prod.is_popular,
      is_featured: prod.is_featured,
    });
    setProductModalOpen(true);
  };

  const handleSaveProduct = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...productForm,
        category_id: parseInt(productForm.category_id),
        price: parseFloat(productForm.price),
        discount_price: productForm.discount_price ? parseFloat(productForm.discount_price) : null,
        installment_price: productForm.installment_price ? parseFloat(productForm.installment_price) : null,
        stock: parseInt(productForm.stock),
      };

      if (editingProduct) {
        await productsApi.update(editingProduct.id, payload);
        showNotification("Mahsulot muvaffaqiyatli yangilandi!");
      } else {
        await productsApi.create(payload);
        showNotification("Yangi mahsulot muvaffaqiyatli qo'shildi!");
      }
      setProductModalOpen(false);
      loadAllData();
    } catch (err) {
      showNotification(err.response?.data?.detail || "Xatolik yuz berdi!", 'error');
    }
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm("Haqiqatdan ham ushbu mahsulotni o'chirmoqchimisiz?")) return;
    try {
      await productsApi.delete(id);
      showNotification("Mahsulot o'chirildi!");
      loadAllData();
    } catch (err) {
      showNotification("O'chirishda xatolik!", 'error');
    }
  };

  // --- NEWS & ACTION HANDLERS ---
  const handleOpenAddNews = () => {
    setEditingNews(null);
    setNewsForm({
      title: '',
      summary: '',
      content: '',
      image_url: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=800&q=80',
      tag: 'Aksiya',
      badge_color: 'purple',
      is_published: true,
    });
    setNewsModalOpen(true);
  };

  const handleOpenEditNews = (news) => {
    setEditingNews(news);
    setNewsForm({
      title: news.title,
      summary: news.summary,
      content: news.content,
      image_url: news.image_url,
      tag: news.tag,
      badge_color: news.badge_color,
      is_published: news.is_published,
    });
    setNewsModalOpen(true);
  };

  const handleSaveNews = async (e) => {
    e.preventDefault();
    try {
      if (editingNews) {
        await newsApi.update(editingNews.id, newsForm);
        showNotification("Yangilik muvaffaqiyatli yangilandi!");
      } else {
        await newsApi.create(newsForm);
        showNotification("Yangi yangilik/amal e'lon qilindi!");
      }
      setNewsModalOpen(false);
      loadAllData();
    } catch (err) {
      showNotification(err.response?.data?.detail || "Xatolik yuz berdi!", 'error');
    }
  };

  const handleDeleteNews = async (id) => {
    if (!window.confirm("Ushbu yangilikni o'chirmoqchimisiz?")) return;
    try {
      await newsApi.delete(id);
      showNotification("Yangilik o'chirildi!");
      loadAllData();
    } catch (err) {
      showNotification("O'chirishda xatolik!", 'error');
    }
  };

  // --- TEMPLATE HANDLERS ---
  const handleApplyTemplate = async (template) => {
    try {
      await newsApi.applyTemplate(template.id);
      showNotification(`"${template.title}" shablonidan yangilik muvaffaqiyatli yaratildi!`);
      loadAllData();
      setActiveTab('news');
    } catch (err) {
      showNotification("Shablonni qo'llashda xatolik!", 'error');
    }
  };

  const handleCreateTemplate = async (e) => {
    e.preventDefault();
    try {
      await newsApi.createTemplate(templateForm);
      showNotification("Yangi tayyor shablon muvaffaqiyatli saqlandi!");
      setTemplateModalOpen(false);
      loadAllData();
    } catch (err) {
      showNotification("Shablon yaratishda xatolik!", 'error');
    }
  };

  // --- ORDER STATUS HANDLER ---
  const handleOrderStatusChange = async (orderId, newStatus) => {
    try {
      await ordersApi.updateStatus(orderId, newStatus);
      showNotification(`Buyurtma #${orderId} holati o'zgartirildi!`);
      loadAllData();
    } catch (err) {
      showNotification("Holatni o'zgartirishda xatolik!", 'error');
    }
  };

  const filteredProducts = products.filter((p) =>
    p.title.toLowerCase().includes(productSearch.toLowerCase())
  );

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
        <div className="bg-gray-800 text-white w-full max-w-md rounded-3xl p-8 shadow-2xl border border-red-500/30 text-center space-y-4">
          <div className="w-16 h-16 bg-red-500/20 text-red-400 rounded-full flex items-center justify-center mx-auto border border-red-500/40">
            <ShieldAlert className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold">Xavfsizlik: Kirish Cheklangan</h2>
          <p className="text-xs text-gray-400 leading-relaxed">
            Admin boshqaruv paneliga faqat Super Administrator huquqiga ega hisoblar orqali kirish mumkin.
          </p>
          <button
            onClick={onBackHome}
            className="w-full py-3 bg-[#7000ff] hover:bg-[#6000e6] text-white font-bold rounded-xl text-sm transition"
          >
            Bosh sahifaga qaytish
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0f1117] text-gray-100 flex flex-col md:flex-row">
      {/* Toast Notification */}
      {notification.show && (
        <div className={`fixed top-4 right-4 z-50 px-5 py-3 rounded-2xl shadow-2xl text-sm font-bold flex items-center gap-2 border animate-in slide-in-from-top-5 duration-200 ${
          notification.type === 'error' ? 'bg-red-600 text-white border-red-700' : 'bg-[#7000ff] text-white border-purple-500'
        }`}>
          <Check className="w-4 h-4" />
          <span>{notification.message}</span>
        </div>
      )}

      {/* --- SIDEBAR NAVIGATION --- */}
      <aside className="w-full md:w-72 bg-[#161922] border-r border-gray-800 flex flex-col justify-between flex-shrink-0">
        <div>
          {/* Admin Brand Header */}
          <div className="p-6 border-b border-gray-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#7000ff] to-[#9b42f5] flex items-center justify-center font-black text-xl text-white shadow-lg shadow-purple-600/30">
                u
              </div>
              <div>
                <span className="font-extrabold text-base tracking-tight text-white block">
                  Uzum <span className="text-[#9b6aff]">Admin</span>
                </span>
                <span className="text-[10px] text-green-400 font-semibold flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                  Xavfsiz Tizim
                </span>
              </div>
            </div>
          </div>

          {/* Nav Links */}
          <div className="p-4 space-y-1.5 text-xs font-semibold">
            <button
              onClick={() => setActiveTab('overview')}
              className={`w-full text-left px-4 py-3 rounded-2xl transition flex items-center gap-3 ${
                activeTab === 'overview'
                  ? 'bg-[#7000ff] text-white font-bold shadow-lg shadow-purple-600/30'
                  : 'text-gray-400 hover:bg-gray-800 hover:text-white'
              }`}
            >
              <TrendingUp className="w-4 h-4" />
              <span>Boshqaruv Paneli</span>
            </button>

            <button
              onClick={() => setActiveTab('products')}
              className={`w-full text-left px-4 py-3 rounded-2xl transition flex items-center justify-between ${
                activeTab === 'products'
                  ? 'bg-[#7000ff] text-white font-bold shadow-lg shadow-purple-600/30'
                  : 'text-gray-400 hover:bg-gray-800 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <ShoppingBag className="w-4 h-4" />
                <span>Mahsulotlar Bazasi</span>
              </div>
              <span className="bg-gray-800 px-2 py-0.5 rounded-full text-[10px] text-gray-300">
                {products.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('news')}
              className={`w-full text-left px-4 py-3 rounded-2xl transition flex items-center justify-between ${
                activeTab === 'news'
                  ? 'bg-[#7000ff] text-white font-bold shadow-lg shadow-purple-600/30'
                  : 'text-gray-400 hover:bg-gray-800 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <Newspaper className="w-4 h-4" />
                <span>Yangiliklar & Amallar</span>
              </div>
              <span className="bg-gray-800 px-2 py-0.5 rounded-full text-[10px] text-gray-300">
                {newsList.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('templates')}
              className={`w-full text-left px-4 py-3 rounded-2xl transition flex items-center justify-between ${
                activeTab === 'templates'
                  ? 'bg-[#7000ff] text-white font-bold shadow-lg shadow-purple-600/30'
                  : 'text-gray-400 hover:bg-gray-800 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <Zap className="w-4 h-4 text-yellow-400" />
                <span>Marketing Shablonlari</span>
              </div>
              <span className="bg-yellow-400/20 text-yellow-300 px-2 py-0.5 rounded-full text-[10px] font-bold">
                {templates.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('orders')}
              className={`w-full text-left px-4 py-3 rounded-2xl transition flex items-center justify-between ${
                activeTab === 'orders'
                  ? 'bg-[#7000ff] text-white font-bold shadow-lg shadow-purple-600/30'
                  : 'text-gray-400 hover:bg-gray-800 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <Package className="w-4 h-4" />
                <span>Buyurtmalar</span>
              </div>
              <span className="bg-gray-800 px-2 py-0.5 rounded-full text-[10px] text-gray-300">
                {orders.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('users')}
              className={`w-full text-left px-4 py-3 rounded-2xl transition flex items-center justify-between ${
                activeTab === 'users'
                  ? 'bg-[#7000ff] text-white font-bold shadow-lg shadow-purple-600/30'
                  : 'text-gray-400 hover:bg-gray-800 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <Users className="w-4 h-4" />
                <span>Foydalanuvchilar</span>
              </div>
              <span className="bg-gray-800 px-2 py-0.5 rounded-full text-[10px] text-gray-300">
                {usersList.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('security')}
              className={`w-full text-left px-4 py-3 rounded-2xl transition flex items-center justify-between ${
                activeTab === 'security'
                  ? 'bg-[#7000ff] text-white font-bold shadow-lg shadow-purple-600/30'
                  : 'text-gray-400 hover:bg-gray-800 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <ShieldCheck className="w-4 h-4 text-green-400" />
                <span>Xavfsizlik Jurnali</span>
              </div>
              <span className="bg-green-500/20 text-green-400 px-2 py-0.5 rounded-full text-[10px] font-bold">
                Himoyalangan
              </span>
            </button>
          </div>
        </div>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-gray-800 space-y-2 text-xs">
          <button
            onClick={onBackHome}
            className="w-full py-2.5 px-4 bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white rounded-xl transition flex items-center justify-center gap-2 font-bold"
          >
            <ExternalLink className="w-4 h-4" />
            <span>Do'konga o'tish (Sayt)</span>
          </button>
          <button
            onClick={() => { logout(); onBackHome(); }}
            className="w-full py-2.5 px-4 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-xl transition flex items-center justify-center gap-2 font-bold"
          >
            <LogOut className="w-4 h-4" />
            <span>Chiqish</span>
          </button>
        </div>
      </aside>

      {/* --- MAIN ADMIN CONTENT AREA --- */}
      <main className="flex-1 flex flex-col min-w-0 bg-[#0f1117] overflow-y-auto max-h-screen">
        {/* Admin Topbar */}
        <header className="bg-[#161922] border-b border-gray-800 px-6 py-4 flex flex-wrap items-center justify-between gap-4 sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <div>
              <h2 className="text-lg font-black text-white capitalize">
                {activeTab === 'overview' && "Boshqaruv Paneli & Tahlil"}
                {activeTab === 'products' && "Mahsulotlarni Boshqarish"}
                {activeTab === 'news' && "Yangiliklar va Marketing Aksiyalari"}
                {activeTab === 'templates' && "Tayyor Marketing Shablonlari Dvigateli"}
                {activeTab === 'orders' && "Mijozlar Buyurtmalari"}
                {activeTab === 'users' && "Ro'yxatdan O'tgan Foydalanuvchilar"}
                {activeTab === 'security' && "Xavfsizlik Audit Jurnali"}
              </h2>
              <p className="text-xs text-gray-400">
                Uzum Market 2.0 • Administrator boshqaruv tizimi
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleOpenAddProduct}
              className="px-3.5 py-2 bg-[#7000ff] hover:bg-[#6000e6] text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-lg shadow-purple-600/30 transition"
            >
              <Plus className="w-4 h-4" /> Tovar Qo'shish
            </button>
            <button
              onClick={handleOpenAddNews}
              className="px-3.5 py-2 bg-yellow-400 hover:bg-yellow-500 text-gray-950 rounded-xl text-xs font-black flex items-center gap-1.5 shadow-lg transition"
            >
              <Sparkles className="w-4 h-4" /> Amal Qo'shish
            </button>
          </div>
        </header>

        {/* Content Body */}
        <div className="p-6 space-y-6">

          {/* 1. OVERVIEW VIEW */}
          {activeTab === 'overview' && stats && (
            <div className="space-y-6">
              {/* Stats Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-[#161922] p-5 rounded-3xl border border-gray-800 shadow-sm flex items-center justify-between">
                  <div>
                    <span className="text-xs text-gray-400 font-semibold block">Jami Tushum</span>
                    <span className="text-xl font-black text-green-400 mt-1 block">
                      {formatPrice(stats.total_revenue)}
                    </span>
                  </div>
                  <div className="w-12 h-12 rounded-2xl bg-green-500/10 text-green-400 flex items-center justify-center">
                    <DollarSign className="w-6 h-6" />
                  </div>
                </div>

                <div className="bg-[#161922] p-5 rounded-3xl border border-gray-800 shadow-sm flex items-center justify-between">
                  <div>
                    <span className="text-xs text-gray-400 font-semibold block">Barcha Buyurtmalar</span>
                    <span className="text-2xl font-black text-white mt-1 block">
                      {stats.total_orders} ta
                    </span>
                  </div>
                  <div className="w-12 h-12 rounded-2xl bg-purple-500/10 text-[#9b6aff] flex items-center justify-center">
                    <Package className="w-6 h-6" />
                  </div>
                </div>

                <div className="bg-[#161922] p-5 rounded-3xl border border-gray-800 shadow-sm flex items-center justify-between">
                  <div>
                    <span className="text-xs text-gray-400 font-semibold block">Faol Mahsulotlar</span>
                    <span className="text-2xl font-black text-white mt-1 block">
                      {stats.total_products} ta
                    </span>
                  </div>
                  <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-400 flex items-center justify-center">
                    <ShoppingBag className="w-6 h-6" />
                  </div>
                </div>

                <div className="bg-[#161922] p-5 rounded-3xl border border-gray-800 shadow-sm flex items-center justify-between">
                  <div>
                    <span className="text-xs text-gray-400 font-semibold block">Mijozlar Bazasi</span>
                    <span className="text-2xl font-black text-white mt-1 block">
                      {stats.total_users} ta
                    </span>
                  </div>
                  <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center">
                    <Users className="w-6 h-6" />
                  </div>
                </div>
              </div>

              {/* Fast Action Templates Banner */}
              <div className="bg-gradient-to-r from-purple-950 via-[#27114b] to-[#161922] rounded-3xl p-6 border border-purple-500/30 shadow-2xl">
                <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                  <div>
                    <h3 className="text-lg font-black text-white flex items-center gap-2">
                      <Zap className="w-5 h-5 text-yellow-400" />
                      Tayyor Marketing Shablonlari (1-Klikda Amal Qo'shish)
                    </h3>
                    <p className="text-xs text-purple-200 mt-0.5">
                      Shablonni tanlab, bir zumda Uzum Market sahifasiga yangilik yoki chegirma amalini chiqaring
                    </p>
                  </div>
                  <button
                    onClick={() => setActiveTab('templates')}
                    className="text-xs bg-yellow-400 hover:bg-yellow-500 text-gray-950 font-black px-4 py-2 rounded-xl transition"
                  >
                    Barcha shablonlar ({templates.length}) →
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {templates.slice(0, 3).map((tmpl) => (
                    <div key={tmpl.id} className="bg-black/30 backdrop-blur-md rounded-2xl p-4 border border-white/10 flex flex-col justify-between">
                      <div>
                        <span className="text-[10px] font-black uppercase bg-yellow-400 text-gray-950 px-2 py-0.5 rounded">
                          {tmpl.default_tag}
                        </span>
                        <h4 className="font-bold text-sm text-white mt-2 line-clamp-1">{tmpl.title}</h4>
                        <p className="text-xs text-gray-300 mt-1 line-clamp-2">{tmpl.description}</p>
                      </div>
                      <button
                        onClick={() => handleApplyTemplate(tmpl)}
                        className="mt-3 w-full py-2 bg-[#7000ff] hover:bg-[#6000e6] text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition"
                      >
                        <Zap className="w-3.5 h-3.5 text-yellow-300" />
                        Shablondan e'lon qilish
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Activity: Orders & Security */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Orders */}
                <div className="bg-[#161922] rounded-3xl p-6 border border-gray-800 space-y-4">
                  <div className="flex items-center justify-between border-b border-gray-800 pb-3">
                    <h3 className="font-black text-white text-base">So'nggi Tushgan Buyurtmalar</h3>
                    <button onClick={() => setActiveTab('orders')} className="text-xs text-purple-400 font-bold hover:underline">
                      Barchasi ({orders.length})
                    </button>
                  </div>

                  <div className="space-y-2.5">
                    {orders.slice(0, 4).map((order) => (
                      <div key={order.id} className="p-3 bg-gray-900/60 rounded-2xl flex items-center justify-between text-xs">
                        <div>
                          <div className="font-bold text-white">Buyurtma #{order.id} • {order.customer_name}</div>
                          <div className="text-gray-400 text-[11px] mt-0.5">{order.shipping_address}</div>
                        </div>
                        <div className="text-right">
                          <div className="font-black text-purple-400">{formatPrice(order.total_amount)}</div>
                          <span className="inline-block mt-0.5 px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-500/20 text-purple-300 capitalize">
                            {order.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Security Live Logs */}
                <div className="bg-[#161922] rounded-3xl p-6 border border-gray-800 space-y-4">
                  <div className="flex items-center justify-between border-b border-gray-800 pb-3">
                    <h3 className="font-black text-white text-base flex items-center gap-2">
                      <Activity className="w-4 h-4 text-green-400" />
                      Xavfsizlik Holati (Real-time)
                    </h3>
                    <button onClick={() => setActiveTab('security')} className="text-xs text-purple-400 font-bold hover:underline">
                      Jurnalni ko'rish
                    </button>
                  </div>

                  <div className="space-y-2 text-xs">
                    {securityLogs.slice(0, 4).map((log) => (
                      <div key={log.id} className="p-3 bg-gray-900/60 rounded-2xl flex items-start justify-between gap-3">
                        <div className="space-y-0.5">
                          <span className={`inline-block text-[9px] font-black px-1.5 py-0.5 rounded ${
                            log.status === 'WARNING' ? 'bg-red-500/20 text-red-400' : 'bg-green-500/20 text-green-400'
                          }`}>
                            {log.event_type}
                          </span>
                          <p className="text-gray-300 font-medium text-[11px]">{log.details}</p>
                          <p className="text-gray-500 text-[10px]">IP: {log.ip_address || '127.0.0.1'}</p>
                        </div>
                        <span className="text-gray-500 text-[10px] flex-shrink-0">{formatDate(log.created_at)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 2. PRODUCTS VIEW */}
          {activeTab === 'products' && (
            <div className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3 bg-[#161922] p-4 rounded-3xl border border-gray-800">
                <div className="relative flex-1 max-w-md">
                  <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
                  <input
                    type="text"
                    value={productSearch}
                    onChange={(e) => setProductSearch(e.target.value)}
                    placeholder="Mahsulotlarni nomidan qidirish..."
                    className="w-full pl-10 pr-4 py-2.5 bg-gray-900 border border-gray-700 rounded-xl text-xs text-white focus:outline-none focus:border-purple-500"
                  />
                </div>
                <button
                  onClick={handleOpenAddProduct}
                  className="px-4 py-2.5 bg-[#7000ff] hover:bg-[#6000e6] text-white font-bold rounded-xl text-xs flex items-center gap-2 shadow-lg shadow-purple-600/30 transition"
                >
                  <Plus className="w-4 h-4" /> Yangi Mahsulot Qo'shish
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {filteredProducts.map((prod) => (
                  <div key={prod.id} className="bg-[#161922] rounded-3xl border border-gray-800 p-4 shadow-sm flex flex-col justify-between gap-3 hover:border-purple-500/40 transition">
                    <div>
                      <div className="h-40 bg-gray-900 rounded-2xl p-2 flex items-center justify-center relative overflow-hidden">
                        <img src={prod.image_url} alt={prod.title} className="max-h-full object-contain" />
                        {prod.discount_price && (
                          <span className="absolute top-2 left-2 bg-red-500 text-white text-[10px] font-black px-2 py-0.5 rounded">
                            Chegirma
                          </span>
                        )}
                      </div>
                      <h4 className="font-bold text-xs sm:text-sm text-white line-clamp-2 mt-2">
                        {prod.title}
                      </h4>
                      <div className="mt-1 flex items-baseline gap-2">
                        <span className="text-sm font-black text-white">
                          {formatPrice(prod.discount_price || prod.price)}
                        </span>
                        {prod.discount_price && (
                          <span className="text-xs text-gray-500 line-through">
                            {formatPrice(prod.price)}
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-gray-400 mt-1">Omborda: <strong className="text-white">{prod.stock} dona</strong></p>
                    </div>

                    <div className="flex items-center gap-2 pt-2 border-t border-gray-800">
                      <button
                        onClick={() => handleOpenEditProduct(prod)}
                        className="flex-1 py-1.5 bg-gray-800 hover:bg-gray-700 text-gray-200 rounded-xl text-xs font-bold flex items-center justify-center gap-1 transition"
                      >
                        <Edit3 className="w-3.5 h-3.5" /> Tahrirlash
                      </button>
                      <button
                        onClick={() => handleDeleteProduct(prod.id)}
                        className="p-1.5 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-xl transition"
                        title="O'chirish"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 3. NEWS & ACTIONS VIEW */}
          {activeTab === 'news' && (
            <div className="space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-3 bg-[#161922] p-4 rounded-3xl border border-gray-800">
                <div>
                  <h3 className="font-black text-white text-lg">Yangiliklar va Aksiyalar Ro'yxati</h3>
                  <p className="text-xs text-gray-400">Saytda mijozlarga e'lon qilingan barcha amallar</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setActiveTab('templates')}
                    className="px-3.5 py-2.5 bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 font-bold rounded-xl text-xs flex items-center gap-1.5 transition"
                  >
                    <Zap className="w-4 h-4 text-yellow-400" /> Shablonlardan Tanlash
                  </button>
                  <button
                    onClick={handleOpenAddNews}
                    className="px-4 py-2.5 bg-[#7000ff] hover:bg-[#6000e6] text-white font-bold rounded-xl text-xs flex items-center gap-2 shadow-lg shadow-purple-600/30 transition"
                  >
                    <Plus className="w-4 h-4" /> Yangi Amal Qo'shish
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {newsList.map((item) => (
                  <div key={item.id} className="bg-[#161922] rounded-3xl border border-gray-800 overflow-hidden flex flex-col justify-between hover:border-purple-500/40 transition">
                    <div>
                      <div className="h-44 bg-gray-900 relative">
                        <img src={item.image_url} alt={item.title} className="w-full h-full object-cover" />
                        <span className="absolute top-3 left-3 bg-[#7000ff] text-white text-xs font-black px-2.5 py-0.5 rounded-full shadow">
                          {item.tag}
                        </span>
                      </div>
                      <div className="p-5 space-y-2">
                        <div className="flex items-center justify-between text-xs text-gray-500">
                          <span>{formatDate(item.created_at)}</span>
                          <span className="flex items-center gap-1">
                            <Eye className="w-3.5 h-3.5" /> {item.views_count} ko'rildi
                          </span>
                        </div>
                        <h4 className="font-bold text-sm text-white leading-snug">{item.title}</h4>
                        <p className="text-xs text-gray-400 line-clamp-3">{item.summary}</p>
                      </div>
                    </div>

                    <div className="p-5 pt-0 flex items-center gap-2 border-t border-gray-800 mt-2">
                      <button
                        onClick={() => handleOpenEditNews(item)}
                        className="flex-1 py-2 bg-gray-800 hover:bg-gray-700 text-gray-200 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition"
                      >
                        <Edit3 className="w-3.5 h-3.5" /> Tahrirlash
                      </button>
                      <button
                        onClick={() => handleDeleteNews(item.id)}
                        className="p-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-xl transition"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 4. TEMPLATES VIEW */}
          {activeTab === 'templates' && (
            <div className="space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-3 bg-[#161922] p-5 rounded-3xl border border-gray-800">
                <div>
                  <h3 className="font-black text-white text-lg flex items-center gap-2">
                    <Zap className="w-5 h-5 text-yellow-400" />
                    Tayyor Marketing Shablonlari Dvigateli
                  </h3>
                  <p className="text-xs text-gray-400 mt-0.5">
                    Har qanday aksiyani qayta-qayta yozib o'tirmasdan, 1 tugma bilan saytga chiqaring!
                  </p>
                </div>
                <button
                  onClick={() => {
                    setTemplateForm({
                      title: '',
                      category_type: 'chegirma',
                      default_tag: 'Aksiya',
                      badge_color: 'purple',
                      description: '',
                      default_content: '',
                      image_url: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=800&q=80',
                    });
                    setTemplateModalOpen(true);
                  }}
                  className="px-4 py-2.5 bg-yellow-400 hover:bg-yellow-500 text-gray-950 font-black rounded-xl text-xs flex items-center gap-2 shadow-lg transition"
                >
                  <Plus className="w-4 h-4" /> Yangi Shablon Yaratish
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {templates.map((tmpl) => (
                  <div key={tmpl.id} className="bg-[#161922] rounded-3xl border border-gray-800 hover:border-purple-500/50 shadow-xl overflow-hidden flex flex-col justify-between transition duration-200">
                    <div>
                      <div className="h-44 bg-gray-900 relative">
                        <img src={tmpl.image_url} alt={tmpl.title} className="w-full h-full object-cover" />
                        <span className="absolute top-3 left-3 bg-yellow-400 text-gray-950 text-xs font-black px-2.5 py-0.5 rounded-md shadow">
                          {tmpl.default_tag}
                        </span>
                      </div>

                      <div className="p-5 space-y-2">
                        <span className="text-[10px] font-bold text-purple-400 uppercase tracking-wider bg-purple-500/10 px-2 py-0.5 rounded">
                          Toifa: {tmpl.category_type}
                        </span>
                        <h4 className="font-extrabold text-base text-white leading-snug">
                          {tmpl.title}
                        </h4>
                        <p className="text-xs text-gray-400 leading-relaxed line-clamp-3">
                          {tmpl.description}
                        </p>
                      </div>
                    </div>

                    <div className="p-5 pt-0">
                      <button
                        onClick={() => handleApplyTemplate(tmpl)}
                        className="w-full py-3 bg-[#7000ff] hover:bg-[#6000e6] text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg shadow-purple-600/30 transition"
                      >
                        <Zap className="w-4 h-4 text-yellow-300" />
                        Shablondan Amal Qo'shish (1-Klikda)
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 5. ORDERS VIEW */}
          {activeTab === 'orders' && (
            <div className="space-y-4">
              <div className="bg-[#161922] p-4 rounded-3xl border border-gray-800">
                <h3 className="font-black text-white text-lg">Mijozlar Buyurtmalari Boshqaruvi</h3>
                <p className="text-xs text-gray-400">Buyurtmalar holatini belgilang va jo'natishni nazorat qiling</p>
              </div>

              <div className="space-y-4">
                {orders.map((order) => (
                  <div key={order.id} className="bg-[#161922] rounded-3xl border border-gray-800 p-6 shadow-sm space-y-4">
                    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-800 pb-3">
                      <div>
                        <span className="text-base font-black text-white">Buyurtma #{order.id}</span>
                        <p className="text-xs text-gray-500 mt-0.5">{formatDate(order.created_at)}</p>
                      </div>

                      {/* Status dropdown */}
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-400 font-semibold">Holati:</span>
                        <select
                          value={order.status}
                          onChange={(e) => handleOrderStatusChange(order.id, e.target.value)}
                          className="bg-gray-900 border border-purple-500/40 text-xs font-bold text-purple-300 py-1.5 px-3 rounded-xl focus:outline-none focus:border-purple-500"
                        >
                          <option value="kutilmoqda">Kutilmoqda</option>
                          <option value="yetkazilmoqda">Yetkazilmoqda</option>
                          <option value="yetkazildi">Yetkazildi</option>
                          <option value="bekor_qilindi">Bekor qilindi</option>
                        </select>
                      </div>
                    </div>

                    {/* Customer info */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs bg-gray-900/70 p-3 rounded-2xl text-gray-300 border border-gray-800">
                      <div>Mijoz: <strong className="text-white">{order.customer_name}</strong></div>
                      <div>Telefon: <strong className="text-white">{order.customer_phone}</strong></div>
                      <div>To'lov: <strong className="text-white capitalize">{order.payment_method}</strong></div>
                      <div className="sm:col-span-3">Manzil: <strong className="text-white">{order.shipping_address}</strong></div>
                    </div>

                    {/* Order items */}
                    <div className="space-y-2">
                      {order.items.map((it) => (
                        <div key={it.id} className="flex items-center justify-between text-xs py-1 text-gray-300">
                          <span>{it.title} × {it.quantity} dona</span>
                          <span className="font-bold text-white">{formatPrice(it.price * it.quantity)}</span>
                        </div>
                      ))}
                      <div className="flex justify-between text-sm font-black text-purple-400 border-t border-gray-800 pt-2">
                        <span>Jami summa:</span>
                        <span>{formatPrice(order.total_amount)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 6. USERS VIEW */}
          {activeTab === 'users' && (
            <div className="space-y-4">
              <div className="bg-[#161922] p-4 rounded-3xl border border-gray-800">
                <h3 className="font-black text-white text-lg">Foydalanuvchilar Ro'yxati</h3>
                <p className="text-xs text-gray-400">Tizimda ro'yxatdan o'tgan barcha akkauntlar</p>
              </div>

              <div className="bg-[#161922] rounded-3xl border border-gray-800 overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="text-gray-400 uppercase border-b border-gray-800 bg-gray-900/50">
                      <th className="p-4 font-semibold">ID</th>
                      <th className="p-4 font-semibold">Username</th>
                      <th className="p-4 font-semibold">Email</th>
                      <th className="p-4 font-semibold">Roli</th>
                      <th className="p-4 font-semibold">Ro'yxatdan o'tgan sana</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-800 text-gray-300">
                    {usersList.map((u) => (
                      <tr key={u.id} className="hover:bg-gray-800/50 transition">
                        <td className="p-4 font-bold text-white">#{u.id}</td>
                        <td className="p-4 font-bold text-purple-300">{u.username}</td>
                        <td className="p-4 text-gray-400">{u.email}</td>
                        <td className="p-4">
                          {u.is_admin ? (
                            <span className="bg-purple-500/20 text-purple-300 font-bold px-2.5 py-1 rounded-full text-[10px] border border-purple-500/30">
                              SUPER ADMIN
                            </span>
                          ) : (
                            <span className="bg-gray-800 text-gray-300 font-medium px-2 py-0.5 rounded-full text-[10px]">
                              Mijoz
                            </span>
                          )}
                        </td>
                        <td className="p-4 text-gray-500">{formatDate(u.created_at)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* 7. SECURITY LOGS VIEW */}
          {activeTab === 'security' && (
            <div className="space-y-4">
              <div className="bg-[#161922] p-4 rounded-3xl border border-gray-800 flex items-center justify-between">
                <div>
                  <h3 className="font-black text-white text-lg flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-green-400" />
                    Xavfsizlik va Kirish Jurnali (Audit Logs)
                  </h3>
                  <p className="text-xs text-gray-400">Brute-force urinishlar, kirishlar va admin amallari</p>
                </div>
                <span className="bg-green-500/20 text-green-400 text-xs font-bold px-3 py-1 rounded-full border border-green-500/30">
                  Rate Limiting Faol
                </span>
              </div>

              <div className="bg-[#161922] rounded-3xl border border-gray-800 overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="text-gray-400 uppercase border-b border-gray-800 bg-gray-900/50">
                      <th className="p-4 font-semibold">Vaqt</th>
                      <th className="p-4 font-semibold">Hodisa</th>
                      <th className="p-4 font-semibold">Foydalanuvchi</th>
                      <th className="p-4 font-semibold">IP Manzil</th>
                      <th className="p-4 font-semibold">Batafsil Tafsilot</th>
                      <th className="p-4 font-semibold">Holat</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-800 text-gray-300">
                    {securityLogs.map((log) => (
                      <tr key={log.id} className="hover:bg-gray-800/50 transition">
                        <td className="p-4 text-gray-500 whitespace-nowrap">{formatDate(log.created_at)}</td>
                        <td className="p-4 font-bold text-white">{log.event_type}</td>
                        <td className="p-4 font-semibold text-purple-300">{log.username || '—'}</td>
                        <td className="p-4 font-mono text-gray-400">{log.ip_address || '127.0.0.1'}</td>
                        <td className="p-4 text-gray-300">{log.details}</td>
                        <td className="p-4">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            log.status === 'WARNING' ? 'bg-red-500/20 text-red-400' : 'bg-green-500/20 text-green-400'
                          }`}>
                            {log.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

        </div>
      </main>

      {/* --- PRODUCT CREATE / EDIT MODAL --- */}
      {productModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#161922] text-white w-full max-w-xl rounded-3xl border border-gray-800 shadow-2xl p-6 sm:p-8 relative my-auto max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setProductModalOpen(false)} className="absolute top-4 right-4 text-gray-400 hover:text-white p-2">
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-lg font-black text-white mb-4">
              {editingProduct ? "Mahsulotni Tahrirlash" : "Yangi Mahsulot Qo'shish"}
            </h3>

            <form onSubmit={handleSaveProduct} className="space-y-3.5 text-xs">
              <div>
                <label className="font-semibold text-gray-300 block mb-1">Nomi *</label>
                <input
                  type="text"
                  value={productForm.title}
                  onChange={(e) => setProductForm({ ...productForm, title: e.target.value })}
                  placeholder="Masalan: Samsung Galaxy S24 Ultra 256GB"
                  required
                  className="w-full p-2.5 bg-gray-900 border border-gray-700 rounded-xl focus:border-purple-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-gray-300 block mb-1">Kategoriya</label>
                  <select
                    value={productForm.category_id}
                    onChange={(e) => setProductForm({ ...productForm, category_id: e.target.value })}
                    className="w-full p-2.5 bg-gray-900 border border-gray-700 rounded-xl focus:border-purple-500 focus:outline-none text-white"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="font-semibold text-gray-300 block mb-1">Ombordagi soni</label>
                  <input
                    type="number"
                    value={productForm.stock}
                    onChange={(e) => setProductForm({ ...productForm, stock: e.target.value })}
                    className="w-full p-2.5 bg-gray-900 border border-gray-700 rounded-xl focus:border-purple-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="font-semibold text-gray-300 block mb-1">Asosiy Narxi (so'm) *</label>
                  <input
                    type="number"
                    value={productForm.price}
                    onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                    placeholder="12000000"
                    required
                    className="w-full p-2.5 bg-gray-900 border border-gray-700 rounded-xl focus:border-purple-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="font-semibold text-gray-300 block mb-1">Chegirma Narxi</label>
                  <input
                    type="number"
                    value={productForm.discount_price}
                    onChange={(e) => setProductForm({ ...productForm, discount_price: e.target.value })}
                    placeholder="10500000"
                    className="w-full p-2.5 bg-gray-900 border border-gray-700 rounded-xl focus:border-purple-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="font-semibold text-gray-300 block mb-1">Oylik To'lov (oyiga)</label>
                  <input
                    type="number"
                    value={productForm.installment_price}
                    onChange={(e) => setProductForm({ ...productForm, installment_price: e.target.value })}
                    placeholder="980000"
                    className="w-full p-2.5 bg-gray-900 border border-gray-700 rounded-xl focus:border-purple-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-gray-300 block mb-1">Rasm URL manzili *</label>
                <input
                  type="url"
                  value={productForm.image_url}
                  onChange={(e) => setProductForm({ ...productForm, image_url: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                  required
                  className="w-full p-2.5 bg-gray-900 border border-gray-700 rounded-xl focus:border-purple-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="font-semibold text-gray-300 block mb-1">Tavsif</label>
                <textarea
                  value={productForm.description}
                  onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                  rows={3}
                  className="w-full p-2.5 bg-gray-900 border border-gray-700 rounded-xl focus:border-purple-500 focus:outline-none resize-none"
                />
              </div>

              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer text-gray-300">
                  <input
                    type="checkbox"
                    checked={productForm.is_popular}
                    onChange={(e) => setProductForm({ ...productForm, is_popular: e.target.checked })}
                    className="rounded text-purple-600 w-4 h-4"
                  />
                  <span>Ommabop mahsulot (Eng ko'p sotilgan)</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer text-gray-300">
                  <input
                    type="checkbox"
                    checked={productForm.is_featured}
                    onChange={(e) => setProductForm({ ...productForm, is_featured: e.target.checked })}
                    className="rounded text-purple-600 w-4 h-4"
                  />
                  <span>Tavsiya etilgan</span>
                </label>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-[#7000ff] hover:bg-[#6000e6] text-white font-bold rounded-xl text-sm shadow-lg shadow-purple-600/30 transition mt-4"
              >
                {editingProduct ? "O'zgarishlarni Saqlash" : "Mahsulotni Yaratish"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* --- NEWS & ACTION MODAL --- */}
      {newsModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#161922] text-white w-full max-w-xl rounded-3xl border border-gray-800 shadow-2xl p-6 sm:p-8 relative my-auto max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setNewsModalOpen(false)} className="absolute top-4 right-4 text-gray-400 hover:text-white p-2">
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-lg font-black text-white mb-4">
              {editingNews ? "Amal/Yangilikni Tahrirlash" : "Yangi Amal / Yangilik Qo'shish"}
            </h3>

            <form onSubmit={handleSaveNews} className="space-y-3.5 text-xs">
              <div>
                <label className="font-semibold text-gray-300 block mb-1">Sarlavha (Title) *</label>
                <input
                  type="text"
                  value={newsForm.title}
                  onChange={(e) => setNewsForm({ ...newsForm, title: e.target.value })}
                  placeholder="Masalan: Hafta Chegirmalari - Barcha texnikaga 40%"
                  required
                  className="w-full p-2.5 bg-gray-900 border border-gray-700 rounded-xl focus:border-purple-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-gray-300 block mb-1">Teg (Tag)</label>
                  <select
                    value={newsForm.tag}
                    onChange={(e) => setNewsForm({ ...newsForm, tag: e.target.value })}
                    className="w-full p-2.5 bg-gray-900 border border-gray-700 rounded-xl focus:border-purple-500 focus:outline-none text-white"
                  >
                    <option value="Aksiya">Aksiya</option>
                    <option value="Chegirma">Chegirma</option>
                    <option value="Nasiya 0%">Nasiya 0%</option>
                    <option value="Yangi">Yangi</option>
                    <option value="Muhim">Muhim</option>
                  </select>
                </div>
                <div>
                  <label className="font-semibold text-gray-300 block mb-1">Rasm URL manzili *</label>
                  <input
                    type="url"
                    value={newsForm.image_url}
                    onChange={(e) => setNewsForm({ ...newsForm, image_url: e.target.value })}
                    required
                    className="w-full p-2.5 bg-gray-900 border border-gray-700 rounded-xl focus:border-purple-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-gray-300 block mb-1">Qisqacha mazmuni (Summary) *</label>
                <input
                  type="text"
                  value={newsForm.summary}
                  onChange={(e) => setNewsForm({ ...newsForm, summary: e.target.value })}
                  placeholder="Foydalanuvchilar kartochkada ko'radigan qisqa matn"
                  required
                  className="w-full p-2.5 bg-gray-900 border border-gray-700 rounded-xl focus:border-purple-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="font-semibold text-gray-300 block mb-1">Batafsil matn (Content) *</label>
                <textarea
                  value={newsForm.content}
                  onChange={(e) => setNewsForm({ ...newsForm, content: e.target.value })}
                  rows={4}
                  placeholder="Aksiya yoki yangilik shartlari haqida to'liq ma'lumot..."
                  required
                  className="w-full p-2.5 bg-gray-900 border border-gray-700 rounded-xl focus:border-purple-500 focus:outline-none resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-[#7000ff] hover:bg-[#6000e6] text-white font-bold rounded-xl text-sm shadow-lg shadow-purple-600/30 transition mt-4"
              >
                {editingNews ? "O'zgarishlarni Saqlash" : "E'lon Qilish"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* --- CREATE ACTION TEMPLATE MODAL --- */}
      {templateModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#161922] text-white w-full max-w-xl rounded-3xl border border-gray-800 shadow-2xl p-6 sm:p-8 relative my-auto max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setTemplateModalOpen(false)} className="absolute top-4 right-4 text-gray-400 hover:text-white p-2">
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-lg font-black text-white mb-4 flex items-center gap-2">
              <Zap className="w-5 h-5 text-yellow-400" />
              Yangi Marketing Shabloni Yaratish
            </h3>

            <form onSubmit={handleCreateTemplate} className="space-y-3.5 text-xs">
              <div>
                <label className="font-semibold text-gray-300 block mb-1">Shablon Sarlavhasi *</label>
                <input
                  type="text"
                  value={templateForm.title}
                  onChange={(e) => setTemplateForm({ ...templateForm, title: e.target.value })}
                  placeholder="Masalan: Bayram Chegirmalari Shablon"
                  required
                  className="w-full p-2.5 bg-gray-900 border border-gray-700 rounded-xl focus:border-purple-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-gray-300 block mb-1">Toifasi</label>
                  <select
                    value={templateForm.category_type}
                    onChange={(e) => setTemplateForm({ ...templateForm, category_type: e.target.value })}
                    className="w-full p-2.5 bg-gray-900 border border-gray-700 rounded-xl focus:border-purple-500 focus:outline-none text-white"
                  >
                    <option value="chegirma">Chegirma</option>
                    <option value="elektronika">Elektronika</option>
                    <option value="mavsumiy">Mavsumiy</option>
                    <option value="bayram">Bayram</option>
                    <option value="haftalik">Haftalik</option>
                  </select>
                </div>
                <div>
                  <label className="font-semibold text-gray-300 block mb-1">Teg</label>
                  <input
                    type="text"
                    value={templateForm.default_tag}
                    onChange={(e) => setTemplateForm({ ...templateForm, default_tag: e.target.value })}
                    placeholder="Aksiya"
                    className="w-full p-2.5 bg-gray-900 border border-gray-700 rounded-xl focus:border-purple-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-gray-300 block mb-1">Rasm URL *</label>
                <input
                  type="url"
                  value={templateForm.image_url}
                  onChange={(e) => setTemplateForm({ ...templateForm, image_url: e.target.value })}
                  required
                  className="w-full p-2.5 bg-gray-900 border border-gray-700 rounded-xl focus:border-purple-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="font-semibold text-gray-300 block mb-1">Tavsif *</label>
                <input
                  type="text"
                  value={templateForm.description}
                  onChange={(e) => setTemplateForm({ ...templateForm, description: e.target.value })}
                  placeholder="Shablon haqida qisqacha ma'lumot"
                  required
                  className="w-full p-2.5 bg-gray-900 border border-gray-700 rounded-xl focus:border-purple-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="font-semibold text-gray-300 block mb-1">Standart Matn (Default Content) *</label>
                <textarea
                  value={templateForm.default_content}
                  onChange={(e) => setTemplateForm({ ...templateForm, default_content: e.target.value })}
                  rows={3}
                  required
                  className="w-full p-2.5 bg-gray-900 border border-gray-700 rounded-xl focus:border-purple-500 focus:outline-none resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-yellow-400 hover:bg-yellow-500 text-gray-950 font-black rounded-xl text-sm shadow-lg transition mt-4"
              >
                Shablonni Saqlash
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
