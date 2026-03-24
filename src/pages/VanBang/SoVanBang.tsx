import React, { useState } from 'react';
import { Button, Table, Modal, Form, Input, InputNumber, Space, Popconfirm, message, Tag } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';

interface SoVanBangItem {
    id: string;
    nam: number;
    ten: string;
    soThuTu: number;
}

const SoVanBang: React.FC = () => {
    const [data, setData] = useState<SoVanBangItem[]>([
        { id: 'svb2023', nam: 2023, ten: 'Sổ văn bằng năm 2023', soThuTu: 2 },
        { id: 'svb2024', nam: 2024, ten: 'Sổ văn bằng năm 2024', soThuTu: 3 },
    ]);
    const [open, setOpen] = useState(false);
    const [editItem, setEditItem] = useState<SoVanBangItem | null>(null);
    const [form] = Form.useForm();

    const handleOpen = (item?: SoVanBangItem) => {
        setEditItem(item || null);
        form.setFieldsValue(item || { nam: new Date().getFullYear(), ten: '', soThuTu: 0 });
        setOpen(true);
    };

    const handleSave = async () => {
        const values = await form.validateFields();
        if (editItem) {
            setData(prev => prev.map(d => d.id === editItem.id ? { ...d, ...values } : d));
            message.success('Cập nhật thành công');
        } else {
            const existing = data.find(d => d.nam === values.nam);
            if (existing) { message.error('Đã tồn tại sổ cho năm này!'); return; }
            setData(prev => [...prev, { ...values, id: `svb${values.nam}`, soThuTu: 0 }]);
            message.success('Thêm mới thành công');
        }
        setOpen(false);
        form.resetFields();
    };

    const handleDelete = (id: string) => {
        setData(prev => prev.filter(d => d.id !== id));
        message.success('Đã xóa');
    };

    const columns: ColumnsType<SoVanBangItem> = [
        { title: 'Năm', dataIndex: 'nam', key: 'nam', width: 100, sorter: (a, b) => b.nam - a.nam },
        { title: 'Tên sổ văn bằng', dataIndex: 'ten', key: 'ten' },
        {
            title: 'Số vào sổ hiện tại',
            dataIndex: 'soThuTu',
            key: 'soThuTu',
            width: 160,
            render: (v) => <Tag color="blue">{v}</Tag>,
        },
        {
            title: 'Thao tác',
            key: 'action',
            width: 140,
            render: (_, record) => (
                <Space>
                    <Button size="small" icon={<EditOutlined />} onClick={() => handleOpen(record)}>Sửa</Button>
                    <Popconfirm title="Xóa sổ này?" onConfirm={() => handleDelete(record.id)}>
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

            <Table rowKey="id" columns={columns} dataSource={[...data].sort((a, b) => b.nam - a.nam)} pagination={false} />

            <Modal
                title={editItem ? 'Chỉnh sửa sổ văn bằng' : 'Tạo sổ văn bằng mới'}
                open={open}
                onOk={handleSave}
                onCancel={() => { setOpen(false); form.resetFields(); }}
                okText={editItem ? 'Lưu' : 'Tạo'}
                cancelText="Hủy"
            >
                <Form form={form} layout="vertical" style={{ marginTop: 16 }}>
                    <Form.Item name="nam" label="Năm" rules={[{ required: true, message: 'Nhập năm' }]}>
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