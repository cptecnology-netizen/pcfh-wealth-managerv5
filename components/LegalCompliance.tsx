import React from 'react';

export const LegalCompliance: React.FC = () => {
  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h3 className="text-3xl font-black text-slate-900 tracking-tight flex items-center">
            <span className="material-icons-outlined text-blue-600 mr-3 text-4xl">gavel</span>
            Legal & Segurança
          </h3>
          <p className="text-sm text-slate-500 font-bold uppercase tracking-widest mt-1">
            Conformidade Lei 22/11 de Angola e Governação SFO
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-10 rounded-[2.5rem] border border-slate-200 shadow-sm space-y-6">
          <div className="flex items-center space-x-4 mb-4">
             <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center">
                <span className="material-icons-outlined">policy</span>
             </div>
             <h4 className="text-xl font-black text-slate-800 tracking-tight">Política de Segurança</h4>
          </div>
          <div className="prose prose-slate max-w-none text-slate-600">
            <h5 className="font-bold text-slate-800 uppercase text-[10px] tracking-widest mb-2">Reportar Vulnerabilidades</h5>
            <p className="text-sm mb-4">
              Este sistema é de uso exclusivo do **Primo Couto Family Holdings (PCFH)**. Qualquer vulnerabilidade deve ser reportada imediatamente por email para <strong>joao@pcfh.ao</strong>.
            </p>
            <h5 className="font-bold text-slate-800 uppercase text-[10px] tracking-widest mb-2">Diretrizes de Proteção</h5>
            <ul className="text-sm space-y-2 list-disc ml-5">
              <li>Repositório Privado Enterprise</li>
              <li>Dados sensíveis criptografados em repouso</li>
              <li>Autenticação JWT com controle de sessão</li>
              <li>Conformidade total com a Lei n.º 22/11 (Angola)</li>
            </ul>
          </div>
        </div>

        <div className="bg-slate-900 p-10 rounded-[2.5rem] text-white shadow-2xl space-y-6 relative overflow-hidden">
          <div className="relative z-10">
            <div className="flex items-center space-x-4 mb-4">
               <div className="w-12 h-12 bg-blue-600 text-white rounded-2xl flex items-center justify-center shadow-lg">
                  <span className="material-icons-outlined">verified</span>
               </div>
               <h4 className="text-xl font-black tracking-tight">Licença de Uso</h4>
            </div>
            <div className="text-slate-400 font-medium text-sm leading-relaxed space-y-4">
              <p>Copyright (c) 2024 Primo Couto Family Holdings (PCFH)</p>
              <p>
                Este software é de uso exclusivo da família Primo Couto e do Primo Couto Family Holdings (PCFH). É estritamente proibida a reprodução, distribuição, modificação ou utilização por terceiros sem autorização expressa por escrito.
              </p>
              <p className="pt-4 border-t border-white/10 text-[10px] font-black uppercase tracking-widest text-blue-400">
                Versão v3.0.0 – Produção SFO
              </p>
            </div>
          </div>
          <div className="absolute top-0 right-0 p-8 opacity-5">
             <span className="material-icons-outlined text-[15rem]">security</span>
          </div>
        </div>
      </div>

      <div className="bg-white p-10 rounded-[2.5rem] border border-slate-200 shadow-sm">
        <h4 className="text-sm font-black text-slate-800 uppercase tracking-widest flex items-center mb-8">
          <span className="w-2 h-6 bg-blue-600 rounded-full mr-3"></span>
          Conformidade Legal Angolana
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 rounded-3xl bg-slate-50 border border-slate-100">
                <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-3">Lei 22/11</p>
                <p className="text-xs text-slate-600 leading-relaxed">
                    Garante a proteção de dados pessoais de todos os membros da família e colaboradores PCFH.
                </p>
            </div>
            <div className="p-6 rounded-3xl bg-slate-50 border border-slate-100">
                <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-3">PGC Angolano</p>
                <p className="text-xs text-slate-600 leading-relaxed">
                    O sistema utiliza o Plano Geral de Contabilidade atualizado para todas as operações de balanço.
                </p>
            </div>
            <div className="p-6 rounded-3xl bg-slate-50 border border-slate-100">
                <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-3">Normas BNA</p>
                <p className="text-xs text-slate-600 leading-relaxed">
                    Alinhamento com as diretrizes do Banco Nacional de Angola para reporte de capitais próprios.
                </p>
            </div>
        </div>
      </div>
    </div>
  );
};
