import React, { useEffect, useState } from 'react';
import { Row, Col, Card, Button, Modal, Form, Input, Select, InputNumber, Tag, Space, Popconfirm, Typography, Divider } from 'antd';
import {
    PlusOutlined, EditOutlined, DeleteOutlined, SearchOutlined, FireOutlined,
    TeamOutlined, ReloadOutlined, StarOutlined, ThunderboltOutlined, AimOutlined,
    BookOutlined, TrophyOutlined, OrderedListOutlined,
} from '@ant-design/icons';
import {
    BaiTap, NhomCo, MucDoKho, STORAGE_KEYS, getFromStorage, saveToStorage, seedBaiTap, generateId, normalizeStr, MUC_DO_COLOR
} from '../types';

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;

const NHOM_CO_OPTIONS: NhomCo[] = ['Chest', 'Back', 'Legs', 'Shoulders', 'Arms', 'Core', 'Full Body'];
const MUC_DO_OPTIONS: MucDoKho[] = ['De', 'Trung binh', 'Kho'];
const MUC_DO_LABEL: Record<MucDoKho, string> = { De: 'Dễ', 'Trung binh': 'Trung bình', Kho: 'Khó' };

const NHOM_CO_ICON: Record<NhomCo, React.ReactNode> = {
    Chest: <ThunderboltOutlined style={{ color: '#667eea' }} />,
    Back: <ReloadOutlined style={{ color: '#764ba2' }} />,
    Legs: <AimOutlined style={{ color: '#f5576c' }} />,
    Shoulders: <TrophyOutlined style={{ color: '#f093fb' }} />,
    Arms: <StarOutlined style={{ color: '#4facfe' }} />,
    Core: <AimOutlined style={{ color: '#43e97b' }} />,
    'Full Body': <FireOutlined style={{ color: '#ff6b35' }} />,
};

