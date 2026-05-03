import React, { useEffect, useState } from 'react';
import { Row, Col, Card, Tag, Typography, Timeline } from 'antd';
import {
    FireOutlined, ThunderboltOutlined, TrophyOutlined, AimOutlined,
    CheckCircleOutlined, CloseCircleOutlined, BarChartOutlined, LineChartOutlined,
    HistoryOutlined, EditOutlined,
} from '@ant-design/icons';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import dayjs from 'dayjs';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import { BuoiTap, ChiSoSucKhoe, MucTieu, STORAGE_KEYS, getFromStorage, saveToStorage, seedBuoiTap, seedChiSo, seedMucTieu, LOAI_BAI_TAP_COLOR } from '../types';

dayjs.extend(isSameOrBefore);
const { Title, Text } = Typography;

const GRADIENTS = [
    'linear-gradient(135deg,#667eea,#764ba2)',
    'linear-gradient(135deg,#f093fb,#f5576c)',
    'linear-gradient(135deg,#4facfe,#00f2fe)',
    'linear-gradient(135deg,#43e97b,#38f9d7)',
];

const StatCard: React.FC<{ title: string; value: string | number; suffix?: string; icon: React.ReactNode; gradient: string }> = ({ title, value, suffix, icon, gradient }) => (
    <Card bordered={false} style={{ background: gradient, borderRadius: 16, boxShadow: '0 8px 24px rgba(0,0,0,0.12)' }} bodyStyle={{ padding: '20px 24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
                <Text style={{ color: 'rgba(255,255,255,0.85)', fontSize: 13, display: 'block', marginBottom: 8 }}>{title}</Text>
                <div style={{ fontSize: 32, fontWeight: 800, color: '#fff', lineHeight: 1.2 }}>
                    {value}{suffix && <span style={{ fontSize: 16, marginLeft: 4, fontWeight: 500 }}>{suffix}</span>}
                </div>
            </div>
            <div style={{ width: 48, height: 48, borderRadius: 12, background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, color: '#fff' }}>
                {icon}
            </div>
        </div>
    </Card>
);

const Dashboard: React.FC = () => {
    const [buoiTaps, setBuoiTaps] = useState<BuoiTap[]>([]);
    const [chiSos, setChiSos] = useState<ChiSoSucKhoe[]>([]);
    const [mucTieus, setMucTieus] = useState<MucTieu[]>([]);

    useEffect(() => {
        const bt = getFromStorage<BuoiTap[]>(STORAGE_KEYS.BUOI_TAP, []);
        setBuoiTaps(bt.length ? bt : (() => { saveToStorage(STORAGE_KEYS.BUOI_TAP, seedBuoiTap); return seedBuoiTap; })());
        const cs = getFromStorage<ChiSoSucKhoe[]>(STORAGE_KEYS.CHI_SO, []);
        setChiSos(cs.length ? cs : (() => { saveToStorage(STORAGE_KEYS.CHI_SO, seedChiSo); return seedChiSo; })());
        const mt = getFromStorage<MucTieu[]>(STORAGE_KEYS.MUC_TIEU, []);
        setMucTieus(mt.length ? mt : (() => { saveToStorage(STORAGE_KEYS.MUC_TIEU, seedMucTieu); return seedMucTieu; })());
    }, []);

    const now = dayjs();
    const buoiThang = buoiTaps.filter(b => dayjs(b.ngay).month() === now.month() && dayjs(b.ngay).year() === now.year() && b.trangThai === 'hoan-thanh');
    const tongBuoi = buoiThang.length;
    const tongCalo = buoiThang.reduce((s, b) => s + b.caloDot, 0);

    let streak = 0;
    let check = now.clone();
    const tapSet = new Set(buoiTaps.filter(b => b.trangThai === 'hoan-thanh').map(b => b.ngay));
    for (let i = 0; i < 365; i++) {
        if (tapSet.has(check.format('YYYY-MM-DD'))) { streak++; check = check.subtract(1, 'day'); } else break;
    }

    const dang = mucTieus.filter(m => m.trangThai === 'dang-thuc-hien');
    const avgPct = dang.length === 0 ? 0 : Math.round(dang.reduce((s, m) => s + Math.min(100, (m.giaTriHienTai / m.giaTriMucTieu) * 100), 0) / dang.length);

    const weekData = [1, 2, 3, 4].map(w => {
        const start = now.startOf('month').add((w - 1) * 7, 'day');
        const end = w === 4 ? now.endOf('month') : start.add(6, 'day');
        const buoi = buoiThang.filter(b => { const d = dayjs(b.ngay); return !d.isBefore(start) && d.isSameOrBefore(end); }).length;
        return { tuan: `Tuần ${w}`, buoi };
    });

    const weightData = [...chiSos].sort((a, b) => a.ngay.localeCompare(b.ngay)).map(c => ({ ngay: dayjs(c.ngay).format('DD/MM'), canNang: c.canNang }));
    const recent5 = [...buoiTaps].sort((a, b) => b.ngay.localeCompare(a.ngay)).slice(0, 5);

    return (
        <div style={{ padding: 24, background: '#f0f2f5', minHeight: '100vh' }}>
            <div style={{ background: 'linear-gradient(135deg,#1a1a2e,#16213e,#0f3460)', borderRadius: 20, padding: '32px 36px', marginBottom: 28, boxShadow: '0 12px 40px rgba(0,0,0,0.2)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                    <FireOutlined style={{ fontSize: 40, color: '#ff6b35' }} />
                    <div>
                        <Title level={2} style={{ color: '#fff', margin: 0, fontWeight: 800 }}>Fitness Dashboard</Title>
                        <Text style={{ color: 'rgba(255,255,255,0.65)', fontSize: 15 }}>{now.format('dddd, DD/MM/YYYY')} — Tiếp tục cố gắng! 💪</Text>
                    </div>
                </div>
            </div>

            <Row gutter={[20, 20]} style={{ marginBottom: 28 }}>
                <Col xs={24} sm={12} xl={6}><StatCard title="Buổi tập trong tháng" value={tongBuoi} suffix="buổi" icon={<ThunderboltOutlined />} gradient={GRADIENTS[0]} /></Col>
                <Col xs={24} sm={12} xl={6}><StatCard title="Calo đã đốt" value={tongCalo.toLocaleString()} suffix="kcal" icon={<FireOutlined />} gradient={GRADIENTS[1]} /></Col>
                <Col xs={24} sm={12} xl={6}><StatCard title="Streak hiện tại" value={streak} suffix="ngày" icon={<TrophyOutlined />} gradient={GRADIENTS[2]} /></Col>
                <Col xs={24} sm={12} xl={6}><StatCard title="Mục tiêu hoàn thành" value={avgPct} suffix="%" icon={<AimOutlined />} gradient={GRADIENTS[3]} /></Col>
            </Row>

            <Row gutter={[20, 20]} style={{ marginBottom: 28 }}>
                <Col xs={24} lg={12}>
                    <Card
                        title={<span style={{ fontWeight: 700, display: 'flex', alignItems: 'center', gap: 8 }}><BarChartOutlined style={{ color: '#667eea' }} /> Buổi tập theo tuần</span>}
                        bordered={false} style={{ borderRadius: 16, boxShadow: '0 4px 16px rgba(0,0,0,0.08)' }}>
                        <ResponsiveContainer width="100%" height={240}>
                            <BarChart data={weekData} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
                                <defs><linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#667eea" /><stop offset="100%" stopColor="#764ba2" /></linearGradient></defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                <XAxis dataKey="tuan" tick={{ fontSize: 12 }} />
                                <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
                                <Tooltip formatter={(v: number) => [`${v} buổi`, 'Số buổi tập']} contentStyle={{ borderRadius: 8 }} />
                                <Bar dataKey="buoi" fill="url(#barGrad)" radius={[6, 6, 0, 0]} name="Buổi tập" />
                            </BarChart>
                        </ResponsiveContainer>
                    </Card>
                </Col>
                <Col xs={24} lg={12}>
                    <Card
                        title={<span style={{ fontWeight: 700, display: 'flex', alignItems: 'center', gap: 8 }}><LineChartOutlined style={{ color: '#f5576c' }} /> Thay đổi cân nặng</span>}
                        bordered={false} style={{ borderRadius: 16, boxShadow: '0 4px 16px rgba(0,0,0,0.08)' }}>
                        <ResponsiveContainer width="100%" height={240}>
                            <LineChart data={weightData} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                <XAxis dataKey="ngay" tick={{ fontSize: 11 }} />
                                <YAxis domain={['auto', 'auto']} tick={{ fontSize: 12 }} />
                                <Tooltip formatter={(v: number) => [`${v} kg`, 'Cân nặng']} contentStyle={{ borderRadius: 8 }} />
                                <Line type="monotone" dataKey="canNang" stroke="#f5576c" strokeWidth={3} dot={{ r: 4, fill: '#f5576c' }} activeDot={{ r: 6 }} name="Cân nặng (kg)" />
                            </LineChart>
                        </ResponsiveContainer>
                    </Card>
                </Col>
            </Row>

            <Card
                title={<span style={{ fontWeight: 700, display: 'flex', alignItems: 'center', gap: 8 }}><HistoryOutlined style={{ color: '#764ba2' }} /> 5 Buổi tập gần nhất</span>}
                bordered={false} style={{ borderRadius: 16, boxShadow: '0 4px 16px rgba(0,0,0,0.08)' }}>
                {recent5.length === 0 ? <Text type="secondary">Chưa có buổi tập nào</Text> : (
                    <Timeline mode="left">
                        {recent5.map(bt => (
                            <Timeline.Item key={bt.id} color={bt.trangThai === 'hoan-thanh' ? 'green' : 'red'}
                                dot={bt.trangThai === 'hoan-thanh' ? <CheckCircleOutlined style={{ color: '#52c41a', fontSize: 16 }} /> : <CloseCircleOutlined style={{ color: '#ff4d4f', fontSize: 16 }} />}
                                label={<Text type="secondary" style={{ fontSize: 12 }}>{dayjs(bt.ngay).format('DD/MM/YYYY')}</Text>}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                                    <Text strong>{bt.tenBaiTap}</Text>
                                    <Tag color={LOAI_BAI_TAP_COLOR[bt.loaiBaiTap]} style={{ borderRadius: 8 }}>{bt.loaiBaiTap}</Tag>
                                    <Text type="secondary" style={{ fontSize: 12 }}>{bt.thoiLuong} phút · {bt.caloDot} kcal</Text>
                                </div>
                                {bt.ghiChu && (
                                    <Text type="secondary" style={{ fontSize: 12, display: 'flex', alignItems: 'center', gap: 4, marginTop: 2 }}>
                                        <EditOutlined style={{ fontSize: 11 }} /> {bt.ghiChu}
                                    </Text>
                                )}
                            </Timeline.Item>
                        ))}
                    </Timeline>
                )}
            </Card>
        </div>
    );
};

export default Dashboard;
