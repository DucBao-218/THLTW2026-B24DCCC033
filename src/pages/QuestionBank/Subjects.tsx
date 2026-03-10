import React, { useState } from 'react';
import {
  Table, Button, Modal, Form, Input, InputNumber,
  Space, Typography, Card, Popconfirm, message, Tag,
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
  onThem: (data: Omit<MonHoc, 'id'>) => void;
  onSua:  (id: string, data: Omit<MonHoc, 'id'>) => void;
  onXoa:  (id: string) => void;
}

const Subjects: React.FC<Props> = ({ monHocs, onThem, onSua, onXoa }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form] = Form.useForm();

  const moModal = (record?: MonHoc) => {
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

  const columns: ColumnsType<MonHoc> = [
    { title: 'STT',         render: (_, __, i) => i + 1, width: 60,  align: 'center' },
    { title: 'Mã môn',      dataIndex: 'maMon',  key: 'maMon',  width: 120 },
    { title: 'Tên môn học', dataIndex: 'tenMon', key: 'tenMon' },
    {
      title: 'Số tín chỉ', dataIndex: 'soTinChi', key: 'soTinChi', width: 110, align: 'center',
      render: v => <Tag color="blue">{v} TC</Tag>,
    },
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
        <Title level={4} style={{ margin: 0 }}>Danh mục môn học</Title>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => moModal()}>Thêm mới</Button>
      </Space>
      <Table columns={columns} dataSource={monHocs} rowKey="id" size="middle"
        locale={{ emptyText: 'Chưa có môn học nào' }} />
      <Modal
        title={editingId ? 'Sửa môn học' : 'Thêm môn học'}
        visible={modalOpen} onOk={handleOk} onCancel={() => setModalOpen(false)}
        okText="Lưu" cancelText="Hủy" destroyOnClose
      >
        <Form form={form} layout="vertical" style={{ marginTop: 16 }}>
          <Form.Item name="maMon" label="Mã môn" rules={[{ required: true, message: 'Nhập mã môn' }]}>
            <Input placeholder="VD: CS101" />
          </Form.Item>
          <Form.Item name="tenMon" label="Tên môn học" rules={[{ required: true, message: 'Nhập tên môn' }]}>
            <Input placeholder="VD: Lập trình cơ bản" />
          </Form.Item>
          <Form.Item name="soTinChi" label="Số tín chỉ" rules={[{ required: true, message: 'Nhập số tín chỉ' }]}>
            <InputNumber min={1} max={10} style={{ width: '100%' }} />
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
};

export default Subjects;