import React, { useState, useEffect } from 'react';
import {
  HelpCircle, Search, ChevronDown, ChevronUp, Phone, Mail, MessageCircle,
  Truck, CreditCard, RotateCcw, ShoppingBag, Clock, MapPin, Shield,
  ExternalLink, ArrowLeft
} from 'lucide-react';
import { contentApi } from '../services/api';

export const FAQPage = ({ onBackHome }) => {
  const [faqs, setFaqs] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [openFaqId, setOpenFaqId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFAQs();
  }, []);

  const loadFAQs = async () => {
    setLoading(true);
    try {
      const [faqRes, catRes] = await Promise.all([
        contentApi.getFAQs(),
        contentApi.getFAQCategories()
      ]);
      setFaqs(faqRes.data);
      setCategories(catRes.data);
    } catch (err) {
      console.error('FAQ yuklashda xatolik:', err);
    } finally {
      setLoading(false);
    }
  };

  const categoryIcons = {
    'Umumiy': ShoppingBag,
    'Yetkazib berish': Truck,
    'To\'lov': CreditCard,
    'Qaytarish': RotateCcw
  };

  const categoryColors = {
    'Umumiy': 'bg-purple-50 text-purple-700 border-purple-200',
    'Yetkazib berish': 'bg-blue-50 text-blue-700 border-blue-200',
    'To\'lov': 'bg-green-50 text-green-700 border-green-200',
    'Qaytarish': 'bg-orange-50 text-orange-700 border-orange-200'
  };

  const filteredFaqs = faqs.filter((faq) => {
    const matchesCategory = !selectedCategory || faq.category === selectedCategory;
    const matchesSearch = !searchQuery ||
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-10">
        <button onClick={onBackHome} className="text-sm text-gray-500 hover:text-[#7000ff] transition flex items-center gap-1 mx-auto mb-4">
          <ArrowLeft className="w-4 h-4" /> Bosh sahifaga qaytish
        </button>
        <div className="w-16 h-16 bg-gradient-to-tr from-[#7000ff] to-[#9b42f5] rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-xl shadow-purple-200">
          <HelpCircle className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-3xl font-black text-gray-900">Yordam Markazi</h1>
        <p className="text-sm text-gray-500 mt-2">Ko'p so'raladigan savollar va javoblar</p>
      </div>

      {/* Search */}
      <div className="relative max-w-2xl mx-auto mb-8">
        <Search className="w-5 h-5 text-gray-400 absolute left-4 top-4" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Savolni qidiring..."
          className="w-full pl-12 pr-4 py-4 bg-white border border-gray-200 rounded-2xl text-sm focus:outline-none focus:border-[#7000ff] shadow-sm"
        />
      </div>

      {/* Category Filters */}
      <div className="flex flex-wrap justify-center gap-3 mb-8">
        <button
          onClick={() => setSelectedCategory(null)}
          className={`px-4 py-2 rounded-2xl text-xs font-bold border transition ${
            !selectedCategory ? 'bg-[#7000ff] text-white border-[#7000ff]' : 'bg-white text-gray-600 border-gray-200 hover:border-[#7000ff]'
          }`}
        >
          Barchasi ({faqs.length})
        </button>
        {categories.map((cat) => {
          const Icon = categoryIcons[cat] || HelpCircle;
          const count = faqs.filter(f => f.category === cat).length;
          return (
            <button
              key={cat}
              onClick={() => setSelectedCategory(selectedCategory === cat ? null : cat)}
              className={`px-4 py-2 rounded-2xl text-xs font-bold border transition flex items-center gap-1.5 ${
                selectedCategory === cat
                  ? 'bg-[#7000ff] text-white border-[#7000ff]'
                  : `${categoryColors[cat] || 'bg-gray-50 text-gray-600 border-gray-200'} hover:border-[#7000ff]`
              }`}
            >
              <Icon className="w-3.5 h-3.5" /> {cat} ({count})
            </button>
          );
        })}
      </div>

      {/* FAQ List */}
      <div className="space-y-3">
        {loading ? (
          <div className="text-center py-16">
            <div className="w-8 h-8 border-4 border-[#7000ff] border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="text-sm text-gray-500 mt-3">Yuklanmoqda...</p>
          </div>
        ) : filteredFaqs.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl border border-gray-100">
            <HelpCircle className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <h3 className="font-bold text-gray-800">Natija topilmadi</h3>
            <p className="text-xs text-gray-500 mt-1">Boshqa kalit so'z bilan qidirib ko'ring</p>
          </div>
        ) : (
          filteredFaqs.map((faq) => {
            const isOpen = openFaqId === faq.id;
            const Icon = categoryIcons[faq.category] || HelpCircle;
            return (
              <div
                key={faq.id}
                className={`bg-white rounded-2xl border transition-all cursor-pointer ${
                  isOpen ? 'border-purple-300 shadow-lg shadow-purple-50' : 'border-gray-100 hover:border-gray-200'
                }`}
              >
                <button
                  onClick={() => setOpenFaqId(isOpen ? null : faq.id)}
                  className="w-full text-left p-5 flex items-start justify-between gap-4"
                >
                  <div className="flex items-start gap-3">
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 ${
                      categoryColors[faq.category]?.split(' ').slice(0, 1).join(' ') || 'bg-gray-100'
                    }`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-gray-900 leading-snug">{faq.question}</h4>
                      <span className="text-[10px] text-gray-400 mt-1 block">{faq.category}</span>
                    </div>
                  </div>
                  {isOpen ? (
                    <ChevronUp className="w-5 h-5 text-[#7000ff] flex-shrink-0" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0" />
                  )}
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 pt-0">
                    <div className="ml-11 text-sm text-gray-600 leading-relaxed border-t border-gray-100 pt-3">
                      {faq.answer}
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Contact Section */}
      <div className="mt-12 bg-gradient-to-r from-purple-50 to-blue-50 rounded-3xl p-8 border border-purple-100">
        <div className="text-center mb-6">
          <h3 className="text-lg font-black text-gray-900">Savol qoldimi?</h3>
          <p className="text-sm text-gray-600 mt-1">Biz bilan bog'laning — doimo yordam berishga tayyormiz!</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-2xl p-5 text-center shadow-sm">
            <Phone className="w-8 h-8 text-[#7000ff] mx-auto mb-2" />
            <h4 className="font-bold text-sm text-gray-900">Telefon</h4>
            <p className="text-xs text-gray-500 mt-1">+998 71 200 00 00</p>
            <p className="text-[10px] text-gray-400 mt-0.5">Dushanba-Shanba, 9:00-21:00</p>
          </div>
          <div className="bg-white rounded-2xl p-5 text-center shadow-sm">
            <Mail className="w-8 h-8 text-[#7000ff] mx-auto mb-2" />
            <h4 className="font-bold text-sm text-gray-900">Email</h4>
            <p className="text-xs text-gray-500 mt-1">support@uzum.uz</p>
            <p className="text-[10px] text-gray-400 mt-0.5">24 soat ichida javob beramiz</p>
          </div>
          <div className="bg-white rounded-2xl p-5 text-center shadow-sm">
            <MessageCircle className="w-8 h-8 text-[#7000ff] mx-auto mb-2" />
            <h4 className="font-bold text-sm text-gray-900">Telegram</h4>
            <p className="text-xs text-gray-500 mt-1">@uzum_support</p>
            <p className="text-[10px] text-gray-400 mt-0.5">Tezkor javoblar</p>
          </div>
        </div>
      </div>
    </div>
  );
};
