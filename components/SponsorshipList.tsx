
import React from 'react';
import { Link } from 'react-router-dom';
import { MOCK_ASSETS } from '../constants';

export const SponsorshipList: React.FC = () => {
  const bodivaAssets = MOCK_ASSETS.filter(a => a.entityId === 'ent-bodiva');
  const totalBODIVA = bodivaAssets.reduce((s, a) => s + a.currentValue, 0);

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-8">
        <div className="flex-1 space-y-4">
          <div className="flex items-center space-x-3">
             <div className="w-12 h-12 bg-blue-600 text-white rounded-2xl flex items-center justify-center shadow-lg">
                <span className="material-icons-outlined text-2xl">account_balance</span>
             </div>
             <h3 className="text-3xl font-black text-slate-900 tracking-tight">
               BODIVA
             </h3>
          </div>
          
          <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm space-y-6">
            <p className="text-slate-700 font-bold text-lg leading-relaxed">
              BODIVA (Bolsa de Dívida e Valores de Angola) é a sociedade gestora dos mercados regulamentados de capitais em Angola.
            </p>
            <p className="text-slate-500 text-sm leading-relaxed">
              Responsável por promover e garantir a negociação transparente e segura de dívidas (como Obrigações e Títulos do Tesouro) e outros valores mobiliários, funcionando como uma ponte entre empresas (emitentes) e investidores, visando financiar a economia angolana e proporcionar oportunidades de investimento.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t border-slate-100">
              <div className="space-y-2">
                <h4 className="text-[10px] font-black text-blue-600 uppercase tracking-widest">Principais Funções</h4>
                <ul className="text-xs text-slate-500 space-y-1 font-medium list-disc ml-4">
                  <li>Gestão de Mercados</li>
                  <li>Conectividade e Transparência</li>
                  <li>Financiamento da Economia</li>
                  <li>Segurança Jurídica</li>
                </ul>
              </div>
              <div className="space-y-2">
                <h4 className="text-[10px] font-black text-blue-600 uppercase tracking-widest">Como Funciona</h4>
                <ul className="text-xs text-slate-500 space-y-1 font-medium list-disc ml-4">
                  <li>Contas de Custódia</li>
                  <li>Títulos do Tesouro</li>
                  <li>Agentes Intermediários</li>
                </ul>
              </div>
              <div className="space-y-2">
                <h4 className="text-[10px] font-black text-blue-600 uppercase tracking-widest">Regulação</h4>
                <p className="text-xs text-slate-500 font-medium">Supervisionada pela Comissão do Mercado de Capitais (CMC).</p>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:w-80 shrink-0">
           <div className="bg-slate-900 p-8 rounded-[2rem] shadow-xl text-center flex flex-col items-center">
              <span className="material-icons-outlined text-amber-500 text-4xl mb-4">military_tech</span>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Valor Consolidado BODIVA</p>
              <p className="text-3xl font-black text-white mt-2 tabular-nums">{totalBODIVA.toLocaleString('pt-AO')}</p>
              <p className="text-xs font-bold text-amber-500 mt-2 uppercase tracking-widest">Kwanza (AOA)</p>
              <div className="w-full h-px bg-white/10 my-6"></div>
              <p className="text-[10px] text-slate-400 leading-relaxed font-medium italic">
                Pilar do sistema financeiro nacional que organiza e dinamiza o mercado de capitais.
              </p>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {bodivaAssets.map(asset => (
              <div key={asset.id} className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 relative overflow-hidden group">
                  <div className="relative z-10">
                      <div className="flex justify-between items-start mb-4">
                          <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center group-hover:bg-amber-500 group-hover:text-white transition-colors duration-500">
                              <span className="material-icons-outlined">article</span>
                          </div>
                          <span className="text-[9px] font-black bg-slate-100 px-2 py-1 rounded uppercase tracking-tighter">BODIVA Bond</span>
                      </div>
                      <h4 className="text-sm font-black text-slate-800 leading-tight mb-2 uppercase tracking-tight">{asset.name}</h4>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-6">Emissão: {new Date(asset.acquisitionDate).toLocaleDateString('pt-AO')}</p>
                      
                      <div className="flex items-baseline space-x-2">
                        <span className="text-2xl font-black text-slate-900 tabular-nums">{asset.currentValue.toLocaleString()}</span>
                        <span className="text-[10px] font-bold text-slate-400 uppercase">AOA</span>
                      </div>
                  </div>
                  <div className="absolute -bottom-6 -right-6 opacity-5 group-hover:scale-110 transition-transform duration-700">
                      <span className="material-icons-outlined text-9xl">confirmation_number</span>
                  </div>
              </div>
          ))}
      </div>

      <div className="bg-blue-600 p-10 rounded-[3rem] text-white shadow-2xl relative overflow-hidden">
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="max-w-xl">
                  <h4 className="text-xl font-black mb-4 flex items-center">
                    <span className="material-icons-outlined text-blue-200 mr-3">verified</span>
                    Gestão de Ativos Sob Custódia
                  </h4>
                  <p className="text-blue-100 text-sm leading-relaxed font-medium">
                    Estes títulos representam o núcleo estratégico de rendimento fixo da família Primo Couto. A custódia via BODIVA garante liquidez e conformidade institucional em solo angolano. Recomenda-se a monitorização semestral dos pagamentos de cupões associados a estes ISINs.
                  </p>
              </div>
              <Link 
                to="/yield-map"
                className="bg-white text-blue-600 px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-blue-50 transition-colors shadow-xl shrink-0"
              >
                  Gerar Mapa de Rendimento
              </Link>
          </div>
          <div className="absolute top-0 right-0 p-12 opacity-10">
              <span className="material-icons-outlined text-[12rem]">account_balance</span>
          </div>
      </div>
    </div>
  );
};
