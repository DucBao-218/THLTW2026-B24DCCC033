import { Modal, Form, Input, InputNumber } from 'antd';
import { IProduct } from '@/services/Product/typing';
import { useEffect } from 'react';

interface Props {
  open: boolean;
  initialData?: IProduct | null;
  onCancel: () => void;
  onSubmit: (data: Omit<IProduct, 'id'> | IProduct) => void;
}

const ProductForm: React.FC<Props> = ({
  open,
  initialData,
  onCancel,
  onSubmit,
}) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (initialData) form.setFieldsValue(initialData);
    else form.resetFields();
  }, [initialData]);

  return (
    <Modal
      title={initialData ? 'Sửa sản phẩm' : 'Thêm sản phẩm'}
      open={open}
      onCancel={onCancel}
      onOk={() => form.submit()}
      okText="Lưu"
      destroyOnClose
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={(values) => {
          onSubmit(
            initialData ? { ...initialData, ...values } : values,
          );
        }}
      >
        <Form.Item
          label="Tên sản phẩm"
          name="name"
          rules={[{ required: true, message: 'Bắt buộc nhập' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Giá"
          name="price"
          rules={[{ required: true, type: 'number', min: 1 }]}
        >
          <InputNumber
            style={{ width: '100%' }}
            formatter={(v) =>
              `${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
            }
          />
        </Form.Item>

        <Form.Item
          label="Số lượng"
          name="quantity"
          rules={[{ required: true, type: 'number', min: 1 }]}
        >
          <InputNumber style={{ width: '100%' }} />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ProductForm;
