import React, { useState } from 'react';
import {
    Button, Table, Modal, Form, Input, InputNumber, DatePicker,
    Select, Space, Popconfirm, message, Tag, Descriptions
} from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, EyeOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';

const { Option } = Select;

const cauHinhList = [
    { id: 'cf1', ten: 'Dân tộc', kieuDuLieu: 'String', batBuoc: false },
    { id: 'cf2', ten: 'Nơi sinh', kieuDuLieu: 'String', batBuoc: false },
    { id: 'cf3', ten: 'Điểm trung bình', kieuDuLieu: 'Number', batBuoc: true },
    { id: 'cf4', ten: 'Xếp hạng', kieuDuLieu: 'String', batBuoc: true },
    { id: 'cf5', ten: 'Hệ đào tạo', kieuDuLieu: 'String', batBuoc: true },
    { id: 'cf6', ten: 'Ngày nhập học', kieuDuLieu: 'Date', batBuoc: false },
];

const quyetDinhList = [
    { id: 'qd1', soQD: 'QĐ-01/2024', soVanBangId: 'svb2024', ten: 'Công nhận TN đợt 1 năm 2024' },
    { id: 'qd2', soQD: 'QĐ-02/2024', soVanBangId: 'svb2024', ten: 'Công nhận TN đợt 2 năm 2024' },
    { id: 'qd3', soQD: 'QĐ-01/2023', soVanBangId: 'svb2023', ten: 'Công nhận TN đợt 1 năm 2023' },
];

const soVanBangMap: Record<string, { ten: string; soThuTu: number }> = {
    svb2023: { ten: 'Sổ văn bằng năm 2023', soThuTu: 2 },
    svb2024: { ten: 'Sổ văn bằng năm 2024', soThuTu: 3 },
};

interface VanBangItem {
    id: string;
    soVaoSo: number;
    soHieuVanBang: string;
    maSV: string;
    hoTen: string;
    ngaySinh: string;
    quyetDinhId: string;
    [key: string]: any;
}

