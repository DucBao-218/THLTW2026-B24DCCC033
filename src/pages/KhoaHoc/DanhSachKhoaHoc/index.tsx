import React, { useState, useEffect } from 'react';
import {
  Table, Input, Select, Tag, Space, Typography, Card,
  Button, Tooltip, Row, Col, Statistic, Badge, Divider,
} from 'antd';
import {
  SearchOutlined, PlusOutlined, EditOutlined, DeleteOutlined,
  BookOutlined, TeamOutlined, UserOutlined, FilterOutlined,
} from '@ant-design/icons';
import type { ColumnsType, TableProps } from 'antd/es/table';
import dayjs from 'dayjs';
import {
  KhoaHoc, GiangVien, TrangThaiKhoaHoc, TRANG_THAI_CONFIG,
  STORAGE_KEYS, getFromStorage, saveToStorage,
  seedKhoaHoc, seedGiangVien,
} from '../types';

const { Title, Text } = Typography;
const { Option } = Select;

interface Props {
  onAdd: () => void;
  onEdit: (item: KhoaHoc) => void;
  onDelete: (item: KhoaHoc) => void;
  refreshKey: number;
}

const DanhSachKhoaHoc: React.FC<Props> = ({ onAdd, onEdit, onDelete, refreshKey }) => {
  const [danhSach, setDanhSach] = useState<KhoaHoc[]>([]);
  const [giangViens, setGiangViens] = useState<GiangVien[]>([]);
  const [search, setSearch] = useState('');
  const [filterGV, setFilterGV] = useState<string>('');
  const [filterTT, setFilterTT] = useState<TrangThaiKhoaHoc | ''>('');

  useEffect(() => {
    const storedGV = getFromStorage<GiangVien[]>(STORAGE_KEYS.GIANG_VIEN, []);
    const gvList = storedGV.length ? storedGV : seedGiangVien;
    if (!storedGV.length) saveToStorage(STORAGE_KEYS.GIANG_VIEN, seedGiangVien);
    setGiangViens(gvList);

    const stored = getFromStorage<KhoaHoc[]>(STORAGE_KEYS.KHOA_HOC, []);
    if (!stored.length) {
      saveToStorage(STORAGE_KEYS.KHOA_HOC, seedKhoaHoc);
      setDanhSach(seedKhoaHoc);
    } else {
      setDanhSach(stored);
    }
  }, [refreshKey]);

  const getGV = (id: string) => giangViens.find((g) => g.id === id);

  const filtered = danhSach.filter((k) => {
    const matchSearch = k.tenKhoaHoc.toLowerCase().includes(search.toLowerCase());
    const matchGV = filterGV ? k.giangVienId === filterGV : true;
    const matchTT = filterTT ? k.trangThai === filterTT : true;
    return matchSearch && matchGV && matchTT;
  });

  const stats = {
    total: danhSach.length,
    dangMo: danhSach.filter((k) => k.trangThai === 'dang-mo').length,
    tamDung: danhSach.filter((k) => k.trangThai === 'tam-dung').length,
    daKetThuc: danhSach.filter((k) => k.trangThai === 'da-ket-thuc').length,
  };

  const columns: ColumnsType<KhoaHoc> = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 100,
      render: (v) => (
        <Tag color="blue" style={{ fontFamily: 'monospace', fontWeight: 600 }}>{v}</Tag>
      ),
    },
    {
      title: 'Tên khóa học',
      dataIndex: 'tenKhoaHoc',
      key: 'tenKhoaHoc',
      ellipsis: { showTitle: false },
      sorter: (a, b) => a.tenKhoaHoc.localeCompare(b.tenKhoaHoc),
      render: (v, record) => (
        <Tooltip title={v}>
          <div>
            <Text strong style={{ display: 'block', fontSize: 13 }}>{v}</Text>
            <Text type="secondary" style={{ fontSize: 11 }}>
              Tạo: {dayjs(record.createdAt).format('DD/MM/YYYY')}
            </Text>
          </div>
        </Tooltip>
      ),
    },
    {
      title: 'Giảng viên',
      dataIndex: 'giangVienId',
      key: 'giangVienId',
      width: 180,
      render: (id) => {
        const gv = getGV(id);
        return gv ? (
          <Space direction="vertical" size={0}>
            <Space>
              <UserOutlined style={{ color: '#1677ff', fontSize: 12 }} />
              <Text style={{ fontSize: 13 }}>{gv.ten}</Text>
            </Space>
            <Text type="secondary" style={{ fontSize: 11 }}>{gv.chuyenMon}</Text>
          </Space>
        ) : (
          <Text type="secondary">—</Text>
        );
      },
    },
    {
      title: 'Số học viên',
      dataIndex: 'soLuongHocVien',
      key: 'soLuongHocVien',
      width: 130,
      sorter: (a, b) => a.soLuongHocVien - b.soLuongHocVien,
      defaultSortOrder: 'descend',
      render: (v) => (
        <Space>
          <TeamOutlined
            style={{ color: v > 0 ? '#1677ff' : '#bbb', fontSize: 14 }}
          />
          <Text strong style={{ color: v > 0 ? '#1677ff' : '#bbb' }}>
            {v.toLocaleString()}
          </Text>
          <Text type="secondary" style={{ fontSize: 11 }}>HV</Text>
        </Space>
      ),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'trangThai',
      key: 'trangThai',
      width: 140,
      filters: (Object.keys(TRANG_THAI_CONFIG) as TrangThaiKhoaHoc[]).map((k) => ({
        text: TRANG_THAI_CONFIG[k].label,
        value: k,
      })),
      onFilter: (value, record) => record.trangThai === value,
      render: (v: TrangThaiKhoaHoc) => (
        <Badge
          status={
            v === 'dang-mo'
              ? 'success'
              : v === 'tam-dung'
              ? 'warning'
              : 'default'
          }
          text={
            <Tag
              color={TRANG_THAI_CONFIG[v].color}
              style={{ marginLeft: 0 }}
            >
              {TRANG_THAI_CONFIG[v].label}
            </Tag>
          }
        />
      ),
    },
    {
      title: 'Thao tác',
      key: 'action',
      width: 110,
      fixed: 'right' as const,
      render: (_, record) => (
        <Space>
          <Tooltip title="Chỉnh sửa">
            <Button
              size="small"
              icon={<EditOutlined />}
              onClick={() => onEdit(record)}
            />
          </Tooltip>
          <Tooltip
            title={
              record.soLuongHocVien > 0
                ? 'Không thể xóa: đang có học viên'
                : 'Xóa khóa học'
            }
          >
            <Button
              size="small"
              danger
              icon={<DeleteOutlined />}
              onClick={() => onDelete(record)}
              disabled={record.soLuongHocVien > 0}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <Row gutter={[16, 16]} style={{ marginBottom: 20 }}>
        <Col xs={12} sm={6}>
          <Card size="small" style={{ textAlign: 'center', border: '1px solid #91caff', background: '#e6f4ff' }}>
            <Statistic
              title={<Text style={{ color: '#1677ff', fontSize: 12 }}>Tổng khóa học</Text>}
              value={stats.total}
              valueStyle={{ color: '#1677ff', fontSize: 22 }}
              prefix={<BookOutlined />}
            />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card size="small" style={{ textAlign: 'center', border: '1px solid #b7eb8f', background: '#f6ffed' }}>
            <Statistic
              title={<Text style={{ color: '#52c41a', fontSize: 12 }}>Đang mở</Text>}
              value={stats.dangMo}
              valueStyle={{ color: '#52c41a', fontSize: 22 }}
            />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card size="small" style={{ textAlign: 'center', border: '1px solid #ffe58f', background: '#fffbe6' }}>
            <Statistic
              title={<Text style={{ color: '#faad14', fontSize: 12 }}>Tạm dừng</Text>}
              value={stats.tamDung}
              valueStyle={{ color: '#faad14', fontSize: 22 }}
            />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card size="small" style={{ textAlign: 'center', border: '1px solid #d9d9d9', background: '#fafafa' }}>
            <Statistic
              title={<Text style={{ color: '#888', fontSize: 12 }}>Đã kết thúc</Text>}
              value={stats.daKetThuc}
              valueStyle={{ color: '#888', fontSize: 22 }}
            />
          </Card>
        </Col>
      </Row>

      <Card>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            marginBottom: 16,
            flexWrap: 'wrap',
            gap: 12,
          }}
        >
          <Title level={4} style={{ margin: 0 }}>
            <BookOutlined style={{ marginRight: 8, color: '#1677ff' }} />
            Danh sách khóa học
          </Title>
          <Button type="primary" icon={<PlusOutlined />} onClick={onAdd}>
            Thêm khóa học
          </Button>
        </div>

        <Row gutter={[12, 12]} style={{ marginBottom: 16 }}>
          <Col xs={24} sm={10} md={8}>
            <Input
              placeholder="Tìm theo tên khóa học..."
              prefix={<SearchOutlined style={{ color: '#bbb' }} />}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              allowClear
            />
          </Col>
          <Col xs={12} sm={7} md={6}>
            <Select
              placeholder={
                <Space>
                  <UserOutlined />
                  Giảng viên
                </Space>
              }
              style={{ width: '100%' }}
              allowClear
              value={filterGV || undefined}
              onChange={(v) => setFilterGV(v || '')}
            >
              {giangViens.map((gv) => (
                <Option key={gv.id} value={gv.id}>
                  {gv.ten}
                </Option>
              ))}
            </Select>
          </Col>
          <Col xs={12} sm={7} md={5}>
            <Select
              placeholder={
                <Space>
                  <FilterOutlined />
                  Trạng thái
                </Space>
              }
              style={{ width: '100%' }}
              allowClear
              value={filterTT || undefined}
              onChange={(v) => setFilterTT((v as TrangThaiKhoaHoc) || '')}
            >
              {(Object.keys(TRANG_THAI_CONFIG) as TrangThaiKhoaHoc[]).map(
                (k) => (
                  <Option key={k} value={k}>
                    <Tag color={TRANG_THAI_CONFIG[k].color} style={{ marginRight: 4 }}>
                      {TRANG_THAI_CONFIG[k].label}
                    </Tag>
                  </Option>
                ),
              )}
            </Select>
          </Col>
          {(search || filterGV || filterTT) && (
            <Col xs={24} sm={24} md={5}>
              <Button
                block
                onClick={() => {
                  setSearch('');
                  setFilterGV('');
                  setFilterTT('');
                }}
              >
                Xóa bộ lọc
              </Button>
            </Col>
          )}
        </Row>

        <Text type="secondary" style={{ display: 'block', marginBottom: 8, fontSize: 12 }}>
          Hiển thị <strong>{filtered.length}</strong> / {danhSach.length} khóa học
          {filtered.length !== danhSach.length && ' (đang lọc)'}
        </Text>

        <Table
          columns={columns}
          dataSource={filtered}
          rowKey="id"
          scroll={{ x: 900 }}
          pagination={{
            pageSize: 8,
            showTotal: (total) => `Tổng ${total} khóa học`,
            showSizeChanger: true,
            pageSizeOptions: ['5', '8', '15', '30'],
          }}
          size="middle"
          rowClassName={(record) =>
            record.soLuongHocVien === 0 ? 'row-no-student' : ''
          }
        />
      </Card>
    </div>
  );
};

export default DanhSachKhoaHoc;