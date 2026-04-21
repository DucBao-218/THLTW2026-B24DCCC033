import React, { useState, useEffect } from 'react';
import {
    Card, Tag, Typography, Space, Divider, Button, Row, Col,
    Spin, Empty, Avatar, Grid, Breadcrumb,
} from 'antd';
import {
    ArrowLeftOutlined, EyeOutlined, CalendarOutlined,
    UserOutlined, TagOutlined, ClockCircleOutlined,
} from '@ant-design/icons';
import dayjs from 'dayjs';
import { history } from 'umi';
import {
    BaiViet, TheTag, STORAGE_KEYS, getFromStorage, saveToStorage,
    seedBaiViets, seedTags, seedTacGia,
} from '../types';

const { Title, Text, Paragraph } = Typography;
const { useBreakpoint } = Grid;

const renderMarkdown = (md: string): string => {
    return md
        .replace(/^### (.+)$/gm, '<h3 style="margin:20px 0 10px;font-size:16px;">$1</h3>')
        .replace(/^## (.+)$/gm, '<h2 style="margin:24px 0 12px;font-size:20px;border-bottom:1px solid #f0f0f0;padding-bottom:8px;">$1</h2>')
        .replace(/^# (.+)$/gm, '<h1 style="margin:0 0 16px;font-size:26px;font-weight:800;">$1</h1>')
        .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.+?)\*/g, '<em>$1</em>')
        .replace(/`([^`\n]+)`/g, '<code style="background:#f6f8fa;padding:2px 6px;border-radius:4px;font-family:monospace;font-size:13px;color:#d63384;">$1</code>')
        .replace(/```[\w]*\n([\s\S]*?)```/g, '<pre style="background:#1e293b;color:#e2e8f0;padding:16px;border-radius:8px;overflow-x:auto;font-size:13px;line-height:1.7;margin:16px 0;"><code>$1</code></pre>')
        .replace(/^- (.+)$/gm, '<li style="margin:4px 0;">$1</li>')
        .replace(/(<li.*<\/li>\n?)+/g, '<ul style="padding-left:20px;margin:12px 0;">$&</ul>')
        .replace(/^\d+\. (.+)$/gm, '<li style="margin:4px 0;">$1</li>')
        .replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2" style="color:#1677ff;">$1</a>')
        .replace(/\n\n/g, '</p><p style="margin:0 0 12px;line-height:1.8;">')
        .replace(/^(?!<[h|u|p|l|p])/gm, '')
        .replace(/\*(Đang viết\.\.\.\))/g, '<em style="color:#94a3b8;">$1</em>');
};

interface Props {
    match?: { params: { slug: string } };
    slug?: string;
}

const ChiTietBaiViet: React.FC<Props> = ({ match }) => {
    const screens = useBreakpoint();
    const slug = match?.params?.slug || '';
    const [baiViets, setBaiViets] = useState<BaiViet[]>([]);
    const [tags, setTags] = useState<TheTag[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const storedTags = getFromStorage<TheTag[]>(STORAGE_KEYS.THE_TAG, []);
        setTags(storedTags.length ? storedTags : seedTags);

        const storedBV = getFromStorage<BaiViet[]>(STORAGE_KEYS.BAI_VIET, []);
        const list = storedBV.length ? storedBV : seedBaiViets;

        const updated = list.map((b) =>
            b.slug === slug ? { ...b, luotXem: b.luotXem + 1 } : b,
        );
        saveToStorage(STORAGE_KEYS.BAI_VIET, updated);
        setBaiViets(updated);
        setLoading(false);
    }, [slug]);

    const baiViet = baiViets.find((b) => b.slug === slug);
    const getTag = (id: string) => tags.find((t) => t.id === id);

    const related = baiViet
        ? baiViets.filter(
            (b) =>
                b.id !== baiViet.id &&
                b.trangThai === 'da-dang' &&
                b.tagIds.some((t) => baiViet.tagIds.includes(t)),
        ).slice(0, 3)
        : [];

    const readTime = baiViet
        ? Math.max(1, Math.ceil(baiViet.noiDung.split(' ').length / 200))
        : 0;

    if (loading) return <div style={{ textAlign: 'center', padding: 80 }}><Spin size="large" /></div>;
    if (!baiViet) return (
        <div style={{ padding: 24 }}>
            <Empty description="Không tìm thấy bài viết" />
            <div style={{ textAlign: 'center', marginTop: 16 }}>
                <Button icon={<ArrowLeftOutlined />} onClick={() => history.push('/blog/trang-chu')}>
                    Về trang chủ
                </Button>
            </div>
        </div>
    );

    return (
        <div style={{ padding: screens.xs ? 12 : 24, maxWidth: 900, margin: '0 auto' }}>
            <Breadcrumb style={{ marginBottom: 16 }}>
                <Breadcrumb.Item>
                    <a onClick={() => history.push('/blog/trang-chu')}>Blog</a>
                </Breadcrumb.Item>
                <Breadcrumb.Item>{baiViet.tieuDe}</Breadcrumb.Item>
            </Breadcrumb>

            <Button
                icon={<ArrowLeftOutlined />}
                style={{ marginBottom: 20 }}
                onClick={() => history.push('/blog/trang-chu')}
            >
                Quay lại danh sách
            </Button>

            <div style={{ borderRadius: 16, overflow: 'hidden', marginBottom: 28, height: screens.xs ? 200 : 360 }}>
                <img src={baiViet.anhDaiDien} alt={baiViet.tieuDe} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>

            <Space wrap style={{ marginBottom: 16 }}>
                {baiViet.tagIds.map((tid) => {
                    const tag = getTag(tid);
                    return tag ? (
                        <Tag
                            key={tid}
                            color={tag.mauSac}
                            style={{ borderRadius: 20, padding: '2px 12px', cursor: 'pointer' }}
                            onClick={() => history.push('/blog/trang-chu')}
                        >
                            #{tag.ten}
                        </Tag>
                    ) : null;
                })}
            </Space>

            <Title level={screens.xs ? 3 : 1} style={{ marginBottom: 16, lineHeight: 1.4 }}>
                {baiViet.tieuDe}
            </Title>

            <div style={{
                display: 'flex', gap: 20, flexWrap: 'wrap', marginBottom: 24,
                padding: '14px 18px', background: '#f8fafc', borderRadius: 10,
                border: '1px solid #e2e8f0',
            }}>
                <Space>
                    <Avatar
                        src={
                            baiViet.tacGia === seedTacGia.ten
                                ? seedTacGia.anhDaiDien
                                : `https://api.dicebear.com/7.x/adventurer/svg?seed=${baiViet.tacGia}`
                        }
                        size={36}
                    />
                    <div>
                        <Text strong style={{ display: 'block', fontSize: 13 }}>{baiViet.tacGia}</Text>
                        <Text type="secondary" style={{ fontSize: 11 }}>Tác giả</Text>
                    </div>
                </Space>
                <Divider type="vertical" style={{ height: 36, margin: 'auto' }} />
                <Space>
                    <CalendarOutlined style={{ color: '#64748b' }} />
                    <div>
                        <Text style={{ display: 'block', fontSize: 13 }}>{dayjs(baiViet.ngayTao).format('DD/MM/YYYY')}</Text>
                        <Text type="secondary" style={{ fontSize: 11 }}>Ngày đăng</Text>
                    </div>
                </Space>
                <Divider type="vertical" style={{ height: 36, margin: 'auto' }} />
                <Space>
                    <EyeOutlined style={{ color: '#64748b' }} />
                    <div>
                        <Text style={{ display: 'block', fontSize: 13 }}>{baiViet.luotXem.toLocaleString()}</Text>
                        <Text type="secondary" style={{ fontSize: 11 }}>Lượt xem</Text>
                    </div>
                </Space>
                <Divider type="vertical" style={{ height: 36, margin: 'auto' }} />
                <Space>
                    <ClockCircleOutlined style={{ color: '#64748b' }} />
                    <div>
                        <Text style={{ display: 'block', fontSize: 13 }}>{readTime} phút</Text>
                        <Text type="secondary" style={{ fontSize: 11 }}>Thời gian đọc</Text>
                    </div>
                </Space>
            </div>

            <Card style={{ marginBottom: 32, borderRadius: 12 }} bodyStyle={{ padding: screens.xs ? '16px' : '32px' }}>
                <div
                    style={{ fontSize: 15, lineHeight: 1.85, color: '#1e293b' }}
                    dangerouslySetInnerHTML={{ __html: renderMarkdown(baiViet.noiDung) }}
                />
            </Card>

            {related.length > 0 && (
                <>
                    <Title level={4} style={{ marginBottom: 16 }}>
                        Bài viết liên quan
                    </Title>
                    <Row gutter={[16, 16]} style={{ marginBottom: 32 }}>
                        {related.map((bv) => (
                            <Col key={bv.id} xs={24} sm={8}>
                                <Card
                                    hoverable
                                    size="small"
                                    cover={
                                        <img
                                            src={bv.anhDaiDien}
                                            alt={bv.tieuDe}
                                            style={{ height: 120, objectFit: 'cover' }}
                                        />
                                    }
                                    onClick={() => {
                                        history.push(`/blog/bai-viet/${bv.slug}`);
                                        window.scrollTo({ top: 0, behavior: 'smooth' });
                                    }}
                                >
                                    <Text strong style={{ fontSize: 13, display: 'block' }} ellipsis={{ tooltip: bv.tieuDe }}>
                                        {bv.tieuDe}
                                    </Text>
                                    <Space style={{ marginTop: 6 }}>
                                        <EyeOutlined style={{ fontSize: 11, color: '#94a3b8' }} />
                                        <Text style={{ fontSize: 11, color: '#94a3b8' }}>{bv.luotXem.toLocaleString()}</Text>
                                        <CalendarOutlined style={{ fontSize: 11, color: '#94a3b8' }} />
                                        <Text style={{ fontSize: 11, color: '#94a3b8' }}>{dayjs(bv.ngayTao).format('DD/MM')}</Text>
                                    </Space>
                                </Card>
                            </Col>
                        ))}
                    </Row>
                </>
            )}
        </div>
    );
};

export default ChiTietBaiViet;