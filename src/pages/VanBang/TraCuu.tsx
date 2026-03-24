import React, { useState } from 'react';
import { Button, Form, Input, DatePicker, Card, Table, Modal, Descriptions, Alert, Tag, message } from 'antd';
import { SearchOutlined, EyeOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';

const cauHinhList = [
    { id: 'cf1', ten: 'Dân tộc', kieuDuLieu: 'String' },
    { id: 'cf2', ten: 'Nơi sinh', kieuDuLieu: 'String' },
    { id: 'cf3', ten: 'Điểm trung bình', kieuDuLieu: 'Number' },
    { id: 'cf4', ten: 'Xếp hạng', kieuDuLieu: 'String' },
    { id: 'cf5', ten: 'Hệ đào tạo', kieuDuLieu: 'String' },
    { id: 'cf6', ten: 'Ngày nhập học', kieuDuLieu: 'Date' },
];

const quyetDinhList = [
    { id: 'qd1', soQD: 'QĐ-01/2024', ngayBanHanh: '2024-06-15', trichYeu: 'Công nhận tốt nghiệp đợt 1 năm 2024', soVanBangId: 'svb2024' },
    { id: 'qd2', soQD: 'QĐ-02/2024', ngayBanHanh: '2024-11-20', trichYeu: 'Công nhận tốt nghiệp đợt 2 năm 2024', soVanBangId: 'svb2024' },
    { id: 'qd3', soQD: 'QĐ-01/2023', ngayBanHanh: '2023-07-10', trichYeu: 'Công nhận tốt nghiệp đợt 1 năm 2023', soVanBangId: 'svb2023' },
];

const soVanBangMap: Record<string, string> = {
    svb2023: 'Sổ văn bằng năm 2023',
    svb2024: 'Sổ văn bằng năm 2024',
};

const vanBangData = [
    { id: 'vb1', soVaoSo: 1, soHieuVanBang: 'B2024001', maSV: 'SV20190001', hoTen: 'Nguyễn Văn An', ngaySinh: '2001-03-15', quyetDinhId: 'qd1', cf1: 'Kinh', cf2: 'Hà Nội', cf3: 3.5, cf4: 'Giỏi', cf5: 'Chính quy', cf6: '2019-09-01' },
    { id: 'vb2', soVaoSo: 2, soHieuVanBang: 'B2024002', maSV: 'SV20190002', hoTen: 'Trần Thị Bình', ngaySinh: '2001-07-22', quyetDinhId: 'qd1', cf1: 'Tày', cf2: 'Lạng Sơn', cf3: 3.8, cf4: 'Xuất sắc', cf5: 'Chính quy', cf6: '2019-09-01' },
    { id: 'vb3', soVaoSo: 3, soHieuVanBang: 'B2024003', maSV: 'SV20190003', hoTen: 'Lê Hoàng Cường', ngaySinh: '2001-11-05', quyetDinhId: 'qd2', cf1: 'Kinh', cf2: 'TP. HCM', cf3: 3.2, cf4: 'Khá', cf5: 'Chính quy', cf6: '2019-09-01' },
    { id: 'vb4', soVaoSo: 1, soHieuVanBang: 'B2023001', maSV: 'SV20180001', hoTen: 'Phạm Minh Đức', ngaySinh: '2000-05-18', quyetDinhId: 'qd3', cf1: 'Kinh', cf2: 'Đà Nẵng', cf3: 3.6, cf4: 'Giỏi', cf5: 'Chính quy', cf6: '2018-09-01' },
];

interface VanBangItem { id: string; soVaoSo: number; soHieuVanBang: string; maSV: string; hoTen: string; ngaySinh: string; quyetDinhId: string; [k: string]: any; }

const TraCuu: React.FC = () => {
    const [form] = Form.useForm();
    const [results, setResults] = useState<VanBangItem[] | null>(null);
    const [viewItem, setViewItem] = useState<VanBangItem | null>(null);
    const [luotTraCuu, setLuotTraCuu] = useState<Record<string, number>>({ qd1: 12, qd2: 5, qd3: 30 });

    const filledCount = () => {
        const vals = form.getFieldsValue();
        return Object.values(vals).filter((v: any) => v !== undefined && v !== '' && v !== null).length;
    };

    const handleSearch = async () => {
        const values = await form.validateFields().catch(() => null);
        if (!values) return;
        const filled = Object.values(values).filter((v: any) => v !== undefined && v !== '' && v !== null).length;
        if (filled < 2) { message.warning('Vui lòng nhập ít nhất 2 tham số tra cứu!'); return; }

        const r = vanBangData.filter(v => {
            const ngaySinhVal = values.ngaySinh ? values.ngaySinh.format('YYYY-MM-DD') : null;
            return (
                (!values.soHieuVanBang || v.soHieuVanBang.toLowerCase().includes(values.soHieuVanBang.toLowerCase())) &&
                (!values.soVaoSo || String(v.soVaoSo) === String(values.soVaoSo)) &&
                (!values.maSV || v.maSV.toLowerCase().includes(values.maSV.toLowerCase())) &&
                (!values.hoTen || v.hoTen.toLowerCase().includes(values.hoTen.toLowerCase())) &&
                (!ngaySinhVal || v.ngaySinh === ngaySinhVal)
            );
        });
        setResults(r);
    };

    const handleView = (vb: VanBangItem) => {
        setViewItem(vb);
        setLuotTraCuu(prev => ({ ...prev, [vb.quyetDinhId]: (prev[vb.quyetDinhId] || 0) + 1 }));
    };

    const columns: ColumnsType<VanBangItem> = [
        { title: 'Số hiệu VB', dataIndex: 'soHieuVanBang', key: 'soHieuVanBang', width: 130 },
        { title: 'Mã SV', dataIndex: 'maSV', key: 'maSV', width: 130 },
        { title: 'Họ và tên', dataIndex: 'hoTen', key: 'hoTen' },
        { title: 'Ngày sinh', dataIndex: 'ngaySinh', key: 'ngaySinh', width: 110, render: v => dayjs(v).format('DD/MM/YYYY') },
        {
            title: 'Quyết định', dataIndex: 'quyetDinhId', key: 'qd', width: 140,
            render: v => <Tag color="purple">{quyetDinhList.find(q => q.id === v)?.soQD || '—'}</Tag>,
        },
        {
            title: '', key: 'action', width: 100,
            render: (_, record) => (
                <Button size="small" type="primary" icon={<EyeOutlined />} onClick={() => handleView(record)}>Xem</Button>
            ),
        },
    ];

    const currentFilled = form.isFieldsTouched() ? Object.values(form.getFieldsValue()).filter((v: any) => v !== undefined && v !== '' && v !== null).length : 0;

    return (
        <>
            <h2>Tra Cứu Văn Bằng</h2>

            <Card style={{ maxWidth: 680, marginBottom: 24 }}>
                <Alert
                    message="Yêu cầu nhập ít nhất 2 tham số để tra cứu"
                    type="info"
                    showIcon
                    style={{ marginBottom: 16 }}
                />
                <Form form={form} layout="vertical" onValuesChange={() => form.validateFields().catch(() => {})}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 16px' }}>
                        <Form.Item name="soHieuVanBang" label="Số hiệu văn bằng">
                            <Input placeholder="B2024001" allowClear />
                        </Form.Item>
                        <Form.Item name="soVaoSo" label="Số vào sổ">
                            <Input placeholder="1" allowClear />
                        </Form.Item>
                        <Form.Item name="maSV" label="Mã sinh viên">
                            <Input placeholder="SV20190001" allowClear />
                        </Form.Item>
                        <Form.Item name="hoTen" label="Họ và tên">
                            <Input placeholder="Nguyễn Văn A" allowClear />
                        </Form.Item>
                        <Form.Item name="ngaySinh" label="Ngày sinh" style={{ gridColumn: 'span 2' }}>
                            <DatePicker style={{ width: '100%' }} format="DD/MM/YYYY" placeholder="Chọn ngày sinh" />
                        </Form.Item>
                    </div>
                    <Button
                        type="primary"
                        icon={<SearchOutlined />}
                        onClick={handleSearch}
                        block
                        size="large"
                    >
                        Tra cứu văn bằng
                    </Button>
                </Form>
            </Card>

            {results !== null && (
                <>
                    {results.length === 0 ? (
                        <Alert message="Không tìm thấy văn bằng nào khớp với thông tin đã nhập" type="warning" showIcon />
                    ) : (
                        <>
                            <p style={{ marginBottom: 8, color: '#666' }}>Tìm thấy <b>{results.length}</b> kết quả</p>
                            <Table rowKey="id" columns={columns} dataSource={results} pagination={false} />
                        </>
                    )}
                </>
            )}

            <Modal
                title="Chi tiết văn bằng tốt nghiệp"
                open={!!viewItem}
                onCancel={() => setViewItem(null)}
                footer={<Button onClick={() => setViewItem(null)}>Đóng</Button>}
                width={680}
            >
                {viewItem && (() => {
                    const qd = quyetDinhList.find(q => q.id === viewItem.quyetDinhId);
                    const svb = soVanBangMap[qd?.soVanBangId || ''];
                    return (
                        <>
                            <Descriptions bordered column={2} size="small" style={{ marginBottom: 16 }}>
                                <Descriptions.Item label="Số vào sổ">{viewItem.soVaoSo}</Descriptions.Item>
                                <Descriptions.Item label="Số hiệu văn bằng"><Tag color="blue">{viewItem.soHieuVanBang}</Tag></Descriptions.Item>
                                <Descriptions.Item label="Mã sinh viên">{viewItem.maSV}</Descriptions.Item>
                                <Descriptions.Item label="Họ và tên"><b>{viewItem.hoTen}</b></Descriptions.Item>
                                <Descriptions.Item label="Ngày sinh">{dayjs(viewItem.ngaySinh).format('DD/MM/YYYY')}</Descriptions.Item>
                                <Descriptions.Item label="Sổ văn bằng">{svb || '—'}</Descriptions.Item>
                                {cauHinhList.map((c, idx) => (
                                    <Descriptions.Item key={c.id} label={c.ten}>
                                        {c.kieuDuLieu === 'Date' && viewItem[`cf${idx + 1}`]
                                            ? dayjs(viewItem[`cf${idx + 1}`]).format('DD/MM/YYYY')
                                            : viewItem[`cf${idx + 1}`] || '—'}
                                    </Descriptions.Item>
                                ))}
                            </Descriptions>
                            {qd && (
                                <Card size="small" title="Quyết định tốt nghiệp" style={{ background: '#f9fafb' }}>
                                    <Descriptions column={1} size="small">
                                        <Descriptions.Item label="Số QĐ"><Tag color="purple">{qd.soQD}</Tag></Descriptions.Item>
                                        <Descriptions.Item label="Ngày ban hành">{dayjs(qd.ngayBanHanh).format('DD/MM/YYYY')}</Descriptions.Item>
                                        <Descriptions.Item label="Trích yếu">{qd.trichYeu}</Descriptions.Item>
                                    </Descriptions>
                                </Card>
                            )}
                        </>
                    );
                })()}
            </Modal>
        </>
    );
};

export default TraCuu;