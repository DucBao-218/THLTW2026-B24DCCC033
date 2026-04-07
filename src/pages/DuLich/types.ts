export type LoaiHinh = 'bien' | 'nui' | 'thanh-pho' | 'lang-que' | 'di-tich';

export interface DiemDen {
  id: string;
  ten: string;
  viTri: string; 
  quocGia: string;
  loaiHinh: LoaiHinh;
  hinhAnh: string;
  moTa: string;
  thoiGianThamQuan: number; 
  chiPhiAnUong: number; 
  chiPhiLuuTru: number; 
  chiPhiDiChuyen: number;
  rating: number; 
  luotXem: number;
  luotLichTrinh: number;
  giaVe: number; 
  createdAt: string;
}

export interface DiemDenTrongNgay {
  diemDenId: string;
  ghiChu: string;
  thoiGianBatDau: string; 
  thoiGianKetThuc: string; 
}

export interface Ngay {
  id: string;
  ngay: string; 
  diemDens: DiemDenTrongNgay[];
}

export interface LichTrinh {
  id: string;
  tenLichTrinh: string;
  ngayBatDau: string;
  ngayKetThuc: string;
  ngans: Ngay[];
  nganSachTong: number;
  chiPhiThucTe: number;
  soNguoi: number;
  trangThai: 'draft' | 'confirmed' | 'completed';
  createdAt: string;
  thang: string; 
}

export interface HangMucNganSach {
  ten: string;
  nganSach: number;
  chiTieu: number;
  mauSac: string;
}

export const LOAI_HINH_LABELS: Record<LoaiHinh, string> = {
  bien: '🏖️ Biển',
  nui: '🏔️ Núi',
  'thanh-pho': '🏙️ Thành phố',
  'lang-que': '🌾 Làng quê',
  'di-tich': '🏛️ Di tích',
};

export const STORAGE_KEYS = {
  DIEM_DEN: 'dl_diem_den',
  LICH_TRINH: 'dl_lich_trinh',
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

export const generateId = (): string =>
  Date.now().toString(36) + Math.random().toString(36).substr(2);

export const formatVND = (amount: number): string =>
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);

export const seedDiemDen: DiemDen[] = [
  {
    id: 'dd-1', ten: 'Vịnh Hạ Long', viTri: 'Quảng Ninh', quocGia: 'Việt Nam',
    loaiHinh: 'bien',
    hinhAnh: 'https://images.unsplash.com/photo-1573064425046-5499c00bc2b4?w=600&q=80',
    moTa: 'Di sản thiên nhiên thế giới với hàng nghìn hòn đảo đá vôi kỳ vĩ nổi trên mặt nước xanh biếc.',
    thoiGianThamQuan: 8, chiPhiAnUong: 300000, chiPhiLuuTru: 800000,
    chiPhiDiChuyen: 400000, rating: 4.8, luotXem: 15200, luotLichTrinh: 842,
    giaVe: 250000, createdAt: '2024-01-01',
  },
  {
    id: 'dd-2', ten: 'Hội An', viTri: 'Quảng Nam', quocGia: 'Việt Nam',
    loaiHinh: 'di-tich',
    hinhAnh: 'https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?w=600&q=80',
    moTa: 'Phố cổ Hội An là thương cảng quốc tế phồn thịnh từ thế kỷ 15-19, được UNESCO công nhận.',
    thoiGianThamQuan: 6, chiPhiAnUong: 250000, chiPhiLuuTru: 600000,
    chiPhiDiChuyen: 700000, rating: 4.7, luotXem: 12800, luotLichTrinh: 721,
    giaVe: 120000, createdAt: '2024-01-02',
  },
  {
    id: 'dd-3', ten: 'Đà Lạt', viTri: 'Lâm Đồng', quocGia: 'Việt Nam',
    loaiHinh: 'nui',
    hinhAnh: 'https://images.unsplash.com/photo-1598394790147-3fe6a88e5f33?w=600&q=80',
    moTa: 'Thành phố ngàn hoa với khí hậu mát mẻ quanh năm, thác nước, hồ và vườn hoa rực rỡ.',
    thoiGianThamQuan: 10, chiPhiAnUong: 200000, chiPhiLuuTru: 500000,
    chiPhiDiChuyen: 600000, rating: 4.6, luotXem: 11500, luotLichTrinh: 680,
    giaVe: 0, createdAt: '2024-01-03',
  },
  {
    id: 'dd-4', ten: 'Phú Quốc', viTri: 'Kiên Giang', quocGia: 'Việt Nam',
    loaiHinh: 'bien',
    hinhAnh: 'https://images.unsplash.com/photo-1540202404-a2f29016b523?w=600&q=80',
    moTa: 'Đảo ngọc với bãi biển cát trắng mịn, làn nước trong xanh và resort sang trọng đẳng cấp quốc tế.',
    thoiGianThamQuan: 12, chiPhiAnUong: 400000, chiPhiLuuTru: 1500000,
    chiPhiDiChuyen: 1200000, rating: 4.5, luotXem: 9800, luotLichTrinh: 512,
    giaVe: 0, createdAt: '2024-01-04',
  },
  {
    id: 'dd-5', ten: 'Sapa', viTri: 'Lào Cai', quocGia: 'Việt Nam',
    loaiHinh: 'nui',
    hinhAnh: 'https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=600&q=80',
    moTa: 'Vùng cao nguyên đá với ruộng bậc thang tuyệt đẹp, văn hóa đặc sắc của các dân tộc thiểu số.',
    thoiGianThamQuan: 8, chiPhiAnUong: 180000, chiPhiLuuTru: 400000,
    chiPhiDiChuyen: 350000, rating: 4.6, luotXem: 10200, luotLichTrinh: 598,
    giaVe: 0, createdAt: '2024-01-05',
  },
  {
    id: 'dd-6', ten: 'Hà Nội', viTri: 'Hà Nội', quocGia: 'Việt Nam',
    loaiHinh: 'thanh-pho',
    hinhAnh: 'https://images.unsplash.com/photo-1509030450996-dd1a26dda07a?w=600&q=80',
    moTa: 'Thủ đô nghìn năm văn hiến với Hồ Hoàn Kiếm, phố cổ 36 phố phường và ẩm thực đặc sắc.',
    thoiGianThamQuan: 8, chiPhiAnUong: 250000, chiPhiLuuTru: 700000,
    chiPhiDiChuyen: 0, rating: 4.4, luotXem: 8900, luotLichTrinh: 445,
    giaVe: 0, createdAt: '2024-01-06',
  },
  {
    id: 'dd-7', ten: 'Mù Cang Chải', viTri: 'Yên Bái', quocGia: 'Việt Nam',
    loaiHinh: 'nui',
    hinhAnh: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80',
    moTa: 'Ruộng bậc thang vàng rực rỡ mùa lúa chín, một trong những danh thắng cấp quốc gia.',
    thoiGianThamQuan: 6, chiPhiAnUong: 150000, chiPhiLuuTru: 300000,
    chiPhiDiChuyen: 450000, rating: 4.7, luotXem: 7600, luotLichTrinh: 320,
    giaVe: 0, createdAt: '2024-01-07',
  },
  {
    id: 'dd-8', ten: 'TP. Hồ Chí Minh', viTri: 'TP.HCM', quocGia: 'Việt Nam',
    loaiHinh: 'thanh-pho',
    hinhAnh: 'https://images.unsplash.com/photo-1583417319070-4a69db38a482?w=600&q=80',
    moTa: 'Thành phố năng động nhất Việt Nam với cuộc sống sôi động, ẩm thực phong phú và kiến trúc đa dạng.',
    thoiGianThamQuan: 8, chiPhiAnUong: 300000, chiPhiLuuTru: 900000,
    chiPhiDiChuyen: 800000, rating: 4.3, luotXem: 9100, luotLichTrinh: 490,
    giaVe: 0, createdAt: '2024-01-08',
  },
];