const DanhSachVanBang: React.FC = () => {
    const [data, setData] = useState<VanBangItem[]>([
        { id: 'vb1', soVaoSo: 1, soHieuVanBang: 'B2024001', maSV: 'SV20190001', hoTen: 'Nguyễn Văn An', ngaySinh: '2001-03-15', quyetDinhId: 'qd1', cf1: 'Kinh', cf2: 'Hà Nội', cf3: 3.5, cf4: 'Giỏi', cf5: 'Chính quy', cf6: '2019-09-01' },
        { id: 'vb2', soVaoSo: 2, soHieuVanBang: 'B2024002', maSV: 'SV20190002', hoTen: 'Trần Thị Bình', ngaySinh: '2001-07-22', quyetDinhId: 'qd1', cf1: 'Tày', cf2: 'Lạng Sơn', cf3: 3.8, cf4: 'Xuất sắc', cf5: 'Chính quy', cf6: '2019-09-01' },
        { id: 'vb3', soVaoSo: 3, soHieuVanBang: 'B2024003', maSV: 'SV20190003', hoTen: 'Lê Hoàng Cường', ngaySinh: '2001-11-05', quyetDinhId: 'qd2', cf1: 'Kinh', cf2: 'TP. HCM', cf3: 3.2, cf4: 'Khá', cf5: 'Chính quy', cf6: '2019-09-01' },
    ]);

    const [svbCounter, setSvbCounter] = useState({ svb2023: 2, svb2024: 3 });
    const [open, setOpen] = useState(false);
    const [viewItem, setViewItem] = useState<VanBangItem | null>(null);
    const [editItem, setEditItem] = useState<VanBangItem | null>(null);
    const [filterQD, setFilterQD] = useState<string>('all');
    const [search, setSearch] = useState('');
    const [form] = Form.useForm();

    const getNextSoVaoSo = (quyetDinhId: string) => {
        const qd = quyetDinhList.find(q => q.id === quyetDinhId);
        if (!qd) return '—';
        return (svbCounter[qd.soVanBangId as keyof typeof svbCounter] || 0) + 1;
    };

    const handleOpen = (item?: VanBangItem) => {
        setEditItem(item || null);
        if (item) {
            const fields: any = { ...item, ngaySinh: dayjs(item.ngaySinh) };
            cauHinhList.forEach((c, idx) => { fields[`cf_${c.id}`] = item[`cf${idx + 1}`] || item[`cf_${c.id}`] || ''; });
            form.setFieldsValue(fields);
        } else {
            form.resetFields();
        }
        setOpen(true);
    };

    const handleSave = async () => {
        const values = await form.validateFields();
        const payload: VanBangItem = {
            ...values,
            ngaySinh: values.ngaySinh.format('YYYY-MM-DD'),
        };
        cauHinhList.forEach((c, idx) => {
            payload[`cf${idx + 1}`] = values[`cf_${c.id}`] ?? '';
        });

        if (editItem) {
            setData(prev => prev.map(d => d.id === editItem.id ? { ...d, ...payload } : d));
            message.success('Cập nhật thành công');
        } else {
            const qd = quyetDinhList.find(q => q.id === payload.quyetDinhId);
            if (!qd) { message.error('Quyết định không hợp lệ'); return; }
            const svbId = qd.soVanBangId as keyof typeof svbCounter;
            const newSoVaoSo = (svbCounter[svbId] || 0) + 1;
            setSvbCounter(prev => ({ ...prev, [svbId]: newSoVaoSo }));
            setData(prev => [...prev, { ...payload, id: `vb_${Date.now()}`, soVaoSo: newSoVaoSo }]);
            message.success('Thêm văn bằng thành công');
        }
        setOpen(false);
    };

    const handleDelete = (id: string) => {
        setData(prev => prev.filter(d => d.id !== id));
        message.success('Đã xóa');
    };

    const filtered = data.filter(v => {
        const matchQD = filterQD === 'all' || v.quyetDinhId === filterQD;
        const s = search.toLowerCase();
        const matchSearch = !s || v.hoTen.toLowerCase().includes(s) || v.maSV.toLowerCase().includes(s) || v.soHieuVanBang.toLowerCase().includes(s);
        return matchQD && matchSearch;
    });

    const columns: ColumnsType<VanBangItem> = [
        { title: 'Số vào sổ', dataIndex: 'soVaoSo', key: 'soVaoSo', width: 100, render: v => <Tag color="blue">{v}</Tag> },
        { title: 'Số hiệu VB', dataIndex: 'soHieuVanBang', key: 'soHieuVanBang', width: 130 },
        { title: 'Mã SV', dataIndex: 'maSV', key: 'maSV', width: 130 },
        { title: 'Họ và tên', dataIndex: 'hoTen', key: 'hoTen' },
        { title: 'Ngày sinh', dataIndex: 'ngaySinh', key: 'ngaySinh', width: 110, render: v => dayjs(v).format('DD/MM/YYYY') },
        {
            title: 'Quyết định', dataIndex: 'quyetDinhId', key: 'quyetDinhId', width: 130,
            render: v => <Tag color="purple">{quyetDinhList.find(q => q.id === v)?.soQD || '—'}</Tag>,
        },
        {
            title: 'Thao tác', key: 'action', width: 180,
            render: (_, record) => (
                <Space>
                    <Button size="small" icon={<EyeOutlined />} onClick={() => setViewItem(record)}>Xem</Button>
                    <Button size="small" icon={<EditOutlined />} onClick={() => handleOpen(record)}>Sửa</Button>
                    <Popconfirm title="Xóa văn bằng này?" onConfirm={() => handleDelete(record.id)}>
                        <Button size="small" danger icon={<DeleteOutlined />}>Xóa</Button>
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    const selectedQD = quyetDinhList.find(q => q.id === form.getFieldValue('quyetDinhId'));

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
                <Select value={filterQD} onChange={setFilterQD} style={{ width: 260 }}>
                    <Option value="all">Tất cả quyết định</Option>
                    {quyetDinhList.map(q => <Option key={q.id} value={q.id}>{q.soQD} — {q.ten.slice(0, 30)}</Option>)}
                </Select>
            </Space>

            <Table rowKey="id" columns={columns} dataSource={filtered} pagination={{ pageSize: 10 }} />

            <Modal
                title="Chi tiết văn bằng"
                open={!!viewItem}
                onCancel={() => setViewItem(null)}
                footer={<Button onClick={() => setViewItem(null)}>Đóng</Button>}
                width={680}
            >
                {viewItem && (
                    <Descriptions bordered column={2} size="small" style={{ marginTop: 12 }}>
                        <Descriptions.Item label="Số vào sổ">{viewItem.soVaoSo}</Descriptions.Item>
                        <Descriptions.Item label="Số hiệu văn bằng">{viewItem.soHieuVanBang}</Descriptions.Item>
                        <Descriptions.Item label="Mã sinh viên">{viewItem.maSV}</Descriptions.Item>
                        <Descriptions.Item label="Họ và tên">{viewItem.hoTen}</Descriptions.Item>
                        <Descriptions.Item label="Ngày sinh">{dayjs(viewItem.ngaySinh).format('DD/MM/YYYY')}</Descriptions.Item>
                        <Descriptions.Item label="Quyết định">{quyetDinhList.find(q => q.id === viewItem.quyetDinhId)?.soQD}</Descriptions.Item>
                        {cauHinhList.map((c, idx) => (
                            <Descriptions.Item key={c.id} label={c.ten}>
                                {c.kieuDuLieu === 'Date' && viewItem[`cf${idx + 1}`]
                                    ? dayjs(viewItem[`cf${idx + 1}`]).format('DD/MM/YYYY')
                                    : viewItem[`cf${idx + 1}`] || '—'}
                            </Descriptions.Item>
                        ))}
                    </Descriptions>
                )}
            </Modal>

            <Modal
                title={editItem ? 'Chỉnh sửa văn bằng' : 'Thêm văn bằng mới'}
                open={open}
                onOk={handleSave}
                onCancel={() => { setOpen(false); form.resetFields(); }}
                okText={editItem ? 'Lưu' : 'Thêm'}
                cancelText="Hủy"
                width={720}
            >
                <Form form={form} layout="vertical" style={{ marginTop: 16 }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 16px' }}>
                        <Form.Item label="Số vào sổ">
                            <Input
                                disabled
                                value={editItem ? editItem.soVaoSo : `${getNextSoVaoSo(form.getFieldValue('quyetDinhId'))} (tự động)`}
                            />
                        </Form.Item>
                        <Form.Item name="soHieuVanBang" label="Số hiệu văn bằng" rules={[{ required: true }]}>
                            <Input placeholder="B2024001" />
                        </Form.Item>
                        <Form.Item name="maSV" label="Mã sinh viên" rules={[{ required: true }]}>
                            <Input placeholder="SV20190001" />
                        </Form.Item>
                        <Form.Item name="hoTen" label="Họ và tên" rules={[{ required: true }]}>
                            <Input placeholder="Nguyễn Văn A" />
                        </Form.Item>
                        <Form.Item name="ngaySinh" label="Ngày sinh" rules={[{ required: true }]}>
                            <DatePicker style={{ width: '100%' }} format="DD/MM/YYYY" />
                        </Form.Item>
                        <Form.Item name="quyetDinhId" label="Quyết định tốt nghiệp" rules={[{ required: true }]}>
                            <Select placeholder="— Chọn quyết định —" onChange={() => form.setFieldValue('soVaoSo', undefined)}>
                                {quyetDinhList.map(q => <Option key={q.id} value={q.id}>{q.soQD}</Option>)}
                            </Select>
                        </Form.Item>

                        {cauHinhList.map(c => (
                            <Form.Item
                                key={c.id}
                                name={`cf_${c.id}`}
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