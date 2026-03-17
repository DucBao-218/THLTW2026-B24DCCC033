import React, { createContext, useEffect, useState, ReactNode } from 'react';

export interface IEmployee {
  id: number;
  name: string;
  workStart: number;
  workEnd: number;
  maxCustomer: number;
  workingDays: number[];
}

export interface IService {
  id: number;
  name: string;
  price: number;
  duration: number;
}

export type AppointmentStatus = 'pending' | 'confirmed' | 'done' | 'cancel';

export interface IAppointment {
  id: number;
  employeeId: number;
  serviceId: number;
  date: string;
  start: number;
  end: number;
  status: AppointmentStatus;
  rating?: number;
  comment?: string;
  reply?: string;
}

export interface IAppContext {
  employees: IEmployee[];
  services: IService[];
  appointments: IAppointment[];
  saveEmployees: (data: IEmployee[]) => void;
  saveServices: (data: IService[]) => void;
  saveAppointments: (data: IAppointment[]) => void;
}

export const AppContext = createContext<IAppContext | null>(null);

interface Props {
  children: ReactNode;
}

export default ({ children }: Props) => {
  const [employees, setEmployees] = useState<IEmployee[]>([]);
  const [services, setServices] = useState<IService[]>([]);
  const [appointments, setAppointments] = useState<IAppointment[]>([]);

  useEffect(() => {
    setEmployees(JSON.parse(localStorage.getItem('employees') || '[]'));
    setServices(JSON.parse(localStorage.getItem('services') || '[]'));
    setAppointments(JSON.parse(localStorage.getItem('appointments') || '[]'));
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

  return (
    <AppContext.Provider
      value={{
        employees,
        services,
        appointments,
        saveEmployees,
        saveServices,
        saveAppointments,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};