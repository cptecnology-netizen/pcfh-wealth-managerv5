
import { AccountPlan, Asset, AssetType, Transaction, Entity } from './types';

export const PGC_ANGOLA: AccountPlan[] = [
  // NÍVEL 1: CLASSES
  { code: '1', description: 'ACTIVO', category: 'asset', level: 1, parent_code: null },
  { code: '2', description: 'PASSIVO', category: 'liability', level: 1, parent_code: null },
  { code: '3', description: 'CAPITAL, RESERVAS E RESULTADOS TRANSITADOS', category: 'equity', level: 1, parent_code: null },
  { code: '6', description: 'DESPESAS', category: 'expense', level: 1, parent_code: null },
  { code: '7', description: 'RECEITAS', category: 'revenue', level: 1, parent_code: null },

  // NÍVEL 2: GRUPOS
  { code: '11', description: 'DISPONIBILIDADES', category: 'asset', level: 2, parent_code: '1' },
  { code: '75', description: 'PROVEITOS FINANCEIROS', category: 'revenue', level: 2, parent_code: '7' },
  { code: '78', description: 'OUTROS PROVEITOS E GANHOS', category: 'revenue', level: 2, parent_code: '7' },

  // NÍVEL 3+: RECEITAS (CLASSE 7)
  { code: '7511', description: 'Juros de Depósitos a Prazo', category: 'revenue', level: 3, parent_code: '75' },
  { code: '7512', description: 'Dividendos de Ações/ETFs', category: 'revenue', level: 3, parent_code: '75' },
  { code: '7521', description: 'Juros de Títulos do Tesouro (OT/BT)', category: 'revenue', level: 3, parent_code: '75' },
  { code: '7811', description: 'Injeção de Capital (Aportes)', category: 'revenue', level: 3, parent_code: '78' },
  { code: '7821', description: 'Rendas de Imóveis', category: 'revenue', level: 3, parent_code: '78' },
  
  // NÍVEL 3+: DESPESAS (CLASSE 6)
  { code: '6211', description: 'Supermercado e Compras', category: 'expense', level: 3, parent_code: '6' },
  { code: '6212', description: 'Internet e Telefone', category: 'expense', level: 3, parent_code: '6' },
  { code: '6214', description: 'Manutenção e Reparações', category: 'expense', level: 3, parent_code: '6' },
  { code: '6215', description: 'Lazer, Ginásio e Clubes', category: 'expense', level: 3, parent_code: '6' },
  { code: '6216', description: 'Arrendamento Imobiliário', category: 'expense', level: 3, parent_code: '6' },
  { code: '6217', description: 'Encargos Familiares (Mesada)', category: 'expense', level: 3, parent_code: '6' },
  { code: '6311', description: 'Impostos e Taxas Estaduais', category: 'expense', level: 3, parent_code: '6' },
  { code: '6411', description: 'Remuneração de Colaboradores', category: 'expense', level: 3, parent_code: '6' },
];

export const MOCK_ENTITIES: Entity[] = [
  { id: 'ent-bai', name: 'Banco BAI', type: 'bank' },
  { id: 'ent-bci', name: 'Banco BCI', type: 'bank' },
  { id: 'ent-keve', name: 'Banco Keve', type: 'bank' },
  { id: 'ent-bni', name: 'Banco BNI', type: 'bank' },
  { id: 'ent-standard-ao', name: 'Standard Bank Angola', type: 'bank' },
  { id: 'ent-nedbank', name: 'Nedbank South Africa', type: 'bank' },
  { id: 'ent-ibkr', name: 'Interactive Brokers', type: 'investment_manager' },
  { id: 'ent-standard', name: 'Standard Gestão de Activos', type: 'investment_manager' },
  { id: 'ent-bodiva', name: 'BODIVA - Bolsa de Dívida', type: 'investment_manager' },
  { id: 'ent-tenant-eden', name: 'Arrendatário Jardim Éden', type: 'other_entity' },
];

