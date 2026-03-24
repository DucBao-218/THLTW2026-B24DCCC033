import React, { useState } from 'react';
import { Button, Table, Modal, Form, Input, DatePicker, Select, Space, Popconfirm, message, Tag } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';

const { Option } = Select;

interface QuyetDinhItem {
    id: string;
    soQD: string;
    ngayBanHanh: string;
    trichYeu: string;
    soVanBangId: string;
    luotTraCuu: number;
}

const soVanBangList = [
    { id: 'svb2023', ten: 'Sổ văn bằng năm 2023', nam: 2023 },
    { id: 'svb2024', ten: 'Sổ văn bằng năm 2024', nam: 2024 },
];

const QuyetDinh: React.FC = () => {
    const [data, setData] = useState<QuyetDinhItem[]>([
        { id: 'qd1', soQD: 'QĐ-01/2024', ngayBanHanh: '2024-06-15', trichYeu: 'Công nhận tốt nghiệp đợt 1 năm 2024', soVanBangId: 'svb2024', luotTraCuu: 12 },
        { id: 'qd2', soQD: 'QĐ-02/2024', ngayBanHanh: '2024-11-20', trichYeu: 'Công nhận tốt nghiệp đợt 2 năm 2024', soVanBangId: 'svb2024', luotTraCuu: 5 },
        { id: 'qd3', soQD: 'QĐ-01/2023', ngayBanHanh: '2023-07-10', trichYeu: 'Công nhận tốt nghiệp đợt 1 năm 2023', soVanBangId: 'svb2023', luotTraCuu: 30 },
    ]);
    const [open, setOpen] = useState(false);
    const [editItem, setEditItem] = useState<QuyetDinhItem | null>(null);
    const [filterSVB, setFilterSVB] = useState<string>('all');
    const [form] = Form.useForm();

    const handleOpen = (item?: QuyetDinhItem) => {
        setEditItem(item || null);
        form.setFieldsValue(item ? {
            ...item,
            ngayBanHanh: dayjs(item.ngayBanHanh),
        } : { soQD: '', trichYeu: '', soVanBangId: undefined });
        setOpen(true);
    };

    const handleSave = async () => {
        const values = await form.validateFields();
        const payload = { ...values, ngayBanHanh: values.ngayBanHanh.format('YYYY-MM-DD') };
        if (editItem) {
            if (data.some(d => d.soQD === payload.soQD && d.id !== editItem.id)) {
                message.error('Số QĐ đã tồn tại!'); return;
            }
            setData(prev => prev.map(d => d.id === editItem.id ? { ...d, ...payload } : d));
            message.success('Cập nhật thành công');
        } else {
            if (data.some(d => d.soQD === payload.soQD)) {
                message.error('Số QĐ đã tồn tại!'); return;
            }
            setData(prev => [...prev, { ...payload, id: `qd_${Date.now()}`, luotTraCuu: 0 }]);
            message.success('Thêm mới thành công');
        }
        setOpen(false);
        form.resetFields();
    };

    const handleDelete = (id: string) => {
        setData(prev => prev.filter(d => d.id !== id));
        message.success('Đã xóa');
    };

    const filtered = data.filter(d => filterSVB === 'all' || d.soVanBangId === filterSVB);

    const columns: ColumnsType<QuyetDinhItem> = [
        {
            title: 'Số QĐ', dataIndex: 'soQD', key: 'soQD', width: 140,
            render: (v) => <Tag color="blue">{v}</Tag>,
        },
        {
            title: 'Ngày ban hành', dataIndex: 'ngayBanHanh', key: 'ngayBanHanh', width: 140,
            render: (v) => dayjs(v).format('DD/MM/YYYY'),
        },
        { title: 'Trích yếu', dataIndex: 'trichYeu', key: 'trichYeu' },
        {
            title: 'Sổ văn bằng', dataIndex: 'soVanBangId', key: 'soVanBangId', width: 200,
            render: (v) => soVanBangList.find(s => s.id === v)?.ten || '—',
        },
        {
            title: 'Lượt tra cứu', dataIndex: 'luotTraCuu', key: 'luotTraCuu', width: 120,
            render: (v) => <Tag color="green">{v}</Tag>,
        },
        {
            title: 'Thao tác', key: 'action', width: 140,
            render: (_, record) => (
                <Space>
                    <Button size="small" icon={<EditOutlined />} onClick={() => handleOpen(record)}>Sửa</Button>
                    <Popconfirm title="Xóa quyết định này?" onConfirm={() => handleDelete(record.id)}>
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
                <Select value={filterSVB} onChange={setFilterSVB} style={{ width: 220 }}>
                    <Option value="all">Tất cả sổ</Option>
                    {soVanBangList.map(s => <Option key={s.id} value={s.id}>{s.ten}</Option>)}
                </Select>
            </Space>

            <Table
                rowKey="id"
                columns={columns}
                dataSource={[...filtered].sort((a, b) => new Date(b.ngayBanHanh).getTime() - new Date(a.ngayBanHanh).getTime())}
                pagination={{ pageSize: 10 }}
            />

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
                            {soVanBangList.map(s => <Option key={s.id} value={s.id}>{s.ten}</Option>)}
                        </Select>
                    </Form.Item>
                </Form>
            </Modal>
        </>
    );
};

export default QuyetDinh;