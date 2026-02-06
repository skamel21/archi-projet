import { apiRequest } from './client';
import { ExportData } from '../types';

export function exportUserData(token: string): Promise<ExportData> {
  return apiRequest<ExportData>('/me/export', { token });
}

export function deleteAccount(token: string): Promise<void> {
  return apiRequest('/me', { method: 'DELETE', token });
}
