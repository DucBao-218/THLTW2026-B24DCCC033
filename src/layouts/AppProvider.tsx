import React, { useEffect, useState } from "react";
import AppContext from "./AppContext";

import { IProduct } from "@/services/Product/typing";
import { IOrder } from "@/services/Order/typing";

// Products mẫu
const INIT_PRODUCTS: IProduct[] = [
  { id: 1, name: "Laptop Dell XPS 13", category: "Laptop", price: 25000000, quantity: 15 },
  { id: 2, name: "iPhone 15 Pro Max", category: "Điện thoại", price: 30000000, quantity: 8 },
  { id: 3, name: "Samsung Galaxy S24", category: "Điện thoại", price: 22000000, quantity: 20 },
  { id: 4, name: "iPad Air M2", category: "Máy tính bảng", price: 18000000, quantity: 5 },
  { id: 5, name: "MacBook Air M3", category: "Laptop", price: 28000000, quantity: 12 },
  { id: 6, name: "AirPods Pro 2", category: "Phụ kiện", price: 6000000, quantity: 0 },
  { id: 7, name: "Samsung Galaxy Tab S9", category: "Máy tính bảng", price: 15000000, quantity: 7 },
  { id: 8, name: "Logitech MX Master 3", category: "Phụ kiện", price: 2500000, quantity: 25 },
];

// Orders mẫu
const INIT_ORDERS: IOrder[] = [
  {
    id: "DH001",
    customerName: "Nguyễn Văn A",
    phone: "0912345678",
    address: "123 Nguyễn Huệ, Q1, TP.HCM",
    products: [
      {
        productId: 1,
        productName: "Laptop Dell XPS 13",
        quantity: 1,
        price: 25000000,
      },
    ],
    totalAmount: 25000000,
    status: "Chờ xử lý",
    createdAt: "2024-01-15",
  },
];

interface Props {
  children: React.ReactNode;
}

const AppProvider: React.FC<Props> = ({ children }) => {

  const [products, setProducts] = useState<IProduct[]>(() => {
    const saved = localStorage.getItem("products");
    return saved ? JSON.parse(saved) : INIT_PRODUCTS;
  });

  const [orders, setOrders] = useState<IOrder[]>(() => {
    const saved = localStorage.getItem("orders");
    return saved ? JSON.parse(saved) : INIT_ORDERS;
  });

  useEffect(() => {
    localStorage.setItem("products", JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem("orders", JSON.stringify(orders));
  }, [orders]);

  return (
    <AppContext.Provider
      value={{
        products,
        setProducts,
        orders,
        setOrders,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export default AppProvider;
