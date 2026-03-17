import React, { useContext, useState } from 'react';
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  InputNumber,
  Select,
  Popconfirm,
  message,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { AppContext, IEmployee } from './_layout';

type EmployeeForm = Omit<IEmployee, 'id'>;

export default () => {
  const context = useContext(AppContext);
  if (!context) return null;

  const { employees, saveEmployees, appointments } = context;

  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<IEmployee | null>(null);
  const [form] = Form.useForm<EmployeeForm>();

  const submit = async () => {
    const values = await form.validateFields();

    if (editing) {
      saveEmployees(
        employees.map(e =>
          e.id === editing.id ? { ...editing, ...values } : e
        )
      );
    } else {
      saveEmployees([
        ...employees,
        {
          id: Date.now(),
          ...values,
        },
      ]);
    }

    setOpen(false);
  };

  const handleDelete = (id: number) => {
    const hasAppointment = appointments.some(a => a.employeeId === id);

    if (hasAppointment) {
      message.error('Nhân viên đã có lịch, không thể xóa');
      return;
    }

    saveEmployees(employees.filter(e => e.id !== id));
  };

  // 🔥 tính rating trung bình
  const getAvgRating = (empId: number): number => {
    const list = appointments.filter(
      a => a.employeeId === empId && a.rating
    );

    if (list.length === 0) return 0;

    const avg =
      list.reduce((sum, a) => sum + (a.rating || 0), 0) / list.length;

    return Number(avg.toFixed(1));
  };

  const columns: ColumnsType<IEmployee> = [
    { title: 'Tên', dataIndex: 'name' },
    {
      title: 'Giờ làm',
      render: (_, r) => `${r.workStart}h - ${r.workEnd}h`,
    },
    { title: 'Max/ngày', dataIndex: 'maxCustomer' },
    {
      title: 'Ngày làm',
      render: (_, r) => r.workingDays?.join(', ') || '---',
    },
    {
      title: 'Rating TB',
      render: (_, r) => getAvgRating(r.id),
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
                workStart: r.workStart,
                workEnd: r.workEnd,
                maxCustomer: r.maxCustomer,
                workingDays: r.workingDays,
              });
              setOpen(true);
            }}
          >
            Sửa
          </Button>

          <Popconfirm
            title="Xóa nhân viên?"
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
        Thêm nhân viên
      </Button>

      <Table rowKey="id" dataSource={employees} columns={columns} />

      <Modal open={open} onOk={submit} onCancel={() => setOpen(false)}>
        <Form form={form} layout="vertical">
          <Form.Item name="name" label="Tên" rules={[{ required: true }]}>
            <Input />
          </Form.Item>

          <Form.Item name="workStart" label="Giờ bắt đầu">
            <InputNumber style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item name="workEnd" label="Giờ kết thúc">
            <InputNumber style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item name="maxCustomer" label="Số khách/ngày">
            <InputNumber style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item name="workingDays" label="Ngày làm việc">
            <Select
              mode="multiple"
              options={[
                { label: 'CN', value: 0 },
                { label: 'Thứ 2', value: 1 },
                { label: 'Thứ 3', value: 2 },
                { label: 'Thứ 4', value: 3 },
                { label: 'Thứ 5', value: 4 },
                { label: 'Thứ 6', value: 5 },
                { label: 'Thứ 7', value: 6 },
              ]}
            />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};