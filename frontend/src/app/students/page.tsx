'use client';
import React, { useEffect, useState, useMemo } from 'react';
import { toast } from 'sonner';
import { Plus, Search, SlidersHorizontal, Pencil, Trash2, Eye, MoreHorizontal, ChevronLeft, ChevronRight, Download } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { MainLayout } from '@/components/layout/MainLayout';
import { Header } from '@/components/layout/Header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { studentService } from '@/services/studentService';
import { Student } from '@/types';
import { getStatusLabel, getStatusColor, formatGPA } from '@/utils/stats';

const PAGE_SIZE = 15;
const CLASSES = ['Tất cả', 'CS2021A', 'CS2021B', 'CS2022A', 'CS2022B', 'CS2023A', 'CS2023B'];
const STATUSES = ['Tất cả', 'excellent', 'good', 'average', 'at-risk', 'failing'];
const STATUS_LABELS: Record<string, string> = { 'Tất cả': 'Tất cả', excellent: 'Xuất sắc', good: 'Giỏi', average: 'Trung bình', 'at-risk': 'Cảnh báo', failing: 'Yếu' };

function SkeletonRow() {
  return (
    <tr className="border-b border-gray-50 animate-pulse">
      {Array.from({ length: 6 }).map((_, i) => (
        <td key={i} className="px-4 py-3">
          <div className="h-4 rounded bg-gray-100" style={{ width: i === 1 ? '60%' : i === 0 ? '40%' : '50%' }} />
        </td>
      ))}
    </tr>
  );
}

function DeleteDialog({ student, onConfirm, onClose }: { student: Student; onConfirm: () => void; onClose: () => void }) {
  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Xác nhận xóa sinh viên</DialogTitle>
        <DialogDescription>
          Bạn có chắc muốn xóa <strong>{student.name}</strong> ({student.studentId})? Hành động này không thể hoàn tác.
        </DialogDescription>
      </DialogHeader>
      <div className="flex justify-end gap-2 mt-4">
        <Button variant="outline" size="sm" onClick={onClose}>Hủy</Button>
        <Button variant="destructive" size="sm" onClick={onConfirm}>
          <Trash2 size={14} aria-hidden /> Xóa sinh viên
        </Button>
      </div>
    </DialogContent>
  );
}

