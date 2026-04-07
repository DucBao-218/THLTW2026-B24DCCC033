import React, { useState, useEffect } from 'react';
import {
  Card, Row, Col, Tag, Rate, Select, Slider, Input, Badge,
  Typography, Space, Button, Tooltip, Empty, Drawer, Descriptions,
  Statistic, Divider, Grid,
} from 'antd';
import {
  EnvironmentOutlined, ClockCircleOutlined, DollarOutlined,
  FilterOutlined, StarFilled, FireOutlined, EyeOutlined, SearchOutlined,
  HeartOutlined, HeartFilled, ArrowUpOutlined,
} from '@ant-design/icons';
import {
  DiemDen, LoaiHinh, LOAI_HINH_LABELS, STORAGE_KEYS,
  getFromStorage, saveToStorage, seedDiemDen, formatVND,
} from '../types';

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;
const { useBreakpoint } = Grid;

type SortType = 'rating' | 'gia-tang' | 'gia-giam' | 'pho-bien';

const KhamPhaDiemDen: React.FC = () => {
  const screens = useBreakpoint();
  const [diemDens, setDiemDens] = useState<DiemDen[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [filterLoai, setFilterLoai] = useState<LoaiHinh | ''>('');
  const [filterRating, setFilterRating] = useState<number>(0);
  const [filterGia, setFilterGia] = useState<[number, number]>([0, 2000000]);
  const [sortBy, setSortBy] = useState<SortType>('pho-bien');
  const [search, setSearch] = useState('');
  const [drawerItem, setDrawerItem] = useState<DiemDen | null>(null);
  const [showFilter, setShowFilter] = useState(false);

  useEffect(() => {
    const stored = getFromStorage<DiemDen[]>(STORAGE_KEYS.DIEM_DEN, []);
    const list = stored.length ? stored : seedDiemDen;
    if (!stored.length) saveToStorage(STORAGE_KEYS.DIEM_DEN, seedDiemDen);
    setDiemDens(list);
  }, []);

  const toggleFav = (id: string) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id],
    );
  };

  const filtered = diemDens
    .filter((d) => {
      const matchLoai = filterLoai ? d.loaiHinh === filterLoai : true;
      const matchRating = d.rating >= filterRating;
      const totalCost = d.chiPhiAnUong + d.chiPhiLuuTru;
      const matchGia = totalCost >= filterGia[0] && totalCost <= filterGia[1];
      const matchSearch =
        d.ten.toLowerCase().includes(search.toLowerCase()) ||
        d.viTri.toLowerCase().includes(search.toLowerCase());
      return matchLoai && matchRating && matchGia && matchSearch;
    })
    .sort((a, b) => {
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'gia-tang') return (a.chiPhiAnUong + a.chiPhiLuuTru) - (b.chiPhiAnUong + b.chiPhiLuuTru);
      if (sortBy === 'gia-giam') return (b.chiPhiAnUong + b.chiPhiLuuTru) - (a.chiPhiAnUong + a.chiPhiLuuTru);
      return b.luotLichTrinh - a.luotLichTrinh;
    });

  const colSpan = screens.xl ? 6 : screens.lg ? 8 : screens.md ? 12 : 24;

  const FilterPanel = (
    <Space direction="vertical" style={{ width: '100%' }} size={16}>
      <div>
        <Text strong>Loại hình</Text>
        <Select
          value={filterLoai || undefined}
          placeholder="Tất cả loại hình"
          allowClear
          style={{ width: '100%', marginTop: 8 }}
          onChange={(v) => setFilterLoai(v || '')}
        >
          {(Object.keys(LOAI_HINH_LABELS) as LoaiHinh[]).map((k) => (
            <Option key={k} value={k}>{LOAI_HINH_LABELS[k]}</Option>
          ))}
        </Select>
      </div>
      <div>
        <Text strong>Đánh giá tối thiểu</Text>
        <Rate
          value={filterRating}
          onChange={setFilterRating}
          style={{ display: 'block', marginTop: 8 }}
        />
      </div>
      <div>
        <Text strong>Chi phí/ngày (VND)</Text>
        <Slider
          range
          min={0}
          max={2000000}
          step={100000}
          value={filterGia}
          onChange={(v) => setFilterGia(v as [number, number])}
          tooltip={{ formatter: (v) => formatVND(v || 0) }}
          style={{ marginTop: 8 }}
        />
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <Text type="secondary" style={{ fontSize: 12 }}>{formatVND(filterGia[0])}</Text>
          <Text type="secondary" style={{ fontSize: 12 }}>{formatVND(filterGia[1])}</Text>
        </div>
      </div>
      <Button
        block
        onClick={() => { setFilterLoai(''); setFilterRating(0); setFilterGia([0, 2000000]); }}
      >
        Xóa bộ lọc
      </Button>
    </Space>
  );

  return (
    <div style={{ padding: screens.xs ? 12 : 24 }}>
      <div
        style={{
          background: 'linear-gradient(135deg, #1d4ed8 0%, #0891b2 50%, #059669 100%)',
          borderRadius: 16,
          padding: screens.xs ? '32px 20px' : '56px 48px',
          marginBottom: 28,
          color: '#fff',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div style={{
          position: 'absolute', top: -40, right: -40, width: 200, height: 200,
          borderRadius: '50%', background: 'rgba(255,255,255,0.08)',
        }} />
        <div style={{
          position: 'absolute', bottom: -60, right: 80, width: 300, height: 300,
          borderRadius: '50%', background: 'rgba(255,255,255,0.05)',
        }} />
        <Title level={screens.xs ? 3 : 1} style={{ color: '#fff', margin: 0, fontWeight: 800 }}>
          🗺️ Khám phá Việt Nam
        </Title>
        <Text style={{ color: 'rgba(255,255,255,0.85)', fontSize: screens.xs ? 14 : 16, display: 'block', marginTop: 8 }}>
          Hàng trăm điểm đến tuyệt đẹp đang chờ bạn khám phá
        </Text>
        <div style={{ marginTop: 20, display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <Input
            size="large"
            placeholder="Tìm kiếm điểm đến..."
            prefix={<SearchOutlined />}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ maxWidth: 400, borderRadius: 24 }}
            allowClear
          />
        </div>
      </div>

      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        marginBottom: 20, flexWrap: 'wrap', gap: 12,
      }}>
        <Space wrap>
          <Text type="secondary">Tìm thấy <strong>{filtered.length}</strong> điểm đến</Text>
          <Select value={sortBy} onChange={setSortBy} style={{ width: 160 }}>
            <Option value="pho-bien">🔥 Phổ biến nhất</Option>
            <Option value="rating">⭐ Đánh giá cao</Option>
            <Option value="gia-tang">💰 Giá tăng dần</Option>
            <Option value="gia-giam">💰 Giá giảm dần</Option>
          </Select>
        </Space>
        <Space wrap>
          {(Object.keys(LOAI_HINH_LABELS) as LoaiHinh[]).map((k) => (
            <Tag.CheckableTag
              key={k}
              checked={filterLoai === k}
              onChange={(checked) => setFilterLoai(checked ? k : '')}
              style={{ fontSize: 12, padding: '2px 10px', cursor: 'pointer' }}
            >
              {LOAI_HINH_LABELS[k]}
            </Tag.CheckableTag>
          ))}
          <Button icon={<FilterOutlined />} onClick={() => setShowFilter(true)}>
            Bộ lọc {(filterRating > 0 || filterGia[0] > 0 || filterGia[1] < 2000000) ? '•' : ''}
          </Button>
        </Space>
      </div>

      {filtered.length === 0 ? (
        <Empty description="Không tìm thấy điểm đến phù hợp" style={{ padding: 60 }} />
      ) : (
        <Row gutter={[16, 16]}>
          {filtered.map((dd) => (
            <Col key={dd.id} span={colSpan}>
              <Badge.Ribbon
                text={dd.luotLichTrinh > 700 ? '🔥 Hot' : undefined}
                color="volcano"
                style={{ display: dd.luotLichTrinh > 700 ? 'block' : 'none' }}
              >
                <Card
                  hoverable
                  cover={
                    <div style={{ position: 'relative', height: 180, overflow: 'hidden' }}>
                      <img
                        alt={dd.ten}
                        src={dd.hinhAnh}
                        style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform .3s' }}
                        onMouseOver={(e) => (e.currentTarget.style.transform = 'scale(1.08)')}
                        onMouseOut={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                      />
                      <div style={{
                        position: 'absolute', top: 8, right: 8,
                        background: 'rgba(0,0,0,0.5)', borderRadius: 20,
                        padding: '2px 8px', display: 'flex', alignItems: 'center', gap: 4,
                      }}>
                        <StarFilled style={{ color: '#fadb14', fontSize: 12 }} />
                        <Text style={{ color: '#fff', fontSize: 12 }}>{dd.rating}</Text>
                      </div>
                      <button
                        onClick={(e) => { e.stopPropagation(); toggleFav(dd.id); }}
                        style={{
                          position: 'absolute', top: 8, left: 8,
                          background: 'rgba(255,255,255,0.9)', border: 'none',
                          borderRadius: '50%', width: 32, height: 32,
                          cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}
                      >
                        {favorites.includes(dd.id)
                          ? <HeartFilled style={{ color: '#ff4d4f' }} />
                          : <HeartOutlined style={{ color: '#666' }} />}
                      </button>
                    </div>
                  }
                  bodyStyle={{ padding: '12px 16px' }}
                  onClick={() => setDrawerItem(dd)}
                >
                  <div style={{ marginBottom: 4 }}>
                    <Tag color="blue" style={{ fontSize: 11 }}>
                      {LOAI_HINH_LABELS[dd.loaiHinh]}
                    </Tag>
                  </div>
                  <Title level={5} style={{ margin: '4px 0', fontSize: 15 }} ellipsis={{ tooltip: dd.ten }}>
                    {dd.ten}
                  </Title>
                  <Space style={{ marginBottom: 8 }}>
                    <EnvironmentOutlined style={{ color: '#1677ff', fontSize: 12 }} />
                    <Text type="secondary" style={{ fontSize: 12 }}>{dd.viTri}</Text>
                  </Space>
                  <Divider style={{ margin: '8px 0' }} />
                  <Row gutter={8}>
                    <Col span={12}>
                      <Space>
                        <ClockCircleOutlined style={{ color: '#52c41a', fontSize: 11 }} />
                        <Text style={{ fontSize: 11 }}>{dd.thoiGianThamQuan}h</Text>
                      </Space>
                    </Col>
                    <Col span={12}>
                      <Space>
                        <DollarOutlined style={{ color: '#fa8c16', fontSize: 11 }} />
                        <Text style={{ fontSize: 11 }}>
                          {formatVND(dd.chiPhiAnUong + dd.chiPhiLuuTru)}/ngày
                        </Text>
                      </Space>
                    </Col>
                  </Row>
                  <div style={{ marginTop: 8, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Space>
                      <FireOutlined style={{ color: '#ff4d4f', fontSize: 11 }} />
                      <Text style={{ fontSize: 11, color: '#666' }}>{dd.luotLichTrinh.toLocaleString()} lịch trình</Text>
                    </Space>
                    <Button type="link" size="small" style={{ padding: 0 }}>Chi tiết →</Button>
                  </div>
                </Card>
              </Badge.Ribbon>
            </Col>
          ))}
        </Row>
      )}

      <Drawer
        title="Bộ lọc nâng cao"
        open={showFilter}
        onClose={() => setShowFilter(false)}
        placement={screens.xs ? 'bottom' : 'right'}
        height={screens.xs ? '70vh' : undefined}
        width={screens.xs ? undefined : 320}
      >
        {FilterPanel}
      </Drawer>

      {/* Detail drawer */}
      <Drawer
        title={drawerItem?.ten}
        open={!!drawerItem}
        onClose={() => setDrawerItem(null)}
        width={screens.xs ? '100%' : 480}
        placement={screens.xs ? 'bottom' : 'right'}
        height={screens.xs ? '85vh' : undefined}
      >
        {drawerItem && (
          <>
            <img
              src={drawerItem.hinhAnh}
              alt={drawerItem.ten}
              style={{ width: '100%', height: 220, objectFit: 'cover', borderRadius: 12, marginBottom: 16 }}
            />
            <Space style={{ marginBottom: 12 }} wrap>
              <Tag color="blue">{LOAI_HINH_LABELS[drawerItem.loaiHinh]}</Tag>
              <Rate disabled value={drawerItem.rating} style={{ fontSize: 14 }} />
              <Text strong>{drawerItem.rating}/5</Text>
            </Space>
            <Paragraph type="secondary">{drawerItem.moTa}</Paragraph>
            <Divider />
            <Row gutter={[16, 16]}>
              <Col span={12}>
                <Statistic title="Thời gian tham quan" value={drawerItem.thoiGianThamQuan} suffix="giờ" />
              </Col>
              <Col span={12}>
                <Statistic title="Giá vé" value={drawerItem.giaVe > 0 ? formatVND(drawerItem.giaVe) : 'Miễn phí'} />
              </Col>
              <Col span={12}>
                <Statistic
                  title="Ăn uống/ngày"
                  value={formatVND(drawerItem.chiPhiAnUong)}
                  valueStyle={{ fontSize: 14 }}
                />
              </Col>
              <Col span={12}>
                <Statistic
                  title="Lưu trú/đêm"
                  value={formatVND(drawerItem.chiPhiLuuTru)}
                  valueStyle={{ fontSize: 14 }}
                />
              </Col>
              <Col span={12}>
                <Statistic
                  title="Di chuyển từ HN"
                  value={formatVND(drawerItem.chiPhiDiChuyen)}
                  valueStyle={{ fontSize: 14 }}
                />
              </Col>
              <Col span={12}>
                <Statistic title="Lịch trình đã tạo" value={drawerItem.luotLichTrinh.toLocaleString()} />
              </Col>
            </Row>
          </>
        )}
      </Drawer>
    </div>
  );
};

export default KhamPhaDiemDen;