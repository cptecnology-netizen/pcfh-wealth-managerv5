
import React, { useState, useMemo } from 'react';
import { MOCK_TRANSACTIONS, PGC_ANGOLA, MOCK_ASSETS, MOCK_ENTITIES } from '../constants';
import { InflowForm } from './InflowForm';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, PieChart, Pie } from 'recharts';
import { EntityType } from '../types';

const SOURCE_COLORS = {
  bank: '#2563eb',
  investment_manager: '#10b981',
  other_entity: '#f59e0b'
};

export const InflowManager: React.FC = () => {
  const [inflows, setInflows] = useState(() => 
    MOCK_TRANSACTIONS.filter(t => {
      const acc = PGC_ANGOLA.find(p => p.code === t.accountCode);
      return acc?.category === 'revenue' || acc?.category === 'equity';
    })
  );
  
  const [showForm, setShowForm] = useState(false);
  const [typeFilter, setTypeFilter] = useState<EntityType | 'all'>('all');

  const filteredInflows = useMemo(() => {
    if (typeFilter === 'all') return inflows;
    return inflows.filter(inf => {
      const entity = MOCK_ENTITIES.find(e => e.id === inf.sourceEntityId);
      return entity?.type === typeFilter;
    });
  }, [inflows, typeFilter]);

  const totalInflows = useMemo(() => filteredInflows.reduce((s, t) => s + t.amount, 0), [filteredInflows]);
  
  const chartDataByCategory = useMemo(() => {
    const groups: Record<string, number> = {};
    filteredInflows.forEach(t => {
      const category = PGC_ANGOLA.find(p => p.code === t.accountCode)?.description || 'Outros';
      groups[category] = (groups[category] || 0) + t.amount;
    });
    return Object.entries(groups).map(([name, value]) => ({ name, value })).sort((a,b) => b.value - a.value);
  }, [filteredInflows]);

  const chartDataBySourceType = useMemo(() => {
    const groups: Record<string, number> = { bank: 0, investment_manager: 0, other_entity: 0 };
    inflows.forEach(inf => {
      const entity = MOCK_ENTITIES.find(e => e.id === inf.sourceEntityId);
      const type = entity?.type as keyof typeof groups || 'other_entity';
      if (groups[type] !== undefined) {
        groups[type] += inf.amount;
      }
    });
    return [
      { name: 'Bancos', value: groups.bank, type: 'bank' },
      { name: 'Gestoras de Investimento', value: groups.investment_manager, type: 'investment_manager' },
      { name: 'Outras Entidades', value: groups.other_entity, type: 'other_entity' }
    ].filter(d => d.value > 0);
  }, [inflows]);

  const handleInflowSuccess = (newInflow: any) => {
    setInflows([newInflow, ...inflows]);
    setShowForm(false);
  };

  const getAssetName = (id: string) => MOCK_ASSETS.find(a => a.id === id)?.name || 'Conta PCFH';
  const getEntityName = (id?: string) => MOCK_ENTITIES.find(e => e.id === id)?.name || 'Desconhecido';

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <h3 className="text-3xl font-black text-slate-900 tracking-tight flex items-center">
            <span className="material-icons-outlined text-emerald-600 mr-3 text-4xl">payments</span>
            Fluxos de Entrada
          </h3>
          <p className="text-sm text-slate-500 font-bold uppercase tracking-widest mt-1">Gestão de Receitas por Origem e Categoria</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-3">
            <div className="bg-slate-100 p-1.5 rounded-2xl flex space-x-1 shadow-inner">
                {['all', 'bank', 'investment_manager', 'other_entity'].map(t => (
                    <button
                        key={t}
                        onClick={() => setTypeFilter(t as any)}
                        className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                            typeFilter === t ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'
                        }`}
                    >
                        {t === 'all' ? 'Tudo' : t === 'bank' ? 'Bancos' : t === 'investment_manager' ? 'Gestoras' : 'Outros'}
                    </button>
                ))}
            </div>
            <button 
                onClick={() => setShowForm(true)}
                className="bg-emerald-600 text-white px-6 py-3.5 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center shadow-xl hover:bg-emerald-700 transition-all active:scale-95"
            >
                <span className="material-icons-outlined mr-2">add_circle</span>
                Registar Rendimento
            </button>
        </div>
      </div>

      {showForm && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-md">
          <div className="w-full max-w-2xl">
            <InflowForm onSuccess={handleInflowSuccess} onCancel={() => setShowForm(false)} />
          </div>
        </div>
      )}

      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Inflow Selecionado</p>
          <h4 className="text-3xl font-black text-emerald-600 mt-2 tracking-tighter tabular-nums">
            {totalInflows.toLocaleString('pt-AO')} <span className="text-xs text-slate-400 ml-1">AOA</span>
          </h4>
        </div>
        {chartDataBySourceType.map(d => (
            <div key={d.type} className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm flex flex-col justify-between">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{d.name}</p>
                <h4 className="text-2xl font-black text-slate-800 mt-2 tabular-nums">
                    {d.value.toLocaleString('pt-AO')} <span className="text-xs text-slate-400 ml-1">AOA</span>
                </h4>
                <div className="h-1 w-full bg-slate-100 rounded-full mt-4 overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: `${(d.value/Math.max(1, inflows.reduce((s,i)=>s+i.amount, 0)))*100}%`, backgroundColor: SOURCE_COLORS[d.type as keyof typeof SOURCE_COLORS] }}></div>
                </div>
            </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* Chart: Composition by Category */}
        <div className="lg:col-span-3 bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm">
          <div className="flex justify-between items-center mb-8">
            <h4 className="text-sm font-black text-slate-800 uppercase tracking-widest">Composição por Natureza (PGC)</h4>
            <div className="text-[10px] text-slate-400 font-bold uppercase">Base: {typeFilter === 'all' ? 'Consolidado' : typeFilter}</div>
          </div>
          <div className="h-80 w-full">
            {chartDataByCategory.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartDataByCategory} layout="vertical" margin={{ left: 40 }}>
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                    <XAxis type="number" hide />
                    <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700, fill: '#64748b' }} width={120} />
                    <Tooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)' }} />
                    <Bar dataKey="value" radius={[0, 10, 10, 0]} barSize={40}>
                    {chartDataByCategory.map((_, i) => <Cell key={i} fill={['#10b981', '#34d399', '#6ee7b7', '#a7f3d0'][i % 4]} />)}
                    </Bar>
                </BarChart>
                </ResponsiveContainer>
            ) : (
                <div className="h-full flex items-center justify-center text-slate-300 italic font-bold">Sem dados para este filtro.</div>
            )}
          </div>
        </div>

        {/* Chart: Source Report */}
        <div className="lg:col-span-2 bg-slate-900 p-8 rounded-[2.5rem] shadow-2xl relative overflow-hidden flex flex-col">
          <h4 className="text-sm font-black text-emerald-400 uppercase tracking-widest mb-8 relative z-10">Relatório de Fontes de Capital</h4>
          <div className="h-64 relative z-10">
            <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                    <Pie
                        data={chartDataBySourceType}
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                        stroke="none"
                    >
                        {chartDataBySourceType.map((entry) => (
                            <Cell key={entry.type} fill={SOURCE_COLORS[entry.type as keyof typeof SOURCE_COLORS]} />
                        ))}
                    </Pie>
                    <Tooltip 
                        contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '12px', color: '#fff' }}
                        itemStyle={{ color: '#fff', fontSize: '12px', fontWeight: 'bold' }}
                    />
                </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <span className="material-icons-outlined text-emerald-500/20 text-5xl">pie_chart</span>
            </div>
          </div>
          <div className="mt-8 space-y-4 relative z-10">
              {chartDataBySourceType.map(d => (
                  <div key={d.type} className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: SOURCE_COLORS[d.type as keyof typeof SOURCE_COLORS] }}></div>
                        <span className="text-[11px] font-bold text-slate-400 uppercase">{d.name}</span>
                      </div>
                      <span className="text-xs font-black text-white">{((d.value/Math.max(1, inflows.reduce((s,i)=>s+i.amount,0)))*100).toFixed(1)}%</span>
                  </div>
              ))}
          </div>
        </div>
      </div>

      {/* Detailed Table */}
      <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
            <h4 className="text-sm font-black text-slate-800 uppercase tracking-widest">Registo de Entradas Detalhado</h4>
            <div className="flex space-x-2">
                 <button className="p-2 hover:bg-white rounded-lg transition"><span className="material-icons-outlined text-slate-400">file_download</span></button>
                 <button className="p-2 hover:bg-white rounded-lg transition"><span className="material-icons-outlined text-slate-400">print</span></button>
            </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] border-b border-slate-100">
              <tr>
                <th className="px-8 py-5">Data / ID</th>
                <th className="px-8 py-5">Entidade Origem</th>
                <th className="px-8 py-5">Destino Ativo</th>
                <th className="px-8 py-5">Natureza / PGC</th>
                <th className="px-8 py-5 text-right">Montante (AOA)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {filteredInflows.map((t) => {
                const entity = MOCK_ENTITIES.find(e => e.id === t.sourceEntityId);
                return (
                  <tr key={t.id} className="hover:bg-slate-50/80 transition-colors group">
                    <td className="px-8 py-6">
                      <div className="font-black text-slate-800">{new Date(t.date).toLocaleDateString('pt-AO')}</div>
                      <div className="text-[10px] font-bold text-slate-400 mt-0.5">{t.id}</div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center space-x-2">
                        <span className={`material-icons-outlined text-sm ${
                            entity?.type === 'bank' ? 'text-blue-500' : 
                            entity?.type === 'investment_manager' ? 'text-emerald-500' : 
                            'text-amber-500'
                        }`}>
                            {entity?.type === 'bank' ? 'account_balance' : entity?.type === 'investment_manager' ? 'show_chart' : 'business'}
                        </span>
                        <span className="font-bold text-slate-700">{getEntityName(t.sourceEntityId)}</span>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <span className="text-slate-500 font-medium">{getAssetName(t.assetId)}</span>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex flex-col">
                        <span className="font-bold text-slate-700">{t.category}</span>
                        <span className="text-[10px] font-black text-blue-500 bg-blue-50 px-2 py-0.5 rounded w-fit mt-1 border border-blue-100">PGC {t.accountCode}</span>
                      </div>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <span className="text-lg font-black text-emerald-600 tabular-nums">+{t.amount.toLocaleString('pt-AO', { minimumFractionDigits: 2 })}</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {filteredInflows.length === 0 && (
            <div className="py-24 text-center">
                <span className="material-icons-outlined text-slate-100 text-8xl mb-4">inbox</span>
                <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Sem registos para os critérios selecionados.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