function StudentDetailDialog({ student, onClose }: { student: Student; onClose: () => void }) {
  return (
    <DialogContent className="max-w-2xl">
      <DialogHeader>
        <DialogTitle>Chi tiết sinh viên</DialogTitle>
      </DialogHeader>
      <div className="grid grid-cols-2 gap-4 text-sm mt-2">
        <div className="space-y-3">
          <div><span className="text-gray-500 text-xs">Mã sinh viên</span><p className="font-mono font-medium">{student.studentId}</p></div>
          <div><span className="text-gray-500 text-xs">Họ và tên</span><p className="font-medium">{student.name}</p></div>
          <div><span className="text-gray-500 text-xs">Email</span><p className="text-gray-700">{student.email}</p></div>
          <div><span className="text-gray-500 text-xs">Lớp</span><p>{student.class}</p></div>
          <div><span className="text-gray-500 text-xs">Ngành</span><p>{student.major}</p></div>
        </div>
        <div className="space-y-3">
          <div><span className="text-gray-500 text-xs">GPA</span><p className="text-xl font-bold text-indigo-600">{formatGPA(student.gpa)}</p></div>
          <div><span className="text-gray-500 text-xs">Xếp loại</span><p className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${getStatusColor(student.status)}`}>{getStatusLabel(student.status)}</p></div>
          <div><span className="text-gray-500 text-xs">Năm nhập học</span><p>{student.year}</p></div>
        </div>
      </div>
      <div className="mt-4">
        <p className="text-xs font-semibold text-gray-500 mb-2">Điểm số các môn</p>
        <div className="grid grid-cols-2 gap-2">
          {student.scores.map(sc => (
            <div key={sc.subject} className="flex items-center justify-between rounded-lg bg-gray-50 px-3 py-1.5">
              <span className="text-xs text-gray-600 truncate">{sc.subject}</span>
              <span className={`text-xs font-semibold ml-2 ${sc.score >= 7 ? 'text-green-600' : sc.score >= 5 ? 'text-yellow-600' : 'text-red-500'}`}>{sc.score}</span>
            </div>
          ))}
        </div>
      </div>
    </DialogContent>
  );
}

export default function StudentsPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterClass, setFilterClass] = useState('Tất cả');
  const [filterStatus, setFilterStatus] = useState('Tất cả');
  const [page, setPage] = useState(1);
  const [deleteTarget, setDeleteTarget] = useState<Student | null>(null);
  const [viewTarget, setViewTarget] = useState<Student | null>(null);
  const [selected, setSelected] = useState<Set<string>>(new Set());

  useEffect(() => {
    studentService.getAll().then(data => { setStudents(data); setLoading(false); });
  }, []);

  const filtered = useMemo(() => {
    return students.filter(s => {
      const matchSearch = search === '' || s.name.toLowerCase().includes(search.toLowerCase()) || s.studentId.toLowerCase().includes(search.toLowerCase());
      const matchClass = filterClass === 'Tất cả' || s.class === filterClass;
      const matchStatus = filterStatus === 'Tất cả' || s.status === filterStatus;
      return matchSearch && matchClass && matchStatus;
    });
  }, [students, search, filterClass, filterStatus]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    await studentService.delete(deleteTarget.id);
    setStudents(prev => prev.filter(s => s.id !== deleteTarget.id));
    toast.success(`Đã xóa sinh viên ${deleteTarget.name}`);
    setDeleteTarget(null);
  };

  const toggleSelect = (id: string) => {
    setSelected(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const handleBulkDelete = async () => {
    if (selected.size === 0) return;
    for (const id of selected) await studentService.delete(id);
    setStudents(prev => prev.filter(s => !selected.has(s.id)));
    toast.success(`Đã xóa ${selected.size} sinh viên`);
    setSelected(new Set());
  };

  return (
    <MainLayout>
      <Header title="Students" subtitle={`${filtered.length} sinh viên`} showAddButton onAddStudent={() => toast.info('Tính năng thêm sinh viên đang phát triển')} />
      <main className="flex-1 overflow-y-auto p-6 space-y-4">
        {/* Toolbar */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative flex-1 min-w-[180px] max-w-xs">
            <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" aria-hidden />
            <Input placeholder="Tìm mã SV, tên..." className="pl-8 text-xs" value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} />
          </div>
          <Select value={filterClass} onValueChange={v => { setFilterClass(v); setPage(1); }}>
            <SelectTrigger className="w-36 text-xs h-9"><SelectValue /></SelectTrigger>
            <SelectContent>{CLASSES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
          </Select>
          <Select value={filterStatus} onValueChange={v => { setFilterStatus(v); setPage(1); }}>
            <SelectTrigger className="w-36 text-xs h-9"><SelectValue /></SelectTrigger>
            <SelectContent>{STATUSES.map(s => <SelectItem key={s} value={s}>{STATUS_LABELS[s]}</SelectItem>)}</SelectContent>
          </Select>
          {selected.size > 0 && (
            <Button variant="destructive" size="sm" onClick={handleBulkDelete} className="text-xs gap-1.5 ml-auto">
              <Trash2 size={13} aria-hidden /> Xóa {selected.size} sinh viên
            </Button>
          )}
          <Button variant="outline" size="sm" className="text-xs gap-1.5 ml-auto" onClick={() => toast.info('Tính năng xuất đang phát triển')}>
            <Download size={13} aria-hidden /> Xuất
          </Button>
        </div>

        {/* Table */}
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm" role="table" aria-label="Students table">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="w-10 px-4 py-3">
                      <input type="checkbox" className="rounded" aria-label="Select all" onChange={e => {
                        if (e.target.checked) setSelected(new Set(paginated.map(s => s.id)));
                        else setSelected(new Set());
                      }} checked={paginated.length > 0 && paginated.every(s => selected.has(s.id))} />
                    </th>
                    {['Mã SV', 'Họ và tên', 'Lớp', 'GPA', 'Xếp loại', ''].map(col => (
                      <th key={col} className="text-left text-xs font-semibold text-gray-400 px-4 py-3">{col}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {loading
                    ? Array.from({ length: 8 }).map((_, i) => <SkeletonRow key={i} />)
                    : paginated.length === 0
                      ? (
                        <tr><td colSpan={7} className="text-center py-16 text-sm text-gray-400">Không tìm thấy sinh viên phù hợp.</td></tr>
                      )
                      : paginated.map(s => (
                        <AnimatePresence key={s.id}>
                          <motion.tr
                            layout
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="border-b border-gray-50 last:border-0 hover:bg-gray-50/60 transition-colors"
                          >
                            <td className="px-4 py-3">
                              <input type="checkbox" className="rounded" aria-label={`Select ${s.name}`} checked={selected.has(s.id)} onChange={() => toggleSelect(s.id)} />
                            </td>
                            <td className="px-4 py-3 font-mono text-xs text-gray-500">{s.studentId}</td>
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-2">
                                <div className="flex items-center justify-center w-7 h-7 rounded-full bg-indigo-100 text-indigo-700 text-xs font-semibold shrink-0">{s.name.charAt(0)}</div>
                                <div>
                                  <p className="font-medium text-xs text-gray-800">{s.name}</p>
                                  <p className="text-xs text-gray-400">{s.email}</p>
                                </div>
                              </div>
                            </td>
                            <td className="px-4 py-3 text-xs text-gray-500">{s.class}</td>
                            <td className="px-4 py-3 text-xs font-bold tabular-nums text-gray-800">{formatGPA(s.gpa)}</td>
                            <td className="px-4 py-3">
                              <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${getStatusColor(s.status)}`}>
                                {getStatusLabel(s.status)}
                              </span>
                            </td>
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-1 justify-end">
                                <button onClick={() => setViewTarget(s)} className="p-1.5 rounded-md text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors" aria-label={`View ${s.name}`}><Eye size={14} aria-hidden /></button>
                                <button onClick={() => toast.info('Tính năng chỉnh sửa đang phát triển')} className="p-1.5 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors" aria-label={`Edit ${s.name}`}><Pencil size={14} aria-hidden /></button>
                                <button onClick={() => setDeleteTarget(s)} className="p-1.5 rounded-md text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors" aria-label={`Delete ${s.name}`}><Trash2 size={14} aria-hidden /></button>
                              </div>
                            </td>
                          </motion.tr>
                        </AnimatePresence>
                      ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Pagination */}
        {!loading && totalPages > 1 && (
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>Hiển thị {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, filtered.length)} / {filtered.length}</span>
            <div className="flex items-center gap-1">
              <Button variant="outline" size="icon" className="h-7 w-7" onClick={() => setPage(p => p - 1)} disabled={page === 1} aria-label="Previous page">
                <ChevronLeft size={14} aria-hidden />
              </Button>
              {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                const p = page <= 3 ? i + 1 : page - 2 + i;
                if (p > totalPages) return null;
                return (
                  <Button key={p} variant={p === page ? 'default' : 'outline'} size="icon" className="h-7 w-7 text-xs" onClick={() => setPage(p)} aria-label={`Page ${p}`} aria-current={p === page ? 'page' : undefined}>
                    {p}
                  </Button>
                );
              })}
              <Button variant="outline" size="icon" className="h-7 w-7" onClick={() => setPage(p => p + 1)} disabled={page === totalPages} aria-label="Next page">
                <ChevronRight size={14} aria-hidden />
              </Button>
            </div>
          </div>
        )}
      </main>

      {/* Delete Dialog */}
      <Dialog open={!!deleteTarget} onOpenChange={open => !open && setDeleteTarget(null)}>
        {deleteTarget && <DeleteDialog student={deleteTarget} onConfirm={handleDelete} onClose={() => setDeleteTarget(null)} />}
      </Dialog>

      {/* View Detail Dialog */}
      <Dialog open={!!viewTarget} onOpenChange={open => !open && setViewTarget(null)}>
        {viewTarget && <StudentDetailDialog student={viewTarget} onClose={() => setViewTarget(null)} />}
      </Dialog>
    </MainLayout>
  );
}
