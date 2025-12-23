
import React, { useMemo, useState } from 'react';
import { MOCK_ENTITIES, MOCK_ASSETS, EXCHANGE_RATES } from '../constants';
import { EntityType } from '../types';

export const EntitiesOverview: React.FC = () => {
  const [activeType, setActiveType] = useState<EntityType | 'all'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const entityData = useMemo(() => {
    return MOCK_ENTITIES.filter(e => e.type === 'bank' || e.type === 'investment_manager')
      .map(entity => {
        const assets = MOCK_ASSETS.filter(a => a.entityId === entity.id);
        const totalAOA = assets.reduce((acc, asset) => {
          let val = asset.currentValue;
          if (asset.currency === 'EUR') val *= EXCHANGE_RATES.EUR_AOA;
          if (asset.currency === 'USD') val *= EXCHANGE_RATES.USD_AOA;
          return acc + val;
        }, 0);

        return {
          ...entity,
          assets,
          totalAOA,
          assetCount: assets.length
        };
      })
      .filter(e => {
        const matchesType = activeType === 'all' || e.type === activeType;
        const matchesSearch = e.name.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesType && matchesSearch;
      })
      .sort((a, b) => b.totalAOA - a.totalAOA);
  }, [activeType, searchTerm]);

  const aggregateStats = useMemo(() => {
    const total = entityData.reduce((s, e) => s + e.totalAOA, 0);
    const bankTotal = entityData.filter(e => e.type === 'bank').reduce((s, e) => s + e.totalAOA, 0);
    const managerTotal = entityData.filter(e => e.type === 'investment_manager').reduce((s, e) => s + e.totalAOA, 0);
    
    return { total, bankTotal, managerTotal };
  }, [entityData]);

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h3 className="text-3xl font-black text-slate-900 tracking-tight flex items-center">
            <span className="material-icons-outlined text-blue-600 mr-3 text-4xl">account_balance_wallet</span>
            Bancos e Gestoras
          </h3>
          <p className="text-sm text-slate-500 font-bold uppercase tracking-widest mt-1">Instituições e Custódia de Capital</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-4">
          <div className="relative group">
            <span className="material-icons-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm">search</span>
            <input 
              type="text" 
              placeholder="Pesquisar BNI, Keve, BAI..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-white border border-slate-200 rounded-2xl pl-10 pr-4 py-3 text-xs font-bold outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all w-64 shadow-sm"
            />
          </div>
        </div>
      </div>

      {/* Aggregated Institutional Exposure */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-900 p-8 rounded-[2.5rem] text-white shadow-2xl relative overflow-hidden">
          <p className="text-[10px] font-black text-blue-400 uppercase tracking-[0.3em] mb-2">Exposição Institucional</p>
          <div className="flex items-baseline space-x-2">
            <h4 className="text-3xl font-black tabular-nums">{aggregateStats.total.toLocaleString('pt-AO')}</h4>
            <span className="text-xs font-bold text-slate-500">AOA</span>
          </div>
          <div className="mt-6 flex items-center space-x-2">
            <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Dados Auditados PGC</span>
          </div>
        </div>
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm flex flex-col justify-between">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-2">Liquidez Bancária (Corrente)</p>
          <div className="flex items-baseline space-x-2">
            <h4 className="text-3xl font-black text-slate-900 tabular-nums">{(aggregateStats.bankTotal * 0.15).toLocaleString('pt-AO')}</h4>
            <span className="text-xs font-bold text-slate-400">AOA</span>
          </div>
          <p className="text-[9px] text-blue-600 font-black mt-4 uppercase tracking-widest">Disponibilidade Imediata</p>
        </div>
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm flex flex-col justify-between">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-2">Património Bloqueado (DPs)</p>
          <div className="flex items-baseline space-x-2">
            <h4 className="text-3xl font-black text-slate-900 tabular-nums">{(aggregateStats.bankTotal * 0.85).toLocaleString('pt-AO')}</h4>
            <span className="text-xs font-bold text-slate-400">AOA</span>
          </div>
          <p className="text-[9px] text-amber-600 font-black mt-4 uppercase tracking-widest">Rendimento em Maturação</p>
        </div>
      </div>

      {/* Entities Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {entityData.map(entity => (
          <div key={entity.id} className="bg-white rounded-[3rem] border border-slate-200 shadow-sm hover:shadow-2xl transition-all duration-500 overflow-hidden flex flex-col group">
            <div className="p-10 flex-1">
              <div className="flex justify-between items-start mb-8">
                <div className="flex items-center space-x-4">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg transition-colors duration-500 ${entity.type === 'bank' ? 'bg-blue-600 text-white' : 'bg-emerald-600 text-white'}`}>
                    <span className="material-icons-outlined text-2xl">{entity.type === 'bank' ? 'account_balance' : 'show_chart'}</span>
                  </div>
                  <div>
                    <h4 className="text-xl font-black text-slate-900 uppercase tracking-tight leading-none mb-1">{entity.name}</h4>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{entity.type === 'bank' ? 'Banco Comercial' : 'Asset Management'}</span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-black text-slate-900 tracking-tighter tabular-nums">{entity.totalAOA.toLocaleString('pt-AO')}</p>
                  <p className="text-[9px] font-black text-blue-600 uppercase tracking-widest">Consolidado AOA</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="divide-y divide-slate-100">
                  {entity.assets.map(asset => (
                    <div key={asset.id} className="py-5 flex justify-between items-center group/item">
                      <div className="flex flex-col">
                        <div className="flex items-center space-x-3">
                          <span className="text-xs font-black text-slate-700">{asset.name}</span>
                          <span className="text-[9px] font-black bg-slate-100 text-slate-500 px-2 py-0.5 rounded uppercase tracking-tighter">{asset.currency}</span>
                        </div>
                        {asset.metadata?.status && (
                            <div className="mt-2 flex items-center space-x-1.5">
                                <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse"></span>
                                <span className="text-[10px] font-black text-blue-600 uppercase tracking-tighter">{asset.metadata.status}</span>
                            </div>
                        )}
                      </div>
                      <div className="text-right">
                        <span className="text-sm font-black text-slate-900 tabular-nums">
                            {asset.currentValue.toLocaleString('pt-AO')}
                        </span>
                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">{asset.type.replace('_', ' ')}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="bg-slate-50 px-10 py-6 border-t border-slate-100 flex justify-between items-center group-hover:bg-blue-50/30 transition-colors">
              <div className="flex items-center space-x-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                <span className="material-icons-outlined text-sm">verified_user</span>
                <span>Conformidade Lei 22/11</span>
              </div>
              <button className="bg-white border border-slate-200 text-slate-900 px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-900 hover:text-white transition-all shadow-sm">
                Gerar Extrato SFO
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* BNI & Keve Contextual Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
         <div className="bg-blue-50 p-8 rounded-[3rem] border border-blue-100 flex items-start space-x-6">
            <div className="w-12 h-12 bg-blue-600 text-white rounded-2xl flex items-center justify-center shrink-0 shadow-lg">
                <span className="material-icons-outlined">info</span>
            </div>
            <div>
                <h5 className="font-black text-blue-900 uppercase text-xs tracking-widest mb-2">Nota: Banco BNI & Keve</h5>
                <p className="text-xs text-blue-800/70 font-medium leading-relaxed">
                    As novas posições no <b>Banco BNI</b> (DP Independência) e <b>Banco Keve</b> (Especial iKeve) foram estruturadas para maximizar o rendimento passivo em AOA, com taxas TANB superiores a 17%. A monitorização da maturidade é crítica para o rebalanceamento de liquidez do SFO.
                </p>
            </div>
         </div>
         <div className="bg-slate-900 p-8 rounded-[3rem] text-white flex flex-col justify-center relative overflow-hidden">
             <div className="relative z-10">
                <h5 className="font-black text-blue-400 uppercase text-xs tracking-widest mb-4">Advisor Insights</h5>
                <p className="text-xs text-slate-400 font-medium leading-relaxed">
                    A concentração no Banco Keve representa agora um pilar de liquidez de curto prazo. Recomenda-se diversificar os próximos aportes em títulos do tesouro via BODIVA para equilibrar o risco de crédito institucional.
                </p>
             </div>
             <div className="absolute top-0 right-0 p-8 opacity-5">
                <span className="material-icons-outlined text-8xl">analytics</span>
             </div>
         </div>
      </div>
    </div>
  );
};
