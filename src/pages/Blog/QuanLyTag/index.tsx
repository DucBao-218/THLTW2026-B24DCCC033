import React, { useState, useEffect } from 'react';
import {
    Table, Button, Input, Tag, Space, Typography, Card,
    Modal, Form, Select, Popconfirm, message, Tooltip, Badge, Row, Col,
} from 'antd';
import {
    PlusOutlined, EditOutlined, DeleteOutlined,
    TagOutlined, SearchOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import {
    TheTag, BaiViet, STORAGE_KEYS, getFromStorage, saveToStorage,
    seedTags, seedBaiViets, generateId, TAG_COLORS, normalizeStr, toSlug,
} from '../types';

const { Title, Text } = Typography;
const { Option } = Select;

const QuanLyTag: React.FC = () => {
    const [tags, setTags] = useState<TheTag[]>([]);
    const [baiViets, setBaiViets] = useState<BaiViet[]>([]);
    const [search, setSearch] = useState('');
    const [modalOpen, setModalOpen] = useState(false);
    const [editingTag, setEditingTag] = useState<TheTag | null>(null);
    const [form] = Form.useForm();

    useEffect(() => {
        const storedTags = getFromStorage<TheTag[]>(STORAGE_KEYS.THE_TAG, []);
        const tagList = storedTags.length ? storedTags : seedTags;
        if (!storedTags.length) saveToStorage(STORAGE_KEYS.THE_TAG, seedTags);
        setTags(tagList);

        const storedBV = getFromStorage<BaiViet[]>(STORAGE_KEYS.BAI_VIET, []);
        setBaiViets(storedBV.length ? storedBV : seedBaiViets);
    }, []);

    const saveTags = (list: TheTag[]) => {
        setTags(list);
        saveToStorage(STORAGE_KEYS.THE_TAG, list);
    };

    const getSoBaiViet = (tagId: string) =>
        baiViets.filter((b) => b.tagIds.includes(tagId)).length;

    const filtered = tags.filter((t) =>
        normalizeStr(t.ten).includes(normalizeStr(search)),
    );

    const openAdd = () => {
        setEditingTag(null);
        form.resetFields();
        form.setFieldValue('mauSac', 'blue');
        setModalOpen(true);
    };

    const openEdit = (tag: TheTag) => {
        setEditingTag(tag);
        form.setFieldsValue(tag);
        setModalOpen(true);
    };

    const handleDelete = (tag: TheTag) => {
        const soBai = getSoBaiViet(tag.id);
        if (soBai > 0) {
            message.warning(`Không thể xóa: thẻ đang được dùng trong ${soBai} bài viết!`);
            return;
        }
        saveTags(tags.filter((t) => t.id !== tag.id));
        message.success(`Đã xóa thẻ "${tag.ten}"`);
    };

    const handleSubmit = () => {
        form.validateFields().then((vals) => {
            const slug = vals.slug || toSlug(vals.ten);
            if (editingTag) {
                saveTags(tags.map((t) => t.id === editingTag.id ? { ...t, ...vals, slug } : t));
                message.success('Cập nhật thẻ thành công!');
            } else {
                const existingIds = tags.map((t) => t.id);
                const newTag: TheTag = {
                    id: generateId('TAG', existingIds),
                    ten: vals.ten.trim(),
                    slug,
                    mauSac: vals.mauSac,
                };
                saveTags([...tags, newTag]);
                message.success('Thêm thẻ thành công!');
            }
            setModalOpen(false);
        });
    };

    const otherNames = tags
        .filter((t) => !editingTag || t.id !== editingTag.id)
        .map((t) => normalizeStr(t.ten));

    const otherSlugs = tags
        .filter((t) => !editingTag || t.id !== editingTag.id)
        .map((t) => t.slug);

    const columns: ColumnsType<TheTag> = [
        {
            title: 'Thẻ',
            key: 'the',
            sorter: (a, b) => a.ten.localeCompare(b.ten),
            render: (_, r) => (
                <Tag color={r.mauSac} style={{ fontSize: 13, padding: '3px 12px', borderRadius: 20 }}>
                    #{r.ten}
                </Tag>
            ),
        },
        {
            title: 'Slug',
            dataIndex: 'slug',
            key: 'slug',
            render: (v) => (
                <Text type="secondary" style={{ fontFamily: 'monospace', fontSize: 12 }}>{v}</Text>
            ),
        },
        {
            title: 'Màu sắc',
            dataIndex: 'mauSac',
            key: 'mauSac',
            width: 100,
            render: (v) => (
                <Tag color={v} style={{ width: 60, textAlign: 'center' }}>{v}</Tag>
            ),
        },
        {
            title: 'Số bài viết',
            key: 'soBaiViet',
            width: 120,
            sorter: (a, b) => getSoBaiViet(a.id) - getSoBaiViet(b.id),
            render: (_, r) => {
                const n = getSoBaiViet(r.id);
                return (
                    <Badge
                        count={n}
                        showZero
                        color={n > 0 ? '#1677ff' : '#d9d9d9'}
                        overflowCount={999}
                    />
                );
            },
        },
        {
            title: 'Thao tác',
            key: 'action',
            width: 100,
            render: (_, record) => (
                <Space>
                    <Tooltip title="Sửa">
                        <Button size="small" icon={<EditOutlined />} onClick={() => openEdit(record)} />
                    </Tooltip>
                    <Popconfirm
                        title={
                            <div>
                                <div>{`Xóa thẻ "${record.ten}"?`}</div>
                                <div style={{ fontWeight: 'normal', marginTop: 4 }}>
                                    {getSoBaiViet(record.id) > 0
                                        ? `Thẻ đang được dùng trong ${getSoBaiViet(record.id)} bài viết, không thể xóa!`
                                        : 'Hành động không thể hoàn tác.'}
                                </div>
                            </div>
                        }
                        onConfirm={() => handleDelete(record)}
                        okText="Xóa" cancelText="Hủy"
                        okButtonProps={{ danger: true, disabled: getSoBaiViet(record.id) > 0 }}
                    >
                        <Tooltip title={getSoBaiViet(record.id) > 0 ? 'Đang được sử dụng' : 'Xóa'}>
                            <Button
                                size="small" danger icon={<DeleteOutlined />}
                                disabled={getSoBaiViet(record.id) > 0}
                            />
                        </Tooltip>
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    return (
        <div style={{ padding: 24 }}>
            <Card>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, flexWrap: 'wrap', gap: 12 }}>
                    <Space>
                        <TagOutlined style={{ color: '#1677ff', fontSize: 18 }} />
                        <Title level={4} style={{ margin: 0 }}>Quản lý thẻ tag</Title>
                        <Badge count={tags.length} showZero color="#1677ff" />
                    </Space>
                    <Button type="primary" icon={<PlusOutlined />} onClick={openAdd}>
                        Thêm thẻ
                    </Button>
                </div>

                <div style={{ padding: '12px 16px', background: '#f8fafc', borderRadius: 8, marginBottom: 16, border: '1px solid #e2e8f0' }}>
                    <Text type="secondary" style={{ fontSize: 12, display: 'block', marginBottom: 8 }}>Preview tất cả thẻ:</Text>
                    <Space wrap>
                        {tags.map((t) => (
                            <Tag key={t.id} color={t.mauSac} style={{ borderRadius: 20, padding: '2px 10px' }}>
                                #{t.ten}
                            </Tag>
                        ))}
                    </Space>
                </div>

                <Row gutter={[12, 12]} style={{ marginBottom: 16 }}>
                    <Col xs={24} sm={12}>
                        <Input
                            placeholder="Tìm kiếm thẻ..."
                            prefix={<SearchOutlined />}
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            allowClear
                        />
                    </Col>
                </Row>

                <Table
                    columns={columns}
                    dataSource={filtered}
                    rowKey="id"
                    pagination={{ defaultPageSize: 10, showSizeChanger: true, showTotal: (t) => `Tổng ${t} thẻ` }}
                    size="middle"
                />
            </Card>

            <Modal
                title={editingTag ? '✏️ Sửa thẻ tag' : '➕ Thêm thẻ tag mới'}
                open={modalOpen}
                onOk={handleSubmit}
                onCancel={() => setModalOpen(false)}
                width={480}
                okText={editingTag ? 'Cập nhật' : 'Thêm mới'}
                cancelText="Hủy"
                destroyOnClose
            >
                <Form form={form} layout="vertical" requiredMark="optional">
                    <Form.Item
                        label="Tên thẻ" name="ten"
                        rules={[
                            { required: true, message: 'Vui lòng nhập tên thẻ' },
                            { max: 30, message: 'Tối đa 30 ký tự' },
                            {
                                validator: (_, v) => {
                                    if (!v) return Promise.resolve();
                                    return otherNames.includes(normalizeStr(v.trim()))
                                        ? Promise.reject('Tên thẻ đã tồn tại!')
                                        : Promise.resolve();
                                },
                            },
                        ]}
                    >
                        <Input
                            placeholder="VD: ReactJS"
                            onChange={(e) => {
                                if (!editingTag) form.setFieldValue('slug', toSlug(e.target.value));
                            }}
                        />
                    </Form.Item>

                    <Form.Item
                        label="Slug" name="slug"
                        rules={[
                            { required: true, message: 'Bắt buộc' },
                            { pattern: /^[a-z0-9-]+$/, message: 'Chỉ chứa chữ thường, số, dấu -' },
                            {
                                validator: (_, v) =>
                                    v && otherSlugs.includes(v)
                                        ? Promise.reject('Slug đã tồn tại!')
                                        : Promise.resolve(),
                            },
                        ]}
                    >
                        <Input placeholder="vd: reactjs" />
                    </Form.Item>

                    <Form.Item label="Màu sắc" name="mauSac" rules={[{ required: true }]}>
                        <Select placeholder="Chọn màu">
                            {TAG_COLORS.map((c) => (
                                <Option key={c} value={c}>
                                    <Tag color={c} style={{ margin: 0 }}>{c}</Tag>
                                </Option>
                            ))}
                        </Select>
                    </Form.Item>

                    <Form.Item noStyle shouldUpdate>
                        {({ getFieldValue }) => {
                            const ten = getFieldValue('ten');
                            const mau = getFieldValue('mauSac');
                            if (!ten) return null;
                            return (
                                <Form.Item label="Preview">
                                    <Tag color={mau} style={{ borderRadius: 20, padding: '4px 14px', fontSize: 14 }}>
                                        #{ten}
                                    </Tag>
                                </Form.Item>
                            );
                        }}
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default QuanLyTag;