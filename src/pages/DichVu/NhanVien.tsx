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
  TimePicker,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import dayjs, { Dayjs } from 'dayjs';
import { AppContext, IEmployee, DayOfWeek } from './_layout';

type EmployeeForm = Omit<IEmployee, 'id' | 'workSchedule'> & {
  workSchedule: {
    day: DayOfWeek;
    startTime: Dayjs;
    endTime: Dayjs;
  }[];
};

const DAY_LABEL: Record<number, string> = {
  0: 'Chủ nhật',
  1: 'Thứ 2',
  2: 'Thứ 3',
  3: 'Thứ 4',
  4: 'Thứ 5',
  5: 'Thứ 6',
  6: 'Thứ 7',
};

export default () => {
  const context = useContext(AppContext);
  if (!context) return null;

  const { employees, saveEmployees, appointments, reviews } = context;

  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<IEmployee | null>(null);
  const [form] = Form.useForm<EmployeeForm>();

  const submit = async () => {
    const values = await form.validateFields();

    if (!values.workSchedule || values.workSchedule.length === 0) {
      return message.error('Phải có ít nhất 1 ca làm');
    }

    const formattedSchedule = values.workSchedule.map(s => ({
      ...s,
      startTime: s.startTime.format('HH:mm'),
      endTime: s.endTime.format('HH:mm'),
    }));

    const newData = {
      ...values,
      workSchedule: formattedSchedule,
    };

    if (editing) {
      saveEmployees(
        employees.map(e =>
          e.id === editing.id ? { ...editing, ...newData } : e
        )
      );
    } else {
      saveEmployees([
        ...employees,
        {
          id: Date.now(),
          ...newData,
          serviceIds: [],
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

  const getAvgRating = (empId: number): number => {
    const list = reviews.filter(r => r.employeeId === empId);
    if (!list.length) return 0;

    const avg =
      list.reduce((sum, r) => sum + r.rating, 0) / list.length;

    return Number(avg.toFixed(1));
  };

  const columns: ColumnsType<IEmployee> = [
    { title: 'Tên', dataIndex: 'name' },

    {
      title: 'Giờ làm',
      render: (_, r) =>
        r.workSchedule?.length
          ? r.workSchedule
              .map(
                s =>
                  `${DAY_LABEL[s.day]}: ${s.startTime} - ${s.endTime}`
              )
              .join(' | ')
          : '---',
    },

    { title: 'Max/ngày', dataIndex: 'maxCustomerPerDay' },

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
                ...r,
                workSchedule: r.workSchedule.map(s => ({
                  ...s,
                  startTime: dayjs(s.startTime, 'HH:mm'),
                  endTime: dayjs(s.endTime, 'HH:mm'),
                })),
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
        type='primary'
        onClick={() => {
          setEditing(null);
          form.resetFields();
          setOpen(true);
        }}
      >
        + Thêm nhân viên
      </Button>

      <Table rowKey="id" dataSource={employees} columns={columns} />

      <Modal open={open} onOk={submit} onCancel={() => setOpen(false)}>
        <Form form={form} layout="vertical">

          <Form.Item name="name" label="Tên" rules={[{ required: true }]}>
            <Input />
          </Form.Item>

          <Form.Item
            name="maxCustomerPerDay"
            label="Số khách/ngày"
            rules={[{ required: true }]}
          >
            <InputNumber style={{ width: '100%' }} />
          </Form.Item>

          <Form.List name="workSchedule">
            {(fields, { add, remove }) => (
              <>
                {fields.map(field => (
                  <div key={field.key} style={{ display: 'flex', gap: 8 }}>

                    <Form.Item
                      {...field}
                      name={[field.name, 'day']}
                      rules={[{ required: true }]}
                    >
                      <Select
                        placeholder="Ngày"
                        options={Object.entries(DAY_LABEL).map(([k, v]) => ({
                          label: v,
                          value: Number(k),
                        }))}
                        style={{ width: 120 }}
                      />
                    </Form.Item>

                    <Form.Item
                      {...field}
                      name={[field.name, 'startTime']}
                      rules={[{ required: true }]}
                    >
                      <TimePicker format="HH:mm" minuteStep={15} />
                    </Form.Item>

                    <Form.Item
                      {...field}
                      name={[field.name, 'endTime']}
                      rules={[{ required: true }]}
                    >
                      <TimePicker format="HH:mm" minuteStep={15} />
                    </Form.Item>

                    <Button danger onClick={() => remove(field.name)}>
                      Xóa
                    </Button>
                  </div>
                ))}

                <Button onClick={() => add()}>+ Thêm ca làm</Button>
              </>
            )}
          </Form.List>

        </Form>
      </Modal>
    </>
  );
};