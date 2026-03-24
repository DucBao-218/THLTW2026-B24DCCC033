import React, { useState } from 'react';
import { useModel } from 'umi';
import {
    Button, Table, Modal, Form, Input, InputNumber, DatePicker,
    Select, Space, Popconfirm, message, Tag, Descriptions,
} from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, EyeOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import type { VanBangItem } from '../../models/vanBang';
import dayjs from 'dayjs';

const { Option } = Select;

const DanhSachVanBang: React.FC = () => {
    const { soVanBang, quyetDinh, vanBang, setVanBang, addVanBang, cauHinh } = useModel('vanBang');

    const [open, setOpen] = useState(false);
    const [viewItem, setViewItem] = useState<VanBangItem | null>(null);
    const [editItem, setEditItem] = useState<VanBangItem | null>(null);
    const [filterQD, setFilterQD] = useState<string>('all');
    const [search, setSearch] = useState('');
    const [form] = Form.useForm();

    const getNextSoVaoSo = (quyetDinhId: string): number | string => {
        const qd = quyetDinh.find(q => q.id === quyetDinhId);
        if (!qd) return '—';
        const svb = soVanBang.find(s => s.id === qd.soVanBangId);
        return svb ? svb.soThuTu + 1 : '—';
    };

    const handleOpen = (item?: VanBangItem) => {
        setEditItem(item || null);
        if (item) {
            const fields: Record<string, any> = {
                soHieuVanBang: item.soHieuVanBang,
                maSV: item.maSV,
                hoTen: item.hoTen,
                ngaySinh: dayjs(item.ngaySinh),
                quyetDinhId: item.quyetDinhId,
            };
            cauHinh.forEach(c => {
                const rawVal = item.extraFields?.[c.id];
                fields[`extra_${c.id}`] = c.kieuDuLieu === 'Date' && rawVal ? dayjs(rawVal) : rawVal ?? '';
            });
            form.setFieldsValue(fields);
        } else {
            form.resetFields();
        }
        setOpen(true);
    };

    const handleSave = async () => {
        const values = await form.validateFields();

        const extraFields: Record<string, any> = {};
        cauHinh.forEach(c => {
            const raw = values[`extra_${c.id}`];
            extraFields[c.id] = c.kieuDuLieu === 'Date' && raw ? raw.format('YYYY-MM-DD') : raw ?? '';
        });

        const payload = {
            soHieuVanBang: values.soHieuVanBang,
            maSV: values.maSV,
            hoTen: values.hoTen,
            ngaySinh: values.ngaySinh.format('YYYY-MM-DD'),
            quyetDinhId: values.quyetDinhId,
            extraFields,
        };

        if (editItem) {
            if (vanBang.some(v => v.soHieuVanBang === payload.soHieuVanBang && v.id !== editItem.id)) {
                message.error('Số hiệu văn bằng đã tồn tại!'); return;
            }
            setVanBang(prev => prev.map(v =>
                v.id === editItem.id ? { ...v, ...payload } : v
            ));
            message.success('Cập nhật văn bằng thành công');
        } else {
            if (vanBang.some(v => v.soHieuVanBang === payload.soHieuVanBang)) {
                message.error('Số hiệu văn bằng đã tồn tại!'); return;
            }
            const result = addVanBang(payload);
            if (!result) { message.error('Không tìm thấy sổ văn bằng tương ứng!'); return; }
            message.success(`Thêm văn bằng thành công — Số vào sổ: ${result.soVaoSo}`);
        }

        setOpen(false);
        form.resetFields();
    };

    const handleDelete = (id: string) => {
        setVanBang(prev => prev.filter(v => v.id !== id));
        message.success('Đã xóa văn bằng');
    };

    const filtered = vanBang.filter(v => {
        const matchQD = filterQD === 'all' || v.quyetDinhId === filterQD;
        const s = search.toLowerCase();
        const matchSearch = !s
            || v.hoTen.toLowerCase().includes(s)
            || v.maSV.toLowerCase().includes(s)
            || v.soHieuVanBang.toLowerCase().includes(s);
        return matchQD && matchSearch;
    });

    const columns: ColumnsType<VanBangItem> = [
        { title: 'Số vào sổ', dataIndex: 'soVaoSo', key: 'soVaoSo', width: 100, render: v => <Tag color="blue">{v}</Tag> },
        { title: 'Số hiệu VB', dataIndex: 'soHieuVanBang', key: 'soHieuVanBang', width: 130 },
        { title: 'Mã SV', dataIndex: 'maSV', key: 'maSV', width: 130 },
        { title: 'Họ và tên', dataIndex: 'hoTen', key: 'hoTen' },
        { title: 'Ngày sinh', dataIndex: 'ngaySinh', key: 'ngaySinh', width: 110, render: v => dayjs(v).format('DD/MM/YYYY') },
        {
            title: 'Quyết định', dataIndex: 'quyetDinhId', key: 'quyetDinhId', width: 140,
            render: v => <Tag color="purple">{quyetDinh.find(q => q.id === v)?.soQD || '—'}</Tag>,
        },
        {
            title: 'Thao tác', key: 'action', width: 180,
            render: (_, record) => (
                <Space>
                    <Button size="small" icon={<EyeOutlined />} onClick={() => setViewItem(record)}>Xem</Button>
                    <Button size="small" icon={<EditOutlined />} onClick={() => handleOpen(record)}>Sửa</Button>
                    <Popconfirm title="Xóa văn bằng này?" onConfirm={() => handleDelete(record.id)} okText="Xóa" cancelText="Hủy">
                        <Button size="small" danger icon={<DeleteOutlined />}>Xóa</Button>
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    const renderViewModal = () => {
        if (!viewItem) return null;
        const qd = quyetDinh.find(q => q.id === viewItem.quyetDinhId);
        const svb = soVanBang.find(s => s.id === qd?.soVanBangId);
        return (
            <Modal
                title="Chi tiết văn bằng"
                open={!!viewItem}
                onCancel={() => setViewItem(null)}
                footer={<Button onClick={() => setViewItem(null)}>Đóng</Button>}
                width={680}
            >
                <Descriptions bordered column={2} size="small" style={{ marginTop: 12 }}>
                    <Descriptions.Item label="Số vào sổ">{viewItem.soVaoSo}</Descriptions.Item>
                    <Descriptions.Item label="Số hiệu văn bằng"><Tag color="blue">{viewItem.soHieuVanBang}</Tag></Descriptions.Item>
                    <Descriptions.Item label="Mã sinh viên">{viewItem.maSV}</Descriptions.Item>
                    <Descriptions.Item label="Họ và tên"><b>{viewItem.hoTen}</b></Descriptions.Item>
                    <Descriptions.Item label="Ngày sinh">{dayjs(viewItem.ngaySinh).format('DD/MM/YYYY')}</Descriptions.Item>
                    <Descriptions.Item label="Sổ văn bằng">{svb?.ten || '—'}</Descriptions.Item>
                    <Descriptions.Item label="Quyết định" span={2}>{qd?.soQD} — {qd?.trichYeu}</Descriptions.Item>
                    {cauHinh.map(c => {
                        const val = viewItem.extraFields?.[c.id];
                        return (
                            <Descriptions.Item key={c.id} label={c.ten}>
                                {c.kieuDuLieu === 'Date' && val ? dayjs(val).format('DD/MM/YYYY') : (val ?? '—')}
                            </Descriptions.Item>
                        );
                    })}
                </Descriptions>
            </Modal>
        );
    };

    const watchedQDId = Form.useWatch('quyetDinhId', form);

    return (
        <>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
                <h2 style={{ margin: 0 }}>Danh Sách Văn Bằng</h2>
                <Button type="primary" icon={<PlusOutlined />} onClick={() => handleOpen()}>Thêm văn bằng</Button>
            </div>

            <Space style={{ marginBottom: 16 }} wrap>
                <Input.Search
                    placeholder="Tìm theo tên, MSV, số hiệu..."
                    style={{ width: 280 }}
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    allowClear
                />
                <Select value={filterQD} onChange={setFilterQD} style={{ width: 280 }}>
                    <Option value="all">Tất cả quyết định</Option>
                    {[...quyetDinh]
                        .sort((a, b) => new Date(b.ngayBanHanh).getTime() - new Date(a.ngayBanHanh).getTime())
                        .map(q => <Option key={q.id} value={q.id}>{q.soQD} — {q.trichYeu.slice(0, 35)}</Option>)
                    }
                </Select>
            </Space>

            <Table rowKey="id" columns={columns} dataSource={filtered} pagination={{ pageSize: 10 }} />

            {renderViewModal()}

            <Modal
                title={editItem ? 'Chỉnh sửa văn bằng' : 'Thêm văn bằng mới'}
                open={open}
                onOk={handleSave}
                onCancel={() => { setOpen(false); form.resetFields(); setEditItem(null); }}
                okText={editItem ? 'Lưu thay đổi' : 'Thêm văn bằng'}
                cancelText="Hủy"
                width={720}
                destroyOnClose
            >
                <Form form={form} layout="vertical" style={{ marginTop: 16 }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 16px' }}>

                        <Form.Item label="Số vào sổ (tự động)">
                            <Input
                                disabled
                                value={editItem
                                    ? editItem.soVaoSo
                                    : watchedQDId ? getNextSoVaoSo(watchedQDId) : '— Chọn quyết định trước —'
                                }
                            />
                        </Form.Item>

                        <Form.Item name="soHieuVanBang" label="Số hiệu văn bằng" rules={[{ required: true, message: 'Nhập số hiệu văn bằng' }]}>
                            <Input placeholder="B2024001" />
                        </Form.Item>

                        <Form.Item name="maSV" label="Mã sinh viên" rules={[{ required: true, message: 'Nhập mã sinh viên' }]}>
                            <Input placeholder="SV20190001" />
                        </Form.Item>

                        <Form.Item name="hoTen" label="Họ và tên" rules={[{ required: true, message: 'Nhập họ tên' }]}>
                            <Input placeholder="Nguyễn Văn A" />
                        </Form.Item>

                        <Form.Item name="ngaySinh" label="Ngày sinh" rules={[{ required: true, message: 'Chọn ngày sinh' }]}>
                            <DatePicker style={{ width: '100%' }} format="DD/MM/YYYY" />
                        </Form.Item>

                        <Form.Item name="quyetDinhId" label="Quyết định tốt nghiệp" rules={[{ required: true, message: 'Chọn quyết định' }]}>
                            <Select
                                placeholder="— Chọn quyết định —"
                                disabled={!!editItem} 
                            >
                                {[...quyetDinh]
                                    .sort((a, b) => new Date(b.ngayBanHanh).getTime() - new Date(a.ngayBanHanh).getTime())
                                    .map(q => <Option key={q.id} value={q.id}>{q.soQD}</Option>)
                                }
                            </Select>
                        </Form.Item>

                        {cauHinh.map(c => (
                            <Form.Item
                                key={c.id}
                                name={`extra_${c.id}`}
                                label={c.ten}
                                rules={c.batBuoc ? [{ required: true, message: `${c.ten} là bắt buộc` }] : []}
                            >
                                {c.kieuDuLieu === 'Date' ? (
                                    <DatePicker style={{ width: '100%' }} format="DD/MM/YYYY" />
                                ) : c.kieuDuLieu === 'Number' ? (
                                    <InputNumber style={{ width: '100%' }} step={0.01} />
                                ) : (
                                    <Input />
                                )}
                            </Form.Item>
                        ))}
                    </div>
                </Form>
            </Modal>
        </>
    );
};

export default DanhSachVanBang;