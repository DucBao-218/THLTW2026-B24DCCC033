import React, { useEffect, useState } from 'react';
import { Row, Col, Card, Tag, Typography, Badge, Table, Button, Progress } from 'antd';
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
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import dayjs from 'dayjs';
import {
    Task,
    TrangThaiTask,
    STORAGE_KEY,
    getFromStorage,
    saveToStorage,
    seedTasks,
    UU_TIEN_COLOR,
    TRANG_THAI_LABEL,
    TRANG_THAI_COLOR,
} from '../types';
import TaskForm from '../TaskForm';

const { Title, Text } = Typography;

interface StatCardProps {
    title: string;
    value: number | string;
    icon: React.ReactNode;
    accentColor: string;
    bgColor: string;
    suffix?: string;
    extra?: React.ReactNode;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, accentColor, bgColor, suffix, extra }) => (
    <Card
        bordered={false}
        style={{
            borderRadius: 12,
            boxShadow: '0 2px 12px rgba(0,0,0,0.07)',
            borderLeft: `4px solid ${accentColor}`,
        }}
        bodyStyle={{ padding: '18px 20px' }}
    >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
                <Text type="secondary" style={{ fontSize: 12, display: 'block', marginBottom: 6 }}>
                    {title}
                </Text>
                <div style={{ fontSize: 30, fontWeight: 700, color: '#262626', lineHeight: 1 }}>
                    {value}
                    {suffix && <span style={{ fontSize: 14, marginLeft: 5, fontWeight: 400, color: '#8c8c8c' }}>{suffix}</span>}
                </div>
                {extra && <div style={{ marginTop: 6 }}>{extra}</div>}
            </div>
            <div
                style={{
                    width: 44,
                    height: 44,
                    borderRadius: 10,
                    background: bgColor,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 20,
                    color: accentColor,
                    flexShrink: 0,
                }}
            >
                {icon}
            </div>
        </div>
    </Card>
);

const STAT_CONFIG = [
    { key: 'total', title: 'Tổng số task', icon: <UnorderedListOutlined />, accentColor: '#667eea', bgColor: '#f0f0ff' },
    { key: 'done', title: 'Hoàn thành', icon: <CheckCircleOutlined />, accentColor: '#52c41a', bgColor: '#f6ffed' },
    { key: 'inprogress', title: 'Đang thực hiện', icon: <FlagOutlined />, accentColor: '#1890ff', bgColor: '#e6f7ff' },
    { key: 'overdue', title: 'Quá hạn', icon: <ClockCircleOutlined />, accentColor: '#ff4d4f', bgColor: '#fff1f0' },
];

