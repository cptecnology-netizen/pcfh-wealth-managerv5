
import React, { useState, useRef, useEffect } from 'react';
import { wealthAnalyst } from '../services/geminiService';
import { MOCK_ASSETS, MOCK_TRANSACTIONS } from '../constants';
// Import Chat type from @google/genai to fix line 19 error
import { GenerateContentResponse, Chat } from '@google/genai';

interface Message {
  role: 'user' | 'model';
  text: string;
}

export const ChatBot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', text: 'Olá, sou o seu Assistente PCFH. Como posso ajudar com a gestão do património hoje?' }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  // Fix: Chat is now correctly imported from @google/genai
  const chatRef = useRef<Chat>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && !chatRef.current) {
      chatRef.current = wealthAnalyst.createChatSession(MOCK_ASSETS, MOCK_TRANSACTIONS);
    }
  }, [isOpen]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;

    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsTyping(true);

    try {
      if (!chatRef.current) {
        chatRef.current = wealthAnalyst.createChatSession(MOCK_ASSETS, MOCK_TRANSACTIONS);
      }
      
      const stream = await chatRef.current.sendMessageStream({ message: userMsg });
      let fullText = '';
      
      // Add an empty model message to update
      setMessages(prev => [...prev, { role: 'model', text: '' }]);

      for await (const chunk of stream) {
        const c = chunk as GenerateContentResponse;
        fullText += c.text;
        setMessages(prev => {
          const updated = [...prev];
          updated[updated.length - 1] = { role: 'model', text: fullText };
          return updated;
        });
      }
    } catch (error) {
      console.error("Chat Error:", error);
      setMessages(prev => [...prev, { role: 'model', text: 'Desculpe, ocorreu um erro na conexão com o advisor.' }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="fixed bottom-8 right-8 z-[100] font-sans">
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="w-16 h-16 bg-blue-600 text-white rounded-full shadow-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all duration-300 hover:bg-blue-700 group"
        >
          <span className="material-icons-outlined text-3xl group-hover:rotate-12 transition-transform">chat_bubble</span>
          <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full border-2 border-white flex items-center justify-center animate-bounce">
            <span className="text-[10px] font-black">1</span>
          </div>
        </button>
      )}

      {isOpen && (
        <div className="w-96 h-[32rem] bg-white rounded-3xl shadow-[0_32px_64px_-12px_rgba(0,0,0,0.2)] border border-slate-200 flex flex-col overflow-hidden animate-in slide-in-from-bottom-8 zoom-in-95 duration-300">
          {/* Header */}
          <div className="bg-slate-900 p-6 flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
                <span className="material-icons-outlined text-white text-xl animate-pulse">psychology</span>
              </div>
              <div>
                <h4 className="text-white font-black text-sm uppercase tracking-widest leading-none">Advisor IA</h4>
                <p className="text-blue-400 text-[9px] font-black uppercase tracking-widest mt-1">PCFH Strategic Engine</p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-white transition">
              <span className="material-icons-outlined">close</span>
            </button>
          </div>

          {/* Messages Area */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] p-4 rounded-2xl text-xs leading-relaxed ${
                  m.role === 'user' 
                    ? 'bg-blue-600 text-white shadow-lg rounded-tr-none' 
                    : 'bg-white text-slate-700 shadow-sm border border-slate-200 rounded-tl-none'
                }`}>
                  <div className="whitespace-pre-wrap">{m.text}</div>
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-white p-4 rounded-2xl border border-slate-200 rounded-tl-none shadow-sm flex space-x-1">
                  <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce"></div>
                  <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce delay-100"></div>
                  <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce delay-200"></div>
                </div>
              </div>
            )}
          </div>

          {/* Input Area */}
          <div className="p-4 bg-white border-t border-slate-100">
            <div className="relative">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Pergunte sobre o património..."
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-5 pr-12 py-4 text-xs font-bold text-slate-700 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all outline-none"
              />
              <button 
                onClick={handleSend}
                disabled={!input.trim() || isTyping}
                className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 bg-slate-900 text-white rounded-xl flex items-center justify-center hover:bg-blue-600 transition-colors disabled:opacity-30"
              >
                <span className="material-icons-outlined text-sm">send</span>
              </button>
            </div>
            <p className="text-[8px] text-center text-slate-400 font-bold uppercase tracking-widest mt-3 italic">
              Alimentado por Gemini 3 Pro • SFO Secure Instance
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
