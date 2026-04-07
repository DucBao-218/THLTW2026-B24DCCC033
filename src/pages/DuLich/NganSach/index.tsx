import React, { useState, useEffect } from 'react';
import {
  Card, Row, Col, InputNumber, Statistic, Alert, Typography, Space,
  Select, Table, Tag, Progress, Button, message,
  Grid, Tabs,
} from 'antd';
import { Pie, Column } from '@ant-design/charts';
import {
  DollarOutlined, WarningOutlined, CheckCircleOutlined,
  PieChartOutlined, BarChartOutlined, EditOutlined, SaveOutlined,
} from '@ant-design/icons';
import {
  LichTrinh, DiemDen, STORAGE_KEYS, getFromStorage, saveToStorage,
  seedLichTrinh, seedDiemDen, formatVND,
} from '../types';

const { Title, Text } = Typography;
const { Option } = Select;
const { useBreakpoint } = Grid;

interface HangMuc {
  ten: string;
  key: string;
  nganSach: number;
  chiTieu: number;
  color: string;
  icon: string;
}

const DEFAULT_HANGMUC: Omit<HangMuc, 'nganSach' | 'chiTieu'>[] = [
  { key: 'anUong', ten: 'Ăn uống', color: '#f5222d', icon: '🍜' },
  { key: 'luuTru', ten: 'Lưu trú', color: '#1677ff', icon: '🏨' },
  { key: 'diChuyen', ten: 'Di chuyển', color: '#52c41a', icon: '✈️' },
  { key: 'veVao', ten: 'Vé tham quan', color: '#fa8c16', icon: '🎫' },
  { key: 'muaSam', ten: 'Mua sắm', color: '#722ed1', icon: '🛍️' },
  { key: 'khac', ten: 'Khác', color: '#13c2c2', icon: '📦' },
];

