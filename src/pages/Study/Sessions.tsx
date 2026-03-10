import React, { useState } from 'react';
import {
  Card,
  Button,
  Table,
  Modal,
  Form,
  DatePicker,
  Input,
  InputNumber,
  Select,
  message,
} from 'antd';
import dayjs from 'dayjs';

interface Subject {
  id: number;
  name: string;
}
interface StudySession {
  id: number;
  subjectId: number;
  date: string;
  duration: number;
  content: string;
  note: string;
}

interface Props {
  subjects: Subject[];
  sessions: StudySession[];
  setSessions: React.Dispatch<React.SetStateAction<StudySession[]>>;
}

const Sessions: React.FC<Props> = ({ subjects, sessions, setSessions }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSession, setEditingSession] = useState<StudySession | null>(
    null
  );
  const [form] = Form.useForm();

  const handleSubmitSession = () => {
    form.validateFields().then((values) => {
      if (editingSession) {
        setSessions(
          sessions.map((s) =>
            s.id === editingSession.id
              ? { ...s, ...values, date: values.date.format() }
              : s
          )
        );
        message.success('Cập nhật lịch học thành công!');
      } else {
        setSessions([
          ...sessions,
          { id: Date.now(), ...values, date: values.date.format() },
        ]);
        message.success('Thêm lịch học thành công!');
      }
      setEditingSession(null);
      setIsModalOpen(false);
      form.resetFields();
    });
  };

  const deleteSession = (id: number) => {
    setSessions(sessions.filter((s) => s.id !== id));
    message.success('Đã xóa lịch học!');
  };

  return (
    <Card
      title="Lịch học"
      extra={
        <Button
          type="primary"
          danger
          onClick={() => {
            setEditingSession(null);
            form.resetFields();
            setIsModalOpen(true);
          }}
        >
          Thêm lịch học
        </Button>
      }
    >
      <Table
        dataSource={sessions}
        rowKey="id"
        columns={[
          {
            title: 'Môn',
            render: (_, r) => subjects.find((s) => s.id === r.subjectId)?.name,
          },
          {
            title: 'Ngày',
            render: (_, r) => dayjs(r.date).format('DD/MM/YYYY HH:mm'),
          },
          { title: 'Thời lượng', dataIndex: 'duration' },
          { title: 'Nội dung', dataIndex: 'content' },
          { title: 'Ghi chú', dataIndex: 'note' },
          {
            title: 'Hành động',
            render: (_, r) => (
              <>
                <Button
                  type="primary"
                  style={{
                    backgroundColor: '#faad14',
                    borderColor: '#faad14',
                    color: '#fff',
                    marginRight: 8,
                  }}
                  onClick={() => {
                    setEditingSession(r);
                    form.setFieldsValue({
                      ...r,
                      date: dayjs(r.date),
                    });
                    setIsModalOpen(true);
                  }}
                >
                  Sửa
                </Button>
                <Button
                  type="primary"
                  danger
                  onClick={() => deleteSession(r.id)}
                >
                  Xóa
                </Button>
              </>
            ),
          },
        ]}
      />
      <Modal
        title={editingSession ? 'Sửa lịch học' : 'Thêm lịch học'}
        open={isModalOpen}
        onOk={handleSubmitSession}
        onCancel={() => setIsModalOpen(false)}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="subjectId" label="Môn học" rules={[{ required: true }]}>
            <Select>
              {subjects.map((s) => (
                <Select.Option key={s.id} value={s.id}>
                  {s.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name="date" label="Ngày học" rules={[{ required: true }]}>
            <DatePicker showTime style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item
            name="duration"
            label="Thời lượng (giờ)"
            rules={[{ required: true }]}
          >
            <InputNumber min={1} style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item name="content" label="Nội dung">
            <Input />
          </Form.Item>
          <Form.Item name="note" label="Ghi chú">
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
};

export default Sessions;
