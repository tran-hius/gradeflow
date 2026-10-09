'use client';
import React from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Header } from '@/components/layout/Header';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { User, Bell, Shield, Database } from 'lucide-react';

function SettingSection({ icon: Icon, title, description, children }: { icon: React.ElementType; title: string; description: string; children: React.ReactNode }) {
  return (
    <Card>
      <CardHeader className="flex-row items-start gap-4">
        <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-indigo-50 text-indigo-600 shrink-0">
          <Icon size={18} aria-hidden />
        </div>
        <div>
          <CardTitle>{title}</CardTitle>
          <CardDescription className="mt-0.5">{description}</CardDescription>
        </div>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}

export default function SettingsPage() {
  return (
    <MainLayout>
      <Header title="Settings" subtitle="Cấu hình hệ thống" />
      <main className="flex-1 overflow-y-auto p-6 max-w-2xl space-y-4">
        <SettingSection icon={User} title="Thông tin tài khoản" description="Quản lý thông tin cá nhân và ảnh đại diện">
          <div className="space-y-3">
            <div>
              <label className="text-xs font-medium text-gray-600 mb-1 block">Tên hiển thị</label>
              <Input defaultValue="Trần Hiếu" className="text-xs" />
            </div>
            <div>
              <label className="text-xs font-medium text-gray-600 mb-1 block">Email</label>
              <Input defaultValue="tranhieudz2024@gmail.com" type="email" className="text-xs" />
            </div>
            <Button size="sm" onClick={() => toast.success('Đã lưu thông tin tài khoản')} className="text-xs">Lưu thay đổi</Button>
          </div>
        </SettingSection>

        <SettingSection icon={Bell} title="Thông báo" description="Quản lý cài đặt thông báo hệ thống">
          <div className="space-y-3">
            {['Cảnh báo sinh viên có nguy cơ', 'Báo cáo tháng', 'Cập nhật hệ thống'].map(item => (
              <div key={item} className="flex items-center justify-between">
                <span className="text-xs text-gray-700">{item}</span>
                <button
                  role="switch"
                  aria-checked="true"
                  onClick={() => toast.success(`Đã cập nhật cài đặt "${item}"`)}
                  className="w-9 h-5 rounded-full bg-indigo-500 relative transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                  <span className="absolute top-0.5 right-0.5 w-4 h-4 rounded-full bg-white shadow-sm transition-transform" />
                </button>
              </div>
            ))}
          </div>
        </SettingSection>

        <SettingSection icon={Database} title="Nguồn dữ liệu" description="Cấu hình kết nối tới backend API">
          <div className="space-y-3">
            <div>
              <label className="text-xs font-medium text-gray-600 mb-1 block">API Endpoint</label>
              <Input defaultValue="http://localhost:8000/api/v1" className="text-xs font-mono" />
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-yellow-400" />
              <span className="text-xs text-gray-500">Chưa kết nối — đang dùng dữ liệu mẫu</span>
            </div>
            <Button variant="outline" size="sm" onClick={() => toast.info('Chức năng kết nối API sẽ khả dụng khi backend sẵn sàng')} className="text-xs">Kiểm tra kết nối</Button>
          </div>
        </SettingSection>

        <SettingSection icon={Shield} title="Bảo mật" description="Quản lý mật khẩu và phiên đăng nhập">
          <div className="space-y-3">
            <div>
              <label className="text-xs font-medium text-gray-600 mb-1 block">Mật khẩu mới</label>
              <Input type="password" placeholder="••••••••" className="text-xs" />
            </div>
            <Button variant="outline" size="sm" onClick={() => toast.success('Đã đổi mật khẩu thành công')} className="text-xs">Đổi mật khẩu</Button>
          </div>
        </SettingSection>
      </main>
    </MainLayout>
  );
}
