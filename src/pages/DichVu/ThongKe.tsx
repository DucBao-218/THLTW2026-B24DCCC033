import React, { useContext, useState } from 'react';
import {
  Card,
  Row,
  Col,
  Statistic,
  Progress,
  Tag,
  Divider,
  Segmented,
} from 'antd';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';
import { AppContext } from './_layout';

const COLORS = ['#1890ff', '#52c41a', '#faad14', '#f5222d', '#722ed1'];

export default () => {
  const context = useContext(AppContext);
  if (!context) return null;

  const { appointments, services, employees } = context;

  const [mode, setMode] = useState<'day' | 'month'>('day');

  const formatMoney = (v: number) =>
    v.toLocaleString('vi-VN') + ' đ';

  const totalAppointments = appointments.length;

  const statusCount = {
    pending: appointments.filter(a => a.status === 'pending').length,
    confirmed: appointments.filter(a => a.status === 'confirmed').length,
    done: appointments.filter(a => a.status === 'done').length,
    cancel: appointments.filter(a => a.status === 'cancel').length,
  };

  const totalRevenue = appointments.reduce((sum, a) => {
    if (a.status !== 'done') return sum;
    const service = services.find(s => s.id === a.serviceId);
    return sum + (service?.price || 0);
  }, 0);

  const groupAppointments = () => {
    const map: Record<string, number> = {};

    appointments.forEach(a => {
      const key =
        mode === 'day'
          ? a.date
          : a.date.slice(0, 7);

      map[key] = (map[key] || 0) + 1;
    });

    return Object.entries(map).map(([date, count]) => ({
      date,
      count,
    }));
  };

  const appointmentStats = groupAppointments();

  const revenueByEmployee = employees.map(emp => {
    const revenue = appointments.reduce((sum, a) => {
      if (a.employeeId !== emp.id || a.status !== 'done') return sum;
      const service = services.find(s => s.id === a.serviceId);
      return sum + (service?.price || 0);
    }, 0);

    return { name: emp.name, revenue };
  }).sort((a, b) => b.revenue - a.revenue);

  const revenueByService = services.map(s => {
    const revenue = appointments.reduce((sum, a) => {
      if (a.serviceId !== s.id || a.status !== 'done') return sum;
      return sum + s.price;
    }, 0);

    return { name: s.name, revenue };
  }).sort((a, b) => b.revenue - a.revenue);

  const topEmployee = revenueByEmployee[0] || { name: '', revenue: 0 };

  const maxRevenue = Math.max(...revenueByEmployee.map(r => r.revenue), 1);
  const maxServiceRevenue = Math.max(...revenueByService.map(r => r.revenue), 1);

  return (
    <div>

      <Row gutter={16} style={{ marginBottom: 20 }}>
        <Col span={8}>
          <Card>
            <Statistic title="Tổng lịch" value={totalAppointments} />
          </Card>
        </Col>

        <Col span={8}>
          <Card>
            <Statistic title="Doanh thu" value={formatMoney(totalRevenue)} />
          </Card>
        </Col>

        <Col span={8}>
          <Card>
            <Statistic title="Hoàn thành" value={statusCount.done} />
          </Card>
        </Col>
      </Row>

      <Card title="Tình trạng lịch" style={{ marginBottom: 20 }}>
        <Row gutter={16}>
          <Col span={6}><Tag color="orange">Chờ</Tag> {statusCount.pending}</Col>
          <Col span={6}><Tag color="blue">Xác nhận</Tag> {statusCount.confirmed}</Col>
          <Col span={6}><Tag color="green">Hoàn thành</Tag> {statusCount.done}</Col>
          <Col span={6}><Tag color="red">Hủy</Tag> {statusCount.cancel}</Col>
        </Row>
      </Card>

      <Card
        title="Số lượng lịch"
        extra={
          <Segmented
            options={[
              { label: 'Theo ngày', value: 'day' },
              { label: 'Theo tháng', value: 'month' },
            ]}
            value={mode}
            onChange={(v) => setMode(v as any)}
          />
        }
        style={{ marginBottom: 20 }}
      >
        {appointmentStats.map(item => (
          <p key={item.date}>
            {item.date}: {item.count} lịch
          </p>
        ))}

        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={appointmentStats}>
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="count" fill="#1890ff" />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      <Card title="Nhân viên xuất sắc 🥇" style={{ marginBottom: 20 }}>
        <h2>{topEmployee.name || 'Chưa có dữ liệu'}</h2>
        <p>Doanh thu: {formatMoney(topEmployee.revenue)}</p>
      </Card>

      <Card title="Doanh thu theo nhân viên" style={{ marginBottom: 20 }}>
        {revenueByEmployee.map(r => {
          const percent = (r.revenue / maxRevenue) * 100;

          return (
            <div key={r.name} style={{ marginBottom: 12 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <b>
                  {r.name}
                  {r.name === topEmployee.name && ' 🥇'}
                </b>
                <span>{formatMoney(r.revenue)}</span>
              </div>
              <Progress percent={Math.round(percent)} />
              <Divider style={{ margin: '6px 0' }} />
            </div>
          );
        })}
      </Card>

      <Card title="Doanh thu theo dịch vụ" style={{ marginBottom: 20 }}>
        {revenueByService.map(s => {
          const percent = (s.revenue / maxServiceRevenue) * 100;

          return (
            <div key={s.name} style={{ marginBottom: 12 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <b>
                  {s.name}
                  {s.name === revenueByService[0]?.name && ' 🥇'}
                </b>
                <span>{formatMoney(s.revenue)}</span>
              </div>
              <Progress percent={Math.round(percent)} />
              <Divider style={{ margin: '6px 0' }} />
            </div>
          );
        })}
      </Card>

      <Card title="Biểu đồ doanh thu dịch vụ">
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={revenueByService}
              dataKey="revenue"
              nameKey="name"
              outerRadius={100}
              label
            >
              {revenueByService.map((_, index) => (
                <Cell key={index} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </Card>

    </div>
  );
};