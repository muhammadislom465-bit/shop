import React, { useState, useEffect } from 'react';
import {
  User, Mail, Calendar, ShoppingBag, Star, MapPin, Plus, Edit3, Trash2,
  Lock, Eye, EyeOff, ChevronRight, Package, Heart, Shield, Save, X, Check,
  Phone, Home, Building, AlertCircle
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { profileApi } from '../services/api';

export const ProfilePage = ({ onContinueShopping, onGoToOrders }) => {
  const { user, token } = useAuth();
  const [activeSection, setActiveSection] = useState('info'); // 'info', 'addresses', 'password', 'reviews'
  const [stats, setStats] = useState(null);
  const [addresses, setAddresses] = useState([]);
  const [myReviews, setMyReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Password change state
  const [passwordForm, setPasswordForm] = useState({ current_password: '', new_password: '', confirm_password: '' });
  const [showCurrentPass, setShowCurrentPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [passwordMessage, setPasswordMessage] = useState({ text: '', type: '' });

  // Address form state
  const [addressModalOpen, setAddressModalOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [addressForm, setAddressForm] = useState({
    title: 'Uy', full_name: '', phone: '', region: '', district: '', street_address: '', postal_code: '', is_default: false
  });

  const [notification, setNotification] = useState({ show: false, message: '', type: 'success' });
  const showNotification = (msg, type = 'success') => {
    setNotification({ show: true, message: msg, type });
    setTimeout(() => setNotification({ show: false, message: '', type: 'success' }), 3000);
  };

  useEffect(() => {
    if (token) loadProfileData();
  }, [token]);

  const loadProfileData = async () => {
    setLoading(true);
    try {
      const [statsRes, addressesRes, reviewsRes] = await Promise.all([
        profileApi.getStats(),
        profileApi.getAddresses(),
        profileApi.getMyReviews()
      ]);
      setStats(statsRes.data);
      setAddresses(addressesRes.data);
      setMyReviews(reviewsRes.data);
    } catch (err) {
      console.error('Profil ma\'lumotlarini yuklashda xatolik:', err);
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (passwordForm.new_password !== passwordForm.confirm_password) {
      setPasswordMessage({ text: 'Yangi parollar mos kelmaydi!', type: 'error' });
      return;
    }
    if (passwordForm.new_password.length < 6) {
      setPasswordMessage({ text: 'Yangi parol kamida 6 ta belgidan iborat bo\'lishi kerak.', type: 'error' });
      return;
    }
    try {
      await profileApi.changePassword({
        current_password: passwordForm.current_password,
        new_password: passwordForm.new_password
      });
      setPasswordMessage({ text: 'Parol muvaffaqiyatli o\'zgartirildi!', type: 'success' });
      setPasswordForm({ current_password: '', new_password: '', confirm_password: '' });
    } catch (err) {
      setPasswordMessage({ text: err.response?.data?.detail || 'Xatolik yuz berdi.', type: 'error' });
    }
  };

  const handleSaveAddress = async (e) => {
    e.preventDefault();
    try {
      if (editingAddress) {
        await profileApi.updateAddress(editingAddress.id, addressForm);
        showNotification('Manzil yangilandi!');
      } else {
        await profileApi.createAddress(addressForm);
        showNotification('Yangi manzil qo\'shildi!');
      }
      setAddressModalOpen(false);
      loadProfileData();
    } catch (err) {
      showNotification(err.response?.data?.detail || 'Xatolik yuz berdi!', 'error');
    }
  };

  const handleDeleteAddress = async (id) => {
    if (!window.confirm('Manzilni o\'chirmoqchimisiz?')) return;
    try {
      await profileApi.deleteAddress(id);
      showNotification('Manzil o\'chirildi.');
      loadProfileData();
    } catch (err) {
      showNotification('O\'chirishda xatolik!', 'error');
    }
  };

  const formatPrice = (amount) => {
    if (!amount) return '0';
    return new Intl.NumberFormat('uz-UZ').format(amount) + " so'm";
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString('uz-UZ', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  if (!token || !user) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <User className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h2 className="text-xl font-bold text-gray-800 mb-2">Profilga kirish</h2>
        <p className="text-sm text-gray-500 mb-6">Profilni ko'rish uchun tizimga kiring.</p>
        <button onClick={onContinueShopping} className="px-6 py-3 bg-[#7000ff] text-white font-bold rounded-xl hover:bg-[#6000e6] transition">
          Bosh sahifaga qaytish
        </button>
      </div>
    );
  }

  const sections = [
    { id: 'info', label: 'Profil Ma\'lumotlari', icon: User },
    { id: 'addresses', label: 'Manzillarim', icon: MapPin },
    { id: 'password', label: 'Parolni O\'zgartirish', icon: Lock },
    { id: 'reviews', label: 'Sharhlarim', icon: Star },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Notification Toast */}
      {notification.show && (
        <div className={`fixed top-4 right-4 z-50 px-5 py-3 rounded-2xl shadow-2xl text-sm font-bold flex items-center gap-2 border ${
          notification.type === 'error' ? 'bg-red-500 text-white border-red-600' : 'bg-[#7000ff] text-white border-purple-500'
        }`}>
          <Check className="w-4 h-4" />
          <span>{notification.message}</span>
        </div>
      )}

      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-black text-gray-900">Mening Profilim</h1>
        <p className="text-sm text-gray-500 mt-1">Shaxsiy ma'lumotlaringiz va sozlamalar</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 space-y-6">
            {/* Avatar */}
            <div className="text-center">
              <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-[#7000ff] to-[#9b42f5] flex items-center justify-center text-white text-3xl font-black mx-auto shadow-lg">
                {user.username?.charAt(0).toUpperCase()}
              </div>
              <h3 className="font-bold text-gray-900 mt-3">{user.username}</h3>
              <p className="text-xs text-gray-500">{user.email}</p>
              {user.is_admin && (
                <span className="inline-block mt-2 text-[10px] font-bold bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full">
                  <Shield className="w-3 h-3 inline mr-1" />Administrator
                </span>
              )}
            </div>

            {/* Stats */}
            {stats && (
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-purple-50 rounded-2xl p-3 text-center">
                  <ShoppingBag className="w-5 h-5 text-[#7000ff] mx-auto" />
                  <p className="text-lg font-black text-gray-900 mt-1">{stats.total_orders}</p>
                  <p className="text-[10px] text-gray-500">Buyurtmalar</p>
                </div>
                <div className="bg-green-50 rounded-2xl p-3 text-center">
                  <Star className="w-5 h-5 text-green-600 mx-auto" />
                  <p className="text-lg font-black text-gray-900 mt-1">{stats.total_reviews}</p>
                  <p className="text-[10px] text-gray-500">Sharhlar</p>
                </div>
              </div>
            )}

            {/* Nav */}
            <div className="space-y-1.5">
              {sections.map((s) => (
                <button
                  key={s.id}
                  onClick={() => setActiveSection(s.id)}
                  className={`w-full text-left px-4 py-3 rounded-2xl text-xs font-semibold flex items-center gap-3 transition ${
                    activeSection === s.id
                      ? 'bg-[#7000ff] text-white shadow-lg shadow-purple-200'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <s.icon className="w-4 h-4" />
                  <span>{s.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3">
          {/* INFO SECTION */}
          {activeSection === 'info' && (
            <div className="space-y-6">
              <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <User className="w-5 h-5 text-[#7000ff]" /> Asosiy Ma'lumotlar
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-gray-50 rounded-2xl p-4">
                    <span className="text-xs text-gray-500 block mb-1">Foydalanuvchi nomi</span>
                    <span className="text-sm font-bold text-gray-900 flex items-center gap-2">
                      <User className="w-4 h-4 text-[#7000ff]" /> {user.username}
                    </span>
                  </div>
                  <div className="bg-gray-50 rounded-2xl p-4">
                    <span className="text-xs text-gray-500 block mb-1">Email</span>
                    <span className="text-sm font-bold text-gray-900 flex items-center gap-2">
                      <Mail className="w-4 h-4 text-[#7000ff]" /> {user.email}
                    </span>
                  </div>
                  <div className="bg-gray-50 rounded-2xl p-4">
                    <span className="text-xs text-gray-500 block mb-1">A'zo bo'lgan sana</span>
                    <span className="text-sm font-bold text-gray-900 flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-[#7000ff]" /> {formatDate(stats?.member_since || user.created_at)}
                    </span>
                  </div>
                  <div className="bg-gray-50 rounded-2xl p-4">
                    <span className="text-xs text-gray-500 block mb-1">Jami sarflagan</span>
                    <span className="text-sm font-bold text-green-600 flex items-center gap-2">
                      <ShoppingBag className="w-4 h-4" /> {formatPrice(stats?.total_spent)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button onClick={onGoToOrders} className="bg-white rounded-3xl shadow-sm border border-gray-100 p-5 text-left hover:border-purple-200 transition group">
                  <Package className="w-8 h-8 text-[#7000ff] mb-2" />
                  <h4 className="font-bold text-sm text-gray-900">Buyurtmalarim</h4>
                  <p className="text-xs text-gray-500 mt-1">Barcha buyurtmalarni ko'rish</p>
                  <ChevronRight className="w-4 h-4 text-gray-400 mt-2 group-hover:text-[#7000ff] transition" />
                </button>
                <button onClick={() => setActiveSection('addresses')} className="bg-white rounded-3xl shadow-sm border border-gray-100 p-5 text-left hover:border-purple-200 transition group">
                  <MapPin className="w-8 h-8 text-[#7000ff] mb-2" />
                  <h4 className="font-bold text-sm text-gray-900">Manzillarim</h4>
                  <p className="text-xs text-gray-500 mt-1">{addresses.length} ta saqlangan manzil</p>
                  <ChevronRight className="w-4 h-4 text-gray-400 mt-2 group-hover:text-[#7000ff] transition" />
                </button>
                <button onClick={() => setActiveSection('password')} className="bg-white rounded-3xl shadow-sm border border-gray-100 p-5 text-left hover:border-purple-200 transition group">
                  <Lock className="w-8 h-8 text-[#7000ff] mb-2" />
                  <h4 className="font-bold text-sm text-gray-900">Xavfsizlik</h4>
                  <p className="text-xs text-gray-500 mt-1">Parolni o'zgartirish</p>
                  <ChevronRight className="w-4 h-4 text-gray-400 mt-2 group-hover:text-[#7000ff] transition" />
                </button>
              </div>
            </div>
          )}

          {/* ADDRESSES SECTION */}
          {activeSection === 'addresses' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-gray-900">Yetkazib berish manzillari</h3>
                <button
                  onClick={() => {
                    setEditingAddress(null);
                    setAddressForm({ title: 'Uy', full_name: '', phone: '', region: '', district: '', street_address: '', postal_code: '', is_default: false });
                    setAddressModalOpen(true);
                  }}
                  className="px-4 py-2 bg-[#7000ff] text-white text-xs font-bold rounded-xl hover:bg-[#6000e6] transition flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" /> Yangi manzil
                </button>
              </div>

              {addresses.length === 0 ? (
                <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-12 text-center">
                  <MapPin className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <h4 className="font-bold text-gray-800">Manzillar yo'q</h4>
                  <p className="text-xs text-gray-500 mt-1">Yetkazib berish manzillarini qo'shing</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {addresses.map((addr) => (
                    <div key={addr.id} className={`bg-white rounded-3xl shadow-sm border p-5 ${
                      addr.is_default ? 'border-purple-300 ring-2 ring-purple-100' : 'border-gray-100'
                    }`}>
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          {addr.title === 'Uy' ? <Home className="w-4 h-4 text-[#7000ff]" /> : <Building className="w-4 h-4 text-[#7000ff]" />}
                          <span className="font-bold text-sm text-gray-900">{addr.title}</span>
                          {addr.is_default && (
                            <span className="text-[10px] bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full font-bold">Asosiy</span>
                          )}
                        </div>
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => {
                              setEditingAddress(addr);
                              setAddressForm({
                                title: addr.title, full_name: addr.full_name, phone: addr.phone,
                                region: addr.region, district: addr.district, street_address: addr.street_address,
                                postal_code: addr.postal_code || '', is_default: addr.is_default
                              });
                              setAddressModalOpen(true);
                            }}
                            className="p-1.5 text-gray-400 hover:text-[#7000ff] transition"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button onClick={() => handleDeleteAddress(addr.id)} className="p-1.5 text-gray-400 hover:text-red-500 transition">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      <div className="space-y-1 text-xs text-gray-600">
                        <p className="font-semibold text-gray-800">{addr.full_name}</p>
                        <p className="flex items-center gap-1"><Phone className="w-3 h-3" /> {addr.phone}</p>
                        <p>{addr.region}, {addr.district}</p>
                        <p>{addr.street_address}</p>
                        {addr.postal_code && <p>Pochta indeksi: {addr.postal_code}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Address Modal */}
              {addressModalOpen && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setAddressModalOpen(false)}>
                  <div className="bg-white rounded-3xl w-full max-w-lg p-6 shadow-2xl" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center justify-between mb-5">
                      <h3 className="font-bold text-lg">{editingAddress ? 'Manzilni tahrirlash' : 'Yangi manzil qo\'shish'}</h3>
                      <button onClick={() => setAddressModalOpen(false)} className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
                    </div>
                    <form onSubmit={handleSaveAddress} className="space-y-3">
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="text-xs font-semibold text-gray-600 mb-1 block">Nomi</label>
                          <select value={addressForm.title} onChange={(e) => setAddressForm({...addressForm, title: e.target.value})} className="w-full p-2.5 border rounded-xl text-sm focus:outline-none focus:border-[#7000ff]">
                            <option value="Uy">Uy</option>
                            <option value="Ofis">Ofis</option>
                            <option value="Boshqa">Boshqa</option>
                          </select>
                        </div>
                        <div>
                          <label className="text-xs font-semibold text-gray-600 mb-1 block">To'liq ism</label>
                          <input type="text" required value={addressForm.full_name} onChange={(e) => setAddressForm({...addressForm, full_name: e.target.value})} className="w-full p-2.5 border rounded-xl text-sm focus:outline-none focus:border-[#7000ff]" placeholder="Ism Familiya" />
                        </div>
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-gray-600 mb-1 block">Telefon raqam</label>
                        <input type="tel" required value={addressForm.phone} onChange={(e) => setAddressForm({...addressForm, phone: e.target.value})} className="w-full p-2.5 border rounded-xl text-sm focus:outline-none focus:border-[#7000ff]" placeholder="+998 90 123 45 67" />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="text-xs font-semibold text-gray-600 mb-1 block">Viloyat</label>
                          <input type="text" required value={addressForm.region} onChange={(e) => setAddressForm({...addressForm, region: e.target.value})} className="w-full p-2.5 border rounded-xl text-sm focus:outline-none focus:border-[#7000ff]" placeholder="Toshkent" />
                        </div>
                        <div>
                          <label className="text-xs font-semibold text-gray-600 mb-1 block">Tuman</label>
                          <input type="text" required value={addressForm.district} onChange={(e) => setAddressForm({...addressForm, district: e.target.value})} className="w-full p-2.5 border rounded-xl text-sm focus:outline-none focus:border-[#7000ff]" placeholder="Yunusobod" />
                        </div>
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-gray-600 mb-1 block">Ko'cha manzili</label>
                        <input type="text" required value={addressForm.street_address} onChange={(e) => setAddressForm({...addressForm, street_address: e.target.value})} className="w-full p-2.5 border rounded-xl text-sm focus:outline-none focus:border-[#7000ff]" placeholder="Amir Temur ko'chasi, 15-uy" />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="text-xs font-semibold text-gray-600 mb-1 block">Pochta indeksi</label>
                          <input type="text" value={addressForm.postal_code} onChange={(e) => setAddressForm({...addressForm, postal_code: e.target.value})} className="w-full p-2.5 border rounded-xl text-sm focus:outline-none focus:border-[#7000ff]" placeholder="100000" />
                        </div>
                        <div className="flex items-end">
                          <label className="flex items-center gap-2 cursor-pointer p-2.5">
                            <input type="checkbox" checked={addressForm.is_default} onChange={(e) => setAddressForm({...addressForm, is_default: e.target.checked})} className="rounded" />
                            <span className="text-xs font-semibold text-gray-700">Asosiy manzil</span>
                          </label>
                        </div>
                      </div>
                      <button type="submit" className="w-full py-3 bg-[#7000ff] text-white font-bold rounded-xl hover:bg-[#6000e6] transition flex items-center justify-center gap-2">
                        <Save className="w-4 h-4" /> {editingAddress ? 'Saqlash' : 'Qo\'shish'}
                      </button>
                    </form>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* PASSWORD SECTION */}
          {activeSection === 'password' && (
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Lock className="w-5 h-5 text-[#7000ff]" /> Parolni O'zgartirish
              </h3>
              {passwordMessage.text && (
                <div className={`p-3 rounded-xl mb-4 text-xs font-semibold flex items-center gap-2 ${
                  passwordMessage.type === 'error' ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'
                }`}>
                  <AlertCircle className="w-4 h-4" /> {passwordMessage.text}
                </div>
              )}
              <form onSubmit={handlePasswordChange} className="space-y-4 max-w-md">
                <div>
                  <label className="text-xs font-semibold text-gray-600 mb-1 block">Joriy parol</label>
                  <div className="relative">
                    <input
                      type={showCurrentPass ? 'text' : 'password'}
                      required
                      value={passwordForm.current_password}
                      onChange={(e) => setPasswordForm({...passwordForm, current_password: e.target.value})}
                      className="w-full p-3 border rounded-xl text-sm focus:outline-none focus:border-[#7000ff] pr-10"
                      placeholder="Hozirgi parolingiz"
                    />
                    <button type="button" onClick={() => setShowCurrentPass(!showCurrentPass)} className="absolute right-3 top-3.5 text-gray-400">
                      {showCurrentPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-600 mb-1 block">Yangi parol</label>
                  <div className="relative">
                    <input
                      type={showNewPass ? 'text' : 'password'}
                      required
                      value={passwordForm.new_password}
                      onChange={(e) => setPasswordForm({...passwordForm, new_password: e.target.value})}
                      className="w-full p-3 border rounded-xl text-sm focus:outline-none focus:border-[#7000ff] pr-10"
                      placeholder="Yangi parol (kamida 6 ta belgi)"
                    />
                    <button type="button" onClick={() => setShowNewPass(!showNewPass)} className="absolute right-3 top-3.5 text-gray-400">
                      {showNewPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-600 mb-1 block">Yangi parolni tasdiqlang</label>
                  <input
                    type="password"
                    required
                    value={passwordForm.confirm_password}
                    onChange={(e) => setPasswordForm({...passwordForm, confirm_password: e.target.value})}
                    className="w-full p-3 border rounded-xl text-sm focus:outline-none focus:border-[#7000ff]"
                    placeholder="Yangi parolni qayta kiriting"
                  />
                </div>
                <button type="submit" className="px-6 py-3 bg-[#7000ff] text-white font-bold rounded-xl hover:bg-[#6000e6] transition flex items-center gap-2">
                  <Lock className="w-4 h-4" /> Parolni Yangilash
                </button>
              </form>
            </div>
          )}

          {/* REVIEWS SECTION */}
          {activeSection === 'reviews' && (
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-gray-900">Mening Sharhlarim</h3>
              {myReviews.length === 0 ? (
                <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-12 text-center">
                  <Star className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <h4 className="font-bold text-gray-800">Hali sharh yozmagansiz</h4>
                  <p className="text-xs text-gray-500 mt-1">Mahsulotlarga sharh yozib, boshqa xaridorlarga yordam bering</p>
                </div>
              ) : (
                myReviews.map((review) => (
                  <div key={review.id} className="bg-white rounded-3xl shadow-sm border border-gray-100 p-5">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <Star key={s} className={`w-4 h-4 ${s <= review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} />
                        ))}
                        <span className="text-xs text-gray-500 ml-2">{formatDate(review.created_at)}</span>
                      </div>
                      {review.is_verified_purchase && (
                        <span className="text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-bold flex items-center gap-1">
                          <Check className="w-3 h-3" /> Tasdiqlangan xarid
                        </span>
                      )}
                    </div>
                    {review.title && <h4 className="font-bold text-sm text-gray-900">{review.title}</h4>}
                    {review.comment && <p className="text-xs text-gray-600 mt-1 leading-relaxed">{review.comment}</p>}
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
