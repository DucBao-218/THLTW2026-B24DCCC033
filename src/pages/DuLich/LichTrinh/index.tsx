import React, { useState, useEffect } from 'react';
import {
  Card, Row, Col, Button, Select, DatePicker, Input, InputNumber,
  Tag, Typography, Space, Modal, message, Divider, Timeline,
  Statistic, Steps, Form, Popconfirm, Empty, Alert, Grid, Drawer,
} from 'antd';
import {
  PlusOutlined, DeleteOutlined, CalendarOutlined, EnvironmentOutlined,
  ClockCircleOutlined, DollarOutlined, ArrowRightOutlined, EditOutlined,
  CheckCircleOutlined, SaveOutlined, EyeOutlined, TeamOutlined,
} from '@ant-design/icons';
import dayjs from 'dayjs';
import {
  DiemDen, LichTrinh, Ngay, DiemDenTrongNgay, STORAGE_KEYS,
  getFromStorage, saveToStorage, seedDiemDen, seedLichTrinh,
  generateId, formatVND, LOAI_HINH_LABELS,
} from '../types';

const { Title, Text } = Typography;
const { Option } = Select;
const { RangePicker } = DatePicker;
const { useBreakpoint } = Grid;

const TaoLichTrinh: React.FC = () => {
  const screens = useBreakpoint();
  const [diemDens, setDiemDens] = useState<DiemDen[]>([]);
  const [lichTrinhs, setLichTrinhs] = useState<LichTrinh[]>([]);
  const [current, setCurrent] = useState<LichTrinh | null>(null);
  const [step, setStep] = useState(0);
  const [form] = Form.useForm();
  const [addModal, setAddModal] = useState<{ open: boolean; ngayId: string }>({ open: false, ngayId: '' });
  const [selectedDiemDen, setSelectedDiemDen] = useState('');
  const [addNote, setAddNote] = useState('');
  const [addTime, setAddTime] = useState({ bat: '08:00', ket: '10:00' });
  const [viewDrawer, setViewDrawer] = useState<LichTrinh | null>(null);
  const [listMode, setListMode] = useState(true);

  useEffect(() => {
    const stored = getFromStorage<DiemDen[]>(STORAGE_KEYS.DIEM_DEN, []);
    setDiemDens(stored.length ? stored : seedDiemDen);
    const storedLT = getFromStorage<LichTrinh[]>(STORAGE_KEYS.LICH_TRINH, []);
    if (!storedLT.length) {
      saveToStorage(STORAGE_KEYS.LICH_TRINH, seedLichTrinh);
      setLichTrinhs(seedLichTrinh);
    } else {
      setLichTrinhs(storedLT);
    }
  }, []);

  const saveLT = (list: LichTrinh[]) => {
    setLichTrinhs(list);
    saveToStorage(STORAGE_KEYS.LICH_TRINH, list);
  };

  const startNew = () => {
    form.resetFields();
    setCurrent(null);
    setStep(0);
    setListMode(false);
  };

  const handleStep1 = () => {
    form.validateFields(['tenLichTrinh', 'ngay', 'soNguoi', 'nganSachTong']).then((vals) => {
      const start = dayjs(vals.ngay[0]);
      const end = dayjs(vals.ngay[1]);
      const days: Ngay[] = [];
      let d = start;
      
      while (d.isBefore(end, 'day') || d.isSame(end, 'day')) {
        days.push({ id: generateId(), ngay: d.format('YYYY-MM-DD'), diemDens: [] });
        d = d.add(1, 'day');
      }

      const lt: LichTrinh = {
        id: current?.id || generateId(),
        tenLichTrinh: vals.tenLichTrinh,
        ngayBatDau: start.format('YYYY-MM-DD'),
        ngayKetThuc: end.format('YYYY-MM-DD'),
        ngans: current?.ngans.length ? current.ngans : days,
        nganSachTong: vals.nganSachTong,
        chiPhiThucTe: 0,
        soNguoi: vals.soNguoi,
        trangThai: current?.trangThai || 'draft',
        createdAt: current?.createdAt || new Date().toISOString(),
        thang: start.format('YYYY-MM'),
      };
      setCurrent(lt);
      setStep(1);
    });
  };

  const calcChiPhi = (lt: LichTrinh): number => {
    let total = 0;
    lt.ngans.forEach((n) => {
      n.diemDens.forEach((d) => {
        const dd = diemDens.find((x) => x.id === d.diemDenId);
        if (dd) total += dd.chiPhiAnUong + dd.giaVe;
      });
    });
    const nights = lt.ngans.length > 0 ? lt.ngans.length - 1 : 0;
    const maxLuuTru = Math.max(
      ...lt.ngans.flatMap((n) =>
        n.diemDens.map((d) => diemDens.find((x) => x.id === d.diemDenId)?.chiPhiLuuTru || 0),
      ),
      0,
    );
    total += nights * maxLuuTru * lt.soNguoi;
    return total;
  };

  const addDiemDenToNgay = () => {
    if (!selectedDiemDen) { message.error('Chọn điểm đến'); return; }
    if (!current) return;
    const item: DiemDenTrongNgay = {
      diemDenId: selectedDiemDen,
      ghiChu: addNote,
      thoiGianBatDau: addTime.bat,
      thoiGianKetThuc: addTime.ket,
    };
    
    const updatedNgans = current.ngans.map((n) => {
      if (n.id === addModal.ngayId) {
        const newDiemDens = [...n.diemDens, item].sort((a, b) => a.thoiGianBatDau.localeCompare(b.thoiGianBatDau));
        return { ...n, diemDens: newDiemDens };
      }
      return n;
    });

    const chiPhiThucTe = calcChiPhi({ ...current, ngans: updatedNgans });
    setCurrent({ ...current, ngans: updatedNgans, chiPhiThucTe });
    setAddModal({ open: false, ngayId: '' });
    setSelectedDiemDen('');
    setAddNote('');
    setAddTime({ bat: '08:00', ket: '10:00' });
  };

  const removeDiemDen = (ngayId: string, idx: number) => {
    if (!current) return;
    const updatedNgans = current.ngans.map((n) =>
      n.id === ngayId
        ? { ...n, diemDens: n.diemDens.filter((_, i) => i !== idx) }
        : n,
    );
    const chiPhiThucTe = calcChiPhi({ ...current, ngans: updatedNgans });
    setCurrent({ ...current, ngans: updatedNgans, chiPhiThucTe });
  };

  const handleSave = () => {
    if (!current) return;
    const exists = lichTrinhs.find((l) => l.id === current.id);
    
    const finalTrangThai = exists ? current.trangThai : ('confirmed' as const);
    const currentToSave = { ...current, trangThai: finalTrangThai };

    const updated = exists
      ? lichTrinhs.map((l) => (l.id === current.id ? currentToSave : l))
      : [...lichTrinhs, currentToSave];
    
    saveLT(updated);

    if (!exists) {
      const usedDiemDenIds = new Set<string>();
      current.ngans.forEach(n => n.diemDens.forEach(d => usedDiemDenIds.add(d.diemDenId)));

      const storedDD = getFromStorage<DiemDen[]>(STORAGE_KEYS.DIEM_DEN, []);
      const updatedDD = storedDD.map(dd =>
        usedDiemDenIds.has(dd.id) ? { ...dd, luotLichTrinh: (dd.luotLichTrinh || 0) + 1 } : dd
      );
      saveToStorage(STORAGE_KEYS.DIEM_DEN, updatedDD);
      setDiemDens(updatedDD); 
    }

    message.success('Đã lưu lịch trình thành công!');
    setListMode(true);
    setCurrent(null);
    setStep(0);
  };

  const getDiemDen = (id: string) => diemDens.find((d) => d.id === id);

  if (listMode) {
    return (
      <div style={{ padding: screens.xs ? 12 : 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <Title level={4} style={{ margin: 0 }}>Lịch trình du lịch</Title>
          <Button type="primary" icon={<PlusOutlined />} onClick={startNew}>Tạo lịch trình mới</Button>
        </div>

        {lichTrinhs.length === 0 ? (
          <Empty description="Chưa có lịch trình nào. Hãy tạo ngay!" style={{ padding: 60 }} />
        ) : (
          <Row gutter={[16, 16]}>
            {lichTrinhs.map((lt) => {
              const days = dayjs(lt.ngayKetThuc).diff(dayjs(lt.ngayBatDau), 'day') + 1;
              const pct = lt.nganSachTong > 0 ? Math.round((lt.chiPhiThucTe / lt.nganSachTong) * 100) : 0;
              
              return (
                <Col key={lt.id} xs={24} sm={24} md={12} lg={8}>
                  <Card
                    hoverable
                    extra={
                      <Space>
                        <Button size="small" icon={<EyeOutlined />} onClick={() => setViewDrawer(lt)} />
                        <Popconfirm
                          title="Xóa lịch trình này?"
                          onConfirm={() => saveLT(lichTrinhs.filter((l) => l.id !== lt.id))}
                        >
                          <Button size="small" danger icon={<DeleteOutlined />} />
                        </Popconfirm>
                      </Space>
                    }
                    title={
                      <Space>
                        <CalendarOutlined style={{ color: '#1677ff' }} />
                        <Text strong ellipsis style={{ maxWidth: 140 }}>{lt.tenLichTrinh}</Text>
                      </Space>
                    }
                  >
                    <Space direction="vertical" style={{ width: '100%' }}>
                      <Space>
                        <Select
                          size="small"
                          value={lt.trangThai}
                          onChange={(val: any) => {
                            const updated = lichTrinhs.map(l => l.id === lt.id ? { ...l, trangThai: val } : l);
                            saveLT(updated);
                            message.success('Đã cập nhật trạng thái');
                          }}
                          style={{ minWidth: 110 }}
                          options={[
                            { label: 'Nháp', value: 'draft' },
                            { label: 'Xác nhận', value: 'confirmed' },
                            { label: 'Hoàn thành', value: 'completed' },
                          ]}
                        />
                        <Text type="secondary" style={{ fontSize: 12 }}>
                          {dayjs(lt.ngayBatDau).format('DD/MM')} → {dayjs(lt.ngayKetThuc).format('DD/MM/YYYY')}
                        </Text>
                      </Space>
                      <Row gutter={8}>
                        <Col span={12}><Statistic title="Số ngày" value={days} suffix="ngày" valueStyle={{ fontSize: 18 }} /></Col>
                        <Col span={12}><Statistic title="Số người" value={lt.soNguoi} suffix="người" valueStyle={{ fontSize: 18 }} /></Col>
                      </Row>
                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                          <Text style={{ fontSize: 12 }}>Ngân sách: {formatVND(lt.nganSachTong)}</Text>
                          <Text style={{ fontSize: 12, color: pct > 90 ? '#ff4d4f' : '#52c41a' }}>{pct}%</Text>
                        </div>
                        <div style={{ background: '#f0f0f0', borderRadius: 4, height: 6 }}>
                          <div style={{
                            background: pct > 100 ? '#ff4d4f' : pct > 80 ? '#faad14' : '#52c41a',
                            height: '100%', borderRadius: 4,
                            width: `${Math.min(pct, 100)}%`, transition: 'width .3s',
                          }} />
                        </div>
                      </div>
                    </Space>
                  </Card>
                </Col>
              );
            })}
          </Row>
        )}

        <Drawer
          title={viewDrawer?.tenLichTrinh}
          open={!!viewDrawer}
          onClose={() => setViewDrawer(null)}
          width={screens.xs ? '100%' : 500}
          placement={screens.xs ? 'bottom' : 'right'}
          height={screens.xs ? '85vh' : undefined}
        >
          {viewDrawer && (
            <>
              <Row gutter={16} style={{ marginBottom: 16 }}>
                <Col span={12}><Statistic title="Ngày bắt đầu" value={dayjs(viewDrawer.ngayBatDau).format('DD/MM/YYYY')} /></Col>
                <Col span={12}><Statistic title="Ngày kết thúc" value={dayjs(viewDrawer.ngayKetThuc).format('DD/MM/YYYY')} /></Col>
                <Col span={12} style={{ marginTop: 12 }}>
                  <Statistic title="Ngân sách" value={formatVND(viewDrawer.nganSachTong)} />
                </Col>
                <Col span={12} style={{ marginTop: 12 }}>
                  <Statistic title="Chi phí thực tế" value={formatVND(viewDrawer.chiPhiThucTe)} />
                </Col>
              </Row>
              <Divider />
              {viewDrawer.ngans.map((n) => (
                <div key={n.id} style={{ marginBottom: 16 }}>
                  <Text strong style={{ display: 'block', marginBottom: 8, color: '#1677ff' }}>
                    {dayjs(n.ngay).format('dddd, DD/MM/YYYY')}
                  </Text>
                  {n.diemDens.length === 0 ? (
                    <Text type="secondary" style={{ fontSize: 12 }}>Chưa có điểm đến</Text>
                  ) : (
                    <Timeline>
                      {n.diemDens.map((d, i) => {
                        const dd = getDiemDen(d.diemDenId);
                        return (
                          <Timeline.Item key={i} color="blue">
                            <div style={{
                              background: '#f6ffed', borderRadius: 8, padding: 10,
                              marginBottom: 6, border: '1px solid #b7eb8f',
                            }}>
                              <Space>
                                <ClockCircleOutlined style={{ color: '#52c41a' }} />
                                <Text style={{ fontSize: 12 }}>{d.thoiGianBatDau} - {d.thoiGianKetThuc}</Text>
                                <Text strong>{dd?.ten}</Text>
                              </Space>
                            </div>
                          </Timeline.Item>
                        );
                      })}
                    </Timeline>
                  )}
                </div>
              ))}
            </>
          )}
        </Drawer>
      </div>
    );
  }

  return (
    <div style={{ padding: screens.xs ? 12 : 24 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <Title level={4} style={{ margin: 0 }}>Tạo lịch trình mới</Title>
        <Button onClick={() => setListMode(true)}>← Quay lại danh sách</Button>
      </div>

      <Steps
        current={step}
        style={{ marginBottom: 24 }}
        items={[
          { title: 'Thông tin cơ bản', icon: <EditOutlined /> },
          { title: 'Xếp lịch ngày', icon: <CalendarOutlined /> },
          { title: 'Xác nhận & Lưu', icon: <CheckCircleOutlined /> },
        ]}
      />

      {step === 0 && (
        <Card title="Thông tin chuyến đi">
          <Form form={form} layout="vertical">
            <Form.Item label="Tên lịch trình" name="tenLichTrinh" rules={[{ required: true, message: 'Bắt buộc' }]}>
              <Input placeholder="VD: Hè Hạ Long 3N2Đ" size="large" />
            </Form.Item>
            <Form.Item label="Ngày đi - Ngày về" name="ngay" rules={[{ required: true, message: 'Bắt buộc' }]}>
              <RangePicker style={{ width: '100%' }} format="DD/MM/YYYY" size="large" />
            </Form.Item>
            <Row gutter={16}>
              <Col xs={24} sm={12}>
                <Form.Item label="Số người" name="soNguoi" initialValue={2} rules={[{ required: true }]}>
                  <InputNumber min={1} max={50} style={{ width: '100%' }} size="large"
                    addonBefore={<TeamOutlined />} addonAfter="người" />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12}>
                <Form.Item label="Tổng ngân sách (VND)" name="nganSachTong" rules={[{ required: true }]}>
                  <InputNumber
                    min={0} style={{ width: '100%' }} size="large"
                    formatter={(v) => `${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                    addonBefore={<DollarOutlined />}
                  />
                </Form.Item>
              </Col>
            </Row>
            <Button type="primary" size="large" block onClick={handleStep1}>
              Tiếp theo: Xếp lịch <ArrowRightOutlined />
            </Button>
          </Form>
        </Card>
      )}

      {step === 1 && current && (
        <div>
          <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
            <Col xs={12} sm={6}>
              <Card size="small">
                <Statistic title="Tổng ngân sách" value={formatVND(current.nganSachTong)} valueStyle={{ fontSize: 14 }} />
              </Card>
            </Col>
            <Col xs={12} sm={6}>
              <Card size="small">
                <Statistic title="Chi phí ước tính" value={formatVND(current.chiPhiThucTe)}
                  valueStyle={{ fontSize: 14, color: current.chiPhiThucTe > current.nganSachTong ? '#ff4d4f' : '#52c41a' }} />
              </Card>
            </Col>
            <Col xs={12} sm={6}>
              <Card size="small">
                <Statistic title="Số người" value={current.soNguoi} suffix="người" valueStyle={{ fontSize: 14 }} />
              </Card>
            </Col>
            <Col xs={12} sm={6}>
              <Card size="small">
                <Statistic title="Số ngày" value={current.ngans.length} suffix="ngày" valueStyle={{ fontSize: 14 }} />
              </Card>
            </Col>
          </Row>

          {current.chiPhiThucTe > current.nganSachTong && (
            <Alert
              message="Chi phí ước tính vượt ngân sách!"
              description={`Bạn đã vượt ${formatVND(current.chiPhiThucTe - current.nganSachTong)}. Hãy cân nhắc điều chỉnh lịch trình.`}
              type="warning"
              showIcon
              style={{ marginBottom: 16 }}
            />
          )}

          <Row gutter={[16, 16]}>
            {current.ngans.map((ngay) => (
              <Col key={ngay.id} xs={24} md={12}>
                <Card
                  title={
                    <Space>
                      <CalendarOutlined style={{ color: '#1677ff' }} />
                      <Text strong>{dayjs(ngay.ngay).format('dddd, DD/MM/YYYY')}</Text>
                    </Space>
                  }
                  extra={
                    <Button
                      size="small"
                      type="dashed"
                      icon={<PlusOutlined />}
                      onClick={() => setAddModal({ open: true, ngayId: ngay.id })}
                    >
                      Thêm điểm
                    </Button>
                  }
                  size="small"
                >
                  {ngay.diemDens.length === 0 ? (
                    <Empty description="Chưa có điểm đến" image={Empty.PRESENTED_IMAGE_SIMPLE} />
                  ) : (
                    <Timeline>
                      {ngay.diemDens.map((d, idx) => {
                        const dd = getDiemDen(d.diemDenId);
                        return (
                          <Timeline.Item key={idx} color="blue">
                            <div style={{
                              background: '#f0f5ff', borderRadius: 8, padding: 8,
                              border: '1px solid #adc6ff', marginBottom: 4,
                            }}>
                              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <Space>
                                  <Text strong style={{ fontSize: 13 }}>{dd?.ten || d.diemDenId}</Text>
                                  <Tag color="blue" style={{ fontSize: 11 }}>
                                    {d.thoiGianBatDau} - {d.thoiGianKetThuc}
                                  </Tag>
                                </Space>
                                <Button
                                  danger size="small" type="text" icon={<DeleteOutlined />}
                                  onClick={() => removeDiemDen(ngay.id, idx)}
                                />
                              </div>
                              {dd && (
                                <Space style={{ marginTop: 4 }}>
                                  <EnvironmentOutlined style={{ fontSize: 11, color: '#888' }} />
                                  <Text type="secondary" style={{ fontSize: 11 }}>{dd.viTri}</Text>
                                  <DollarOutlined style={{ fontSize: 11, color: '#888' }} />
                                  <Text type="secondary" style={{ fontSize: 11 }}>
                                    {formatVND(dd.chiPhiAnUong + dd.giaVe)}
                                  </Text>
                                </Space>
                              )}
                              {d.ghiChu && <Text type="secondary" style={{ fontSize: 11, display: 'block' }}>Ghi chú: {d.ghiChu}</Text>}
                            </div>
                          </Timeline.Item>
                        );
                      })}
                    </Timeline>
                  )}
                </Card>
              </Col>
            ))}
          </Row>

          <div style={{ marginTop: 20, display: 'flex', gap: 12, justifyContent: 'flex-end', flexWrap: 'wrap' }}>
            <Button onClick={() => setStep(0)}>← Quay lại</Button>
            <Button type="primary" onClick={() => setStep(2)}>Tiếp theo: Xác nhận →</Button>
          </div>
        </div>
      )}

      {step === 2 && current && (
        <Card title="Xác nhận lịch trình">
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={12}>
              <Statistic title="Tên lịch trình" value={current.tenLichTrinh} />
            </Col>
            <Col xs={24} sm={12}>
              <Statistic title="Thời gian" value={`${dayjs(current.ngayBatDau).format('DD/MM')} → ${dayjs(current.ngayKetThuc).format('DD/MM/YYYY')}`} />
            </Col>
            <Col xs={24} sm={8}>
              <Statistic title="Số người" value={current.soNguoi} suffix="người" />
            </Col>
            <Col xs={24} sm={8}>
              <Statistic title="Ngân sách" value={formatVND(current.nganSachTong)} />
            </Col>
            <Col xs={24} sm={8}>
              <Statistic
                title="Chi phí ước tính"
                value={formatVND(current.chiPhiThucTe)}
                valueStyle={{ color: current.chiPhiThucTe > current.nganSachTong ? '#ff4d4f' : '#52c41a' }}
              />
            </Col>
          </Row>
          <Divider />
          <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', flexWrap: 'wrap' }}>
            <Button onClick={() => setStep(1)}>← Chỉnh sửa lịch</Button>
            <Button type="primary" size="large" icon={<SaveOutlined />} onClick={handleSave}>
              Lưu lịch trình
            </Button>
          </div>
        </Card>
      )}

      <Modal
        title="Thêm điểm đến vào ngày"
        open={addModal.open}
        onOk={addDiemDenToNgay}
        onCancel={() => setAddModal({ open: false, ngayId: '' })}
        okText="Thêm"
        cancelText="Hủy"
      >
        <Space direction="vertical" style={{ width: '100%' }}>
          <div>
            <Text strong>Chọn điểm đến:</Text>
            <Select
              showSearch
              style={{ width: '100%', marginTop: 8 }}
              placeholder="Tìm điểm đến..."
              value={selectedDiemDen || undefined}
              onChange={setSelectedDiemDen}
              optionFilterProp="children"
            >
              {diemDens.map((dd) => (
                <Option key={dd.id} value={dd.id}>
                  {LOAI_HINH_LABELS[dd.loaiHinh]} {dd.ten} — {dd.viTri}
                </Option>
              ))}
            </Select>
          </div>
          <Row gutter={8}>
            <Col span={12}>
              <Text strong>Giờ bắt đầu:</Text>
              <Input type="time" value={addTime.bat} onChange={(e) => setAddTime({ ...addTime, bat: e.target.value })} style={{ marginTop: 8 }} />
            </Col>
            <Col span={12}>
              <Text strong>Giờ kết thúc:</Text>
              <Input type="time" value={addTime.ket} onChange={(e) => setAddTime({ ...addTime, ket: e.target.value })} style={{ marginTop: 8 }} />
            </Col>
          </Row>
          <div>
            <Text strong>Ghi chú:</Text>
            <Input.TextArea
              rows={2}
              value={addNote}
              onChange={(e) => setAddNote(e.target.value)}
              placeholder="Ghi chú cho điểm đến này..."
              style={{ marginTop: 8 }}
            />
          </div>
          {selectedDiemDen && (() => {
            const dd = getDiemDen(selectedDiemDen);
            if (!dd) return null;
            return (
              <Card size="small" style={{ background: '#f6ffed', border: '1px solid #b7eb8f' }}>
                <Space wrap>
                  <Text>Thời gian: {dd.thoiGianThamQuan}h</Text>
                  <Text>Ăn uống: {formatVND(dd.chiPhiAnUong)}/ngày</Text>
                  <Text>Vé: {dd.giaVe > 0 ? formatVND(dd.giaVe) : 'Miễn phí'}</Text>
                </Space>
              </Card>
            );
          })()}
        </Space>
      </Modal>
    </div>
  );
};

export default TaoLichTrinh;