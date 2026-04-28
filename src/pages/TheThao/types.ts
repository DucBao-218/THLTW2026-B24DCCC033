export type LoaiBaiTap = 'Cardio' | 'Strength' | 'Yoga' | 'HIIT' | 'Other';
export type TrangThaiBuoiTap = 'hoan-thanh' | 'bo-lo';
export type LoaiMucTieu = 'giam-can' | 'tang-co' | 'suc-ben' | 'khac';
export type TrangThaiMucTieu = 'dang-thuc-hien' | 'da-dat' | 'da-huy';
export type NhomCo = 'Chest' | 'Back' | 'Legs' | 'Shoulders' | 'Arms' | 'Core' | 'Full Body';
export type MucDoKho = 'De' | 'Trung binh' | 'Kho';

export interface BuoiTap {
    id: string;
    ngay: string;
    loaiBaiTap: LoaiBaiTap;
    tenBaiTap: string;
    thoiLuong: number;
    caloDot: number;
    ghiChu: string;
    trangThai: TrangThaiBuoiTap;
}

export interface ChiSoSucKhoe {
    id: string;
    ngay: string;
    canNang: number;
    chieuCao: number;
    nhipTim: number;
    gioNgu: number;
}

export interface MucTieu {
    id: string;
    ten: string;
    loai: LoaiMucTieu;
    giaTriMucTieu: number;
    giaTriHienTai: number;
    donVi: string;
    deadline: string;
    trangThai: TrangThaiMucTieu;
    moTa: string;
}

export interface BaiTap {
    id: string;
    ten: string;
    nhomCo: NhomCo;
    mucDo: MucDoKho;
    moTa: string;
    caloDotTrungBinhGio: number;
    huongDan: string;
}

export const STORAGE_KEYS = {
    BUOI_TAP: 'thethao_buoi_tap',
    CHI_SO: 'thethao_chi_so',
    MUC_TIEU: 'thethao_muc_tieu',
    BAI_TAP: 'thethao_bai_tap',
};

export const getFromStorage = <T>(key: string, def: T): T => {
    try {
        const v = localStorage.getItem(key);
        return v ? JSON.parse(v) : def;
    } catch {
        return def;
    }
};

export const saveToStorage = <T>(key: string, value: T) =>
    localStorage.setItem(key, JSON.stringify(value));

export const generateId = (prefix: string, existingIds: string[] = []): string => {
    let n = existingIds.length + 1;
    let id = `${prefix}${String(n).padStart(3, '0')}`;
    while (existingIds.includes(id)) {
        n++;
        id = `${prefix}${String(n).padStart(3, '0')}`;
    }
    return id;
};

export const tinhBMI = (canNang: number, chieuCao: number): number => {
    if (!chieuCao || !canNang) return 0;
    const chieuCaoM = chieuCao / 100;
    return parseFloat((canNang / (chieuCaoM * chieuCaoM)).toFixed(1));
};

export const phanLoaiBMI = (bmi: number): { text: string; color: string } => {
    if (bmi < 18.5) return { text: 'Thiếu cân', color: 'blue' };
    if (bmi < 25) return { text: 'Bình thường', color: 'green' };
    if (bmi < 30) return { text: 'Thừa cân', color: 'orange' };
    return { text: 'Béo phì', color: 'red' };
};

export const normalizeStr = (s: string) =>
    s
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[đĐ]/g, (c) => (c === 'đ' ? 'd' : 'D'))
        .toLowerCase();

export const LOAI_BAI_TAP_OPTIONS: { label: string; value: LoaiBaiTap }[] = [
    { label: 'Cardio', value: 'Cardio' },
    { label: 'Strength', value: 'Strength' },
    { label: 'Yoga', value: 'Yoga' },
    { label: 'HIIT', value: 'HIIT' },
    { label: 'Khác', value: 'Other' },
];

export const LOAI_BAI_TAP_COLOR: Record<LoaiBaiTap, string> = {
    Cardio: 'cyan',
    Strength: 'orange',
    Yoga: 'purple',
    HIIT: 'red',
    Other: 'default',
};

