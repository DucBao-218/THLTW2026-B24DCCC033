import React, { useContext, useState } from 'react';
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  InputNumber,
  Popconfirm,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { AppContext, IService } from './_layout';

type ServiceForm = Omit<IService, 'id'>;

export default () => {
  const context = useContext(AppContext);
  if (!context) return null;

  const { services, saveServices, appointments } = context;

  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<IService | null>(null);

  const [form] = Form.useForm<ServiceForm>();

  const submit = async () => {
    const values = await form.validateFields();

    if (editing) {
      saveServices(
        services.map(s =>
          s.id === editing.id ? { ...s, ...values } : s
        )
      );
    } else {
      saveServices([
        ...services,
        { id: Date.now(), ...values }
      ]);
    }

    setOpen(false);
  };

  // 🔥 chặn xóa nếu đã có lịch dùng dịch vụ
  const handleDelete = (id: number) => {
    const used = appointments.some(a => a.serviceId === id);

    if (used) {
      alert('Dịch vụ đã được đặt lịch, không thể xóa');
      return;
    }

    saveServices(services.filter(s => s.id !== id));
  };

  const columns: ColumnsType<IService> = [
    { title: 'Tên', dataIndex: 'name' },
    { title: 'Giá', dataIndex: 'price' },
    { title: 'Thời gian (phút)', dataIndex: 'duration' },
    {
      title: 'Hành động',
      render: (_, r) => (
        <>
          <Button
            style={{ marginRight: 8 }}
            onClick={() => {
              setEditing(r);
              form.setFieldsValue({
                name: r.name,
                price: r.price,
                duration: r.duration,
              });
              setOpen(true);
            }}
          >
            Sửa
          </Button>

          <Popconfirm
            title="Xóa dịch vụ?"
            onConfirm={() => handleDelete(r.id)}
          >
            <Button danger>Xóa</Button>
          </Popconfirm>
        </>
      ),
    },
  ];

  return (
    <>
      <Button
        onClick={() => {
          setEditing(null);
          form.resetFields();
          setOpen(true);
        }}
      >
        Thêm dịch vụ
      </Button>

      <Table rowKey="id" dataSource={services} columns={columns} />

      <Modal open={open} onOk={submit} onCancel={() => setOpen(false)}>
        <Form form={form} layout="vertical">
          <Form.Item name="name" label="Tên" rules={[{ required: true }]}>
            <Input />
          </Form.Item>

          <Form.Item name="price" label="Giá">
            <InputNumber style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item name="duration" label="Thời gian (phút)">
            <InputNumber style={{ width: '100%' }} />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};