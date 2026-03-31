import React, { useRef, useState } from 'react';
import { 
  ActionType, 
  ProColumns, 
  ProTable, 
  ModalForm, 
  ProFormText, 
  ProFormDatePicker, 
  ProFormTextArea, 
  ProFormSwitch 
} from '@ant-design/pro-components';
import { Button, message, Popconfirm, Space, Avatar } from 'antd'; 
import { PlusOutlined } from '@ant-design/icons';
import { history } from 'umi'; 
import { Club, getClubs, setClubs } from '../data';
import moment from 'moment'; 

const DanhSachCLB: React.FC = () => {
  const actionRef = useRef<ActionType>();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentRow, setCurrentRow] = useState<Club | undefined>(undefined);

  const handleDelete = (id: string) => {
    const newData = getClubs().filter(c => c.id !== id);
    setClubs(newData);
    message.success('Đã xóa câu lạc bộ');
    actionRef.current?.reload(); 
  };

  const handleFinish = async (values: Record<string, any>) => {
    let newData = getClubs();
    if (currentRow) {
      newData = newData.map(item => 
        item.id === currentRow.id ? { ...item, ...values } as Club : item
      );
      message.success('Cập nhật thành công');
    } else {
      const newClub: Club = {
        ...values,
        id: Date.now().toString(), 
      } as Club;
      newData.push(newClub);
      message.success('Thêm mới thành công');
    }
    
    setClubs(newData);
    setIsModalOpen(false);
    actionRef.current?.reload(); 
    return true;
  };

  const columns: ProColumns<Club>[] = [
    {
      title: 'Ảnh đại diện',
      dataIndex: 'avatar',
      hideInSearch: true,
      render: (_, record) => (
        <Avatar src={record.avatar} size={50} /> 
      ),
    },
    {
      title: 'Tên câu lạc bộ',
      dataIndex: 'name',
      sorter: true, 
    },
    {
      title: 'Ngày thành lập',
      dataIndex: 'foundedDate',
      valueType: 'date',
      sorter: true,
    },
    {
      title: 'Chủ nhiệm',
      dataIndex: 'president',
    },
    {
      title: 'Hoạt động',
      dataIndex: 'isActive',
      valueType: 'select',
      valueEnum: {
        true: { text: 'Có', status: 'Success' },
        false: { text: 'Không', status: 'Default' },
      },
    },
    {
      title: 'Thao tác',
      valueType: 'option',
      render: (_, record) => (
        <Space>
          <Button
            type="primary"
            key="edit" 
            onClick={() => {
                setCurrentRow(record);
                setIsModalOpen(true);
            }}
          >
            Chỉnh sửa
          </Button>
          <Popconfirm 
            key="delete" 
            title="Bạn có chắc chắn muốn xóa CLB này không?" 
            onConfirm={() => handleDelete(record.id)}
            okText="Có"
            cancelText="Không"
          >
            <Button type="primary" danger>
              Xóa
            </Button>
          </Popconfirm>
          <Button
            key="members"
            type="primary"
            onClick={() => {
              history.push(`/cau-lac-bo/thanh-vien?clubId=${record.id}`);
            }}
          >
            Thành viên
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <>
      <ProTable<Club>
        headerTitle="Danh sách Câu lạc bộ"
        actionRef={actionRef}
        rowKey="id"
        search={{ labelWidth: 'auto' }}
        columns={columns}
        request={async (params, sorter) => {
          let data = getClubs();
          
          if (params.name) {
            data = data.filter(c => c.name.toLowerCase().includes(params.name.toLowerCase()));
          }
          if (params.president) {
            data = data.filter(c => c.president.toLowerCase().includes(params.president.toLowerCase()));
          }
          if (params.isActive !== undefined && params.isActive !== '') {
            data = data.filter(c => String(c.isActive) === String(params.isActive));
          }
          
          if (params.foundedDate) {
             data = data.filter(c => {
                return c.foundedDate && c.foundedDate.startsWith(params.foundedDate);
             });
          }

          if (sorter && Object.keys(sorter).length > 0) {
            const key = Object.keys(sorter)[0] as keyof Club;
            const order = sorter[key as string];
            data.sort((a, b) => {
              if (a[key] < b[key]) return order === 'ascend' ? -1 : 1;
              if (a[key] > b[key]) return order === 'ascend' ? 1 : -1;
              return 0;
            });
          }

          return { data, success: true, total: data.length };
        }}
        toolBarRender={() => [
          <Button 
            key="button" 
            icon={<PlusOutlined />} 
            type="primary"
            onClick={() => {
              setCurrentRow(undefined); 
              setIsModalOpen(true);    
            }}
          >
            Thêm mới
          </Button>,
        ]}
      />

      <ModalForm
        title={currentRow ? 'Chỉnh sửa Câu lạc bộ' : 'Thêm mới Câu lạc bộ'}
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        initialValues={currentRow || { isActive: true }} 
        modalProps={{ destroyOnClose: true }} 
        onFinish={handleFinish}
      >
        <ProFormText
          name="name"
          label="Tên câu lạc bộ"
          rules={[{ required: true, message: 'Vui lòng nhập tên câu lạc bộ!' }]}
        />
        <ProFormText
          name="avatar"
          label="Link ảnh đại diện (URL)"
          placeholder="VD: https://example.com/logo.png"
        />
        <ProFormDatePicker
          name="foundedDate"
          label="Ngày thành lập"
          rules={[{ required: true, message: 'Vui lòng chọn ngày thành lập!' }]}
        />
        <ProFormText
          name="president"
          label="Chủ nhiệm CLB"
          rules={[{ required: true, message: 'Vui lòng nhập tên chủ nhiệm!' }]}
        />
        <ProFormTextArea
          name="description"
          label="Mô tả"
          placeholder="Nhập giới thiệu về câu lạc bộ..."
        />
        <ProFormSwitch
          name="isActive"
          label="Đang hoạt động"
        />
      </ModalForm>
    </>
  );
};

export default DanhSachCLB;