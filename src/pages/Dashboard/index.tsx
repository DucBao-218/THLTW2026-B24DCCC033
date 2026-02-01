import React from 'react';
import { Card, Col, Row, Statistic, Progress, Badge } from 'antd';

import { useAppContext } from '@/layouts/AppContext';
import { formatMoney } from '@/utils/format';

const Dashboard: React.FC = () => {
  const { products, orders } = useAppContext();

  const totalProducts = products.length;

  const totalStockValue = products.reduce(
    (sum, p) => sum + p.price * p.quantity,
    0,
  );

  const totalOrders = orders.length;

  const revenue = orders
    .filter((o) => o.status === 'Hoàn thành')
    .reduce((sum, o) => sum + o.totalAmount, 0);

  const statusCounts = {
    pending: orders.filter((o) => o.status === 'Chờ xử lý').length,
    shipping: orders.filter((o) => o.status === 'Đang giao').length,
    done: orders.filter((o) => o.status === 'Hoàn thành').length,
    canceled: orders.filter((o) => o.status === 'Đã hủy').length,
  };

  const totalStatus = Object.values(statusCounts).reduce((a, b) => a + b, 0);

  const donePercent = totalStatus
    ? (statusCounts.done / totalStatus) * 100
    : 0;

  return (
    <Row gutter={[16, 16]}>
      <Col span={6}>
        <Card>
          <Statistic title="Tổng số sản phẩm" value={totalProducts} />
        </Card>
      </Col>

      <Col span={6}>
        <Card>
          <Statistic
            title="Giá trị tồn kho"
            value={formatMoney(totalStockValue)}
          />
        </Card>
      </Col>

      <Col span={6}>
        <Card>
          <Statistic title="Tổng số đơn hàng" value={totalOrders} />
        </Card>
      </Col>

      <Col span={6}>
        <Card>
          <Statistic title="Doanh thu" value={formatMoney(revenue)} />
        </Card>
      </Col>

      <Col span={24}>
        <Card title="Số đơn hàng theo trạng thái">
          <Row gutter={[16, 16]}>
            <Col span={6}>
              <Badge
                color="blue"
                text={`Chờ xử lý: ${statusCounts.pending}`}
              />
            </Col>

            <Col span={6}>
              <Badge
                color="orange"
                text={`Đang giao: ${statusCounts.shipping}`}
              />
            </Col>

            <Col span={6}>
              <Badge
                color="green"
                text={`Hoàn thành: ${statusCounts.done}`}
              />
            </Col>

            <Col span={6}>
              <Badge
                color="red"
                text={`Đã hủy: ${statusCounts.canceled}`}
              />
            </Col>
          </Row>

          <div style={{ marginTop: 20 }}>
            <Progress
              percent={donePercent}
              showInfo={false}
              strokeColor={
                donePercent < 30
                  ? '#ff4d4f'
                  : donePercent < 70
                  ? '#faad14'
                  : '#52c41a'
              }
            />

            <div
              style={{
                marginTop: 8,
                fontWeight: 500,
                fontSize: 14,
              }}
            >
              Hoàn thành {statusCounts.done}/{totalStatus} đơn (
              {donePercent.toFixed(0)}%)
            </div>
          </div>
        </Card>
      </Col>
    </Row>
  );
};

export default Dashboard;