const ThuVienBaiTap: React.FC = () => {
    const [data, setData] = useState<BaiTap[]>([]);
    const [search, setSearch] = useState('');
    const [filterNhom, setFilterNhom] = useState('');
    const [filterMucDo, setFilterMucDo] = useState('');
    const [modalOpen, setModalOpen] = useState(false);
    const [detailModal, setDetailModal] = useState<BaiTap | null>(null);
    const [editing, setEditing] = useState<BaiTap | null>(null);
    const [form] = Form.useForm();

    const load = () => {
        const stored = getFromStorage<BaiTap[]>(STORAGE_KEYS.BAI_TAP, []);
        setData(stored.length ? stored : (() => { saveToStorage(STORAGE_KEYS.BAI_TAP, seedBaiTap); return seedBaiTap; })());
    };
    useEffect(() => { load(); }, []);

    const save = (list: BaiTap[]) => { saveToStorage(STORAGE_KEYS.BAI_TAP, list); setData(list); };
    const openAdd = () => { setEditing(null); form.resetFields(); setModalOpen(true); };
    const openEdit = (r: BaiTap) => { setEditing(r); form.setFieldsValue({ ...r }); setModalOpen(true); };
    const handleDelete = (id: string) => save(data.filter(d => d.id !== id));

    const handleOk = async () => {
        const vals = await form.validateFields();
        if (editing) {
            save(data.map(d => d.id === editing.id ? { ...d, ...vals } : d));
        } else {
            save([...data, { id: generateId('BTP', data.map(d => d.id)), ...vals }]);
        }
        setModalOpen(false);
    };

    const filtered = data.filter(d => {
        const matchSearch = search ? normalizeStr(d.ten).includes(normalizeStr(search)) : true;
        const matchNhom = filterNhom ? d.nhomCo === filterNhom : true;
        const matchMucDo = filterMucDo ? d.mucDo === filterMucDo : true;
        return matchSearch && matchNhom && matchMucDo;
    });

    return (
        <div style={{ padding: 24, background: '#f0f2f5', minHeight: '100vh' }}>
            <Card bordered={false} style={{ borderRadius: 16, boxShadow: '0 4px 16px rgba(0,0,0,0.08)', marginBottom: 20 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12, marginBottom: 16 }}>
                    <Title level={3} style={{ margin: 0, display: 'flex', alignItems: 'center', gap: 10 }}>
                        <BookOutlined style={{ color: '#4facfe' }} /> Thư viện bài tập
                    </Title>
                    <Button type="primary" icon={<PlusOutlined />} onClick={openAdd} style={{ background: 'linear-gradient(135deg,#4facfe,#00f2fe)', border: 'none', borderRadius: 8, color: '#1a365d' }}>
                        Thêm bài tập
                    </Button>
                </div>
                <Row gutter={[12, 12]}>
                    <Col xs={24} sm={10}>
                        <Input prefix={<SearchOutlined />} placeholder="Tìm kiếm bài tập..." value={search} onChange={e => setSearch(e.target.value)} allowClear style={{ borderRadius: 8 }} />
                    </Col>
                    <Col xs={24} sm={7}>
                        <Select placeholder="Nhóm cơ" allowClear style={{ width: '100%' }} value={filterNhom || undefined} onChange={v => setFilterNhom(v || '')}>
                            {NHOM_CO_OPTIONS.map(n => (
                                <Option key={n} value={n}>
                                    <Space size={6}>{NHOM_CO_ICON[n]} {n}</Space>
                                </Option>
                            ))}
                        </Select>
                    </Col>
                    <Col xs={24} sm={7}>
                        <Select placeholder="Mức độ khó" allowClear style={{ width: '100%' }} value={filterMucDo || undefined} onChange={v => setFilterMucDo(v || '')}>
                            {MUC_DO_OPTIONS.map(m => <Option key={m} value={m}><Tag color={MUC_DO_COLOR[m]}>{MUC_DO_LABEL[m]}</Tag></Option>)}
                        </Select>
                    </Col>
                </Row>
                <Text type="secondary" style={{ fontSize: 12, marginTop: 8, display: 'block' }}>Hiển thị {filtered.length} / {data.length} bài tập</Text>
            </Card>

            <Row gutter={[20, 20]}>
                {filtered.map(bt => (
                    <Col xs={24} sm={12} xl={8} key={bt.id}>
                        <Card hoverable bordered={false} style={{ borderRadius: 16, boxShadow: '0 4px 16px rgba(0,0,0,0.08)', height: '100%', cursor: 'pointer' }}
                            bodyStyle={{ padding: 20 }} onClick={() => setDetailModal(bt)}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                                <div>
                                    <div style={{ fontSize: 22, marginBottom: 4 }}>{NHOM_CO_ICON[bt.nhomCo]}</div>
                                    <Title level={5} style={{ margin: 0 }}>{bt.ten}</Title>
                                </div>
                                <Tag color={MUC_DO_COLOR[bt.mucDo]} style={{ borderRadius: 8, marginTop: 0, fontSize: 12 }}>{MUC_DO_LABEL[bt.mucDo]}</Tag>
                            </div>

                            <Tag color="geekblue" style={{ borderRadius: 6, marginBottom: 8 }}>{bt.nhomCo}</Tag>

                            <Paragraph type="secondary" style={{ fontSize: 12, marginBottom: 10 }} ellipsis={{ rows: 2 }}>
                                {bt.moTa}
                            </Paragraph>

                            <Divider style={{ margin: '10px 0' }} />

                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                                    <FireOutlined style={{ color: '#f5576c', fontSize: 14 }} />
                                    <Text style={{ fontSize: 13, color: '#f5576c', fontWeight: 600 }}>{bt.caloDotTrungBinhGio} kcal/giờ</Text>
                                </div>
                                <Space onClick={e => e.stopPropagation()}>
                                    <Button type="text" size="small" icon={<EditOutlined />} onClick={() => openEdit(bt)} style={{ color: '#667eea' }} />
                                    <Popconfirm title="Xóa bài tập này?" onConfirm={() => handleDelete(bt.id)} okText="Xóa" cancelText="Hủy" okButtonProps={{ danger: true }}>
                                        <Button type="text" size="small" icon={<DeleteOutlined />} danger />
                                    </Popconfirm>
                                </Space>
                            </div>
                        </Card>
                    </Col>
                ))}
            </Row>

            <Modal
                title={
                    detailModal ? (
                        <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <OrderedListOutlined style={{ color: '#4facfe' }} /> {detailModal.ten}
                        </span>
                    ) : ''
                }
                open={!!detailModal} onCancel={() => setDetailModal(null)} footer={null} width={560}>
                {detailModal && (
                    <div>
                        <Space wrap style={{ marginBottom: 12 }}>
                            <Tag color="geekblue" style={{ borderRadius: 8 }}>{detailModal.nhomCo}</Tag>
                            <Tag color={MUC_DO_COLOR[detailModal.mucDo]} style={{ borderRadius: 8 }}>{MUC_DO_LABEL[detailModal.mucDo]}</Tag>
                            <Tag color="volcano" icon={<FireOutlined />} style={{ borderRadius: 8 }}>{detailModal.caloDotTrungBinhGio} kcal/giờ</Tag>
                        </Space>
                        <Paragraph style={{ fontSize: 14 }}>{detailModal.moTa}</Paragraph>
                        <Divider orientation="left" style={{ fontWeight: 600 }}>Hướng dẫn thực hiện</Divider>
                        <div style={{ background: '#f8fafc', borderRadius: 8, padding: 16 }}>
                            {detailModal.huongDan.split('\n').map((line, i) => (
                                <p key={i} style={{ margin: '4px 0', fontSize: 13, lineHeight: 1.7 }}>
                                    {line.startsWith('*') ? <strong>{line}</strong> : line}
                                </p>
                            ))}
                        </div>
                    </div>
                )}
            </Modal>

            <Modal
                title={
                    <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        {editing ? <EditOutlined style={{ color: '#4facfe' }} /> : <PlusOutlined style={{ color: '#4facfe' }} />}
                        {editing ? 'Sửa bài tập' : 'Thêm bài tập mới'}
                    </span>
                }
                open={modalOpen} onOk={handleOk} onCancel={() => setModalOpen(false)}
                okText={editing ? 'Cập nhật' : 'Thêm'} cancelText="Hủy" width={560}
                okButtonProps={{ style: { background: 'linear-gradient(135deg,#4facfe,#00f2fe)', border: 'none', color: '#1a365d' } }}>
                <Form form={form} layout="vertical" style={{ marginTop: 16 }}>
                    <Form.Item name="ten" label="Tên bài tập" rules={[{ required: true, message: 'Nhập tên bài tập' }]}>
                        <Input placeholder="VD: Bench Press" style={{ borderRadius: 8 }} />
                    </Form.Item>
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item name="nhomCo" label="Nhóm cơ" rules={[{ required: true, message: 'Chọn nhóm cơ' }]}>
                                <Select placeholder="Chọn nhóm cơ" style={{ borderRadius: 8 }}>
                                    {NHOM_CO_OPTIONS.map(n => (
                                        <Option key={n} value={n}>
                                            <Space size={6}>{NHOM_CO_ICON[n]} {n}</Space>
                                        </Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item name="mucDo" label="Mức độ" rules={[{ required: true, message: 'Chọn mức độ' }]}>
                                <Select placeholder="Chọn mức độ" style={{ borderRadius: 8 }}>
                                    {MUC_DO_OPTIONS.map(m => <Option key={m} value={m}>{MUC_DO_LABEL[m]}</Option>)}
                                </Select>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Form.Item name="caloDotTrungBinhGio" label="Calo đốt trung bình/giờ (kcal)" rules={[{ required: true, message: 'Nhập calo' }]}>
                        <InputNumber min={50} max={1500} style={{ width: '100%', borderRadius: 8 }} />
                    </Form.Item>
                    <Form.Item name="moTa" label="Mô tả ngắn" rules={[{ required: true, message: 'Nhập mô tả' }]}>
                        <Input.TextArea rows={2} placeholder="Mô tả ngắn về bài tập..." style={{ borderRadius: 8 }} />
                    </Form.Item>
                    <Form.Item name="huongDan" label="Hướng dẫn chi tiết" rules={[{ required: true, message: 'Nhập hướng dẫn' }]}>
                        <Input.TextArea rows={5} placeholder="Mỗi bước trên một dòng..." style={{ borderRadius: 8 }} />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default ThuVienBaiTap;
