import React from 'react';
import { Tabs } from 'antd';
import Subjects from './Subjects';
import Sessions from './Sessions';
import Goals from './Goals';

const Study: React.FC = () => {
  return (
    <Tabs defaultActiveKey="1" style={{ padding: 20 }}>
      <Tabs.TabPane tab="Danh mục môn học" key="1">
        <Subjects />
      </Tabs.TabPane>
      <Tabs.TabPane tab="Lịch học" key="2">
        <Sessions />
      </Tabs.TabPane>
      <Tabs.TabPane tab="Mục tiêu tháng" key="3">
        <Goals />
      </Tabs.TabPane>
    </Tabs>
  );
};

export default Study;
