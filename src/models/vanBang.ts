import { useState, useCallback } from 'react';

export interface SoVanBangItem {
    id: string;
    nam: number;
    ten: string;
    soThuTu: number; 
}

export interface QuyetDinhItem {
    id: string;
    soQD: string;
    ngayBanHanh: string;
    trichYeu: string;
    soVanBangId: string;
    luotTraCuu: number;
}

export interface CauHinhItem {
    id: string;
    ten: string;
    kieuDuLieu: 'String' | 'Number' | 'Date';
    batBuoc: boolean;
}

export interface VanBangItem {
    id: string;
    soVaoSo: number;
    soHieuVanBang: string;
    maSV: string;
    hoTen: string;
    ngaySinh: string;
    quyetDinhId: string;
    extraFields: Record<string, any>; 
}

const LS_KEYS = {
    soVanBang: 'vb__so_van_bang',
    quyetDinh: 'vb__quyet_dinh',
    vanBang: 'vb__van_bang',
    cauHinh: 'vb__cau_hinh',
};

function lsLoad<T>(key: string, fallback: T): T {
    try {
        const raw = localStorage.getItem(key);
        return raw ? (JSON.parse(raw) as T) : fallback;
    } catch {
        return fallback;
    }
}

function lsSave(key: string, value: unknown): void {
    try {
        localStorage.setItem(key, JSON.stringify(value));
    } catch {}
}

const SEED_CAU_HINH: CauHinhItem[] = [
    { id: 'cf1', ten: 'Dân tộc', kieuDuLieu: 'String', batBuoc: false },
    { id: 'cf2', ten: 'Nơi sinh', kieuDuLieu: 'String', batBuoc: false },
    { id: 'cf3', ten: 'Điểm trung bình', kieuDuLieu: 'Number', batBuoc: true },
    { id: 'cf4', ten: 'Xếp hạng', kieuDuLieu: 'String', batBuoc: true },
    { id: 'cf5', ten: 'Hệ đào tạo', kieuDuLieu: 'String', batBuoc: true },
    { id: 'cf6', ten: 'Ngày nhập học', kieuDuLieu: 'Date', batBuoc: false },
];

const SEED_SO_VAN_BANG: SoVanBangItem[] = [
    { id: 'svb2023', nam: 2023, ten: 'Sổ văn bằng năm 2023', soThuTu: 2 },
    { id: 'svb2024', nam: 2024, ten: 'Sổ văn bằng năm 2024', soThuTu: 3 },
];

const SEED_QUYET_DINH: QuyetDinhItem[] = [
    { id: 'qd1', soQD: 'QĐ-01/2024', ngayBanHanh: '2024-06-15', trichYeu: 'Công nhận tốt nghiệp đợt 1 năm 2024', soVanBangId: 'svb2024', luotTraCuu: 12 },
    { id: 'qd2', soQD: 'QĐ-02/2024', ngayBanHanh: '2024-11-20', trichYeu: 'Công nhận tốt nghiệp đợt 2 năm 2024', soVanBangId: 'svb2024', luotTraCuu: 5 },
    { id: 'qd3', soQD: 'QĐ-01/2023', ngayBanHanh: '2023-07-10', trichYeu: 'Công nhận tốt nghiệp đợt 1 năm 2023', soVanBangId: 'svb2023', luotTraCuu: 30 },
];

const SEED_VAN_BANG: VanBangItem[] = [
    { id: 'vb1', soVaoSo: 1, soHieuVanBang: 'B2024001', maSV: 'SV20190001', hoTen: 'Nguyễn Văn An', ngaySinh: '2001-03-15', quyetDinhId: 'qd1', extraFields: { cf1: 'Kinh', cf2: 'Hà Nội', cf3: 3.5, cf4: 'Giỏi', cf5: 'Chính quy', cf6: '2019-09-01' } },
    { id: 'vb2', soVaoSo: 2, soHieuVanBang: 'B2024002', maSV: 'SV20190002', hoTen: 'Trần Thị Bình', ngaySinh: '2001-07-22', quyetDinhId: 'qd1', extraFields: { cf1: 'Tày', cf2: 'Lạng Sơn', cf3: 3.8, cf4: 'Xuất sắc', cf5: 'Chính quy', cf6: '2019-09-01' } },
    { id: 'vb3', soVaoSo: 3, soHieuVanBang: 'B2024003', maSV: 'SV20190003', hoTen: 'Lê Hoàng Cường', ngaySinh: '2001-11-05', quyetDinhId: 'qd2', extraFields: { cf1: 'Kinh', cf2: 'TP. HCM', cf3: 3.2, cf4: 'Khá', cf5: 'Chính quy', cf6: '2019-09-01' } },
    { id: 'vb4', soVaoSo: 1, soHieuVanBang: 'B2023001', maSV: 'SV20180001', hoTen: 'Phạm Minh Đức', ngaySinh: '2000-05-18', quyetDinhId: 'qd3', extraFields: { cf1: 'Kinh', cf2: 'Đà Nẵng', cf3: 3.6, cf4: 'Giỏi', cf5: 'Chính quy', cf6: '2018-09-01' } },
    { id: 'vb5', soVaoSo: 2, soHieuVanBang: 'B2023002', maSV: 'SV20180002', hoTen: 'Hoàng Thị Lan', ngaySinh: '2000-08-30', quyetDinhId: 'qd3', extraFields: { cf1: 'Kinh', cf2: 'Hải Phòng', cf3: 3.9, cf4: 'Xuất sắc', cf5: 'Chất lượng cao', cf6: '2018-09-01' } },
];

