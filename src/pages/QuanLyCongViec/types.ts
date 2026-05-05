import type { BadgeProps } from 'antd';

export type TrangThaiTask = 'can-lam' | 'dang-lam' | 'hoan-thanh';
export type UuTienTask = 'Cao' | 'Trung bình' | 'Thấp';

export interface Task {
    id: string;
    tenTask: string;
    moTa: string;
    deadline: string;
    trangThai: TrangThaiTask;
    uuTien: UuTienTask;
    tags: string[];
    ngayTao: string;
}

export const STORAGE_KEY = 'quan_ly_cong_viec_tasks';

export const getFromStorage = <T>(key: string, def: T): T => {
    try {
        const v = localStorage.getItem(key);
        return v ? JSON.parse(v) : def;
    } catch {
        return def;
    }
};

export const saveToStorage = <T>(key: string, value: T): void =>
    localStorage.setItem(key, JSON.stringify(value));

export const generateId = (existingIds: string[] = []): string => {
    let n = existingIds.length + 1;
    let id = `TASK${String(n).padStart(3, '0')}`;
    while (existingIds.includes(id)) {
        n++;
        id = `TASK${String(n).padStart(3, '0')}`;
    }
    return id;
};

export const normalizeStr = (s: string): string =>
    s
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[đĐ]/g, (c) => (c === 'đ' ? 'd' : 'D'))
        .toLowerCase();

export const UU_TIEN_COLOR: Record<UuTienTask, string> = {
    Cao: 'red',
    'Trung bình': 'orange',
    Thấp: 'green',
};

export const UU_TIEN_BG: Record<UuTienTask, string> = {
    Cao: '#fff1f0',
    'Trung bình': '#fff7e6',
    Thấp: '#f6ffed',
};

export const TRANG_THAI_COLOR: Record<TrangThaiTask, BadgeProps['status']> = {
    'can-lam': 'default',
    'dang-lam': 'processing',
    'hoan-thanh': 'success',
};

export const TRANG_THAI_LABEL: Record<TrangThaiTask, string> = {
    'can-lam': 'Cần làm',
    'dang-lam': 'Đang làm',
    'hoan-thanh': 'Hoàn thành',
};

export const TRANG_THAI_OPTIONS: { label: string; value: TrangThaiTask }[] = [
    { label: 'Cần làm', value: 'can-lam' },
    { label: 'Đang làm', value: 'dang-lam' },
    { label: 'Hoàn thành', value: 'hoan-thanh' },
];

export const UU_TIEN_OPTIONS: { label: string; value: UuTienTask }[] = [
    { label: 'Cao', value: 'Cao' },
    { label: 'Trung bình', value: 'Trung bình' },
    { label: 'Thấp', value: 'Thấp' },
];

export const GRADIENTS = {
    blue: 'linear-gradient(135deg,#667eea,#764ba2)',
    green: 'linear-gradient(135deg,#43e97b,#38f9d7)',
    red: 'linear-gradient(135deg,#f093fb,#f5576c)',
    cyan: 'linear-gradient(135deg,#4facfe,#00f2fe)',
};

export const seedTasks: Task[] = [
    {
        id: 'TASK001',
        tenTask: 'Thiết kế giao diện Dashboard',
        moTa: 'Vẽ wireframe và prototype cho màn hình tổng quan dự án',
        deadline: '2026-05-10',
        trangThai: 'hoan-thanh',
        uuTien: 'Cao',
        tags: ['Design', 'UI/UX'],
        ngayTao: '2026-04-20T08:00:00.000Z',
    },
    {
        id: 'TASK002',
        tenTask: 'Xây dựng API đăng nhập',
        moTa: 'Tạo endpoint xác thực người dùng, JWT token, refresh token',
        deadline: '2026-05-08',
        trangThai: 'hoan-thanh',
        uuTien: 'Cao',
        tags: ['Backend', 'API'],
        ngayTao: '2026-04-21T09:00:00.000Z',
    },
    {
        id: 'TASK003',
        tenTask: 'Tích hợp react-beautiful-dnd',
        moTa: 'Cài đặt và cấu hình kéo thả cho Kanban Board',
        deadline: '2026-05-12',
        trangThai: 'dang-lam',
        uuTien: 'Cao',
        tags: ['Frontend', 'React'],
        ngayTao: '2026-04-22T10:00:00.000Z',
    },
    {
        id: 'TASK004',
        tenTask: 'Viết unit test cho modules',
        moTa: 'Coverage tối thiểu 80% cho các component chính',
        deadline: '2026-05-20',
        trangThai: 'can-lam',
        uuTien: 'Trung bình',
        tags: ['Testing'],
        ngayTao: '2026-04-23T11:00:00.000Z',
    },
    {
        id: 'TASK005',
        tenTask: 'Tối ưu hiệu năng tải trang',
        moTa: 'Lazy loading, code splitting, image optimization',
        deadline: '2026-05-25',
        trangThai: 'can-lam',
        uuTien: 'Trung bình',
        tags: ['Performance'],
        ngayTao: '2026-04-24T12:00:00.000Z',
    },
    {
        id: 'TASK006',
        tenTask: 'Cập nhật tài liệu API',
        moTa: 'Viết Swagger docs cho toàn bộ các endpoint mới',
        deadline: '2026-05-06',
        trangThai: 'can-lam',
        uuTien: 'Thấp',
        tags: ['Documentation', 'API'],
        ngayTao: '2026-04-25T13:00:00.000Z',
    },
    {
        id: 'TASK007',
        tenTask: 'Review code Pull Request',
        moTa: 'Review và merge 3 PR đang chờ từ teammates',
        deadline: '2026-05-05',
        trangThai: 'dang-lam',
        uuTien: 'Cao',
        tags: ['Review', 'Team'],
        ngayTao: '2026-04-26T08:00:00.000Z',
    },
    {
        id: 'TASK008',
        tenTask: 'Nghiên cứu GraphQL',
        moTa: 'Tìm hiểu Apollo Client và so sánh với REST API hiện tại',
        deadline: '2026-06-01',
        trangThai: 'can-lam',
        uuTien: 'Thấp',
        tags: ['Research', 'Backend'],
        ngayTao: '2026-04-27T09:00:00.000Z',
    },
    {
        id: 'TASK009',
        tenTask: 'Deploy lên môi trường staging',
        moTa: 'Cấu hình CI/CD pipeline và deploy bản mới nhất',
        deadline: '2026-05-03',
        trangThai: 'hoan-thanh',
        uuTien: 'Cao',
        tags: ['DevOps', 'Deploy'],
        ngayTao: '2026-04-28T10:00:00.000Z',
    },
    {
        id: 'TASK010',
        tenTask: 'Họp retrospective sprint',
        moTa: 'Tổng kết sprint 4, lên kế hoạch sprint 5',
        deadline: '2026-05-09',
        trangThai: 'can-lam',
        uuTien: 'Trung bình',
        tags: ['Meeting', 'Agile'],
        ngayTao: '2026-04-29T11:00:00.000Z',
    },
];
