import React, { useState, useEffect } from 'react';
import {
  Table, Button, Space, Modal, Form, Input, InputNumber, Select,
  Rate, Tag, Popconfirm, message, Typography, Card, Image,
  Tooltip, Row, Col, Upload, Switch, Divider,
} from 'antd';
import {
  PlusOutlined, EditOutlined, DeleteOutlined, SearchOutlined,
  UploadOutlined, StarOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import {
  DiemDen, LoaiHinh, LOAI_HINH_LABELS, STORAGE_KEYS,
  getFromStorage, saveToStorage, seedDiemDen, generateId, formatVND,
} from '../../types';

const { Title, Text } = Typography;
const { TextArea } = Input;
const { Option } = Select;

const AdminDiemDen: React.FC = () => {
  const [danhSach, setDanhSach] = useState<DiemDen[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<DiemDen | null>(null);
  const [searchText, setSearchText] = useState('');
  const [previewUrl, setPreviewUrl] = useState('');
  const [form] = Form.useForm();

  useEffect(() => {
    const stored = getFromStorage<DiemDen[]>(STORAGE_KEYS.DIEM_DEN, []);
    if (!stored.length) {
      saveToStorage(STORAGE_KEYS.DIEM_DEN, seedDiemDen);
      setDanhSach(seedDiemDen);
    } else {
      setDanhSach(stored);
    }
  }, []);

  const save = (list: DiemDen[]) => {
    setDanhSach(list);
    saveToStorage(STORAGE_KEYS.DIEM_DEN, list);
  };

  const filtered = danhSach.filter(
    (d) =>
      d.ten.toLowerCase().includes(searchText.toLowerCase()) ||
      d.viTri.toLowerCase().includes(searchText.toLowerCase()),
  );

  const openAdd = () => {
    setEditingItem(null);
    form.resetFields();
    setPreviewUrl('');
    setModalOpen(true);
  };

  const openEdit = (record: DiemDen) => {
    setEditingItem(record);
    form.setFieldsValue(record);
    setPreviewUrl(record.hinhAnh);
    setModalOpen(true);
  };

  const handleDelete = (id: string) => {
    save(danhSach.filter((d) => d.id !== id));
    message.success('Đã xóa điểm đến');
  };

  const handleSubmit = () => {
    form.validateFields().then((vals) => {
      const item: DiemDen = {
        id: editingItem?.id || generateId(),
        ten: vals.ten,
        viTri: vals.viTri,
        quocGia: vals.quocGia || 'Việt Nam',
        loaiHinh: vals.loaiHinh,
        hinhAnh: vals.hinhAnh || `https://api.dicebear.com/7.x/shapes/svg?seed=${vals.ten}`,
        moTa: vals.moTa || '',
        thoiGianThamQuan: vals.thoiGianThamQuan || 4,
        chiPhiAnUong: vals.chiPhiAnUong || 0,
        chiPhiLuuTru: vals.chiPhiLuuTru || 0,
        chiPhiDiChuyen: vals.chiPhiDiChuyen || 0,
        rating: vals.rating || 4.0,
        luotXem: editingItem ? editingItem.luotXem : 0,
        luotLichTrinh: editingItem ? editingItem.luotLichTrinh : 0, 
        giaVe: vals.giaVe || 0,
        createdAt: editingItem?.createdAt || dayjs().format('YYYY-MM-DD'),
      };
      
      if (editingItem) {
        save(danhSach.map((d) => (d.id === editingItem.id ? item : d)));
        message.success('Cập nhật thành công');
      } else {
        save([...danhSach, item]);
        message.success('Thêm điểm đến thành công');
      }
      setModalOpen(false);
    });
  };

  const columns: ColumnsType<DiemDen> = [
    {
      title: 'Ảnh',
      dataIndex: 'hinhAnh',
      key: 'hinhAnh',
      width: 80,
      render: (src) => (
        <Image
          src={src}
          width={60}
          height={45}
          style={{ objectFit: 'cover', borderRadius: 6 }}
          fallback="https://via.placeholder.com/60x45"
        />
      ),
    },
    {
      title: 'Tên điểm đến',
      dataIndex: 'ten',
      key: 'ten',
      sorter: (a, b) => a.ten.localeCompare(b.ten),
      render: (v, r) => (
        <div>
          <Text strong>{v}</Text>
          <div><Text type="secondary" style={{ fontSize: 12 }}>{r.viTri}, {r.quocGia}</Text></div>
        </div>
      ),
    },
    {
      title: 'Loại hình',
      dataIndex: 'loaiHinh',
      key: 'loaiHinh',
      width: 100,
      filters: (Object.keys(LOAI_HINH_LABELS) as LoaiHinh[]).map((k) => ({ text: LOAI_HINH_LABELS[k], value: k })),
      onFilter: (value, record) => record.loaiHinh === value,
      render: (v: LoaiHinh) => <Tag color="blue">{LOAI_HINH_LABELS[v]}</Tag>,
    },
    {
      title: 'Rating',
      dataIndex: 'rating',
      key: 'rating',
      width: 100,
      sorter: (a, b) => a.rating - b.rating,
      render: (v) => (
        <Space>
          <StarOutlined style={{ color: '#fadb14' }} />
          <Text strong>{v}</Text>
        </Space>
      ),
    },
    {
      title: 'Thời gian',
      dataIndex: 'thoiGianThamQuan',
      key: 'thoiGianThamQuan',
      width: 100,
      sorter: (a, b) => a.thoiGianThamQuan - b.thoiGianThamQuan,
      render: (v) => `${v} giờ`,
    },
    {
      title: 'Ăn uống (VND)',
      dataIndex: 'chiPhiAnUong',
      key: 'chiPhiAnUong',
      sorter: (a, b) => a.chiPhiAnUong - b.chiPhiAnUong,
      render: (v) => formatVND(v),
    },
    {
      title: 'Lưu trú (VND)',
      dataIndex: 'chiPhiLuuTru',
      key: 'chiPhiLuuTru',
      sorter: (a, b) => a.chiPhiLuuTru - b.chiPhiLuuTru,
      render: (v) => formatVND(v),
    },
    {
      title: 'Di chuyển (VND)',
      dataIndex: 'chiPhiDiChuyen',
      key: 'chiPhiDiChuyen',
      sorter: (a, b) => a.chiPhiDiChuyen - b.chiPhiDiChuyen,
      render: (v) => formatVND(v),
    },
    {
      title: 'Vé tham quan (VND)',
      dataIndex: 'giaVe',
      key: 'giaVe',
      sorter: (a, b) => a.giaVe - b.giaVe,
      render: (v) => formatVND(v),
    },
    {
      title: 'Lịch trình',
      dataIndex: 'luotLichTrinh',
      key: 'luotLichTrinh',
      sorter: (a, b) => a.luotLichTrinh - b.luotLichTrinh,
      render: (v) => <Tag color="volcano">{v.toLocaleString()}</Tag>,
    },
    {
      title: 'Thao tác',
      key: 'action',
      width: 80,
      fixed: 'right' as const,
      render: (_, record) => (
        <Space>
          <Tooltip title="Chỉnh sửa">
            <Button size="small" icon={<EditOutlined />} onClick={() => openEdit(record)} />
          </Tooltip>
          <Popconfirm title="Xóa điểm đến này?" onConfirm={() => handleDelete(record.id)} okText="Xóa" cancelText="Hủy">
            <Tooltip title="Xóa">
              <Button size="small" danger icon={<DeleteOutlined />} />
            </Tooltip>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <Card>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, flexWrap: 'wrap', gap: 12 }}>
          <Title level={4} style={{ margin: 0 }}>Quản lý điểm đến</Title>
          <Space>
            <Input
              placeholder="Tìm kiếm..."
              prefix={<SearchOutlined />}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              style={{ width: 220 }}
              allowClear
            />
            <Button type="primary" icon={<PlusOutlined />} onClick={openAdd}>Thêm điểm đến</Button>
          </Space>
        </div>

        <Table
          columns={columns}
          dataSource={filtered}
          rowKey="id"
          scroll={{ x: 1300 }}
          pagination={{ pageSize: 8, showTotal: (t) => `Tổng ${t} điểm đến` }}
        />
      </Card>

      <Modal
        title={editingItem ? 'Chỉnh sửa điểm đến' : 'Thêm điểm đến mới'}
        open={modalOpen}
        onOk={handleSubmit}
        onCancel={() => setModalOpen(false)}
        width={720}
        okText={editingItem ? 'Cập nhật' : 'Thêm mới'}
        cancelText="Hủy"
      >
        <Form form={form} layout="vertical">
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="Tên điểm đến" name="ten" rules={[{ required: true }]}>
                <Input placeholder="VD: Vịnh Hạ Long" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Vị trí (tỉnh/thành)" name="viTri" rules={[{ required: true }]}>
                <Input placeholder="VD: Quảng Ninh" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Quốc gia" name="quocGia" initialValue="Việt Nam">
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Loại hình" name="loaiHinh" rules={[{ required: true }]}>
                <Select placeholder="Chọn loại hình">
                  {(Object.keys(LOAI_HINH_LABELS) as LoaiHinh[]).map((k) => (
                    <Option key={k} value={k}>{LOAI_HINH_LABELS[k]}</Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item label="URL hình ảnh" name="hinhAnh">
                <Input
                  placeholder="https://images.unsplash.com/..."
                  onChange={(e) => setPreviewUrl(e.target.value)}
                  addonAfter={
                    previewUrl ? (
                      <Image src={previewUrl} width={32} height={24} style={{ objectFit: 'cover' }}
                        fallback="" preview={false} />
                    ) : <UploadOutlined />
                  }
                />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item label="Mô tả chi tiết" name="moTa">
                <TextArea rows={3} placeholder="Mô tả về điểm đến..." />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="Thời gian tham quan" name="thoiGianThamQuan" initialValue={4}>
                <InputNumber min={1} max={48} style={{ width: '100%' }} addonAfter="giờ" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="Đánh giá (Rating)" name="rating" initialValue={4.0}>
                <Rate allowHalf style={{ fontSize: 20 }} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="Vé tham quan" name="giaVe" initialValue={0}>
                <InputNumber
                  min={0} style={{ width: '100%' }}
                  formatter={(v) => `${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  addonAfter="VND"
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="Chi phí Ăn uống/người" name="chiPhiAnUong" initialValue={200000}>
                <InputNumber
                  min={0} style={{ width: '100%' }}
                  formatter={(v) => `${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  addonAfter="VND"
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="Chi phí Lưu trú/đêm" name="chiPhiLuuTru" initialValue={500000}>
                <InputNumber
                  min={0} style={{ width: '100%' }}
                  formatter={(v) => `${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  addonAfter="VND"
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="Chi phí Di chuyển ước tính" name="chiPhiDiChuyen" initialValue={300000}>
                <InputNumber
                  min={0} style={{ width: '100%' }}
                  formatter={(v) => `${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  addonAfter="VND"
                />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </div>
  );
};

export default AdminDiemDen;