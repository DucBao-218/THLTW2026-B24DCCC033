import { useState, useEffect, useMemo, useCallback } from 'react';
import { Button, Input, Space, Select, Slider, Tabs } from 'antd';
import { PageContainer } from '@ant-design/pro-components';
import ProductTable from '@/components/Product/ProductTable';
import ProductForm from '@/components/Product/ProductForm';
import { IProduct } from '@/services/Product/typing';
import OrderPage from '../Order';

const INIT_DATA: IProduct[] = [
  { id: 1, name: 'Laptop Dell XPS 13', category: 'Laptop', price: 25000000, quantity: 15 },
  { id: 2, name: 'iPhone 15 Pro Max', category: 'Điện thoại', price: 30000000, quantity: 8 },
  { id: 3, name: 'Samsung Galaxy S24', category: 'Điện thoại', price: 22000000, quantity: 20 },
  { id: 4, name: 'iPad Air M2', category: 'Máy tính bảng', price: 18000000, quantity: 5 },
  { id: 5, name: 'MacBook Air M3', category: 'Laptop', price: 28000000, quantity: 12 },
  { id: 6, name: 'AirPods Pro 2', category: 'Phụ kiện', price: 6000000, quantity: 0 },
  { id: 7, name: 'Samsung Galaxy Tab S9', category: 'Máy tính bảng', price: 15000000, quantity: 7 },
  { id: 8, name: 'Logitech MX Master 3', category: 'Phụ kiện', price: 2500000, quantity: 25 },
];

export default function ProductPage() {
  const [data, setData] = useState<IProduct[]>(() => {
    const saved = localStorage.getItem('products');
    return saved ? JSON.parse(saved) : INIT_DATA;
  });
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<IProduct | null>(null);
  const [keyword, setKeyword] = useState('');
  const [category, setCategory] = useState<string | undefined>();
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 40000000]);
  const [statusFilter, setStatusFilter] = useState<string | undefined>();
  const [page, setPage] = useState(1);

  useEffect(() => {
    localStorage.setItem('products', JSON.stringify(data));
  }, [data]);

  const handleAdd = (item: Omit<IProduct, 'id'>) => {
    setData([...data, { id: Date.now(), ...item }]);
  };
  const handleUpdate = (item: IProduct) => {
    setData(data.map(p => (p.id === item.id ? item : p)));
  };
  const handleDelete = (id: number) => {
    setData(data.filter(p => p.id !== id));
  };

  const filteredData = useMemo(() => {
    return data.filter(p => {
      const matchKeyword = p.name.toLowerCase().includes(keyword.toLowerCase());
      const matchCategory = category ? p.category === category : true;
      const matchPrice = p.price >= priceRange[0] && p.price <= priceRange[1];
      const matchStatus =
        statusFilter === 'in' ? p.quantity > 10 :
        statusFilter === 'low' ? p.quantity > 0 && p.quantity <= 10 :
        statusFilter === 'out' ? p.quantity === 0 : true;
      return matchKeyword && matchCategory && matchPrice && matchStatus;
    });
  }, [data, keyword, category, priceRange, statusFilter]);

  return (
    <PageContainer title="Quản lý sản phẩm & đơn hàng">
      <Tabs
        defaultActiveKey="products"
        items={[
          {
            key: 'products',
            label: 'Quản lý sản phẩm',
            children: (
              <>
                <Space style={{ marginBottom: 16 }}>
                  <Input.Search
                    placeholder="Tìm theo tên sản phẩm"
                    allowClear
                    onChange={(e) => {
                      setKeyword(e.target.value);
                      setPage(1);
                    }}
                    style={{ width: 200 }}
                  />
                  <Select
                    placeholder="Danh mục"
                    allowClear
                    style={{ width: 150 }}
                    onChange={setCategory}
                    options={[
                      { value: 'Laptop', label: 'Laptop' },
                      { value: 'Điện thoại', label: 'Điện thoại' },
                      { value: 'Máy tính bảng', label: 'Máy tính bảng' },
                      { value: 'Phụ kiện', label: 'Phụ kiện' },
                    ]}
                  />
                  <Slider
                    range
                    min={0}
                    max={40000000}
                    step={1000000}
                    style={{ width: 200 }}
                    value={priceRange}
                    onChange={setPriceRange}
                  />
                  <Select
                    placeholder="Trạng thái"
                    allowClear
                    style={{ width: 150 }}
                    onChange={setStatusFilter}
                    options={[
                      { value: 'in', label: 'Còn hàng' },
                      { value: 'low', label: 'Sắp hết' },
                      { value: 'out', label: 'Hết hàng' },
                    ]}
                  />
                  <Button type="primary" onClick={() => { setEditing(null); setOpen(true); }}>
                    Thêm sản phẩm
                  </Button>
                </Space>

                <ProductTable
                  data={filteredData}
                  page={page}
                  total={filteredData.length}
                  pageSize={5}
                  onPageChange={setPage}
                  onDelete={handleDelete}
                  onEdit={(record) => { setEditing(record); setOpen(true); }}
                />

                <ProductForm
                  open={open}
                  initialData={editing}
                  onCancel={() => setOpen(false)}
                  onSubmit={(values) => {
                    if (editing) handleUpdate(values as IProduct);
                    else handleAdd(values);
                    setOpen(false);
                  }}
                />
              </>
            ),
          },
          {
            key: 'orders',
            label: 'Quản lý đơn hàng',
            children: <OrderPage products={data} setProducts={setData} />,
          },
        ]}
      />
    </PageContainer>
  );
}
