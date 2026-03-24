import React from 'react';
import { useModel } from 'umi';
import { Card, Row, Col, Table, Progress, Statistic } from 'antd';
import { BookOutlined, FileTextOutlined, SearchOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import type { QuyetDinhItem } from '../../models/vanBang';
import dayjs from 'dayjs';

const ThongKe: React.FC = () => {
    const { soVanBang, quyetDinh, vanBang } = useModel('vanBang');

    const totalVB = vanBang.length;
    const totalQD = quyetDinh.length;
    const totalLuot = quyetDinh.reduce((s, q) => s + (q.luotTraCuu || 0), 0);

    const sorted = [...quyetDinh].sort((a, b) => (b.luotTraCuu || 0) - (a.luotTraCuu || 0));

    const columns: ColumnsType<QuyetDinhItem> = [
        { title: 'Số QĐ', dataIndex: 'soQD', key: 'soQD', width: 140 },
        {
            title: 'Ngày ban hành', dataIndex: 'ngayBanHanh', key: 'ngayBanHanh', width: 140,
            render: v => dayjs(v).format('DD/MM/YYYY'),
        },
        { title: 'Trích yếu', dataIndex: 'trichYeu', key: 'trichYeu' },
        {
            title: 'Sổ văn bằng', dataIndex: 'soVanBangId', key: 'svb', width: 210,
            render: v => soVanBang.find(s => s.id === v)?.ten || '—',
        },
        {
            title: 'Số VB', key: 'countVB', width: 80,
            render: (_, record) => vanBang.filter(v => v.quyetDinhId === record.id).length,
        },
        {
            title: 'Lượt tra cứu', dataIndex: 'luotTraCuu', key: 'luotTraCuu', width: 220,
            sorter: (a, b) => (b.luotTraCuu || 0) - (a.luotTraCuu || 0),
            render: (v) => (
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <Progress
                        percent={totalLuot > 0 ? Math.round((v || 0) / totalLuot * 100) : 0}
                        size="small"
                        style={{ width: 130, margin: 0 }}
                    />
                    <b style={{ minWidth: 28, textAlign: 'right' }}>{v || 0}</b>
                </div>
            ),
        },
    ];

    return (
        <>
            <h2 style={{ marginBottom: 20 }}>Thống Kê</h2>

            <Row gutter={16} style={{ marginBottom: 24 }}>
                <Col span={8}>
                    <Card>
                        <Statistic
                            title="Tổng văn bằng"
                            value={totalVB}
                            prefix={<BookOutlined />}
                            valueStyle={{ color: '#4f46e5' }}
                        />
                    </Card>
                </Col>
                <Col span={8}>
                    <Card>
                        <Statistic
                            title="Quyết định tốt nghiệp"
                            value={totalQD}
                            prefix={<FileTextOutlined />}
                            valueStyle={{ color: '#059669' }}
                        />
                    </Card>
                </Col>
                <Col span={8}>
                    <Card>
                        <Statistic
                            title="Tổng lượt tra cứu"
                            value={totalLuot}
                            prefix={<SearchOutlined />}
                            valueStyle={{ color: '#d97706' }}
                        />
                    </Card>
                </Col>
            </Row>

            <Card title="Lượt tra cứu theo quyết định tốt nghiệp">
                <Table
                    rowKey="id"
                    columns={columns}
                    dataSource={sorted}
                    pagination={false}
                />
            </Card>
        </>
    );
};

export default ThongKe;