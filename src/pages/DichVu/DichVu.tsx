import React, { useContext, useState } from 'react';
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  InputNumber,
  Popconfirm,
  message,
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

    if (values.price <= 0) {
      message.error('Giá phải > 0');
      return;
    }

    if (values.duration <= 0) {
      message.error('Thời gian phải > 0');
      return;
    }

    if (editing) {
      saveServices(
        services.map(s =>
          s.id === editing.id ? { ...s, ...values } : s
        )
      );
      message.success('Cập nhật dịch vụ thành công');
    } else {
      saveServices([
        ...services,
        { id: Date.now(), ...values }
      ]);
      message.success('Thêm dịch vụ thành công');
    }

    setOpen(false);
    form.resetFields();
    setEditing(null);
  };

  const handleDelete = (id: number) => {
    const used = appointments.some(a => a.serviceId === id);

    if (used) {
      message.error('Dịch vụ đã được đặt lịch, không thể xóa');
      return;
    }

    saveServices(services.filter(s => s.id !== id));
    message.success('Xóa thành công');
  };

  const formatPrice = (price: number) => {
    return price.toLocaleString('vi-VN') + ' đ';
  };

  const columns: ColumnsType<IService> = [
    { title: 'Tên dịch vụ', dataIndex: 'name' },
    {
      title: 'Giá',
      dataIndex: 'price',
      render: (v) => formatPrice(v),
    },
    {
      title: 'Thời gian',
      dataIndex: 'duration',
      render: (v) => `${v} phút`,
    },
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
        type="primary"
        onClick={() => {
          setEditing(null);
          form.resetFields();
          setOpen(true);
        }}
        style={{ marginBottom: 16 }}
      >
        + Thêm dịch vụ
      </Button>

      <Table
        rowKey="id"
        dataSource={services}
        columns={columns}
        pagination={{ pageSize: 5 }}
      />

      <Modal
        open={open}
        title={editing ? 'Cập nhật dịch vụ' : 'Thêm dịch vụ'}
        onOk={submit}
        onCancel={() => setOpen(false)}
        okText={editing ? 'Cập nhật' : 'Thêm'}
      >
        <Form form={form} layout="vertical">

          <Form.Item
            name="name"
            label="Tên dịch vụ"
            rules={[{ required: true, message: 'Không được bỏ trống' }]}
          >
            <Input placeholder="VD: Cắt tóc nam" />
          </Form.Item>

          <Form.Item
            name="price"
            label="Giá (VNĐ)"
            rules={[{ required: true, message: 'Nhập giá' }]}
          >
            <InputNumber
              style={{ width: '100%' }}
              min={0}
              placeholder="VD: 50000"
            />
          </Form.Item>

          <Form.Item
            name="duration"
            label="Thời gian (phút)"
            rules={[{ required: true, message: 'Nhập thời gian' }]}
          >
            <InputNumber
              style={{ width: '100%' }}
              min={1}
              placeholder="VD: 30"
            />
          </Form.Item>

        </Form>
      </Modal>
    </>
  );
};