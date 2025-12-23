
export type Currency = 'AOA' | 'USD' | 'EUR';

export enum AssetType {
  BANK_ACCOUNT = 'bank_account',
  TIME_DEPOSIT = 'time_deposit',
  ETF = 'etf',
  REAL_ESTATE = 'real_estate',
  VEHICLE = 'vehicle',
  BOND = 'bond'
}

export type EntityType = 'bank' | 'investment_manager' | 'other_entity' | 'family' | 'holding';

export interface Entity {
  id: string;
  name: string;
  type: EntityType;
}

export interface AccountPlan {
  code: string;
  description: string;
  category: 'asset' | 'liability' | 'expense' | 'revenue' | 'equity' | 'off_balance';
  level?: number;
  parent_code?: string | null;
}

export interface Asset {
  id: string;
  entityId: string;
  name: string;
  type: AssetType;
  currency: Currency;
  currentValue: number;
  acquisitionDate: string;
  metadata?: Record<string, any>;
}

export interface Transaction {
  id: string;
  assetId: string;
  sourceEntityId?: string;
  accountCode: string;
  description: string;
  amount: number;
  currency: Currency;
  date: string;
  category: string;
  isFixed?: boolean; // Novo campo para identificar custos mensais recorrentes
}

export interface DashboardStats {
  totalAssetsAOA: number;
  totalMonthlyExpenses: number;
  monthlyPerformance: number;
  assetAllocation: { name: string; value: number }[];
}