export const LOAI_MUC_TIEU_OPTIONS = [
    { label: 'Giảm cân', value: 'giam-can' },
    { label: 'Tăng cơ', value: 'tang-co' },
    { label: 'Cải thiện sức bền', value: 'suc-ben' },
    { label: 'Khác', value: 'khac' },
];

export const LOAI_MUC_TIEU_LABEL: Record<LoaiMucTieu, string> = {
    'giam-can': 'Giảm cân',
    'tang-co': 'Tăng cơ',
    'suc-ben': 'Cải thiện sức bền',
    khac: 'Khác',
};

export const TRANG_THAI_MUC_TIEU_COLOR: Record<TrangThaiMucTieu, string> = {
    'dang-thuc-hien': 'processing',
    'da-dat': 'success',
    'da-huy': 'error',
};

export const TRANG_THAI_MUC_TIEU_LABEL: Record<TrangThaiMucTieu, string> = {
    'dang-thuc-hien': 'Đang thực hiện',
    'da-dat': 'Đã đạt',
    'da-huy': 'Đã hủy',
};

export const MUC_DO_COLOR: Record<MucDoKho, string> = {
    De: 'green',
    'Trung binh': 'orange',
    Kho: 'red',
};

export const seedBuoiTap: BuoiTap[] = [
    { id: 'BT001', ngay: '2026-04-01', loaiBaiTap: 'Cardio', tenBaiTap: 'Chạy bộ buổi sáng', thoiLuong: 45, caloDot: 420, ghiChu: 'Chạy 5km quanh hồ', trangThai: 'hoan-thanh' },
    { id: 'BT002', ngay: '2026-04-02', loaiBaiTap: 'Strength', tenBaiTap: 'Tập ngực - vai', thoiLuong: 60, caloDot: 380, ghiChu: 'Bench press, shoulder press', trangThai: 'hoan-thanh' },
    { id: 'BT003', ngay: '2026-04-03', loaiBaiTap: 'Yoga', tenBaiTap: 'Yoga buổi sáng', thoiLuong: 30, caloDot: 120, ghiChu: '', trangThai: 'hoan-thanh' },
    { id: 'BT004', ngay: '2026-04-04', loaiBaiTap: 'HIIT', tenBaiTap: 'HIIT toàn thân', thoiLuong: 25, caloDot: 350, ghiChu: 'Tabata 8 rounds', trangThai: 'hoan-thanh' },
    { id: 'BT005', ngay: '2026-04-05', loaiBaiTap: 'Cardio', tenBaiTap: 'Đạp xe', thoiLuong: 60, caloDot: 480, ghiChu: '', trangThai: 'bo-lo' },
    { id: 'BT006', ngay: '2026-04-07', loaiBaiTap: 'Strength', tenBaiTap: 'Tập lưng - tay', thoiLuong: 55, caloDot: 360, ghiChu: 'Pull-up, row, curl', trangThai: 'hoan-thanh' },
    { id: 'BT007', ngay: '2026-04-08', loaiBaiTap: 'Cardio', tenBaiTap: 'Bơi lội', thoiLuong: 45, caloDot: 400, ghiChu: '20 vòng bể 25m', trangThai: 'hoan-thanh' },
    { id: 'BT008', ngay: '2026-04-09', loaiBaiTap: 'Yoga', tenBaiTap: 'Yoga phục hồi', thoiLuong: 40, caloDot: 130, ghiChu: 'Giãn cơ sau tập nặng', trangThai: 'hoan-thanh' },
    { id: 'BT009', ngay: '2026-04-10', loaiBaiTap: 'HIIT', tenBaiTap: 'Jump rope HIIT', thoiLuong: 20, caloDot: 310, ghiChu: '', trangThai: 'hoan-thanh' },
    { id: 'BT010', ngay: '2026-04-12', loaiBaiTap: 'Strength', tenBaiTap: 'Ngày chân', thoiLuong: 70, caloDot: 450, ghiChu: 'Squat, leg press, lunge', trangThai: 'hoan-thanh' },
    { id: 'BT011', ngay: '2026-04-14', loaiBaiTap: 'Cardio', tenBaiTap: 'Chạy bộ buổi tối', thoiLuong: 35, caloDot: 320, ghiChu: '', trangThai: 'hoan-thanh' },
    { id: 'BT012', ngay: '2026-04-15', loaiBaiTap: 'HIIT', tenBaiTap: 'Burpee Challenge', thoiLuong: 15, caloDot: 250, ghiChu: '100 burpees', trangThai: 'bo-lo' },
    { id: 'BT013', ngay: '2026-04-17', loaiBaiTap: 'Strength', tenBaiTap: 'Full body strength', thoiLuong: 65, caloDot: 410, ghiChu: '', trangThai: 'hoan-thanh' },
    { id: 'BT014', ngay: '2026-04-21', loaiBaiTap: 'Cardio', tenBaiTap: 'Chạy bộ', thoiLuong: 50, caloDot: 460, ghiChu: '6km pace 5:30', trangThai: 'hoan-thanh' },
    { id: 'BT015', ngay: '2026-04-25', loaiBaiTap: 'Yoga', tenBaiTap: 'Ashtanga Yoga', thoiLuong: 60, caloDot: 200, ghiChu: 'Flow yoga nâng cao', trangThai: 'hoan-thanh' },
    { id: 'BT016', ngay: '2026-04-27', loaiBaiTap: 'HIIT', tenBaiTap: 'HIIT cardio mix', thoiLuong: 30, caloDot: 390, ghiChu: '', trangThai: 'hoan-thanh' },
    { id: 'BT017', ngay: '2026-04-28', loaiBaiTap: 'Strength', tenBaiTap: 'Ngực vai hôm nay', thoiLuong: 60, caloDot: 370, ghiChu: 'Tăng tạ 5kg', trangThai: 'hoan-thanh' },
];

