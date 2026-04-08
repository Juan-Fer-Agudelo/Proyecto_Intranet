import React, { useState, useEffect } from 'react';
import { AnimatePresence } from 'motion/react';
import { CONFIG } from './constants/config';
import { Announcement, Video as VideoType, NewsItem, CompanyCode, Module } from './types';

// Components
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { Announcements } from './components/Announcements';
import { LoginModal } from './components/LoginModal';
import { AdminModal } from './components/AdminModal';
import { VideosModal } from './components/VideosModal';

export default function App() {
  // --- STATE ---
  const [currentCompany, setCurrentCompany] = useState<CompanyCode>(CONFIG.DEFAULT_COMPANY);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [news, setNews] = useState<NewsItem[]>([]);
  const [videos, setVideos] = useState<VideoType[]>([
    { id: 1, title: 'Mensaje de Gerencia', url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' }
  ]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [heroBg, setHeroBg] = useState<string | null>(null);
  const [visitInfo, setVisitInfo] = useState("Hoy nos visita Bancolombia para asesoría en crédito de vivienda");
  
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [showVideosModal, setShowVideosModal] = useState(false);
  
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginMessage, setLoginMessage] = useState({ text: '', color: '' });

  // --- EFFECTS ---
  useEffect(() => {
    document.body.className = `theme-${currentCompany.toLowerCase()}`;
  }, [currentCompany]);

  // --- HANDLERS ---
  const handleModuleClick = (mod: Module) => {
    if (mod.url && mod.url !== '#') {
      window.open(mod.url, '_blank');
      return;
    }
    if (mod.type === 'secure') {
      const pass = prompt('Ingrese el token de seguridad para acceder al SGI:');
      if (pass === CONFIG.SECURITY_TOKEN) {
        alert('Acceso concedido al repositorio SGI.');
      } else {
        alert('Token incorrecto.');
      }
    } else {
      alert(`El enlace para "${mod.name}" aún no ha sido configurado.`);
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === CONFIG.SECURITY_TOKEN) {
      setIsAdminLoggedIn(true);
      setShowLoginModal(false);
      setShowAdminModal(true);
      setPassword('');
      setLoginMessage({ text: '', color: '' });
    } else {
      setLoginMessage({ text: 'contraseña incorrecta', color: 'text-red-500' });
    }
  };

  const deleteAnnouncement = (id: number) => {
    setAnnouncements(announcements.filter(a => a.id !== id));
  };

  const addAnnouncement = (newAnn: Omit<Announcement, 'id' | 'active'>) => {
    const id = Date.now();
    setAnnouncements([...announcements, { ...newAnn, id, active: true }]);
  };

  const toggleAnnouncement = (id: number) => {
    setAnnouncements(announcements.map(a => a.id === id ? { ...a, active: !a.active } : a));
  };

  const deleteVideo = (id: number) => {
    setVideos(videos.filter(v => v.id !== id));
  };

  return (
    <div className="min-h-screen flex flex-col font-sans selection:bg-blue-100 selection:text-blue-900">
      <Header 
        currentCompany={currentCompany}
        setCurrentCompany={setCurrentCompany}
        isMobileMenuOpen={isMobileMenuOpen}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
        isAdminLoggedIn={isAdminLoggedIn}
        onAdminClick={() => isAdminLoggedIn ? setShowAdminModal(true) : setShowLoginModal(true)}
        onVideosClick={() => setShowVideosModal(true)}
        handleModuleClick={handleModuleClick}
      />

      <Announcements 
        announcements={announcements}
        setAnnouncements={setAnnouncements}
      />

      <main className="flex-grow flex flex-col">
        <Hero news={news} heroBg={heroBg} />

        {/* Visit Banner */}
        <div className="bg-black text-white py-4 px-8 text-center font-bold text-sm md:text-base relative z-10 shadow-[0_-4px_20px_rgba(0,0,0,0.3)] tracking-wide">
          {visitInfo}
        </div>
      </main>

      {/* Modals */}
      <AnimatePresence>
        <LoginModal 
          isOpen={showLoginModal}
          onClose={() => setShowLoginModal(false)}
          onLogin={handleLogin}
          password={password}
          setPassword={setPassword}
          showPassword={showPassword}
          setShowPassword={setShowPassword}
          loginMessage={loginMessage}
        />

        <AdminModal 
          isOpen={showAdminModal}
          onClose={() => setShowAdminModal(false)}
          onLogout={() => { setIsAdminLoggedIn(false); setShowAdminModal(false); }}
          visitInfo={visitInfo}
          setVisitInfo={setVisitInfo}
          announcements={announcements}
          deleteAnnouncement={deleteAnnouncement}
          toggleAnnouncement={toggleAnnouncement}
          addAnnouncement={addAnnouncement}
          videos={videos}
          deleteVideo={deleteVideo}
          setHeroBg={setHeroBg}
        />

        <VideosModal 
          isOpen={showVideosModal}
          onClose={() => setShowVideosModal(false)}
          videos={videos}
        />
      </AnimatePresence>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #e2e8f0;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #cbd5e1;
        }
        
        :root {
          --primary: #1B4969;
          --primary-overlay: rgba(27, 73, 105, 0.85);
          --secondary-overlay: rgba(1, 42, 74, 0.7);
        }
        .theme-sx {
          --primary: #264074;
          --primary-overlay: rgba(38, 64, 116, 0.85);
          --secondary-overlay: rgba(26, 45, 82, 0.7);
        }
        .theme-so {
          --primary: #e2171b;
          --primary-overlay: rgba(226, 23, 27, 0.85);
          --secondary-overlay: rgba(179, 18, 21, 0.7);
        }
        .theme-pl {
          --primary: #FF6600;
          --primary-overlay: rgba(255, 102, 0, 0.85);
          --secondary-overlay: rgba(204, 82, 0, 0.7);
        }
      `}</style>
    </div>
  );
}
