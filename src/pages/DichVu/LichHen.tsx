import React, { useContext, useState } from 'react';
import {
  Table,
  Button,
  Modal,
  Form,
  Select,
  InputNumber,
  DatePicker,
  message,
  Rate,
  Input,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import dayjs, { Dayjs } from 'dayjs';
import { AppContext, IAppointment } from './_layout';

type AppointmentForm = {
  employeeId: number;
  serviceId: number;
  date: Dayjs;
  start: number;
};

type ReviewForm = {
  rating: number;
  comment: string;
};

export default () => {
  const context = useContext(AppContext);
  if (!context) return null;

  const { employees, services, appointments, saveAppointments } = context;

  const [open, setOpen] = useState(false);
  const [reviewOpen, setReviewOpen] = useState(false);
  const [current, setCurrent] = useState<IAppointment | null>(null);

  const [form] = Form.useForm<AppointmentForm>();
  const [reviewForm] = Form.useForm<ReviewForm>();

  // 🔥 check trùng lịch
  const checkTrung = (empId: number, date: string, start: number, end: number) => {
    return appointments.some(
      a =>
        a.employeeId === empId &&
        a.date === date &&
        !(end <= a.start || start >= a.end)
    );
  };

  // 🔥 check ngày làm
  const checkWorkingDay = (empId: number, date: Dayjs) => {
    const emp = employees.find(e => e.id === empId);
    if (!emp) return false;
    return emp.workingDays.includes(date.day());
  };

  // 🔥 check max khách/ngày
  const checkMaxCustomer = (empId: number, date: string) => {
    const emp = employees.find(e => e.id === empId);
    if (!emp) return false;

    const count = appointments.filter(
      a => a.employeeId === empId && a.date === date
    ).length;

    return count < emp.maxCustomer;
  };

  const submit = async () => {
    const v = await form.validateFields();

    const service = services.find(s => s.id === v.serviceId);
    if (!service) return;

    const dateStr = v.date.format('YYYY-MM-DD');
    const end = v.start + service.duration / 60;

    // ❌ check ngày làm
    if (!checkWorkingDay(v.employeeId, v.date)) {
      message.error('Nhân viên không làm ngày này');
      return;
    }

    // ❌ check max khách
    if (!checkMaxCustomer(v.employeeId, dateStr)) {
      message.error('Nhân viên đã đủ khách trong ngày');
      return;
    }

    // ❌ check trùng lịch
    if (checkTrung(v.employeeId, dateStr, v.start, end)) {
      message.error('Trùng lịch');
      return;
    }

    const newItem: IAppointment = {
      id: Date.now(),
      employeeId: v.employeeId,
      serviceId: v.serviceId,
      date: dateStr,
      start: v.start,
      end,
      status: 'pending',
    };

    saveAppointments([...appointments, newItem]);
    setOpen(false);
  };

  const updateStatus = (id: number, status: IAppointment['status']) => {
    saveAppointments(
      appointments.map(a =>
        a.id === id ? { ...a, status } : a
      )
    );
  };

  const submitReview = async () => {
    if (!current) return;

    const v = await reviewForm.validateFields();

    saveAppointments(
      appointments.map(a =>
        a.id === current.id ? { ...a, ...v } : a
      )
    );

    setReviewOpen(false);
  };

  const columns: ColumnsType<IAppointment> = [
    { title: 'Ngày', dataIndex: 'date' },
    {
      title: 'Giờ',
      render: (_, r) => `${r.start}h - ${r.end}h`,
    },
    {
      title: 'Trạng thái',
      render: (_, r) => (
        <Select
          value={r.status}
          style={{ width: 140 }}
          onChange={(val) => updateStatus(r.id, val)}
          options={[
            { value: 'pending', label: 'Chờ duyệt' },
            { value: 'confirmed', label: 'Xác nhận' },
            { value: 'done', label: 'Hoàn thành' },
            { value: 'cancel', label: 'Hủy' },
          ]}
        />
      ),
    },
    {
      title: 'Đánh giá',
      render: (_, r) =>
        r.status === 'done' ? (
          <Button
            onClick={() => {
              setCurrent(r);
              reviewForm.setFieldsValue({
                rating: r.rating,
                comment: r.comment,
              });
              setReviewOpen(true);
            }}
          >
            Đánh giá
          </Button>
        ) : '---',
    },
  ];

  return (
    <>
      <Button onClick={() => setOpen(true)}>Đặt lịch</Button>

      <Table rowKey="id" dataSource={appointments} columns={columns} />

      <Modal open={open} onOk={submit} onCancel={() => setOpen(false)}>
        <Form form={form} layout="vertical">
          <Form.Item name="employeeId" label="Nhân viên" rules={[{ required: true }]}>
            <Select
              options={employees.map(e => ({
                value: e.id,
                label: e.name,
              }))}
            />
          </Form.Item>

          <Form.Item name="serviceId" label="Dịch vụ" rules={[{ required: true }]}>
            <Select
              options={services.map(s => ({
                value: s.id,
                label: s.name,
              }))}
            />
          </Form.Item>

          <Form.Item name="date" label="Ngày" rules={[{ required: true }]}>
            <DatePicker />
          </Form.Item>

          <Form.Item name="start" label="Giờ bắt đầu" rules={[{ required: true }]}>
            <InputNumber style={{ width: '100%' }} />
          </Form.Item>
        </Form>
      </Modal>

      <Modal open={reviewOpen} onOk={submitReview} onCancel={() => setReviewOpen(false)}>
        <Form form={reviewForm} layout="vertical">
          <Form.Item name="rating" label="Sao">
            <Rate />
          </Form.Item>
          <Form.Item name="comment" label="Nhận xét">
            <Input.TextArea />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};