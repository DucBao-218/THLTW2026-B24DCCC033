import { useState } from 'react';
import { Button, Input, Space, message } from 'antd';
import ProductTable from '@/components/Product/ProductTable';
import ProductForm from '@/components/Product/ProductForm';
import { IProduct } from '@/services/Product/typing';

const PAGE_SIZE = 10;

const INIT_DATA: IProduct[] = [
  { id: 1, name: 'Laptop Dell XPS 13', price: 25000000, quantity: 10 },
  { id: 2, name: 'iPhone 15 Pro Max', price: 30000000, quantity: 15 },
  { id: 3, name: 'Samsung Galaxy S24', price: 22000000, quantity: 20 },
  { id: 4, name: 'iPad Air M2', price: 18000000, quantity: 12 },
  { id: 5, name: 'MacBook Air M3', price: 28000000, quantity: 8 },
];

export default function ProductPage() {
  const [data, setData] = useState<IProduct[]>(INIT_DATA);
  const [open, setOpen] = useState(false);
  const [keyword, setKeyword] = useState('');
  const [page, setPage] = useState(1);

  const handleAdd = (item: Omit<IProduct, 'id'>) => {
    setData(prev => {
      const newData = [...prev, { id: Date.now(), ...item }];

      // nếu vượt 10 sản phẩm → sang trang mới
      if (newData.length > PAGE_SIZE) {
        setPage(Math.ceil(newData.length / PAGE_SIZE));
      }

      return newData;
    });

    message.success('Thêm sản phẩm thành công');
    setOpen(false);
  };

  const handleDelete = (id: number) => {
    setData(prev => prev.filter(p => p.id !== id));
    message.success('Xóa sản phẩm thành công');
  };

  const filteredData = data.filter(p =>
    p.name.toLowerCase().includes(keyword.toLowerCase()),
  );

  return (
    <>
      <Space style={{ marginBottom: 16 }}>
        <Input.Search
          placeholder="Tìm theo tên sản phẩm"
          allowClear
          onChange={(e) => {
            setKeyword(e.target.value);
            setPage(1); // search thì quay về trang 1
          }}
          style={{ width: 300 }}
        />
        <Button type="primary" onClick={() => setOpen(true)}>
          Thêm sản phẩm
        </Button>
      </Space>

      <ProductTable
        data={filteredData}
        page={page}
        onPageChange={setPage}
        onDelete={handleDelete}
      />

      <ProductForm
        open={open}
        onCancel={() => setOpen(false)}
        onSubmit={handleAdd}
      />
    </>
  );
}
