import React from 'react';
import { Table, Button, Select, Tag } from 'antd';
import type { ColumnsType } from 'antd/es/table';

import { IOrder } from '@/services/Order/typing';
import dayjs from 'dayjs';
import { formatMoney } from '@/utils/format';

interface Props {
  data: IOrder[];
  onView: (order: IOrder) => void;
  onStatusChange: (order: IOrder, status: IOrder['status']) => void;
}

const OrderTable: React.FC<Props> = ({ data, onView, onStatusChange }) => {
  const columns: ColumnsType<IOrder> = [

    {
      title: 'Mã đơn hàng',
      dataIndex: 'id',
    },

    {
      title: 'Tên khách hàng',
      dataIndex: 'customerName',
    },

    {
      title: 'Số sản phẩm',
      align: 'center',
      render: (_, record) => record.products.length,
    },

    {
      title: 'Tổng tiền',
      dataIndex: 'totalAmount',
      render: formatMoney,
      sorter: (a, b) => a.totalAmount - b.totalAmount,
    },

    {
      title: 'Trạng thái',
      dataIndex: 'status',
      render: (status, record) => (
        <Select
          value={status}
          style={{ width: 150 }}
          onChange={(val) => onStatusChange(record, val)}
        >
          <Select.Option value="Chờ xử lý">Chờ xử lý</Select.Option>
          <Select.Option value="Đang giao">Đang giao</Select.Option>
          <Select.Option value="Hoàn thành">Hoàn thành</Select.Option>
          <Select.Option value="Đã hủy">Đã hủy</Select.Option>
        </Select>
      ),
    },

    {
      title: 'Ngày tạo',
      dataIndex: 'createdAt',
      sorter: (a, b) =>
        dayjs(a.createdAt).unix() - dayjs(b.createdAt).unix(),
    },

    {
      title: 'Thao tác',
      align: 'center',
      render: (_, record) => (
        <Button size="small" onClick={() => onView(record)}>
          Chi tiết
        </Button>
      ),
    },
  ];

  return (
    <Table
      rowKey="id"
      columns={columns}
      dataSource={data}
      pagination={{ pageSize: 5 }} 
    />
  );
};

export default OrderTable;
