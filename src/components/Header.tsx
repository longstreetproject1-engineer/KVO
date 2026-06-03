import { useState } from 'react';
import { Menu, X, Landmark, Bell, LogOut, Shield } from 'lucide-react';

interface HeaderProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  isAdmin: boolean;
  onLogout: () => void;
  pendingNotifications: number;
}

export default function Header({
  currentTab,
  setCurrentTab,
  isAdmin,
  onLogout,
  pendingNotifications
}: HeaderProps) {
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    { id: 'home', label: '🏠 Home' },
    { id: 'prepaid', label: '⚡ Prepaid Electricity' },
    { id: 'location', label: '📍 House Location' },
    { id: 'notices', label: '📢 House Notices' },
    { id: 'login', label: isAdmin ? '🛡️ Admin Panel' : '🔑 Admin Login' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-[#D0E8F4] bg-white shadow-xs print:hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-14 items-center justify-between">
          
          {/* Logo and Main Nav */}
          <div className="flex items-center gap-8 h-full">
            {/* Logo */}
            <div 
              className="flex cursor-pointer items-center gap-2 font-semibold tracking-tight text-slate-800"
              onClick={() => setCurrentTab('home')}
            >
              <div className="w-6 h-6 sky-blue-accent rounded-sm flex items-center justify-center">
                <div className="w-3 h-3 bg-[#4AA8D8] rounded-sm"></div>
              </div>
              <span className="font-serif font-bold text-slate-800 tracking-tight text-sm sm:text-base">KABIR <span className="text-[#D94444]">VILLA</span></span>
            </div>

            {/* Desktop Navigation (Microsoft style - left-aligned tabs) */}
            <nav className="hidden md:flex items-center h-full">
              {menuItems.map((item) => {
                const isActive = currentTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setCurrentTab(item.id);
                      setIsOpen(false);
                    }}
                    className={`relative px-3 md:px-4 h-14 flex items-center text-[13px] font-semibold transition-all hover:text-[#4AA8D8] duration-150 border-b-3 ${
                      isActive 
                        ? 'text-[#4AA8D8] border-[#4AA8D8] bg-[#E8F5FB]/40' 
                        : 'text-slate-600 border-transparent hover:border-[#B8DFEF] hover:bg-slate-50/50'
                    }`}
                  >
                    {item.label}
                    {item.id === 'login' && pendingNotifications > 0 && (
                      <span className="absolute top-3 right-1.5 flex h-2 w-2 rounded-full bg-red-500 animate-pulse" />
                    )}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Right Header Controls (Admin Indicator & Quick Actions) */}
          <div className="hidden md:flex items-center gap-4">
            {isAdmin && (
              <div className="flex items-center gap-2 rounded-full bg-red-50 px-3 py-1 text-xs font-semibold text-red-600 border border-red-100">
                <Shield className="h-3 w-3" />
                <span>Admin Mode</span>
                {pendingNotifications > 0 && (
                  <span className="ml-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] text-white">
                    {pendingNotifications}
                  </span>
                )}
              </div>
            )}
            {isAdmin && (
              <button 
                onClick={onLogout}
                className="flex items-center gap-1 text-xs font-medium text-slate-500 hover:text-red-500 transition-colors"
                title="Log Out"
              >
                <LogOut className="h-4 w-4" />
                <span>Log Out</span>
              </button>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden items-center gap-2">
            {isAdmin && (
              <div className="relative mr-1">
                <Bell className="h-5 w-5 text-red-500 animate-bounce" />
                {pendingNotifications > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[9px] font-bold text-white">
                    {pendingNotifications}
                  </span>
                )}
              </div>
            )}

            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center rounded-md p-2 text-slate-600 hover:bg-slate-100 hover:text-slate-900 focus:outline-hidden"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-2 pt-2 pb-3 space-y-1 shadow-md">
          {menuItems.map((item) => {
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setCurrentTab(item.id);
                  setIsOpen(false);
                }}
                className={`flex w-full items-center justify-between rounded-md px-3 py-3 text-base font-semibold transition-colors ${
                  isActive 
                    ? 'sky-blue-accent text-sky-600 font-bold' 
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <span>{item.label}</span>
                {item.id === 'login' && pendingNotifications > 0 && (
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">
                    {pendingNotifications}
                  </span>
                )}
              </button>
            );
          })}
          {isAdmin && (
            <div className="border-t border-slate-100 pt-2 mt-2">
              <button
                onClick={() => {
                  onLogout();
                  setIsOpen(false);
                }}
                className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-base font-medium text-red-600 hover:bg-red-50 transition-colors"
              >
                <LogOut className="h-5 w-5" />
                <span>Log Out Admin</span>
              </button>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
