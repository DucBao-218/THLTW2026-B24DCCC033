import React, { useEffect, useState } from 'react';
import { Row, Col, Card, Tag, Typography, Badge, Table, Button } from 'antd';
import {
    ProjectOutlined,
    CheckCircleOutlined,
    ClockCircleOutlined,
    UnorderedListOutlined,
    PlusOutlined,
    WarningOutlined,
    CalendarOutlined,
    FlagOutlined,
} from '@ant-design/icons';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import dayjs from 'dayjs';
import {
    Task,
    STORAGE_KEY,
    getFromStorage,
    saveToStorage,
    seedTasks,
    UU_TIEN_COLOR,
    TRANG_THAI_LABEL,
    TRANG_THAI_COLOR,
    GRADIENTS,
} from '../types';
import TaskForm from '../TaskForm';

const { Title, Text } = Typography;

const StatCard: React.FC<{
    title: string;
    value: number | string;
    icon: React.ReactNode;
    gradient: string;
    suffix?: string;
    extra?: React.ReactNode;
}> = ({ title, value, icon, gradient, suffix, extra }) => (
    <Card
        bordered={false}
        style={{ background: gradient, borderRadius: 16, boxShadow: '0 8px 24px rgba(0,0,0,0.12)' }}
        bodyStyle={{ padding: '20px 24px' }}
    >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
                <Text style={{ color: 'rgba(255,255,255,0.85)', fontSize: 13, display: 'block', marginBottom: 8 }}>
                    {title}
                </Text>
                <div style={{ fontSize: 36, fontWeight: 800, color: '#fff', lineHeight: 1.1 }}>
                    {value}
                    {suffix && <span style={{ fontSize: 16, marginLeft: 6, fontWeight: 500 }}>{suffix}</span>}
                </div>
                {extra && <div style={{ marginTop: 8 }}>{extra}</div>}
            </div>
            <div
                style={{
                    width: 48,
                    height: 48,
                    borderRadius: 12,
                    background: 'rgba(255,255,255,0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 22,
                    color: '#fff',
                }}
            >
                {icon}
            </div>
        </div>
    </Card>
);

const PIE_COLORS = ['#ff4d4f', '#faad14', '#52c41a'];

