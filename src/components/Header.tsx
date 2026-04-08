import React, { useRef, useState } from 'react';
import { Menu, X, Camera, Video, User, Settings } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { CONFIG, MODULES_BY_COMPANY } from '../constants/config';
import { CompanyCode, Module } from '../types';

interface HeaderProps {
  currentCompany: CompanyCode;
  setCurrentCompany: (company: CompanyCode) => void;
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: (open: boolean) => void;
  isAdminLoggedIn: boolean;
  onAdminClick: () => void;
  onVideosClick: () => void;
  handleModuleClick: (mod: Module) => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentCompany,
  setCurrentCompany,
  isMobileMenuOpen,
  setIsMobileMenuOpen,
  isAdminLoggedIn,
  onAdminClick,
  onVideosClick,
  handleModuleClick
}) => {
  const [activeDropdown, setActiveDropdown] = useState<CompanyCode | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  return (
    <header className="sticky top-0 z-[1500] bg-[var(--primary)] text-white px-4 md:px-8 py-3 flex justify-between items-center shadow-lg border-b border-white/10 transition-all duration-300">
      <div className="flex items-center gap-3 md:gap-5">
        <img 
          src={CONFIG.LOGOS[currentCompany]} 
          alt="Logo" 
          className="h-8 md:h-10 w-auto max-w-[150px] md:max-w-[180px] object-contain transition-transform hover:scale-105"
          style={{ filter: currentCompany === 'SO' ? 'none' : 'brightness(0) invert(1)' }}
        />
        <span className="hidden lg:block font-bold text-lg xl:text-xl uppercase tracking-wider">Intranet Corporativa</span>
      </div>

      <button 
        className="md:hidden p-2 hover:bg-white/10 rounded-lg transition-colors"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        aria-label={isMobileMenuOpen ? "Cerrar menú" : "Abrir menú"}
      >
        {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      <nav 
        className={`
          fixed md:static top-[60px] md:top-0 right-0 bottom-0 w-[280px] md:w-auto
          bg-[var(--primary)] md:bg-transparent
          flex flex-col md:flex-row items-start md:items-center gap-6 md:gap-6
          p-6 md:p-0 transition-transform duration-300 z-[1600]
          ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full md:translate-x-0'}
          shadow-[-5px_0_20px_rgba(0,0,0,0.2)] md:shadow-none
        `}
      >
        <div className="flex flex-col md:flex-row gap-2 w-full md:w-auto" ref={dropdownRef}>
          {(['SX', 'SO', 'PL'] as CompanyCode[]).map(company => (
            <div 
              key={company} 
              className="relative"
              onMouseEnter={() => !isMobileMenuOpen && setActiveDropdown(company)}
              onMouseLeave={() => !isMobileMenuOpen && setActiveDropdown(null)}
            >
              <button 
                className={`
                  w-full md:w-auto px-4 py-2 rounded-lg text-sm font-semibold transition-all
                  ${currentCompany === company ? 'bg-white text-[var(--primary)] shadow-md' : 'bg-white/10 text-white hover:bg-white/20'}
                `}
                onClick={() => {
                  setCurrentCompany(company);
                  if (isMobileMenuOpen) {
                    setActiveDropdown(activeDropdown === company ? null : company);
                  }
                }}
              >
                {company === 'SX' ? 'Simex (SX)' : company === 'SO' ? 'Soinco (SO)' : 'Plastinovo (PL)'}
              </button>
              
              <AnimatePresence>
                {activeDropdown === company && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute top-full left-0 md:left-1/2 md:-translate-x-1/2 mt-2 w-[260px] bg-white rounded-xl shadow-2xl p-2 grid gap-1 border border-gray-100 z-[1700]"
                  >
                    <div className="max-h-[300px] overflow-y-auto pr-1 custom-scrollbar">
                      {MODULES_BY_COMPANY[company].map(mod => (
                        <button 
                          key={mod.id}
                          className="w-full flex items-center gap-3 p-2.5 rounded-lg text-gray-700 hover:bg-blue-50 hover:text-[var(--primary)] transition-all text-sm font-semibold text-left group"
                          onClick={() => {
                            handleModuleClick(mod);
                            setActiveDropdown(null);
                            setIsMobileMenuOpen(false);
                          }}
                        >
                          <mod.icon size={18} className="text-[var(--primary)] group-hover:scale-110 transition-transform" />
                          {mod.name}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>

        <div className="flex flex-col md:flex-row gap-3 w-full md:w-auto border-t md:border-none border-white/10 pt-6 md:pt-0">
          <button className="flex items-center gap-2 px-4 py-2 bg-white/10 rounded-xl text-sm font-semibold hover:bg-white/20 transition-all group">
            <User size={18} className="group-hover:scale-110 transition-transform" /> Directorio
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-white/10 rounded-xl text-sm font-semibold hover:bg-white/20 transition-all group">
            <Camera size={18} className="group-hover:scale-110 transition-transform" /> Fotos Fiesta 2025
          </button>
          <button 
            className="flex items-center gap-2 px-4 py-2 bg-white/10 rounded-xl text-sm font-semibold hover:bg-white/20 transition-all group"
            onClick={() => {
              onVideosClick();
              setIsMobileMenuOpen(false);
            }}
          >
            <Video size={18} className="group-hover:scale-110 transition-transform" /> Videos RH
          </button>
          <button 
            className="p-2 bg-white/10 rounded-xl hover:bg-white/20 transition-all flex items-center gap-2 md:block group"
            onClick={() => {
              onAdminClick();
              setIsMobileMenuOpen(false);
            }}
          >
            <Settings size={24} className="transition-transform group-hover:rotate-90" />
            <span className="md:hidden font-semibold">Administración</span>
          </button>
        </div>
      </nav>
    </header>
  );
};
