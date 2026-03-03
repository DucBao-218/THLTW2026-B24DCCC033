import React, { useState, useEffect } from 'react';
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
  Progress,
  Row,
  Col,
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

const defaultSubjects: Subject[] = [
  { id: 1, name: 'Toán' },
  { id: 2, name: 'Văn' },
  { id: 3, name: 'Anh' },
  { id: 4, name: 'Khoa học' },
  { id: 5, name: 'Công nghệ' },
];

const Study: React.FC = () => {
  const [subjects, setSubjects] = useState<Subject[]>(defaultSubjects);
  const [sessions, setSessions] = useState<StudySession[]>([]);
  const [goals, setGoals] = useState<Record<number, number>>({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSession, setEditingSession] =
    useState<StudySession | null>(null);

  const [isSubjectModalOpen, setIsSubjectModalOpen] = useState(false);
  const [editingSubject, setEditingSubject] =
    useState<Subject | null>(null);
  const [subjectName, setSubjectName] = useState('');

  const [form] = Form.useForm();

  useEffect(() => {
    const savedSessions = localStorage.getItem('sessions');
    const savedGoals = localStorage.getItem('goals');

    if (savedSessions) setSessions(JSON.parse(savedSessions));
    if (savedGoals) setGoals(JSON.parse(savedGoals));
  }, []);

  useEffect(() => {
    localStorage.setItem('sessions', JSON.stringify(sessions));
  }, [sessions]);

  useEffect(() => {
    localStorage.setItem('goals', JSON.stringify(goals));
  }, [goals]);

  const openAddSubject = () => {
    setEditingSubject(null);
    setSubjectName('');
    setIsSubjectModalOpen(true);
  };

  const openEditSubject = (subject: Subject) => {
    setEditingSubject(subject);
    setSubjectName(subject.name);
    setIsSubjectModalOpen(true);
  };

  const handleSaveSubject = () => {
    if (!subjectName.trim()) {
      message.error('Vui lòng nhập tên môn học!');
      return;
    }

    const isExist = subjects.some(
      (s) =>
        s.name.toLowerCase() === subjectName.toLowerCase() &&
        s.id !== editingSubject?.id,
    );

    if (isExist) {
      message.error('Môn học đã tồn tại!');
      return;
    }

    if (editingSubject) {
      setSubjects(
        subjects.map((s) =>
          s.id === editingSubject.id
            ? { ...s, name: subjectName }
            : s,
        ),
      );
      message.success('Cập nhật môn học thành công!');
    } else {
      const newSubject: Subject = {
        id: Date.now(),
        name: subjectName,
      };
      setSubjects([...subjects, newSubject]);
      message.success('Thêm môn học thành công!');
    }

    setIsSubjectModalOpen(false);
    setEditingSubject(null);
    setSubjectName('');
  };

  const deleteSubject = (id: number) => {
    setSubjects(subjects.filter((s) => s.id !== id));
    setSessions(sessions.filter((s) => s.subjectId !== id));

    const newGoals = { ...goals };
    delete newGoals[id];
    setGoals(newGoals);

    message.success('Đã xóa môn học!');
  };

  const handleSubmitSession = () => {
    form.validateFields().then((values) => {
      if (editingSession) {
        const updated = sessions.map((s) =>
          s.id === editingSession.id
            ? {
                ...s,
                subjectId: values.subjectId,
                date: values.date.format(),
                duration: values.duration,
                content: values.content,
                note: values.note,
              }
            : s,
        );
        setSessions(updated);
        message.success('Cập nhật lịch học thành công!');
      } else {
        const newSession: StudySession = {
          id: Date.now(),
          subjectId: values.subjectId,
          date: values.date.format(),
          duration: values.duration,
          content: values.content,
          note: values.note,
        };
        setSessions([...sessions, newSession]);
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

  const getTotalHours = (subjectId: number) => {
    return sessions
      .filter(
        (s) =>
          s.subjectId === subjectId &&
          dayjs(s.date).month() === dayjs().month(),
      )
      .reduce((sum, s) => sum + s.duration, 0);
  };

  return (
    <Row gutter={16}>
      <Col span={8}>
        <Card
          title="Danh mục môn học"
          extra={
            <Button type="primary" onClick={openAddSubject}>
              Thêm môn
            </Button>
          }
        >
          <Table
            dataSource={subjects}
            rowKey="id"
            pagination={false}
            columns={[
              { title: 'Tên môn', dataIndex: 'name' },
              {
                title: 'Hành động',
                render: (_, record) => (
                  <>
                    <Button
                      type="link"
                      onClick={() => openEditSubject(record)}
                    >
                      Sửa
                    </Button>
                    <Button
                      danger
                      type="link"
                      onClick={() => deleteSubject(record.id)}
                    >
                      Xóa
                    </Button>
                  </>
                ),
              },
            ]}
          />
        </Card>
      </Col>

      <Col span={16}>
        <Card
          title="Lịch học"
          extra={
            <Button
              type="primary"
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
                render: (_, record) =>
                  subjects.find(
                    (s) => s.id === record.subjectId,
                  )?.name,
              },
              {
                title: 'Ngày',
                render: (_, record) =>
                  dayjs(record.date).format(
                    'DD/MM/YYYY HH:mm',
                  ),
              },
              { title: 'Thời lượng', dataIndex: 'duration' },
              { title: 'Nội dung', dataIndex: 'content' },
              { title: 'Ghi chú', dataIndex: 'note' },
              {
                title: 'Hành động',
                render: (_, record) => (
                  <>
                    <Button
                      type="link"
                      onClick={() => {
                        setEditingSession(record);
                        form.setFieldsValue({
                          subjectId: record.subjectId,
                          date: dayjs(record.date),
                          duration: record.duration,
                          content: record.content,
                          note: record.note,
                        });
                        setIsModalOpen(true);
                      }}
                    >
                      Sửa
                    </Button>
                    <Button
                      danger
                      type="link"
                      onClick={() =>
                        deleteSession(record.id)
                      }
                    >
                      Xóa
                    </Button>
                  </>
                ),
              },
            ]}
          />
        </Card>
      </Col>

      <Col span={24} style={{ marginTop: 24 }}>
        <Card title="Mục tiêu tháng">
          {subjects.map((subject) => {
            const total = getTotalHours(subject.id);
            const goal = goals[subject.id] || 0;
            const percent = goal
              ? Math.min(
                  Number(((total / goal) * 100).toFixed(1)),
                  100,
                )
              : 0;

            return (
              <div key={subject.id} style={{ marginBottom: 20 }}>
                <b>{subject.name}</b>
                <InputNumber
                  style={{ marginLeft: 10 }}
                  placeholder="Giờ mục tiêu"
                  value={goals[subject.id]}
                  onChange={(value) =>
                    setGoals({
                      ...goals,
                      [subject.id]: value || 0,
                    })
                  }
                />
                <Progress
                  percent={percent}
                  status={
                    percent >= 100 ? 'success' : 'active'
                  }
                  style={{ marginTop: 10 }}
                />
              </div>
            );
          })}
        </Card>
      </Col>

      <Modal
        title={
          editingSession
            ? 'Sửa lịch học'
            : 'Thêm lịch học'
        }
        open={isModalOpen}
        onOk={handleSubmitSession}
        onCancel={() => setIsModalOpen(false)}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="subjectId"
            label="Môn học"
            rules={[{ required: true }]}
          >
            <Select>
              {subjects.map((s) => (
                <Select.Option key={s.id} value={s.id}>
                  {s.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="date"
            label="Ngày học"
            rules={[{ required: true }]}
          >
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

      <Modal
        title={
          editingSubject
            ? 'Sửa môn học'
            : 'Thêm môn học'
        }
        open={isSubjectModalOpen}
        onOk={handleSaveSubject}
        onCancel={() => {
          setIsSubjectModalOpen(false);
          setEditingSubject(null);
        }}
      >
        <Input
          placeholder="Nhập tên môn học..."
          value={subjectName}
          onChange={(e) =>
            setSubjectName(e.target.value)
          }
        />
      </Modal>
    </Row>
  );
};

export default Study;