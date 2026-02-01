import React, { useEffect, useMemo, useState } from 'react';
import { Button, Space, Input, Select, DatePicker, message } from 'antd';
import dayjs from 'dayjs';

import isBetween from 'dayjs/plugin/isBetween';
dayjs.extend(isBetween);

import { IOrder } from '@/services/Order/typing';
import { useAppContext } from '@/layouts/AppContext';

import OrderForm from '@/components/Order/OrderForm';
import OrderDetailModal from '@/components/Order/OrderDetailModal';
import OrderTable from '@/components/Order/OrderTable';

const { RangePicker } = DatePicker;

const OrderPage: React.FC = () => {
  const { products, setProducts, orders, setOrders } = useAppContext();

  const [openForm, setOpenForm] = useState(false);
  const [detailOrder, setDetailOrder] = useState<IOrder | null>(null);

  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>();
  const [dateRange, setDateRange] = useState<any>(null);

  useEffect(() => {
    localStorage.setItem('orders', JSON.stringify(orders));
  }, [orders]);

  const handleCreateOrder = (values: any) => {
    try {
      const selectedProducts = values.products.map((pid: number) => {
        const prod = products.find((p) => p.id === pid)!;
        const qty = values[`qty_${pid}`];

        if (!qty || qty <= 0) {
          throw new Error(`Bạn chưa nhập số lượng cho "${prod.name}"`);
        }

        if (qty > prod.quantity) {
          throw new Error(
            `"${prod.name}" chỉ còn ${prod.quantity} sản phẩm trong kho!`,
          );
        }

        return {
          productId: pid,
          productName: prod.name,
          quantity: qty,
          price: prod.price,
        };
      });

      const totalAmount = selectedProducts.reduce(
        (sum: number, item: any) => sum + item.price * item.quantity,
        0,
      );

      const newOrder: IOrder = {
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

      message.success('Tạo đơn hàng thành công!');

      setOpenForm(false);
    } catch (err: any) {
      message.error(err.message);
    }
  };

  const handleStatusChange = (order: IOrder, newStatus: IOrder['status']) => {
    const updatedOrders = orders.map((o) => {
      if (o.id !== order.id) return o;

      if (newStatus === 'Hoàn thành' && o.status !== 'Hoàn thành') {
        const updatedProducts = products.map((p) => {
          const item = o.products.find((x) => x.productId === p.id);

          return item
            ? { ...p, quantity: p.quantity - item.quantity }
            : p;
        });

        setProducts(updatedProducts);
        message.success('Đơn hàng hoàn thành → Đã trừ kho!');
      }

      if (newStatus === 'Đã hủy' && o.status !== 'Đã hủy') {
        const updatedProducts = products.map((p) => {
          const item = o.products.find((x) => x.productId === p.id);

          return item
            ? { ...p, quantity: p.quantity + item.quantity }
            : p;
        });

        setProducts(updatedProducts);
        message.warning('Đơn hàng bị hủy → Đã hoàn kho!');
      }

      return { ...o, status: newStatus };
    });

    setOrders(updatedOrders);
  };

  const filteredOrders = useMemo(() => {
    return orders.filter((o) => {

      const matchSearch =
        o.id.toLowerCase().includes(searchText.toLowerCase()) ||
        o.customerName.toLowerCase().includes(searchText.toLowerCase());

      const matchStatus = statusFilter ? o.status === statusFilter : true;

      const matchDate =
        dateRange && dateRange.length === 2
          ? dayjs(o.createdAt).isBetween(
              dateRange[0],
              dateRange[1],
              'day',
              '[]',
            )
          : true;

      return matchSearch && matchStatus && matchDate;
    });
  }, [orders, searchText, statusFilter, dateRange]);

  return (
    <>
      <Space style={{ marginBottom: 16 }} wrap>
        <Button type="primary" onClick={() => setOpenForm(true)}>
          + Tạo đơn hàng
        </Button>

        <Input
          placeholder="Tìm theo mã đơn hoặc khách hàng..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          style={{ width: 260 }}
        />

        <Select
          placeholder="Lọc trạng thái"
          allowClear
          style={{ width: 180 }}
          value={statusFilter}
          onChange={(val) => setStatusFilter(val)}
        >
          <Select.Option value="Chờ xử lý">Chờ xử lý</Select.Option>
          <Select.Option value="Đang giao">Đang giao</Select.Option>
          <Select.Option value="Hoàn thành">Hoàn thành</Select.Option>
          <Select.Option value="Đã hủy">Đã hủy</Select.Option>
        </Select>

        <RangePicker onChange={(val) => setDateRange(val)} />
      </Space>

      <OrderTable
        data={filteredOrders}
        onView={(o) => setDetailOrder(o)}
        onStatusChange={handleStatusChange}
      />

      <OrderForm
        open={openForm}
        onCancel={() => setOpenForm(false)}
        onSubmit={handleCreateOrder}
        products={products}
      />

      <OrderDetailModal
        order={detailOrder}
        onClose={() => setDetailOrder(null)}
      />
    </>
  );
};

export default OrderPage;
