import React, { useState } from 'react';
import {
  Table, Button, Modal, Form, Input, Select, Space, Typography,
  Card, Popconfirm, message, Tag, InputNumber, Row, Col,
  Divider, Alert, List, Collapse,
} from 'antd';
import {
  PlusOutlined, DeleteOutlined, ThunderboltOutlined,
  FileTextOutlined, SaveOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { KhoiKienThuc, MonHoc, CauHoi, MauDeThi, DeThi, CauTrucDeThi, MucDoKho } from './types';

const { Title, Text } = Typography;
const { Option } = Select;
const { Panel } = Collapse;

const MUC_DO_OPTIONS: MucDoKho[] = ['Dễ', 'Trung bình', 'Khó', 'Rất khó'];
const MUC_DO_COLOR: Record<MucDoKho, string> = {
  'Dễ': 'green', 'Trung bình': 'blue', 'Khó': 'orange', 'Rất khó': 'red',
};

interface Props {
  khoiKienThucs: KhoiKienThuc[];
  monHocs: MonHoc[];
  cauHois: CauHoi[];
  mauDeThis: MauDeThi[];
  deThis: DeThi[];
  onThemDeThi: (data: Omit<DeThi,    'id' | 'ngayTao'>) => void;
  onXoaDeThi:  (id: string) => void;
  onThemMau:   (data: Omit<MauDeThi, 'id' | 'ngayTao'>) => void;
  onSuaMau:    (id: string, data: Omit<MauDeThi, 'id' | 'ngayTao'>) => void;
  onXoaMau:    (id: string) => void;
}

// ── Modal tạo đề ───────────────────────────────────────────────────────────────
interface TaoDeProps extends Props { onClose: () => void; }

const TaoDeThiModal: React.FC<TaoDeProps> = ({
  cauHois, monHocs, khoiKienThucs, mauDeThis,
  onThemDeThi, onThemMau, onClose,
}) => {
  const [form] = Form.useForm();
  const [cauTruc,     setCauTruc]     = useState<CauTrucDeThi[]>([{ mucDoKho: 'Dễ', khoiKienThucId: '', soCauHoi: 1 }]);
  const [ketQua,      setKetQua]      = useState<string[] | null>(null);
  const [loi,         setLoi]         = useState<string[]>([]);
  const [luuMau,      setLuuMau]      = useState(false);
  const [selectedMau, setSelectedMau] = useState<string | undefined>();

  const apDungMau = (mauId: string) => {
    const mau = mauDeThis.find(m => m.id === mauId);
    if (!mau) return;
    form.setFieldsValue({ monHocId: mau.monHocId });
    setCauTruc(mau.cauTruc.map(c => ({ ...c })));
    setSelectedMau(mauId);
  };

  const themDong = () =>
    setCauTruc(prev => [...prev, { mucDoKho: 'Dễ', khoiKienThucId: '', soCauHoi: 1 }]);

  const xoaDong = (i: number) =>
    setCauTruc(prev => prev.filter((_, idx) => idx !== i));

  const capNhatDong = (i: number, field: keyof CauTrucDeThi, value: any) =>
    setCauTruc(prev => prev.map((row, idx) => idx === i ? { ...row, [field]: value } : row));

  const taoDeKiemTra = () => {
    const { monHocId } = form.getFieldsValue();
    if (!monHocId) { message.error('Vui lòng chọn môn học'); return; }

    const pool = cauHois.filter(c => c.monHocId === monHocId);
    const cacLoi: string[] = [];
    const daChan: string[] = [];

    for (const dong of cauTruc) {
      if (!dong.khoiKienThucId) { cacLoi.push('Vui lòng chọn khối kiến thức cho tất cả dòng'); break; }
      const matched = pool.filter(
        c => c.mucDoKho === dong.mucDoKho
          && c.khoiKienThucId === dong.khoiKienThucId
          && !daChan.includes(c.id)
      );
      if (matched.length < dong.soCauHoi) {
        const tenKhoi = khoiKienThucs.find(k => k.id === dong.khoiKienThucId)?.ten || '';
        cacLoi.push(`Không đủ câu hỏi [${dong.mucDoKho} - ${tenKhoi}]: cần ${dong.soCauHoi}, hiện có ${matched.length}`);
      } else {
        [...matched].sort(() => Math.random() - 0.5).slice(0, dong.soCauHoi).forEach(c => daChan.push(c.id));
      }
    }

    setLoi(cacLoi);
    if (cacLoi.length === 0) { setKetQua(daChan); message.success(`Tạo thành công ${daChan.length} câu hỏi!`); }
    else                     { setKetQua(null); }
  };

  const luuDeThi = () => {
    form.validateFields().then(values => {
      if (!ketQua || !ketQua.length) { message.error('Hãy tạo đề trước'); return; }
      onThemDeThi({ ten: values.tenDe, monHocId: values.monHocId, mauDeThiId: selectedMau, danhSachCauHoi: ketQua });
      if (luuMau && values.tenMau) {
        onThemMau({ ten: values.tenMau, monHocId: values.monHocId, cauTruc });
        message.success('Đã lưu mẫu đề thi');
      }
      message.success('Đã lưu đề thi');
      onClose();
    });
  };

  return (
    <div>
      {mauDeThis.length > 0 && (
        <Card size="small" style={{ marginBottom: 16, background: '#f0f5ff' }}>
          <Space>
            <Text strong>Dùng mẫu có sẵn:</Text>
            <Select style={{ minWidth: 220 }} placeholder="Chọn mẫu" allowClear onChange={apDungMau}>
              {mauDeThis.map(m => <Option key={m.id} value={m.id}>{m.ten}</Option>)}
            </Select>
          </Space>
        </Card>
      )}

      <Form form={form} layout="vertical">
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item name="tenDe" label="Tên đề thi" rules={[{ required: true, message: 'Nhập tên đề' }]}>
              <Input placeholder="VD: Đề thi giữa kỳ 1" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="monHocId" label="Môn học" rules={[{ required: true, message: 'Chọn môn học' }]}>
              <Select placeholder="Chọn môn học">
                {monHocs.map(m => <Option key={m.id} value={m.id}>{m.tenMon}</Option>)}
              </Select>
            </Form.Item>
          </Col>
        </Row>
      </Form>

      <Divider orientation="left" style={{ fontSize: 13 }}>Cấu trúc đề thi</Divider>

      {cauTruc.map((dong, i) => (
        <Row key={i} gutter={8} style={{ marginBottom: 8 }} align="middle">
          <Col span={6}>
            <Select value={dong.mucDoKho} style={{ width: '100%' }} onChange={v => capNhatDong(i, 'mucDoKho', v)}>
              {MUC_DO_OPTIONS.map(m => <Option key={m} value={m}>{m}</Option>)}
            </Select>
          </Col>
          <Col span={10}>
            <Select value={dong.khoiKienThucId || undefined} style={{ width: '100%' }}
              placeholder="Khối kiến thức" onChange={v => capNhatDong(i, 'khoiKienThucId', v)}>
              {khoiKienThucs.map(k => <Option key={k.id} value={k.id}>{k.ten}</Option>)}
            </Select>
          </Col>
          <Col span={5}>
            <InputNumber min={1} value={dong.soCauHoi} style={{ width: '100%' }}
              addonBefore="Số câu" onChange={v => capNhatDong(i, 'soCauHoi', v || 1)} />
          </Col>
          <Col span={3}>
            <Button danger icon={<DeleteOutlined />} onClick={() => xoaDong(i)} disabled={cauTruc.length === 1} />
          </Col>
        </Row>
      ))}

      <Button icon={<PlusOutlined />} onClick={themDong} size="small" style={{ marginBottom: 12 }}>Thêm dòng</Button>
      <Button type="dashed" icon={<ThunderboltOutlined />} block onClick={taoDeKiemTra} style={{ marginBottom: 12 }}>
        Tạo đề thi tự động
      </Button>

      {loi.map((l, i) => <Alert key={i} type="error" message={l} showIcon style={{ marginBottom: 8 }} />)}
      {ketQua && ketQua.length > 0 && (
        <Alert type="success" showIcon style={{ marginBottom: 12 }}
          message={`Tạo thành công ${ketQua.length} câu hỏi. Nhấn "Lưu đề thi" để hoàn tất.`} />
      )}

      <Divider style={{ margin: '8px 0' }} />
      <Space style={{ marginBottom: 8 }}>
        <input type="checkbox" id="luuMau" checked={luuMau} onChange={e => setLuuMau(e.target.checked)} />
        <label htmlFor="luuMau" style={{ cursor: 'pointer', fontSize: 13 }}>Lưu cấu trúc thành mẫu đề thi</label>
      </Space>
      {luuMau && (
        <Form form={form}>
          <Form.Item name="tenMau" style={{ marginBottom: 8 }}>
            <Input placeholder="Tên mẫu đề thi..." />
          </Form.Item>
        </Form>
      )}

      <Divider style={{ margin: '8px 0' }} />
      <Button type="primary" icon={<SaveOutlined />} block onClick={luuDeThi}
        disabled={!ketQua || !ketQua.length}>
        Lưu đề thi
      </Button>
    </div>
  );
};

// ── Trang chính ────────────────────────────────────────────────────────────────
const Exam: React.FC<Props> = (props) => {
  const { deThis, cauHois, monHocs, khoiKienThucs, mauDeThis, onXoaDeThi, onXoaMau } = props;
  const [modalOpen, setModalOpen] = useState(false);
  const [xemId,     setXemId]     = useState<string | null>(null);

  const deXem     = deThis.find(d => d.id === xemId);
  const cauHoiXem = deXem ? cauHois.filter(c => deXem.danhSachCauHoi.includes(c.id)) : [];

  const columns: ColumnsType<DeThi> = [
    { title: 'Tên đề thi', dataIndex: 'ten', key: 'ten' },
    { title: 'Môn học', dataIndex: 'monHocId', key: 'monHocId', render: id => monHocs.find(m => m.id === id)?.tenMon || '—' },
    { title: 'Số câu', key: 'soCau', align: 'center', render: (_, r) => <Tag color="blue">{r.danhSachCauHoi.length} câu</Tag> },
    { title: 'Ngày tạo', dataIndex: 'ngayTao', key: 'ngayTao', width: 120, render: v => new Date(v).toLocaleDateString('vi-VN') },
    {
      title: 'Thao tác', key: 'action', width: 130, align: 'center',
      render: (_, record) => (
        <Space>
          <Button size="small" icon={<FileTextOutlined />} onClick={() => setXemId(record.id)}>Xem</Button>
          <Popconfirm title="Xác nhận xóa?" onConfirm={() => { onXoaDeThi(record.id); message.success('Đã xóa'); }}>
            <Button size="small" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const mauColumns: ColumnsType<MauDeThi> = [
    { title: 'Tên mẫu', dataIndex: 'ten', key: 'ten' },
    { title: 'Môn học', dataIndex: 'monHocId', key: 'monHocId', render: id => monHocs.find(m => m.id === id)?.tenMon || '—' },
    {
      title: 'Cấu trúc', key: 'cauTruc',
      render: (_, r) => (
        <Space wrap>
          {r.cauTruc.map((c, i) => (
            <Tag key={i} color={MUC_DO_COLOR[c.mucDoKho]}>
              {c.mucDoKho} · {khoiKienThucs.find(k => k.id === c.khoiKienThucId)?.ten} · {c.soCauHoi} câu
            </Tag>
          ))}
        </Space>
      ),
    },
    {
      title: 'Thao tác', key: 'action', width: 80, align: 'center',
      render: (_, record) => (
        <Popconfirm title="Xác nhận xóa mẫu?" onConfirm={() => { onXoaMau(record.id); message.success('Đã xóa'); }}>
          <Button size="small" danger icon={<DeleteOutlined />} />
        </Popconfirm>
      ),
    },
  ];

  return (
    <>
      <Card style={{ marginBottom: 16 }}>
        <Space style={{ width: '100%', justifyContent: 'space-between', marginBottom: 16 }}>
          <Title level={4} style={{ margin: 0 }}> Quản lý đề thi</Title>
          <Button type="primary" icon={<PlusOutlined />} onClick={() => setModalOpen(true)}>Tạo đề thi mới</Button>
        </Space>
        <Table columns={columns} dataSource={deThis} rowKey="id" size="middle" locale={{ emptyText: 'Chưa có đề thi nào' }} />
      </Card>

      <Collapse>
        <Panel header={` Mẫu đề thi đã lưu (${mauDeThis.length})`} key="1">
          <Table columns={mauColumns} dataSource={mauDeThis} rowKey="id" size="small"
            pagination={false} locale={{ emptyText: 'Chưa có mẫu nào' }} />
        </Panel>
      </Collapse>

      <Modal title="Tạo đề thi mới" visible={modalOpen} onCancel={() => setModalOpen(false)}
        footer={null} width={700} destroyOnClose>
        <TaoDeThiModal {...props} onClose={() => setModalOpen(false)} />
      </Modal>

      <Modal title={` ${deXem?.ten}`} visible={!!xemId} onCancel={() => setXemId(null)}
        footer={<Button onClick={() => setXemId(null)}>Đóng</Button>} width={700}>
        {deXem && (
          <>
            <Space style={{ marginBottom: 12 }}>
              <Tag color="blue"> {monHocs.find(m => m.id === deXem.monHocId)?.tenMon}</Tag>
              <Tag>{deXem.danhSachCauHoi.length} câu hỏi</Tag>
              <Tag>{new Date(deXem.ngayTao).toLocaleDateString('vi-VN')}</Tag>
            </Space>
            <List
              dataSource={cauHoiXem}
              renderItem={(item, index) => (
                <List.Item style={{ alignItems: 'flex-start' }}>
                  <Space direction="vertical" style={{ width: '100%' }}>
                    <Space>
                      <Text strong>Câu {index + 1}.</Text>
                      <Tag color={MUC_DO_COLOR[item.mucDoKho]}>{item.mucDoKho}</Tag>
                      <Tag>{khoiKienThucs.find(k => k.id === item.khoiKienThucId)?.ten}</Tag>
                    </Space>
                    <Text>{item.noiDung}</Text>
                  </Space>
                </List.Item>
              )}
            />
          </>
        )}
      </Modal>
    </>
  );
};

export default Exam;