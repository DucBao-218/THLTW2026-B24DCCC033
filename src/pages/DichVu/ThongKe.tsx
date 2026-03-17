import React, { useContext } from 'react';
import { Card } from 'antd';
import { AppContext } from './_layout';

export default () => {
  const context = useContext(AppContext);
  if (!context) return null;

  const { appointments, services, employees } = context;

  // 🔥 tổng số lịch
  const totalAppointments = appointments.length;

  // 🔥 doanh thu
  const totalRevenue = appointments.reduce((sum, a) => {
    if (a.status !== 'done') return sum;
    const service = services.find(s => s.id === a.serviceId);
    return sum + (service?.price || 0);
  }, 0);

  // 🔥 doanh thu theo nhân viên
  const revenueByEmployee = employees.map(emp => {
    const revenue = appointments.reduce((sum, a) => {
      if (a.employeeId !== emp.id || a.status !== 'done') return sum;
      const service = services.find(s => s.id === a.serviceId);
      return sum + (service?.price || 0);
    }, 0);

    return {
      name: emp.name,
      revenue,
    };
  });

  return (
    <div>
      <Card title="Tổng quan" style={{ marginBottom: 16 }}>
        <p>Tổng lịch hẹn: {totalAppointments}</p>
        <p>Tổng doanh thu: {totalRevenue} VND</p>
      </Card>

      <Card title="Doanh thu theo nhân viên">
        {revenueByEmployee.map(r => (
          <p key={r.name}>
            {r.name}: {r.revenue} VND
          </p>
        ))}
      </Card>
    </div>
  );
};