'use client';

import React from 'react';
import { LuChevronRight as ChevronRight, LuLogOut as LogOut } from 'react-icons/lu';
import { IconType } from 'react-icons';
import Image from 'next/image';

interface SidebarItem {
  id: string;
  label: string;
  icon: IconType;
}

interface SidebarProps {
  user: {
    name: string;
    email: string;
    profileImage?: string | null;
  };
  items: SidebarItem[];
  activeTab: string;
  onTabChange: (id: any) => void;
  onLogout: () => void;
  variant: 'pencari' | 'rekruter';
  menuTitle?: string;
}

const Sidebar: React.FC<SidebarProps> = ({
  user,
  items,
  activeTab,
  onTabChange,
  onLogout,
  variant,
  menuTitle,
}) => {
  const isPencari = variant === 'pencari';

  return (
    <>
      <div className="flex flex-col overflow-hidden">
        {/* User Info */}
        <div
          className={
            isPencari
              ? '-mx-5 px-[34px] md:-mx-4 md:px-[30px] pt-2.5 pb-4 border-b border-border/60 flex items-center gap-2.5 shrink-0'
              : 'px-3.5 pt-2.5 pb-4 border-b flex items-center gap-2 shrink-0'
          }
        >
          {user.profileImage ? (
            <Image
              src={user.profileImage}
              alt={user.name}
              className={
                isPencari
                  ? 'h-10 w-10 rounded-full object-cover border border-border shadow-xs shrink-0'
                  : 'h-11 w-11 rounded-full object-cover border border-border shadow-xs shrink-0'
              }
             width={100} height={100} unoptimized />
          ) : (
            <div
              className={
                isPencari
                  ? 'h-10 w-10 rounded-full bg-muted text-foreground flex items-center justify-center font-bold text-base border border-border shrink-0'
                  : 'h-11 w-11 rounded-full bg-muted text-foreground flex items-center justify-center font-bold text-base border border-border shrink-0'
              }
            >
              {user.name?.charAt(0) ?? '?'}
            </div>
          )}
          <div className="min-w-0">
            <div className="font-extrabold text-sm text-foreground truncate">
              {user.name}
            </div>
            <div
              className={
                isPencari
                  ? 'text-[12px] text-muted-foreground truncate font-medium mt-0.5 max-w-[110px] lg:max-w-[140px]'
                  : 'text-xs text-muted-foreground truncate font-medium mt-1 max-w-[110px] lg:max-w-[140px] block'
              }
            >
              {user.email}
            </div>
          </div>
        </div>

        {/* Main Menu */}
        <div className={isPencari ? 'overflow-y-auto pt-5 pb-2 space-y-4' : 'space-y-1.5 mt-6'}>
          {menuTitle && !isPencari && (
            <span className="text-[10px] font-bold text-muted-foreground/60 uppercase tracking-widest px-3 block mb-4">
              {menuTitle}
            </span>
          )}
          <div className="space-y-1.5">
            {items.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onTabChange(item.id)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer border-none ${
                    isActive
                      ? 'bg-primary text-primary-foreground font-extrabold shadow-sm'
                      : 'text-muted-foreground hover:bg-muted/55 hover:text-foreground bg-transparent border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={isPencari ? 'h-4 w-4 shrink-0' : 'h-4.5 w-4.5 shrink-0'} />
                    <span>{item.label}</span>
                  </div>
                  {isActive && <ChevronRight className="h-3.5 w-3.5" />}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Logout */}
      <div
        className={
          isPencari
            ? '-mx-5 px-5 md:-mx-4 md:px-4 pt-2.5 mt-2.5 border-t border-border/60 shrink-0'
            : 'pt-3 mt-7 border-t border-border/60 shrink-0'
        }
      >
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-rose-500 hover:bg-rose-500/10 transition-all cursor-pointer bg-transparent border-none"
        >
          <LogOut className={isPencari ? 'h-4 w-4 shrink-0' : 'h-4.5 w-4.5 shrink-0'} />
          <span>Keluar</span>
        </button>
      </div>
    </>
  );
};

export default Sidebar;