export const seedChiSo: ChiSoSucKhoe[] = [
    { id: 'CS001', ngay: '2026-01-01', canNang: 72.5, chieuCao: 175, nhipTim: 68, gioNgu: 7.5 },
    { id: 'CS002', ngay: '2026-01-15', canNang: 72.1, chieuCao: 175, nhipTim: 67, gioNgu: 7 },
    { id: 'CS003', ngay: '2026-02-01', canNang: 71.8, chieuCao: 175, nhipTim: 66, gioNgu: 7.5 },
    { id: 'CS004', ngay: '2026-02-15', canNang: 71.3, chieuCao: 175, nhipTim: 65, gioNgu: 8 },
    { id: 'CS005', ngay: '2026-03-01', canNang: 70.9, chieuCao: 175, nhipTim: 64, gioNgu: 7 },
    { id: 'CS006', ngay: '2026-03-15', canNang: 70.5, chieuCao: 175, nhipTim: 63, gioNgu: 7.5 },
    { id: 'CS007', ngay: '2026-04-01', canNang: 70.0, chieuCao: 175, nhipTim: 62, gioNgu: 8 },
    { id: 'CS008', ngay: '2026-04-15', canNang: 69.7, chieuCao: 175, nhipTim: 61, gioNgu: 7.5 },
    { id: 'CS009', ngay: '2026-04-28', canNang: 69.3, chieuCao: 175, nhipTim: 60, gioNgu: 8 },
];

