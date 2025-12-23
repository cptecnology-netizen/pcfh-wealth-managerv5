
import React, { useState } from 'react';
import { MOCK_ASSETS, PGC_ANGOLA, MOCK_ENTITIES } from '../constants';
import { Currency } from '../types';
import { wealthAnalyst } from '../services/geminiService';

interface InflowFormProps {
  onSuccess: (transaction: any) => void;
  onCancel: () => void;
}

export const InflowForm: React.FC<InflowFormProps> = ({ onSuccess, onCancel }) => {
  const [formData, setFormData] = useState({
    assetId: MOCK_ASSETS[0]?.id || '',
    sourceEntityId: MOCK_ENTITIES[0]?.id || '',
    amount: '',
    currency: 'AOA' as Currency,
    description: '',
    accountCode: '7511', // Default: Juros de DP
    date: new Date().toISOString().split('T')[0]
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAISuggesting, setIsAISuggesting] = useState(false);

  const revenueAccounts = PGC_ANGOLA.filter(acc => 
    (acc.category === 'revenue' || acc.category === 'equity') && acc.level && acc.level >= 3
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAISuggest = async () => {
    if (!formData.description.trim()) return;
    setIsAISuggesting(true);
    const suggestedCode = await wealthAnalyst.suggestCategory(formData.description, PGC_ANGOLA);
    setFormData(prev => ({ ...prev, accountCode: suggestedCode }));
    setIsAISuggesting(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      const newInflow = {
        id: `INF-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
        ...formData,
        amount: parseFloat(formData.amount),
        category: PGC_ANGOLA.find(a => a.code === formData.accountCode)?.description || 'Receita Diversa'
      };
      
      setIsSubmitting(false);
      onSuccess(newInflow);
    }, 800);
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-300">
      <div className="bg-emerald-900 px-8 py-6 flex justify-between items-center">
        <div>
          <h3 className="text-xl font-bold text-white flex items-center">
            <span className="material-icons-outlined mr-2 text-emerald-400">trending_up</span>
            Registar Nova Entrada de Caixa
          </h3>
          <p className="text-emerald-400/80 text-xs uppercase tracking-widest mt-1 font-semibold">Rendimentos, Dividendos e Aportes</p>
        </div>
        <button onClick={onCancel} className="text-emerald-400 hover:text-white transition">
          <span className="material-icons-outlined">close</span>
        </button>
      </div>

      <form onSubmit={handleSubmit} className="p-8 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Origem do Capital (Entidade)</label>
            <div className="relative">
              <select
                name="sourceEntityId"
                value={formData.sourceEntityId}
                onChange={handleChange}
                required
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition outline-none font-bold text-slate-700 appearance-none"
              >
                {MOCK_ENTITIES.filter(e => ['bank', 'investment_manager', 'other_entity'].includes(e.type)).map(entity => (
                  <option key={entity.id} value={entity.id}>{entity.name} ({entity.type.replace('_', ' ')})</option>
                ))}
              </select>
              <span className="material-icons-outlined absolute right-4 top-3.5 text-slate-400 pointer-events-none">business</span>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Destino do Capital (Ativo)</label>
            <div className="relative">
              <select
                name="assetId"
                value={formData.assetId}
                onChange={handleChange}
                required
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition outline-none font-bold text-slate-700 appearance-none"
              >
                {MOCK_ASSETS.map(asset => (
                  <option key={asset.id} value={asset.id}>{asset.name} ({asset.currency})</option>
                ))}
              </select>
              <span className="material-icons-outlined absolute right-4 top-3.5 text-slate-400 pointer-events-none">account_balance_wallet</span>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Valor Recebido</label>
            <div className="flex space-x-2">
              <input
                type="number"
                step="0.01"
                name="amount"
                placeholder="0,00"
                value={formData.amount}
                onChange={handleChange}
                required
                className="flex-1 bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition outline-none font-black text-slate-800"
              />
              <select
                name="currency"
                value={formData.currency}
                onChange={handleChange}
                className="w-24 bg-slate-100 border border-slate-200 rounded-2xl px-2 py-3 text-xs font-black text-slate-600 focus:outline-none"
              >
                <option value="AOA">AOA</option>
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Data do Recebimento</label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              required
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition outline-none font-bold text-slate-700"
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <div className="flex justify-between items-center">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Natureza da Receita (PGC)</label>
              <button 
                type="button" 
                onClick={handleAISuggest}
                disabled={isAISuggesting || !formData.description}
                className="text-[9px] font-black text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full uppercase tracking-widest hover:bg-emerald-100 transition flex items-center disabled:opacity-30"
              >
                <span className={`material-icons-outlined text-[10px] mr-1 ${isAISuggesting ? 'animate-spin' : ''}`}>psychology</span>
                Auto-Categorizar com IA
              </button>
            </div>
            <div className="relative">
              <select
                name="accountCode"
                value={formData.accountCode}
                onChange={handleChange}
                required
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition outline-none font-bold text-slate-700 appearance-none"
              >
                {revenueAccounts.map(acc => (
                  <option key={acc.code} value={acc.code}>{acc.code} - {acc.description}</option>
                ))}
              </select>
              <span className="material-icons-outlined absolute right-4 top-3.5 text-slate-400 pointer-events-none">auto_graph</span>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Descrição / Justificação</label>
          <textarea
            name="description"
            rows={3}
            placeholder="Ex: Pagamento semestral de dividendos..."
            value={formData.description}
            onChange={handleChange}
            required
            className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition outline-none text-slate-700 resize-none font-medium"
          />
        </div>

        <div className="flex items-center justify-end space-x-4 pt-4 border-t border-slate-100">
          <button type="button" onClick={onCancel} className="px-6 py-3 rounded-2xl text-sm font-bold text-slate-500 hover:bg-slate-50 transition">Voltar</button>
          <button
            type="submit"
            disabled={isSubmitting}
            className={`px-10 py-3 rounded-2xl text-sm font-bold text-white shadow-xl flex items-center transition-all ${isSubmitting ? 'bg-slate-400' : 'bg-emerald-600 hover:bg-emerald-700 active:scale-95'}`}
          >
            {isSubmitting ? <span className="material-icons-outlined animate-spin mr-2 text-sm">sync</span> : <span className="material-icons-outlined mr-2">add_task</span>}
            Registar Entrada
          </button>
        </div>
      </form>
    </div>
  );
};
