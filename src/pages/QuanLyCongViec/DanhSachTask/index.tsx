import React, { useEffect, useState, useMemo } from 'react';
import {
    Table,
    Button,
    Input,
    Select,
    Tag,
    Space,
    Popconfirm,
    Badge,
    Typography,
    Card,
    message,
    Tooltip,
} from 'antd';
import type { ColumnsType, TableProps } from 'antd/es/table';
import type { SorterResult } from 'antd/es/table/interface';
import {
    PlusOutlined,
    SearchOutlined,
    EditOutlined,
    DeleteOutlined,
    ProjectOutlined,
    FilterOutlined,
    CalendarOutlined,
    TagOutlined,
    WarningOutlined,
} from '@ant-design/icons';
import dayjs from 'dayjs';
import {
    Task,
    TrangThaiTask,
    UuTienTask,
    STORAGE_KEY,
    getFromStorage,
    saveToStorage,
    seedTasks,
    UU_TIEN_COLOR,
    TRANG_THAI_LABEL,
    TRANG_THAI_COLOR,
    TRANG_THAI_OPTIONS,
    UU_TIEN_OPTIONS,
    normalizeStr,
} from '../types';
import TaskForm from '../TaskForm';

const { Text, Title } = Typography;
const { Option } = Select;

const DanhSachTask: React.FC = () => {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [search, setSearch] = useState('');
    const [filterTrangThai, setFilterTrangThai] = useState<TrangThaiTask | ''>('');
    const [filterUuTien, setFilterUuTien] = useState<UuTienTask | ''>('');
    const [formVisible, setFormVisible] = useState(false);
    const [editingTask, setEditingTask] = useState<Task | null>(null);

    useEffect(() => {
        const stored = getFromStorage<Task[]>(STORAGE_KEY, []);
        if (stored.length) {
            setTasks(stored);
        } else {
            saveToStorage(STORAGE_KEY, seedTasks);
            setTasks(seedTasks);
        }
    }, []);

    const persist = (updated: Task[]) => {
        setTasks(updated);
        saveToStorage(STORAGE_KEY, updated);
    };

    const handleSubmit = (task: Task) => {
        if (editingTask) {
            persist(tasks.map((t) => (t.id === task.id ? task : t)));
            message.success('Đã cập nhật task');
        } else {
            persist([...tasks, task]);
            message.success('Đã thêm task mới');
        }
        setFormVisible(false);
        setEditingTask(null);
    };

    const handleDelete = (id: string) => {
        persist(tasks.filter((t) => t.id !== id));
        message.success('Đã xóa task');
    };

    const handleEdit = (task: Task) => {
        setEditingTask(task);
        setFormVisible(true);
    };

    const now = dayjs();

    const filtered = useMemo(() => {
        return tasks.filter((t) => {
            const matchSearch = search
                ? normalizeStr(t.tenTask).includes(normalizeStr(search)) ||
                normalizeStr(t.moTa).includes(normalizeStr(search))
                : true;
            const matchStatus = filterTrangThai ? t.trangThai === filterTrangThai : true;
            const matchPriority = filterUuTien ? t.uuTien === filterUuTien : true;
            return matchSearch && matchStatus && matchPriority;
        });
    }, [tasks, search, filterTrangThai, filterUuTien]);

    const columns: ColumnsType<Task> = [
        {
            title: '#',
            key: 'index',
            width: 50,
            render: (_: unknown, __: Task, idx: number) => (
                <Text type="secondary" style={{ fontSize: 12 }}>
                    {idx + 1}
                </Text>
            ),
        },
        {
            title: 'Tên task',
            dataIndex: 'tenTask',
            key: 'tenTask',
            sorter: (a, b) => a.tenTask.localeCompare(b.tenTask, 'vi'),
            render: (text: string, record: Task) => (
                <div>
                    <Text
                        strong
                        style={{
                            fontSize: 14,
                            textDecoration: record.trangThai === 'hoan-thanh' ? 'line-through' : 'none',
                            color: record.trangThai === 'hoan-thanh' ? '#aaa' : '#262626',
                        }}
                    >
                        {text}
                    </Text>
                    {record.moTa && (
                        <Text
                            type="secondary"
                            style={{ display: 'block', fontSize: 12, marginTop: 2 }}
                            ellipsis
                        >
                            {record.moTa}
                        </Text>
                    )}
                </div>
            ),
        },
        {
            title: 'Deadline',
            dataIndex: 'deadline',
            key: 'deadline',
            sorter: (a, b) => (a.deadline || '').localeCompare(b.deadline || ''),
            defaultSortOrder: 'ascend',
            width: 140,
            render: (d: string, record: Task) => {
                if (!d) return <Text type="secondary">—</Text>;
                const dl = dayjs(d);
                const isOverdue = record.trangThai !== 'hoan-thanh' && dl.isBefore(now, 'day');
                const isDueSoon =
                    !isOverdue &&
                    record.trangThai !== 'hoan-thanh' &&
                    dl.diff(now, 'day') <= 2;
                return (
                    <Tooltip title={isOverdue ? 'Quá hạn!' : isDueSoon ? 'Sắp hết hạn' : ''}>
                        <span
                            style={{
                                color: isOverdue ? '#ff4d4f' : isDueSoon ? '#faad14' : '#595959',
                                fontWeight: isOverdue || isDueSoon ? 600 : 400,
                                whiteSpace: 'nowrap',
                            }}
                        >
                            <CalendarOutlined style={{ marginRight: 5 }} />
                            {dl.format('DD/MM/YYYY')}
                            {isOverdue && <WarningOutlined style={{ marginLeft: 5 }} />}
                        </span>
                    </Tooltip>
                );
            },
        },
        {
            title: 'Ưu tiên',
            dataIndex: 'uuTien',
            key: 'uuTien',
            width: 110,
            sorter: (a, b) => {
                const order = { Cao: 0, 'Trung bình': 1, Thấp: 2 };
                return order[a.uuTien] - order[b.uuTien];
            },
            render: (u: UuTienTask) => (
                <Tag color={UU_TIEN_COLOR[u]} style={{ borderRadius: 8, fontWeight: 600 }}>
                    {u}
                </Tag>
            ),
        },
        {
            title: 'Trạng thái',
            dataIndex: 'trangThai',
            key: 'trangThai',
            width: 140,
            render: (tt: TrangThaiTask) => (
                <Badge
                    status={TRANG_THAI_COLOR[tt]}
                    text={
                        <Text style={{ fontSize: 13 }}>{TRANG_THAI_LABEL[tt]}</Text>
                    }
                />
            ),
        },
        {
            title: 'Tags',
            dataIndex: 'tags',
            key: 'tags',
            width: 180,
            render: (tags: string[]) => (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                    {tags.slice(0, 3).map((tag) => (
                        <Tag
                            key={tag}
                            icon={<TagOutlined />}
                            style={{
                                fontSize: 11,
                                borderRadius: 6,
                                margin: 0,
                                background: '#f5f5ff',
                                border: '1px solid #d9d9ff',
                                color: '#667eea',
                            }}
                        >
                            {tag}
                        </Tag>
                    ))}
                    {tags.length > 3 && (
                        <Tag style={{ fontSize: 11, borderRadius: 6, margin: 0 }}>+{tags.length - 3}</Tag>
                    )}
                </div>
            ),
        },
        {
            title: 'Thao tác',
            key: 'action',
            width: 100,
            fixed: 'right',
            render: (_: unknown, record: Task) => (
                <Space size={4}>
                    <Tooltip title="Chỉnh sửa">
                        <Button
                            size="small"
                            icon={<EditOutlined />}
                            onClick={() => handleEdit(record)}
                        />
                    </Tooltip>
                    <Popconfirm
                        title="Xóa task này? Hành động này không thể hoàn tác."
                        okText="Xóa"
                        cancelText="Hủy"
                        okButtonProps={{ danger: true }}
                        onConfirm={() => handleDelete(record.id)}
                    >
                        <Tooltip title="Xóa">
                            <Button
                                size="small"
                                danger
                                icon={<DeleteOutlined />}
                            />
                        </Tooltip>
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    return (
        <div style={{ padding: 24, background: '#f0f2f5', minHeight: '100vh' }}>
            <Card
                bordered={false}
                style={{ borderRadius: 16, boxShadow: '0 4px 16px rgba(0,0,0,0.08)', marginBottom: 20 }}
            >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12, marginBottom: 16 }}>
                    <Title level={3} style={{ margin: 0, display: 'flex', alignItems: 'center', gap: 10 }}>
                        <ProjectOutlined style={{ color: '#667eea' }} /> Danh sách Task
                    </Title>
                    <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        onClick={() => { setEditingTask(null); setFormVisible(true); }}
                    >
                        Thêm task
                    </Button>
                </div>

                <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
                    <FilterOutlined style={{ color: '#667eea', fontSize: 16 }} />
                    <Input
                        placeholder="Tìm kiếm tên task (không cần dấu)..."
                        prefix={<SearchOutlined style={{ color: '#bbb' }} />}
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        allowClear
                        style={{ width: 300, borderRadius: 8 }}
                    />
                    <Select
                        placeholder="Lọc trạng thái"
                        allowClear
                        value={filterTrangThai || undefined}
                        onChange={(v) => setFilterTrangThai(v || '')}
                        style={{ width: 160, borderRadius: 8 }}
                    >
                        {TRANG_THAI_OPTIONS.map((o) => (
                            <Option key={o.value} value={o.value}>
                                {o.label}
                            </Option>
                        ))}
                    </Select>
                    <Select
                        placeholder="Lọc ưu tiên"
                        allowClear
                        value={filterUuTien || undefined}
                        onChange={(v) => setFilterUuTien(v || '')}
                        style={{ width: 150, borderRadius: 8 }}
                    >
                        {UU_TIEN_OPTIONS.map((o) => (
                            <Option key={o.value} value={o.value}>
                                {o.label}
                            </Option>
                        ))}
                    </Select>
                    <Text type="secondary" style={{ marginLeft: 'auto', fontSize: 13 }}>
                        Hiển thị <Text strong>{filtered.length}</Text> / {tasks.length} task
                    </Text>
                </div>
            </Card>

            <Card
                bordered={false}
                style={{ borderRadius: 16, boxShadow: '0 4px 16px rgba(0,0,0,0.08)' }}
                bodyStyle={{ padding: 0 }}
            >
                <Table<Task>
                    dataSource={filtered}
                    columns={columns}
                    rowKey="id"
                    scroll={{ x: 900 }}
                    pagination={{
                        pageSize: 10,
                        showSizeChanger: true,
                        showQuickJumper: true,
                        showTotal: (total, range) => `${range[0]}-${range[1]} của ${total} task`,
                        style: { padding: '12px 20px' },
                    }}
                    style={{ borderRadius: 16 }}
                    rowClassName={(record) =>
                        record.trangThai !== 'hoan-thanh' &&
                            record.deadline &&
                            dayjs(record.deadline).isBefore(now, 'day')
                            ? 'task-overdue-row'
                            : ''
                    }
                />
            </Card>

            <TaskForm
                visible={formVisible}
                editing={editingTask}
                existingIds={tasks.map((t) => t.id)}
                onSubmit={handleSubmit}
                onCancel={() => { setFormVisible(false); setEditingTask(null); }}
            />

            <style>{`
                .task-overdue-row {
                    background: #fff1f0 !important;
                }
                .task-overdue-row:hover > td {
                    background: #ffe0de !important;
                }
            `}</style>
        </div>
    );
};

export default DanhSachTask;
