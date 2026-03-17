import React, { useContext, useState } from 'react';
import {
  Table,
  Button,
  Modal,
  Form,
  Select,
  DatePicker,
  message,
  Rate,
  Input,
  TimePicker,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import dayjs, { Dayjs } from 'dayjs';
import { AppContext, IAppointment, IReview } from './_layout';

type AppointmentForm = {
  employeeId: number;
  serviceId: number;
  date: Dayjs;
  time: Dayjs;
};

type ReviewForm = {
  rating: number;
  comment: string;
};

export default () => {
  const context = useContext(AppContext);
  if (!context) return null;

  const {
    employees,
    services,
    appointments,
    reviews,
    saveAppointments,
    saveReviews,
  } = context;

  const [open, setOpen] = useState(false);
  const [reviewOpen, setReviewOpen] = useState(false);
  const [current, setCurrent] = useState<IAppointment | null>(null);

  const [form] = Form.useForm<AppointmentForm>();
  const [reviewForm] = Form.useForm<ReviewForm>();

  const timeToNumber = (t: string) => {
    const [h, m] = t.split(':').map(Number);
    return h + m / 60;
  };

  const checkTrung = (empId: number, date: string, start: string, end: string) => {
    const s = timeToNumber(start);
    const e = timeToNumber(end);

    return appointments.some(a => {
      if (a.employeeId !== empId || a.date !== date) return false;

      const as = timeToNumber(a.startTime);
      const ae = timeToNumber(a.endTime);

      return !(e <= as || s >= ae);
    });
  };

  const checkWorkingTime = (empId: number, date: Dayjs, time: Dayjs) => {
    const emp = employees.find(e => e.id === empId);
    if (!emp) return false;

    const day = date.day();
    const t = time.hour() + time.minute() / 60;

    return emp.workSchedule.some(s => {
      if (s.day !== day) return false;

      const start = timeToNumber(s.startTime);
      const end = timeToNumber(s.endTime);

      return t >= start && t < end;
    });
  };

  const checkMaxCustomer = (empId: number, date: string) => {
    const emp = employees.find(e => e.id === empId);
    if (!emp) return false;

    const count = appointments.filter(
      a => a.employeeId === empId && a.date === date
    ).length;

    return count < emp.maxCustomerPerDay;
  };

  const getReview = (appointmentId: number) => {
    return reviews.find(r => r.appointmentId === appointmentId);
  };

  const submit = async () => {
    const v = await form.validateFields();

    const service = services.find(s => s.id === v.serviceId);
    if (!service) return;

    const dateStr = v.date.format('YYYY-MM-DD');

    const startTime = v.time.format('HH:mm');
    const endTime = v.time.add(service.duration, 'minute').format('HH:mm');

    if (!checkWorkingTime(v.employeeId, v.date, v.time)) {
      message.error('Không nằm trong giờ làm');
      return;
    }

    if (!checkMaxCustomer(v.employeeId, dateStr)) {
      message.error('Đã đủ khách trong ngày');
      return;
    }

    if (checkTrung(v.employeeId, dateStr, startTime, endTime)) {
      message.error('Trùng lịch');
      return;
    }

    const newItem: IAppointment = {
      id: Date.now(),
      customerName: 'Khách lẻ',
      customerPhone: '---',
      employeeId: v.employeeId,
      serviceId: v.serviceId,
      date: dateStr,
      startTime,
      endTime,
      status: 'pending',
      createdAt: dayjs().format('YYYY-MM-DD HH:mm'),
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

    const existing = reviews.find(r => r.appointmentId === current.id);

    if (existing) {
      // update
      saveReviews(
        reviews.map(r =>
          r.appointmentId === current.id ? { ...r, ...v } : r
        )
      );
    } else {
      // create mới
      const newReview: IReview = {
        id: Date.now(),
        appointmentId: current.id,
        employeeId: current.employeeId,
        serviceId: current.serviceId,
        customerName: current.customerName,
        rating: v.rating,
        comment: v.comment,
        createdAt: dayjs().format('YYYY-MM-DD HH:mm'),
      };

      saveReviews([...reviews, newReview]);
    }

    setReviewOpen(false);
  };

  const columns: ColumnsType<IAppointment> = [
    { title: 'Ngày', dataIndex: 'date' },
    {
      title: 'Giờ',
      render: (_, r) => `${r.startTime} - ${r.endTime}`,
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
      render: (_, r) => {
        const review = getReview(r.id);

        return r.status === 'done' ? (
          <Button
            onClick={() => {
              setCurrent(r);
              reviewForm.setFieldsValue({
                rating: review?.rating,
                comment: review?.comment,
              });
              setReviewOpen(true);
            }}
          >
            {review ? 'Xem/Sửa' : 'Đánh giá'}
          </Button>
        ) : '---';
      },
    },
  ];

  return (
    <>
      <Button type='primary' onClick={() => setOpen(true)}>+ Đặt lịch</Button>

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

          <Form.Item name="time" label="Giờ bắt đầu" rules={[{ required: true }]}>
            <TimePicker format="HH:mm" minuteStep={15} />
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