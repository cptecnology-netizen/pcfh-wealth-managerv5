import React, { useState, useMemo } from 'react';

interface Employee {
  id: string;
  name: string;
  salary: number;
}

const MOCK_EMPLOYEES: Employee[] = [
  { id: '1', name: 'Margarida (Colaboradora)', salary: 200000 },
  { id: '2', name: 'Rosalina (Colaboradora)', salary: 200000 },
];

export const PayrollManager: React.FC = () => {
  const [employees] = useState<Employee[]>(MOCK_EMPLOYEES);

  const payrollData = useMemo(() => {
    return employees.map(emp => {
      const ssEmployee = emp.salary * 0.03; // 3% trabalhador
      const ssEmployer = emp.salary * 0.08; // 8% empresa/SFO
      
      // IRT Mock Calculation (Angolan Tables Simplified)
      let irt = 0;
      if (emp.salary > 100000) {
        irt = (emp.salary - 100000) * 0.13; // Exemplo simplificado
      }
      
      const netSalary = emp.salary - ssEmployee - irt;

      return {
        ...emp,
        ssEmployee,
        ssEmployer,
        irt,
        netSalary,
        totalCost: emp.salary + ssEmployer
      };
    });
  }, [employees]);

  const totals = useMemo(() => {
    return payrollData.reduce((acc, curr) => ({
      gross: acc.gross + curr.salary,
      ss: acc.ss + curr.ssEmployee + curr.ssEmployer,
      irt: acc.irt + curr.irt,
      net: acc.net + curr.netSalary,
      cost: acc.cost + curr.totalCost
    }), { gross: 0, ss: 0, irt: 0, net: 0, cost: 0 });
  }, [payrollData]);

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h3 className="text-3xl font-black text-slate-900 tracking-tight flex items-center">
            <span className="material-icons-outlined text-blue-600 mr-3 text-4xl">badge</span>
            Folha de Pagamento v3.0
          </h3>
          <p className="text-sm text-slate-500 font-bold uppercase tracking-widest mt-1">
            IRT + Segurança Social (8% + 3%) • Cálculo Automático
          </p>
        </div>
        <button className="bg-slate-900 text-white px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-800 transition shadow-xl">
            Emitir Recibos Mensais
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
           <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Salários Base</p>
           <p className="text-2xl font-black text-slate-900 mt-2">{totals.gross.toLocaleString()} <span className="text-xs text-slate-400">AOA</span></p>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
           <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">IRT Retido</p>
           <p className="text-2xl font-black text-rose-600 mt-2">{totals.irt.toLocaleString()} <span className="text-xs text-slate-400">AOA</span></p>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
           <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Seg. Social Total (11%)</p>
           <p className="text-2xl font-black text-blue-600 mt-2">{totals.ss.toLocaleString()} <span className="text-xs text-slate-400">AOA</span></p>
        </div>
        <div className="bg-slate-900 p-6 rounded-3xl shadow-2xl text-white">
           <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest">Custo Operacional RH</p>
           <p className="text-2xl font-black mt-2">{totals.cost.toLocaleString()} <span className="text-xs text-slate-500">AOA</span></p>
        </div>
      </div>

      <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full text-left">
           <thead className="bg-slate-50 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] border-b border-slate-100">
             <tr>
               <th className="px-8 py-5">Colaborador</th>
               <th className="px-8 py-5 text-right">Salário Base</th>
               <th className="px-8 py-5 text-right">SS (3%)</th>
               <th className="px-8 py-5 text-right">IRT</th>
               <th className="px-8 py-5 text-right">Líquido</th>
               <th className="px-8 py-5 text-right text-blue-600">Encargo SFO (8%)</th>
             </tr>
           </thead>
           <tbody className="divide-y divide-slate-100 text-sm">
             {payrollData.map(emp => (
               <tr key={emp.id} className="hover:bg-slate-50 transition-colors">
                 <td className="px-8 py-6 font-black text-slate-800">{emp.name}</td>
                 <td className="px-8 py-6 text-right tabular-nums">{emp.salary.toLocaleString()}</td>
                 <td className="px-8 py-6 text-right tabular-nums text-rose-600">-{emp.ssEmployee.toLocaleString()}</td>
                 <td className="px-8 py-6 text-right tabular-nums text-rose-600">-{emp.irt.toLocaleString()}</td>
                 <td className="px-8 py-6 text-right tabular-nums font-black text-emerald-600">{emp.netSalary.toLocaleString()}</td>
                 <td className="px-8 py-6 text-right tabular-nums font-bold text-blue-600">+{emp.ssEmployer.toLocaleString()}</td>
               </tr>
             ))}
           </tbody>
        </table>
      </div>
    </div>
  );
};
