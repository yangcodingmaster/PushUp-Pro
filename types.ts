export interface DailyLog {
  date: string; // ISO Date String YYYY-MM-DD
  count: number;
}

export enum ChartView {
  WEEK = 'WEEK',
  MONTH = 'MONTH',
  YEAR = 'YEAR',
}

export type ViewState = 'home' | 'stats';

export interface AppState {
  logs: DailyLog[];
  dailyTarget: number;
  shortcuts: number[]; // Array of 2 numbers for the buttons
}