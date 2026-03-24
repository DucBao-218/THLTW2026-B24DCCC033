import React, { useState } from 'react';
import { useModel } from 'umi';
import { Button, Table, Modal, Form, Input, Select, Switch, Space, Popconfirm, message, Tag } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, LockOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import type { CauHinhItem } from '../../models/vanBang';

const { Option } = Select;

const kieuColor: Record<string, string> = { String: 'blue', Number: 'orange', Date: 'green' };

const DEFAULT_FIELDS = [
    { ten: 'Số vào sổ', kieuDuLieu: 'Number', note: 'Tự động tăng' },
    { ten: 'Số hiệu văn bằng', kieuDuLieu: 'String', note: 'Bắt buộc' },
    { ten: 'Mã sinh viên', kieuDuLieu: 'String', note: 'Bắt buộc' },
    { ten: 'Họ tên', kieuDuLieu: 'String', note: 'Bắt buộc' },
    { ten: 'Ngày sinh', kieuDuLieu: 'Date', note: 'Bắt buộc' },
];

const CauHinhBieuMau: React.FC = () => {
    const { cauHinh, setCauHinh } = useModel('vanBang');

    const [open, setOpen] = useState(false);
    const [editItem, setEditItem] = useState<CauHinhItem | null>(null);
    const [form] = Form.useForm();

    const handleOpen = (item?: CauHinhItem) => {
        setEditItem(item || null);
        form.setFieldsValue(item || { ten: '', kieuDuLieu: 'String', batBuoc: false });
        setOpen(true);
    };

    const handleSave = async () => {
        const values = await form.validateFields();
        if (cauHinh.some(c => c.ten.toLowerCase() === values.ten.toLowerCase() && c.id !== editItem?.id)) {
            message.error('Tên trường đã tồn tại!'); return;
        }
        if (editItem) {
            setCauHinh(prev => prev.map(c => c.id === editItem.id ? { ...c, ...values } : c));
            message.success('Cập nhật thành công');
        } else {
            setCauHinh(prev => [...prev, { ...values, id: `cf_${Date.now()}` }]);
            message.success('Thêm trường thành công');
        }
        setOpen(false);
        form.resetFields();
    };

    const handleDelete = (id: string) => {
        setCauHinh(prev => prev.filter(c => c.id !== id));
        message.success('Đã xóa trường thông tin');
    };

    const customColumns: ColumnsType<CauHinhItem> = [
        { title: 'Tên trường', dataIndex: 'ten', key: 'ten' },
        {
            title: 'Kiểu dữ liệu', dataIndex: 'kieuDuLieu', key: 'kieuDuLieu', width: 140,
            render: v => <Tag color={kieuColor[v]}>{v}</Tag>,
        },
        {
            title: 'Bắt buộc', dataIndex: 'batBuoc', key: 'batBuoc', width: 100,
            render: v => v ? <Tag color="red">Có</Tag> : <Tag>Không</Tag>,
        },
        {
            title: 'Thao tác', key: 'action', width: 140,
            render: (_, record) => (
                <Space>
                    <Button size="small" icon={<EditOutlined />} onClick={() => handleOpen(record)}>Sửa</Button>
                    <Popconfirm
                        title="Xóa trường này?"
                        onConfirm={() => handleDelete(record.id)}
                        okText="Xóa" cancelText="Hủy"
                    >
                        <Button size="small" danger icon={<DeleteOutlined />}>Xóa</Button>
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    return (
        <>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
                <h2 style={{ margin: 0 }}>Cấu Hình Biểu Mẫu Văn Bằng</h2>
                <Button type="primary" icon={<PlusOutlined />} onClick={() => handleOpen()}>Thêm trường</Button>
            </div>

            <h4 style={{ color: '#888', marginBottom: 8 }}>
                <LockOutlined /> Trường mặc định (không thể chỉnh sửa)
            </h4>
            <Table
                rowKey="ten"
                size="small"
                style={{ marginBottom: 24, opacity: 0.65 }}
                pagination={false}
                dataSource={DEFAULT_FIELDS}
                columns={[
                    { title: 'Tên trường', dataIndex: 'ten', key: 'ten' },
                    { title: 'Kiểu dữ liệu', dataIndex: 'kieuDuLieu', key: 'kieuDuLieu', width: 140, render: (v: string) => <Tag color={kieuColor[v]}>{v}</Tag> },
                    { title: 'Ghi chú', dataIndex: 'note', key: 'note', width: 140 },
                ]}
            />

            <h4 style={{ color: '#888', marginBottom: 8 }}>Trường cấu hình ({cauHinh.length})</h4>
            <Table rowKey="id" columns={customColumns} dataSource={cauHinh} pagination={false} />

            <Modal
                title={editItem ? 'Chỉnh sửa trường thông tin' : 'Thêm trường thông tin'}
                open={open}
                onOk={handleSave}
                onCancel={() => { setOpen(false); form.resetFields(); }}
                okText={editItem ? 'Lưu' : 'Thêm'}
                cancelText="Hủy"
            >
                <Form form={form} layout="vertical" style={{ marginTop: 16 }}>
                    <Form.Item name="ten" label="Tên trường" rules={[{ required: true, message: 'Nhập tên trường' }]}>
                        <Input placeholder="VD: Dân tộc, Điểm trung bình, Ngày nhập học" />
                    </Form.Item>
                    <Form.Item name="kieuDuLieu" label="Kiểu dữ liệu" rules={[{ required: true }]}>
                        <Select>
                            <Option value="String">String — Văn bản</Option>
                            <Option value="Number">Number — Số</Option>
                            <Option value="Date">Date — Ngày tháng</Option>
                        </Select>
                    </Form.Item>
                    <Form.Item name="batBuoc" label="Bắt buộc nhập" valuePropName="checked">
                        <Switch checkedChildren="Có" unCheckedChildren="Không" />
                    </Form.Item>
                </Form>
            </Modal>
        </>
    );
};

export default CauHinhBieuMau;