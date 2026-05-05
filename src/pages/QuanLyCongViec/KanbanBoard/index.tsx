import React, { useEffect, useState } from 'react';
import { Card, Tag, Typography, Button, Popconfirm, Badge, Avatar, message } from 'antd';
import {
    PlusOutlined,
    EditOutlined,
    DeleteOutlined,
    CalendarOutlined,
    ProjectOutlined,
    TagOutlined,
    WarningOutlined,
} from '@ant-design/icons';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
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
    UU_TIEN_BG,
} from '../types';
import TaskForm from '../TaskForm';

const { Text, Title } = Typography;

interface KanbanCol {
    id: TrangThaiTask;
    title: string;
    gradient: string;
    headerColor: string;
    countColor: string;
}

const COLUMNS: KanbanCol[] = [
    {
        id: 'can-lam',
        title: 'Cần làm',
        gradient: 'linear-gradient(135deg,#f8f9fa,#e9ecef)',
        headerColor: '#495057',
        countColor: '#868e96',
    },
    {
        id: 'dang-lam',
        title: 'Đang làm',
        gradient: 'linear-gradient(135deg,#e8f4fd,#d0e8fb)',
        headerColor: '#1890ff',
        countColor: '#1890ff',
    },
    {
        id: 'hoan-thanh',
        title: 'Hoàn thành',
        gradient: 'linear-gradient(135deg,#e8f8f0,#c6f0db)',
        headerColor: '#52c41a',
        countColor: '#52c41a',
    },
];

