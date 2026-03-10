import React, { useState } from 'react';
import { Button, Space, Typography, Table, Card, Tag, Divider, Row, Col, Statistic, ConfigProvider, theme } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { TrophyOutlined, RobotOutlined, UserOutlined, DeleteOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

type LuaChon = 'Kéo' | 'Búa' | 'Bao';

interface LichSuVandau {
  key: number;
  van: number;
  nguoiChoi: LuaChon;
  mayTinh: LuaChon;
  ketQua: 'Thắng' | 'Thua' | 'Hòa';
}

const DANH_SACH_LUA_CHON: LuaChon[] = ['Kéo', 'Búa', 'Bao'];

const EMOJI_MAP: Record<LuaChon, string> = {
  'Kéo': '✌️',
  'Búa': '✊',
  'Bao': '🖐️',
};

const OanTuTi: React.FC = () => {
  const [lichSu, setLichSu] = useState<LichSuVandau[]>([]);
  const [vanHienTai, setVanHienTai] = useState<number>(1);
  const [tranMoiNhat, setTranMoiNhat] = useState<LichSuVandau | null>(null);
  const [dangChon, setDangChon] = useState<LuaChon | null>(null);

  const thangCount = lichSu.filter(v => v.ketQua === 'Thắng').length;
  const thuaCount  = lichSu.filter(v => v.ketQua === 'Thua').length;
  const hoaCount   = lichSu.filter(v => v.ketQua === 'Hòa').length;

  const xuLyChoi = (luaChonNguoiChoi: LuaChon) => {
    setDangChon(luaChonNguoiChoi);
    const luaChonMayTinh = DANH_SACH_LUA_CHON[Math.floor(Math.random() * DANH_SACH_LUA_CHON.length)];
    let ketQua: 'Thắng' | 'Thua' | 'Hòa';

    if (luaChonNguoiChoi === luaChonMayTinh) {
      ketQua = 'Hòa';
    } else if (
      (luaChonNguoiChoi === 'Búa' && luaChonMayTinh === 'Kéo') ||
      (luaChonNguoiChoi === 'Kéo' && luaChonMayTinh === 'Bao') ||
      (luaChonNguoiChoi === 'Bao' && luaChonMayTinh === 'Búa')
    ) {
      ketQua = 'Thắng';
    } else {
      ketQua = 'Thua';
    }

    const banGhiMoi: LichSuVandau = {
      key: vanHienTai,
      van: vanHienTai,
      nguoiChoi: luaChonNguoiChoi,
      mayTinh: luaChonMayTinh,
      ketQua: ketQua,
    };

    setTranMoiNhat(banGhiMoi);
    setLichSu((prev) => [banGhiMoi, ...prev]);
    setVanHienTai((prev) => prev + 1);
  };

  const xoaLichSu = () => {
    setLichSu([]);
    setTranMoiNhat(null);
    setVanHienTai(1);
    setDangChon(null);
  };

  const columns: ColumnsType<LichSuVandau> = [
    {
      title: 'Ván',
      dataIndex: 'van',
      key: 'van',
      align: 'center',
      width: 60,
      render: (van: number) => <Text style={{ color: '#8c8c8c' }}>#{van}</Text>,
    },
    {
      title: 'Bạn chọn',
      dataIndex: 'nguoiChoi',
      key: 'nguoiChoi',
      align: 'center',
      render: (val: LuaChon) => <Text>{EMOJI_MAP[val]} {val}</Text>,
    },
    {
      title: 'Máy chọn',
      dataIndex: 'mayTinh',
      key: 'mayTinh',
      align: 'center',
      render: (val: LuaChon) => <Text>{EMOJI_MAP[val]} {val}</Text>,
    },
    {
      title: 'Kết quả',
      key: 'ketQua',
      dataIndex: 'ketQua',
      align: 'center',
      render: (ketQua: string) => {
        const color = ketQua === 'Thắng' ? 'success' : ketQua === 'Thua' ? 'error' : 'warning';
        return <Tag color={color} style={{ fontWeight: 700, minWidth: 56, textAlign: 'center' }}>{ketQua.toUpperCase()}</Tag>;
      },
    },
  ];

  const ketQuaColor = tranMoiNhat?.ketQua === 'Thắng' ? '#f6ffed'
                    : tranMoiNhat?.ketQua === 'Thua'  ? '#fff2f0'
                    : '#fffbe6';
  const ketQuaBorder = tranMoiNhat?.ketQua === 'Thắng' ? '#b7eb8f'
                     : tranMoiNhat?.ketQua === 'Thua'  ? '#ffccc7'
                     : '#ffe58f';

  return (
    <ConfigProvider>
      <div style={{ maxWidth: 900, margin: '0 auto', padding: '32px 16px' }}>

        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <Title level={2} style={{ margin: 0, fontWeight: 900, letterSpacing: -0.5 }}>
            Oẳn Tù Tì
          </Title>
          <Text type="secondary" style={{ fontSize: 13 }}>Chọn Kéo, Búa hoặc Bao để bắt đầu!</Text>
        </div>

        {lichSu.length > 0 && (
          <Card style={{ marginBottom: 16, borderRadius: 12 }} bodyStyle={{ padding: '16px 24px' }}>
            <Row justify="space-around">
              <Col style={{ textAlign: 'center' }}>
                <Statistic
                  title={<Text style={{ color: '#52c41a', fontSize: 11, letterSpacing: 2 }}>THẮNG</Text>}
                  value={thangCount}
                  valueStyle={{ color: '#52c41a', fontWeight: 900 }}
                  prefix={<TrophyOutlined />}
                />
              </Col>
              <Col style={{ textAlign: 'center' }}>
                <Statistic
                  title={<Text style={{ color: '#faad14', fontSize: 11, letterSpacing: 2 }}>HÒA</Text>}
                  value={hoaCount}
                  valueStyle={{ color: '#faad14', fontWeight: 900 }}
                />
              </Col>
              <Col style={{ textAlign: 'center' }}>
                <Statistic
                  title={<Text style={{ color: '#ff4d4f', fontSize: 11, letterSpacing: 2 }}>THUA</Text>}
                  value={thuaCount}
                  valueStyle={{ color: '#ff4d4f', fontWeight: 900 }}
                />
              </Col>
            </Row>
          </Card>
        )}

        <Card bordered style={{ textAlign: 'center', borderRadius: 12 }}>

          <Space size="large">
            {DANH_SACH_LUA_CHON.map((luaChon) => (
              <Button
                key={luaChon}
                type={dangChon === luaChon && tranMoiNhat ? 'primary' : 'default'}
                size="large"
                onClick={() => xuLyChoi(luaChon)}
                style={{
                  height: 80,
                  width: 100,
                  borderRadius: 12,
                  fontSize: 13,
                  fontWeight: 700,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 4,
                  border: dangChon === luaChon && tranMoiNhat ? undefined : '1.5px solid #d9d9d9',
                }}
              >
                <span style={{ fontSize: 30, lineHeight: 1 }}>{EMOJI_MAP[luaChon]}</span>
                <span>{luaChon}</span>
              </Button>
            ))}
          </Space>

          {tranMoiNhat && (
            <>
              <Divider />
              <div style={{
                padding: '16px 24px',
                backgroundColor: ketQuaColor,
                border: `1px solid ${ketQuaBorder}`,
                borderRadius: 10,
                transition: 'all 0.3s ease',
              }}>
                <Row justify="center" gutter={32} style={{ marginBottom: 12 }}>
                  <Col style={{ textAlign: 'center' }}>
                    <Text type="secondary" style={{ fontSize: 11, letterSpacing: 2, display: 'block', marginBottom: 4 }}>
                      <UserOutlined /> BẠN
                    </Text>
                    <Text style={{ fontSize: 36, lineHeight: 1, display: 'block' }}>{EMOJI_MAP[tranMoiNhat.nguoiChoi]}</Text>
                    <Text strong style={{ fontSize: 14 }}>{tranMoiNhat.nguoiChoi}</Text>
                  </Col>

                  <Col style={{ textAlign: 'center', display: 'flex', alignItems: 'center' }}>
                    <Text style={{ fontSize: 18, color: '#bfbfbf', fontWeight: 700 }}>VS</Text>
                  </Col>

                  <Col style={{ textAlign: 'center' }}>
                    <Text type="secondary" style={{ fontSize: 11, letterSpacing: 2, display: 'block', marginBottom: 4 }}>
                      <RobotOutlined /> MÁY
                    </Text>
                    <Text style={{ fontSize: 36, lineHeight: 1, display: 'block' }}>{EMOJI_MAP[tranMoiNhat.mayTinh]}</Text>
                    <Text strong style={{ fontSize: 14 }}>{tranMoiNhat.mayTinh}</Text>
                  </Col>
                </Row>

                <Text strong style={{ fontSize: 20 }}>
                  {tranMoiNhat.ketQua === 'Thắng' ? '🎉 Bạn Thắng!'
                   : tranMoiNhat.ketQua === 'Thua' ? '💀 Bạn Thua!'
                   : '🤝 Hòa!'}
                </Text>
              </div>
            </>
          )}
        </Card>

        <Card
          title={<Text strong>📋 Lịch Sử Đấu</Text>}
          style={{ marginTop: 20, borderRadius: 12 }}
          extra={
            lichSu.length > 0 && (
              <Button size="small" danger icon={<DeleteOutlined />} onClick={xoaLichSu}>
                Xóa
              </Button>
            )
          }
        >
          <Table
            columns={columns}
            dataSource={lichSu}
            pagination={{ pageSize: 5, size: 'small' }}
            size="middle"
            locale={{ emptyText: 'Chưa có ván đấu nào. Hãy bắt đầu chơi! ' }}
          />
        </Card>

      </div>
    </ConfigProvider>
  );
};

export default OanTuTi;