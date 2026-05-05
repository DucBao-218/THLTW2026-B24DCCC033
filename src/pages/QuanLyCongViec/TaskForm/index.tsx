import React, { useEffect } from 'react';
import { Modal, Form, Input, Select, DatePicker, Typography } from 'antd';
import {
    TagOutlined,
    CalendarOutlined,
    FileTextOutlined,
    FlagOutlined,
} from '@ant-design/icons';
import dayjs from 'dayjs';
import { Task, UuTienTask, TrangThaiTask, UU_TIEN_OPTIONS, TRANG_THAI_OPTIONS, generateId } from '../types';

const { TextArea } = Input;
const { Option } = Select;
const { Text } = Typography;

interface TaskFormProps {
    visible: boolean;
    editing: Task | null;
    existingIds: string[];
    onSubmit: (task: Task) => void;
    onCancel: () => void;
}

const TaskForm: React.FC<TaskFormProps> = ({ visible, editing, existingIds, onSubmit, onCancel }) => {
    const [form] = Form.useForm();

    useEffect(() => {
        if (!visible) return;
        if (editing) {
            form.setFieldsValue({
                tenTask: editing.tenTask,
                moTa: editing.moTa,
                deadline: editing.deadline ? dayjs(editing.deadline) : undefined,
                uuTien: editing.uuTien,
                trangThai: editing.trangThai,
                tags: editing.tags,
            });
        } else {
            form.resetFields();
            form.setFieldsValue({ trangThai: 'can-lam', uuTien: 'Trung bình' });
        }
    }, [visible, editing, form]);

    const handleOk = () => {
        form.validateFields().then((values) => {
            const task: Task = {
                id: editing ? editing.id : generateId(existingIds),
                tenTask: values.tenTask.trim(),
                moTa: values.moTa?.trim() || '',
                deadline: values.deadline ? values.deadline.format('YYYY-MM-DD') : '',
                trangThai: values.trangThai as TrangThaiTask,
                uuTien: values.uuTien as UuTienTask,
                tags: values.tags || [],
                ngayTao: editing ? editing.ngayTao : new Date().toISOString(),
            };
            onSubmit(task);
            form.resetFields();
        });
    };

    const handleCancel = () => {
        form.resetFields();
        onCancel();
    };

    return (
        <Modal
            title={
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div
                        style={{
                            width: 32,
                            height: 32,
                            borderRadius: 8,
                            background: 'linear-gradient(135deg,#667eea,#764ba2)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        <FileTextOutlined style={{ color: '#fff', fontSize: 15 }} />
                    </div>
                    <Text strong style={{ fontSize: 16 }}>
                        {editing ? 'Chỉnh sửa task' : 'Thêm task mới'}
                    </Text>
                </div>
            }
            visible={visible}
            onOk={handleOk}
            onCancel={handleCancel}
            okText={editing ? 'Cập nhật' : 'Thêm task'}
            cancelText="Hủy"
            width={560}
            bodyStyle={{ paddingTop: 8 }}
        >
            <Form form={form} layout="vertical" style={{ marginTop: 8 }}>
                <Form.Item
                    name="tenTask"
                    label={
                        <span style={{ fontWeight: 600 }}>
                            <FileTextOutlined style={{ marginRight: 6, color: '#667eea' }} />
                            Tên task
                        </span>
                    }
                    rules={[{ required: true, message: 'Vui lòng nhập tên task' }]}
                >
                    <Input
                        placeholder="VD: Thiết kế giao diện Dashboard"
                        style={{ borderRadius: 8 }}
                        allowClear
                    />
                </Form.Item>

                <Form.Item
                    name="moTa"
                    label={
                        <span style={{ fontWeight: 600 }}>
                            <FileTextOutlined style={{ marginRight: 6, color: '#667eea' }} />
                            Mô tả
                        </span>
                    }
                >
                    <TextArea
                        rows={3}
                        placeholder="Mô tả chi tiết công việc..."
                        style={{ borderRadius: 8, resize: 'none' }}
                    />
                </Form.Item>

                <div style={{ display: 'flex', gap: 16 }}>
                    <Form.Item
                        name="deadline"
                        label={
                            <span style={{ fontWeight: 600 }}>
                                <CalendarOutlined style={{ marginRight: 6, color: '#667eea' }} />
                                Deadline
                            </span>
                        }
                        style={{ flex: 1 }}
                        rules={[{ required: true, message: 'Chọn deadline' }]}
                    >
                        <DatePicker
                            format="DD/MM/YYYY"
                            style={{ width: '100%', borderRadius: 8 }}
                            placeholder="Chọn ngày hết hạn"
                        />
                    </Form.Item>

                    <Form.Item
                        name="uuTien"
                        label={
                            <span style={{ fontWeight: 600 }}>
                                <FlagOutlined style={{ marginRight: 6, color: '#667eea' }} />
                                Ưu tiên
                            </span>
                        }
                        style={{ flex: 1 }}
                        rules={[{ required: true, message: 'Chọn mức ưu tiên' }]}
                    >
                        <Select placeholder="Chọn ưu tiên" style={{ borderRadius: 8 }}>
                            {UU_TIEN_OPTIONS.map((o) => (
                                <Option key={o.value} value={o.value}>
                                    {o.label}
                                </Option>
                            ))}
                        </Select>
                    </Form.Item>
                </div>

                <Form.Item
                    name="trangThai"
                    label={
                        <span style={{ fontWeight: 600 }}>
                            Trạng thái
                        </span>
                    }
                    rules={[{ required: true, message: 'Chọn trạng thái' }]}
                >
                    <Select placeholder="Chọn trạng thái" style={{ borderRadius: 8 }}>
                        {TRANG_THAI_OPTIONS.map((o) => (
                            <Option key={o.value} value={o.value}>
                                {o.label}
                            </Option>
                        ))}
                    </Select>
                </Form.Item>

                <Form.Item
                    name="tags"
                    label={
                        <span style={{ fontWeight: 600 }}>
                            <TagOutlined style={{ marginRight: 6, color: '#667eea' }} />
                            Tags
                        </span>
                    }
                >
                    <Select
                        mode="tags"
                        style={{ borderRadius: 8 }}
                        placeholder="Nhập tag và nhấn Enter"
                        tokenSeparators={[',']}
                    />
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default TaskForm;
