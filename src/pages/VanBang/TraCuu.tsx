import React, { useState, useMemo } from 'react';
import { useModel } from 'umi';
import { Button, Form, Input, DatePicker, Card, Table, Modal, Descriptions, Alert, Tag, Typography } from 'antd';
import { SearchOutlined, EyeOutlined, CheckCircleOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import type { VanBangItem } from '../../models/vanBang';
import dayjs from 'dayjs';

const { Text } = Typography;

const TraCuu: React.FC = () => {
    const { soVanBang, quyetDinh, vanBang, cauHinh, incrementLuotTraCuu } = useModel('vanBang');

    const [form] = Form.useForm();
    const [results, setResults] = useState<VanBangItem[] | null>(null);
    const [viewItem, setViewItem] = useState<VanBangItem | null>(null);

    const watchedValues = Form.useWatch([], form);
    const filledCount = useMemo(() => {
        if (!watchedValues) return 0;
        return Object.values(watchedValues).filter((v: any) => v !== undefined && v !== '' && v !== null).length;
    }, [watchedValues]);

    const handleSearch = async () => {
        const values = form.getFieldsValue();
        const filled = Object.values(values).filter((v: any) => v !== undefined && v !== '' && v !== null).length;
        if (filled < 2) return;

        const ngaySinhStr = values.ngaySinh ? values.ngaySinh.format('YYYY-MM-DD') : null;

        const r = vanBang.filter(v =>
            (!values.soHieuVanBang || v.soHieuVanBang.toLowerCase().includes(values.soHieuVanBang.toLowerCase())) &&
            (!values.soVaoSo || String(v.soVaoSo) === String(values.soVaoSo)) &&
            (!values.maSV || v.maSV.toLowerCase().includes(values.maSV.toLowerCase())) &&
            (!values.hoTen || v.hoTen.toLowerCase().includes(values.hoTen.toLowerCase())) &&
            (!ngaySinhStr || v.ngaySinh === ngaySinhStr)
        );
        setResults(r);
    };

    const handleView = (vb: VanBangItem) => {
        setViewItem(vb);
        incrementLuotTraCuu(vb.quyetDinhId);
    };

    const handleReset = () => {
        form.resetFields();
        setResults(null);
    };

    const columns: ColumnsType<VanBangItem> = [
        { title: 'Số hiệu VB', dataIndex: 'soHieuVanBang', key: 'soHieuVanBang', width: 130 },
        { title: 'Mã SV', dataIndex: 'maSV', key: 'maSV', width: 130 },
        { title: 'Họ và tên', dataIndex: 'hoTen', key: 'hoTen' },
        {
            title: 'Ngày sinh', dataIndex: 'ngaySinh', key: 'ngaySinh', width: 110,
            render: v => dayjs(v).format('DD/MM/YYYY'),
        },
        {
            title: 'Quyết định', dataIndex: 'quyetDinhId', key: 'qd', width: 140,
            render: v => <Tag color="purple">{quyetDinh.find(q => q.id === v)?.soQD || '—'}</Tag>,
        },
        {
            title: '', key: 'action', width: 110,
            render: (_, record) => (
                <Button type="primary" size="small" icon={<EyeOutlined />} onClick={() => handleView(record)}>
                    Xem chi tiết
                </Button>
            ),
        },
    ];

    return (
        <>
            <h2>Tra Cứu Văn Bằng</h2>

            <Card style={{ maxWidth: 700, marginBottom: 24 }}>
                {filledCount < 2 ? (
                    <Alert
                        message={`Vui lòng nhập ít nhất 2 tham số để tra cứu (hiện tại: ${filledCount}/2)`}
                        type="warning"
                        showIcon
                        style={{ marginBottom: 16 }}
                    />
                ) : (
                    <Alert
                        message={`Đã đủ điều kiện tra cứu (${filledCount} tham số)`}
                        type="success"
                        showIcon
                        icon={<CheckCircleOutlined />}
                        style={{ marginBottom: 16 }}
                    />
                )}

                <Form form={form} layout="vertical">
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
                            <DatePicker
                                style={{ width: '100%' }}
                                format="DD/MM/YYYY"
                                placeholder="Khớp chính xác ngày sinh"
                            />
                        </Form.Item>
                    </div>

                    <div style={{ display: 'flex', gap: 8 }}>
                        <Button
                            type="primary"
                            icon={<SearchOutlined />}
                            onClick={handleSearch}
                            disabled={filledCount < 2}
                            size="large"
                            style={{ flex: 1 }}
                        >
                            Tra cứu văn bằng
                        </Button>
                        {results !== null && (
                            <Button size="large" onClick={handleReset}>Xóa kết quả</Button>
                        )}
                    </div>
                </Form>
            </Card>

            {results !== null && (
                results.length === 0 ? (
                    <Alert
                        message="Không tìm thấy văn bằng nào khớp với thông tin đã nhập"
                        type="warning"
                        showIcon
                    />
                ) : (
                    <>
                        <Text type="secondary" style={{ display: 'block', marginBottom: 8 }}>
                            Tìm thấy <b>{results.length}</b> kết quả
                        </Text>
                        <Table rowKey="id" columns={columns} dataSource={results} pagination={false} />
                    </>
                )
            )}

            <Modal
                title="Chi tiết văn bằng tốt nghiệp"
                open={!!viewItem}
                onCancel={() => setViewItem(null)}
                footer={<Button onClick={() => setViewItem(null)}>Đóng</Button>}
                width={680}
            >
                {viewItem && (() => {
                    const qd = quyetDinh.find(q => q.id === viewItem.quyetDinhId);
                    const svb = soVanBang.find(s => s.id === qd?.soVanBangId);
                    return (
                        <>
                            <Descriptions bordered column={2} size="small" style={{ marginBottom: 16 }}>
                                <Descriptions.Item label="Số vào sổ">{viewItem.soVaoSo}</Descriptions.Item>
                                <Descriptions.Item label="Số hiệu văn bằng">
                                    <Tag color="blue">{viewItem.soHieuVanBang}</Tag>
                                </Descriptions.Item>
                                <Descriptions.Item label="Mã sinh viên">{viewItem.maSV}</Descriptions.Item>
                                <Descriptions.Item label="Họ và tên"><b>{viewItem.hoTen}</b></Descriptions.Item>
                                <Descriptions.Item label="Ngày sinh">
                                    {dayjs(viewItem.ngaySinh).format('DD/MM/YYYY')}
                                </Descriptions.Item>
                                <Descriptions.Item label="Sổ văn bằng">{svb?.ten || '—'}</Descriptions.Item>
                                {cauHinh.map(c => {
                                    const val = viewItem.extraFields?.[c.id];
                                    return (
                                        <Descriptions.Item key={c.id} label={c.ten}>
                                            {c.kieuDuLieu === 'Date' && val
                                                ? dayjs(val).format('DD/MM/YYYY')
                                                : (val !== undefined && val !== '' ? val : '—')}
                                        </Descriptions.Item>
                                    );
                                })}
                            </Descriptions>

                            {qd && (
                                <Card size="small" title="Thông tin quyết định tốt nghiệp" style={{ background: '#f9fafb' }}>
                                    <Descriptions column={1} size="small">
                                        <Descriptions.Item label="Số QĐ">
                                            <Tag color="purple">{qd.soQD}</Tag>
                                        </Descriptions.Item>
                                        <Descriptions.Item label="Ngày ban hành">
                                            {dayjs(qd.ngayBanHanh).format('DD/MM/YYYY')}
                                        </Descriptions.Item>
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