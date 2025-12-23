
import React, { useState, useRef } from 'react';
import { MOCK_ASSETS, PGC_ANGOLA } from '../constants';
import { Currency } from '../types';
import { wealthAnalyst } from '../services/geminiService';

interface TransactionFormProps {
  onSuccess: (transaction: any) => void;
  onCancel: () => void;
}

export const TransactionForm: React.FC<TransactionFormProps> = ({ onSuccess, onCancel }) => {
  const [formData, setFormData] = useState({
    assetId: MOCK_ASSETS[0]?.id || '',
    amount: '',
    currency: 'AOA' as Currency,
    description: '',
    accountCode: '6211', // Default: Supermercado
    date: new Date().toISOString().split('T')[0],
    isFixed: false
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAISuggesting, setIsAISuggesting] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const availableAccounts = PGC_ANGOLA.filter(acc => 
    (acc.category === 'expense' || acc.category === 'revenue') && acc.level && acc.level >= 3
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const val = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
    setFormData(prev => ({ ...prev, [name]: val }));
  };

  const handleAISuggest = async () => {
    if (!formData.description.trim()) return;
    setIsAISuggesting(true);
    const suggestedCode = await wealthAnalyst.suggestCategory(formData.description, PGC_ANGOLA);
    setFormData(prev => ({ ...prev, accountCode: suggestedCode }));
    setIsAISuggesting(false);
  };

  const handleScanReceipt = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsScanning(true);
    try {
      const reader = new FileReader();
      reader.onload = async () => {
        const base64 = (reader.result as string).split(',')[1];
        const result = await wealthAnalyst.analyzeReceipt(base64, file.type);
        
        setFormData(prev => ({
          ...prev,
          description: result.description || prev.description,
          amount: result.amount?.toString() || prev.amount,
          currency: (['AOA', 'USD', 'EUR'].includes(result.currency) ? result.currency : prev.currency) as Currency,
          date: result.date || prev.date,
          accountCode: result.suggestedPGCAccount || prev.accountCode
        }));
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error("Scan error:", error);
      alert("Falha ao digitalizar recibo. Tente novamente.");
    } finally {
      setIsScanning(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      const newTransaction = {
        id: Math.random().toString(36).substr(2, 9),
        ...formData,
        amount: parseFloat(formData.amount),
        category: PGC_ANGOLA.find(a => a.code === formData.accountCode)?.description || 'Outros'
      };
      
      setIsSubmitting(false);
      onSuccess(newTransaction);
    }, 800);
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-300">
      <div className="bg-slate-900 px-8 py-6 flex justify-between items-center">
        <div>
          <h3 className="text-xl font-bold text-white flex items-center">
            <span className="material-icons-outlined mr-2 text-blue-400">add_card</span>
            Novo Lançamento Contabilístico
          </h3>
          <p className="text-slate-400 text-xs uppercase tracking-widest mt-1 font-semibold">Registo em conformidade com PGC</p>
        </div>
        <div className="flex items-center space-x-4">
          <button 
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={isScanning}
            className="flex items-center space-x-2 bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 border border-blue-600/30 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all"
          >
            <span className={`material-icons-outlined text-sm ${isScanning ? 'animate-spin' : ''}`}>
              {isScanning ? 'sync' : 'photo_camera'}
            </span>
            <span>{isScanning ? 'Digitalizando...' : 'Digitalizar Recibo'}</span>
          </button>
          <input type="file" accept="image/*" className="hidden" ref={fileInputRef} onChange={handleScanReceipt} />
          <button onClick={onCancel} className="text-slate-400 hover:text-white transition"><span className="material-icons-outlined">close</span></button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="p-8 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Conta Financeira</label>
            <select name="assetId" value={formData.assetId} onChange={handleChange} required className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm font-bold text-slate-700 outline-none">
              {MOCK_ASSETS.map(asset => <option key={asset.id} value={asset.id}>{asset.name} ({asset.currency})</option>)}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Data do Fluxo</label>
            <input type="date" name="date" value={formData.date} onChange={handleChange} required className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm font-bold text-slate-700 outline-none" />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Valor</label>
            <div className="flex space-x-2">
              <input type="number" step="0.01" name="amount" value={formData.amount} onChange={handleChange} required className="flex-1 bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm font-black text-slate-800 outline-none" placeholder="0,00" />
              <select name="currency" value={formData.currency} onChange={handleChange} className="w-24 bg-slate-100 border border-slate-200 rounded-2xl px-2 py-3 text-xs font-black text-slate-600 outline-none">
                <option value="AOA">AOA</option>
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Conta PGC</label>
              <button type="button" onClick={handleAISuggest} disabled={isAISuggesting} className="text-[9px] font-black text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full uppercase tracking-widest hover:bg-blue-100 transition flex items-center">
                <span className={`material-icons-outlined text-[10px] mr-1 ${isAISuggesting ? 'animate-spin' : ''}`}>psychology</span> Sugerir
              </button>
            </div>
            <select name="accountCode" value={formData.accountCode} onChange={handleChange} required className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm font-bold text-slate-700 outline-none">
              {availableAccounts.map(acc => <option key={acc.code} value={acc.code}>{acc.code} - {acc.description}</option>)}
            </select>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Descrição</label>
          <textarea name="description" rows={2} value={formData.description} onChange={handleChange} required className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm font-medium text-slate-700 outline-none resize-none" />
        </div>

        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 flex items-center justify-between">
            <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-white border border-slate-200 rounded-xl flex items-center justify-center text-slate-400">
                    <span className="material-icons-outlined">event_repeat</span>
                </div>
                <div>
                    <p className="text-xs font-bold text-slate-700">Custo Fixo Mensal</p>
                    <p className="text-[10px] text-slate-400 font-medium">Marque se esta despesa se repete mensalmente.</p>
                </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" name="isFixed" checked={formData.isFixed} onChange={handleChange} className="sr-only peer" />
              <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
        </div>

        <div className="flex items-center justify-end space-x-4 pt-4 border-t border-slate-100">
          <button type="button" onClick={onCancel} className="px-6 py-3 rounded-2xl text-sm font-bold text-slate-500 hover:bg-slate-50 transition">Cancelar</button>
          <button type="submit" disabled={isSubmitting} className="px-10 py-3 rounded-2xl text-sm font-bold text-white shadow-xl bg-blue-600 hover:bg-blue-700 active:scale-95 transition-all">
            {isSubmitting ? 'Processando...' : 'Confirmar Lançamento'}
          </button>
        </div>
      </form>
    </div>
  );
};
