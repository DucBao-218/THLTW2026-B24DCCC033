import React, { useState } from 'react';
import { Card, Button, Table, Modal, Input, message } from 'antd';

interface Subject {
  id: number;
  name: string;
}

interface Props {
  subjects: Subject[];
  setSubjects: React.Dispatch<React.SetStateAction<Subject[]>>;
}

const defaultSubjects: Subject[] = [
  { id: 1, name: 'Toán' },
  { id: 2, name: 'Văn' },
  { id: 3, name: 'Anh' },
  { id: 4, name: 'Khoa học' },
  { id: 5, name: 'Công nghệ' },
];

const Subjects: React.FC<Props> = ({ subjects, setSubjects }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSubject, setEditingSubject] = useState<Subject | null>(null);
  const [subjectName, setSubjectName] = useState('');

  if (subjects.length === 0) {
    setSubjects(defaultSubjects);
  }

  const handleSaveSubject = () => {
    if (!subjectName.trim()) {
      message.error('Vui lòng nhập tên môn học!');
      return;
    }
    if (editingSubject) {
      setSubjects(
        subjects.map((s) =>
          s.id === editingSubject.id ? { ...s, name: subjectName } : s
        )
      );
      message.success('Cập nhật môn học thành công!');
    } else {
      setSubjects([...subjects, { id: Date.now(), name: subjectName }]);
      message.success('Thêm môn học thành công!');
    }
    setIsModalOpen(false);
    setEditingSubject(null);
    setSubjectName('');
  };

  const deleteSubject = (id: number) => {
    setSubjects(subjects.filter((s) => s.id !== id));
    message.success('Đã xóa môn học!');
  };

  return (
    <Card
      title="Danh mục môn học"
      extra={
        <Button type="primary" danger onClick={() => setIsModalOpen(true)}>
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
                  type="primary"
                  style={{
                    backgroundColor: '#faad14',
                    borderColor: '#faad14',
                    color: '#fff',
                    marginRight: 8,
                  }}
                  onClick={() => {
                    setEditingSubject(record);
                    setSubjectName(record.name);
                    setIsModalOpen(true);
                  }}
                >
                  Sửa
                </Button>
                <Button
                  type="primary"
                  danger
                  onClick={() => deleteSubject(record.id)}
                >
                  Xóa
                </Button>
              </>
            ),
          },
        ]}
      />
      <Modal
        title={editingSubject ? 'Sửa môn học' : 'Thêm môn học'}
        open={isModalOpen}
        onOk={handleSaveSubject}
        onCancel={() => setIsModalOpen(false)}
      >
        <Input
          value={subjectName}
          onChange={(e) => setSubjectName(e.target.value)}
        />
      </Modal>
    </Card>
  );
};

export default Subjects;
