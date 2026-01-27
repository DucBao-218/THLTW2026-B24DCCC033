import { useState, useEffect } from 'react';
import {
  Button,
  Form,
  Input,
  InputNumber,
  Modal,
  Select,
  Table,
  Space,
  message,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { IProduct } from '@/services/Product/typing';
import { formatMoney } from '@/utils/format';
import dayjs from 'dayjs';

interface OrderProduct {
  productId: number;
  productName: string;
  quantity: number;
  price: number;
}

interface Order {
  id: string;
  customerName: string;
  phone: string;
  address: string;
  products: OrderProduct[];
  totalAmount: number;
  status: string;
  createdAt: string;
}

interface Props {
  products: IProduct[];
  setProducts: (p: IProduct[]) => void;
}

const INIT_ORDERS: Order[] = [
  {
    id: 'DH001',
    customerName: 'Nguyễn Văn A',
    phone: '0912345678',
    address: '123 Nguyễn Huệ, Q1, TP.HCM',
    products: [
      { productId: 1, productName: 'Laptop Dell XPS 13', quantity: 1, price: 25000000 },
    ],
    totalAmount: 25000000,
    status: 'Chờ xử lý',
    createdAt: '2024-01-15',
  },
];

const OrderPage: React.FC<Props> = ({ products, setProducts }) => {
  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('orders');
    return saved ? JSON.parse(saved) : INIT_ORDERS;
  });
  const [openForm, setOpenForm] = useState(false);
  const [openDetail, setOpenDetail] = useState<Order | null>(null);

  useEffect(() => {
    localStorage.setItem('orders', JSON.stringify(orders));
  }, [orders]);

  // Tạo đơn hàng mới
  const handleCreateOrder = (values: any) => {
    const selectedProducts: OrderProduct[] = values.products.map((pid: number) => {
      const prod = products.find((p) => p.id === pid)!;
      const qty = values[`qty_${pid}`];
      if (qty > prod.quantity) {
        message.error(`Số lượng đặt vượt quá tồn kho cho ${prod.name}`);
        throw new Error('Invalid quantity');
      }
      return { productId: pid, productName: prod.name, quantity: qty, price: prod.price };
    });

    const totalAmount = selectedProducts.reduce((sum, p) => sum + p.price * p.quantity, 0);

    const newOrder: Order = {
      id: `DH${Date.now()}`,
      customerName: values.customerName,
      phone: values.phone,
      address: values.address,
      products: selectedProducts,
      totalAmount,
      status: 'Chờ xử lý',
      createdAt: dayjs().format('YYYY-MM-DD'),
    };

    setOrders([...orders, newOrder]);
    message.success('Tạo đơn hàng thành công');
    setOpenForm(false);
  };

  // Cập nhật trạng thái đơn hàng
  const handleStatusChange = (order: Order, newStatus: string) => {
    const updatedOrders = orders.map((o) => {
      if (o.id !== order.id) return o;
      // Trừ kho khi hoàn thành
      if (newStatus === 'Hoàn thành' && o.status !== 'Hoàn thành') {
        const newProducts = products.map((p) => {
          const item = o.products.find((x) => x.productId === p.id);
          return item ? { ...p, quantity: p.quantity - item.quantity } : p;
        });
        setProducts(newProducts);
      }
      // Hoàn trả kho khi hủy
      if (newStatus === 'Đã hủy' && o.status !== 'Đã hủy') {
        const newProducts = products.map((p) => {
          const item = o.products.find((x) => x.productId === p.id);
          return item ? { ...p, quantity: p.quantity + item.quantity } : p;
        });
        setProducts(newProducts);
      }
      return { ...o, status: newStatus };
    });
    setOrders(updatedOrders);
  };

  // Cột table đơn hàng
  const columns: ColumnsType<Order> = [
    { title: 'Mã đơn', dataIndex: 'id' },
    { title: 'Khách hàng', dataIndex: 'customerName' },
    { title: 'Số sản phẩm', render: (_, r) => r.products.length },
    { title: 'Tổng tiền', dataIndex: 'totalAmount', render: formatMoney },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      render: (status, record) => (
        <Select
          value={status}
          onChange={(val) => handleStatusChange(record, val)}
          style={{ width: 120 }}
        >
          <Select.Option value="Chờ xử lý">Chờ xử lý</Select.Option>
          <Select.Option value="Đang giao">Đang giao</Select.Option>
          <Select.Option value="Hoàn thành">Hoàn thành</Select.Option>
          <Select.Option value="Đã hủy">Đã hủy</Select.Option>
        </Select>
      ),
    },
    { title: 'Ngày tạo', dataIndex: 'createdAt' },
    {
      title: 'Thao tác',
      render: (_, record) => (
        <Button size="small" onClick={() => setOpenDetail(record)}>
          Chi tiết
        </Button>
      ),
    },
  ];

  return (
    <>
      <Space style={{ marginBottom: 16 }}>
        <Button type="primary" onClick={() => setOpenForm(true)}>
          Tạo đơn hàng
        </Button>
      </Space>

      <Table<Order> rowKey="id" columns={columns} dataSource={orders} />

      {/* Form tạo đơn hàng */}
      <Modal
        title="Tạo đơn hàng mới"
        open={openForm}
        onCancel={() => setOpenForm(false)}
        onOk={() => {
          const form = document.getElementById('orderForm') as any;
          form.submit();
        }}
        okText="Lưu"
      >
        <Form id="orderForm" layout="vertical" onFinish={handleCreateOrder}>
          <Form.Item
            label="Tên khách hàng"
            name="customerName"
            rules={[{ required: true, message: 'Bắt buộc nhập' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Số điện thoại"
            name="phone"
            rules={[
              { required: true, message: 'Bắt buộc nhập' },
              {
                pattern: /^\d{10,11}$/,
                message: 'Số điện thoại phải 10-11 chữ số',
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Địa chỉ"
            name="address"
            rules={[{ required: true, message: 'Bắt buộc nhập' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Sản phẩm"
            name="products"
            rules={[{ required: true, message: 'Chọn ít nhất 1 sản phẩm' }]}
          >
            <Select mode="multiple" placeholder="Chọn sản phẩm">
              {products.map((p) => (
                <Select.Option key={p.id} value={p.id}>
                  {p.name} ({p.quantity} tồn)
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          {products.map((p) => (
            <Form.Item
              key={p.id}
              label={`Số lượng cho ${p.name}`}
              name={`qty_${p.id}`}
              initialValue={0}
            >
              <InputNumber min={0} max={p.quantity} style={{ width: '100%' }} />
            </Form.Item>
          ))}
        </Form>
      </Modal>

      {/* Modal chi tiết đơn hàng */}
        <Modal 
            title="Chi tiết đơn hàng" 
            open={!!openDetail} 
            onCancel={() => setOpenDetail(null)} 
            footer={null} 
            > 
            {openDetail && ( 
                <> 
                    <p><b>Mã đơn:</b> {openDetail.id}</p> 
                    <p><b>Khách hàng:</b> {openDetail.customerName}</p> 
                    <p><b>SĐT:</b> {openDetail.phone}</p> 
                    <p><b>Địa chỉ:</b> {openDetail.address}</p> 
                    <p><b>Ngày tạo:</b> {openDetail.createdAt}</p> 
                    <p><b>Trạng thái:</b> {openDetail.status}</p> 
                    <Table<OrderProduct> 
                        rowKey="productId" 
                        dataSource={openDetail.products} 
                        pagination={false} 
                        columns={[ 
                            { title: 'Sản phẩm', dataIndex: 'productName' }, 
                            { title: 'Số lượng', dataIndex: 'quantity', align: 'center' }, 
                            { 
                                title: 'Đơn giá', 
                                dataIndex: 'price', 
                                align: 'right', render: (value: number) => formatMoney(value), 
                            }, 
                            { 
                                title: 'Thành tiền', 
                                align: 'right', 
                                render: (_, record) => formatMoney(record.price * record.quantity), 
                            }, 
                        ]} 
                    /> 
                    <p style={{ marginTop: 16 }}> 
                        <b>Tổng tiền:</b> {formatMoney(openDetail.totalAmount)} 
                    </p> 
                </> 
                )} 
        </Modal> 
        </> 
    ); 
}; 

export default OrderPage;