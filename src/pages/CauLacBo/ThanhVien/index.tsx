import React, { useState, useEffect, useRef } from 'react';
import { ProTable, ProColumns, ActionType } from '@ant-design/pro-components';
import { Modal, Select, message, Button} from 'antd';
import { useLocation } from 'umi';
import { Application, getApps, setApps, getClubs } from '../data';

const ThanhVien: React.FC = () => {
  const actionRef = useRef<ActionType>();
  const [apps, setAppsState] = useState<Application[]>(getApps());
  const clubs = getClubs();
  
  const [selectedKeys, setSelectedKeys] = useState<React.Key[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [targetClubId, setTargetClubId] = useState<string>();

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const initialClubId = queryParams.get('clubId') || undefined;

  const clubEnum = clubs.reduce<Record<string, { text: string }>>((acc, club) => {
    acc[club.id] = { text: club.name };
    return acc;
  }, {});

  const approvedMembers = apps.filter(app => app.status === 'Approved');

  const handleChangeClub = () => {
    if (!targetClubId) return message.error('Vui lòng chọn CLB đích');
    
    const updated = apps.map(app => 
      selectedKeys.includes(app.id) ? { ...app, clubId: targetClubId } : app
    );
    
    setApps(updated);
    setAppsState(updated);
    setIsModalVisible(false);
    setSelectedKeys([]);
    setTargetClubId(undefined);
    message.success('Chuyển câu lạc bộ thành công');
    actionRef.current?.reload();
  };

  const columns: ProColumns<Application>[] = [
    { title: 'Họ tên', dataIndex: 'fullName' },
    { title: 'Email', dataIndex: 'email' },
    { title: 'SĐT', dataIndex: 'phone', hideInSearch: true },
    { 
      title: 'Giới tính', 
      dataIndex: 'gender', 
      valueType: 'select', 
      valueEnum: {
        'Nam': { text: 'Nam' },
        'Nữ': { text: 'Nữ' },
        'Khác': { text: 'Khác' },
      },
      hideInSearch: true 
    },
    { title: 'Địa chỉ', dataIndex: 'address', hideInSearch: true, ellipsis: true },
    { title: 'Sở trường', dataIndex: 'skills', hideInSearch: true, ellipsis: true },
    { 
      title: 'Câu lạc bộ', 
      dataIndex: 'clubId', 
      valueType: 'select', 
      valueEnum: clubEnum,
      initialValue: initialClubId 
    },
    {
      title: 'Thao tác',
      valueType: 'option',
      render: (_, record) => [
        <Button key="change" type="primary" onClick={() => {
          setSelectedKeys([record.id]);
          setIsModalVisible(true);
        }}>Đổi CLB</Button>
      ],
    },
  ];

  return (
    <>
      <ProTable<Application>
        headerTitle="Danh sách Thành viên"
        actionRef={actionRef}
        rowKey="id"
        dataSource={approvedMembers}
        columns={columns}
        rowSelection={{
          selectedRowKeys: selectedKeys,
          onChange: setSelectedKeys,
        }}
        form={{ initialValues: { clubId: initialClubId } }} 
        tableAlertRender={({ selectedRowKeys }) => (
          <a onClick={() => setIsModalVisible(true)}>
            Đổi CLB cho {selectedRowKeys.length} thành viên đã chọn
          </a>
        )}
      />

      <Modal
        title={`Đổi CLB cho ${selectedKeys.length} thành viên`}
        open={isModalVisible}
        onOk={handleChangeClub}
        onCancel={() => setIsModalVisible(false)}
        destroyOnClose
      >
        <div style={{ marginBottom: 16 }}>Chọn câu lạc bộ muốn chuyển đến:</div>
        <Select
          style={{ width: '100%' }}
          placeholder="-- Chọn câu lạc bộ --"
          onChange={setTargetClubId}
          value={targetClubId}
          options={clubs.map(c => ({ label: c.name, value: c.id }))}
        />
      </Modal>
    </>
  );
};

export default ThanhVien;