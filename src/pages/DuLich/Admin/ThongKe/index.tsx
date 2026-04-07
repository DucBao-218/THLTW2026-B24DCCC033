import React, { useState, useEffect, useMemo } from 'react';
import {
  Card, Row, Col, Statistic, Typography, Table, Tag,
  Select, DatePicker, Space, Divider, Grid, Tabs,
} from 'antd';
import {
  CalendarOutlined, DollarOutlined, FireOutlined, EnvironmentOutlined,
  RiseOutlined, TeamOutlined, TrophyOutlined,
} from '@ant-design/icons';
import { Column, Line, Pie } from '@ant-design/charts';
import dayjs from 'dayjs';
import {
  LichTrinh, DiemDen, STORAGE_KEYS, getFromStorage,
  seedLichTrinh, seedDiemDen, formatVND,
} from '../../types';

const { Title, Text } = Typography;
const { useBreakpoint } = Grid;

const THANG_LABELS: Record<string, string> = {
  '2025-07': 'T7/25', '2025-08': 'T8/25', '2025-09': 'T9/25', '2025-10': 'T10/25',
  '2025-11': 'T11/25', '2025-12': 'T12/25', '2026-01': 'T1/26', '2026-02': 'T2/26',
  '2026-03': 'T3/26', '2026-04': 'T4/26',
};

