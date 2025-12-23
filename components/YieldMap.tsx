
import React, { useMemo } from 'react';
import { MOCK_TRANSACTIONS, PGC_ANGOLA, MOCK_ASSETS, EXCHANGE_RATES } from '../constants';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, AreaChart, Area } from 'recharts';

export const YieldMap: React.FC = () => {
  // Filtrar apenas receitas (Classe 7)
  const yieldTransactions = useMemo(() => {
    return MOCK_TRANSACTIONS.filter(t => {
      const acc = PGC_ANGOLA.find(p => p.code === t.accountCode);
      return acc?.category === 'revenue';
    }).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, []);

  const totalYield = useMemo(() => yieldTransactions.reduce((s, t) => s + t.amount, 0), [yieldTransactions]);

  const yieldByCategory = useMemo(() => {
    const data: Record<string, number> = {};
    yieldTransactions.forEach(t => {
      data[t.category] = (data[t.category] || 0) + t.amount;
    });
    return Object.entries(data).map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  }, [yieldTransactions]);

  const monthlyYield = useMemo(() => {
    const months: Record<string, number> = {};
    yieldTransactions.forEach(t => {
      const month = t.date.substring(0, 7); // YYYY-MM
      months[month] = (months[month] || 0) + t.amount;
    });
    return Object.entries(months).map(([name, value]) => ({ name, value }));
  }, [yieldTransactions]);

  // Cálculo de rendimento esperado vs real (exemplo estático baseado no património total)
  const totalAssetsValue = MOCK_ASSETS.reduce((acc, asset) => {
    let val = asset.currentValue;
    if (asset.currency === 'EUR') val *= EXCHANGE_RATES.EUR_AOA;
    if (asset.currency === 'USD') val *= EXCHANGE_RATES.USD_AOA;
    return acc + val;
  }, 0);
  
  const portfolioYieldRate = totalAssetsValue > 0 ? (totalYield / totalAssetsValue) * 100 : 0;

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h3 className="text-3xl font-black text-slate-900 tracking-tight flex items-center">
            <span className="material-icons-outlined text-emerald-600 mr-3 text-4xl">analytics</span>
            Mapa de Rendimento Consolidado
          </h3>
          <p className="text-sm text-slate-500 font-bold uppercase tracking-widest mt-1 italic">
            Monitorização de Dividendos, Cupões e Proventos (Classe 7 PGC)
          </p>
        </div>
        <div className="bg-emerald-900 text-white px-8 py-4 rounded-[2rem] shadow-2xl flex items-center space-x-6 border-4 border-emerald-800">
            <div className="text-right border-r border-white/10 pr-6">
                <p className="text-[9px] font-black text-emerald-400 uppercase tracking-widest">Yield Acumulado</p>
                <p className="text-2xl font-black tabular-nums">{totalYield.toLocaleString('pt-AO')} <span className="text-[10px] text-emerald-500 ml-1">AOA</span></p>
            </div>
            <div className="text-right">
                <p className="text-[9px] font-black text-emerald-400 uppercase tracking-widest">Taxa Interna (Portfólio)</p>
                <p className="text-2xl font-black tabular-nums">+{portfolioYieldRate.toFixed(2)}%</p>
            </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Histórico Temporal */}
        <div className="lg:col-span-2 bg-white p-10 rounded-[3rem] border border-slate-200 shadow-sm overflow-hidden relative group">
          <div className="flex justify-between items-center mb-10 relative z-10">
            <h4 className="text-sm font-black text-slate-800 uppercase tracking-[0.2em] flex items-center">
                <span className="w-2 h-6 bg-emerald-500 rounded-full mr-3"></span>
                Evolução de Fluxos de Caixa (Receitas)
            </h4>
            <span className="text-[10px] font-black bg-emerald-50 text-emerald-600 px-3 py-1 rounded-full uppercase tracking-tighter">Fluxo Realizado</span>
          </div>
          
          <div className="h-64 w-full relative z-10">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyYield}>
                <defs>
                  <linearGradient id="yieldColor" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 700, fill: '#94a3b8'}} />
                <YAxis hide />
                <Tooltip 
                    contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)' }}
                    labelStyle={{ fontWeight: '900', color: '#64748b', fontSize: '10px', textTransform: 'uppercase' }}
                />
                <Area type="monotone" dataKey="value" stroke="#10b981" strokeWidth={4} fillOpacity={1} fill="url(#yieldColor)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          
          <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
            <span className="material-icons-outlined text-[10rem]">trending_up</span>
          </div>
        </div>

        {/* Composição por Ativo */}
        <div className="bg-slate-900 text-white p-10 rounded-[3rem] shadow-2xl relative overflow-hidden flex flex-col">
            <h4 className="text-sm font-black text-emerald-400 uppercase tracking-widest mb-10">Ranking de Natureza</h4>
            <div className="space-y-6 relative z-10 flex-1">
                {yieldByCategory.map((item, idx) => (
                    <div key={item.name} className="space-y-2">
                        <div className="flex justify-between items-baseline">
                            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-tight">{item.name}</span>
                            <span className="text-xs font-black text-emerald-400">+{((item.value/totalYield)*100).toFixed(0)}%</span>
                        </div>
                        <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                            <div 
                                className="h-full bg-emerald-500 rounded-full transition-all duration-1000" 
                                style={{ width: `${(item.value/totalYield)*100}%` }}
                            ></div>
                        </div>
                    </div>
                ))}
            </div>
            <div className="mt-10 p-6 bg-white/5 rounded-2xl border border-white/10">
                <p className="text-[10px] text-slate-400 font-medium leading-relaxed italic">
                    "O património imobiliário (Jardim do Éden) continua a ser a principal fonte de rendimento recorrente da família, seguido pelos dividendos da Interactive Brokers."
                </p>
            </div>
        </div>
      </div>

      {/* Tabela Detalhada de Geração de Caixa */}
      <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-10 py-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
            <div>
                <h4 className="text-lg font-black text-slate-800 tracking-tight">Extrato Consolidado de Rendimentos</h4>
                <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">Conformidade Auditada Nov/Dez 2025</p>
            </div>
            <button className="flex items-center space-x-2 bg-slate-900 text-white px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-600 transition shadow-xl">
                <span className="material-icons-outlined text-sm">download</span>
                <span>Exportar Mapa Excel</span>
            </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] border-b border-slate-100">
              <tr>
                <th className="px-10 py-5">Data Pagamento</th>
                <th className="px-10 py-5">Ativo Gerador</th>
                <th className="px-10 py-5">Natureza do Provento</th>
                <th className="px-10 py-5">Conta PGC</th>
                <th className="px-10 py-5 text-right">Rendimento Bruto (AOA)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {yieldTransactions.map((t) => {
                const asset = MOCK_ASSETS.find(a => a.id === t.assetId);
                return (
                  <tr key={t.id} className="hover:bg-emerald-50/30 transition-colors group">
                    <td className="px-10 py-6">
                      <div className="font-black text-slate-800 tabular-nums">{new Date(t.date).toLocaleDateString('pt-AO')}</div>
                    </td>
                    <td className="px-10 py-6">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center text-slate-500 group-hover:bg-white transition-colors">
                            <span className="material-icons-outlined text-sm">auto_awesome</span>
                        </div>
                        <span className="font-bold text-slate-700">{asset?.name || 'Vários'}</span>
                      </div>
                    </td>
                    <td className="px-10 py-6">
                      <span className="px-3 py-1 bg-slate-100 rounded-full text-[10px] font-black uppercase tracking-widest text-slate-500 group-hover:bg-emerald-100 group-hover:text-emerald-700 transition-colors">
                        {t.category}
                      </span>
                    </td>
                    <td className="px-10 py-6">
                      <span className="font-mono text-[11px] text-blue-500 font-black">{t.accountCode}</span>
                    </td>
                    <td className="px-10 py-6 text-right">
                      <span className="text-lg font-black text-emerald-600 tabular-nums">+{t.amount.toLocaleString('pt-AO', { minimumFractionDigits: 2 })}</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Disclaimer / Rodapé Técnico */}
      <div className="flex items-center space-x-4 p-8 bg-blue-50 border border-blue-100 rounded-[2rem]">
         <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white shrink-0">
            <span className="material-icons-outlined">info</span>
         </div>
         <p className="text-xs font-bold text-blue-900/60 leading-relaxed uppercase tracking-wider">
            Este mapa consolida fluxos reais de caixa creditados nas contas da holding. Os valores apresentados para ativos internacionais (IBKR/Nedbank) são convertidos para Kwanza à taxa de fecho do dia anterior. Os impostos sobre aplicação de capitais (IAC) são provisionados pelo SFO se não retidos na fonte.
         </p>
      </div>
    </div>
  );
};
