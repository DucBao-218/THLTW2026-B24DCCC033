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

  getReviewByAppointment: (appointmentId: number) => IReview | undefined;
}

const SEED_EMPLOYEES: IEmployee[] = [
  {
    id: 1,
    name: 'Nguyễn Văn An',
    role: 'Thợ cắt tóc senior',
    phone: '0901234567',
    maxCustomerPerDay: 8,
    serviceIds: [1, 2, 3],
    workSchedule: [
      { day: 1, startTime: '09:00', endTime: '18:00' },
      { day: 2, startTime: '09:00', endTime: '18:00' },
      { day: 3, startTime: '09:00', endTime: '18:00' },
      { day: 4, startTime: '09:00', endTime: '18:00' },
      { day: 5, startTime: '09:00', endTime: '17:00' },
      { day: 6, startTime: '08:00', endTime: '16:00' },
    ],
  },
];

const SEED_SERVICES: IService[] = [
  { id: 1, name: 'Cắt tóc nam', price: 80000, duration: 30, category: 'Tóc' },
  { id: 2, name: 'Cắt tóc nữ', price: 120000, duration: 60, category: 'Tóc' },
  { id: 3, name: 'Nhuộm tóc', price: 350000, duration: 120, category: 'Tóc' },
];

const SEED_REVIEWS: IReview[] = [
  {
    id: 1,
    appointmentId: 1,
    employeeId: 1,
    serviceId: 1,
    customerName: 'Bảo',
    rating: 5,
    comment: 'Cắt đẹp, nhân viên nhiệt tình',
    reply: 'Cảm ơn bạn, hẹn gặp lại!',
    createdAt: new Date().toISOString(),
  },
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
    const safeParse = (key: string, fallback: any) => {
      try {
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : fallback;
      } catch {
        return fallback;
      }
    };

    const cleanEmployees = (list: IEmployee[]): IEmployee[] => {
      return list.map(e => ({
        ...e,
        workSchedule: (e.workSchedule || []).map(s => {
          const validTime = (t: string) =>
            typeof t === 'string' && /^\d{2}:\d{2}$/.test(t);

          return {
            ...s,
            startTime: validTime(s.startTime) ? s.startTime : '09:00',
            endTime: validTime(s.endTime) ? s.endTime : '18:00',
          };
        }),
      }));
    };

    const empData = cleanEmployees(
      safeParse('employees', SEED_EMPLOYEES)
    );

    setEmployees(empData);
    setServices(safeParse('services', SEED_SERVICES));
    setAppointments(safeParse('appointments', []));
    setReviews(safeParse('reviews', SEED_REVIEWS));

    localStorage.setItem('employees', JSON.stringify(empData));
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

  const getReviewByAppointment = (appointmentId: number) => {
    return reviews.find(r => r.appointmentId === appointmentId);
  };

  return (
    <AppContext.Provider
      value={{
        employees,
        services,
        appointments,
        reviews,
        saveEmployees,
        saveServices,
        saveAppointments,
        saveReviews,
        getReviewByAppointment,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};