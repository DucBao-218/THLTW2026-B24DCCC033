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
import { Button, message, Popconfirm } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { history } from 'umi'; 
import { Club, getClubs, setClubs } from '../data';

const DanhSachCLB: React.FC = () => {
  const actionRef = useRef<ActionType>();
  const [clubs, setClubsState] = useState<Club[]>(getClubs());
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentRow, setCurrentRow] = useState<Club | undefined>(undefined);

  const handleDelete = (id: string) => {
    const newData = clubs.filter(c => c.id !== id);
    setClubs(newData);
    setClubsState(newData);
    message.success('Đã xóa câu lạc bộ');
    actionRef.current?.reload();
  };

  const handleFinish = async (values: Record<string, any>) => {
    let newData = [...clubs];
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
    setClubsState(newData);
    setIsModalOpen(false);
    actionRef.current?.reload();
    return true;
  };

  const columns: ProColumns<Club>[] = [
    {
      title: 'Ảnh đại diện',
      dataIndex: 'avatar',
      valueType: 'avatar',
      hideInSearch: true,
    },
    {
      title: 'Tên câu lạc bộ',
      dataIndex: 'name',
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: 'Ngày thành lập',
      dataIndex: 'foundedDate',
      valueType: 'date',
      sorter: (a, b) => new Date(a.foundedDate).getTime() - new Date(b.foundedDate).getTime(),
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
      render: (_, record) => [
        <Button
            type="primary"
            key="edit" 
            onClick={() => {
                setCurrentRow(record);
                setIsModalOpen(true);
            }}
        >
          Chỉnh sửa
        </Button>,
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
        </Popconfirm>,
        <Button
          key="members"
          type="primary"
          onClick={() => {
            history.push(`/cau-lac-bo/thanh-vien?clubId=${record.id}`);
          }}
        >
          Thành viên
        </Button>,
      ],
    },
  ];

  return (
    <>
      <ProTable<Club>
        headerTitle="Danh sách Câu lạc bộ"
        actionRef={actionRef}
        rowKey="id"
        search={{ labelWidth: 'auto' }}
        dataSource={clubs}
        columns={columns}
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