import React from 'react';
import { Card, Row, Col, Table, Progress, Statistic } from 'antd';
import { BookOutlined, FileTextOutlined, SearchOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';

const quyetDinhList = [
    { id: 'qd1', soQD: 'QĐ-01/2024', ngayBanHanh: '2024-06-15', trichYeu: 'Công nhận TN đợt 1 năm 2024', soVanBangId: 'svb2024', luotTraCuu: 12 },
    { id: 'qd2', soQD: 'QĐ-02/2024', ngayBanHanh: '2024-11-20', trichYeu: 'Công nhận TN đợt 2 năm 2024', soVanBangId: 'svb2024', luotTraCuu: 5 },
    { id: 'qd3', soQD: 'QĐ-01/2023', ngayBanHanh: '2023-07-10', trichYeu: 'Công nhận TN đợt 1 năm 2023', soVanBangId: 'svb2023', luotTraCuu: 30 },
];

const soVanBangMap: Record<string, string> = {
    svb2023: 'Sổ văn bằng năm 2023',
    svb2024: 'Sổ văn bằng năm 2024',
};

const vanBangCount = { qd1: 2, qd2: 1, qd3: 2 };

const ThongKe: React.FC = () => {
    const totalVB = Object.values(vanBangCount).reduce((a, b) => a + b, 0);
    const totalQD = quyetDinhList.length;
    const totalLuot = quyetDinhList.reduce((s, q) => s + q.luotTraCuu, 0);

    const sorted = [...quyetDinhList].sort((a, b) => b.luotTraCuu - a.luotTraCuu);

    const columns: ColumnsType<typeof quyetDinhList[0]> = [
        {
            title: 'Số QĐ', dataIndex: 'soQD', key: 'soQD', width: 140,
        },
        {
            title: 'Ngày ban hành', dataIndex: 'ngayBanHanh', key: 'ngayBanHanh', width: 140,
            render: v => dayjs(v).format('DD/MM/YYYY'),
        },
        { title: 'Trích yếu', dataIndex: 'trichYeu', key: 'trichYeu' },
        {
            title: 'Sổ văn bằng', dataIndex: 'soVanBangId', key: 'svb', width: 200,
            render: v => soVanBangMap[v] || '—',
        },
        {
            title: 'Số VB', key: 'vanBang', width: 80,
            render: (_, r) => vanBangCount[r.id as keyof typeof vanBangCount] || 0,
        },
        {
            title: 'Lượt tra cứu', dataIndex: 'luotTraCuu', key: 'luotTraCuu', width: 200,
            sorter: (a, b) => b.luotTraCuu - a.luotTraCuu,
            defaultSortOrder: 'ascend',
            render: (v) => (
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <Progress
                        percent={totalLuot > 0 ? Math.round(v / totalLuot * 100) : 0}
                        size="small"
                        style={{ width: 120, margin: 0 }}
                    />
                    <span style={{ minWidth: 28, textAlign: 'right', fontWeight: 600 }}>{v}</span>
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