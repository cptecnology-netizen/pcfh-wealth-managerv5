
import React, { useState, useMemo } from 'react';
import { MOCK_TRANSACTIONS, PGC_ANGOLA, MOCK_ASSETS } from '../constants';
import { OutflowForm } from './OutflowForm';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, PieChart, Pie } from 'recharts';

const CATEGORY_COLORS = ['#e11d48', '#fb7185', '#f43f5e', '#ec4899', '#d946ef', '#a855f7', '#8b5cf6', '#6366f1'];

export const OutflowManager: React.FC = () => {
  const [outflows, setOutflows] = useState(() => 
    MOCK_TRANSACTIONS.filter(t => {
      const acc = PGC_ANGOLA.find(p => p.code === t.accountCode);
      return acc?.category === 'expense';
    })
  );
  
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewFilter, setViewFilter] = useState<'all' | 'fixed' | 'variable'>('all');

  const filteredOutflows = useMemo(() => {
    return outflows.filter(out => {
      const matchesSearch = out.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          out.category.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesType = viewFilter === 'all' || 
                         (viewFilter === 'fixed' && out.isFixed) ||
                         (viewFilter === 'variable' && !out.isFixed);

      return matchesSearch && matchesType;
    }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [outflows, searchTerm, viewFilter]);

  const totalOutflows = useMemo(() => filteredOutflows.reduce((s, t) => s + t.amount, 0), [filteredOutflows]);
  
  const fixedCommitment = useMemo(() => 
    outflows.filter(o => o.isFixed).reduce((s, t) => s + t.amount, 0)
  , [outflows]);

  const chartData = useMemo(() => {
    const groups: Record<string, number> = {};
    filteredOutflows.forEach(t => {
      groups[t.category] = (groups[t.category] || 0) + t.amount;
    });
    return Object.entries(groups).map(([name, value]) => ({ name, value })).sort((a,b) => b.value - a.value);
  }, [filteredOutflows]);

  const structureData = useMemo(() => [
    { name: 'Custos Fixos', value: fixedCommitment, fill: '#e11d48' },
    { name: 'Gastos Variáveis', value: Math.max(0, outflows.reduce((s,o)=>s+o.amount, 0) - fixedCommitment), fill: '#fb7185' }
  ], [outflows, fixedCommitment]);

  const handleOutflowSuccess = (newOutflow: any) => {
    setOutflows([newOutflow, ...outflows]);
    setShowForm(false);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h3 className="text-3xl font-black text-slate-900 tracking-tight flex items-center">
            <span className="material-icons-outlined text-rose-600 mr-3 text-4xl">trending_down</span>
            Saídas de Caixa
          </h3>
          <p className="text-sm text-slate-500 font-bold uppercase tracking-widest mt-1">Gestão de Custos Fixos e Variáveis</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-4">
            <div className="bg-slate-100 p-1.5 rounded-2xl flex space-x-1">
                {['all', 'fixed', 'variable'].map(f => (
                    <button
                        key={f}
                        onClick={() => setViewFilter(f as any)}
                        className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                            viewFilter === f ? 'bg-white text-rose-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'
                        }`}
                    >
                        {f === 'all' ? 'Tudo' : f === 'fixed' ? 'Fixos' : 'Variáveis'}
                    </button>
                ))}
            </div>
            <button 
                onClick={() => setShowForm(true)}
                className="bg-slate-900 text-white px-6 py-3.5 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center shadow-xl hover:bg-slate-800 transition-all active:scale-95"
            >
                <span className="material-icons-outlined mr-2">add_shopping_cart</span>
                Novo Gasto
            </button>
        </div>
      </div>

      {showForm && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-md">
          <div className="w-full max-w-2xl">
            <OutflowForm onSuccess={handleOutflowSuccess} onCancel={() => setShowForm(false)} />
          </div>
        </div>
      )}

      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-rose-900 p-8 rounded-[2.5rem] text-white shadow-2xl relative overflow-hidden group">
          <p className="text-[10px] font-black text-rose-400 uppercase tracking-[0.3em] mb-2">Total no Período</p>
          <div className="flex items-baseline space-x-2">
            <h4 className="text-3xl font-black tabular-nums">{totalOutflows.toLocaleString('pt-AO')}</h4>
            <span className="text-xs font-bold text-rose-400">AOA</span>
          </div>
          <div className="absolute -bottom-6 -right-6 opacity-10 rotate-12 group-hover:scale-110 transition-transform duration-700">
            <span className="material-icons-outlined text-9xl">trending_down</span>
          </div>
        </div>

        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm flex flex-col justify-between">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Comprometimento Fixo Mensal</p>
          <div className="flex items-baseline space-x-2 mt-2">
            <h4 className="text-3xl font-black text-slate-900 tabular-nums">{fixedCommitment.toLocaleString('pt-AO')}</h4>
            <span className="text-xs font-bold text-slate-400">AOA / mês</span>
          </div>
          <p className="text-[10px] text-rose-500 font-black mt-4 uppercase tracking-widest flex items-center">
            <span className="material-icons-outlined text-xs mr-1">event_repeat</span>
            Custos Recorrentes Identificados
          </p>
        </div>

        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm flex flex-col justify-between">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Estrutura de Gastos</p>
          <div className="flex items-center space-x-4 mt-2">
            <div className="h-16 w-16">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie data={structureData} innerRadius={20} outerRadius={30} dataKey="value" stroke="none">
                            {structureData.map((e,i)=><Cell key={i} fill={e.fill} />)}
                        </Pie>
                    </PieChart>
                </ResponsiveContainer>
            </div>
            <div>
                <h4 className="text-2xl font-black text-slate-900">
                    {((fixedCommitment/Math.max(1, outflows.reduce((s,o)=>s+o.amount, 0)))*100).toFixed(0)}%
                </h4>
                <p className="text-[9px] font-bold text-slate-400 uppercase">Peso dos Fixos</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* Chart */}
        <div className="lg:col-span-3 bg-white p-10 rounded-[2.5rem] border border-slate-200 shadow-sm">
          <h4 className="text-sm font-black text-slate-800 uppercase tracking-widest mb-10 flex items-center">
            <span className="w-2 h-6 bg-rose-500 rounded-full mr-3"></span>
            Distribuição por Centro de Custo
          </h4>
          <div className="h-80 w-full">
            {chartData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} layout="vertical" margin={{ left: 40 }}>
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                    <XAxis type="number" hide />
                    <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700, fill: '#64748b' }} width={140} />
                    <Tooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)' }} />
                    <Bar dataKey="value" radius={[0, 10, 10, 0]} barSize={40}>
                        {chartData.map((_, i) => <Cell key={i} fill={CATEGORY_COLORS[i % CATEGORY_COLORS.length]} />)}
                    </Bar>
                </BarChart>
                </ResponsiveContainer>
            ) : (
                <div className="h-full flex items-center justify-center text-slate-300 italic font-bold">Sem dados de gastos.</div>
            )}
          </div>
        </div>

        {/* Categories Panel */}
        <div className="lg:col-span-2 space-y-4">
            <div className="bg-rose-50 p-6 rounded-3xl border border-rose-100">
                <p className="text-[10px] font-black text-rose-600 uppercase tracking-widest mb-2">Nota Estratégica</p>
                <p className="text-xs text-rose-900 font-medium leading-relaxed">
                    A Primo Couto Holdings possui um comprometimento fixo mensal de <span className="font-bold">{(fixedCommitment/1000).toFixed(0)}k AOA</span>. 
                    Recomenda-se manter uma reserva de liquidez equivalente a 6 meses destes custos.
                </p>
            </div>
            {chartData.map((item, idx) => (
                <div key={item.name} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center justify-between hover:border-rose-200 transition-colors">
                    <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: CATEGORY_COLORS[idx % CATEGORY_COLORS.length] + '15' }}>
                            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: CATEGORY_COLORS[idx % CATEGORY_COLORS.length] }}></div>
                        </div>
                        <div>
                            <p className="text-xs font-black text-slate-800 uppercase tracking-tight">{item.name}</p>
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">{((item.value/totalOutflows)*100).toFixed(1)}% do total</p>
                        </div>
                    </div>
                    <span className="text-sm font-black text-slate-900 tabular-nums">{item.value.toLocaleString('pt-AO')}</span>
                </div>
            ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
            <h4 className="text-sm font-black text-slate-800 uppercase tracking-widest">Diário de Saídas</h4>
            <div className="flex space-x-2">
                 <button className="p-2 hover:bg-white rounded-lg transition"><span className="material-icons-outlined text-slate-400">print</span></button>
            </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] border-b border-slate-100">
              <tr>
                <th className="px-8 py-5">Data / ID</th>
                <th className="px-8 py-5">Tipo</th>
                <th className="px-8 py-5">Finalidade</th>
                <th className="px-8 py-5">Natureza (PGC)</th>
                <th className="px-8 py-5 text-right">Montante (AOA)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {filteredOutflows.map((t) => (
                <tr key={t.id} className="hover:bg-rose-50/30 transition-colors group">
                  <td className="px-8 py-6">
                    <div className="font-black text-slate-800">{new Date(t.date).toLocaleDateString('pt-AO')}</div>
                    <div className="text-[10px] font-bold text-slate-400 mt-0.5">{t.id}</div>
                  </td>
                  <td className="px-8 py-6">
                    {t.isFixed ? (
                        <div className="flex items-center text-[9px] font-black text-rose-600 bg-rose-50 border border-rose-200 px-2 py-1 rounded-full uppercase tracking-tighter w-fit">
                            <span className="material-icons-outlined text-[10px] mr-1">calendar_month</span>
                            Fixa / Mensal
                        </div>
                    ) : (
                        <div className="flex items-center text-[9px] font-black text-slate-400 bg-slate-50 border border-slate-200 px-2 py-1 rounded-full uppercase tracking-tighter w-fit">
                            <span className="material-icons-outlined text-[10px] mr-1">shopping_bag</span>
                            Variável
                        </div>
                    )}
                  </td>
                  <td className="px-8 py-6">
                    <span className="font-bold text-slate-700">{t.description}</span>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex flex-col">
                      <span className="font-bold text-slate-700">{t.category}</span>
                      <span className="text-[10px] font-black text-rose-500 bg-rose-50 px-2 py-0.5 rounded w-fit mt-1 border border-rose-100">PGC {t.accountCode}</span>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <span className="text-lg font-black text-rose-600 tabular-nums">-{t.amount.toLocaleString('pt-AO', { minimumFractionDigits: 2 })}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredOutflows.length === 0 && (
            <div className="py-24 text-center">
                <span className="material-icons-outlined text-slate-100 text-8xl mb-4">remove_shopping_cart</span>
                <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Nenhum gasto registado.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
