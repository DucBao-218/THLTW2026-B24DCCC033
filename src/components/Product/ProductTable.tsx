import React, { useMemo } from 'react';
import { Table, Button, Popconfirm, Space, Tag } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { IProduct } from '@/services/Product/typing';
import { formatMoney } from '@/utils/format';

interface Props {
  data: IProduct[];
  page: number;
  total: number;
  pageSize: number;
  onPageChange: (p: number) => void;
  onDelete: (id: number) => void;
  onEdit: (record: IProduct) => void;
}

const ProductTable: React.FC<Props> = ({
  data,
  page,
  total,
  pageSize,
  onPageChange,
  onDelete,
  onEdit,
}) => {
  // Hàm hiển thị trạng thái bằng Tag màu
  const getStatusTag = (quantity: number) => {
    if (quantity === 0) return <Tag color="red">Hết hàng</Tag>;
    if (quantity <= 10) return <Tag color="orange">Sắp hết</Tag>;
    return <Tag color="green">Còn hàng</Tag>;
  };

  // Định nghĩa các cột
  const columns: ColumnsType<IProduct> = useMemo(
    () => [
      {
        title: 'STT',
        width: 70,
        render: (_: any, __: any, index: number) =>
          (page - 1) * pageSize + index + 1,
      },
      {
        title: 'Tên sản phẩm',
        dataIndex: 'name',
        sorter: (a, b) => a.name.localeCompare(b.name),
      },
      {
        title: 'Danh mục',
        dataIndex: 'category',
      },
      {
        title: 'Giá',
        dataIndex: 'price',
        align: 'right',
        sorter: (a, b) => a.price - b.price,
        render: (value: number) => formatMoney(value),
      },
      {
        title: 'Số lượng tồn kho',
        dataIndex: 'quantity',
        align: 'center',
        sorter: (a, b) => a.quantity - b.quantity,
      },
      {
        title: 'Trạng thái',
        dataIndex: 'quantity',
        align: 'center',
        render: (q: number) => getStatusTag(q),
      },
      {
        title: 'Thao tác',
        align: 'center',
        render: (_: any, record: IProduct) => (
          <Space>
            <Button size="small" onClick={() => onEdit(record)}>
              Sửa
            </Button>
            <Popconfirm
              title="Xóa sản phẩm?"
              onConfirm={() => onDelete(record.id)}
              okText="Xóa"
              cancelText="Hủy"
            >
              <Button danger size="small">Xóa</Button>
            </Popconfirm>
          </Space>
        ),
      },
    ],
    [page, pageSize, onDelete, onEdit],
  );

  return (
    <Table<IProduct>
      rowKey="id"
      columns={columns}
      dataSource={data}
      pagination={{
        current: page,
        pageSize,
        total,
        showSizeChanger: false,
        onChange: (p) => onPageChange(p),
      }}
      locale={{ emptyText: 'Không có sản phẩm' }}
    />
  );
};

export default ProductTable;
