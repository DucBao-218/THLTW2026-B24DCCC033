import React, { useState, useEffect } from 'react';
import { Card, InputNumber, Progress, Row, Col, Typography } from 'antd';
import dayjs from 'dayjs';

const { Title, Text } = Typography;

interface Subject {
  id: number;
  name: string;
}

interface StudySession {
  id: number;
  subjectId: number;
  date: string;
  duration: number;
}

const Goals: React.FC = () => {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [sessions, setSessions] = useState<StudySession[]>([]);
  const [goals, setGoals] = useState<Record<number, number>>({});

  useEffect(() => {
    const s = localStorage.getItem('subjects');
    const l = localStorage.getItem('sessions');
    const g = localStorage.getItem('goals');
    if (s) setSubjects(JSON.parse(s));
    if (l) setSessions(JSON.parse(l));
    if (g) setGoals(JSON.parse(g));
  }, []);

  useEffect(() => {
    localStorage.setItem('goals', JSON.stringify(goals));
  }, [goals]);

  const getTotalHours = (subjectId: number) => {
    return sessions
      .filter(
        (s) =>
          s.subjectId === subjectId &&
          dayjs(s.date).month() === dayjs().month() &&
          dayjs(s.date).year() === dayjs().year()
      )
      .reduce((sum, s) => sum + s.duration, 0);
  };

  const getColor = (percent: number) => {
    if (percent < 50) return '#ff4d4f'; 
    if (percent < 100) return '#faad14'; 
    return '#52c41a'; 
  };

  return (
    <Card style={{ maxWidth: 800, margin: '20px auto' }}>
      <Title level={3} style={{ marginBottom: 20 }}>
        Mục tiêu học tập tháng {dayjs().format('MM/YYYY')}
      </Title>
      <Row gutter={[16, 24]}>
        {subjects.map((subject) => {
          const total = getTotalHours(subject.id);
          const goal = goals[subject.id] || 0;
          const percent = goal
            ? Math.min(Number(((total / goal) * 100).toFixed(1)), 100)
            : 0;

          return (
            <Col span={24} key={subject.id}>
              <Card
                size="small"
                style={{
                  borderRadius: 10,
                  background: '#fdfdfd',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                }}
              >
                <Row align="middle" justify="space-between">
                  <Col>
                    <Text strong style={{ fontSize: 16 }}>
                      {subject.name}
                    </Text>
                  </Col>
                  <Col>
                    <InputNumber
                      min={0}
                      style={{ width: 120 }}
                      placeholder="Giờ mục tiêu"
                      value={goals[subject.id]}
                      onChange={(value) =>
                        setGoals({ ...goals, [subject.id]: value || 0 })
                      }
                    />
                  </Col>
                </Row>
                <Progress
                  percent={percent}
                  status={percent >= 100 ? 'success' : 'active'}
                  format={() => `${total}/${goal} giờ`}
                  strokeColor={getColor(percent)}
                  style={{ marginTop: 12 }}
                />
              </Card>
            </Col>
          );
        })}
      </Row>
    </Card>
  );
};

export default Goals;
