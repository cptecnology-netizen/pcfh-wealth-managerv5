
import React, { useState, useMemo } from 'react';
import { MOCK_TRANSACTIONS, PGC_ANGOLA, MOCK_ASSETS } from '../constants';
import { TransactionForm } from './TransactionForm';

export const TransactionsPage: React.FC = () => {
  const [transactions, setTransactions] = useState(MOCK_TRANSACTIONS);
  const [showForm, setShowForm] = useState(false);
  const [filter, setFilter] = useState('all');

  const filteredTransactions = useMemo(() => {
    return transactions.filter(t => {
      if (filter === 'all') return true;
      const acc = PGC_ANGOLA.find(p => p.code === t.accountCode);
      return acc?.category === filter;
    }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [transactions, filter]);

  const stats = useMemo(() => {
    const expenses = transactions.filter(t => PGC_ANGOLA.find(p => p.code === t.accountCode)?.category === 'expense');
    const totalExp = expenses.reduce((s, t) => s + t.amount, 0);
    const fixedExp = expenses.filter(t => t.isFixed).reduce((s, t) => s + t.amount, 0);
    const fixedRatio = totalExp > 0 ? (fixedExp / totalExp) * 100 : 0;

    return { totalExp, fixedExp, fixedRatio };
  }, [transactions]);

  const handleAddSuccess = (newTx: any) => {
    setTransactions([newTx, ...transactions]);
    setShowForm(false);
  };

  const getAssetName = (id: string) => MOCK_ASSETS.find(a => a.id === id)?.name || 'Conta Externa';

  return (
    <div className="space-y-6 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h3 className="text-2xl font-bold text-slate-800 flex items-center tracking-tight">
            <span className="material-icons-outlined text-blue-600 mr-2 text-3xl">receipt_long</span>
            Diário de Transações
          </h3>
          <p className="text-sm text-slate-500 font-medium">Controlo centralizado de entradas e saídas patrimoniais.</p>
        </div>
        
        <button 
          onClick={() => setShowForm(true)}
          className="bg-slate-900 text-white px-6 py-3 rounded-2xl font-bold flex items-center shadow-2xl hover:bg-slate-800 transition transform hover:-translate-y-1 active:translate-y-0"
        >
          <span className="material-icons-outlined mr-2">add_circle</span>
          Novo Lançamento
        </button>
      </div>

      {showForm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="w-full max-w-2xl">
            <TransactionForm onSuccess={handleAddSuccess} onCancel={() => setShowForm(false)} />
          </div>
        </div>
      )}

      {/* Stats Summary Bar */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center space-x-4">
          <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
            <span className="material-icons-outlined">import_export</span>
          </div>
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Registos</p>
            <p className="text-xl font-black text-slate-800">{transactions.length}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-center">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Comprometimento Fixo</p>
            <p className="text-xl font-black text-rose-600 tabular-nums">{stats.fixedExp.toLocaleString()} <span className="text-xs">AOA</span></p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-center">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Peso da Estrutura Fixa</p>
            <div className="flex items-center space-x-2 mt-1">
                <p className="text-xl font-black text-slate-800">{stats.fixedRatio.toFixed(1)}%</p>
                <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-rose-500" style={{ width: `${stats.fixedRatio}%` }}></div>
                </div>
            </div>
        </div>
        <div className="bg-emerald-900 p-6 rounded-2xl shadow-xl flex flex-col justify-center text-white">
          <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">Receitas do Mês</p>
          <p className="text-xl font-black tabular-nums">
            {transactions.filter(t => PGC_ANGOLA.find(p => p.code === t.accountCode)?.category === 'revenue').reduce((s,t) => s+t.amount, 0).toLocaleString()} <span className="text-xs">AOA</span>
          </p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex space-x-2 border-b border-slate-200">
        {['all', 'revenue', 'expense'].map((cat) => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={`px-6 py-3 text-sm font-bold border-b-2 transition-all capitalize ${filter === cat ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-400 hover:text-slate-600'}`}
          >
            {cat === 'all' ? 'Tudo' : cat === 'revenue' ? 'Receitas' : 'Despesas'}
          </button>
        ))}
      </div>

      {/* Transactions List */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Data / Recorrência</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Conta Patrimonial</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Descrição / PGC</th>
                <th className="px-6 py-4 text-right text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Montante</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredTransactions.map((t) => {
                const isRevenue = PGC_ANGOLA.find(p => p.code === t.accountCode)?.category === 'revenue';
                return (
                  <tr key={t.id} className="hover:bg-slate-50/80 transition-colors group">
                    <td className="px-6 py-5">
                      <div className="text-sm font-bold text-slate-800">{new Date(t.date).toLocaleDateString('pt-AO')}</div>
                      {t.isFixed && (
                        <span className="flex items-center text-[9px] font-black text-rose-600 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded-full uppercase tracking-tighter w-fit mt-1">
                          <span className="material-icons-outlined text-[10px] mr-1">event_repeat</span> Fixo Mensal
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-5">
                      <div className="text-sm font-semibold text-slate-700 flex items-center">
                        <span className="material-icons-outlined text-slate-400 text-xs mr-2">link</span>
                        {getAssetName(t.assetId)}
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="text-sm font-bold text-slate-800">{t.description}</div>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className="text-[10px] bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded font-mono border border-slate-200">
                          PGC: {t.accountCode}
                        </span>
                        <span className="text-[10px] text-slate-400 italic">
                          {PGC_ANGOLA.find(p => p.code === t.accountCode)?.description}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-5 text-right">
                      <div className={`text-lg font-black tabular-nums ${isRevenue ? 'text-emerald-600' : 'text-red-600'}`}>
                        {isRevenue ? '+' : '-'} {t.amount.toLocaleString('pt-AO', { minimumFractionDigits: 2 })}
                      </div>
                      <div className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">AOA Consolidado</div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
