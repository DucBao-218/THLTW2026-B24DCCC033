import React, { useEffect } from 'react';
import {
  Modal, Form, Input, Select, InputNumber, Tag,
  Typography, Space, Alert, Row, Col,
} from 'antd';
import {
  BookOutlined, UserOutlined, TeamOutlined,
  InfoCircleOutlined,
} from '@ant-design/icons';
import {
  KhoaHoc, GiangVien, TrangThaiKhoaHoc, TRANG_THAI_CONFIG,
} from '../types';

const { TextArea } = Input;
const { Option } = Select;
const { Text } = Typography;

interface Props {
  open: boolean;
  editingItem: KhoaHoc | null;
  giangViens: GiangVien[];
  existingNames: string[]; 
  onSubmit: (values: Omit<KhoaHoc, 'id' | 'createdAt'>) => void;
  onCancel: () => void;
}

const FormKhoaHoc: React.FC<Props> = ({
  open,
  editingItem,
  giangViens,
  existingNames,
  onSubmit,
  onCancel,
}) => {
  const [form] = Form.useForm();
  const isEdit = !!editingItem;

  useEffect(() => {
    if (open) {
      if (editingItem) {
        form.setFieldsValue(editingItem);
      } else {
        form.resetFields();
        form.setFieldsValue({ trangThai: 'dang-mo', soLuongHocVien: 0 });
      }
    }
  }, [open, editingItem]);

  const handleOk = () => {
    form.validateFields().then((values) => {
      onSubmit({
        tenKhoaHoc: values.tenKhoaHoc.trim(),
        giangVienId: values.giangVienId,
        soLuongHocVien: values.soLuongHocVien ?? 0,
        moTa: values.moTa || '',
        trangThai: values.trangThai,
      });
    });
  };

  const otherNames = existingNames.filter(
    (n) => !isEdit || n !== editingItem?.tenKhoaHoc,
  );

  return (
    <Modal
      title={
        <Space>
          <BookOutlined style={{ color: '#1677ff' }} />
          {isEdit ? 'Chỉnh sửa khóa học' : 'Thêm khóa học mới'}
        </Space>
      }
      open={open}
      onOk={handleOk}
      onCancel={onCancel}
      width={680}
      okText={isEdit ? 'Cập nhật' : 'Thêm mới'}
      cancelText="Hủy"
      destroyOnClose
    >
      {isEdit && editingItem?.soLuongHocVien > 0 && (
        <Alert
          type="info"
          showIcon
          icon={<InfoCircleOutlined />}
          message={
            <>
              Khóa học này đang có{' '}
              <strong>{editingItem.soLuongHocVien}</strong> học viên.
              Một số thông tin có thể bị hạn chế chỉnh sửa.
            </>
          }
          style={{ marginBottom: 16 }}
        />
      )}

      <Form form={form} layout="vertical" requiredMark="optional">
        <Form.Item
          label={<Text strong>Tên khóa học</Text>}
          name="tenKhoaHoc"
          rules={[
            { required: true, message: 'Vui lòng nhập tên khóa học' },
            { max: 100, message: 'Tên không được vượt quá 100 ký tự' },
            { whitespace: true, message: 'Tên không được chỉ gồm khoảng trắng' },
            {
              validator: (_, value) => {
                if (!value) return Promise.resolve();
                const trimmed = value.trim();
                if (
                  otherNames.some(
                    (n) => n.toLowerCase() === trimmed.toLowerCase(),
                  )
                ) {
                  return Promise.reject('Tên khóa học đã tồn tại!');
                }
                return Promise.resolve();
              },
            },
          ]}
          extra={
            <Form.Item noStyle shouldUpdate>
              {({ getFieldValue }) => {
                const len = (getFieldValue('tenKhoaHoc') || '').length;
                return (
                  <Text
                    type={len > 90 ? 'danger' : 'secondary'}
                    style={{ fontSize: 11 }}
                  >
                    {len}/100 ký tự
                  </Text>
                );
              }}
            </Form.Item>
          }
        >
          <Input
            placeholder="VD: ReactJS từ cơ bản đến nâng cao"
            maxLength={100}
            showCount
            prefix={<BookOutlined style={{ color: '#bbb' }} />}
          />
        </Form.Item>

        <Row gutter={16}>
          <Col xs={24} sm={12}>
            <Form.Item
              label={<Text strong>Giảng viên</Text>}
              name="giangVienId"
              rules={[{ required: true, message: 'Vui lòng chọn giảng viên' }]}
            >
              <Select
                placeholder="Chọn giảng viên"
                showSearch
                optionFilterProp="label"
                suffixIcon={<UserOutlined />}
              >
                {giangViens.map((gv) => (
                  <Option key={gv.id} value={gv.id} label={gv.ten}>
                    <div>
                      <Text strong style={{ fontSize: 13 }}>
                        {gv.ten}
                      </Text>
                      <br />
                      <Text type="secondary" style={{ fontSize: 11 }}>
                        {gv.chuyenMon}
                      </Text>
                    </div>
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>

          <Col xs={24} sm={12}>
            <Form.Item
              label={<Text strong>Số lượng học viên</Text>}
              name="soLuongHocVien"
              rules={[
                { required: true, message: 'Vui lòng nhập số học viên' },
                { type: 'number', min: 0, message: 'Số học viên không được âm' },
              ]}
            >
              <InputNumber
                min={0}
                style={{ width: '100%' }}
                placeholder="0"
                addonBefore={<TeamOutlined />}
                addonAfter="học viên"
                formatter={(v) =>
                  `${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                }
                parser={(v) => parseInt(v?.replace(/,/g, '') || '0', 10) as 0}
              />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item
          label={<Text strong>Trạng thái khóa học</Text>}
          name="trangThai"
          rules={[{ required: true, message: 'Vui lòng chọn trạng thái' }]}
        >
          <Select placeholder="Chọn trạng thái">
            {(Object.keys(TRANG_THAI_CONFIG) as TrangThaiKhoaHoc[]).map(
              (k) => (
                <Option key={k} value={k}>
                  <Tag
                    color={TRANG_THAI_CONFIG[k].color}
                    style={{ marginRight: 6 }}
                  >
                    {TRANG_THAI_CONFIG[k].label}
                  </Tag>
                </Option>
              ),
            )}
          </Select>
        </Form.Item>

        <Form.Item
          label={
            <Space>
              <Text strong>Mô tả khóa học</Text>
              <Text type="secondary" style={{ fontSize: 11, fontWeight: 400 }}>
                (Hỗ trợ HTML)
              </Text>
            </Space>
          }
          name="moTa"
        >
          <TextArea
            rows={5}
            placeholder="<p>Nhập mô tả khóa học bằng HTML...</p>
<ul>
  <li>Nội dung chính 1</li>
  <li>Nội dung chính 2</li>
</ul>"
            style={{ fontFamily: 'monospace', fontSize: 13 }}
          />
        </Form.Item>

        <Form.Item noStyle shouldUpdate>
          {({ getFieldValue }) => {
            const html = getFieldValue('moTa');
            if (!html) return null;
            return (
              <Form.Item label={<Text type="secondary" style={{ fontSize: 12 }}>Preview mô tả:</Text>}>
                <div
                  style={{
                    border: '1px solid #d9d9d9',
                    borderRadius: 6,
                    padding: '8px 12px',
                    background: '#fafafa',
                    fontSize: 13,
                    minHeight: 40,
                    maxHeight: 120,
                    overflowY: 'auto',
                  }}
                  dangerouslySetInnerHTML={{ __html: html }}
                />
              </Form.Item>
            );
          }}
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default FormKhoaHoc;