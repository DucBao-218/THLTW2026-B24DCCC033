import React from 'react';
import { Modal, Table, Tag } from 'antd';
import { IOrder } from '@/services/Order/typing';
import { formatMoney } from '@/utils/format';

interface Props {
  order: IOrder | null;
  onClose: () => void;
}

const OrderDetailModal: React.FC<Props> = ({ order, onClose }) => {
  if (!order) return null;

  const renderStatus = (s: string) => {
    if (s === 'Chờ xử lý') return <Tag color="orange">Chờ xử lý</Tag>;
    if (s === 'Đang giao') return <Tag color="blue">Đang giao</Tag>;
    if (s === 'Hoàn thành') return <Tag color="green">Hoàn thành</Tag>;
    return <Tag color="red">Đã hủy</Tag>;
  };

  return (
    <Modal title="Chi tiết đơn hàng" open={!!order} onCancel={onClose} footer={null}>
      <p><b>Mã đơn:</b> {order.id}</p>
      <p><b>Khách:</b> {order.customerName}</p>
      <p><b>SĐT:</b> {order.phone}</p>
      <p><b>Địa chỉ:</b> {order.address}</p>
      <p><b>Trạng thái:</b> {renderStatus(order.status)}</p>

      <Table
        rowKey="productId"
        pagination={false}
        dataSource={order.products}
        columns={[
          { title: 'Sản phẩm', dataIndex: 'productName' },
          { title: 'SL', dataIndex: 'quantity' },
          {
            title: 'Đơn giá',
            dataIndex: 'price',
            render: formatMoney,
          },
          {
            title: 'Thành tiền',
            render: (_, r) => formatMoney(r.price * r.quantity),
          },
        ]}
      />

      <p style={{ marginTop: 12 }}>
        <b>Tổng tiền:</b> {formatMoney(order.totalAmount)}
      </p>
    </Modal>
  );
};

export default OrderDetailModal;
