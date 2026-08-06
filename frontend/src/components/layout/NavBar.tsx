import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { Button } from '../ui/button';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, BarChart2, CalendarDays, Settings, User as UserIcon, Menu, X, LogOut } from 'lucide-react';
import { NotificationBell } from '../shared/NotificationBell';

export const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path: string) => location.pathname === path;

  const navLinkClass = (path: string) =>
    `flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
      isActive(path)
        ? 'bg-sky-500 text-white shadow-lg shadow-sky-200'
        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-800'
    }`;

  const mobileNavLinkClass = (path: string) =>
    `flex items-center gap-3 px-4 py-3 rounded-xl text-base font-bold transition-all ${
      isActive(path)
        ? 'bg-sky-500 text-white shadow-xl shadow-sky-100'
        : 'text-slate-600 hover:bg-slate-50'
    }`;

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-slate-100 bg-white/90 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">

          {/* Brand */}
          <div className="flex items-center gap-8">
            <Link
              to="/dashboard"
              className="text-2xl font-black bg-gradient-to-r from-sky-500 to-emerald-500 bg-clip-text text-transparent flex-shrink-0"
            >
              NovaCare
            </Link>

            {/* Desktop Nav links */}
            {user && (
              <div className="hidden md:flex items-center gap-2">
                <Link to="/dashboard" className={navLinkClass('/dashboard')}>
                  <LayoutDashboard size={18} />
                  Dashboard
                </Link>

                {user.role === 'patient' && (
                  <Link to="/book" className={navLinkClass('/book')}>
                    <CalendarDays size={18} />
                    Book
                  </Link>
                )}

                {(user.role === 'admin' || user.role === 'doctor') && (
                  <Link to="/analytics" className={navLinkClass('/analytics')}>
                    <BarChart2 size={18} />
                    Analytics
                  </Link>
                )}

                <Link to="/profile" className={navLinkClass('/profile')}>
                  <Settings size={18} />
                  Settings
                </Link>
              </div>
            )}
          </div>

          {/* Right side */}
          <div className="flex items-center gap-4">
            {user && (
              <>
                <NotificationBell />
                <Link to="/profile" className="flex items-center gap-3 hover:bg-slate-50 p-1.5 pr-1 md:pr-4 rounded-2xl transition-all border border-transparent hover:border-slate-100">
                  <div className="w-10 h-10 rounded-xl bg-sky-500 flex items-center justify-center text-white font-bold shadow-md shadow-sky-100 overflow-hidden ring-2 ring-white">
                    <img 
                      src={(user as any).avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=4f46e5&color=fff&size=64`} 
                      alt="Profile" 
                      className="w-full h-full object-cover" 
                    />
                  </div>
                  <div className="hidden lg:flex flex-col items-start leading-tight">
                    <span className="text-sm font-bold text-slate-800">{user.name}</span>
                    <span className="text-[10px] text-slate-400 uppercase tracking-widest font-black">{user.role}</span>
                  </div>
                </Link>
                

                {/* Mobile Menu Toggle */}
                <button 
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className="md:hidden p-2.5 rounded-xl bg-slate-50 text-slate-600 hover:bg-slate-100 transition-colors"
                >
                  {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLogout}
                  className="hidden md:flex text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl font-bold"
                >
                  <LogOut size={18} className="mr-2" />
                  Logout
                </Button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isMobileMenuOpen && user && (
        <div className="md:hidden absolute top-20 left-0 w-full bg-white border-b border-slate-100 shadow-2xl animate-in slide-in-from-top-4 duration-200">
          <div className="p-4 space-y-2">
            <Link 
              to="/dashboard" 
              className={mobileNavLinkClass('/dashboard')}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <LayoutDashboard size={20} />
              Dashboard
            </Link>

            {user.role === 'patient' && (
              <Link 
                to="/book" 
                className={mobileNavLinkClass('/book')}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <CalendarDays size={20} />
                Book Appointment
              </Link>
            )}

            {(user.role === 'admin' || user.role === 'doctor') && (
              <Link 
                to="/analytics" 
                className={mobileNavLinkClass('/analytics')}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <BarChart2 size={20} />
                Analytics Dashboard
              </Link>
            )}

            <Link 
              to="/profile" 
              className={mobileNavLinkClass('/profile')}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <Settings size={20} />
              Account Settings
            </Link>

            <div className="pt-4 mt-4 border-t border-slate-100">
              <button 
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-4 rounded-xl text-red-600 font-bold hover:bg-red-50 transition-all"
              >
                <LogOut size={20} />
                Sign Out
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

