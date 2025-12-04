import React, { useState } from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { NeoButton, NeoCard } from './NeoUI';
import { Menu, X, Trophy, Send, Vote, LogIn, LogOut, Code, Info, AlertCircle } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

const Navbar: React.FC = () => {
  const { userProfile, login, logout, loading, error, clearError } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showRules, setShowRules] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const navLinks = [
    { to: '/submit', label: 'Submit', icon: Send },
    { to: '/vote', label: 'Vote', icon: Vote },
    { to: '/leaderboard', label: 'Leaderboard', icon: Trophy },
  ];

  return (
    <>
      <nav className="sticky top-0 z-40 w-full bg-white border-b-4 border-black px-4 py-3">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          {/* Logo */}
          <NavLink to="/" className="flex items-center gap-2 group">
            <img 
              src="https://dut.gdsc.dev/static/media/GDSC_Icon.665f1462ba5cded266fc.png" 
              alt="GDG Logo" 
              className="w-10 h-10 border-2 border-black shadow-[2px_2px_0px_0px_#000]"
            />
            <span className="text-xl md:text-2xl font-black tracking-tighter hidden sm:block">
              GDG Cloud Da Nang <span className="text-gdg-blue">Devfest</span> 2025
            </span>
          </NavLink>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-6">
            <button 
              onClick={() => setShowRules(true)}
              className="font-bold hover:underline decoration-4 underline-offset-4 decoration-gdg-green"
            >
              RULES
            </button>
            
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `flex items-center gap-2 font-bold px-3 py-2 border-2 border-transparent hover:border-black hover:bg-gray-100 transition-all ${
                    isActive ? 'bg-gdg-yellow border-black shadow-neo' : ''
                  }`
                }
              >
                <link.icon className="w-4 h-4" />
                {link.label}
              </NavLink>
            ))}

            {loading ? (
              <div className="w-8 h-8 rounded-full border-2 border-black bg-gray-200 animate-pulse" />
            ) : userProfile ? (
              <div className="flex items-center gap-4">
                 <div className="flex flex-col items-end">
                    <span className="text-xs font-bold uppercase text-gray-500">Votes Left</span>
                    <span className="text-lg font-black leading-none text-gdg-red">{userProfile.votesRemaining}</span>
                 </div>
                 <div className="h-8 w-[2px] bg-black"></div>
                 <button onClick={logout} className="flex items-center gap-2 font-bold hover:text-gdg-red">
                    <LogOut className="w-5 h-5" />
                 </button>
                 {userProfile.photoURL && (
                   <img 
                    src={userProfile.photoURL} 
                    alt="User" 
                    className="w-10 h-10 rounded-none border-2 border-black shadow-[2px_2px_0px_0px_#000]" 
                   />
                 )}
              </div>
            ) : (
              <NeoButton onClick={login} size="sm" variant="primary">
                <LogIn className="w-4 h-4 mr-2" />
                Login
              </NeoButton>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button className="md:hidden p-2 border-2 border-black active:bg-gray-200" onClick={toggleMenu}>
            {isMenuOpen ? <X /> : <Menu />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden absolute top-full left-0 w-full bg-white border-b-4 border-black p-4 flex flex-col gap-4 shadow-xl">
             <button 
              onClick={() => { setShowRules(true); setIsMenuOpen(false); }}
              className="text-left font-bold py-2 border-b-2 border-gray-100"
            >
              RULES
            </button>
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                onClick={() => setIsMenuOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-2 font-bold p-2 ${
                    isActive ? 'bg-gdg-yellow border-2 border-black shadow-neo' : ''
                  }`
                }
              >
                <link.icon className="w-4 h-4" />
                {link.label}
              </NavLink>
            ))}
             <div className="h-[2px] w-full bg-black my-2"></div>
             
             {userProfile ? (
                 <div className="flex justify-between items-center">
                    <div className="flex flex-col">
                        <span className="text-xs font-bold">Votes Remaining: {userProfile.votesRemaining}</span>
                        <span className="text-sm truncate max-w-[150px]">{userProfile.displayName}</span>
                    </div>
                    <NeoButton onClick={logout} size="sm" variant="secondary">Logout</NeoButton>
                 </div>
             ) : (
                <NeoButton onClick={login} className="w-full">Login with Google</NeoButton>
             )}
          </div>
        )}
      </nav>

      {/* Global Error Banner */}
      <AnimatePresence>
        {error && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="bg-gdg-red text-white border-b-4 border-black overflow-hidden"
          >
            <div className="max-w-7xl mx-auto px-4 py-3 flex items-start gap-3 font-bold text-sm md:text-base">
              <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <div className="flex-grow break-words">
                 {error}
              </div>
              <button onClick={clearError} className="p-1 hover:bg-black/20 rounded flex-shrink-0">
                 <X className="w-5 h-5" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Rules Modal */}
      <AnimatePresence>
        {showRules && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
          >
            <motion.div 
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                className="w-full max-w-lg"
            >
                <NeoCard className="relative bg-white">
                    <button 
                        onClick={() => setShowRules(false)}
                        className="absolute top-2 right-2 p-1 hover:bg-gray-100 border-2 border-transparent hover:border-black"
                    >
                        <X className="w-6 h-6" />
                    </button>
                    <div className="flex items-center gap-3 mb-6">
                        <Info className="w-8 h-8 text-gdg-blue" />
                        <h2 className="text-2xl font-black uppercase">Event Rules</h2>
                    </div>
                    <ul className="space-y-4 list-disc pl-5 font-bold text-gray-700">
                        <li>Each user gets <span className="text-gdg-red bg-gdg-red/10 px-1">5 VOTES</span>.</li>
                        <li>You cannot vote for the same project twice.</li>
                        <li>Projects must be Vibe Coding submissions using Gemini.</li>
                        <li>Include your Google AI Studio link.</li>
                        <li>Have fun and keep the vibe high!</li>
                    </ul>
                    <div className="mt-8 flex justify-end">
                        <NeoButton onClick={() => setShowRules(false)} variant="accent">
                            Got it!
                        </NeoButton>
                    </div>
                </NeoCard>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="p-4 md:p-8 max-w-7xl mx-auto w-full">
        <Outlet />
      </main>
    </>
  );
};

export default Navbar;