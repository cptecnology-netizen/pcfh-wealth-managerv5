
import React, { useEffect, useState, useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, AreaChart, Area, XAxis, YAxis, CartesianGrid } from 'recharts';
import { MOCK_ASSETS, MOCK_TRANSACTIONS, EXCHANGE_RATES, PGC_ANGOLA, MOCK_ENTITIES } from '../constants';
import { wealthAnalyst } from '../services/geminiService';

const COLORS = ['#2563eb', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#0ea5e9', '#ec4899'];

export const Dashboard: React.FC = () => {
  const [insights, setInsights] = useState<string>('<div class="flex items-center space-x-2 animate-pulse"><div class="w-2 h-2 bg-blue-400 rounded-full"></div><div class="w-2 h-2 bg-blue-400 rounded-full animation-delay-200"></div><div class="w-2 h-2 bg-blue-400 rounded-full animation-delay-400"></div><span class="ml-2 text-blue-300">Consultando o Estrategista IA...</span></div>');

  useEffect(() => {
    wealthAnalyst.getWealthInsights(MOCK_ASSETS, MOCK_TRANSACTIONS).then(setInsights);
  }, []);

  const totalAOA = useMemo(() => MOCK_ASSETS.reduce((acc, asset) => {
    let value = asset.currentValue;
    if (asset.currency === 'EUR') value *= EXCHANGE_RATES.EUR_AOA;
    if (asset.currency === 'USD') value *= EXCHANGE_RATES.USD_AOA;
    return acc + value;
  }, 0), []);

  const fixedMonthlyOutflow = useMemo(() => 
    MOCK_TRANSACTIONS
      .filter(t => t.isFixed)
      .reduce((sum, t) => sum + t.amount, 0)
  , []);

  const assetAllocation = useMemo(() => MOCK_ASSETS.reduce((acc: any[], asset) => {
    const existing = acc.find(i => i.name === asset.type);
    let value = asset.currentValue;
    if (asset.currency === 'EUR') value *= EXCHANGE_RATES.EUR_AOA;
    if (asset.currency === 'USD') value *= EXCHANGE_RATES.USD_AOA;
    
    if (existing) {
      existing.value += value;
    } else {
      acc.push({ name: asset.type, value: value });
    }
    return acc;
  }, []), []);

  const entityAllocation = useMemo(() => MOCK_ASSETS.reduce((acc: any[], asset) => {
    const entityName = MOCK_ENTITIES.find(e => e.id === asset.entityId)?.name || 'Outros';
    const existing = acc.find(i => i.name === entityName);
    let value = asset.currentValue;
    if (asset.currency === 'EUR') value *= EXCHANGE_RATES.EUR_AOA;
    if (asset.currency === 'USD') value *= EXCHANGE_RATES.USD_AOA;
    
    if (existing) {
      existing.value += value;
    } else {
      acc.push({ name: entityName, value: value });
    }
    return acc;
  }, []), []);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Património Consolidado</p>
          <div className="flex items-baseline space-x-2 mt-2">
            <h3 className="text-3xl font-black text-slate-900 tracking-tighter">
              {totalAOA.toLocaleString('pt-AO', { maximumFractionDigits: 0 })}
            </h3>
            <span className="text-xs font-bold text-slate-400">AOA</span>
          </div>
          <p className="text-xs text-emerald-600 font-bold mt-3 flex items-center bg-emerald-50 w-fit px-2 py-1 rounded-lg">
            <span className="material-icons-outlined text-sm mr-1">trending_up</span>
            Líquido <span className="text-[10px] ml-1 opacity-60">Base PGC</span>
          </p>
        </div>
        
        <div className="bg-rose-50 border border-rose-100 p-6 rounded-3xl shadow-sm hover:shadow-xl transition-all duration-300">
          <p className="text-[10px] font-black text-rose-400 uppercase tracking-widest">Compromisso Mensal</p>
          <div className="flex items-baseline space-x-2 mt-2">
            <h3 className="text-3xl font-black text-rose-700 tracking-tighter">
              {fixedMonthlyOutflow.toLocaleString('pt-AO')}
            </h3>
            <span className="text-xs font-bold text-rose-400">AOA</span>
          </div>
          <div className="flex items-center space-x-2 mt-3">
             <span className="text-[9px] font-black bg-rose-200 text-rose-700 px-2 py-0.5 rounded-full uppercase tracking-tighter">Burn Rate SFO</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Exposição Bancária</p>
          <div className="flex items-baseline space-x-2 mt-2">
            <h3 className="text-3xl font-black text-slate-900 tracking-tighter">
                {MOCK_ENTITIES.filter(e => e.type === 'bank').length}
            </h3>
            <span className="text-xs font-bold text-slate-400">Instituições</span>
          </div>
          <p className="text-xs text-blue-600 font-bold mt-3">BNI • Keve • BAI • Standard</p>
        </div>

        <div className="bg-slate-900 p-6 rounded-3xl shadow-2xl relative overflow-hidden group">
          <div className="relative z-10 text-white">
            <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest">Rendimento Passivo</p>
            <h3 className="text-3xl font-black mt-2 tracking-tighter">
                +18.5%
            </h3>
            <p className="text-xs text-blue-400 font-bold mt-3 flex items-center">
                <span className="material-icons-outlined text-sm mr-1">bolt</span>
                Max iKeve DP
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
            <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h4 className="text-lg font-black text-slate-800 tracking-tight">Alocação por Instituição</h4>
                        <p className="text-xs text-slate-400 font-medium">Gestão de Concentração Bancária</p>
                    </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                    <div className="h-64 relative">
                        <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie data={entityAllocation} cx="50%" cy="50%" innerRadius={70} outerRadius={95} paddingAngle={8} dataKey="value">
                                {entityAllocation.map((_, index) => <Cell key={index} fill={COLORS[index % COLORS.length]} />)}
                            </Pie>
                            <Tooltip contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)' }} />
                        </PieChart>
                        </ResponsiveContainer>
                    </div>
                    
                    <div className="space-y-3">
                        {entityAllocation.map((entry, index) => (
                        <div key={entry.name} className="flex items-center justify-between group p-1.5 hover:bg-slate-50 rounded-xl transition-colors">
                            <div className="flex items-center space-x-3">
                                <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                                <span className="text-xs font-bold text-slate-600 truncate max-w-[120px]">{entry.name}</span>
                            </div>
                            <span className="text-xs font-black text-slate-900 tabular-nums">
                                {((entry.value / totalAOA) * 100).toFixed(1)}%
                            </span>
                        </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm">
                <h4 className="text-sm font-black text-slate-800 uppercase tracking-widest mb-6">Mix de Ativos (Portfolio Global)</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                    <div className="h-48">
                        <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie data={assetAllocation} cx="50%" cy="50%" innerRadius={50} outerRadius={70} paddingAngle={5} dataKey="value">
                                {assetAllocation.map((_, index) => <Cell key={index} fill={COLORS[(index + 3) % COLORS.length]} />)}
                            </Pie>
                        </PieChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="space-y-2">
                        {assetAllocation.map((entry, index) => (
                        <div key={entry.name} className="flex items-center justify-between">
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{entry.name.replace('_', ' ')}</span>
                            <span className="text-xs font-black text-slate-800">{((entry.value / totalAOA) * 100).toFixed(0)}%</span>
                        </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>

        <div className="bg-slate-900 text-white p-10 rounded-[2.5rem] shadow-2xl relative overflow-hidden flex flex-col justify-between border border-slate-800">
          <div className="relative z-10 space-y-8">
            <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center">
                    <span className="material-icons-outlined text-white text-2xl animate-pulse">psychology</span>
                </div>
                <h4 className="text-xl font-black tracking-tight">Advisor <span className="text-blue-400">Hub</span></h4>
            </div>
            <div className="text-sm text-slate-300 leading-relaxed font-medium" dangerouslySetInnerHTML={{ __html: insights }} />
          </div>
          <div className="mt-8 pt-6 border-t border-white/10 relative z-10 text-[9px] font-black uppercase tracking-[0.3em] text-slate-500">
            Powered by Gemini 3 Flash • SFO Private Model
          </div>
        </div>
      </div>
    </div>
  );
};
