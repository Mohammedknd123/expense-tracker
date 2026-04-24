import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, ReceiptText, LogOut, Wallet } from 'lucide-react';
import { cn } from '../utils/cn';
import { motion } from 'framer-motion';

const Navbar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/auth');
  };

  const navItems = [
    { label: 'Dashboard', path: '/', icon: LayoutDashboard },
    { label: 'Expenses', path: '/expenses', icon: ReceiptText },
  ];

  if (!user) return null;

  return (
    <nav className="fixed top-0 left-0 right-0 h-16 bg-[var(--nav-bg)] border-b border-white/5 z-50 backdrop-blur-md bg-opacity-90">
      <div className="section-container h-full flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <motion.div 
            whileHover={{ rotate: 10, scale: 1.1 }}
            className="w-8 h-8 bg-neon-blue rounded-lg flex items-center justify-center neon-glow-blue"
          >
            <Wallet className="text-black w-5 h-5" />
          </motion.div>
          <span className="font-bold text-xl tracking-tight text-white transition-colors">
            Clear Ledger
          </span>
        </Link>

        <div className="flex items-center gap-4 md:gap-8">
          <div className="hidden md:flex items-center gap-6">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  'flex items-center gap-2 text-sm font-bold transition-all',
                  location.pathname === item.path 
                    ? 'text-neon-blue' 
                    : 'text-white/60 hover:text-white'
                )}
              >
                <item.icon className="w-4 h-4" />
                {item.label}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-4 pl-4 border-l border-white/10">
            <span className="hidden sm:inline text-sm font-bold text-white">{user.name}</span>
            
            <button
              onClick={handleLogout}
              className="p-2 text-white/70 hover:text-neon-red hover:bg-neon-red/10 rounded-lg transition-all"
              title="Logout"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
