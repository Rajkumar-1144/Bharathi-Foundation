'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useAppData } from '@/context/AppDataContext';
import { Logo } from '@/components/common/Logo';
import { UserRole } from '@/types';
import {
  LayoutDashboard,
  Building2,
  Users,
  HeartHandshake,
  Droplet,
  Tent,
  Image as ImageIcon,
  IndianRupee,
  Globe,
  Bell,
  FileText,
  Settings,
  LogOut,
  Menu,
  X,
  Compass,
  CalendarCheck,
  Award,
  Upload,
  Layers,
  UserCheck,
  CheckCircle2,
  AlertTriangle,
  ChevronRight,
  ShieldCheck,
  QrCode,
} from 'lucide-react';

interface NavItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: number;
}

interface DashboardLayoutProps {
  children: React.ReactNode;
  allowedRole: UserRole;
  title: string;
  subtitle?: string;
}

export function DashboardLayout({ children, allowedRole, title, subtitle }: DashboardLayoutProps) {
  const { currentUser, isAuthenticated, isLoading, logout } = useAuth();
  const { notifications, markNotificationRead, language, setLanguage } = useAppData();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notifDropdownOpen, setNotifDropdownOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated || !currentUser) {
        router.push('/login');
      } else if (currentUser.role !== allowedRole) {
        // Redirect to their actual role dashboard if they strayed
        const correctPath = `/${currentUser.role.toLowerCase()}`;
        router.push(correctPath);
      }
    }
  }, [isLoading, isAuthenticated, currentUser, allowedRole, router]);

  if (isLoading || !currentUser || currentUser.role !== allowedRole) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-brand-bgLight">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-brand-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm font-semibold text-brand-primary">Authenticating workspace access...</p>
        </div>
      </div>
    );
  }

  // Filter notifications for this role
  const roleNotifications = notifications.filter(
    (n) => n.targetRole === allowedRole || n.targetRole === 'ALL'
  );
  const unreadCount = roleNotifications.filter((n) => !n.read).length;

  // Build role-specific sidebar navigation
  const getNavItems = (): NavItem[] => {
    switch (allowedRole) {
      case 'ADMIN':
        return [
          { label: 'Overview', href: '/admin', icon: LayoutDashboard },
          { label: 'Manage NGOs', href: '/admin/ngos', icon: Building2 },
          { label: 'Volunteer Cadre', href: '/admin/volunteers', icon: Users },
          { label: 'Donors & Wealth', href: '/admin/donors', icon: HeartHandshake },
          { label: 'Blood Donation', href: '/admin/blood-donation', icon: Droplet },
          { label: 'Camp Meetings', href: '/admin/camps', icon: Tent },
          { label: 'Gallery CMS', href: '/admin/gallery', icon: ImageIcon },
          { label: 'Donation Reconciliation', href: '/admin/donations', icon: IndianRupee },
          { label: 'UPI QR Management', href: '/admin/qr-management', icon: QrCode },
          { label: 'Website CMS', href: '/admin/content', icon: Globe },
          { label: 'Care Home Management', href: '/admin/care-homes', icon: HeartHandshake },
          { label: 'Reports & Audits', href: '/admin/reports', icon: FileText },
          { label: 'Notifications', href: '/admin/notifications', icon: Bell, badge: unreadCount },
          { label: 'Settings', href: '/admin/settings', icon: Settings },
        ];
      case 'NGO':
        return [
          { label: 'Overview', href: '/ngo', icon: LayoutDashboard },
          { label: 'NGO Profile', href: '/ngo/profile', icon: Building2 },
          { label: 'Manage Activities', href: '/ngo/activities', icon: Layers },
          { label: 'Camp Meetings', href: '/ngo/camps', icon: Tent },
          { label: 'Volunteer Requests', href: '/ngo/volunteer-requests', icon: UserCheck },
          { label: 'Gallery Submissions', href: '/ngo/gallery', icon: ImageIcon },
          { label: 'Impact Reports', href: '/ngo/reports', icon: FileText },
          { label: 'Notifications', href: '/ngo/notifications', icon: Bell, badge: unreadCount },
          { label: 'Settings', href: '/ngo/settings', icon: Settings },
        ];
      case 'VOLUNTEER':
        return [
          { label: 'Overview', href: '/volunteer', icon: LayoutDashboard },
          { label: 'My Profile', href: '/volunteer/profile', icon: Users },
          { label: 'Explore Activities', href: '/volunteer/explore', icon: Compass },
          { label: 'Camp Meetings', href: '/volunteer/camps', icon: Tent },
          { label: 'My Registrations', href: '/volunteer/registrations', icon: CalendarCheck },
          { label: 'Service History', href: '/volunteer/services', icon: Award },
          { label: 'Upload Photos', href: '/volunteer/upload-photos', icon: Upload },
          { label: 'Notifications', href: '/volunteer/notifications', icon: Bell, badge: unreadCount },
          { label: 'Settings', href: '/volunteer/settings', icon: Settings },
        ];
      case 'DONOR':
        return [
          { label: 'Overview', href: '/donor', icon: LayoutDashboard },
          { label: 'My Profile', href: '/donor/profile', icon: Users },
          { label: 'Donate (UPI QR)', href: '/donor/donate', icon: IndianRupee },
          { label: 'Donation History', href: '/donor/history', icon: HeartHandshake },
          { label: 'Supported Campaigns', href: '/donor/campaigns', icon: Layers },
          { label: '80G Tax Receipts', href: '/donor/receipts', icon: FileText },
          { label: 'Notifications', href: '/donor/notifications', icon: Bell, badge: unreadCount },
          { label: 'Settings', href: '/donor/settings', icon: Settings },
        ];
      default:
        return [];
    }
  };

  const navItems = getNavItems();

  return (
    <div className="min-h-screen bg-brand-bgLight flex">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-xs"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar Navigation */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-72 bg-white border-r border-brand-border flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
      >
        {/* Sidebar Header with Bharathi Logo */}
        <div className="p-4 border-b border-brand-border flex items-center justify-between">
          <Logo size="md" priority href="/" />
          <button
            onClick={() => setSidebarOpen(false)}
            className="p-1 rounded-lg text-brand-muted hover:bg-brand-bgLight lg:hidden"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Role Pill Banner */}
        <div className="mx-4 mt-3 p-3 bg-brand-bgLight rounded-xl border border-brand-border/70 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-brand-primary text-white flex items-center justify-center font-bold text-sm shadow-xs">
            {currentUser.name.charAt(0)}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs text-brand-muted font-medium">Logged in role</p>
            <p className="text-sm font-bold text-brand-text truncate">{currentUser.name}</p>
            <span className="inline-block mt-0.5 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-brand-primary text-white">
              {currentUser.role}
            </span>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1 custom-scrollbar">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${isActive
                    ? 'bg-brand-primary text-white font-bold shadow-xs'
                    : 'text-brand-text hover:bg-brand-bgLight hover:text-brand-primary'
                  }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-brand-primary'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge && item.badge > 0 ? (
                  <span
                    className={`text-xs font-bold px-2 py-0.5 rounded-full ${isActive ? 'bg-white text-brand-primary' : 'bg-red-500 text-white'
                      }`}
                  >
                    {item.badge}
                  </span>
                ) : null}
              </Link>
            );
          })}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-3 border-t border-brand-border space-y-1">
          <Link
            href="/"
            className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-brand-muted hover:text-brand-primary hover:bg-brand-bgLight transition-colors"
          >
            <Globe className="w-4 h-4" />
            <span>Public Website</span>
          </Link>
          <button
            onClick={logout}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-red-600 hover:bg-red-50 transition-colors font-medium text-left"
          >
            <LogOut className="w-4 h-4" />
            <span>Log Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 lg:pl-72 flex flex-col min-w-0">
        {/* Top Header */}
        <header className="sticky top-0 z-30 h-16 bg-white border-b border-brand-border flex items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 rounded-lg text-brand-primary hover:bg-brand-bgLight lg:hidden"
            >
              <Menu className="w-6 h-6" />
            </button>
            <div>
              <h1 className="text-lg sm:text-xl font-bold text-brand-text flex items-center gap-2">
                <span>{title}</span>
                <span className="hidden sm:inline-block text-xs font-normal text-brand-muted">
                  • Bharathi Foundation
                </span>
              </h1>
              {subtitle && <p className="text-xs text-brand-muted hidden sm:block">{subtitle}</p>}
            </div>
          </div>

          {/* Top Actions */}
          <div className="flex items-center gap-3">
            {/* Language Switcher Pill */}
            <button
              onClick={() => setLanguage(language === 'en' ? 'te' : 'en')}
              className="flex items-center gap-1.5 px-3 py-1 rounded-full border border-brand-border bg-brand-bgLight hover:bg-white text-xs font-bold text-brand-primary transition-all shadow-2xs cursor-pointer"
              title="Toggle Language (English / తెలుగు)"
            >
              <Globe className="w-3.5 h-3.5 text-brand-secondaryDark" />
              <span>{language === 'en' ? 'తెలుగు' : 'EN'}</span>
            </button>

            {/* Notification Bell */}
            <div className="relative">
              <button
                onClick={() => setNotifDropdownOpen(!notifDropdownOpen)}
                className="relative p-2 rounded-full text-brand-text hover:bg-brand-bgLight transition-colors"
              >
                <Bell className="w-5 h-5 text-brand-primary" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white rounded-full text-[10px] font-bold flex items-center justify-center animate-pulse">
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* Notification Popover */}
              {notifDropdownOpen && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white border border-brand-border rounded-xl shadow-xl py-2 z-50 animate-in fade-in">
                  <div className="px-4 py-2 border-b border-brand-border flex items-center justify-between">
                    <p className="text-sm font-bold text-brand-text">Notifications</p>
                    <span className="text-xs text-brand-muted">{roleNotifications.length} items</span>
                  </div>

                  <div className="max-h-80 overflow-y-auto divide-y divide-brand-border/40">
                    {roleNotifications.length === 0 ? (
                      <div className="p-4 text-center text-xs text-brand-muted">No notifications at this time.</div>
                    ) : (
                      roleNotifications.map((n) => (
                        <div
                          key={n.id}
                          onClick={() => markNotificationRead(n.id)}
                          className={`p-3 text-xs cursor-pointer hover:bg-brand-bgLight transition-colors ${!n.read ? 'bg-brand-bgLight/60 font-medium' : 'text-brand-muted'
                            }`}
                        >
                          <div className="flex items-center justify-between gap-1 mb-1">
                            <span className="font-bold text-brand-text">{n.title}</span>
                            <span className="text-[10px] text-brand-muted">
                              {new Date(n.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                          <p className="text-brand-text/80">{n.message}</p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* User Profile Pill */}
            <div className="flex items-center gap-2 pl-3 border-l border-brand-border">
              <div className="w-8 h-8 rounded-full bg-brand-primary text-white flex items-center justify-center font-bold text-xs">
                {currentUser.name.charAt(0)}
              </div>
              <div className="hidden md:block text-left">
                <p className="text-xs font-bold text-brand-text leading-tight">{currentUser.name}</p>
                <p className="text-[10px] text-brand-muted">{currentUser.role}</p>
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Page Body */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">{children}</main>
      </div>
    </div>
  );
}