const TaskCard: React.FC<{
    task: Task;
    index: number;
    onEdit: (t: Task) => void;
    onDelete: (id: string) => void;
}> = ({ task, index, onEdit, onDelete }) => {
    const now = dayjs();
    const isOverdue =
        task.trangThai !== 'hoan-thanh' && task.deadline && dayjs(task.deadline).isBefore(now, 'day');
    const isDueSoon =
        !isOverdue &&
        task.trangThai !== 'hoan-thanh' &&
        task.deadline &&
        dayjs(task.deadline).diff(now, 'day') <= 2;

    return (
        <Draggable draggableId={task.id} index={index}>
            {(provided, snapshot) => (
                <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    style={{
                        ...provided.draggableProps.style,
                        marginBottom: 12,
                    }}
                >
                    <Card
                        bordered={false}
                        size="small"
                        style={{
                            borderRadius: 12,
                            boxShadow: snapshot.isDragging
                                ? '0 12px 32px rgba(102,126,234,0.35)'
                                : '0 2px 10px rgba(0,0,0,0.08)',
                            background: '#fff',
                            border: snapshot.isDragging ? '2px solid #667eea' : '1.5px solid #f0f0f0',
                            transform: snapshot.isDragging ? 'rotate(2deg)' : 'none',
                            transition: 'box-shadow 0.2s, border 0.2s',
                            cursor: 'grab',
                        }}
                        bodyStyle={{ padding: '12px 14px' }}
                    >
                        <div
                            style={{
                                position: 'absolute',
                                left: 0,
                                top: 12,
                                bottom: 12,
                                width: 3,
                                borderRadius: '0 2px 2px 0',
                                background:
                                    task.uuTien === 'Cao'
                                        ? '#ff4d4f'
                                        : task.uuTien === 'Trung bình'
                                            ? '#faad14'
                                            : '#52c41a',
                            }}
                        />

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                            <Text
                                strong
                                style={{
                                    fontSize: 14,
                                    lineHeight: 1.4,
                                    flex: 1,
                                    marginRight: 8,
                                    textDecoration: task.trangThai === 'hoan-thanh' ? 'line-through' : 'none',
                                    color: task.trangThai === 'hoan-thanh' ? '#aaa' : '#262626',
                                }}
                            >
                                {task.tenTask}
                            </Text>
                            <div style={{ display: 'flex', gap: 4, flexShrink: 0 }}>
                                <Button
                                    size="small"
                                    icon={<EditOutlined />}
                                    onClick={(e) => { e.stopPropagation(); onEdit(task); }}
                                />
                                <Popconfirm
                                    title="Xóa task này?"
                                    okText="Xóa"
                                    cancelText="Hủy"
                                    onConfirm={(e) => { e?.stopPropagation(); onDelete(task.id); }}
                                    okButtonProps={{ danger: true }}
                                >
                                    <Button
                                        size="small"
                                        danger
                                        icon={<DeleteOutlined />}
                                        onClick={(e) => e.stopPropagation()}
                                    />
                                </Popconfirm>
                            </div>
                        </div>

                        {task.moTa && (
                            <Text
                                type="secondary"
                                style={{ fontSize: 12, display: 'block', marginBottom: 10, lineHeight: 1.5 }}
                                ellipsis={{ rows: 2 } as any}
                            >
                                {task.moTa}
                            </Text>
                        )}

                        {task.tags.length > 0 && (
                            <div style={{ marginBottom: 8, display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                                {task.tags.slice(0, 3).map((tag) => (
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
                                {task.tags.length > 3 && (
                                    <Tag style={{ fontSize: 11, borderRadius: 6, margin: 0 }}>
                                        +{task.tags.length - 3}
                                    </Tag>
                                )}
                            </div>
                        )}

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ fontSize: 11, color: isOverdue ? '#ff4d4f' : isDueSoon ? '#faad14' : '#8c8c8c' }}>
                                <CalendarOutlined style={{ marginRight: 4 }} />
                                {task.deadline ? dayjs(task.deadline).format('DD/MM/YYYY') : '—'}
                                {isOverdue && <WarningOutlined style={{ marginLeft: 4 }} />}
                            </span>
                            <Tag
                                color={UU_TIEN_COLOR[task.uuTien]}
                                style={{ fontSize: 10, borderRadius: 6, margin: 0, padding: '0 6px' }}
                            >
                                {task.uuTien}
                            </Tag>
                        </div>
                    </Card>
                </div>
            )}
        </Draggable>
    );
};

const KanbanBoard: React.FC = () => {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [formVisible, setFormVisible] = useState(false);
    const [editingTask, setEditingTask] = useState<Task | null>(null);
    const [defaultStatus, setDefaultStatus] = useState<TrangThaiTask>('can-lam');

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

    const onDragEnd = (result: DropResult) => {
        const { destination, source, draggableId } = result;
        if (!destination) return;
        if (destination.droppableId === source.droppableId && destination.index === source.index) return;

        const newStatus = destination.droppableId as TrangThaiTask;
        const updated = tasks.map((t) =>
            t.id === draggableId ? { ...t, trangThai: newStatus } : t,
        );
        persist(updated);
        message.success(`Task đã chuyển sang "${TRANG_THAI_LABEL[newStatus]}"`, 1.5);
    };

    const handleEdit = (task: Task) => {
        setEditingTask(task);
        setFormVisible(true);
    };

    const handleDelete = (id: string) => {
        persist(tasks.filter((t) => t.id !== id));
        message.success('Đã xóa task');
    };

    const handleAddInColumn = (status: TrangThaiTask) => {
        setDefaultStatus(status);
        setEditingTask(null);
        setFormVisible(true);
    };

    const handleSubmit = (task: Task) => {
        if (editingTask) {
            persist(tasks.map((t) => (t.id === task.id ? task : t)));
            message.success('Đã cập nhật task');
        } else {
            const finalTask = editingTask === null ? { ...task, trangThai: defaultStatus } : task;
            persist([...tasks, finalTask]);
            message.success('Đã thêm task mới');
        }
        setFormVisible(false);
        setEditingTask(null);
    };

    const getColTasks = (status: TrangThaiTask) =>
        tasks.filter((t) => t.trangThai === status);

    return (
        <div style={{ padding: 24, background: '#f0f2f5', minHeight: '100vh' }}>
            <Card
                bordered={false}
                style={{ borderRadius: 16, boxShadow: '0 4px 16px rgba(0,0,0,0.08)', marginBottom: 24 }}
            >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
                    <Title level={3} style={{ margin: 0, display: 'flex', alignItems: 'center', gap: 10 }}>
                        <ProjectOutlined style={{ color: '#667eea' }} /> Kanban Board
                    </Title>
                    <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        onClick={() => { setDefaultStatus('can-lam'); setEditingTask(null); setFormVisible(true); }}
                    >
                        Thêm task
                    </Button>
                </div>
            </Card>

            <DragDropContext onDragEnd={onDragEnd}>
                <div
                    style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(3, 1fr)',
                        gap: 20,
                        alignItems: 'start',
                    }}
                >
                    {COLUMNS.map((col) => {
                        const colTasks = getColTasks(col.id);
                        return (
                            <div key={col.id}>
                                <div
                                    style={{
                                        background: col.gradient,
                                        borderRadius: '14px 14px 0 0',
                                        padding: '14px 18px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                        borderBottom: `2px solid ${col.headerColor}30`,
                                    }}
                                >
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                        <Text strong style={{ fontSize: 15, color: col.headerColor }}>
                                            {col.title}
                                        </Text>
                                        <Avatar
                                            size={22}
                                            style={{
                                                background: col.headerColor,
                                                fontSize: 11,
                                                fontWeight: 700,
                                            }}
                                        >
                                            {colTasks.length}
                                        </Avatar>
                                    </div>
                                    <Button
                                        type="text"
                                        size="small"
                                        icon={<PlusOutlined />}
                                        onClick={() => handleAddInColumn(col.id)}
                                        style={{ color: col.headerColor, fontWeight: 600 }}
                                    >
                                        Thêm
                                    </Button>
                                </div>

                                <Droppable droppableId={col.id}>
                                    {(provided, snapshot) => (
                                        <div
                                            ref={provided.innerRef}
                                            {...provided.droppableProps}
                                            style={{
                                                background: snapshot.isDraggingOver
                                                    ? 'rgba(102,126,234,0.06)'
                                                    : col.gradient,
                                                borderRadius: '0 0 14px 14px',
                                                padding: '12px',
                                                minHeight: 320,
                                                border: snapshot.isDraggingOver
                                                    ? '2px dashed #667eea'
                                                    : '2px solid transparent',
                                                transition: 'background 0.2s, border 0.2s',
                                            }}
                                        >
                                            {colTasks.length === 0 && !snapshot.isDraggingOver && (
                                                <div
                                                    style={{
                                                        textAlign: 'center',
                                                        padding: '40px 0',
                                                        color: '#c0c0c0',
                                                    }}
                                                >
                                                    <ProjectOutlined style={{ fontSize: 28, display: 'block', marginBottom: 8 }} />
                                                    <Text type="secondary" style={{ fontSize: 12 }}>
                                                        Kéo task vào đây
                                                    </Text>
                                                </div>
                                            )}
                                            {colTasks.map((task, index) => (
                                                <TaskCard
                                                    key={task.id}
                                                    task={task}
                                                    index={index}
                                                    onEdit={handleEdit}
                                                    onDelete={handleDelete}
                                                />
                                            ))}
                                            {provided.placeholder}
                                        </div>
                                    )}
                                </Droppable>
                            </div>
                        );
                    })}
                </div>
            </DragDropContext>

            <TaskForm
                visible={formVisible}
                editing={editingTask}
                existingIds={tasks.map((t) => t.id)}
                onSubmit={handleSubmit}
                onCancel={() => { setFormVisible(false); setEditingTask(null); }}
            />
        </div>
    );
};

export default KanbanBoard;
