import React, { useState, useRef } from 'react';
import { 
  ProTable, 
  ProColumns, 
  ActionType, 
  ModalForm, 
  ProFormText, 
  ProFormSelect, 
  ProFormTextArea 
} from '@ant-design/pro-components';
import { Modal, Input, message, Tag, List, Space, Popconfirm, Button } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { Application, LogEntry, getApps, setApps, getClubs } from '../data';
import moment from 'moment';

const DonDangKy: React.FC = () => {
  const actionRef = useRef<ActionType>();
  const clubs = getClubs();
  
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [isRejectModalVisible, setIsRejectModalVisible] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  
  const [isHistoryModalVisible, setIsHistoryModalVisible] = useState(false);
  const [currentLogs, setCurrentLogs] = useState<LogEntry[]>([]);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [currentRow, setCurrentRow] = useState<Application | undefined>(undefined);
  const [formMode, setFormMode] = useState<'add' | 'edit' | 'view'>('add');

  const clubEnum = clubs.reduce<Record<string, { text: string }>>((acc, club) => {
    acc[club.id] = { text: club.name };
    return acc;
  }, {});
  const clubOptions = clubs.map(c => ({ label: c.name, value: c.id }));

  const handleDelete = (id: string) => {
    const newData = getApps().filter(a => a.id !== id);
    setApps(newData);
    message.success('Đã xóa đơn đăng ký');
    actionRef.current?.reload(); 
  };

  const handleUpdateStatus = (keys: React.Key[], status: 'Approved' | 'Rejected', reason?: string) => {
    const updatedApps = getApps().map(app => {
      if (keys.includes(app.id)) {
        const log: LogEntry = {
          time: moment().format('HH:mm DD/MM/YYYY'),
          action: status,
          note: reason ? `Lý do: ${reason}` : 'Không có ghi chú'
        };
        return { ...app, status, rejectReason: reason, logs: [...(app.logs || []), log] };
      }
      return app;
    });
    setApps(updatedApps);
    setSelectedRowKeys([]);
    actionRef.current?.reload(); 
    message.success(`Đã cập nhật trạng thái cho ${keys.length} đơn`);
  };

  type ApplicationFormValues = Omit<Application, 'id' | 'status' | 'logs' | 'rejectReason'>;

  const handleFinishForm = async (values: ApplicationFormValues) => {
    if (formMode === 'view') {
      setIsFormOpen(false);
      return true;
    }

    let newData = getApps();
    if (formMode === 'edit' && currentRow) {
      newData = newData.map(item => 
        item.id === currentRow.id ? { ...item, ...values } : item
      );
      message.success('Cập nhật đơn thành công');
    } else {
      const newApp: Application = {
        ...values,
        id: Date.now().toString(),
        status: 'Pending', 
        logs: []
      };
      newData.unshift(newApp); 
      message.success('Thêm đơn mới thành công');
    }
    
    setApps(newData);
    setIsFormOpen(false);
    actionRef.current?.reload(); 
    return true;
  };

  const showHistory = (logs?: LogEntry[]) => {
    setCurrentLogs(logs || []);
    setIsHistoryModalVisible(true);
  };

  const columns: ProColumns<Application>[] = [
    { title: 'Họ tên', dataIndex: 'fullName' },
    { title: 'Email', dataIndex: 'email' },
    { title: 'SĐT', dataIndex: 'phone', hideInSearch: true },
    { 
      title: 'Câu lạc bộ', 
      dataIndex: 'clubId', 
      valueType: 'select', 
      valueEnum: clubEnum 
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      valueType: 'select',
      valueEnum: {
        Pending: { text: 'Chờ duyệt', status: 'Warning' },
        Approved: { text: 'Đã duyệt', status: 'Success' },
        Rejected: { text: 'Từ chối', status: 'Error' },
      },
    },
    {
      title: 'Lý do từ chối',
      dataIndex: 'rejectReason',
      hideInSearch: true,
      render: (_, record) => record.status === 'Rejected' ? <span style={{ color: 'red' }}>{record.rejectReason}</span> : '-',
    },
    {
      title: 'Thao tác',
      valueType: 'option',
      render: (_, record) => {
        const actions: React.ReactNode[] = [];
        
        actions.push(
          <Button type="primary" key="view" onClick={() => {
            setCurrentRow(record);
            setFormMode('view');
            setIsFormOpen(true);
          }}>Xem</Button>
        );

        if (record.status === 'Pending') {
          actions.push(
            <Button type="primary" key="edit" onClick={() => {
              setCurrentRow(record);
              setFormMode('edit');
              setIsFormOpen(true);
            }}>Sửa</Button>,
            <Button key="approve" type="primary" style={{ backgroundColor: '#52c41a', borderColor: '#52c41a' }} onClick={() => handleUpdateStatus([record.id], 'Approved')}>
              Duyệt
            </Button>,
            <Button key="reject" type="primary" style={{ backgroundColor: '#faad14', borderColor: '#faad14' }} onClick={() => {
              setSelectedRowKeys([record.id]);
              setIsRejectModalVisible(true);
            }}>Từ chối</Button>
          );
        }

        actions.push(
          <Button key="history" type="primary" onClick={() => showHistory(record.logs)}>
            Lịch sử
          </Button>,
          <Popconfirm key="delete" title="Bạn có muốn xóa đơn này?" onConfirm={() => handleDelete(record.id)}>
            <Button type="primary" danger>
              Xóa
            </Button>
          </Popconfirm>
        );
        
        return <Space wrap>{actions}</Space>;
      },
    },
  ];

  return (
    <>
      <ProTable<Application>
        headerTitle="Quản lý đơn đăng ký"
        actionRef={actionRef}
        rowKey="id"
        columns={columns}
        rowSelection={{
          selectedRowKeys,
          onChange: setSelectedRowKeys,
        }}
        request={async (params) => {
          let data = getApps();
          
          if (params.fullName) {
            data = data.filter(a => a.fullName.toLowerCase().includes(params.fullName.toLowerCase()));
          }
          if (params.email) {
            data = data.filter(a => a.email.toLowerCase().includes(params.email.toLowerCase()));
          }
          if (params.clubId) {
            data = data.filter(a => a.clubId === params.clubId);
          }
          if (params.status) {
            data = data.filter(a => a.status === params.status);
          }

          return { data, success: true, total: data.length };
        }}
        toolBarRender={() => [
          <Button key="add" type="primary" icon={<PlusOutlined />} onClick={() => {
            setCurrentRow(undefined);
            setFormMode('add');
            setIsFormOpen(true);
          }}>
            Thêm mới
          </Button>
        ]}
        tableAlertRender={({ selectedRowKeys: keys }) => (
          <Space size={24}>
            <span>Đã chọn {keys.length} đơn</span>
            <a onClick={() => handleUpdateStatus(keys, 'Approved')}>Duyệt tất cả đã chọn</a>
            <a onClick={() => setIsRejectModalVisible(true)}>Từ chối tất cả đã chọn</a>
          </Space>
        )}
      />

      <ModalForm
        title={formMode === 'add' ? 'Thêm đơn đăng ký' : formMode === 'edit' ? 'Chỉnh sửa đơn' : 'Chi tiết đơn đăng ký'}
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        initialValues={currentRow}
        modalProps={{ destroyOnClose: true }}
        onFinish={handleFinishForm}
        submitter={
          formMode === 'view' 
            ? { render: () => <Button type="primary" onClick={() => setIsFormOpen(false)}>Đóng</Button> } 
            : undefined
        }
      >
        <ProFormText name="fullName" label="Họ và tên" rules={[{ required: true, message: 'Vui lòng nhập họ tên' }]} disabled={formMode === 'view'} />
        <ProFormText name="email" label="Email" rules={[{ required: true, type: 'email', message: 'Email không hợp lệ' }]} disabled={formMode === 'view'} />
        <ProFormText name="phone" label="Số điện thoại" rules={[{ required: true, message: 'Vui lòng nhập SĐT' }]} disabled={formMode === 'view'} />
        <ProFormSelect name="gender" label="Giới tính" options={['Nam', 'Nữ', 'Khác']} disabled={formMode === 'view'} />
        <ProFormTextArea name="address" label="Địa chỉ" disabled={formMode === 'view'} />
        <ProFormSelect name="clubId" label="Câu lạc bộ đăng ký" options={clubOptions} rules={[{ required: true, message: 'Vui lòng chọn CLB' }]} disabled={formMode === 'view'} />
        <ProFormTextArea name="skills" label="Sở trường / Kỹ năng" disabled={formMode === 'view'} />
        <ProFormTextArea name="reason" label="Lý do đăng ký tham gia" disabled={formMode === 'view'} />
      </ModalForm>

      <Modal
        title="Lý do từ chối"
        open={isRejectModalVisible}
        onOk={() => {
          if (!rejectReason) return message.error('Vui lòng nhập lý do từ chối!');
          handleUpdateStatus(selectedRowKeys, 'Rejected', rejectReason);
          setIsRejectModalVisible(false);
          setRejectReason('');
        }}
        onCancel={() => {
          setIsRejectModalVisible(false);
          setRejectReason('');
        }}
      >
        <Input.TextArea 
          rows={4} 
          placeholder="Bắt buộc nhập lý do từ chối..." 
          value={rejectReason}
          onChange={e => setRejectReason(e.target.value)}
        />
      </Modal>

      <Modal
        title="Lịch sử thao tác"
        open={isHistoryModalVisible}
        footer={null}
        onCancel={() => setIsHistoryModalVisible(false)}
      >
        <List
          dataSource={currentLogs}
          locale={{ emptyText: 'Chưa có lịch sử thao tác nào' }}
          renderItem={(item: LogEntry) => (
            <List.Item>
              Admin đã <Tag color={item.action === 'Approved' ? 'green' : 'red'}>{item.action}</Tag> 
              vào lúc <b>{item.time}</b>. {item.note}
            </List.Item>
          )}
        />
      </Modal>
    </>
  );
};

export default DonDangKy;