import React, { createContext, useEffect, useState, ReactNode } from 'react';


export type DayOfWeek = 0 | 1 | 2 | 3 | 4 | 5 | 6; 

export interface IWorkShift {
  day: DayOfWeek;
  startTime: string; 
  endTime: string;   
}

export interface IEmployee {
  id: number;
  name: string;
  role: string;
  phone?: string;
  maxCustomerPerDay: number;
  workSchedule: IWorkShift[];   
  serviceIds: number[];        
}

export interface IService {
  id: number;
  name: string;
  price: number;
  duration: number; 
  category: string;
}

export type AppointmentStatus = 'pending' | 'confirmed' | 'done' | 'cancel';

export interface IAppointment {
  id: number;
  customerName: string;    
  customerPhone: string;   
  employeeId: number;
  serviceId: number;
  date: string;           
  startTime: string;       
  endTime: string;         
  status: AppointmentStatus;
  notes?: string;          
  createdAt: string;      
}

export interface IReview {  
  id: number;
  appointmentId: number;
  employeeId: number;
  serviceId: number;
  customerName: string;
  rating: number;        
  comment: string;
  reply?: string;          
  createdAt: string;
}

export interface IAppContext {
  employees: IEmployee[];
  services: IService[];
  appointments: IAppointment[];
  reviews: IReview[];
  saveEmployees: (data: IEmployee[]) => void;
  saveServices: (data: IService[]) => void;
  saveAppointments: (data: IAppointment[]) => void;
  saveReviews: (data: IReview[]) => void;
}


const SEED_EMPLOYEES: IEmployee[] = [
  {
    id: 1, name: 'Nguyễn Văn An', role: 'Thợ cắt tóc senior',
    phone: '0901234567', maxCustomerPerDay: 8, serviceIds: [1, 2, 3],
    workSchedule: [
      { day: 1, startTime: '09:00', endTime: '18:00' },
      { day: 2, startTime: '09:00', endTime: '18:00' },
      { day: 3, startTime: '09:00', endTime: '18:00' },
      { day: 4, startTime: '09:00', endTime: '18:00' },
      { day: 5, startTime: '09:00', endTime: '17:00' },
      { day: 6, startTime: '08:00', endTime: '16:00' },
    ],
  },
  {
    id: 2, name: 'Trần Thị Bình', role: 'Chuyên viên spa',
    phone: '0912345678', maxCustomerPerDay: 6, serviceIds: [4, 5, 6],
    workSchedule: [
      { day: 1, startTime: '10:00', endTime: '19:00' },
      { day: 3, startTime: '10:00', endTime: '19:00' },
      { day: 4, startTime: '10:00', endTime: '19:00' },
      { day: 5, startTime: '10:00', endTime: '19:00' },
      { day: 6, startTime: '09:00', endTime: '17:00' },
      { day: 0, startTime: '09:00', endTime: '15:00' },
    ],
  },
];

const SEED_SERVICES: IService[] = [
  { id: 1, name: 'Cắt tóc nam', price: 80000, duration: 30, category: 'Tóc' },
  { id: 2, name: 'Cắt tóc nữ', price: 120000, duration: 60, category: 'Tóc' },
  { id: 3, name: 'Nhuộm tóc', price: 350000, duration: 120, category: 'Tóc' },
  { id: 4, name: 'Massage toàn thân', price: 250000, duration: 90, category: 'Spa' },
  { id: 5, name: 'Chăm sóc da mặt', price: 180000, duration: 60, category: 'Spa' },
  { id: 6, name: 'Sơn móng tay', price: 100000, duration: 45, category: 'Làm đẹp' },
];


interface Props {
  children: ReactNode;
}

export const AppContext = createContext<IAppContext | null>(null);

export default ({ children }: Props) => {
  const [employees, setEmployees] = useState<IEmployee[]>([]);
  const [services, setServices] = useState<IService[]>([]);
  const [appointments, setAppointments] = useState<IAppointment[]>([]);
  const [reviews, setReviews] = useState<IReview[]>([]);

  useEffect(() => {
    const storedEmployees = localStorage.getItem('employees');
    const storedServices = localStorage.getItem('services');

    setEmployees(storedEmployees ? JSON.parse(storedEmployees) : SEED_EMPLOYEES);
    setServices(storedServices ? JSON.parse(storedServices) : SEED_SERVICES);
    setAppointments(JSON.parse(localStorage.getItem('appointments') || '[]'));
    setReviews(JSON.parse(localStorage.getItem('reviews') || '[]'));

    if (!storedEmployees) localStorage.setItem('employees', JSON.stringify(SEED_EMPLOYEES));
    if (!storedServices) localStorage.setItem('services', JSON.stringify(SEED_SERVICES));
  }, []);

  const saveEmployees = (data: IEmployee[]) => {
    setEmployees(data);
    localStorage.setItem('employees', JSON.stringify(data));
  };

  const saveServices = (data: IService[]) => {
    setServices(data);
    localStorage.setItem('services', JSON.stringify(data));
  };

  const saveAppointments = (data: IAppointment[]) => {
    setAppointments(data);
    localStorage.setItem('appointments', JSON.stringify(data));
  };

  const saveReviews = (data: IReview[]) => {
    setReviews(data);
    localStorage.setItem('reviews', JSON.stringify(data));
  };

  return (
    <AppContext.Provider
      value={{
        employees, services, appointments, reviews,
        saveEmployees, saveServices, saveAppointments, saveReviews,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};