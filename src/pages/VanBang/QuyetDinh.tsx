import React, { useState } from 'react';
import { useModel } from 'umi';
import { Button, Table, Modal, Form, Input, DatePicker, Select, Space, Popconfirm, message, Tag } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import type { QuyetDinhItem } from '../../models/vanBang';
import dayjs from 'dayjs';

const { Option } = Select;

const QuyetDinh: React.FC = () => {
    const { soVanBang, quyetDinh, setQuyetDinh, vanBang } = useModel('vanBang');

    const [open, setOpen] = useState(false);
    const [editItem, setEditItem] = useState<QuyetDinhItem | null>(null);
    const [filterSVB, setFilterSVB] = useState<string>('all');
    const [form] = Form.useForm();

    const handleOpen = (item?: QuyetDinhItem) => {
        setEditItem(item || null);
        form.setFieldsValue(item
            ? { ...item, ngayBanHanh: dayjs(item.ngayBanHanh) }
            : { soQD: '', trichYeu: '', soVanBangId: undefined, ngayBanHanh: undefined }
        );
        setOpen(true);
    };

    const handleSave = async () => {
        const values = await form.validateFields();
        const payload = { ...values, ngayBanHanh: values.ngayBanHanh.format('YYYY-MM-DD') };

        if (quyetDinh.some(d => d.soQD === payload.soQD && d.id !== editItem?.id)) {
            message.error('Số QĐ đã tồn tại!'); return;
        }

        if (editItem) {
            setQuyetDinh(prev => prev.map(d => d.id === editItem.id ? { ...d, ...payload } : d));
            message.success('Cập nhật thành công');
        } else {
            setQuyetDinh(prev => [...prev, { ...payload, id: `qd_${Date.now()}`, luotTraCuu: 0 }]);
            message.success('Thêm mới thành công');
        }
        setOpen(false);
        form.resetFields();
    };

    const handleDelete = (id: string) => {
        if (vanBang.some(v => v.quyetDinhId === id)) {
            message.error('Không thể xóa! Quyết định đang chứa văn bằng.'); return;
        }
        setQuyetDinh(prev => prev.filter(d => d.id !== id));
        message.success('Đã xóa');
    };

    const filtered = [...quyetDinh]
        .filter(d => filterSVB === 'all' || d.soVanBangId === filterSVB)
        .sort((a, b) => new Date(b.ngayBanHanh).getTime() - new Date(a.ngayBanHanh).getTime());

    const columns: ColumnsType<QuyetDinhItem> = [
        { title: 'Số QĐ', dataIndex: 'soQD', key: 'soQD', width: 140, render: v => <Tag color="blue">{v}</Tag> },
        { title: 'Ngày ban hành', dataIndex: 'ngayBanHanh', key: 'ngayBanHanh', width: 140, render: v => dayjs(v).format('DD/MM/YYYY') },
        { title: 'Trích yếu', dataIndex: 'trichYeu', key: 'trichYeu' },
        {
            title: 'Sổ văn bằng', dataIndex: 'soVanBangId', key: 'soVanBangId', width: 220,
            render: v => soVanBang.find(s => s.id === v)?.ten || '—',
        },
        {
            title: 'Lượt tra cứu', dataIndex: 'luotTraCuu', key: 'luotTraCuu', width: 120,
            render: v => <Tag color="green">{v}</Tag>,
        },
        {
            title: 'Thao tác', key: 'action', width: 140,
            render: (_, record) => (
                <Space>
                    <Button size="small" icon={<EditOutlined />} onClick={() => handleOpen(record)}>Sửa</Button>
                    <Popconfirm title="Xóa quyết định này?" onConfirm={() => handleDelete(record.id)} okText="Xóa" cancelText="Hủy">
                        <Button size="small" danger icon={<DeleteOutlined />}>Xóa</Button>
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    return (
        <>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <h2 style={{ margin: 0 }}>Quyết Định Tốt Nghiệp</h2>
                <Button type="primary" icon={<PlusOutlined />} onClick={() => handleOpen()}>Thêm quyết định</Button>
            </div>

            <Space style={{ marginBottom: 16 }}>
                <span>Lọc theo sổ:</span>
                <Select value={filterSVB} onChange={setFilterSVB} style={{ width: 240 }}>
                    <Option value="all">Tất cả sổ</Option>
                    {[...soVanBang].sort((a, b) => b.nam - a.nam).map(s => (
                        <Option key={s.id} value={s.id}>{s.ten}</Option>
                    ))}
                </Select>
            </Space>

            <Table rowKey="id" columns={columns} dataSource={filtered} pagination={{ pageSize: 10 }} />

            <Modal
                title={editItem ? 'Chỉnh sửa quyết định' : 'Thêm quyết định tốt nghiệp'}
                open={open}
                onOk={handleSave}
                onCancel={() => { setOpen(false); form.resetFields(); }}
                okText={editItem ? 'Lưu' : 'Thêm'}
                cancelText="Hủy"
                width={600}
            >
                <Form form={form} layout="vertical" style={{ marginTop: 16 }}>
                    <Form.Item name="soQD" label="Số QĐ" rules={[{ required: true, message: 'Nhập số quyết định' }]}>
                        <Input placeholder="QĐ-01/2024" />
                    </Form.Item>
                    <Form.Item name="ngayBanHanh" label="Ngày ban hành" rules={[{ required: true, message: 'Chọn ngày ban hành' }]}>
                        <DatePicker style={{ width: '100%' }} format="DD/MM/YYYY" />
                    </Form.Item>
                    <Form.Item name="trichYeu" label="Trích yếu" rules={[{ required: true, message: 'Nhập trích yếu' }]}>
                        <Input.TextArea rows={2} placeholder="Công nhận tốt nghiệp đợt 1 năm 2024" />
                    </Form.Item>
                    <Form.Item name="soVanBangId" label="Sổ văn bằng" rules={[{ required: true, message: 'Chọn sổ văn bằng' }]}>
                        <Select placeholder="— Chọn sổ văn bằng —">
                            {[...soVanBang].sort((a, b) => b.nam - a.nam).map(s => (
                                <Option key={s.id} value={s.id}>{s.ten}</Option>
                            ))}
                        </Select>
                    </Form.Item>
                </Form>
            </Modal>
        </>
    );
};

export default QuyetDinh;