const QuanLyNganSach: React.FC = () => {
  const screens = useBreakpoint();
  const [lichTrinhs, setLichTrinhs] = useState<LichTrinh[]>([]);
  const [diemDens, setDiemDens] = useState<DiemDen[]>([]);
  const [selectedLT, setSelectedLT] = useState<string>('');
  const [hangMucs, setHangMucs] = useState<HangMuc[]>([]);
  const [editMode, setEditMode] = useState(false);

  const initHangMuc = (lt: LichTrinh, allDD: DiemDen[]) => {
    const savedHangMucs = getFromStorage<{ [key: string]: HangMuc[] }>('HANG_MUC_CHI_TIET', {});

    let cAnUong = 0;
    let cVeVao = 0;
    let cDiChuyen = 0;
    let maxLuuTru = 0;
    let hasDiemDen = false; 

    lt.ngans.forEach(n => {
      if (n.diemDens && n.diemDens.length > 0) hasDiemDen = true;
      n.diemDens.forEach(d => {
        const dd = allDD.find(x => x.id === d.diemDenId);
        if (dd) {
          cAnUong += dd.chiPhiAnUong || 0;
          cVeVao += dd.giaVe || 0;
          cDiChuyen += dd.chiPhiDiChuyen || 0;
          if ((dd.chiPhiLuuTru || 0) > maxLuuTru) maxLuuTru = dd.chiPhiLuuTru;
        }
      });
    });

    const nights = lt.ngans.length > 0 ? lt.ngans.length - 1 : 0;
    const cLuuTru = nights * maxLuuTru * lt.soNguoi;
    
    cAnUong *= lt.soNguoi;
    cVeVao *= lt.soNguoi;
    cDiChuyen *= lt.soNguoi;

    const realChiTieu: Record<string, number> = {
      anUong: cAnUong,
      luuTru: cLuuTru,
      diChuyen: cDiChuyen,
      veVao: cVeVao,
      muaSam: 0,
      khac: 0
    };

    if (savedHangMucs[lt.id]) {
      const updatedFromSave = savedHangMucs[lt.id].map(h => {
        const newChiTieu = realChiTieu[h.key] !== undefined ? realChiTieu[h.key] : h.chiTieu;
        return { 
          ...h, 
          chiTieu: newChiTieu,
          nganSach: Math.max(h.nganSach, newChiTieu) 
        };
      });
      setHangMucs(updatedFromSave);
      return;
    }

    if (!hasDiemDen && lt.chiPhiThucTe > 0) {
      const ratios = [0.25, 0.30, 0.20, 0.10, 0.08, 0.07];
      const defaults = DEFAULT_HANGMUC.map((h, i) => ({
        ...h,
        nganSach: Math.round(lt.nganSachTong * ratios[i]),
        chiTieu: Math.round(lt.chiPhiThucTe * ratios[i]), 
      }));
      setHangMucs(defaults);
      return;
    }

    const tongChiTieuCung = cAnUong + cLuuTru + cDiChuyen + cVeVao;
    let tienDu = lt.nganSachTong - tongChiTieuCung;
    if (tienDu < 0) tienDu = 0; 

    const tyLeTienDu: Record<string, number> = {
      anUong: 0.2, 
      luuTru: 0.1, 
      diChuyen: 0.1,
      veVao: 0.0,  
      muaSam: 0.4, 
      khac: 0.2
    };

    const defaults = DEFAULT_HANGMUC.map(h => {
      const chiTieuThucTe = realChiTieu[h.key] || 0;
      const nganSachDeXuat = chiTieuThucTe + (tienDu * (tyLeTienDu[h.key] || 0));

      return {
        ...h,
        chiTieu: Math.round(chiTieuThucTe),
        nganSach: Math.round(nganSachDeXuat), 
      };
    });

    setHangMucs(defaults);
  };

  useEffect(() => {
    const storedDD = getFromStorage<DiemDen[]>(STORAGE_KEYS.DIEM_DEN, []);
    const dList = storedDD.length ? storedDD : seedDiemDen;
    setDiemDens(dList);

    const storedLT = getFromStorage<LichTrinh[]>(STORAGE_KEYS.LICH_TRINH, []);
    const list = storedLT.length ? storedLT : seedLichTrinh;
    if (!storedLT.length) saveToStorage(STORAGE_KEYS.LICH_TRINH, seedLichTrinh);
    
    setLichTrinhs(list);
    if (list.length > 0) {
      setSelectedLT(list[0].id);
      initHangMuc(list[0], dList);
    }
  }, []);

  const handleSelectLT = (id: string) => {
    setSelectedLT(id);
    const lt = lichTrinhs.find((l) => l.id === id);
    if (lt) initHangMuc(lt, diemDens);
    setEditMode(false);
  };

  const handleSave = () => {
    const savedHangMucs = getFromStorage<{ [key: string]: HangMuc[] }>('HANG_MUC_CHI_TIET', {});
    savedHangMucs[selectedLT] = hangMucs;
    saveToStorage('HANG_MUC_CHI_TIET', savedHangMucs);

    const tongNS = hangMucs.reduce((s, h) => s + h.nganSach, 0);
    const tongCT = hangMucs.reduce((s, h) => s + h.chiTieu, 0);

    const updatedLTs = lichTrinhs.map(l => 
      l.id === selectedLT 
        ? { ...l, nganSachTong: tongNS, chiPhiThucTe: tongCT } 
        : l
    );
    setLichTrinhs(updatedLTs);
    saveToStorage(STORAGE_KEYS.LICH_TRINH, updatedLTs);

    setEditMode(false);
    message.success('Đã lưu & đồng bộ dữ liệu thành công!');
  };

  const tongNganSach = hangMucs.reduce((s, h) => s + h.nganSach, 0);
  const tongChiTieu = hangMucs.reduce((s, h) => s + h.chiTieu, 0);
  const conLai = tongNganSach - tongChiTieu;
  const pctSuDung = tongNganSach > 0 ? Math.round((tongChiTieu / tongNganSach) * 100) : 0;

  const pieData = hangMucs.map((h) => ({
    type: `${h.icon} ${h.ten}`,
    value: h.chiTieu,
    color: h.color,
  }));

  const pieConfig: any = {
    data: pieData,
    angleField: 'value',
    colorField: 'type',
    color: hangMucs.map((h) => h.color),
    radius: 0.85,
    innerRadius: 0.6,
    label: {
      type: 'inner' as const,
      offset: '-30%',
      content: (datum: Record<string, any>) => `${(Number(datum.percent) * 100).toFixed(0)}%`,
      style: { fontSize: '12px' },
    },
    legend: { position: 'bottom' as const },
    statistic: {
      title: { content: 'Tổng chi tiêu', style: { fontSize: '12px' } },
      content: { content: formatVND(tongChiTieu), style: { fontSize: '14px', fontWeight: '600' } },
    },
    interactions: [{ type: 'pie-legend-active' as const }, { type: 'element-active' as const }],
  };

  const barData = hangMucs.flatMap((h) => [
    { hangMuc: h.ten, type: 'Ngân sách', value: h.nganSach, color: h.color },
    { hangMuc: h.ten, type: 'Chi tiêu', value: h.chiTieu, color: h.color + '88' },
  ]);

  const barConfig: any = {
    data: barData,
    xField: 'hangMuc',
    yField: 'value',
    seriesField: 'type',
    isGroup: true,
    color: ['#1677ff', '#ff7875'],
    columnStyle: { radius: [4, 4, 0, 0] },
    legend: { position: 'top-right' as const },
    yAxis: { label: { formatter: (v: string) => `${(+v / 1000).toFixed(0)}k` } },
    tooltip: { 
      formatter: (datum: Record<string, any>) => ({ 
        name: String(datum.type), 
        value: formatVND(Number(datum.value)) 
      }) 
    },
  };

  const tableColumns = [
    { title: 'Hạng mục', key: 'ten', render: (_: unknown, r: HangMuc) => <Space><Text>{r.icon}</Text><Text>{r.ten}</Text></Space> },
    {
      title: 'Ngân sách (Kế hoạch)', dataIndex: 'nganSach', key: 'nganSach',
      render: (v: number, r: HangMuc) =>
        editMode ? (
          <InputNumber
            value={v}
            min={r.chiTieu} 
            formatter={(val) => `${val}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
            onChange={(val) =>
              setHangMucs((prev) => prev.map((h) => h.key === r.key ? { ...h, nganSach: val || r.chiTieu } : h))
            }
            style={{ width: '100%' }}
            size="small"
          />
        ) : <Text>{formatVND(v)}</Text>,
    },
    {
      title: 'Chi tiêu (Thực tế)', dataIndex: 'chiTieu', key: 'chiTieu',
      render: (v: number, r: HangMuc) =>
        editMode && ['muaSam', 'khac'].includes(r.key) ? (
          <InputNumber
            value={v}
            min={0}
            formatter={(val) => `${val}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
            onChange={(val) =>
              setHangMucs((prev) => prev.map((h) => h.key === r.key ? { ...h, chiTieu: val || 0 } : h))
            }
            style={{ width: '100%' }}
            size="small"
          />
        ) : <Text style={{ color: v > r.nganSach ? '#ff4d4f' : undefined }}>{formatVND(v)}</Text>,
    },
    {
      title: 'Còn lại', key: 'conlai',
      render: (_: unknown, r: HangMuc) => {
        const diff = r.nganSach - r.chiTieu;
        return <Text style={{ color: diff < 0 ? '#ff4d4f' : '#52c41a', fontWeight: 600 }}>{formatVND(diff)}</Text>;
      },
    },
    {
      title: '% Sử dụng', key: 'pct',
      render: (_: unknown, r: HangMuc) => {
        const pct = r.nganSach > 0 ? Math.round((r.chiTieu / r.nganSach) * 100) : 0;
        return (
          <Progress
            percent={Math.min(pct, 100)}
            size="small"
            status={pct > 100 ? 'exception' : pct > 80 ? 'active' : 'normal'}
            format={() => `${pct}%`}
          />
        );
      },
    },
    {
      title: 'Trạng thái', key: 'status',
      render: (_: unknown, r: HangMuc) =>
        r.chiTieu > r.nganSach
          ? <Tag color="error" icon={<WarningOutlined />}>Vượt ngân sách</Tag>
          : r.chiTieu > r.nganSach * 0.8
          ? <Tag color="warning">Gần đạt giới hạn</Tag>
          : <Tag color="success" icon={<CheckCircleOutlined />}>Ổn định</Tag>,
    },
  ];

  const overBudgetItems = hangMucs.filter((h) => h.chiTieu > h.nganSach);
  const nearLimitItems = hangMucs.filter((h) => h.chiTieu > h.nganSach * 0.8 && h.chiTieu <= h.nganSach);

  return (
    <div style={{ padding: screens.xs ? 12 : 24 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
        <Title level={4} style={{ margin: 0 }}>Quản lý ngân sách</Title>
        <Space wrap>
          <Select
            value={selectedLT || undefined}
            onChange={handleSelectLT}
            style={{ width: screens.xs ? 200 : 260 }}
            placeholder="Chọn lịch trình"
          >
            {lichTrinhs.map((lt) => (
              <Option key={lt.id} value={lt.id}>{lt.tenLichTrinh}</Option>
            ))}
          </Select>
          {editMode ? (
            <Button type="primary" icon={<SaveOutlined />} onClick={handleSave}>
              Lưu
            </Button>
          ) : (
            <Button icon={<EditOutlined />} onClick={() => setEditMode(true)}>Chỉnh sửa</Button>
          )}
        </Space>
      </div>

      {overBudgetItems.length > 0 && (
        <Alert
          type="error"
          showIcon
          icon={<WarningOutlined />}
          message={`Vượt ngân sách ${overBudgetItems.length} hạng mục!`}
          description={overBudgetItems.map((h) => (
            <div key={h.key}>
              {h.icon} <strong>{h.ten}</strong>: Vượt {formatVND(h.chiTieu - h.nganSach)}
            </div>
          ))}
          style={{ marginBottom: 16 }}
        />
      )}
      {nearLimitItems.length > 0 && overBudgetItems.length === 0 && (
        <Alert
          type="warning"
          showIcon
          message={`Cảnh báo: ${nearLimitItems.length} hạng mục gần đạt giới hạn ngân sách`}
          description={nearLimitItems.map((h) => `${h.icon} ${h.ten}`).join(', ')}
          style={{ marginBottom: 16 }}
        />
      )}

      <Row gutter={[16, 16]} style={{ marginBottom: 20 }}>
        <Col xs={12} sm={6}>
          <Card>
            <Statistic
              title="Tổng ngân sách"
              value={formatVND(tongNganSach)} 
              valueStyle={{ fontSize: screens.xs ? 14 : 16, color: '#1677ff' }}
              prefix={<DollarOutlined />}
            />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card>
            <Statistic
              title="Đã chi tiêu"
              value={formatVND(tongChiTieu)}
              valueStyle={{ fontSize: screens.xs ? 14 : 16, color: pctSuDung > 100 ? '#ff4d4f' : '#faad14' }}
            />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card>
            <Statistic
              title="Còn lại"
              value={formatVND(Math.abs(conLai))}
              valueStyle={{ fontSize: screens.xs ? 14 : 16, color: conLai < 0 ? '#ff4d4f' : '#52c41a' }}
              prefix={conLai < 0 ? '-' : '+'}
            />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card>
            <div style={{ marginBottom: 8 }}>
              <Text type="secondary">Tỉ lệ sử dụng</Text>
            </div>
            <Progress
              type="circle"
              percent={Math.min(pctSuDung, 100)}
              width={screens.xs ? 60 : 70}
              status={pctSuDung > 100 ? 'exception' : pctSuDung > 80 ? 'active' : 'normal'}
              format={() => `${pctSuDung}%`}
            />
          </Card>
        </Col>
      </Row>

      <Tabs
        defaultActiveKey="pie"
        items={[
          {
            key: 'pie',
            label: <Space><PieChartOutlined />Phân bổ chi tiêu</Space>,
            children: (
              <Card>
                {tongChiTieu > 0
                  ? <Pie {...pieConfig} height={screens.xs ? 280 : 360} />
                  : <div style={{ textAlign: 'center', padding: 40, color: '#999' }}>Chưa có dữ liệu chi tiêu</div>
                }
              </Card>
            ),
          },
          {
            key: 'bar',
            label: <Space><BarChartOutlined />So sánh ngân sách</Space>,
            children: (
              <Card>
                <Column {...barConfig} height={screens.xs ? 250 : 320} />
              </Card>
            ),
          },
        ]}
        style={{ marginBottom: 20 }}
      />

      <Card title="Chi tiết từng hạng mục">
        <Table
          columns={tableColumns}
          dataSource={hangMucs}
          rowKey="key"
          pagination={false}
          scroll={{ x: 600 }}
          summary={() => (
            <Table.Summary.Row style={{ background: '#fafafa', fontWeight: 600 }}>
              <Table.Summary.Cell index={0}>Tổng cộng</Table.Summary.Cell>
              <Table.Summary.Cell index={1}>{formatVND(tongNganSach)}</Table.Summary.Cell>
              <Table.Summary.Cell index={2}>
                <Text style={{ color: tongChiTieu > tongNganSach ? '#ff4d4f' : undefined }}>
                  {formatVND(tongChiTieu)}
                </Text>
              </Table.Summary.Cell>
              <Table.Summary.Cell index={3}>
                <Text style={{ color: conLai < 0 ? '#ff4d4f' : '#52c41a' }}>
                  {formatVND(Math.abs(conLai))}
                </Text>
              </Table.Summary.Cell>
              <Table.Summary.Cell index={4} colSpan={2}>
                <Progress
                  percent={Math.min(pctSuDung, 100)}
                  status={pctSuDung > 100 ? 'exception' : 'normal'}
                  size="small"
                />
              </Table.Summary.Cell>
            </Table.Summary.Row>
          )}
        />
      </Card>
    </div>
  );
};

export default QuanLyNganSach;