export const seedLichTrinh: LichTrinh[] = [
  {
    id: 'lt-1', tenLichTrinh: 'Hè Hạ Long 3N2Đ',
    ngayBatDau: '2025-07-15', ngayKetThuc: '2025-07-17',
    ngans: [], nganSachTong: 5000000, chiPhiThucTe: 4200000,
    soNguoi: 2, trangThai: 'completed', createdAt: '2025-06-10',
    thang: '2025-07',
  },
  {
    id: 'lt-2', tenLichTrinh: 'Sapa Cuối Tuần',
    ngayBatDau: '2025-08-09', ngayKetThuc: '2025-08-11',
    ngans: [], nganSachTong: 3000000, chiPhiThucTe: 2800000,
    soNguoi: 3, trangThai: 'completed', createdAt: '2025-07-20',
    thang: '2025-08',
  },
  {
    id: 'lt-3', tenLichTrinh: 'Đà Lạt Lãng Mạn',
    ngayBatDau: '2025-09-20', ngayKetThuc: '2025-09-23',
    ngans: [], nganSachTong: 6000000, chiPhiThucTe: 5500000,
    soNguoi: 2, trangThai: 'confirmed', createdAt: '2025-09-01',
    thang: '2025-09',
  },
  {
    id: 'lt-4', tenLichTrinh: 'Phú Quốc Luxury',
    ngayBatDau: '2025-10-01', ngayKetThuc: '2025-10-05',
    ngans: [], nganSachTong: 12000000, chiPhiThucTe: 11200000,
    soNguoi: 2, trangThai: 'completed', createdAt: '2025-09-15',
    thang: '2025-10',
  },
  {
    id: 'lt-5', tenLichTrinh: 'Hội An Cổ Kính',
    ngayBatDau: '2025-11-10', ngayKetThuc: '2025-11-13',
    ngans: [], nganSachTong: 7000000, chiPhiThucTe: 6100000,
    soNguoi: 4, trangThai: 'completed', createdAt: '2025-10-20',
    thang: '2025-11',
  },
  {
    id: 'lt-6', tenLichTrinh: 'Hà Nội - Sapa',
    ngayBatDau: '2026-01-15', ngayKetThuc: '2026-01-18',
    ngans: [], nganSachTong: 4500000, chiPhiThucTe: 4100000,
    soNguoi: 2, trangThai: 'completed', createdAt: '2026-01-01',
    thang: '2026-01',
  },
  {
    id: 'lt-7', tenLichTrinh: 'TP.HCM City Tour',
    ngayBatDau: '2026-02-08', ngayKetThuc: '2026-02-10',
    ngans: [], nganSachTong: 5500000, chiPhiThucTe: 4800000,
    soNguoi: 3, trangThai: 'completed', createdAt: '2026-01-25',
    thang: '2026-02',
  },
  {
    id: 'lt-8', tenLichTrinh: 'Mù Cang Chải Mùa Vàng',
    ngayBatDau: '2026-03-20', ngayKetThuc: '2026-03-22',
    ngans: [], nganSachTong: 3500000, chiPhiThucTe: 3200000,
    soNguoi: 2, trangThai: 'confirmed', createdAt: '2026-03-01',
    thang: '2026-03',
  },
];