
import React, { useState, useMemo } from 'react';
import { MOCK_TRANSACTIONS, PGC_ANGOLA } from '../constants';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as ChartTooltip, ResponsiveContainer, Cell, PieChart, Pie } from 'recharts';

const COLORS = ['#2563eb', '#3b82f6', '#60a5fa', '#93c5fd', '#bfdbfe', '#dbeafe'];

export const ExpenseReport: React.FC = () => {
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<'all' | 'fixed' | 'variable'>('all');
  const [startDate, setStartDate] = useState<string>('2025-12-01');
  const [endDate, setEndDate] = useState<string>('2025-12-31');

  // Categorias Classe 6 (Despesas)
  const expenseCategories = useMemo(() => {
    return PGC_ANGOLA.filter(acc => acc.category === 'expense' && acc.level && acc.level >= 3);
  }, []);

  const filteredTransactions = useMemo(() => {
    return MOCK_TRANSACTIONS.filter(t => {
      const account = PGC_ANGOLA.find(acc => acc.code === t.accountCode);
      const isExpense = account?.category === 'expense';
      if (!isExpense) return false;

      const matchesCategory = categoryFilter === 'all' || t.accountCode === categoryFilter;
      const matchesType = typeFilter === 'all' || (typeFilter === 'fixed' && t.isFixed) || (typeFilter === 'variable' && !t.isFixed);
      const matchesDate = t.date >= startDate && t.date <= endDate;

      return matchesCategory && matchesType && matchesDate;
    }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [categoryFilter, typeFilter, startDate, endDate]);

  const stats = useMemo(() => {
    const total = filteredTransactions.reduce((acc, t) => acc + t.amount, 0);
    const fixed = filteredTransactions.filter(t => t.isFixed).reduce((acc, t) => acc + t.amount, 0);
    const variable = total - fixed;
    const fixedRatio = total > 0 ? (fixed / total) * 100 : 0;
    return { total, fixed, variable, fixedRatio };
  }, [filteredTransactions]);

  const chartData = useMemo(() => {
    const data: Record<string, number> = {};
    filteredTransactions.forEach(t => {
      const desc = PGC_ANGOLA.find(acc => acc.code === t.accountCode)?.description || 'Outros';
      data[desc] = (data[desc] || 0) + t.amount;
    });
    return Object.entries(data).map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  }, [filteredTransactions]);

  const structureData = [
    { name: 'Custos Fixos', value: stats.fixed, fill: '#e11d48' },
    { name: 'Variáveis', value: stats.variable, fill: '#3b82f6' }
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h3 className="text-2xl font-black text-slate-800 flex items-center tracking-tight">
            <span className="material-icons-outlined text-blue-600 mr-2 text-3xl">analytics</span>
            Relatório de Despesas (Classe 6)
          </h3>
          <p className="text-sm text-slate-500 font-bold uppercase tracking-widest mt-1">Análise Dinâmica de Estrutura de Custos</p>
        </div>
        <div className="flex space-x-3">
           <button className="flex items-center px-6 py-2.5 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-800 transition shadow-xl">
             <span className="material-icons-outlined text-sm mr-2">print</span> Gerar PDF Auditado
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Main Filter Panel */}
        <div className="lg:col-span-2 bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Filtro por Categoria PGC (Classe 6)</label>
            <select 
              value={categoryFilter} 
              onChange={(e) => setCategoryFilter(e.target.value)} 
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-sm font-black text-slate-700 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all appearance-none"
            >
              <option value="all">📊 Todas as Despesas de Dezembro</option>
              {expenseCategories.map(cat => (
                <option key={cat.code} value={cat.code}>{cat.code} — {cat.description}</option>
              ))}
            </select>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
             <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Regime de Custo</label>
                <select 
                  value={typeFilter} 
                  onChange={(e) => setTypeFilter(e.target.value as any)} 
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-sm font-black text-slate-700 outline-none"
                >
                    <option value="all">Fixo + Variável</option>
                    <option value="fixed">Apenas Custos Fixos</option>
                    <option value="variable">Apenas Gastos Variáveis</option>
                </select>
             </div>
             <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Total Seleccionado</label>
                <div className="bg-slate-900 text-white rounded-2xl px-5 py-4 text-sm font-black flex items-baseline justify-between">
                    <span className="tabular-nums">{stats.total.toLocaleString()}</span>
                    <span className="text-[9px] opacity-50">AOA</span>
                </div>
             </div>
          </div>
        </div>

        {/* Rigidity Pie Chart */}
        <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm flex flex-col items-center justify-center text-center">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">Peso dos Custos Mensais</p>
            <div className="h-32 w-full relative">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie data={structureData} innerRadius={35} outerRadius={55} paddingAngle={5} dataKey="value" stroke="none">
                            {structureData.map((e,i)=><Cell key={i} fill={e.fill} />)}
                        </Pie>
                        <ChartTooltip />
                    </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex items-center justify-center flex-col pointer-events-none">
                    <span className="text-lg font-black text-slate-900">{stats.fixedRatio.toFixed(0)}%</span>
                </div>
            </div>
            <div className="mt-4 flex flex-col items-center">
                <span className="text-[9px] font-black text-rose-600 bg-rose-50 px-3 py-1 rounded-full uppercase tracking-widest border border-rose-100">
                    {stats.fixedRatio > 50 ? 'Estrutura Rígida' : 'Estrutura Flexível'}
                </span>
            </div>
        </div>

        {/* Total Card */}
        <div className="bg-rose-900 p-8 rounded-[2rem] shadow-2xl border border-rose-800 text-white flex flex-col justify-between relative overflow-hidden group">
            <div className="relative z-10">
                <p className="text-[10px] font-black text-rose-300 uppercase tracking-[0.3em] mb-2">Compromisso Fixo (Burn Rate)</p>
                <h4 className="text-3xl font-black tabular-nums tracking-tighter">{stats.fixed.toLocaleString()} <span className="text-xs font-normal">AOA</span></h4>
                <p className="text-[9px] text-rose-300 font-bold uppercase mt-4 flex items-center">
                    <span className="material-icons-outlined text-xs mr-1">history_toggle_off</span>
                    Custos Inadiáveis Mensais
                </p>
            </div>
            <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-110 transition-transform duration-700">
                <span className="material-icons-outlined text-8xl">lock</span>
            </div>
        </div>
      </div>

      <div className="bg-white p-10 rounded-[2.5rem] border border-slate-200 shadow-sm">
        <div className="flex justify-between items-center mb-10">
            <h4 className="text-sm font-black text-slate-800 uppercase tracking-widest flex items-center">
                <span className="w-2 h-6 bg-blue-600 rounded-full mr-3"></span>
                Concentração por Centro de Custo
            </h4>
            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Base: PGC Classe 6</div>
        </div>
        <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} layout="vertical" margin={{ left: 40 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                  <XAxis type="number" hide />
                  <YAxis dataKey="name" type="category" width={180} axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700, fill: '#475569' }} />
                  <ChartTooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                  <Bar dataKey="value" radius={[0, 10, 10, 0]} barSize={35}>
                    {chartData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                  </Bar>
                </BarChart>
            </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-slate-50 p-6 rounded-3xl border border-slate-200 flex items-center justify-between">
         <div className="flex items-center space-x-4">
            <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center text-slate-400">
                <span className="material-icons-outlined">info</span>
            </div>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest leading-relaxed">
                Este relatório foca-se na **Classe 6 (Despesas)**. Custos fixos são aqueles marcados como recorrentes mensais, 
                representando o custo de existência da holding e da família Primo Couto.
            </p>
         </div>
      </div>
    </div>
  );
};
