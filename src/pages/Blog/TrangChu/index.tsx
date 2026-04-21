import React, { useState, useEffect, useCallback } from 'react';
import {
    Card, Row, Col, Input, Tag, Typography, Pagination,
    Empty, Space, Spin, Badge, Grid, Divider,
} from 'antd';
import {
    SearchOutlined, EyeOutlined, CalendarOutlined,
    UserOutlined, TagOutlined, ArrowRightOutlined, EditOutlined,
} from '@ant-design/icons';
import dayjs from 'dayjs';
import { history } from 'umi';
import {
    BaiViet, TheTag, STORAGE_KEYS, getFromStorage,
    saveToStorage, seedBaiViets, seedTags, normalizeStr,
} from '../types';

const { Title, Text, Paragraph } = Typography;
const { useBreakpoint } = Grid;

const PAGE_SIZE = 9;

const TrangChu: React.FC = () => {
    const screens = useBreakpoint();
    const [baiViets, setBaiViets] = useState<BaiViet[]>([]);
    const [tags, setTags] = useState<TheTag[]>([]);
    const [search, setSearch] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');
    const [selectedTag, setSelectedTag] = useState<string>('');
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const storedTags = getFromStorage<TheTag[]>(STORAGE_KEYS.THE_TAG, []);
        const tagList = storedTags.length ? storedTags : seedTags;
        if (!storedTags.length) saveToStorage(STORAGE_KEYS.THE_TAG, seedTags);
        setTags(tagList);

        const storedBV = getFromStorage<BaiViet[]>(STORAGE_KEYS.BAI_VIET, []);
        const list = storedBV.length ? storedBV : seedBaiViets;
        if (!storedBV.length) saveToStorage(STORAGE_KEYS.BAI_VIET, seedBaiViets);
        setBaiViets(list);
        setLoading(false);
    }, []);

    // Debounce 300ms
    useEffect(() => {
        const t = setTimeout(() => setDebouncedSearch(search), 300);
        return () => clearTimeout(t);
    }, [search]);

    useEffect(() => { setPage(1); }, [debouncedSearch, selectedTag]);

    const daDang = baiViets.filter((b) => b.trangThai === 'da-dang');

    const filtered = daDang.filter((b) => {
        const matchSearch = debouncedSearch
            ? normalizeStr(b.tieuDe).includes(normalizeStr(debouncedSearch)) ||
            normalizeStr(b.tomTat).includes(normalizeStr(debouncedSearch))
            : true;
        const matchTag = selectedTag ? b.tagIds.includes(selectedTag) : true;
        return matchSearch && matchTag;
    }).sort((a, b) => b.ngayTao.localeCompare(a.ngayTao));

    const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

    const getTag = (id: string) => tags.find((t) => t.id === id);

    const colSpan = screens.xl ? 8 : screens.md ? 12 : 24;

    return (
        <div style={{ padding: screens.xs ? 12 : 24 }}>
            <div style={{
                background: 'linear-gradient(135deg, #0f172a 0%, #1e3a5f 50%, #0f172a 100%)',
                borderRadius: 16, padding: screens.xs ? '32px 20px' : '56px 48px',
                marginBottom: 32, color: '#fff', position: 'relative', overflow: 'hidden',
            }}>
                <div style={{ position: 'absolute', top: -60, right: -60, width: 240, height: 240, borderRadius: '50%', background: 'rgba(99,179,237,0.08)' }} />
                <div style={{ position: 'absolute', bottom: -80, right: 120, width: 320, height: 320, borderRadius: '50%', background: 'rgba(99,179,237,0.05)' }} />
                <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 0 }}>
                    <EditOutlined style={{ fontSize: screens.xs ? 28 : 40, color: '#63b3ed' }} />
                    <Title level={screens.xs ? 2 : 1} style={{ color: '#fff', margin: 0, fontWeight: 800 }}>
                        Blog Cá Nhân
                    </Title>
                </div>
                <Text style={{ color: 'rgba(255,255,255,0.75)', fontSize: 16, display: 'block', marginTop: 8 }}>
                    Chia sẻ kiến thức, kinh nghiệm về lập trình & công nghệ
                </Text>
                <div style={{ marginTop: 24, display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
                    <Input
                        size="large"
                        placeholder="Tìm kiếm bài viết..."
                        prefix={<SearchOutlined style={{ color: '#64748b' }} />}
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        style={{ maxWidth: 420, borderRadius: 24, background: '#fff', border: '1px solid #e2e8f0', color: '#1e293b' }}
                        allowClear
                    />
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                        <span style={{
                            background: '#1677ff', color: '#fff',
                            borderRadius: '50%', width: 22, height: 22,
                            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: 12, fontWeight: 700,
                        }}>{daDang.length}</span>
                        <Text style={{ color: 'rgba(255,255,255,0.85)', fontSize: 14 }}>bài viết</Text>
                    </span>
                </div>
            </div>

            <div style={{ marginBottom: 24 }}>
                <Space wrap>
                    <Tag
                        style={{ cursor: 'pointer', fontSize: 13, padding: '4px 12px', borderRadius: 20, fontWeight: selectedTag === '' ? 700 : 400 }}
                        color={selectedTag === '' ? 'blue' : 'default'}
                        onClick={() => setSelectedTag('')}
                    >
                        # Tất cả
                    </Tag>
                    {tags.map((t) => {
                        const cnt = daDang.filter((b) => b.tagIds.includes(t.id)).length;
                        if (cnt === 0) return null;
                        return (
                            <Tag
                                key={t.id}
                                color={selectedTag === t.id ? t.mauSac : 'default'}
                                style={{
                                    cursor: 'pointer', fontSize: 13, padding: '4px 12px', borderRadius: 20,
                                    fontWeight: selectedTag === t.id ? 700 : 400,
                                    border: selectedTag === t.id ? undefined : '1px solid #d9d9d9',
                                }}
                                onClick={() => setSelectedTag(selectedTag === t.id ? '' : t.id)}
                            >
                                #{t.ten} <Text style={{ fontSize: 11, opacity: 0.7 }}>({cnt})</Text>
                            </Tag>
                        );
                    })}
                </Space>
            </div>

            <div style={{ marginBottom: 16 }}>
                <Text type="secondary" style={{ fontSize: 13 }}>
                    {debouncedSearch || selectedTag
                        ? `Tìm thấy ${filtered.length} bài viết`
                        : `${filtered.length} bài viết`}
                    {debouncedSearch && <> cho "<strong>{debouncedSearch}</strong>"</>}
                </Text>
            </div>

            {loading ? (
                <div style={{ textAlign: 'center', padding: 60 }}><Spin size="large" /></div>
            ) : paginated.length === 0 ? (
                <Empty description="Không tìm thấy bài viết nào" style={{ padding: 60 }} />
            ) : (
                <Row gutter={[20, 20]}>
                    {paginated.map((bv) => (
                        <Col key={bv.id} span={colSpan}>
                            <Card
                                hoverable
                                cover={
                                    <div style={{ height: 180, overflow: 'hidden', position: 'relative' }}>
                                        <img
                                            src={bv.anhDaiDien}
                                            alt={bv.tieuDe}
                                            style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform .35s' }}
                                            onMouseOver={(e) => (e.currentTarget.style.transform = 'scale(1.06)')}
                                            onMouseOut={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                                        />

                                        <div style={{ position: 'absolute', top: 10, left: 10, display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                                            {bv.tagIds.slice(0, 2).map((tid) => {
                                                const tag = getTag(tid);
                                                return tag ? (
                                                    <Tag
                                                        key={tid}
                                                        color={tag.mauSac}
                                                        style={{ fontSize: 11, margin: 0, borderRadius: 10 }}
                                                        onClick={(e) => { e.stopPropagation(); setSelectedTag(tid); setPage(1); }}
                                                    >
                                                        #{tag.ten}
                                                    </Tag>
                                                ) : null;
                                            })}
                                        </div>
                                    </div>
                                }
                                bodyStyle={{ padding: '14px 16px' }}
                                onClick={() => history.push(`/blog/bai-viet/${bv.slug}`)}
                            >
                                <Title
                                    level={5}
                                    style={{ margin: '0 0 8px', fontSize: 14, lineHeight: 1.5 }}
                                    ellipsis={{ rows: 2, tooltip: bv.tieuDe }}
                                >
                                    {bv.tieuDe}
                                </Title>
                                <Paragraph
                                    type="secondary"
                                    style={{ fontSize: 12, margin: '0 0 12px', lineHeight: 1.6 }}
                                    ellipsis={{ rows: 2 }}
                                >
                                    {bv.tomTat}
                                </Paragraph>
                                <Divider style={{ margin: '10px 0' }} />
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <Space size={4}>
                                        <UserOutlined style={{ fontSize: 11, color: '#94a3b8' }} />
                                        <Text style={{ fontSize: 11, color: '#94a3b8' }}>{bv.tacGia}</Text>
                                    </Space>
                                    <Space size={12}>
                                        <Space size={4}>
                                            <CalendarOutlined style={{ fontSize: 11, color: '#94a3b8' }} />
                                            <Text style={{ fontSize: 11, color: '#94a3b8' }}>{dayjs(bv.ngayTao).format('DD/MM/YYYY')}</Text>
                                        </Space>
                                        <Space size={4}>
                                            <EyeOutlined style={{ fontSize: 11, color: '#94a3b8' }} />
                                            <Text style={{ fontSize: 11, color: '#94a3b8' }}>{bv.luotXem.toLocaleString()}</Text>
                                        </Space>
                                    </Space>
                                </div>
                            </Card>
                        </Col>
                    ))}
                </Row>
            )}

            {filtered.length > PAGE_SIZE && (
                <div style={{ textAlign: 'center', marginTop: 32 }}>
                    <Pagination
                        current={page}
                        total={filtered.length}
                        pageSize={PAGE_SIZE}
                        onChange={(p) => { setPage(p); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                        showTotal={(t) => `Tổng ${t} bài`}
                        showSizeChanger={false}
                    />
                </div>
            )}
        </div>
    );
};

export default TrangChu;