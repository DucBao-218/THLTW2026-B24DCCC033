import React, { useEffect, useState } from 'react';
import { Row, Col, Card, Button, Drawer, Form, Input, Select, DatePicker, InputNumber, Tag, Space, Popconfirm, Typography, Progress, Badge, Radio, Tooltip } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, AimOutlined, CalendarOutlined, WarningOutlined } from '@ant-design/icons';
import moment from 'moment';
import {
    MucTieu, TrangThaiMucTieu, STORAGE_KEYS, getFromStorage, saveToStorage, seedMucTieu, generateId,
    LOAI_MUC_TIEU_OPTIONS, LOAI_MUC_TIEU_LABEL, TRANG_THAI_MUC_TIEU_COLOR, TRANG_THAI_MUC_TIEU_LABEL
} from '../types';

const { Title, Text } = Typography;
const { Option } = Select;

const PROGRESS_COLORS: Record<string, string> = {
    'dang-thuc-hien': '#667eea',
    'da-dat': '#52c41a',
    'da-huy': '#ff4d4f',
};

const MucTieuPage: React.FC = () => {
    const [data, setData] = useState<MucTieu[]>([]);
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [editing, setEditing] = useState<MucTieu | null>(null);
    const [form] = Form.useForm();
    const [filterTrangThai, setFilterTrangThai] = useState<string>('all');
    const [inlineValues, setInlineValues] = useState<Record<string, string>>({});

    const load = () => {
        const stored = getFromStorage<MucTieu[]>(STORAGE_KEYS.MUC_TIEU, []);
        setData(stored.length ? stored : (() => { saveToStorage(STORAGE_KEYS.MUC_TIEU, seedMucTieu); return seedMucTieu; })());
    };
    useEffect(() => { load(); }, []);

    const save = (list: MucTieu[]) => { saveToStorage(STORAGE_KEYS.MUC_TIEU, list); setData(list); };

    const openAdd = () => { setEditing(null); form.resetFields(); setDrawerOpen(true); };
    const openEdit = (r: MucTieu) => {
        setEditing(r);
        form.setFieldsValue({ ...r, deadline: moment(r.deadline) });
        setDrawerOpen(true);
    };
    const handleDelete = (id: string) => save(data.filter(d => d.id !== id));

    const handleSubmit = async () => {
        const vals = await form.validateFields();
        const deadline = (vals.deadline as moment.Moment).format('YYYY-MM-DD');
        if (editing) {
            save(data.map(d => d.id === editing.id ? { ...d, ...vals, deadline } : d));
        } else {
            const newItem: MucTieu = { id: generateId('MT', data.map(d => d.id)), ...vals, deadline };
            save([...data, newItem]);
        }
        setDrawerOpen(false);
    };

    const updateInline = (id: string) => {
        const val = parseFloat(inlineValues[id] || '0');
        if (isNaN(val)) return;
        const updated = data.map(d => {
            if (d.id !== id) return d;
            const pct = Math.min(100, (val / d.giaTriMucTieu) * 100);
            return { ...d, giaTriHienTai: val, trangThai: pct >= 100 ? 'da-dat' as TrangThaiMucTieu : d.trangThai };
        });
        save(updated);
        setInlineValues(prev => { const n = { ...prev }; delete n[id]; return n; });
    };

    const filtered = filterTrangThai === 'all' ? data : data.filter(d => d.trangThai === filterTrangThai);

    return (
        <div style={{ padding: 24, background: '#f0f2f5', minHeight: '100vh' }}>
            <Card bordered={false} style={{ borderRadius: 16, boxShadow: '0 4px 16px rgba(0,0,0,0.08)', marginBottom: 20 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
                    <Title level={3} style={{ margin: 0, display: 'flex', alignItems: 'center', gap: 10 }}>
                        <AimOutlined style={{ color: '#43e97b' }} /> Quản lý mục tiêu
                    </Title>
                    <Button type="primary" icon={<PlusOutlined />} onClick={openAdd} style={{ background: 'linear-gradient(135deg,#43e97b,#38f9d7)', border: 'none', borderRadius: 8, color: '#065f46' }}>
                        Thêm mục tiêu
                    </Button>
                </div>
                <div style={{ marginTop: 16 }}>
                    <Radio.Group value={filterTrangThai} onChange={e => setFilterTrangThai(e.target.value)} optionType="button" buttonStyle="solid">
                        <Radio.Button value="all">Tất cả ({data.length})</Radio.Button>
                        <Radio.Button value="dang-thuc-hien">Đang thực hiện ({data.filter(d => d.trangThai === 'dang-thuc-hien').length})</Radio.Button>
                        <Radio.Button value="da-dat">Đã đạt ({data.filter(d => d.trangThai === 'da-dat').length})</Radio.Button>
                        <Radio.Button value="da-huy">Đã hủy ({data.filter(d => d.trangThai === 'da-huy').length})</Radio.Button>
                    </Radio.Group>
                </div>
            </Card>

            <Row gutter={[20, 20]}>
                {filtered.map(mt => {
                    const pct = Math.min(100, Math.round((mt.giaTriHienTai / mt.giaTriMucTieu) * 100));
                    const isExpired = moment(mt.deadline).isBefore(moment(), 'day');
                    return (
                        <Col xs={24} sm={12} xl={8} key={mt.id}>
                            <Card bordered={false} style={{ borderRadius: 16, boxShadow: '0 4px 16px rgba(0,0,0,0.08)', height: '100%' }}
                                bodyStyle={{ padding: 20 }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                                    <div style={{ flex: 1, marginRight: 8 }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                                            <AimOutlined style={{ color: PROGRESS_COLORS[mt.trangThai], fontSize: 16 }} />
                                            <Text strong style={{ fontSize: 15 }}>{mt.ten}</Text>
                                        </div>
                                        <Space size={4} wrap>
                                            <Tag color="blue" style={{ borderRadius: 6, margin: 0 }}>{LOAI_MUC_TIEU_LABEL[mt.loai]}</Tag>
                                            <Badge status={TRANG_THAI_MUC_TIEU_COLOR[mt.trangThai] as any} text={<Text style={{ fontSize: 12 }}>{TRANG_THAI_MUC_TIEU_LABEL[mt.trangThai]}</Text>} />
                                        </Space>
                                    </div>
                                    <Space>
                                        <Button type="text" size="small" icon={<EditOutlined />} onClick={() => openEdit(mt)} style={{ color: '#667eea' }} />
                                        <Popconfirm title="Xóa mục tiêu này?" onConfirm={() => handleDelete(mt.id)} okText="Xóa" cancelText="Hủy" okButtonProps={{ danger: true }}>
                                            <Button type="text" size="small" icon={<DeleteOutlined />} danger />
                                        </Popconfirm>
                                    </Space>
                                </div>

                                {mt.moTa && <Text type="secondary" style={{ fontSize: 12, display: 'block', marginBottom: 12 }}>{mt.moTa}</Text>}

                                <div style={{ marginBottom: 10 }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                                        <Text style={{ fontSize: 13 }}>
                                            <Text strong style={{ color: PROGRESS_COLORS[mt.trangThai] }}>{mt.giaTriHienTai}</Text>
                                            <Text type="secondary"> / {mt.giaTriMucTieu} {mt.donVi}</Text>
                                        </Text>
                                        <Text strong style={{ color: PROGRESS_COLORS[mt.trangThai] }}>{pct}%</Text>
                                    </div>
                                    <Progress percent={pct} strokeColor={PROGRESS_COLORS[mt.trangThai]} trailColor="#f0f0f0" showInfo={false} strokeWidth={8} style={{ borderRadius: 8 }} />
                                </div>

                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 12 }}>
                                    <Text style={{ fontSize: 12, display: 'flex', alignItems: 'center', gap: 4 }} type={isExpired && mt.trangThai === 'dang-thuc-hien' ? 'danger' : 'secondary'}>
                                        {isExpired && mt.trangThai === 'dang-thuc-hien'
                                            ? <><WarningOutlined style={{ color: '#ff4d4f' }} /> {moment(mt.deadline).format('DD/MM/YYYY')}</>
                                            : <><CalendarOutlined /> {moment(mt.deadline).format('DD/MM/YYYY')}</>
                                        }
                                    </Text>
                                    {mt.trangThai === 'dang-thuc-hien' && (
                                        <div style={{ display: 'flex', gap: 4 }}>
                                            <Input
                                                size="small"
                                                style={{ width: 80, borderRadius: 6, fontSize: 12 }}
                                                placeholder={`${mt.giaTriHienTai}`}
                                                value={inlineValues[mt.id] !== undefined ? inlineValues[mt.id] : ''}
                                                onChange={e => setInlineValues(prev => ({ ...prev, [mt.id]: e.target.value }))}
                                                onPressEnter={() => updateInline(mt.id)}
                                            />
                                            <Button size="small" type="primary" onClick={() => updateInline(mt.id)} style={{ borderRadius: 6, background: '#667eea', border: 'none', fontSize: 11 }}>Cập nhật</Button>
                                        </div>
                                    )}
                                </div>
                            </Card>
                        </Col>
                    );
                })}
            </Row>

            <Drawer
                title={
                    <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        {editing ? <EditOutlined style={{ color: '#43e97b' }} /> : <PlusOutlined style={{ color: '#43e97b' }} />}
                        {editing ? 'Sửa mục tiêu' : 'Thêm mục tiêu mới'}
                    </span>
                }
                placement="right" width={420}
                open={drawerOpen} onClose={() => setDrawerOpen(false)}
                footer={
                    <div style={{ textAlign: 'right' }}>
                        <Button onClick={() => setDrawerOpen(false)} style={{ marginRight: 8 }}>Hủy</Button>
                        <Button type="primary" onClick={handleSubmit} style={{ background: 'linear-gradient(135deg,#43e97b,#38f9d7)', border: 'none', color: '#065f46' }}>
                            {editing ? 'Cập nhật' : 'Thêm'}
                        </Button>
                    </div>
                }>
                <Form form={form} layout="vertical">
                    <Form.Item name="ten" label="Tên mục tiêu" rules={[{ required: true, message: 'Nhập tên mục tiêu' }]}>
                        <Input placeholder="VD: Giảm 5kg trong 3 tháng" style={{ borderRadius: 8 }} />
                    </Form.Item>
                    <Form.Item name="loai" label="Loại mục tiêu" rules={[{ required: true, message: 'Chọn loại' }]}>
                        <Select placeholder="Chọn loại mục tiêu" style={{ borderRadius: 8 }}>
                            {LOAI_MUC_TIEU_OPTIONS.map(o => <Option key={o.value} value={o.value}>{o.label}</Option>)}
                        </Select>
                    </Form.Item>
                    <Row gutter={12}>
                        <Col span={10}>
                            <Form.Item name="giaTriMucTieu" label="Giá trị mục tiêu" rules={[{ required: true, message: 'Nhập giá trị' }]}>
                                <InputNumber min={0} style={{ width: '100%', borderRadius: 8 }} />
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item name="donVi" label="Đơn vị" rules={[{ required: true, message: 'Nhập đơn vị' }]}>
                                <Input placeholder="kg, buổi..." style={{ borderRadius: 8 }} />
                            </Form.Item>
                        </Col>
                        <Col span={6}>
                            <Form.Item name="giaTriHienTai" label="Hiện tại" initialValue={0}>
                                <InputNumber min={0} style={{ width: '100%', borderRadius: 8 }} />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Form.Item name="deadline" label="Deadline" rules={[{ required: true, message: 'Chọn deadline' }]}>
                        <DatePicker style={{ width: '100%', borderRadius: 8 }} format="DD/MM/YYYY" />
                    </Form.Item>
                    <Form.Item name="trangThai" label="Trạng thái" initialValue="dang-thuc-hien" rules={[{ required: true }]}>
                        <Select style={{ borderRadius: 8 }}>
                            <Option value="dang-thuc-hien">Đang thực hiện</Option>
                            <Option value="da-dat">Đã đạt</Option>
                            <Option value="da-huy">Đã hủy</Option>
                        </Select>
                    </Form.Item>
                    <Form.Item name="moTa" label="Mô tả">
                        <Input.TextArea rows={3} placeholder="Ghi chú thêm về mục tiêu..." style={{ borderRadius: 8 }} />
                    </Form.Item>
                </Form>
            </Drawer>
        </div>
    );
};

export default MucTieuPage;
