import React, { useState } from 'react';
import {
  Table, Button, Modal, Form, Input,
  Space, Typography, Card, Popconfirm, message,
} from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { KhoiKienThuc, MonHoc, CauHoi, MauDeThi, DeThi } from './types';

const { Title } = Typography;

interface Props {
  khoiKienThucs: KhoiKienThuc[];
  monHocs: MonHoc[];
  cauHois: CauHoi[];
  mauDeThis: MauDeThi[];
  deThis: DeThi[];
  onThem: (data: Omit<KhoiKienThuc, 'id'>) => void;
  onSua:  (id: string, data: Omit<KhoiKienThuc, 'id'>) => void;
  onXoa:  (id: string) => void;
}

const KnowledgeBlock: React.FC<Props> = ({
  khoiKienThucs, onThem, onSua, onXoa,
}) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form] = Form.useForm();

  const moModal = (record?: KhoiKienThuc) => {
    if (record) { setEditingId(record.id); form.setFieldsValue(record); }
    else        { setEditingId(null);      form.resetFields(); }
    setModalOpen(true);
  };

  const handleOk = () => {
    form.validateFields().then(values => {
      if (editingId) { onSua(editingId, values); message.success('Đã cập nhật'); }
      else           { onThem(values);           message.success('Đã thêm');     }
      setModalOpen(false);
    });
  };

  const columns: ColumnsType<KhoiKienThuc> = [
    { title: 'STT', render: (_, __, i) => i + 1, width: 60, align: 'center' },
    { title: 'Tên khối kiến thức', dataIndex: 'ten',  key: 'ten'  },
    { title: 'Mô tả',              dataIndex: 'moTa', key: 'moTa', render: v => v || '—' },
    {
      title: 'Thao tác', key: 'action', width: 100, align: 'center',
      render: (_, record) => (
        <Space>
          <Button size="small" icon={<EditOutlined />} onClick={() => moModal(record)} />
          <Popconfirm title="Xác nhận xóa?" onConfirm={() => { onXoa(record.id); message.success('Đã xóa'); }}>
            <Button size="small" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <Card>
      <Space style={{ width: '100%', justifyContent: 'space-between', marginBottom: 16 }}>
        <Title level={4} style={{ margin: 0 }}> Danh mục khối kiến thức</Title>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => moModal()}>Thêm mới</Button>
      </Space>
      <Table columns={columns} dataSource={khoiKienThucs} rowKey="id" size="middle"
        locale={{ emptyText: 'Chưa có khối kiến thức nào' }} />
      <Modal
        title={editingId ? 'Sửa khối kiến thức' : 'Thêm khối kiến thức'}
        visible={modalOpen} onOk={handleOk} onCancel={() => setModalOpen(false)}
        okText="Lưu" cancelText="Hủy" destroyOnClose
      >
        <Form form={form} layout="vertical" style={{ marginTop: 16 }}>
          <Form.Item name="ten" label="Tên khối kiến thức" rules={[{ required: true, message: 'Nhập tên' }]}>
            <Input placeholder="VD: Tổng quan, Chuyên sâu..." />
          </Form.Item>
          <Form.Item name="moTa" label="Mô tả">
            <Input.TextArea rows={3} placeholder="Mô tả ngắn (tuỳ chọn)" />
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
};

export default KnowledgeBlock;