export const seedMucTieu: MucTieu[] = [
    { id: 'MT001', ten: 'Giảm 5kg trong 3 tháng', loai: 'giam-can', giaTriMucTieu: 5, giaTriHienTai: 3.2, donVi: 'kg', deadline: '2026-06-30', trangThai: 'dang-thuc-hien', moTa: 'Từ 72.5kg xuống 67.5kg bằng cardio + diet' },
    { id: 'MT002', ten: 'Chạy 5km dưới 25 phút', loai: 'suc-ben', giaTriMucTieu: 25, giaTriHienTai: 27.5, donVi: 'phút', deadline: '2026-05-31', trangThai: 'dang-thuc-hien', moTa: 'Cải thiện tốc độ chạy bộ' },
    { id: 'MT003', ten: 'Tăng 3kg cơ', loai: 'tang-co', giaTriMucTieu: 3, giaTriHienTai: 3, donVi: 'kg', deadline: '2026-03-31', trangThai: 'da-dat', moTa: 'Tập strength 4 buổi/tuần' },
    { id: 'MT004', ten: 'Tập 20 buổi tháng này', loai: 'khac', giaTriMucTieu: 20, giaTriHienTai: 14, donVi: 'buổi', deadline: '2026-04-30', trangThai: 'dang-thuc-hien', moTa: 'Đảm bảo đủ số buổi tập mỗi tháng' },
    { id: 'MT005', ten: 'Yoga 30 ngày liên tiếp', loai: 'suc-ben', giaTriMucTieu: 30, giaTriHienTai: 12, donVi: 'ngày', deadline: '2026-05-15', trangThai: 'da-huy', moTa: '' },
];

