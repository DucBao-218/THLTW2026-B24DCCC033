import React, { createContext, useContext } from 'react';
import { IProduct } from '@/services/Product/typing';
import { IOrder } from '@/services/Order/typing';

interface AppContextType {
  products: IProduct[];
  setProducts: React.Dispatch<React.SetStateAction<IProduct[]>>;

  orders: IOrder[];
  setOrders: React.Dispatch<React.SetStateAction<IOrder[]>>;
}

const AppContext = createContext<AppContextType | null>(null);

export const useAppContext = () => {
  const context = useContext(AppContext);

  if (!context) {
    throw new Error('useAppContext phải được dùng bên trong AppProvider');
  }

  return context;
};

export default AppContext;
