import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChatBot } from './ChatBot';

const SidebarItem: React.FC<{ to: string; label: string; icon: string }> = ({ to, label, icon }) => {
  const location = useLocation();
  const isActive = location.pathname === to;
  
  return (
    <Link
      to={to}
      className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${
        isActive ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' : 'text-slate-600 hover:bg-blue-50 hover:text-blue-600'
      }`}
    >
      <span className="material-icons-outlined text-xl">{icon}</span>
      <span className="font-bold text-sm">{label}</span>
    </Link>
  );
};

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden relative font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col shrink-0">
        <div className="p-8">
          <h1 className="text-2xl font-black text-slate-900 tracking-tighter leading-none">PCFH<br/><span className="text-blue-600">Wealth v3.0</span></h1>
          <div className="mt-2 flex items-center space-x-2">
            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">SFO Operational</span>
          </div>
        </div>
        
        <nav className="flex-1 px-4 pb-4 space-y-1 overflow-y-auto custom-scrollbar">
          <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.3em] px-4 mb-3 mt-6">Património</p>
          <SidebarItem to="/" label="Dashboard" icon="grid_view" />
          <SidebarItem to="/assets" label="Ativos Globais" icon="account_balance" />
          <SidebarItem to="/entities-overview" label="Bancos & Gestoras" icon="account_balance_wallet" />
          
          <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.3em] px-4 mb-3 mt-8">Performance</p>
          <SidebarItem to="/yield-map" label="Mapa de Rendimento" icon="insights" />
          <SidebarItem to="/bodiva" label="Mercado BODIVA" icon="military_tech" />
          
          <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.3em] px-4 mb-3 mt-8">Operações</p>
          <SidebarItem to="/transactions" label="Diário de Caixa" icon="receipt_long" />
          <SidebarItem to="/accounting" label="Livro PGC" icon="menu_book" />
          <SidebarItem to="/payroll" label="Folha de Pagamento" icon="badge" />
          <SidebarItem to="/reports" label="Análise de Custos" icon="analytics" />

          <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.3em] px-4 mb-3 mt-8">Sistema</p>
          <SidebarItem to="/legal" label="Legal & Segurança" icon="gavel" />
        </nav>
        
        <div className="p-6 border-t border-slate-100 bg-slate-50/50">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 rounded-2xl bg-blue-100 flex items-center justify-center text-blue-700 font-black text-xs shadow-sm">
              JC
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-black text-slate-800 truncate">João Couto</p>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Family Principal</p>
            </div>
          </div>
          <div className="flex flex-col space-y-1 text-[8px] text-slate-400 font-black uppercase tracking-[0.2em] border-t border-slate-200 pt-4 opacity-60">
             <span>Em conformidade com a</span>
             <span className="text-slate-600">Lei 22/11 de Angola</span>
             <span>Segurança PCFH v3.0.0</span>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto flex flex-col relative custom-scrollbar bg-slate-50/30">
        <header className="h-20 bg-white/80 backdrop-blur-md border-b border-slate-200 flex items-center justify-between px-10 sticky top-0 z-40">
          <div className="flex items-center space-x-4">
            <h2 className="text-xl font-black text-slate-800 tracking-tight">Family Holdings Manager v3.0</h2>
            <div className="h-4 w-px bg-slate-200"></div>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Base Contabilística: PGC v2025</span>
          </div>
          <div className="flex items-center space-x-6">
             <div className="hidden lg:flex items-center space-x-4 pr-6 border-r border-slate-100">
                <div className="text-right">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Liquidez Instantânea</p>
                    <p className="text-sm font-black text-emerald-600 tracking-tighter">~1.8M AOA</p>
                </div>
                <div className="w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center">
                    <span className="material-icons-outlined text-emerald-500 text-sm">check_circle</span>
                </div>
             </div>
             <button className="relative p-2 text-slate-400 hover:text-slate-900 transition-colors">
               <span className="material-icons-outlined">notifications</span>
               <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full border-2 border-white"></span>
             </button>
             <button className="p-2 text-slate-400 hover:text-slate-900 transition-colors">
               <span className="material-icons-outlined">settings</span>
             </button>
          </div>
        </header>
        
        <div className="p-10 pb-32">
          {children}
        </div>
      </main>

      {/* Global AI ChatBot */}
      <ChatBot />
      
      {/* Material Icons Import */}
      <link href="https://fonts.googleapis.com/icon?family=Material+Icons+Outlined" rel="stylesheet" />
      
      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #cbd5e1; }
      `}</style>
    </div>
  );
};
