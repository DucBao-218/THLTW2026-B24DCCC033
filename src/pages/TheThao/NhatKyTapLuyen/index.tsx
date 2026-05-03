import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, Form, Input, Select, DatePicker, InputNumber, Tag, Space, Popconfirm, Typography, Row, Col, Card } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, SearchOutlined, CheckCircleOutlined, CloseCircleOutlined, FileTextOutlined } from '@ant-design/icons';
import moment from 'moment';
import type { ColumnsType } from 'antd/es/table';
import { BuoiTap, LoaiBaiTap, STORAGE_KEYS, getFromStorage, saveToStorage, seedBuoiTap, generateId, normalizeStr, LOAI_BAI_TAP_OPTIONS, LOAI_BAI_TAP_COLOR } from '../types';

const { Title, Text } = Typography;
const { Option } = Select;
const { RangePicker } = DatePicker;

const NhatKyTapLuyen: React.FC = () => {
    const [data, setData] = useState<BuoiTap[]>([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [editing, setEditing] = useState<BuoiTap | null>(null);
    const [form] = Form.useForm();
    const [search, setSearch] = useState('');
    const [filterLoai, setFilterLoai] = useState<string>('');
    const [filterRange, setFilterRange] = useState<[moment.Moment, moment.Moment] | null>(null);

    const load = () => {
        const stored = getFromStorage<BuoiTap[]>(STORAGE_KEYS.BUOI_TAP, []);
        setData(stored.length ? stored : (() => { saveToStorage(STORAGE_KEYS.BUOI_TAP, seedBuoiTap); return seedBuoiTap; })());
    };

    useEffect(() => { load(); }, []);

    const save = (list: BuoiTap[]) => { saveToStorage(STORAGE_KEYS.BUOI_TAP, list); setData(list); };

    const openAdd = () => { setEditing(null); form.resetFields(); setModalOpen(true); };
    const openEdit = (r: BuoiTap) => {
        setEditing(r);
        form.setFieldsValue({ ...r, ngay: moment(r.ngay) });
        setModalOpen(true);
    };
    const handleDelete = (id: string) => save(data.filter(d => d.id !== id));

    const handleOk = async () => {
        const vals = await form.validateFields();
        const ngay = (vals.ngay as moment.Moment).format('YYYY-MM-DD');
        if (editing) {
            save(data.map(d => d.id === editing.id ? { ...d, ...vals, ngay } : d));
        } else {
            const newItem: BuoiTap = { id: generateId('BT', data.map(d => d.id)), ...vals, ngay };
            save([...data, newItem]);
        }
        setModalOpen(false);
    };

    const filtered = data.filter(d => {
        const matchSearch = search ? normalizeStr(d.tenBaiTap).includes(normalizeStr(search)) : true;
        const matchLoai = filterLoai ? d.loaiBaiTap === filterLoai : true;
        const matchRange = filterRange ? (d.ngay >= filterRange[0].format('YYYY-MM-DD') && d.ngay <= filterRange[1].format('YYYY-MM-DD')) : true;
        return matchSearch && matchLoai && matchRange;
    }).sort((a, b) => b.ngay.localeCompare(a.ngay));

    const columns: ColumnsType<BuoiTap> = [
        { title: 'Ngày', dataIndex: 'ngay', key: 'ngay', width: 110, render: v => <Text style={{ fontSize: 13 }}>{moment(v).format('DD/MM/YYYY')}</Text>, sorter: (a, b) => a.ngay.localeCompare(b.ngay) },
        { title: 'Bài tập', dataIndex: 'tenBaiTap', key: 'tenBaiTap', render: v => <Text strong>{v}</Text> },
        { title: 'Loại', dataIndex: 'loaiBaiTap', key: 'loaiBaiTap', width: 110, render: v => <Tag color={LOAI_BAI_TAP_COLOR[v as LoaiBaiTap]} style={{ borderRadius: 8 }}>{v}</Tag> },
        { title: 'T.Lượng (phút)', dataIndex: 'thoiLuong', key: 'thoiLuong', width: 130, align: 'center', render: v => <Text>{v}'</Text> },
        { title: 'Calo', dataIndex: 'caloDot', key: 'caloDot', width: 90, align: 'center', render: v => <Text style={{ color: '#f5576c', fontWeight: 600 }}>{v}</Text> },
        { title: 'Ghi chú', dataIndex: 'ghiChu', key: 'ghiChu', ellipsis: true, render: v => <Text type="secondary" style={{ fontSize: 12 }}>{v || '—'}</Text> },
        {
            title: 'Trạng thái', dataIndex: 'trangThai', key: 'trangThai', width: 145,
            render: v => (
                <Tag
                    color={v === 'hoan-thanh' ? 'success' : 'error'}
                    icon={v === 'hoan-thanh' ? <CheckCircleOutlined /> : <CloseCircleOutlined />}
                    style={{ borderRadius: 8 }}>
                    {v === 'hoan-thanh' ? 'Hoàn thành' : 'Bỏ lỡ'}
                </Tag>
            )
        },
        {
            title: 'Thao tác', key: 'action', width: 100, align: 'center',
            render: (_, r) => (
                <Space>
                    <Button type="text" icon={<EditOutlined />} onClick={() => openEdit(r)} style={{ color: '#667eea' }} />
                    <Popconfirm title="Xóa buổi tập này?" onConfirm={() => handleDelete(r.id)} okText="Xóa" cancelText="Hủy" okButtonProps={{ danger: true }}>
                        <Button type="text" icon={<DeleteOutlined />} danger />
                    </Popconfirm>
                </Space>
            )
        },
    ];

    return (
        <div style={{ padding: 24, background: '#f0f2f5', minHeight: '100vh' }}>
            <Card bordered={false} style={{ borderRadius: 16, boxShadow: '0 4px 16px rgba(0,0,0,0.08)', marginBottom: 20 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
                    <Title level={3} style={{ margin: 0, display: 'flex', alignItems: 'center', gap: 10 }}>
                        <FileTextOutlined style={{ color: '#667eea' }} /> Nhật ký tập luyện
                    </Title>
                    <Button type="primary" icon={<PlusOutlined />} onClick={openAdd} style={{ background: 'linear-gradient(135deg,#667eea,#764ba2)', border: 'none', borderRadius: 8 }}>
                        Thêm buổi tập
                    </Button>
                </div>
            </Card>

            <Card bordered={false} style={{ borderRadius: 16, boxShadow: '0 4px 16px rgba(0,0,0,0.08)' }}>
                <Row gutter={[12, 12]} style={{ marginBottom: 16 }}>
                    <Col xs={24} sm={8}>
                        <Input prefix={<SearchOutlined />} placeholder="Tìm theo tên bài tập..." value={search} onChange={e => setSearch(e.target.value)} allowClear style={{ borderRadius: 8 }} />
                    </Col>
                    <Col xs={24} sm={6}>
                        <Select placeholder="Lọc theo loại" allowClear style={{ width: '100%', borderRadius: 8 }} value={filterLoai || undefined} onChange={v => setFilterLoai(v || '')}>
                            {LOAI_BAI_TAP_OPTIONS.map(o => <Option key={o.value} value={o.value}>{o.label}</Option>)}
                        </Select>
                    </Col>
                    <Col xs={24} sm={10}>
                        <RangePicker style={{ width: '100%', borderRadius: 8 }} placeholder={['Từ ngày', 'Đến ngày']} value={filterRange} onChange={v => setFilterRange(v as [moment.Moment, moment.Moment] | null)} />
                    </Col>
                </Row>

                <Table<BuoiTap> columns={columns} dataSource={filtered} rowKey="id" pagination={{ pageSize: 10, showTotal: t => `Tổng ${t} buổi tập`, showSizeChanger: false }}
                    style={{ borderRadius: 8 }} rowClassName={(_, i) => i % 2 === 0 ? '' : 'ant-table-row-alt'} />
            </Card>

            <Modal
                title={
                    <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        {editing ? <EditOutlined style={{ color: '#667eea' }} /> : <PlusOutlined style={{ color: '#667eea' }} />}
                        {editing ? 'Sửa buổi tập' : 'Thêm buổi tập mới'}
                    </span>
                }
                open={modalOpen} onOk={handleOk} onCancel={() => setModalOpen(false)}
                okText={editing ? 'Cập nhật' : 'Thêm'} cancelText="Hủy" width={520}
                okButtonProps={{ style: { background: 'linear-gradient(135deg,#667eea,#764ba2)', border: 'none' } }}>
                <Form form={form} layout="vertical" style={{ marginTop: 16 }}>
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item name="ngay" label="Ngày tập" rules={[{ required: true, message: 'Chọn ngày tập' }]}>
                                <DatePicker style={{ width: '100%', borderRadius: 8 }} format="DD/MM/YYYY" />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item name="loaiBaiTap" label="Loại bài tập" rules={[{ required: true, message: 'Chọn loại bài tập' }]}>
                                <Select placeholder="Chọn loại" style={{ borderRadius: 8 }}>
                                    {LOAI_BAI_TAP_OPTIONS.map(o => <Option key={o.value} value={o.value}>{o.label}</Option>)}
                                </Select>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Form.Item name="tenBaiTap" label="Tên bài tập" rules={[{ required: true, message: 'Nhập tên bài tập' }]}>
                        <Input placeholder="VD: Chạy bộ buổi sáng" style={{ borderRadius: 8 }} />
                    </Form.Item>
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item name="thoiLuong" label="Thời lượng (phút)" rules={[{ required: true, message: 'Nhập thời lượng' }]}>
                                <InputNumber min={1} max={300} style={{ width: '100%', borderRadius: 8 }} />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item name="caloDot" label="Calo đốt (kcal)" rules={[{ required: true, message: 'Nhập calo' }]}>
                                <InputNumber min={0} max={3000} style={{ width: '100%', borderRadius: 8 }} />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Form.Item name="ghiChu" label="Ghi chú">
                        <Input.TextArea rows={2} placeholder="Ghi chú thêm..." style={{ borderRadius: 8 }} />
                    </Form.Item>
                    <Form.Item name="trangThai" label="Trạng thái" rules={[{ required: true, message: 'Chọn trạng thái' }]}>
                        <Select placeholder="Chọn trạng thái" style={{ borderRadius: 8 }}>
                            <Option value="hoan-thanh"><CheckCircleOutlined style={{ color: '#52c41a', marginRight: 6 }} />Hoàn thành</Option>
                            <Option value="bo-lo"><CloseCircleOutlined style={{ color: '#ff4d4f', marginRight: 6 }} />Bỏ lỡ</Option>
                        </Select>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default NhatKyTapLuyen;
