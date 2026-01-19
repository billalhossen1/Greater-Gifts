
export type TransactionType = 'income' | 'expense';
export type Language = 'en' | 'bn';

export interface Transaction {
  id: string;
  amount: number;
  category: string;
  date: string;
  type: TransactionType;
  description: string;
}

export interface UserSettings {
  name: string;
  currency: string;
  syncUrl?: string;
  language: Language;
  avatar?: string; // Base64 or URL for profile pic/logo
  themeColor: string; // Hex or tailwind base name
}

export interface FinancialSummary {
  totalIncome: number;
  totalExpense: number;
  balance: number;
}