export default function useVanBangModel() {
    const [soVanBang, _setSoVanBang] = useState<SoVanBangItem[]>(() =>
        lsLoad(LS_KEYS.soVanBang, SEED_SO_VAN_BANG)
    );
    const [quyetDinh, _setQuyetDinh] = useState<QuyetDinhItem[]>(() =>
        lsLoad(LS_KEYS.quyetDinh, SEED_QUYET_DINH)
    );
    const [vanBang, _setVanBang] = useState<VanBangItem[]>(() =>
        lsLoad(LS_KEYS.vanBang, SEED_VAN_BANG)
    );
    const [cauHinh, _setCauHinh] = useState<CauHinhItem[]>(() =>
        lsLoad(LS_KEYS.cauHinh, SEED_CAU_HINH)
    );

    const setSoVanBang = useCallback((updater: SoVanBangItem[] | ((prev: SoVanBangItem[]) => SoVanBangItem[])) => {
        _setSoVanBang(prev => {
            const next = typeof updater === 'function' ? updater(prev) : updater;
            lsSave(LS_KEYS.soVanBang, next);
            return next;
        });
    }, []);

    const setQuyetDinh = useCallback((updater: QuyetDinhItem[] | ((prev: QuyetDinhItem[]) => QuyetDinhItem[])) => {
        _setQuyetDinh(prev => {
            const next = typeof updater === 'function' ? updater(prev) : updater;
            lsSave(LS_KEYS.quyetDinh, next);
            return next;
        });
    }, []);

    const setVanBang = useCallback((updater: VanBangItem[] | ((prev: VanBangItem[]) => VanBangItem[])) => {
        _setVanBang(prev => {
            const next = typeof updater === 'function' ? updater(prev) : updater;
            lsSave(LS_KEYS.vanBang, next);
            return next;
        });
    }, []);

    const setCauHinh = useCallback((updater: CauHinhItem[] | ((prev: CauHinhItem[]) => CauHinhItem[])) => {
        _setCauHinh(prev => {
            const next = typeof updater === 'function' ? updater(prev) : updater;
            lsSave(LS_KEYS.cauHinh, next);
            return next;
        });
    }, []);

    const addVanBang = useCallback((payload: Omit<VanBangItem, 'id' | 'soVaoSo'>): VanBangItem | null => {
        const qd = quyetDinh.find(q => q.id === payload.quyetDinhId);
        if (!qd) return null;

        let newVanBang: VanBangItem | null = null;

        _setSoVanBang(prevSVB => {
            const nextSVB = prevSVB.map(svb => {
                if (svb.id !== qd.soVanBangId) return svb;
                const newSoThuTu = svb.soThuTu + 1;
                newVanBang = { ...payload, id: `vb_${Date.now()}`, soVaoSo: newSoThuTu };
                return { ...svb, soThuTu: newSoThuTu };
            });
            lsSave(LS_KEYS.soVanBang, nextSVB);
            return nextSVB;
        });

        if (!newVanBang) return null;

        _setVanBang(prev => {
            const next = [...prev, newVanBang!];
            lsSave(LS_KEYS.vanBang, next);
            return next;
        });

        return newVanBang;
    }, [quyetDinh]);

    const incrementLuotTraCuu = useCallback((quyetDinhId: string) => {
        _setQuyetDinh(prev => {
            const next = prev.map(q =>
                q.id === quyetDinhId ? { ...q, luotTraCuu: (q.luotTraCuu || 0) + 1 } : q
            );
            lsSave(LS_KEYS.quyetDinh, next);
            return next;
        });
    }, []);

    const addSoVanBang = useCallback((item: Omit<SoVanBangItem, 'id' | 'soThuTu'>): boolean => {
        let ok = true;
        _setSoVanBang(prev => {
            if (prev.some(s => s.nam === item.nam)) { ok = false; return prev; }
            const next = [...prev, { ...item, id: `svb${item.nam}`, soThuTu: 0 }];
            lsSave(LS_KEYS.soVanBang, next);
            return next;
        });
        return ok;
    }, []);

    return {
        soVanBang, setSoVanBang, addSoVanBang,
        quyetDinh, setQuyetDinh,
        vanBang, setVanBang, addVanBang,
        cauHinh, setCauHinh,
        incrementLuotTraCuu,
    };
}