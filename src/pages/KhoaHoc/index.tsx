import React, { useState, useEffect, useCallback } from 'react';
import { message } from 'antd';
import {
  KhoaHoc, GiangVien, STORAGE_KEYS,
  getFromStorage, saveToStorage, seedGiangVien,
  seedKhoaHoc, generateId,
} from './types';
import DanhSachKhoaHoc from './DanhSachKhoaHoc';
import FormKhoaHoc from './FormKhoaHoc';
import XacNhanXoa from './XacNhanXoa';
import dayjs from 'dayjs';

const QuanLyKhoaHocPage: React.FC = () => {
  const [giangViens, setGiangViens] = useState<GiangVien[]>([]);
  const [khoaHocs, setKhoaHocs] = useState<KhoaHoc[]>([]);
  const [refreshKey, setRefreshKey] = useState(0);

  const [formOpen, setFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<KhoaHoc | null>(null);

  const [deleteItem, setDeleteItem] = useState<KhoaHoc | null>(null);

  useEffect(() => {
    const storedGV = getFromStorage<GiangVien[]>(STORAGE_KEYS.GIANG_VIEN, []);
    const gvList = storedGV.length ? storedGV : seedGiangVien;
    if (!storedGV.length) saveToStorage(STORAGE_KEYS.GIANG_VIEN, seedGiangVien);
    setGiangViens(gvList);

    const storedKH = getFromStorage<KhoaHoc[]>(STORAGE_KEYS.KHOA_HOC, []);
    const khList = storedKH.length ? storedKH : seedKhoaHoc;
    if (!storedKH.length) saveToStorage(STORAGE_KEYS.KHOA_HOC, seedKhoaHoc);
    setKhoaHocs(khList);
  }, []);

  const refresh = useCallback(() => setRefreshKey((k) => k + 1), []);

  const saveList = (list: KhoaHoc[]) => {
    setKhoaHocs(list);
    saveToStorage(STORAGE_KEYS.KHOA_HOC, list);
  };

  const handleAdd = () => {
    setEditingItem(null);
    setFormOpen(true);
  };

  const handleEdit = (item: KhoaHoc) => {
    setEditingItem(item);
    setFormOpen(true);
  };

  const handleDeleteRequest = (item: KhoaHoc) => {
    setDeleteItem(item);
  };

  const handleFormSubmit = (values: Omit<KhoaHoc, 'id' | 'createdAt'>) => {
    if (editingItem) {
      const updated = khoaHocs.map((k) =>
        k.id === editingItem.id ? { ...k, ...values } : k,
      );
      saveList(updated);
      message.success('Cập nhật khóa học thành công!');
    } else {
      const newItem: KhoaHoc = {
        id: generateId(),
        ...values,
        createdAt: dayjs().format('YYYY-MM-DD'),
      };
      saveList([...khoaHocs, newItem]);
      message.success('Thêm khóa học mới thành công!');
    }
    setFormOpen(false);
    refresh();
  };

  const handleDeleteConfirm = () => {
    if (!deleteItem) return;
    const updated = khoaHocs.filter((k) => k.id !== deleteItem.id);
    saveList(updated);
    message.success(`Đã xóa khóa học "${deleteItem.tenKhoaHoc}"`);
    setDeleteItem(null);
    refresh();
  };

  const existingNames = khoaHocs.map((k) => k.tenKhoaHoc);

  return (
    <>
      <DanhSachKhoaHoc
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDeleteRequest}
        refreshKey={refreshKey}
      />

      <FormKhoaHoc
        open={formOpen}
        editingItem={editingItem}
        giangViens={giangViens}
        existingNames={existingNames}
        onSubmit={handleFormSubmit}
        onCancel={() => setFormOpen(false)}
      />

      <XacNhanXoa
        open={!!deleteItem}
        item={deleteItem}
        giangViens={giangViens}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteItem(null)}
      />
    </>
  );
};

export default QuanLyKhoaHocPage;