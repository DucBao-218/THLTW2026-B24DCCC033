import { Modal, Form, Input, InputNumber } from 'antd';
import { IProduct } from '@/services/Product/typing';

interface Props {
  open: boolean;
  onCancel: () => void;
  onSubmit: (data: Omit<IProduct, 'id'>) => void;
}

const ProductForm: React.FC<Props> = ({ open, onCancel, onSubmit }) => {
  const [form] = Form.useForm();

  return (
    <Modal
      title="Thêm sản phẩm"
      open={open}
      onCancel={onCancel}
      onOk={() => form.submit()}
      okText="Thêm"
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={(values) => {
          onSubmit(values);
          form.resetFields();
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
          <InputNumber style={{ width: '100%' }} />
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
