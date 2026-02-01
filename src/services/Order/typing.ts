export interface IOrder {
  id: string;
  customerName: string;
  phone: string;
  address: string;
  products: {
    productId: number;
    productName: string;
    quantity: number;
    price: number;
  }[];
  totalAmount: number;
  status: 'Chờ xử lý' | 'Đang giao' | 'Hoàn thành' | 'Đã hủy';
  createdAt: string;
}
