import React, { useState } from 'react';
import { Modal, Form, Input, Select, InputNumber } from 'antd';
import { IProduct } from '@/services/Product/typing';

interface Props {
  open: boolean;
  onCancel: () => void;
  onSubmit: (values: any) => void;
  products: IProduct[];
}

const OrderForm: React.FC<Props> = ({
  open,
  onCancel,
  onSubmit,
  products,
}) => {
  const [form] = Form.useForm();

  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  const handleFinish = (values: any) => {
    onSubmit(values);

    form.resetFields();
    setSelectedIds([]);
  };

  const handleClose = () => {
    form.resetFields();
    setSelectedIds([]);
    onCancel();
  };

  return (
    <Modal
      title="Tạo đơn hàng mới"
      open={open}
      onCancel={handleClose}
      onOk={() => form.submit()}
      okText="Lưu"
    >
      <Form form={form} layout="vertical" onFinish={handleFinish}>

        <Form.Item
          label="Tên khách hàng"
          name="customerName"
          rules={[{ required: true, message: 'Bắt buộc nhập tên khách hàng' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Số điện thoại"
          name="phone"
          rules={[
            { required: true, message: 'Bắt buộc nhập số điện thoại' },
            { pattern: /^\d{10,11}$/, message: 'SĐT phải 10-11 chữ số' },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Địa chỉ"
          name="address"
          rules={[{ required: true, message: 'Bắt buộc nhập địa chỉ' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Chọn sản phẩm"
          name="products"
          rules={[{ required: true, message: 'Chọn ít nhất 1 sản phẩm' }]}
        >
          <Select
            mode="multiple"
            placeholder="Chọn sản phẩm..."
            onChange={(val) => {
              setSelectedIds(val);

              const allValues = form.getFieldsValue();
              Object.keys(allValues).forEach((key) => {
                if (key.startsWith('qty_')) {
                  const pid = Number(key.replace('qty_', ''));
                  if (!val.includes(pid)) {
                    form.setFieldValue(key, undefined);
                  }
                }
              });
            }}
          >
            {products.map((p) => (
              <Select.Option key={p.id} value={p.id}>
                {p.name} ({p.quantity} tồn)
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        {selectedIds.map((id) => {
          const prod = products.find((p) => p.id === id)!;

          return (
            <Form.Item
              key={id}
              label={`Số lượng cho ${prod.name}`}
              name={`qty_${id}`}
              rules={[
                { required: true, message: 'Nhập số lượng' },
                {
                  validator(_, value) {
                    if (!value || value <= 0) {
                      return Promise.reject('Số lượng phải > 0');
                    }

                    if (value > prod.quantity) {
                      return Promise.reject(
                        `${prod.name} chỉ còn ${prod.quantity} sản phẩm`,
                      );
                    }

                    return Promise.resolve();
                  },
                },
              ]}
            >

              <InputNumber min={1} style={{ width: '100%' }} />
            </Form.Item>
          );
        })}
      </Form>
    </Modal>
  );
};

export default OrderForm;
