import React, { useState } from 'react';
import { X, Lock, Mail, User, ShieldAlert, CheckCircle2, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const AuthModal = ({ onAdminLogin }) => {
  const { 
    authModalOpen, 
    setAuthModalOpen, 
    authMode, 
    setAuthMode, 
    login, 
    register, 
    loading 
  } = useAuth();

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
  });

  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  if (!authModalOpen) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrorMessage('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (authMode === 'register') {
      if (!formData.username || !formData.email || !formData.password) {
        setErrorMessage("Barcha maydonlarni to'ldiring.");
        return;
      }
      if (formData.password.length < 6) {
        setErrorMessage("Parol kamida 6 ta belgidan iborat bo'lishi kerak.");
        return;
      }
      const res = await register(formData.username, formData.email, formData.password);
      if (!res.success) {
        setErrorMessage(res.error);
      } else {
        setSuccessMessage("Muvaffaqiyatli ro'yxatdan o'tdingiz!");
      }
    } else {
      if (!formData.username || !formData.password) {
        setErrorMessage("Login va parolni kiriting.");
        return;
      }
      const res = await login(formData.username, formData.password);
      if (!res.success) {
        setErrorMessage(res.error);
      } else {
        setSuccessMessage("Tizimga muvaffaqiyatli kirdingiz!");
        if (res.user?.is_admin && onAdminLogin) {
          onAdminLogin();
        }
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div 
        className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden relative p-6 sm:p-8 animate-in fade-in zoom-in duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={() => setAuthModalOpen(false)}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 p-2 rounded-full hover:bg-gray-100 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-purple-100 text-[#7000ff] font-extrabold text-2xl flex items-center justify-center mx-auto mb-3 shadow-inner">
            u
          </div>
          <h3 className="text-xl font-bold text-gray-900">
            {authMode === 'login' ? "Uzum Marketga kirish" : "Ro'yxatdan o'tish"}
          </h3>
          <p className="text-xs text-gray-500 mt-1">
            {authMode === 'login'
              ? "Buyurtmalaringizni kuzatish va qulay xarid qilish uchun kiring"
              : "Yangi akkaunt yarating va maxsus chegirmalarga ega bo'ling"}
          </p>
        </div>

        {/* Feedback Alerts */}
        {errorMessage && (
          <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-xl text-xs flex items-center gap-2 border border-red-100">
            <ShieldAlert className="w-4 h-4 flex-shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}
        {successMessage && (
          <div className="mb-4 p-3 bg-green-50 text-green-700 rounded-xl text-xs flex items-center gap-2 border border-green-100">
            <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5">
          {/* Username */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              {authMode === 'login' ? "Username yoki Email" : "Foydalanuvchi nomi (Username)"}
            </label>
            <div className="relative">
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder={authMode === 'login' ? "Foydalanuvchi nomi yoki email" : "Masalan: ali_valiyev"}
                required
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:border-purple-600 focus:outline-none transition"
              />
              <User className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
            </div>
          </div>

          {/* Email (only for registration) */}
          {authMode === 'register' && (
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Elektron pochta (Email)
              </label>
              <div className="relative">
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="ali@misol.uz"
                  required
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:border-purple-600 focus:outline-none transition"
                />
                <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
              </div>
            </div>
          )}

          {/* Password */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Parol
            </label>
            <div className="relative">
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                required
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:border-purple-600 focus:outline-none transition"
              />
              <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
            </div>
          </div>

          {/* Submit button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-[#7000ff] hover:bg-[#6000e6] text-white font-bold rounded-xl text-sm shadow-lg shadow-purple-600/25 transition flex items-center justify-center gap-2 mt-4 disabled:opacity-50"
          >
            {loading ? (
              <span className="inline-block animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
            ) : (
              <>
                <span>{authMode === 'login' ? "Kirish" : "Ro'yxatdan o'tish"}</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Switch mode */}
        <div className="mt-5 text-center text-xs text-gray-500 border-t border-gray-100 pt-4">
          {authMode === 'login' ? (
            <p>
              Akkauntingiz yo'qmi?{' '}
              <button
                type="button"
                onClick={() => {
                  setAuthMode('register');
                  setErrorMessage('');
                }}
                className="text-[#7000ff] font-bold hover:underline"
              >
                Ro'yxatdan o'ting
              </button>
            </p>
          ) : (
            <p>
              Akkauntingiz bormi?{' '}
              <button
                type="button"
                onClick={() => {
                  setAuthMode('login');
                  setErrorMessage('');
                }}
                className="text-[#7000ff] font-bold hover:underline"
              >
                Tizimga kiring
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
