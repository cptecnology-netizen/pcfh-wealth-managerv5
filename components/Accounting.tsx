
import React, { useState, useEffect, useMemo } from 'react';
import { PGC_ANGOLA, MOCK_ASSETS, EXCHANGE_RATES, MOCK_TRANSACTIONS } from '../constants';
import { wealthAnalyst } from '../services/geminiService';

type ReportView = 'trial' | 'balance' | 'income' | 'plan';

export const Accounting: React.FC = () => {
  const [view, setView] = useState<ReportView>('balance');
  const [loading, setLoading] = useState<boolean>(false);
  const [aiReview, setAiReview] = useState<string | null>(null);
  const [isReviewing, setIsReviewing] = useState(false);
  
  const [balanceSheetData, setBalanceSheetData] = useState<any>({});
  const [incomeStatementData, setIncomeStatementData] = useState<any>(null);

  useEffect(() => {
    fetchData();
  }, [view]);

  const fetchData = async () => {
    setLoading(true);
    setTimeout(() => {
        // Mock data processing for DRE with Fixed Costs
        const expenses = MOCK_TRANSACTIONS.filter(t => PGC_ANGOLA.find(p => p.code === t.accountCode)?.category === 'expense');
        const revenues = MOCK_TRANSACTIONS.filter(t => PGC_ANGOLA.find(p => p.code === t.accountCode)?.category === 'revenue');
        
        const totalRevenue = revenues.reduce((s,t) => s+t.amount, 0);
        const totalExpense = expenses.reduce((s,t) => s+t.amount, 0);
        const fixedExpense = expenses.filter(t => t.isFixed).reduce((s,t) => s+t.amount, 0);

        setIncomeStatementData({
            summary: {
                total_revenue: totalRevenue,
                total_expense: totalExpense,
                fixed_expense: fixedExpense,
                net_income: totalRevenue - totalExpense
            },
            revenues: revenues.map(r => ({ code: r.accountCode, description: r.description, amount: r.amount })),
            expenses: expenses.map(e => ({ code: e.accountCode, description: e.description, amount: e.amount, isFixed: e.isFixed }))
        });

        setBalanceSheetData({
            'Activo': [{ code: '11', description: 'Disponibilidades', amount: 5000000 }],
            'Liability': [{ code: '21', description: 'Passivos de Curto Prazo', amount: 150000 }],
            'Equity': [{ code: '31', description: 'Capital Social', amount: 4850000 }]
        });
        setLoading(false);
    }, 500);
  };

  const handleAiReview = async () => {
    if (!incomeStatementData) return;
    setIsReviewing(true);
    const context = `
        Considere que a Primo Couto Family Holdings tem um comprometimento fixo mensal (Burn Rate) de ${incomeStatementData.summary.fixed_expense} AOA.
        Isso representa ${((incomeStatementData.summary.fixed_expense/incomeStatementData.summary.total_expense)*100).toFixed(1)}% das despesas totais.
        Forneça uma análise sobre a rigidez desta estrutura de custos.
    `;
    try {
      const insight = await wealthAnalyst.getWealthInsights(MOCK_ASSETS, MOCK_TRANSACTIONS);
      setAiReview(insight + `<div class="mt-4 p-4 bg-blue-600/20 rounded-xl border border-blue-600/30 text-xs font-bold uppercase tracking-widest text-blue-400">Análise de Rigidez de Custos: A estrutura fixa é de ${incomeStatementData.summary.fixed_expense.toLocaleString()} AOA/mês.</div>`);
    } catch (e) {
      setAiReview("Falha ao processar análise estratégica.");
    } finally {
      setIsReviewing(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-700">
      <div className="flex flex-wrap gap-1 bg-slate-200/50 p-1.5 rounded-2xl w-fit mx-auto shadow-sm backdrop-blur-md sticky top-20 z-20">
        {['balance', 'income', 'trial', 'plan'].map((v) => (
          <button 
            key={v}
            onClick={() => setView(v as ReportView)}
            className={`px-8 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${view === v ? 'bg-white text-blue-700 shadow-md' : 'text-slate-500'}`}
          >
            {v === 'balance' ? 'Balanço' : v === 'income' ? 'DRE' : v === 'trial' ? 'Balancete' : 'PGC'}
          </button>
        ))}
      </div>

      <div className="bg-white p-12 rounded-[2.5rem] border border-slate-200 shadow-2xl max-w-5xl mx-auto overflow-hidden relative">
        {view === 'income' && incomeStatementData && (
          <div className="space-y-12">
            <div className="flex justify-between items-center bg-blue-900 text-white p-8 rounded-[2rem] shadow-xl">
               <div>
                  <h4 className="text-xs font-black uppercase tracking-[0.4em] text-blue-400 mb-2">Análise Estratégica de Custos Fixos</h4>
                  <p className="text-xl font-black">Burn Rate Mensal: {incomeStatementData.summary.fixed_expense.toLocaleString()} <span className="text-xs font-normal">AOA</span></p>
               </div>
               <button onClick={handleAiReview} disabled={isReviewing} className="bg-white text-blue-900 px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-blue-50 transition">
                 {isReviewing ? 'Processando...' : 'Revisão IA'}
               </button>
            </div>

            {aiReview && <div className="p-8 bg-slate-900 text-slate-200 rounded-[2rem] text-sm" dangerouslySetInnerHTML={{ __html: aiReview }} />}

            <section>
              <h3 className="text-xs font-black text-emerald-700 bg-emerald-50 px-4 py-2 rounded-lg mb-6 tracking-widest uppercase">1. Proveitos Totais</h3>
              <table className="w-full text-sm">
                <tbody>
                    {incomeStatementData.revenues.map((r: any, i: number) => (
                        <tr key={i} className="border-b border-slate-50">
                            <td className="py-4 font-mono text-xs text-slate-400">{r.code}</td>
                            <td className="py-4 font-bold text-slate-700">{r.description}</td>
                            <td className="py-4 text-right font-black tabular-nums">+{r.amount.toLocaleString()}</td>
                        </tr>
                    ))}
                </tbody>
              </table>
            </section>

            <section>
              <h3 className="text-xs font-black text-rose-700 bg-rose-50 px-4 py-2 rounded-lg mb-6 tracking-widest uppercase flex justify-between">
                <span>2. Custos e Encargos</span>
                <span className="text-[9px]">Fixos Marcados com <span className="material-icons-outlined text-[10px]">event_repeat</span></span>
              </h3>
              <table className="w-full text-sm">
                <tbody>
                    {incomeStatementData.expenses.map((e: any, i: number) => (
                        <tr key={i} className={`border-b border-slate-50 ${e.isFixed ? 'bg-rose-50/20' : ''}`}>
                            <td className="py-4 font-mono text-xs text-slate-400">{e.code}</td>
                            <td className="py-4 font-bold text-slate-700 flex items-center">
                                {e.description}
                                {e.isFixed && <span className="material-icons-outlined text-rose-500 text-xs ml-2" title="Custo Fixo Mensal">event_repeat</span>}
                            </td>
                            <td className="py-4 text-right font-black tabular-nums text-rose-600">-{e.amount.toLocaleString()}</td>
                        </tr>
                    ))}
                </tbody>
              </table>
            </section>

            <div className={`p-10 rounded-[2.5rem] text-white shadow-2xl bg-slate-900 border-4 ${incomeStatementData.summary.net_income >= 0 ? 'border-emerald-500' : 'border-rose-500'}`}>
                <p className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-400 mb-3">Resultado Líquido do Exercício</p>
                <h4 className="text-5xl font-black tabular-nums tracking-tighter">
                    {incomeStatementData.summary.net_income.toLocaleString()} <span className="text-sm font-normal text-slate-400">AOA</span>
                </h4>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
