export type TrangThaiKhoaHoc = 'dang-mo' | 'da-ket-thuc' | 'tam-dung';

export interface KhoaHoc {
  id: string;
  tenKhoaHoc: string;
  giangVienId: string;
  soLuongHocVien: number;
  moTa: string;
  trangThai: TrangThaiKhoaHoc;
  createdAt: string;
}

export interface GiangVien {
  id: string;
  ten: string;
  chuyenMon: string;
}

export const TRANG_THAI_CONFIG: Record<
  TrangThaiKhoaHoc,
  { label: string; color: string }
> = {
  'dang-mo': { label: 'Đang mở', color: 'success' },
  'da-ket-thuc': { label: 'Đã kết thúc', color: 'default' },
  'tam-dung': { label: 'Tạm dừng', color: 'warning' },
};

export const STORAGE_KEYS = {
  KHOA_HOC: 'kh_danh_sach',
  GIANG_VIEN: 'kh_giang_vien',
};

export const getFromStorage = <T>(key: string, defaultValue: T): T => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch {
    return defaultValue;
  }
};

export const saveToStorage = <T>(key: string, value: T): void => {
  localStorage.setItem(key, JSON.stringify(value));
};

export const normalizeStr = (str: string): string =>
  str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .toLowerCase();

export const generateId = (): string =>
  'KH' +
  Date.now().toString(36).toUpperCase() +
  Math.random().toString(36).substr(2, 4).toUpperCase();

export const seedGiangVien: GiangVien[] = [
  { id: 'gv-1', ten: 'Nguyễn Văn Anh', chuyenMon: 'Lập trình Web' },
  { id: 'gv-2', ten: 'Trần Thị Bình', chuyenMon: 'Data Science' },
  { id: 'gv-3', ten: 'Lê Văn Cường', chuyenMon: 'Mobile App' },
  { id: 'gv-4', ten: 'Phạm Thị Dung', chuyenMon: 'UI/UX Design' },
  { id: 'gv-5', ten: 'Hoàng Văn Em', chuyenMon: 'DevOps & Cloud' },
  { id: 'gv-6', ten: 'Vũ Thị Phương', chuyenMon: 'AI & Machine Learning' },
];

export const seedKhoaHoc: KhoaHoc[] = [
  {
    id: 'KH001',
    tenKhoaHoc: 'ReactJS từ cơ bản đến nâng cao',
    giangVienId: 'gv-1',
    soLuongHocVien: 245,
    moTa: '<p>Khóa học ReactJS toàn diện giúp bạn xây dựng ứng dụng web hiện đại với React hooks, Redux và TypeScript.</p>',
    trangThai: 'dang-mo',
    createdAt: '2024-09-01',
  },
  {
    id: 'KH002',
    tenKhoaHoc: 'Python cho Data Science',
    giangVienId: 'gv-2',
    soLuongHocVien: 312,
    moTa: '<p>Học phân tích dữ liệu với Python, Pandas, NumPy và Matplotlib từ đầu đến thực chiến.</p>',
    trangThai: 'dang-mo',
    createdAt: '2024-08-15',
  },
  {
    id: 'KH003',
    tenKhoaHoc: 'Flutter & Dart - Lập trình Mobile',
    giangVienId: 'gv-3',
    soLuongHocVien: 0,
    moTa: '<p>Xây dựng ứng dụng mobile đa nền tảng iOS và Android bằng Flutter.</p>',
    trangThai: 'tam-dung',
    createdAt: '2024-10-01',
  },
  {
    id: 'KH004',
    tenKhoaHoc: 'UI/UX Design với Figma',
    giangVienId: 'gv-4',
    soLuongHocVien: 189,
    moTa: '<p>Học thiết kế giao diện người dùng chuyên nghiệp với công cụ Figma từ prototype đến handoff.</p>',
    trangThai: 'da-ket-thuc',
    createdAt: '2024-06-01',
  },
  {
    id: 'KH005',
    tenKhoaHoc: 'Docker & Kubernetes cho DevOps',
    giangVienId: 'gv-5',
    soLuongHocVien: 98,
    moTa: '<p>Containerization và orchestration - xây dựng hệ thống DevOps hiện đại với Docker và K8s.</p>',
    trangThai: 'dang-mo',
    createdAt: '2024-11-01',
  },
  {
    id: 'KH006',
    tenKhoaHoc: 'Machine Learning với TensorFlow',
    giangVienId: 'gv-6',
    soLuongHocVien: 0,
    moTa: '<p>Khám phá thế giới AI/ML với TensorFlow và Keras, xây dựng mô hình dự đoán thực tế.</p>',
    trangThai: 'tam-dung',
    createdAt: '2024-12-01',
  },
  {
    id: 'KH007',
    tenKhoaHoc: 'NodeJS & ExpressJS Backend',
    giangVienId: 'gv-1',
    soLuongHocVien: 176,
    moTa: '<p>Xây dựng RESTful API với Node.js, Express, MongoDB và xác thực JWT.</p>',
    trangThai: 'da-ket-thuc',
    createdAt: '2024-05-01',
  },
  {
    id: 'KH008',
    tenKhoaHoc: 'SQL & Database Design',
    giangVienId: 'gv-2',
    soLuongHocVien: 221,
    moTa: '<p>Thiết kế cơ sở dữ liệu quan hệ, tối ưu query SQL và quản trị PostgreSQL/MySQL.</p>',
    trangThai: 'dang-mo',
    createdAt: '2024-07-01',
  },
];