const AdminThongKe: React.FC = () => {
  const screens = useBreakpoint();
  const [lichTrinhs, setLichTrinhs] = useState<LichTrinh[]>([]);
  const [diemDens, setDiemDens] = useState<DiemDen[]>([]);

  useEffect(() => {
    const storedLT = getFromStorage<LichTrinh[]>(STORAGE_KEYS.LICH_TRINH, []);
    setLichTrinhs(storedLT.length ? storedLT : seedLichTrinh);
    const storedDD = getFromStorage<DiemDen[]>(STORAGE_KEYS.DIEM_DEN, []);
    setDiemDens(storedDD.length ? storedDD : seedDiemDen);
  }, []);

  const tongLichTrinh = lichTrinhs.length;
  const tongThu = lichTrinhs.reduce((s, l) => s + l.chiPhiThucTe, 0);
  const tbNguoi = lichTrinhs.length
    ? Math.round(lichTrinhs.reduce((s, l) => s + l.soNguoi, 0) / lichTrinhs.length)
    : 0;
  const tongNguoi = lichTrinhs.reduce((s, l) => s + l.soNguoi, 0);

  const thangData = useMemo(() => {
    const counts: Record<string, { soLuong: number; doanhThu: number }> = {};
    lichTrinhs.forEach((lt) => {
      if (!counts[lt.thang]) counts[lt.thang] = { soLuong: 0, doanhThu: 0 };
      counts[lt.thang].soLuong += 1;
      counts[lt.thang].doanhThu += lt.chiPhiThucTe;
    });
    return Object.entries(counts)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([thang, v]) => ({
        thang: THANG_LABELS[thang] || thang,
        soLuong: v.soLuong,
        doanhThu: v.doanhThu,
      }));
  }, [lichTrinhs]);

  const popularDD = useMemo(() => {
    return [...diemDens]
      .sort((a, b) => b.luotLichTrinh - a.luotLichTrinh)
      .slice(0, 6)
      .map((dd) => ({
        ten: dd.ten,
        luotLichTrinh: dd.luotLichTrinh,
        rating: dd.rating,
        loaiHinh: dd.loaiHinh,
      }));
  }, [diemDens]);

  const hangMucData = [
    { type: '🍜 Ăn uống', value: Math.round(tongThu * 0.25) },
    { type: '🏨 Lưu trú', value: Math.round(tongThu * 0.30) },
    { type: '✈️ Di chuyển', value: Math.round(tongThu * 0.20) },
    { type: '🎫 Vé tham quan', value: Math.round(tongThu * 0.10) },
    { type: '🛍️ Mua sắm', value: Math.round(tongThu * 0.08) },
    { type: '📦 Khác', value: Math.round(tongThu * 0.07) },
  ];

  const barConfig = {
    data: thangData,
    xField: 'thang',
    yField: 'soLuong',
    columnStyle: { radius: [6, 6, 0, 0] },
    color: '#1677ff',
    label: { position: 'top' as const, style: { fill: '#555', fontSize: '11px' } }, 
    yAxis: { title: { text: 'Số lịch trình' } },
    tooltip: { formatter: (d: any) => ({ name: 'Lịch trình', value: `${d.soLuong} chuyến` }) },
  };

  const lineConfig = {
    data: thangData,
    xField: 'thang',
    yField: 'doanhThu',
    smooth: true,
    color: '#52c41a',
    point: { size: 5, shape: 'circle', style: { fill: '#52c41a' } },
    yAxis: { label: { formatter: (v: string) => `${(+v / 1000000).toFixed(1)}M` } },
    tooltip: { formatter: (d: any) => ({ name: 'Doanh thu', value: formatVND(d.doanhThu) }) },
  };

  const pieConfig = {
    data: hangMucData,
    angleField: 'value',
    colorField: 'type',
    radius: 0.8,
    innerRadius: 0.55,
    label: {
      type: 'inner',
      offset: '-30%',
      content: ({ percent }: any) => `${(percent * 100).toFixed(0)}%`,
      style: { fontSize: '11px' }, 
    },
    legend: { position: 'bottom' as const },
    statistic: {
      title: { content: 'Tổng thu', style: { fontSize: '11px' } }, 
      content: { content: `${(tongThu / 1000000).toFixed(1)}M`, style: { fontSize: '16px' } }, 
    },
  };

  const ddColumns = [
    { title: '#', key: 'idx', render: (_: any, __: any, i: number) => <Tag color="gold">{i + 1}</Tag>, width: 50 },
    { title: 'Điểm đến', dataIndex: 'ten', key: 'ten', render: (v: string) => <Text strong>{v}</Text> },
    {
      title: 'Lượt lịch trình',
      dataIndex: 'luotLichTrinh',
      key: 'luotLichTrinh',
      sorter: (a: any, b: any) => a.luotLichTrinh - b.luotLichTrinh,
      render: (v: number) => (
        <Space>
          <FireOutlined style={{ color: '#ff4d4f' }} />
          <Text strong>{v.toLocaleString()}</Text>
        </Space>
      ),
    },
    {
      title: 'Rating',
      dataIndex: 'rating',
      key: 'rating',
      render: (v: number) => <Tag color="gold">⭐ {v}</Tag>,
    },
  ];

  const ltColumns = [
    { title: 'Lịch trình', dataIndex: 'tenLichTrinh', key: 'tenLichTrinh', render: (v: string) => <Text strong>{v}</Text> },
    { title: 'Tháng', dataIndex: 'thang', key: 'thang', render: (v: string) => THANG_LABELS[v] || v },
    { title: 'Số người', dataIndex: 'soNguoi', key: 'soNguoi', render: (v: number) => `${v} người` },
    {
      title: 'Doanh thu',
      dataIndex: 'chiPhiThucTe',
      key: 'chiPhiThucTe',
      sorter: (a: LichTrinh, b: LichTrinh) => a.chiPhiThucTe - b.chiPhiThucTe,
      render: (v: number) => <Text style={{ color: '#52c41a', fontWeight: 600 }}>{formatVND(v)}</Text>,
    },
    {
      title: 'Trạng thái',
      dataIndex: 'trangThai',
      key: 'trangThai',
      render: (v: string) => ({
        draft: <Tag>Nháp</Tag>,
        confirmed: <Tag color="processing">Xác nhận</Tag>,
        completed: <Tag color="success">Hoàn thành</Tag>,
      }[v]),
    },
  ];

  return (
    <div style={{ padding: screens.xs ? 12 : 24 }}>
      <Title level={4} style={{ marginBottom: 20 }}>📊 Thống kê & Báo cáo</Title>

      {/* KPIs */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={12} sm={6}>
          <Card style={{ background: 'linear-gradient(135deg, #1677ff22, #1677ff11)', border: '1px solid #1677ff33' }}>
            <Statistic
              title={<Text style={{ color: '#1677ff' }}>Tổng lịch trình</Text>}
              value={tongLichTrinh}
              suffix="chuyến"
              prefix={<CalendarOutlined style={{ color: '#1677ff' }} />}
              valueStyle={{ color: '#1677ff' }}
            />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card style={{ background: 'linear-gradient(135deg, #52c41a22, #52c41a11)', border: '1px solid #52c41a33' }}>
            <Statistic
              title={<Text style={{ color: '#52c41a' }}>Tổng doanh thu</Text>}
              value={formatVND(tongThu)}
              prefix={<DollarOutlined style={{ color: '#52c41a' }} />}
              valueStyle={{ color: '#52c41a', fontSize: screens.xs ? 14 : 16 }}
            />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card style={{ background: 'linear-gradient(135deg, #fa8c1622, #fa8c1611)', border: '1px solid #fa8c1633' }}>
            <Statistic
              title={<Text style={{ color: '#fa8c16' }}>Tổng khách</Text>}
              value={tongNguoi}
              suffix="người"
              prefix={<TeamOutlined style={{ color: '#fa8c16' }} />}
              valueStyle={{ color: '#fa8c16' }}
            />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card style={{ background: 'linear-gradient(135deg, #722ed122, #722ed111)', border: '1px solid #722ed133' }}>
            <Statistic
              title={<Text style={{ color: '#722ed1' }}>Số điểm đến</Text>}
              value={diemDens.length}
              suffix="địa điểm"
              prefix={<EnvironmentOutlined style={{ color: '#722ed1' }} />}
              valueStyle={{ color: '#722ed1' }}
            />
          </Card>
        </Col>
      </Row>

      {/* Charts */}
      <Tabs
        defaultActiveKey="lichTrinh"
        style={{ marginBottom: 20 }}
        items={[
          {
            key: 'lichTrinh',
            label: '📅 Lịch trình theo tháng',
            children: (
              <Card>
                <Column {...barConfig} height={screens.xs ? 220 : 300} />
              </Card>
            ),
          },
          {
            key: 'doanhThu',
            label: '💵 Doanh thu theo tháng',
            children: (
              <Card>
                <Line {...lineConfig} height={screens.xs ? 220 : 300} />
              </Card>
            ),
          },
          {
            key: 'hangMuc',
            label: '🥧 Doanh thu theo hạng mục',
            children: (
              <Card>
                <Pie {...pieConfig} height={screens.xs ? 280 : 360} />
              </Card>
            ),
          },
        ]}
      />

      <Row gutter={[16, 16]}>
        {/* Top destinations */}
        <Col xs={24} lg={10}>
          <Card
            title={<Space><TrophyOutlined style={{ color: '#faad14' }} /><Text strong>Điểm đến phổ biến</Text></Space>}
          >
            <Table
              columns={ddColumns}
              dataSource={popularDD}
              rowKey="ten"
              pagination={false}
              size="small"
            />
          </Card>
        </Col>

        {/* Recent trips */}
        <Col xs={24} lg={14}>
          <Card
            title={<Space><RiseOutlined style={{ color: '#52c41a' }} /><Text strong>Lịch trình gần đây</Text></Space>}
          >
            <Table
              columns={ltColumns}
              dataSource={[...lichTrinhs].sort((a, b) => b.createdAt.localeCompare(a.createdAt)).slice(0, 6)}
              rowKey="id"
              pagination={false}
              size="small"
              scroll={{ x: 500 }}
              summary={() => (
                <Table.Summary.Row style={{ fontWeight: 600, background: '#fafafa' }}>
                  <Table.Summary.Cell index={0} colSpan={3}>Tổng cộng</Table.Summary.Cell>
                  <Table.Summary.Cell index={3}>
                    <Text style={{ color: '#52c41a', fontWeight: 700 }}>{formatVND(tongThu)}</Text>
                  </Table.Summary.Cell>
                  <Table.Summary.Cell index={4} />
                </Table.Summary.Row>
              )}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default AdminThongKe;