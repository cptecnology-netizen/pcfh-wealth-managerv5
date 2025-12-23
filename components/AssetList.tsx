
import React, { useState } from 'react';
import { MOCK_ASSETS, EXCHANGE_RATES } from '../constants';
import { AssetType } from '../types';
import { wealthAnalyst } from '../services/geminiService';

export const AssetList: React.FC = () => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [strategicReview, setStrategicReview] = useState<string | null>(null);

  const getIcon = (type: AssetType) => {
    switch (type) {
      case AssetType.BANK_ACCOUNT: return 'savings';
      case AssetType.TIME_DEPOSIT: return 'lock_clock';
      case AssetType.ETF: return 'show_chart';
      case AssetType.REAL_ESTATE: return 'home';
      case AssetType.VEHICLE: return 'directions_car';
      default: return 'help_outline';
    }
  };

  const handleStrategicAnalysis = async () => {
    setIsAnalyzing(true);
    try {
      const review = await wealthAnalyst.getStrategicPortfolioReview(MOCK_ASSETS);
      setStrategicReview(review);
    } catch (error) {
      alert("Erro ao gerar análise. Tente novamente.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-2xl font-black text-slate-800 tracking-tight">Portfólio de Ativos</h3>
          <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">Gestão de Riqueza Consolidada</p>
        </div>
        <div className="flex space-x-3">
          <button 
            onClick={handleStrategicAnalysis}
            disabled={isAnalyzing}
            className="bg-slate-900 text-white px-6 py-2.5 rounded-xl font-black text-xs uppercase tracking-widest flex items-center shadow-xl hover:bg-slate-800 transition active:scale-95 disabled:opacity-50"
          >
            <span className={`material-icons-outlined mr-2 text-sm ${isAnalyzing ? 'animate-spin' : ''}`}>
              {isAnalyzing ? 'sync' : 'psychology'}
            </span>
            {isAnalyzing ? 'Analisando...' : 'Análise Estratégica'}
          </button>
          <button className="bg-blue-600 text-white px-6 py-2.5 rounded-xl font-black text-xs uppercase tracking-widest flex items-center shadow-xl hover:bg-blue-700 transition active:scale-95">
            <span className="material-icons-outlined mr-2 text-sm">add</span>
            Novo Ativo
          </button>
        </div>
      </div>

      {strategicReview && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-4xl max-h-[85vh] rounded-[2.5rem] shadow-[0_32px_64px_-12px_rgba(0,0,0,0.3)] flex flex-col overflow-hidden animate-in slide-in-from-bottom-8 duration-500">
            <div className="bg-slate-900 px-10 py-8 flex justify-between items-center shrink-0">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/20">
                  <span className="material-icons-outlined text-white text-2xl">auto_awesome</span>
                </div>
                <div>
                  <h4 className="text-white font-black text-lg uppercase tracking-widest leading-none">Relatório Estratégico</h4>
                  <p className="text-blue-400 text-[10px] font-black uppercase tracking-widest mt-2">PCFH Intelligence Hub • Gemini 3 Pro</p>
                </div>
              </div>
              <button 
                onClick={() => setStrategicReview(null)}
                className="w-10 h-10 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-white/20 transition"
              >
                <span className="material-icons-outlined">close</span>
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-10 bg-slate-50/50 prose prose-slate max-w-none">
               <div dangerouslySetInnerHTML={{ __html: strategicReview }} />
            </div>
            <div className="p-8 bg-white border-t border-slate-100 flex justify-end shrink-0">
                <button 
                  onClick={() => window.print()}
                  className="bg-slate-900 text-white px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-xl hover:bg-slate-800 transition"
                >
                  Exportar PDF do Relatório
                </button>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-[2rem] border border-slate-200 overflow-hidden shadow-sm">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-200 text-slate-400 text-[10px] uppercase tracking-[0.3em] font-black">
            <tr>
              <th className="px-8 py-5">Ativo / Património</th>
              <th className="px-8 py-5">Tipo Classe</th>
              <th className="px-8 py-5">Exposição</th>
              <th className="px-8 py-5 text-right">Valor Original</th>
              <th className="px-8 py-5 text-right">Valor Consolidado (AOA)</th>
              <th className="px-8 py-5">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm">
            {MOCK_ASSETS.map((asset) => {
               let aoaValue = asset.currentValue;
               if (asset.currency === 'EUR') aoaValue *= EXCHANGE_RATES.EUR_AOA;
               if (asset.currency === 'USD') aoaValue *= EXCHANGE_RATES.USD_AOA;
               
               return (
                <tr key={asset.id} className="hover:bg-slate-50/80 transition-colors group">
                  <td className="px-8 py-5">
                    <div className="flex items-center space-x-4">
                      <div className="p-3 bg-slate-100 rounded-2xl text-slate-500 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                        <span className="material-icons-outlined">{getIcon(asset.type)}</span>
                      </div>
                      <div>
                        <span className="font-black text-slate-800 tracking-tight">{asset.name}</span>
                        <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">ID: {asset.id.toUpperCase()}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <span className="px-3 py-1 bg-slate-100 rounded-full text-[10px] font-black uppercase tracking-widest text-slate-500">{asset.type.replace('_', ' ')}</span>
                  </td>
                  <td className="px-8 py-5">
                    <span className="px-2 py-1 bg-blue-50 border border-blue-100 rounded text-[10px] font-black text-blue-600 uppercase tracking-widest">{asset.currency}</span>
                  </td>
                  <td className="px-8 py-5 text-right font-black text-slate-600 tabular-nums">
                    {asset.currentValue.toLocaleString('pt-AO', { minimumFractionDigits: 2 })}
                  </td>
                  <td className="px-8 py-5 text-right font-black text-blue-700 tabular-nums text-lg tracking-tighter">
                    {aoaValue.toLocaleString('pt-AO', { minimumFractionDigits: 2 })}
                  </td>
                  <td className="px-8 py-5">
                    <button className="w-8 h-8 rounded-full hover:bg-slate-200 flex items-center justify-center text-slate-400 transition">
                      <span className="material-icons-outlined text-sm">more_vert</span>
                    </button>
                  </td>
                </tr>
               );
            })}
          </tbody>
        </table>
      </div>
      
      <div className="bg-blue-50/50 p-6 rounded-3xl border border-blue-100 flex items-center justify-between">
         <div className="flex items-center space-x-4">
            <div className="p-2 bg-blue-100 rounded-xl text-blue-600">
                <span className="material-icons-outlined">info</span>
            </div>
            <p className="text-xs font-bold text-blue-800 leading-relaxed max-w-2xl">
                Os valores são consolidados em Kwanza (AOA) usando taxas de câmbio de mercado atualizadas. 
                Use a <span className="text-blue-600 underline cursor-pointer">Análise Estratégica IA</span> para entender a exposição de risco da família Primo Couto.
            </p>
         </div>
      </div>
    </div>
  );
};
