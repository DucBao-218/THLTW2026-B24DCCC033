import React, { useState } from 'react';
import { useModel } from 'umi';
import { Button, Table, Modal, Form, Input, InputNumber, Space, Popconfirm, message, Tag } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import type { SoVanBangItem } from '../../models/vanBang';

const SoVanBang: React.FC = () => {
    const { soVanBang, setSoVanBang, addSoVanBang, vanBang, quyetDinh } = useModel('vanBang');

    const [open, setOpen] = useState(false);
    const [editItem, setEditItem] = useState<SoVanBangItem | null>(null);
    const [form] = Form.useForm();

    const handleOpen = (item?: SoVanBangItem) => {
        setEditItem(item || null);
        form.setFieldsValue(
            item
                ? { nam: item.nam, ten: item.ten }
                : { nam: new Date().getFullYear(), ten: `Sổ văn bằng năm ${new Date().getFullYear()}` }
        );
        setOpen(true);
    };

    const handleSave = async () => {
        const values = await form.validateFields();
        if (editItem) {
            if (soVanBang.some(s => s.nam === values.nam && s.id !== editItem.id)) {
                message.error('Đã tồn tại sổ cho năm này!');
                return;
            }
            setSoVanBang(prev => prev.map(s => s.id === editItem.id ? { ...s, ...values } : s));
            message.success('Cập nhật thành công');
        } else {
            const ok = addSoVanBang({ nam: values.nam, ten: values.ten });
            if (!ok) { message.error('Đã tồn tại sổ cho năm này!'); return; }
            message.success('Tạo sổ văn bằng thành công');
        }
        setOpen(false);
        form.resetFields();
    };

    const handleDelete = (id: string) => {
        const qdIds = quyetDinh.filter(q => q.soVanBangId === id).map(q => q.id);
        if (vanBang.some(v => qdIds.includes(v.quyetDinhId))) {
            message.error('Không thể xóa! Sổ đang chứa văn bằng.'); return;
        }
        setSoVanBang(prev => prev.filter(s => s.id !== id));
        message.success('Đã xóa sổ văn bằng');
    };

    const columns: ColumnsType<SoVanBangItem> = [
        { title: 'Năm', dataIndex: 'nam', key: 'nam', width: 100, sorter: (a, b) => b.nam - a.nam },
        { title: 'Tên sổ văn bằng', dataIndex: 'ten', key: 'ten' },
        {
            title: 'Số vào sổ hiện tại', dataIndex: 'soThuTu', key: 'soThuTu', width: 180,
            render: (v) => <Tag color={v === 0 ? 'default' : 'blue'}>{v === 0 ? 'Chưa có văn bằng' : v}</Tag>,
        },
        {
            title: 'Số văn bằng', key: 'countVB', width: 120,
            render: (_, record) => {
                const qdIds = quyetDinh.filter(q => q.soVanBangId === record.id).map(q => q.id);
                return vanBang.filter(v => qdIds.includes(v.quyetDinhId)).length;
            },
        },
        {
            title: 'Thao tác', key: 'action', width: 140,
            render: (_, record) => (
                <Space>
                    <Button size="small" icon={<EditOutlined />} onClick={() => handleOpen(record)}>Sửa</Button>
                    <Popconfirm title="Xóa sổ văn bằng này?" onConfirm={() => handleDelete(record.id)} okText="Xóa" cancelText="Hủy">
                        <Button size="small" danger icon={<DeleteOutlined />}>Xóa</Button>
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    return (
        <>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
                <h2 style={{ margin: 0 }}>Sổ Văn Bằng</h2>
                <Button type="primary" icon={<PlusOutlined />} onClick={() => handleOpen()}>Tạo sổ mới</Button>
            </div>

            <Table rowKey="id" columns={columns} dataSource={[...soVanBang].sort((a, b) => b.nam - a.nam)} pagination={false} />

            <Modal
                title={editItem ? 'Chỉnh sửa sổ văn bằng' : 'Tạo sổ văn bằng mới'}
                open={open}
                onOk={handleSave}
                onCancel={() => { setOpen(false); form.resetFields(); }}
                okText={editItem ? 'Lưu' : 'Tạo sổ'}
                cancelText="Hủy"
            >
                <Form form={form} layout="vertical" style={{ marginTop: 16 }}>
                    <Form.Item name="nam" label="Năm" rules={[{ required: true, message: 'Nhập năm' }, { type: 'number', min: 2000, max: 2100, message: 'Năm từ 2000–2100' }]}>
                        <InputNumber style={{ width: '100%' }} min={2000} max={2100}
                            onChange={(v) => form.setFieldValue('ten', `Sổ văn bằng năm ${v}`)} />
                    </Form.Item>
                    <Form.Item name="ten" label="Tên sổ" rules={[{ required: true, message: 'Nhập tên sổ' }]}>
                        <Input placeholder="Sổ văn bằng năm 2024" />
                    </Form.Item>
                </Form>
            </Modal>
        </>
    );
};

export default SoVanBang;