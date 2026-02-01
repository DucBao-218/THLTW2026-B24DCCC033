import { Modal, Form, Input, InputNumber, Select } from 'antd';
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
    if (initialData) {
      form.setFieldsValue(initialData);
    } else {
      form.resetFields();
    }
  }, [initialData, form]);

  return (
    <Modal
      title={initialData ? 'Sửa sản phẩm' : 'Thêm sản phẩm'}
      open={open}
      onCancel={() => {
        form.resetFields();
        onCancel();
      }}
      onOk={() => form.submit()}
      okText="Lưu"
      destroyOnClose
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={(values) => {
          onSubmit(initialData ? { ...initialData, ...values } : values);
          form.resetFields();
        }}
      >
        <Form.Item
          label="Tên sản phẩm"
          name="name"
          rules={[{ required: true, message: 'Bắt buộc nhập tên sản phẩm' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Danh mục"
          name="category"
          rules={[{ required: true, message: 'Bắt buộc chọn danh mục' }]}
        >
          <Select
            placeholder="Chọn danh mục"
            options={[
              { value: 'Laptop', label: 'Laptop' },
              { value: 'Điện thoại', label: 'Điện thoại' },
              { value: 'Máy tính bảng', label: 'Máy tính bảng' },
              { value: 'Phụ kiện', label: 'Phụ kiện' },
            ]}
          />
        </Form.Item>

        <Form.Item
          label="Giá"
          name="price"
          rules={[
            { required: true, message: 'Bắt buộc nhập giá' },
            {
              validator: (_, value) =>
                value > 0
                  ? Promise.resolve()
                  : Promise.reject('Giá phải lớn hơn 0'),
            },
          ]}
        >
          <InputNumber
            style={{ width: '100%' }}
            min={1}
            formatter={(v) =>
              `${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
            }
            parser={(v) => v?.replace(/\$\s?|(,*)/g, '') as any}
          />
        </Form.Item>

        <Form.Item
          label="Số lượng tồn kho"
          name="quantity"
          rules={[
            { required: true, message: 'Bắt buộc nhập số lượng' },
            {
              validator: (_, value) =>
                value >= 0
                  ? Promise.resolve()
                  : Promise.reject('Số lượng không được âm'),
            },
          ]}
        >
          <InputNumber style={{ width: '100%' }} min={0} />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ProductForm;