export const MOCK_ASSETS: Asset[] = [
  // JOÃO COUTO - CONTAS E DIVERSOS
  { id: 'ast-std-salary', entityId: 'ent-standard-ao', name: 'Home Salary Account (Standard)', type: AssetType.BANK_ACCOUNT, currency: 'AOA', currentValue: 573385.58, acquisitionDate: '2025-12-23', metadata: { nib: '006001380100475157518' } },
  { id: 'ast-bai-eur', entityId: 'ent-bai', name: 'BAI Europa (EUR)', type: AssetType.BANK_ACCOUNT, currency: 'EUR', currentValue: 1143.02, acquisitionDate: '2023-01-01' },
  { id: 'ast-ned-zar', entityId: 'ent-nedbank', name: 'Nedbank Savings (ZAR)', type: AssetType.BANK_ACCOUNT, currency: 'AOA', currentValue: 82725.83, acquisitionDate: '2021-04-18' },
  { id: 'ast-ibkr-usd', entityId: 'ent-ibkr', name: 'IBKR Portfolio (USD)', type: AssetType.ETF, currency: 'USD', currentValue: 3002.31, acquisitionDate: '2024-11-15' },
  { id: 'ast-eden', entityId: 'ent-tenant-eden', name: 'Vivenda Jardim do Éden', type: AssetType.REAL_ESTATE, currency: 'AOA', currentValue: 45000000, acquisitionDate: '2022-01-01' },
  
  // BANCO BCI
  { id: 'ast-bci-dp50', entityId: 'ent-bci', name: 'Depósito a Prazo 50 Anos (BCI)', type: AssetType.TIME_DEPOSIT, currency: 'AOA', currentValue: 400000.00, acquisitionDate: '2025-03-21', metadata: { tanb: '16%' } },

  // BANCO KEVE
  { id: 'ast-keve-current', entityId: 'ent-keve', name: 'Conta Corrente Keve', type: AssetType.BANK_ACCOUNT, currency: 'AOA', currentValue: 255000.00, acquisitionDate: '2025-12-01' },
  { id: 'ast-keve-dp', entityId: 'ent-keve', name: 'DP Especial iKeve', type: AssetType.TIME_DEPOSIT, currency: 'AOA', currentValue: 2400000.00, acquisitionDate: '2025-10-15', metadata: { period: '90 dias', rate: '18.5% TANB', status: 'Liquidação em 76 dias' } },

  // BANCO BNI
  { id: 'ast-bni-dp-indep', entityId: 'ent-bni', name: 'DP Independência Mensal', type: AssetType.TIME_DEPOSIT, currency: 'AOA', currentValue: 1000000.00, acquisitionDate: '2025-11-11', metadata: { rate: '17% TANB', type: 'Mensal' } },

  // GESTÃO DE ACTIVOS & BODIVA
  { id: 'ast-std-obrig-feivma', entityId: 'ent-standard', name: 'Standard Obrigações FEIVMA', type: AssetType.BOND, currency: 'AOA', currentValue: 100000.00, acquisitionDate: '2025-12-22' },
  { id: 'ast-std-tes-feivma', entityId: 'ent-standard', name: 'Standard Tesouraria FEIVMA', type: AssetType.BOND, currency: 'AOA', currentValue: 100000.00, acquisitionDate: '2025-12-23' },
  { id: 'ast-bod-07', entityId: 'ent-bodiva', name: 'OT OI15J30C João', type: AssetType.BOND, currency: 'AOA', currentValue: 3565000, acquisitionDate: '2025-01-15' },
  { id: 'ast-bod-sonia-01', entityId: 'ent-bodiva', name: 'OT ON07A32A Sónia', type: AssetType.BOND, currency: 'AOA', currentValue: 4600000, acquisitionDate: '2022-04-07' },
];

export const MOCK_TRANSACTIONS: Transaction[] = [
  // ENTRADAS RECENTES
  { id: 'INF-BNI-DEP01', assetId: 'ast-bni-dp-indep', sourceEntityId: 'ent-bni', accountCode: '7811', description: 'Depósito Inicial - DP Independência BNI', amount: 1000000.00, currency: 'AOA', date: '2025-11-11', category: 'Aportes' },
  { id: 'INF-KEVE-CUR01', assetId: 'ast-keve-current', sourceEntityId: 'ent-keve', accountCode: '7811', description: 'Entrada de Caixa - Conta Corrente Keve', amount: 255000.00, currency: 'AOA', date: '2025-12-01', category: 'Aportes' },
  { id: 'INF-KEVE-DEP01', assetId: 'ast-keve-dp', sourceEntityId: 'ent-keve', accountCode: '7811', description: 'Depósito Especial iKeve', amount: 2400000.00, currency: 'AOA', date: '2025-10-15', category: 'Aportes' },
  { id: 'INF-STD-SAL01', assetId: 'ast-std-salary', sourceEntityId: 'ent-standard-ao', accountCode: '7811', description: 'Home Salary - João Couto', amount: 573385.58, currency: 'AOA', date: '2025-12-23', category: 'Vencimentos' },
  { id: 'INF-REN01', assetId: 'ast-eden', sourceEntityId: 'ent-tenant-eden', accountCode: '7821', description: 'Renda Mensal - Jardim Éden', amount: 225000, currency: 'AOA', date: '2025-12-01', category: 'Rendas' },

  // CUSTOS FIXOS (BURN RATE)
  { id: 'OUT-DEC-003', assetId: 'ast-std-salary', accountCode: '6411', description: 'Salário Colaboradora Margarida', amount: 200000.00, currency: 'AOA', date: '2025-12-20', category: 'RH', isFixed: true },
  { id: 'OUT-DEC-004', assetId: 'ast-std-salary', accountCode: '6411', description: 'Salário Colaboradora Rosalina', amount: 200000.00, currency: 'AOA', date: '2025-12-20', category: 'RH', isFixed: true },
  { id: 'OUT-DEC-007', assetId: 'ast-std-salary', accountCode: '6217', description: 'Mesada Zelia Couto', amount: 400000.00, currency: 'AOA', date: '2025-12-01', category: 'Mesadas', isFixed: true },
  { id: 'OUT-DEC-011', assetId: 'ast-std-salary', accountCode: '6211', description: 'Cartão Supermercado', amount: 700000.00, currency: 'AOA', date: '2025-12-15', category: 'Alimentação', isFixed: true },
  { id: 'OUT-DEC-012', assetId: 'ast-std-salary', accountCode: '6216', description: 'Aluguer Apartamento Joaquim', amount: 550000.00, currency: 'AOA', date: '2025-12-01', category: 'Imobiliário', isFixed: true },
];

export const EXCHANGE_RATES = {
  EUR_AOA: 860.00,
  USD_AOA: 780.00,
  ZAR_AOA: 45.00
};
