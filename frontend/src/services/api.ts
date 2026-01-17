import type { Report, Alert } from '@/types';
import { MOCK_REPORTS, MOCK_ALERTS } from '@/lib/data';

// Simulate network delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const api = {
  getReports: async (): Promise<Report[]> => {
    await delay(800);
    return [...MOCK_REPORTS];
  },

  getAlerts: async (): Promise<Alert[]> => {
    await delay(600);
    return [...MOCK_ALERTS];
  },

  createReport: async (reportData: Omit<Report, 'id' | 'status' | 'date' | 'time'>): Promise<Report> => {
    await delay(1500);
    const newReport: Report = {
      ...reportData,
      id: Math.random().toString(36).substr(2, 9),
      status: 'Pending',
      date: new Date().toISOString().split('T')[0],
      time: new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' }),
    };
    MOCK_REPORTS.unshift(newReport); // Update mock data in memory
    return newReport;
  },

  // Add more methods as needed (update, delete, etc.)
};
