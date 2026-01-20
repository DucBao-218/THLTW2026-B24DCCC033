import { Table, Button, Popconfirm } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { IProduct } from '@/services/Product/typing';
import { formatMoney } from '@/utils/format';

interface Props {
  data: IProduct[];
  onDelete: (id: number) => void;
}

const ProductTable: React.FC<Props> = ({ data, onDelete }) => {
  const columns: ColumnsType<IProduct> = [
    {
      title: 'STT',
      width: 70,
      render: (_, __, index) => index + 1,
    },
    {
      title: 'Tên sản phẩm',
      dataIndex: 'name',
    },
    {
      title: 'Giá',
      dataIndex: 'price',
      align: 'right',
      render: formatMoney,
    },
    {
      title: 'Số lượng',
      dataIndex: 'quantity',
      align: 'center',
    },
    {
      title: 'Thao tác',
      align: 'center',
      render: (_, record) => (
        <Popconfirm
          title="Xóa sản phẩm?"
          onConfirm={() => onDelete(record.id)}
        >
          <Button danger size="small">
            Xóa
          </Button>
        </Popconfirm>
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

export default ProductTable;
