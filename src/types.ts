export interface Stock {
  c: number;
  h: number;
  l: number;
  o: number;
  pc: number;
  t: number;
}

export interface LiveStock {
  p: number;
  s: string;
  t: number;
  v: number;
}

export interface Company {
  country: string;
  currency: string;
  exchange: string;
  finnhubIndustry: string;
  ipo: string;
  logo: string;
  marketCapitalization: number;
  name: string;
  phone: string;
  shareOutstanding: number;
  ticker: string;
  weburl: string;
}

export interface CompanyState {
  symbol: string;
  data: null | Data;
  company: null | Company;
  financials: null | object;
}

export interface ChartData {
  labels: string[];
  label: string;
  data: number[];
  type?: string;
}
