import React from 'react';
import { Card, Col, Row, Statistic, Empty } from 'antd';
import { Column, ColumnConfig } from '@ant-design/charts';
import { TeamOutlined, ClockCircleOutlined, CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import { getApps, getClubs } from '../data';

interface ChartData {
  name: string;
  status: string;
  count: number;
}

const BaoCaoThongKe: React.FC = () => {
  const apps = getApps();
  const clubs = getClubs();

  const totalClubs = clubs.length;
  const pending = apps.filter(app => app.status === 'Pending').length;
  const approved = apps.filter(app => app.status === 'Approved').length;
  const rejected = apps.filter(app => app.status === 'Rejected').length;

  const chartData: ChartData[] = [];
  
  clubs.forEach(club => {
    const clubApps = apps.filter(app => app.clubId === club.id);
    
    const countPending = clubApps.filter(app => app.status === 'Pending').length;
    const countApproved = clubApps.filter(app => app.status === 'Approved').length;
    const countRejected = clubApps.filter(app => app.status === 'Rejected').length;
    
    chartData.push({ name: club.name, status: 'Chờ duyệt', count: countPending });
    chartData.push({ name: club.name, status: 'Đã duyệt', count: countApproved });
    chartData.push({ name: club.name, status: 'Từ chối', count: countRejected });
  });

  const config: ColumnConfig = {
    data: chartData,
    isGroup: true,
    xField: 'name',
    yField: 'count',
    seriesField: 'status',
    color: ['#faad14', '#52c41a', '#ff4d4f'], 
    label: {
      position: 'middle',
      style: { fill: '#fff', opacity: 0.8 }, 
    },
    yAxis: {
      title: { text: 'Số lượng đơn (đơn)' },
    },
  };

  return (
    <div style={{ padding: 24 }}>
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} md={6}>
          <Card bordered={false} style={{ boxShadow: '0 1px 2px -2px rgba(0,0,0,0.16), 0 3px 6px 0 rgba(0,0,0,0.12)' }}>
            <Statistic 
              title="Tổng số CLB" 
              value={totalClubs} 
              prefix={<TeamOutlined />} 
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card bordered={false} style={{ boxShadow: '0 1px 2px -2px rgba(0,0,0,0.16), 0 3px 6px 0 rgba(0,0,0,0.12)' }}>
            <Statistic 
              title="Đơn chờ duyệt" 
              value={pending} 
              prefix={<ClockCircleOutlined />} 
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card bordered={false} style={{ boxShadow: '0 1px 2px -2px rgba(0,0,0,0.16), 0 3px 6px 0 rgba(0,0,0,0.12)' }}>
            <Statistic 
              title="Đơn đã duyệt" 
              value={approved} 
              prefix={<CheckCircleOutlined />} 
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card bordered={false} style={{ boxShadow: '0 1px 2px -2px rgba(0,0,0,0.16), 0 3px 6px 0 rgba(0,0,0,0.12)' }}>
            <Statistic 
              title="Đơn từ chối" 
              value={rejected} 
              prefix={<CloseCircleOutlined />} 
              valueStyle={{ color: '#ff4d4f' }}
            />
          </Card>
        </Col>
      </Row>

      <Card 
        title="Biểu đồ thống kê đơn đăng ký theo câu lạc bộ" 
        bordered={false} 
        style={{ boxShadow: '0 1px 2px -2px rgba(0,0,0,0.16), 0 3px 6px 0 rgba(0,0,0,0.12)' }}
      >
        {clubs.length > 0 ? (
          <Column {...config} />
        ) : (
          <Empty description="Chưa có dữ liệu câu lạc bộ" />
        )}
      </Card>
    </div>
  );
};

export default BaoCaoThongKe;