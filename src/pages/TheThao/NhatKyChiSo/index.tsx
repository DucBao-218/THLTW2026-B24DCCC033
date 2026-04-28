import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, Form, Input, DatePicker, InputNumber, Tag, Space, Popconfirm, Typography, Row, Col, Card } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import moment from 'moment';
import type { ColumnsType } from 'antd/es/table';
import { ChiSoSucKhoe, STORAGE_KEYS, getFromStorage, saveToStorage, seedChiSo, generateId, tinhBMI, phanLoaiBMI } from '../types';

const { Title, Text } = Typography;

const NhatKyChiSo: React.FC = () => {
    const [data, setData] = useState<ChiSoSucKhoe[]>([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [editing, setEditing] = useState<ChiSoSucKhoe | null>(null);
    const [form] = Form.useForm();

    const load = () => {
        const stored = getFromStorage<ChiSoSucKhoe[]>(STORAGE_KEYS.CHI_SO, []);
        setData(stored.length ? stored : (() => { saveToStorage(STORAGE_KEYS.CHI_SO, seedChiSo); return seedChiSo; })());
    };
    useEffect(() => { load(); }, []);

    const save = (list: ChiSoSucKhoe[]) => { saveToStorage(STORAGE_KEYS.CHI_SO, list); setData(list); };

    const openAdd = () => { setEditing(null); form.resetFields(); setModalOpen(true); };
    const openEdit = (r: ChiSoSucKhoe) => { setEditing(r); form.setFieldsValue({ ...r, ngay: moment(r.ngay) }); setModalOpen(true); };
    const handleDelete = (id: string) => save(data.filter(d => d.id !== id));

    const handleOk = async () => {
        const vals = await form.validateFields();
        const ngay = (vals.ngay as moment.Moment).format('YYYY-MM-DD');
        if (editing) {
            save(data.map(d => d.id === editing.id ? { ...d, ...vals, ngay } : d));
        } else {
            const newItem: ChiSoSucKhoe = { id: generateId('CS', data.map(d => d.id)), ...vals, ngay };
            save([...data, newItem]);
        }
        setModalOpen(false);
    };

    const sorted = [...data].sort((a, b) => b.ngay.localeCompare(a.ngay));

    const columns: ColumnsType<ChiSoSucKhoe> = [
        {
            title: 'Ngày', dataIndex: 'ngay', key: 'ngay', width: 120,
            render: v => <Text style={{ fontSize: 13 }}>{moment(v).format('DD/MM/YYYY')}</Text>,
            sorter: (a, b) => a.ngay.localeCompare(b.ngay),
        },
        { title: 'Cân nặng (kg)', dataIndex: 'canNang', key: 'canNang', width: 130, align: 'center', render: v => <Text strong style={{ color: '#667eea' }}>{v} kg</Text> },
        { title: 'Chiều cao (cm)', dataIndex: 'chieuCao', key: 'chieuCao', width: 130, align: 'center', render: v => <Text>{v} cm</Text> },
        {
            title: 'BMI', key: 'bmi', width: 160, align: 'center',
            render: (_, r) => {
                const bmi = tinhBMI(r.canNang, r.chieuCao);
                const { text, color } = phanLoaiBMI(bmi);
                return (
                    <Space>
                        <Text strong>{bmi}</Text>
                        <Tag color={color} style={{ borderRadius: 8, margin: 0 }}>{text}</Tag>
                    </Space>
                );
            },
        },
        { title: 'Nhịp tim (bpm)', dataIndex: 'nhipTim', key: 'nhipTim', width: 130, align: 'center', render: v => <Text style={{ color: '#f5576c' }}>❤️ {v} bpm</Text> },
        { title: 'Giờ ngủ', dataIndex: 'gioNgu', key: 'gioNgu', width: 110, align: 'center', render: v => <Text>😴 {v}h</Text> },
        {
            title: 'Thao tác', key: 'action', width: 100, align: 'center',
            render: (_, r) => (
                <Space>
                    <Button type="text" icon={<EditOutlined />} onClick={() => openEdit(r)} style={{ color: '#667eea' }} />
                    <Popconfirm title="Xóa chỉ số này?" onConfirm={() => handleDelete(r.id)} okText="Xóa" cancelText="Hủy" okButtonProps={{ danger: true }}>
                        <Button type="text" icon={<DeleteOutlined />} danger />
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    return (
        <div style={{ padding: 24, background: '#f0f2f5', minHeight: '100vh' }}>
            <Card bordered={false} style={{ borderRadius: 16, boxShadow: '0 4px 16px rgba(0,0,0,0.08)', marginBottom: 20 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
                    <Title level={3} style={{ margin: 0 }}>📊 Nhật ký chỉ số sức khỏe</Title>
                    <Button type="primary" icon={<PlusOutlined />} onClick={openAdd} style={{ background: 'linear-gradient(135deg,#f093fb,#f5576c)', border: 'none', borderRadius: 8 }}>
                        Thêm chỉ số
                    </Button>
                </div>
            </Card>

            <Card bordered={false} style={{ borderRadius: 16, boxShadow: '0 4px 16px rgba(0,0,0,0.08)', marginBottom: 20 }}>
                <Text strong style={{ display: 'block', marginBottom: 10 }}>📋 Bảng phân loại BMI:</Text>
                <Space wrap>
                    <Tag color="blue" style={{ borderRadius: 8, padding: '3px 10px' }}>Thiếu cân: BMI &lt; 18.5</Tag>
                    <Tag color="green" style={{ borderRadius: 8, padding: '3px 10px' }}>Bình thường: 18.5 – 24.9</Tag>
                    <Tag color="orange" style={{ borderRadius: 8, padding: '3px 10px' }}>Thừa cân: 25 – 29.9</Tag>
                    <Tag color="red" style={{ borderRadius: 8, padding: '3px 10px' }}>Béo phì: ≥ 30</Tag>
                </Space>
            </Card>

            <Card bordered={false} style={{ borderRadius: 16, boxShadow: '0 4px 16px rgba(0,0,0,0.08)' }}>
                <Table<ChiSoSucKhoe> columns={columns} dataSource={sorted} rowKey="id"
                    pagination={{ pageSize: 10, showTotal: t => `Tổng ${t} bản ghi`, showSizeChanger: false }}
                    scroll={{ x: 700 }} />
            </Card>

            <Modal title={editing ? '✏️ Sửa chỉ số sức khỏe' : '➕ Thêm chỉ số sức khỏe'} open={modalOpen} onOk={handleOk} onCancel={() => setModalOpen(false)}
                okText={editing ? 'Cập nhật' : 'Thêm'} cancelText="Hủy" width={480}
                okButtonProps={{ style: { background: 'linear-gradient(135deg,#f093fb,#f5576c)', border: 'none' } }}>
                <Form form={form} layout="vertical" style={{ marginTop: 16 }}>
                    <Form.Item name="ngay" label="Ngày" rules={[{ required: true, message: 'Chọn ngày' }]}>
                        <DatePicker style={{ width: '100%', borderRadius: 8 }} format="DD/MM/YYYY" />
                    </Form.Item>
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item name="canNang" label="Cân nặng (kg)" rules={[{ required: true, message: 'Nhập cân nặng' }]}>
                                <InputNumber min={20} max={300} step={0.1} style={{ width: '100%', borderRadius: 8 }} placeholder="70.5" />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item name="chieuCao" label="Chiều cao (cm)" rules={[{ required: true, message: 'Nhập chiều cao' }]}>
                                <InputNumber min={100} max={250} style={{ width: '100%', borderRadius: 8 }} placeholder="175" />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item name="nhipTim" label="Nhịp tim lúc nghỉ (bpm)" rules={[{ required: true, message: 'Nhập nhịp tim' }]}>
                                <InputNumber min={30} max={200} style={{ width: '100%', borderRadius: 8 }} placeholder="65" />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item name="gioNgu" label="Giờ ngủ" rules={[{ required: true, message: 'Nhập giờ ngủ' }]}>
                                <InputNumber min={0} max={24} step={0.5} style={{ width: '100%', borderRadius: 8 }} placeholder="7.5" />
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
            </Modal>
        </div>
    );
};

export default NhatKyChiSo;
