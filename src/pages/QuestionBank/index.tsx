import React, { useState } from 'react';
import { Layout, Menu, Typography } from 'antd';
import {
  AppstoreOutlined, ReadOutlined,
  QuestionCircleOutlined, FileTextOutlined,
} from '@ant-design/icons';
import { v4 as uuidv4 } from 'uuid';
import { KhoiKienThuc, MonHoc, CauHoi, MauDeThi, DeThi } from './types';
import KnowledgeBlock from './KnowledgeBlock';
import Subjects       from './Subjects';
import Questions      from './Questions';
import Exam           from './Exam';

const { Sider, Content } = Layout;
const { Title } = Typography;

type PageKey = 'khoiKienThuc' | 'monHoc' | 'cauHoi' | 'deThi';

const MENU_ITEMS = [
  { key: 'khoiKienThuc', icon: <AppstoreOutlined />,       label: 'Khối kiến thức'    },
  { key: 'monHoc',       icon: <ReadOutlined />,           label: 'Môn học'           },
  { key: 'cauHoi',       icon: <QuestionCircleOutlined />, label: 'Ngân hàng câu hỏi' },
  { key: 'deThi',        icon: <FileTextOutlined />,       label: 'Đề thi'            },
];

function loadLS<T>(key: string, fallback: T): T {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch { return fallback; }
}
function saveLS<T>(key: string, value: T) {
  localStorage.setItem(key, JSON.stringify(value));
}