export const seedBaiTap: BaiTap[] = [
    { id: 'BTP001', ten: 'Chạy bộ', nhomCo: 'Full Body', mucDo: 'De', moTa: 'Bài tập cardio cơ bản, phù hợp mọi trình độ', caloDotTrungBinhGio: 560, huongDan: 'Khởi động 5 phút đi bộ nhanh.\nChạy với nhịp tim 65-75% max HR.\nDuy trì tư thế thẳng, cánh tay đánh nhẹ.\nKết thúc bằng 5 phút giảm tốc.\n\nMẹo: Thở qua mũi khi vào, thở ra miệng.' },
    { id: 'BTP002', ten: 'Bench Press', nhomCo: 'Chest', mucDo: 'Trung binh', moTa: 'Bài tập cổ điển phát triển cơ ngực, vai trước và tay sau', caloDotTrungBinhGio: 350, huongDan: 'Nằm ngửa trên ghế, lưng thẳng, chân chạm sàn.\nGrip ngang vai hoặc rộng hơn 1 nắm tay.\nHạ thanh xuống ngực nhẹ nhàng (2 giây).\nĐẩy lên với lực ngực là chủ đạo.\n4 sets x 8-12 reps.\n\nCảnh báo: Cần người bắt khi dùng tạ nặng.' },
    { id: 'BTP003', ten: 'Squat', nhomCo: 'Legs', mucDo: 'Trung binh', moTa: 'Bài tập vua cho cơ đùi, mông và lõi cơ thể', caloDotTrungBinhGio: 400, huongDan: 'Đứng rộng bằng vai, mũi chân hơi xoay ra ngoài.\nHạ người xuống như ngồi ghế, đầu gối không vượt mũi chân.\nGiữ lưng thẳng, ngực ưỡn.\nĐẩy từ gót chân để đứng lên.\n4 sets x 10-15 reps.' },
    { id: 'BTP004', ten: 'Pull-up', nhomCo: 'Back', mucDo: 'Kho', moTa: 'Bài tập bodyweight phát triển lưng rộng và tay trước', caloDotTrungBinhGio: 370, huongDan: 'Bám xà rộng hơn vai, lòng bàn tay hướng ra ngoài.\nTừ treo thẳng, kéo người lên đến cằm qua xà.\nHạ người xuống từ từ (3 giây).\nKhông bỏ chân xuống đất giữa các rep.\n3 sets đến failure.' },
    { id: 'BTP005', ten: 'Plank', nhomCo: 'Core', mucDo: 'De', moTa: 'Bài tập isometric phát triển sức mạnh vùng lõi', caloDotTrungBinhGio: 250, huongDan: 'Chống khuỷu tay trên sàn, thẳng hàng với vai.\nGiữ cơ thể thành một đường thẳng từ đầu đến gót.\nGiữ vùng bụng và mông siết lại.\nThở đều và sâu.\nBắt đầu từ 30 giây, tăng dần lên 2 phút.' },
    { id: 'BTP006', ten: 'Deadlift', nhomCo: 'Back', mucDo: 'Kho', moTa: 'Bài tập tổng hợp mạnh nhất cho lưng dưới, mông và đùi sau', caloDotTrungBinhGio: 420, huongDan: 'Đứng sát thanh tạ, chân rộng hông.\nCúi xuống grip thanh (hơi rộng hơn vai).\nLưng thẳng, ngực ưỡn, nhìn thẳng.\nĐẩy gót xuống đất, kéo thanh thẳng lên.\nHạ xuống có kiểm soát.\n4 sets x 5-6 reps với tạ nặng.' },
    { id: 'BTP007', ten: 'Yoga Sun Salutation', nhomCo: 'Full Body', mucDo: 'De', moTa: 'Chuỗi động tác yoga kinh điển, khởi động và dẻo dẻo toàn thân', caloDotTrungBinhGio: 200, huongDan: 'Đứng thẳng (Tadasana), hít thở sâu.\nNâng tay lên đầu (Urdhva Hastasana).\nGập người ra trước (Uttanasana).\nBước chân phải ra sau (Anjaneyasana).\nHạ xuống Plank.\nChuyển sang Cobra.\nĐẩy lên Downward Dog.\nLặp lại 6-12 vòng.' },
    { id: 'BTP008', ten: 'Burpee', nhomCo: 'Full Body', mucDo: 'Kho', moTa: 'Bài tập HIIT toàn thân đốt calo cực kỳ hiệu quả', caloDotTrungBinhGio: 600, huongDan: 'Đứng thẳng, nhảy xuống tư thế plank.\nThực hiện 1 push-up.\nNhảy chân về phía trước.\nNhảy lên cao, tay vỗ trên đầu.\n10 reps x 4 sets với nghỉ 30 giây.\n\nBiến thể: Burpee không nhảy cho người mới.' },
    { id: 'BTP009', ten: 'Dumbbell Curl', nhomCo: 'Arms', mucDo: 'De', moTa: 'Bài tập cơ bản phát triển cơ tay trước (bicep)', caloDotTrungBinhGio: 280, huongDan: 'Đứng thẳng, cầm tạ 2 tay, lòng bàn tay hướng lên.\nGiữ khuỷu tay sát người, không đung đưa.\nCo tay lên đến vai.\nHạ xuống chậm rãi.\n3 sets x 12-15 reps mỗi tay.' },
    { id: 'BTP010', ten: 'Shoulder Press', nhomCo: 'Shoulders', mucDo: 'Trung binh', moTa: 'Bài tập phát triển cơ vai toàn diện', caloDotTrungBinhGio: 330, huongDan: 'Ngồi hoặc đứng, cầm tạ ngang vai, khuỷu 90 độ.\nĐẩy tạ thẳng lên đầu đến khi tay gần thẳng.\nHạ xuống từ từ về vị trí ban đầu.\nKhông khóa khuỷu hoàn toàn.\n4 sets x 10-12 reps.' },
    { id: 'BTP011', ten: 'Jump Rope', nhomCo: 'Full Body', mucDo: 'Trung binh', moTa: 'Nhảy dây — cardio hiệu quả, phối hợp tay chân tốt', caloDotTrungBinhGio: 700, huongDan: 'Giữ dây thẳng, quay bằng cổ tay.\nNhảy nhẹ, chỉ cách đất 2-3cm.\nGiữ đầu gối hơi co.\nBắt đầu 1 phút nhảy / 30 giây nghỉ.\nTăng dần lên 3 phút / 30 giây nghỉ.' },
    { id: 'BTP012', ten: 'Leg Press', nhomCo: 'Legs', mucDo: 'De', moTa: 'Bài tập máy an toàn phát triển cơ đùi và mông', caloDotTrungBinhGio: 360, huongDan: 'Ngồi vào máy, lưng tựa ghế, chân rộng hông trên bàn đạp.\nHạ bàn đạp xuống từ từ đến khi đầu gối 90 độ.\nĐẩy về vị trí ban đầu từ gót chân.\nKhông khóa gối hoàn toàn.\n4 sets x 12-15 reps.' },
];
