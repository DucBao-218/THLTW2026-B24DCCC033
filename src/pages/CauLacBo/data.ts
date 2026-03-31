export interface LogEntry {
  time: string;
  action: string;
  note?: string;
}

export interface Club {
  id: string;
  avatar: string;
  name: string;
  foundedDate: string;
  description: string; 
  president: string;
  isActive: boolean;
}

export interface Application {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  gender: 'Nam' | 'Nữ' | 'Khác';
  address: string;
  skills: string;
  clubId: string; 
  reason: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  rejectReason?: string;
  logs: LogEntry[];
}

export const getClubs = (): Club[] => JSON.parse(localStorage.getItem('CLUBS_DATA') || '[]');
export const setClubs = (clubs: Club[]) => localStorage.setItem('CLUBS_DATA', JSON.stringify(clubs));

export const getApps = (): Application[] => JSON.parse(localStorage.getItem('APPS_DATA') || '[]');
export const setApps = (apps: Application[]) => localStorage.setItem('APPS_DATA', JSON.stringify(apps));