const QuestionBank: React.FC = () => {
  const [page, setPage] = useState<PageKey>('khoiKienThuc');

  const [khoiKienThucs, setKhoiKienThucs] = useState<KhoiKienThuc[]>(() =>
    loadLS('qb_khoiKienThucs', [
      { id: 'kkt1', ten: 'Tổng quan' },
      { id: 'kkt2', ten: 'Chuyên sâu' },
    ])
  );
  const [monHocs,   setMonHocs]   = useState<MonHoc[]>  (() => loadLS('qb_monHocs',   []));
  const [cauHois,   setCauHois]   = useState<CauHoi[]>  (() => loadLS('qb_cauHois',   []));
  const [mauDeThis, setMauDeThis] = useState<MauDeThi[]>(() => loadLS('qb_mauDeThis', []));
  const [deThis,    setDeThis]    = useState<DeThi[]>   (() => loadLS('qb_deThis',    []));

  const themKhoiKienThuc = (data: Omit<KhoiKienThuc, 'id'>) => {
    const next = [...khoiKienThucs, { ...data, id: uuidv4() }];
    setKhoiKienThucs(next); saveLS('qb_khoiKienThucs', next);
  };
  const suaKhoiKienThuc = (id: string, data: Omit<KhoiKienThuc, 'id'>) => {
    const next = khoiKienThucs.map(k => k.id === id ? { ...k, ...data } : k);
    setKhoiKienThucs(next); saveLS('qb_khoiKienThucs', next);
  };
  const xoaKhoiKienThuc = (id: string) => {
    const next = khoiKienThucs.filter(k => k.id !== id);
    setKhoiKienThucs(next); saveLS('qb_khoiKienThucs', next);
  };

  const themMonHoc = (data: Omit<MonHoc, 'id'>) => {
    const next = [...monHocs, { ...data, id: uuidv4() }];
    setMonHocs(next); saveLS('qb_monHocs', next);
  };
  const suaMonHoc = (id: string, data: Omit<MonHoc, 'id'>) => {
    const next = monHocs.map(m => m.id === id ? { ...m, ...data } : m);
    setMonHocs(next); saveLS('qb_monHocs', next);
  };
  const xoaMonHoc = (id: string) => {
    const next = monHocs.filter(m => m.id !== id);
    setMonHocs(next); saveLS('qb_monHocs', next);
  };

  const themCauHoi = (data: Omit<CauHoi, 'id' | 'maCauHoi' | 'ngayTao'>) => {
    const maCauHoi = `CH${String(cauHois.length + 1).padStart(4, '0')}`;
    const next = [...cauHois, { ...data, id: uuidv4(), maCauHoi, ngayTao: new Date().toISOString() }];
    setCauHois(next); saveLS('qb_cauHois', next);
  };
  const suaCauHoi = (id: string, data: Omit<CauHoi, 'id' | 'maCauHoi' | 'ngayTao'>) => {
    const next = cauHois.map(c => c.id === id ? { ...c, ...data } : c);
    setCauHois(next); saveLS('qb_cauHois', next);
  };
  const xoaCauHoi = (id: string) => {
    const next = cauHois.filter(c => c.id !== id);
    setCauHois(next); saveLS('qb_cauHois', next);
  };

  const themMauDeThi = (data: Omit<MauDeThi, 'id' | 'ngayTao'>) => {
    const next = [...mauDeThis, { ...data, id: uuidv4(), ngayTao: new Date().toISOString() }];
    setMauDeThis(next); saveLS('qb_mauDeThis', next);
  };
  const suaMauDeThi = (id: string, data: Omit<MauDeThi, 'id' | 'ngayTao'>) => {
    const next = mauDeThis.map(m => m.id === id ? { ...m, ...data } : m);
    setMauDeThis(next); saveLS('qb_mauDeThis', next);
  };
  const xoaMauDeThi = (id: string) => {
    const next = mauDeThis.filter(m => m.id !== id);
    setMauDeThis(next); saveLS('qb_mauDeThis', next);
  };

  const themDeThi = (data: Omit<DeThi, 'id' | 'ngayTao'>) => {
    const next = [...deThis, { ...data, id: uuidv4(), ngayTao: new Date().toISOString() }];
    setDeThis(next); saveLS('qb_deThis', next);
  };
  const xoaDeThi = (id: string) => {
    const next = deThis.filter(d => d.id !== id);
    setDeThis(next); saveLS('qb_deThis', next);
  };

  const sharedProps = { khoiKienThucs, monHocs, cauHois, mauDeThis, deThis };

  const renderPage = () => {
    switch (page) {
      case 'khoiKienThuc':
        return (
          <KnowledgeBlock
            {...sharedProps}
            onThem={themKhoiKienThuc}
            onSua={suaKhoiKienThuc}
            onXoa={xoaKhoiKienThuc}
          />
        );
      case 'monHoc':
        return (
          <Subjects
            {...sharedProps}
            onThem={themMonHoc}
            onSua={suaMonHoc}
            onXoa={xoaMonHoc}
          />
        );
      case 'cauHoi':
        return (
          <Questions
            {...sharedProps}
            onThem={themCauHoi}
            onSua={suaCauHoi}
            onXoa={xoaCauHoi}
          />
        );
      case 'deThi':
        return (
          <Exam
            {...sharedProps}
            onThemDeThi={themDeThi}
            onXoaDeThi={xoaDeThi}
            onThemMau={themMauDeThi}
            onSuaMau={suaMauDeThi}
            onXoaMau={xoaMauDeThi}
          />
        );
    }
  };

  return (
    <Layout style={{ minHeight: '100vh', background: '#fff' }}>
      <Sider width={220} theme="light" style={{ borderRight: '1px solid #f0f0f0' }}>
        <div style={{ padding: '16px 20px', borderBottom: '1px solid #f0f0f0' }}>
          <Title level={5} style={{ margin: 0 }}>Ngân hàng đề thi</Title>
        </div>
        <Menu
          mode="inline"
          selectedKeys={[page]}
          items={MENU_ITEMS}
          onClick={({ key }) => setPage(key as PageKey)}
          style={{ borderRight: 0, marginTop: 8 }}
        />
      </Sider>
      <Content style={{ padding: 24, background: '#f5f5f5' }}>
        {renderPage()}
      </Content>
    </Layout>
  );
};

export default QuestionBank;