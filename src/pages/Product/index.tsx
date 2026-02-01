import { useState, useMemo } from 'react';
import {
  Button,
  Input,
  Space,
  Select,
  Slider,
  Tabs,
  message,
} from 'antd';
import { PageContainer } from '@ant-design/pro-components';

import ProductTable from '@/components/Product/ProductTable';
import ProductForm from '@/components/Product/ProductForm';

import { IProduct } from '@/services/Product/typing';
import OrderPage from '../Order';

import { useAppContext } from '@/layouts/AppContext';

const ProductPage: React.FC = () => {

  const { products, setProducts } = useAppContext();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<IProduct | null>(null);

  const [keyword, setKeyword] = useState('');
  const [category, setCategory] = useState<string | undefined>();

  const [priceRange, setPriceRange] = useState<[number, number]>([
    0, 40000000,
  ]);

  const [statusFilter, setStatusFilter] = useState<string | undefined>();

  const [sortType, setSortType] = useState<string | undefined>();

  const [page, setPage] = useState(1);

  const handleAdd = (item: Omit<IProduct, 'id'>) => {
    setProducts([...products, { id: Date.now(), ...item }]);
    message.success('Thêm sản phẩm thành công!');
  };

  const handleUpdate = (item: IProduct) => {
    setProducts(products.map((p) => (p.id === item.id ? item : p)));
    message.success('Cập nhật sản phẩm thành công!');
  };

  const handleDelete = (id: number) => {
    setProducts(products.filter((p) => p.id !== id));
    message.success('Xóa sản phẩm thành công!');
  };

  const filteredData = useMemo(() => {
    // Lọc
    const data = products.filter((p) => {
      const matchKeyword = p.name
        .toLowerCase()
        .includes(keyword.toLowerCase());

      const matchCategory = category ? p.category === category : true;

      const matchPrice =
        p.price >= priceRange[0] && p.price <= priceRange[1];

      const matchStatus =
        statusFilter === 'in'
          ? p.quantity > 10
          : statusFilter === 'low'
          ? p.quantity > 0 && p.quantity <= 10
          : statusFilter === 'out'
          ? p.quantity === 0
          : true;

      return matchKeyword && matchCategory && matchPrice && matchStatus;
    });

    // Sắp xếp
    const sortedData = [...data];

    if (sortType === 'name') {
      sortedData.sort((a, b) => a.name.localeCompare(b.name));
    }

    if (sortType === 'priceAsc') {
      sortedData.sort((a, b) => a.price - b.price);
    }

    if (sortType === 'priceDesc') {
      sortedData.sort((a, b) => b.price - a.price);
    }

    if (sortType === 'qty') {
      sortedData.sort((a, b) => a.quantity - b.quantity);
    }

    return sortedData;
  }, [products, keyword, category, priceRange, statusFilter, sortType]);

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
                <Space style={{ marginBottom: 16 }} wrap>
                  <Input.Search
                    placeholder="Tìm theo tên sản phẩm"
                    allowClear
                    style={{ width: 220 }}
                    onChange={(e) => {
                      setKeyword(e.target.value);
                      setPage(1);
                    }}
                  />

                  <Select
                    placeholder="Danh mục"
                    allowClear
                    style={{ width: 160 }}
                    onChange={(val) => {
                      setCategory(val);
                      setPage(1);
                    }}
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
                    onChange={(val) => {
                      setPriceRange(val);
                      setPage(1);
                    }}
                  />

                  <Select
                    placeholder="Trạng thái kho"
                    allowClear
                    style={{ width: 170 }}
                    onChange={(val) => {
                      setStatusFilter(val);
                      setPage(1);
                    }}
                    options={[
                      { value: 'in', label: 'Còn hàng (>10)' },
                      { value: 'low', label: 'Sắp hết (1-10)' },
                      { value: 'out', label: 'Hết hàng (=0)' },
                    ]}
                  />

                  <Select
                    placeholder="Sắp xếp"
                    allowClear
                    style={{ width: 200 }}
                    onChange={setSortType}
                    options={[
                      { value: 'name', label: 'Tên (A-Z)' },
                      { value: 'priceAsc', label: 'Giá thấp → cao' },
                      { value: 'priceDesc', label: 'Giá cao → thấp' },
                      { value: 'qty', label: 'Số lượng tăng dần' },
                    ]}
                  />

                  <Button
                    type="primary"
                    onClick={() => {
                      setEditing(null);
                      setOpen(true);
                    }}
                  >
                    + Thêm sản phẩm
                  </Button>
                </Space>

                <ProductTable
                  data={filteredData}
                  page={page}
                  total={filteredData.length}
                  pageSize={5}
                  onPageChange={setPage}
                  onDelete={handleDelete}
                  onEdit={(record) => {
                    setEditing(record);
                    setOpen(true);
                  }}
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
            children: <OrderPage />,
          },
        ]}
      />
    </PageContainer>
  );
};

export default ProductPage;
