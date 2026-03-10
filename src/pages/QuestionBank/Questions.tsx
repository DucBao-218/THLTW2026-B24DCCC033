import React, { useState } from 'react';
import {
  Table, Button, Modal, Form, Input, Select, Space,
  Typography, Card, Popconfirm, message, Tag, Row, Col,
} from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, SearchOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { KhoiKienThuc, MonHoc, CauHoi, MauDeThi, DeThi, MucDoKho } from './types';

const { Title } = Typography;
const { Option } = Select;

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
  onThem: (data: Omit<CauHoi, 'id' | 'maCauHoi' | 'ngayTao'>) => void;
  onSua:  (id: string, data: Omit<CauHoi, 'id' | 'maCauHoi' | 'ngayTao'>) => void;
  onXoa:  (id: string) => void;
}

const Questions: React.FC<Props> = ({
  khoiKienThucs, monHocs, cauHois, onThem, onSua, onXoa,
}) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form] = Form.useForm();

  const [filterMon,   setFilterMon]   = useState<string | undefined>();
  const [filterMucDo, setFilterMucDo] = useState<MucDoKho | undefined>();
  const [filterKhoi,  setFilterKhoi]  = useState<string | undefined>();

  const moModal = (record?: CauHoi) => {
    if (record) { setEditingId(record.id); form.setFieldsValue(record); }
    else        { setEditingId(null);      form.resetFields(); }
    setModalOpen(true);
  };

  const handleOk = () => {
    form.validateFields().then(values => {
      if (editingId) { onSua(editingId, values); message.success('Đã cập nhật'); }
      else           { onThem(values);           message.success('Đã thêm');     }
      setModalOpen(false);
    });
  };

  const danhSachHienThi = cauHois.filter(c => {
    if (filterMon   && c.monHocId       !== filterMon)   return false;
    if (filterMucDo && c.mucDoKho       !== filterMucDo) return false;
    if (filterKhoi  && c.khoiKienThucId !== filterKhoi)  return false;
    return true;
  });

  const columns: ColumnsType<CauHoi> = [
    { title: 'Mã CH', dataIndex: 'maCauHoi', key: 'maCauHoi', width: 90 },
    {
      title: 'Môn học', dataIndex: 'monHocId', key: 'monHocId', width: 160,
      render: id => monHocs.find(m => m.id === id)?.tenMon || '—',
    },
    {
      title: 'Nội dung', dataIndex: 'noiDung', key: 'noiDung',
      render: text => <span style={{ whiteSpace: 'pre-wrap' }}>{text}</span>,
    },
    {
      title: 'Mức độ', dataIndex: 'mucDoKho', key: 'mucDoKho', width: 110, align: 'center',
      render: (v: MucDoKho) => <Tag color={MUC_DO_COLOR[v]}>{v}</Tag>,
    },
    {
      title: 'Khối KT', dataIndex: 'khoiKienThucId', key: 'khoiKienThucId', width: 130,
      render: id => khoiKienThucs.find(k => k.id === id)?.ten || '—',
    },
    {
      title: 'Thao tác', key: 'action', width: 100, align: 'center',
      render: (_, record) => (
        <Space>
          <Button size="small" icon={<EditOutlined />} onClick={() => moModal(record)} />
          <Popconfirm title="Xác nhận xóa?" onConfirm={() => { onXoa(record.id); message.success('Đã xóa'); }}>
            <Button size="small" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <Card>
      <Space style={{ width: '100%', justifyContent: 'space-between', marginBottom: 16 }}>
        <Title level={4} style={{ margin: 0 }}> Ngân hàng câu hỏi</Title>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => moModal()}>Thêm câu hỏi</Button>
      </Space>

      <Card size="small" style={{ marginBottom: 16, background: '#fafafa' }}>
        <Row gutter={12} align="middle">
          <Col><SearchOutlined style={{ color: '#8c8c8c' }} /></Col>
          <Col flex={1}>
            <Select allowClear placeholder="Lọc theo môn học" style={{ width: '100%' }}
              value={filterMon} onChange={setFilterMon}>
              {monHocs.map(m => <Option key={m.id} value={m.id}>{m.tenMon}</Option>)}
            </Select>
          </Col>
          <Col flex={1}>
            <Select allowClear placeholder="Lọc theo mức độ" style={{ width: '100%' }}
              value={filterMucDo} onChange={v => setFilterMucDo(v as MucDoKho)}>
              {MUC_DO_OPTIONS.map(m => <Option key={m} value={m}>{m}</Option>)}
            </Select>
          </Col>
          <Col flex={1}>
            <Select allowClear placeholder="Lọc theo khối KT" style={{ width: '100%' }}
              value={filterKhoi} onChange={setFilterKhoi}>
              {khoiKienThucs.map(k => <Option key={k.id} value={k.id}>{k.ten}</Option>)}
            </Select>
          </Col>
          <Col>
            <Button onClick={() => { setFilterMon(undefined); setFilterMucDo(undefined); setFilterKhoi(undefined); }}>
              Xóa lọc
            </Button>
          </Col>
        </Row>
      </Card>

      <Table columns={columns} dataSource={danhSachHienThi} rowKey="id" size="middle"
        pagination={{ pageSize: 10 }} locale={{ emptyText: 'Không có câu hỏi phù hợp' }} />

      <Modal
        title={editingId ? 'Sửa câu hỏi' : 'Thêm câu hỏi'}
        visible={modalOpen} onOk={handleOk} onCancel={() => setModalOpen(false)}
        okText="Lưu" cancelText="Hủy" width={640} destroyOnClose
      >
        <Form form={form} layout="vertical" style={{ marginTop: 16 }}>
          <Form.Item name="monHocId" label="Môn học" rules={[{ required: true, message: 'Chọn môn học' }]}>
            <Select placeholder="Chọn môn học">
              {monHocs.map(m => <Option key={m.id} value={m.id}>{m.tenMon}</Option>)}
            </Select>
          </Form.Item>
          <Form.Item name="noiDung" label="Nội dung câu hỏi" rules={[{ required: true, message: 'Nhập nội dung' }]}>
            <Input.TextArea rows={4} placeholder="Nhập nội dung câu hỏi..." />
          </Form.Item>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="mucDoKho" label="Mức độ khó" rules={[{ required: true, message: 'Chọn mức độ' }]}>
                <Select placeholder="Chọn mức độ">
                  {MUC_DO_OPTIONS.map(m => <Option key={m} value={m}>{m}</Option>)}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="khoiKienThucId" label="Khối kiến thức" rules={[{ required: true, message: 'Chọn khối KT' }]}>
                <Select placeholder="Chọn khối kiến thức">
                  {khoiKienThucs.map(k => <Option key={k.id} value={k.id}>{k.ten}</Option>)}
                </Select>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </Card>
  );
};

export default Questions;