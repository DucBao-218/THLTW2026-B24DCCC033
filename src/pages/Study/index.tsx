import React, { useState, useEffect } from 'react';
import { Tabs } from 'antd';
import Subjects from './Subjects';
import Sessions from './Sessions';
import Goals from './Goals';

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

const Study: React.FC = () => {
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
    localStorage.setItem('subjects', JSON.stringify(subjects));
  }, [subjects]);

  useEffect(() => {
    localStorage.setItem('sessions', JSON.stringify(sessions));
  }, [sessions]);

  useEffect(() => {
    localStorage.setItem('goals', JSON.stringify(goals));
  }, [goals]);

  return (
    <Tabs defaultActiveKey="1">
      <Tabs.TabPane tab="Danh mục môn học" key="1">
        <Subjects subjects={subjects} setSubjects={setSubjects} />
      </Tabs.TabPane>
      <Tabs.TabPane tab="Lịch học" key="2">
        <Sessions
          subjects={subjects}
          sessions={sessions}
          setSessions={setSessions}
        />
      </Tabs.TabPane>
      <Tabs.TabPane tab="Mục tiêu tháng" key="3">
        <Goals
          subjects={subjects}
          sessions={sessions}
          goals={goals}
          setGoals={setGoals}
        />
      </Tabs.TabPane>
    </Tabs>
  );
};

export default Study;
