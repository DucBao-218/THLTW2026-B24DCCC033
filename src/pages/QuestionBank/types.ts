export type MucDoKho = 'Dễ' | 'Trung bình' | 'Khó' | 'Rất khó';

export interface KhoiKienThuc {
  id: string;
  ten: string;
  moTa?: string;
}

export interface MonHoc {
  id: string;
  maMon: string;
  tenMon: string;
  soTinChi: number;
}

export interface CauHoi {
  id: string;
  maCauHoi: string;
  monHocId: string;
  noiDung: string;
  mucDoKho: MucDoKho;
  khoiKienThucId: string;
  ngayTao: string;
}

export interface CauTrucDeThi {
  mucDoKho: MucDoKho;
  khoiKienThucId: string;
  soCauHoi: number;
}

export interface MauDeThi {
  id: string;
  ten: string;
  monHocId: string;
  cauTruc: CauTrucDeThi[];
  ngayTao: string;
}

export interface DeThi {
  id: string;
  ten: string;
  monHocId: string;
  mauDeThiId?: string;
  danhSachCauHoi: string[];
  ngayTao: string;
}