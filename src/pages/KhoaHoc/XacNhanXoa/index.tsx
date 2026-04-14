import React from 'react';
import { Modal, Alert, Descriptions, Tag, Space, Typography } from 'antd';
import {
  ExclamationCircleOutlined,
  StopOutlined,
  DeleteOutlined,
  TeamOutlined,
} from '@ant-design/icons';
import { KhoaHoc, GiangVien, TRANG_THAI_CONFIG } from '../types';

const { Text } = Typography;

interface Props {
  open: boolean;
  item: KhoaHoc | null;
  giangViens: GiangVien[];
  onConfirm: () => void;
  onCancel: () => void;
}

const XacNhanXoa: React.FC<Props> = ({
  open,
  item,
  giangViens,
  onConfirm,
  onCancel,
}) => {
  if (!item) return null;

  const hasStudents = item.soLuongHocVien > 0;
  const gv = giangViens.find((g) => g.id === item.giangVienId);

  return (
    <Modal
      title={
        <Space>
          {hasStudents ? (
            <StopOutlined style={{ color: '#ff4d4f' }} />
          ) : (
            <ExclamationCircleOutlined style={{ color: '#faad14' }} />
          )}
          {hasStudents ? 'Không thể xóa khóa học' : 'Xác nhận xóa khóa học'}
        </Space>
      }
      open={open}
      onOk={hasStudents ? undefined : onConfirm}
      onCancel={onCancel}
      okText={
        hasStudents ? undefined : (
          <Space>
            <DeleteOutlined />
            Xác nhận xóa
          </Space>
        )
      }
      cancelText={hasStudents ? 'Đóng' : 'Hủy'}
      okButtonProps={
        hasStudents ? { style: { display: 'none' } } : { danger: true }
      }
      width={480}
    >
      {hasStudents ? (
        <Alert
          type="error"
          showIcon
          icon={<StopOutlined />}
          message="Không thể xóa khóa học này!"
          description={
            <>
              Khóa học đang có{' '}
              <Text strong style={{ color: '#ff4d4f' }}>
                {item.soLuongHocVien.toLocaleString()} học viên
              </Text>
              . Bạn chỉ có thể xóa khóa học khi{' '}
              <strong>chưa có học viên nào đăng ký</strong>.
            </>
          }
          style={{ marginBottom: 16 }}
        />
      ) : (
        <Alert
          type="warning"
          showIcon
          message="Hành động này không thể hoàn tác!"
          description="Khóa học sẽ bị xóa vĩnh viễn khỏi hệ thống."
          style={{ marginBottom: 16 }}
        />
      )}

      <Descriptions
        column={1}
        size="small"
        bordered
        labelStyle={{ width: 130, fontWeight: 600 }}
      >
        <Descriptions.Item label="ID">
          <Tag color="blue" style={{ fontFamily: 'monospace' }}>
            {item.id}
          </Tag>
        </Descriptions.Item>
        <Descriptions.Item label="Tên khóa học">
          <Text strong>{item.tenKhoaHoc}</Text>
        </Descriptions.Item>
        <Descriptions.Item label="Giảng viên">
          {gv ? gv.ten : item.giangVienId}
        </Descriptions.Item>
        <Descriptions.Item label="Số học viên">
          <Space>
            <TeamOutlined
              style={{ color: item.soLuongHocVien > 0 ? '#1677ff' : '#bbb' }}
            />
            <Text
              strong
              style={{
                color: item.soLuongHocVien > 0 ? '#ff4d4f' : '#52c41a',
              }}
            >
              {item.soLuongHocVien.toLocaleString()}
            </Text>
            <Text type="secondary">học viên</Text>
          </Space>
        </Descriptions.Item>
        <Descriptions.Item label="Trạng thái">
          <Tag color={TRANG_THAI_CONFIG[item.trangThai].color}>
            {TRANG_THAI_CONFIG[item.trangThai].label}
          </Tag>
        </Descriptions.Item>
      </Descriptions>

      {hasStudents && (
        <div
          style={{
            marginTop: 16,
            padding: '10px 14px',
            background: '#fff7e6',
            border: '1px solid #ffd591',
            borderRadius: 6,
          }}
        >
          <Text style={{ fontSize: 13, color: '#ad6800' }}>
            💡 <strong>Gợi ý:</strong> Để xóa khóa học, hãy chuyển toàn bộ
            học viên sang khóa học khác hoặc đặt số lượng học viên về 0 trước.
          </Text>
        </div>
      )}
    </Modal>
  );
};

export default XacNhanXoa;