const Dashboard: React.FC = () => {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [formVisible, setFormVisible] = useState(false);

    useEffect(() => {
        const stored = getFromStorage<Task[]>(STORAGE_KEY, []);
        if (stored.length) {
            setTasks(stored);
        } else {
            saveToStorage(STORAGE_KEY, seedTasks);
            setTasks(seedTasks);
        }
    }, []);

    const now = dayjs();
    const total = tasks.length;
    const hoanThanh = tasks.filter((t) => t.trangThai === 'hoan-thanh').length;
    const quaHan = tasks.filter(
        (t) => t.trangThai !== 'hoan-thanh' && t.deadline && dayjs(t.deadline).isBefore(now, 'day'),
    ).length;
    const dangLam = tasks.filter((t) => t.trangThai === 'dang-lam').length;

    const sapHetHan = [...tasks]
        .filter((t) => {
            if (t.trangThai === 'hoan-thanh') return false;
            const dl = dayjs(t.deadline);
            return dl.isAfter(now.subtract(1, 'day')) && dl.isBefore(now.add(8, 'day'));
        })
        .sort((a, b) => a.deadline.localeCompare(b.deadline))
        .slice(0, 5);

    const pieData = [
        { name: 'Cao', value: tasks.filter((t) => t.uuTien === 'Cao').length },
        { name: 'Trung bình', value: tasks.filter((t) => t.uuTien === 'Trung bình').length },
        { name: 'Thấp', value: tasks.filter((t) => t.uuTien === 'Thấp').length },
    ].filter((d) => d.value > 0);

    const handleAddTask = (task: Task) => {
        const updated = [...tasks, task];
        setTasks(updated);
        saveToStorage(STORAGE_KEY, updated);
        setFormVisible(false);
    };

    const columns = [
        {
            title: 'Tên task',
            dataIndex: 'tenTask',
            key: 'tenTask',
            render: (text: string) => <Text strong>{text}</Text>,
        },
        {
            title: 'Deadline',
            dataIndex: 'deadline',
            key: 'deadline',
            render: (d: string) => {
                const isOverdue = dayjs(d).isBefore(now, 'day');
                return (
                    <span style={{ color: isOverdue ? '#ff4d4f' : '#faad14', fontWeight: 600 }}>
                        <CalendarOutlined style={{ marginRight: 4 }} />
                        {dayjs(d).format('DD/MM/YYYY')}
                        {isOverdue && <WarningOutlined style={{ marginLeft: 6, color: '#ff4d4f' }} />}
                    </span>
                );
            },
        },
        {
            title: 'Ưu tiên',
            dataIndex: 'uuTien',
            key: 'uuTien',
            render: (u: string) => <Tag color={UU_TIEN_COLOR[u as keyof typeof UU_TIEN_COLOR]}>{u}</Tag>,
        },
        {
            title: 'Trạng thái',
            dataIndex: 'trangThai',
            key: 'trangThai',
            render: (tt: string) => (
                <Badge
                    status={TRANG_THAI_COLOR[tt as keyof typeof TRANG_THAI_COLOR] as any}
                    text={TRANG_THAI_LABEL[tt as keyof typeof TRANG_THAI_LABEL]}
                />
            ),
        },
    ];

    return (
        <div style={{ padding: 24, background: '#f0f2f5', minHeight: '100vh' }}>
            <Card
                bordered={false}
                style={{ borderRadius: 16, boxShadow: '0 4px 16px rgba(0,0,0,0.08)', marginBottom: 24 }}
            >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
                    <Title level={3} style={{ margin: 0, display: 'flex', alignItems: 'center', gap: 10 }}>
                        <ProjectOutlined style={{ color: '#667eea' }} /> Task Dashboard
                    </Title>
                    <Button type="primary" icon={<PlusOutlined />} onClick={() => setFormVisible(true)}>
                        Thêm task
                    </Button>
                </div>
            </Card>

            <Row gutter={[20, 20]} style={{ marginBottom: 28 }}>
                <Col xs={24} sm={12} xl={6}>
                    <StatCard
                        title="Tổng số task"
                        value={total}
                        suffix="task"
                        icon={<UnorderedListOutlined />}
                        gradient={GRADIENTS.blue}
                    />
                </Col>
                <Col xs={24} sm={12} xl={6}>
                    <StatCard
                        title="Hoàn thành"
                        value={hoanThanh}
                        suffix="task"
                        icon={<CheckCircleOutlined />}
                        gradient={GRADIENTS.green}
                        extra={
                            <Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: 12 }}>
                                {total > 0 ? Math.round((hoanThanh / total) * 100) : 0}% tổng số
                            </Text>
                        }
                    />
                </Col>
                <Col xs={24} sm={12} xl={6}>
                    <StatCard
                        title="Đang thực hiện"
                        value={dangLam}
                        suffix="task"
                        icon={<FlagOutlined />}
                        gradient={GRADIENTS.cyan}
                    />
                </Col>
                <Col xs={24} sm={12} xl={6}>
                    <StatCard
                        title="Quá hạn"
                        value={quaHan}
                        suffix="task"
                        icon={<ClockCircleOutlined />}
                        gradient={GRADIENTS.red}
                    />
                </Col>
            </Row>

            <Row gutter={[20, 20]}>
                <Col xs={24} lg={10}>
                    <Card
                        bordered={false}
                        style={{ borderRadius: 16, boxShadow: '0 4px 16px rgba(0,0,0,0.08)', height: '100%' }}
                        title={
                            <span style={{ fontWeight: 700, display: 'flex', alignItems: 'center', gap: 8 }}>
                                <FlagOutlined style={{ color: '#667eea' }} />
                                Phân bố theo mức ưu tiên
                            </span>
                        }
                    >
                        {pieData.length > 0 ? (
                            <ResponsiveContainer width="100%" height={260}>
                                <PieChart>
                                    <Pie
                                        data={pieData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={100}
                                        paddingAngle={4}
                                        dataKey="value"
                                        label={({ name, value }) => `${name}: ${value}`}
                                        labelLine={false}
                                    >
                                        {pieData.map((_, index) => (
                                            <Cell key={index} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip formatter={(v: number) => [`${v} task`, '']} />
                                    <Legend />
                                </PieChart>
                            </ResponsiveContainer>
                        ) : (
                            <div style={{ textAlign: 'center', padding: '60px 0', color: '#bbb' }}>
                                Chưa có dữ liệu
                            </div>
                        )}
                    </Card>
                </Col>

                <Col xs={24} lg={14}>
                    <Card
                        bordered={false}
                        style={{ borderRadius: 16, boxShadow: '0 4px 16px rgba(0,0,0,0.08)' }}
                        title={
                            <span style={{ fontWeight: 700, display: 'flex', alignItems: 'center', gap: 8 }}>
                                <ClockCircleOutlined style={{ color: '#f5576c' }} />
                                Task sắp hết hạn (7 ngày tới)
                            </span>
                        }
                    >
                        {sapHetHan.length === 0 ? (
                            <div style={{ textAlign: 'center', padding: '40px 0', color: '#bbb' }}>
                                <CheckCircleOutlined style={{ fontSize: 40, color: '#52c41a', marginBottom: 12, display: 'block' }} />
                                Không có task nào sắp hết hạn 🎉
                            </div>
                        ) : (
                            <Table
                                dataSource={sapHetHan}
                                columns={columns}
                                rowKey="id"
                                pagination={false}
                                size="small"
                                style={{ borderRadius: 8 }}
                            />
                        )}
                    </Card>
                </Col>
            </Row>

            <TaskForm
                visible={formVisible}
                editing={null}
                existingIds={tasks.map((t) => t.id)}
                onSubmit={handleAddTask}
                onCancel={() => setFormVisible(false)}
            />
        </div>
    );
};

export default Dashboard;