const PIE_CONFIG = [
    { name: 'Cao', color: '#ff4d4f', bg: '#fff1f0' },
    { name: 'Trung bình', color: '#faad14', bg: '#fffbe6' },
    { name: 'Thấp', color: '#52c41a', bg: '#f6ffed' },
];

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
    const pctDone = total > 0 ? Math.round((hoanThanh / total) * 100) : 0;

    const statValues: Record<string, number> = {
        total,
        done: hoanThanh,
        inprogress: dangLam,
        overdue: quaHan,
    };

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
    ];

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
            render: (text: string) => <Text strong style={{ fontSize: 13 }}>{text}</Text>,
        },
        {
            title: 'Deadline',
            dataIndex: 'deadline',
            key: 'deadline',
            width: 130,
            render: (d: string) => {
                const isOverdue = dayjs(d).isBefore(now, 'day');
                return (
                    <span style={{ color: isOverdue ? '#ff4d4f' : '#faad14', fontWeight: 600, fontSize: 12 }}>
                        <CalendarOutlined style={{ marginRight: 4 }} />
                        {dayjs(d).format('DD/MM/YYYY')}
                        {isOverdue && <WarningOutlined style={{ marginLeft: 5 }} />}
                    </span>
                );
            },
        },
        {
            title: 'Ưu tiên',
            dataIndex: 'uuTien',
            key: 'uuTien',
            width: 100,
            render: (u: string) => <Tag color={UU_TIEN_COLOR[u as keyof typeof UU_TIEN_COLOR]}>{u}</Tag>,
        },
        {
            title: 'Trạng thái',
            dataIndex: 'trangThai',
            key: 'trangThai',
            width: 130,
            render: (tt: TrangThaiTask) => (
                <Badge
                    status={TRANG_THAI_COLOR[tt]}
                    text={<Text style={{ fontSize: 12 }}>{TRANG_THAI_LABEL[tt]}</Text>}
                />
            ),
        },
    ];

    return (
        <div style={{ padding: 24, background: '#f0f2f5', minHeight: '100vh' }}>
            <Card
                bordered={false}
                style={{ borderRadius: 16, boxShadow: '0 4px 16px rgba(0,0,0,0.08)', marginBottom: 20 }}
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

            <Row gutter={[16, 16]} style={{ marginBottom: 20 }}>
                {STAT_CONFIG.map((cfg) => (
                    <Col key={cfg.key} xs={24} sm={12} xl={6}>
                        <StatCard
                            title={cfg.title}
                            value={statValues[cfg.key]}
                            suffix="task"
                            icon={cfg.icon}
                            accentColor={cfg.accentColor}
                            bgColor={cfg.bgColor}
                            extra={
                                cfg.key === 'done' && total > 0 ? (
                                    <Progress
                                        percent={pctDone}
                                        size="small"
                                        strokeColor={cfg.accentColor}
                                        showInfo={false}
                                        style={{ marginBottom: 0 }}
                                    />
                                ) : undefined
                            }
                        />
                    </Col>
                ))}
            </Row>

            <Row gutter={[16, 16]}>
                <Col xs={24} lg={10}>
                    <Card
                        bordered={false}
                        style={{ borderRadius: 16, boxShadow: '0 2px 12px rgba(0,0,0,0.07)', height: '100%' }}
                        title={
                            <span style={{ fontWeight: 700, display: 'flex', alignItems: 'center', gap: 8 }}>
                                <FlagOutlined style={{ color: '#667eea' }} />
                                Phân bố theo mức ưu tiên
                            </span>
                        }
                    >
                        {total > 0 ? (
                            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                                <div style={{ position: 'relative', flexShrink: 0 }}>
                                    <ResponsiveContainer width={160} height={160}>
                                        <PieChart>
                                            <Pie
                                                data={pieData}
                                                cx="50%"
                                                cy="50%"
                                                innerRadius={48}
                                                outerRadius={72}
                                                paddingAngle={3}
                                                dataKey="value"
                                                startAngle={90}
                                                endAngle={-270}
                                            >
                                                {pieData.map((entry, index) => {
                                                    const cfg = PIE_CONFIG.find((c) => c.name === entry.name);
                                                    return <Cell key={index} fill={cfg?.color ?? '#ccc'} />;
                                                })}
                                            </Pie>
                                            <Tooltip
                                                formatter={(v: number, name: string) => [`${v} task`, name]}
                                                contentStyle={{ borderRadius: 8, fontSize: 13 }}
                                            />
                                        </PieChart>
                                    </ResponsiveContainer>
                                    <div style={{
                                        position: 'absolute', top: '50%', left: '50%',
                                        transform: 'translate(-50%, -50%)',
                                        textAlign: 'center', pointerEvents: 'none',
                                    }}>
                                        <div style={{ fontSize: 22, fontWeight: 800, color: '#262626', lineHeight: 1 }}>{total}</div>
                                        <div style={{ fontSize: 11, color: '#8c8c8c', marginTop: 2 }}>tổng</div>
                                    </div>
                                </div>

                                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 10 }}>
                                    {PIE_CONFIG.map((cfg) => {
                                        const count = tasks.filter((t) => t.uuTien === cfg.name).length;
                                        const pct = total > 0 ? Math.round((count / total) * 100) : 0;
                                        return (
                                            <div
                                                key={cfg.name}
                                                style={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: 10,
                                                    padding: '8px 12px',
                                                    borderRadius: 8,
                                                    background: cfg.bg,
                                                    border: `1px solid ${cfg.color}30`,
                                                }}
                                            >
                                                <div style={{
                                                    width: 10, height: 10, borderRadius: '50%',
                                                    background: cfg.color, flexShrink: 0,
                                                }} />
                                                <Text style={{ fontSize: 13, fontWeight: 600, flex: 1, color: '#262626' }}>
                                                    {cfg.name}
                                                </Text>
                                                <Text style={{ fontSize: 13, fontWeight: 700, color: cfg.color }}>
                                                    {count}
                                                </Text>
                                                <Text type="secondary" style={{ fontSize: 11, minWidth: 32, textAlign: 'right' }}>
                                                    {pct}%
                                                </Text>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        ) : (
                            <div style={{ textAlign: 'center', padding: '60px 0', color: '#bbb' }}>Chưa có dữ liệu</div>
                        )}
                    </Card>
                </Col>

                <Col xs={24} lg={14}>
                    <Card
                        bordered={false}
                        style={{ borderRadius: 16, boxShadow: '0 2px 12px rgba(0,0,0,0.07)' }}
                        title={
                            <span style={{ fontWeight: 700, display: 'flex', alignItems: 'center', gap: 8 }}>
                                <ClockCircleOutlined style={{ color: '#ff4d4f' }} />
                                Task sắp hết hạn (7 ngày tới)
                            </span>
                        }
                    >
                        {sapHetHan.length === 0 ? (
                            <div style={{ textAlign: 'center', padding: '40px 0', color: '#bbb' }}>
                                <CheckCircleOutlined style={{ fontSize: 36, color: '#52c41a', marginBottom: 10, display: 'block' }} />
                                Không có task nào sắp hết hạn 🎉
                            </div>
                        ) : (
                            <Table
                                dataSource={sapHetHan}
                                columns={columns}
                                rowKey="id"
                                pagination={false}
                                size="small"
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
