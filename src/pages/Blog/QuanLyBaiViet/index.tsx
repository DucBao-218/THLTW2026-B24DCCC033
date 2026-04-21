import React, { useState, useEffect } from 'react';
import {
    Table, Button, Input, Select, Tag, Space, Typography, Card,
    Modal, Form, Popconfirm, message, Tooltip, Row, Col,
    Divider, Statistic,
} from 'antd';
import {
    PlusOutlined, EditOutlined, DeleteOutlined, SearchOutlined,
    EyeOutlined, BookOutlined, CheckCircleOutlined, FileTextOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import { history } from 'umi';
import {
    BaiViet, TheTag, TrangThaiBaiViet, STORAGE_KEYS,
    getFromStorage, saveToStorage, seedBaiViets, seedTags,
    generateId, normalizeStr, toSlug,
} from '../types';

const { Title, Text } = Typography;
const { TextArea } = Input;
const { Option } = Select;

const TRANG_THAI_CONFIG = {
    'da-dang': { label: 'Đã đăng', color: 'success' },
    'nhap': { label: 'Nháp', color: 'default' },
};

const QuanLyBaiViet: React.FC = () => {
    const [baiViets, setBaiViets] = useState<BaiViet[]>([]);
    const [tags, setTags] = useState<TheTag[]>([]);
    const [search, setSearch] = useState('');
    const [filterTT, setFilterTT] = useState<TrangThaiBaiViet | ''>('');
    const [modalOpen, setModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<BaiViet | null>(null);
    const [form] = Form.useForm();

    useEffect(() => {
        load();
    }, []);

    const load = () => {
        const storedTags = getFromStorage<TheTag[]>(STORAGE_KEYS.THE_TAG, []);
        const tagList = storedTags.length ? storedTags : seedTags;
        if (!storedTags.length) saveToStorage(STORAGE_KEYS.THE_TAG, seedTags);
        setTags(tagList);

        const stored = getFromStorage<BaiViet[]>(STORAGE_KEYS.BAI_VIET, []);
        if (!stored.length) {
            saveToStorage(STORAGE_KEYS.BAI_VIET, seedBaiViets);
            setBaiViets(seedBaiViets);
        } else {
            setBaiViets(stored);
        }
    };

    const save = (list: BaiViet[]) => {
        setBaiViets(list);
        saveToStorage(STORAGE_KEYS.BAI_VIET, list);
    };

    const filtered = baiViets
        .filter((b) => {
            const matchSearch = normalizeStr(b.tieuDe).includes(normalizeStr(search));
            const matchTT = filterTT ? b.trangThai === filterTT : true;
            return matchSearch && matchTT;
        })
        .sort((a, b) => b.ngayTao.localeCompare(a.ngayTao));

    const openAdd = () => {
        setEditingItem(null);
        form.resetFields();
        form.setFieldsValue({ trangThai: 'nhap', tacGia: 'Nguyễn Dev' });
        setModalOpen(true);
    };

    const openEdit = (item: BaiViet) => {
        setEditingItem(item);
        form.setFieldsValue({ ...item });
        setModalOpen(true);
    };

    const handleDelete = (id: string) => {
        save(baiViets.filter((b) => b.id !== id));
        message.success('Đã xóa bài viết');
    };

    const handleSubmit = () => {
        form.validateFields().then((vals) => {
            const now = dayjs().format('YYYY-MM-DD');
            if (editingItem) {
                const updated = baiViets.map((b) =>
                    b.id === editingItem.id
                        ? { ...b, ...vals, slug: vals.slug || toSlug(vals.tieuDe), ngayCapNhat: now }
                        : b,
                );
                save(updated);
                message.success('Cập nhật thành công!');
            } else {
                const existingIds = baiViets.map((b) => b.id);
                const newItem: BaiViet = {
                    id: generateId('BV', existingIds),
                    tieuDe: vals.tieuDe,
                    slug: vals.slug || toSlug(vals.tieuDe),
                    tomTat: vals.tomTat || '',
                    noiDung: vals.noiDung || '',
                    anhDaiDien: vals.anhDaiDien || 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=600&q=80',
                    tacGia: vals.tacGia || 'Lâm Đức Bảo',
                    tagIds: vals.tagIds || [],
                    trangThai: vals.trangThai,
                    luotXem: 0,
                    ngayTao: now,
                    ngayCapNhat: now,
                };
                save([...baiViets, newItem]);
                message.success('Thêm bài viết thành công!');
            }
            setModalOpen(false);
        });
    };

    const getTag = (id: string) => tags.find((t) => t.id === id);

    const otherSlugs = baiViets
        .filter((b) => !editingItem || b.id !== editingItem.id)
        .map((b) => b.slug);

    const otherTitles = baiViets
        .filter((b) => !editingItem || b.id !== editingItem.id)
        .map((b) => normalizeStr(b.tieuDe));

    const daDang = baiViets.filter((b) => b.trangThai === 'da-dang').length;
    const nhap = baiViets.filter((b) => b.trangThai === 'nhap').length;
    const tongXem = baiViets.reduce((s, b) => s + b.luotXem, 0);

    const columns: ColumnsType<BaiViet> = [
        {
            title: 'Tiêu đề',
            dataIndex: 'tieuDe',
            key: 'tieuDe',
            sorter: (a, b) => a.tieuDe.localeCompare(b.tieuDe),
            render: (v, r) => (
                <div>
                    <Text strong style={{ fontSize: 13 }}>{v}</Text>
                    <br />
                    <Text type="secondary" style={{ fontSize: 11, fontFamily: 'monospace' }}>/{r.slug}</Text>
                </div>
            ),
        },
        {
            title: 'Trạng thái',
            dataIndex: 'trangThai',
            key: 'trangThai',
            width: 120,
            filters: [
                { text: 'Đã đăng', value: 'da-dang' },
                { text: 'Nháp', value: 'nhap' },
            ],
            onFilter: (value, record) => record.trangThai === value,
            render: (v: TrangThaiBaiViet) => (
                <Tag color={TRANG_THAI_CONFIG[v].color}>{TRANG_THAI_CONFIG[v].label}</Tag>
            ),
        },
        {
            title: 'Thẻ',
            dataIndex: 'tagIds',
            key: 'tagIds',
            width: 200,
            render: (ids: string[]) => (
                <Space wrap size={4}>
                    {ids.slice(0, 3).map((id) => {
                        const tag = getTag(id);
                        return tag ? (
                            <Tag key={id} color={tag.mauSac} style={{ fontSize: 11, margin: 0, borderRadius: 10 }}>
                                {tag.ten}
                            </Tag>
                        ) : null;
                    })}
                    {ids.length > 3 && <Tag style={{ fontSize: 11, margin: 0 }}>+{ids.length - 3}</Tag>}
                </Space>
            ),
        },
        {
            title: 'Lượt xem',
            dataIndex: 'luotXem',
            key: 'luotXem',
            width: 110,
            sorter: (a, b) => a.luotXem - b.luotXem,
            render: (v) => (
                <Space>
                    <EyeOutlined style={{ color: '#94a3b8', fontSize: 12 }} />
                    <Text style={{ fontSize: 13 }}>{v.toLocaleString()}</Text>
                </Space>
            ),
        },
        {
            title: 'Ngày tạo',
            dataIndex: 'ngayTao',
            key: 'ngayTao',
            width: 110,
            sorter: (a, b) => a.ngayTao.localeCompare(b.ngayTao),
            render: (v) => <Text style={{ fontSize: 12 }}>{dayjs(v).format('DD/MM/YYYY')}</Text>,
        },
        {
            title: 'Thao tác',
            key: 'action',
            width: 130,
            fixed: 'right' as const,
            render: (_, record) => (
                <Space>
                    <Tooltip title="Xem bài viết">
                        <Button
                            size="small" icon={<EyeOutlined />}
                            disabled={record.trangThai === 'nhap'}
                            onClick={() => history.push(`/blog/bai-viet/${record.slug}`)}
                        />
                    </Tooltip>
                    <Tooltip title="Sửa">
                        <Button size="small" icon={<EditOutlined />} onClick={() => openEdit(record)} />
                    </Tooltip>
                    <Popconfirm
                        title="Xóa bài viết này?"
                        onConfirm={() => handleDelete(record.id)}
                        okText="Xóa" cancelText="Hủy"
                        okButtonProps={{ danger: true }}
                    >
                        <Tooltip title="Xóa">
                            <Button size="small" danger icon={<DeleteOutlined />} />
                        </Tooltip>
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    return (
        <div style={{ padding: 24 }}>
            <Row gutter={[16, 16]} style={{ marginBottom: 20 }}>
                <Col xs={8}>
                    <Card size="small" style={{ background: '#e6f4ff', border: '1px solid #91caff' }}>
                        <Statistic title={<Text style={{ color: '#1677ff', fontSize: 12 }}>Tổng bài viết</Text>} value={baiViets.length}
                            valueStyle={{ color: '#1677ff', fontSize: 22 }} prefix={<BookOutlined />} />
                    </Card>
                </Col>
                <Col xs={8}>
                    <Card size="small" style={{ background: '#f6ffed', border: '1px solid #b7eb8f' }}>
                        <Statistic title={<Text style={{ color: '#52c41a', fontSize: 12 }}>Đã đăng</Text>} value={daDang}
                            valueStyle={{ color: '#52c41a', fontSize: 22 }} prefix={<CheckCircleOutlined />} />
                    </Card>
                </Col>
                <Col xs={8}>
                    <Card size="small" style={{ background: '#fafafa', border: '1px solid #d9d9d9' }}>
                        <Statistic title={<Text style={{ color: '#888', fontSize: 12 }}>Nháp</Text>} value={nhap}
                            valueStyle={{ color: '#888', fontSize: 22 }} prefix={<FileTextOutlined />} />
                    </Card>
                </Col>
            </Row>

            <Card>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, flexWrap: 'wrap', gap: 12 }}>
                    <Title level={4} style={{ margin: 0 }}>Quản lý bài viết</Title>
                    <Button type="primary" icon={<PlusOutlined />} onClick={openAdd}>Thêm bài viết</Button>
                </div>

                <Row gutter={[12, 12]} style={{ marginBottom: 16 }}>
                    <Col xs={24} sm={14}>
                        <Input
                            placeholder="Tìm theo tiêu đề (không cần dấu)..."
                            prefix={<SearchOutlined />}
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            allowClear
                        />
                    </Col>
                    <Col xs={24} sm={6}>
                        <Select
                            placeholder="Lọc trạng thái"
                            style={{ width: '100%' }}
                            allowClear
                            value={filterTT || undefined}
                            onChange={(v) => setFilterTT((v as TrangThaiBaiViet) || '')}
                        >
                            <Option value="da-dang"><Tag color="success">Đã đăng</Tag></Option>
                            <Option value="nhap"><Tag color="default">Nháp</Tag></Option>
                        </Select>
                    </Col>
                    {(search || filterTT) && (
                        <Col xs={24} sm={4}>
                            <Button block onClick={() => { setSearch(''); setFilterTT(''); }}>Xóa lọc</Button>
                        </Col>
                    )}
                </Row>

                <Text type="secondary" style={{ fontSize: 12, display: 'block', marginBottom: 8 }}>
                    Hiển thị <strong>{filtered.length}</strong> / {baiViets.length} bài viết
                </Text>

                <Table
                    columns={columns}
                    dataSource={filtered}
                    rowKey="id"
                    scroll={{ x: 800 }}
                    pagination={{ defaultPageSize: 8, showSizeChanger: true, pageSizeOptions: ['5', '8', '15', '30'], showTotal: (t) => `Tổng ${t} bài` }}
                    size="middle"
                />
            </Card>

            <Modal
                title={editingItem ? 'Sửa bài viết' : 'Thêm bài viết mới'}
                open={modalOpen}
                onOk={handleSubmit}
                onCancel={() => setModalOpen(false)}
                width={760}
                okText={editingItem ? 'Cập nhật' : 'Thêm mới'}
                cancelText="Hủy"
                destroyOnClose
            >
                <Form form={form} layout="vertical" requiredMark="optional">
                    <Form.Item
                        label="Tiêu đề" name="tieuDe"
                        rules={[
                            { required: true, message: 'Vui lòng nhập tiêu đề' },
                            { max: 200, message: 'Tối đa 200 ký tự' },
                            {
                                validator: (_, v) => {
                                    if (!v) return Promise.resolve();
                                    return otherTitles.includes(normalizeStr(v.trim()))
                                        ? Promise.reject('Tiêu đề đã tồn tại!')
                                        : Promise.resolve();
                                },
                            },
                        ]}
                    >
                        <Input
                            placeholder="Nhập tiêu đề bài viết"
                            onChange={(e) => {
                                if (!editingItem) {
                                    form.setFieldValue('slug', toSlug(e.target.value));
                                }
                            }}
                        />
                    </Form.Item>

                    <Row gutter={16}>
                        <Col span={14}>
                            <Form.Item
                                label="Slug (URL)" name="slug"
                                rules={[
                                    { required: true, message: 'Vui lòng nhập slug' },
                                    { pattern: /^[a-z0-9-]+$/, message: 'Chỉ chứa chữ thường, số và dấu -' },
                                    {
                                        validator: (_, v) => {
                                            if (!v) return Promise.resolve();
                                            return otherSlugs.includes(v)
                                                ? Promise.reject('Slug đã tồn tại!')
                                                : Promise.resolve();
                                        },
                                    },
                                ]}
                            >
                                <Input prefix={<Text type="secondary">/blog/bai-viet/</Text>} placeholder="ten-bai-viet" />
                            </Form.Item>
                        </Col>
                        <Col span={10}>
                            <Form.Item label="Trạng thái" name="trangThai" rules={[{ required: true }]}>
                                <Select>
                                    <Option value="nhap"><Tag color="default">Nháp</Tag></Option>
                                    <Option value="da-dang"><Tag color="success">Đã đăng</Tag></Option>
                                </Select>
                            </Form.Item>
                        </Col>
                    </Row>

                    <Form.Item label="Ảnh đại diện (URL)" name="anhDaiDien">
                        <Input placeholder="https://images.unsplash.com/..." />
                    </Form.Item>

                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item label="Tác giả" name="tacGia" rules={[{ required: true }]}>
                                <Input placeholder="Tên tác giả" />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item label="Thẻ tag" name="tagIds">
                                <Select mode="multiple" placeholder="Chọn thẻ tag" optionFilterProp="label">
                                    {tags.map((t) => (
                                        <Option key={t.id} value={t.id} label={t.ten}>
                                            <Tag color={t.mauSac} style={{ margin: 0 }}>#{t.ten}</Tag>
                                        </Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Col>
                    </Row>

                    <Form.Item label="Tóm tắt" name="tomTat">
                        <TextArea rows={2} placeholder="Mô tả ngắn bài viết (hiển thị ở trang chủ)..." showCount maxLength={300} />
                    </Form.Item>

                    <Form.Item label={<Space>Nội dung <Text type="secondary" style={{ fontSize: 11 }}>(Markdown)</Text></Space>} name="noiDung">
                        <TextArea
                            rows={10}
                            placeholder={`# Tiêu đề\n\n## Mục 1\n\nNội dung...\n\n\`\`\`js\nconsole.log('Hello')\n\`\`\``}
                            style={{ fontFamily: 'monospace', fontSize: 13 }}
                        />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default QuanLyBaiViet;