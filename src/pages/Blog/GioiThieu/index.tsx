import React, { useState, useEffect } from 'react';
import {
    Card, Avatar, Typography, Tag, Space, Row, Col,
    Divider, Progress, Grid, Statistic,
} from 'antd';
import {
    GithubOutlined, TwitterOutlined, LinkedinOutlined,
    GlobalOutlined, BookOutlined, EyeOutlined, CalendarOutlined,
    CodeOutlined,
} from '@ant-design/icons';
import {
    TacGia, BaiViet, STORAGE_KEYS, getFromStorage,
    seedTacGia, seedBaiViets, saveToStorage,
} from '../types';

const { Title, Text, Paragraph } = Typography;
const { useBreakpoint } = Grid;

const SKILL_LEVELS: Record<string, number> = {
    ReactJS: 92, TypeScript: 88, NodeJS: 80, 'Ant Design': 85,
    UMI: 78, 'CSS/SCSS': 82, Git: 90, Docker: 65,
};

const GioiThieu: React.FC = () => {
    const screens = useBreakpoint();
    const [tacGia, setTacGia] = useState<TacGia>(seedTacGia);
    const [baiViets, setBaiViets] = useState<BaiViet[]>([]);

    useEffect(() => {
        const stored = getFromStorage<TacGia | null>(STORAGE_KEYS.TAC_GIA, null);
        if (stored) setTacGia(stored);
        else saveToStorage(STORAGE_KEYS.TAC_GIA, seedTacGia);

        const storedBV = getFromStorage<BaiViet[]>(STORAGE_KEYS.BAI_VIET, []);
        setBaiViets(storedBV.length ? storedBV : seedBaiViets);
    }, []);

    const daDang = baiViets.filter((b) => b.trangThai === 'da-dang');
    const tongLuotXem = daDang.reduce((s, b) => s + b.luotXem, 0);

    const mxhItems = [
        { key: 'github', icon: <GithubOutlined />, label: 'GitHub', color: '#24292e' },
        { key: 'twitter', icon: <TwitterOutlined />, label: 'Twitter', color: '#1da1f2' },
        { key: 'linkedin', icon: <LinkedinOutlined />, label: 'LinkedIn', color: '#0a66c2' },
        { key: 'website', icon: <GlobalOutlined />, label: 'Website', color: '#1677ff' },
    ];

    return (
        <div style={{ padding: screens.xs ? 12 : 24, maxWidth: 860, margin: '0 auto' }}>
            <Card
                style={{ marginBottom: 24, borderRadius: 16, overflow: 'hidden' }}
                bodyStyle={{ padding: 0 }}
            >
                <div style={{
                    height: 160,
                    background: 'linear-gradient(135deg, #0f172a 0%, #1e3a5f 50%, #0d9488 100%)',
                    position: 'relative',
                }} />

                <div style={{ padding: screens.xs ? '0 16px 24px' : '0 32px 32px', position: 'relative' }}>
                    <Avatar
                        src={tacGia.anhDaiDien}
                        size={screens.xs ? 80 : 100}
                        style={{
                            border: '4px solid #fff',
                            marginTop: screens.xs ? -40 : -50,
                            boxShadow: '0 4px 16px rgba(0,0,0,0.15)',
                            display: 'block',
                        }}
                    />

                    <div style={{ marginTop: 16 }}>
                        <Title level={screens.xs ? 3 : 2} style={{ margin: 0 }}>{tacGia.ten}</Title>
                        <Text type="secondary" style={{ fontSize: 14 }}>Frontend Developer · Blogger</Text>
                    </div>

                    <Paragraph
                        style={{ marginTop: 16, fontSize: 14, lineHeight: 1.8, color: '#475569', maxWidth: 600 }}
                    >
                        {tacGia.tieuSu}
                    </Paragraph>

                    <Space wrap style={{ marginTop: 12 }}>
                        {mxhItems.map((item) => {
                            const url = tacGia.mxh[item.key as keyof TacGia['mxh']];
                            if (!url) return null;
                            return (
                                <a key={item.key} href={url} target="_blank" rel="noopener noreferrer">
                                    <Tag
                                        icon={item.icon}
                                        color={item.color}
                                        style={{ cursor: 'pointer', borderRadius: 20, padding: '4px 14px', fontSize: 13 }}
                                    >
                                        {item.label}
                                    </Tag>
                                </a>
                            );
                        })}
                    </Space>
                </div>
            </Card>

            <Row gutter={[16, 16]}>
                <Col xs={24} md={8}>
                    <Card style={{ borderRadius: 12 }}>
                        <Title level={5} style={{ marginBottom: 16 }}>
                            <BookOutlined style={{ color: '#1677ff', marginRight: 8 }} />
                            Thống kê Blog
                        </Title>
                        <Space direction="vertical" style={{ width: '100%' }} size={16}>
                            <Statistic
                                title="Bài viết đã đăng"
                                value={daDang.length}
                                suffix="bài"
                                valueStyle={{ color: '#1677ff', fontSize: 22 }}
                                prefix={<BookOutlined />}
                            />
                            <Statistic
                                title="Tổng lượt xem"
                                value={tongLuotXem.toLocaleString()}
                                suffix="views"
                                valueStyle={{ color: '#52c41a', fontSize: 22 }}
                                prefix={<EyeOutlined />}
                            />
                            <Statistic
                                title="Năm viết blog"
                                value={2}
                                suffix="năm"
                                valueStyle={{ color: '#fa8c16', fontSize: 22 }}
                                prefix={<CalendarOutlined />}
                            />
                        </Space>
                    </Card>
                </Col>

                <Col xs={24} md={16}>
                    <Card style={{ borderRadius: 12 }}>
                        <Title level={5} style={{ marginBottom: 20 }}>
                            <CodeOutlined style={{ color: '#1677ff', marginRight: 8 }} />
                            Kỹ năng
                        </Title>
                        <Space direction="vertical" style={{ width: '100%' }} size={14}>
                            {tacGia.kyNang.map((skill) => {
                                const level = SKILL_LEVELS[skill] || 70;
                                return (
                                    <div key={skill}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                                            <Text strong style={{ fontSize: 13 }}>{skill}</Text>
                                            <Text type="secondary" style={{ fontSize: 12 }}>{level}%</Text>
                                        </div>
                                        <Progress
                                            percent={level}
                                            showInfo={false}
                                            strokeColor={
                                                level >= 90 ? '#52c41a' :
                                                    level >= 80 ? '#1677ff' :
                                                        level >= 70 ? '#fa8c16' : '#ff4d4f'
                                            }
                                            size="small"
                                        />
                                    </div>
                                );
                            })}
                        </Space>
                    </Card>
                </Col>
            </Row>

            <Card style={{ marginTop: 16, borderRadius: 12 }}>
                <Title level={5} style={{ marginBottom: 16 }}>Chủ đề yêu thích</Title>
                <Space wrap>
                    {['Frontend Development', 'ReactJS Ecosystem', 'TypeScript', 'UI/UX Design',
                        'Performance Optimization', 'Developer Tools', 'Best Practices', 'Open Source'].map((t) => (
                            <Tag key={t} style={{ padding: '4px 14px', borderRadius: 20, fontSize: 13 }} color="blue">
                                {t}
                            </Tag>
                        ))}
                </Space>
            </Card>
        </div>
    );
};

export default GioiThieu;