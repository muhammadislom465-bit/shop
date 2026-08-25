import React, { useState } from 'react';
import { MessageSquare, X, Send, User, Bot } from 'lucide-react';

const SupportChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { id: 1, text: 'Assalomu alaykum! Sizga qanday yordam bera olaman?', sender: 'bot' }
  ]);
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (!input.trim()) return;
    
    const newUserMsg = { id: Date.now(), text: input, sender: 'user' };
    setMessages(prev => [...prev, newUserMsg]);
    setInput('');
    
    // Simulate bot response
    setTimeout(() => {
      setMessages(prev => [...prev, { 
        id: Date.now() + 1, 
        text: 'Murojaatingiz qabul qilindi. Tez orada operatorimiz siz bilan bog\'lanadi.', 
        sender: 'bot' 
      }]);
    }, 1000);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {!isOpen && (
        <button 
          onClick={() => setIsOpen(true)}
          className="bg-[#7000ff] hover:bg-[#5c00d2] text-white p-4 rounded-full shadow-2xl transition-transform hover:scale-110 flex items-center justify-center"
        >
          <MessageSquare size={28} />
        </button>
      )}

      {isOpen && (
        <div className="bg-white rounded-2xl shadow-2xl w-[350px] h-[500px] flex flex-col overflow-hidden border border-gray-100">
          <div className="bg-[#7000ff] text-white p-4 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <MessageSquare size={20} />
              <span className="font-semibold">Uzum Yordam</span>
            </div>
            <button onClick={() => setIsOpen(false)} className="hover:bg-white/20 p-1 rounded-full">
              <X size={20} />
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3 bg-gray-50">
            {messages.map(msg => (
              <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] rounded-2xl p-3 text-sm ${
                  msg.sender === 'user' 
                    ? 'bg-[#7000ff] text-white rounded-tr-sm' 
                    : 'bg-white border border-gray-200 text-gray-800 rounded-tl-sm'
                }`}>
                  {msg.text}
                </div>
              </div>
            ))}
          </div>

          <div className="p-3 bg-white border-t border-gray-100">
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Xabaringizni yozing..."
                className="flex-1 bg-gray-100 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#7000ff]/50"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              />
              <button 
                onClick={handleSend}
                className="bg-[#7000ff] text-white p-2 rounded-full hover:bg-[#5c00d2] transition-colors"
              >
                <Send size={18} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SupportChatWidget;
