import React, { useState, useEffect } from 'react';
import { AnimatePresence } from 'motion/react';
import { CONFIG } from './constants/config';
import { Announcement, Video as VideoType, NewsItem, CompanyCode, Module, PartyPhoto } from './types';

// Components
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { Announcements } from './components/Announcements';
import { LoginModal } from './components/LoginModal';
import { AdminModal } from './components/AdminModal';
import { VideosModal } from './components/VideosModal';
import { RHVideoModal } from './components/RHVideoModal';
import { PartyPhotosModal } from './components/PartyPhotosModal';

export default function App() {
  // --- STATE ---
  const [currentCompany, setCurrentCompany] = useState<CompanyCode>(CONFIG.DEFAULT_COMPANY);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [news, setNews] = useState<NewsItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Data from Backend
  const [videos, setVideos] = useState<VideoType[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [heroBgs, setHeroBgs] = useState<string[]>([]);
  const [currentBgIndex, setCurrentBgIndex] = useState(0);
  const [visitInfo, setVisitInfo] = useState("");
  const [rhVideo, setRhVideo] = useState<string | null>(null);
  const [partyPhotos, setPartyPhotos] = useState<PartyPhoto[]>([]);
  
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [showVideosModal, setShowVideosModal] = useState(false);
  const [showRHVideoModal, setShowRHVideoModal] = useState(false);
  const [showPartyPhotosModal, setShowPartyPhotosModal] = useState(false);
  
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginMessage, setLoginMessage] = useState({ text: '', color: '' });

  // --- API FETCHING ---
  const fetchData = async () => {
    try {
      const response = await fetch('/api/data');
      const data = await response.json();
      setVideos(data.videos);
      setAnnouncements(data.announcements);
      setHeroBgs(data.heroBgs);
      setVisitInfo(data.visitInfo);
      setRhVideo(data.rhVideo);
      setPartyPhotos(data.partyPhotos);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveData = async (updates: any) => {
    try {
      await fetch('/api/data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
    } catch (error) {
      console.error('Error saving data:', error);
    }
  };

  // --- EFFECTS ---
  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    document.body.className = `theme-${currentCompany.toLowerCase()}`;
  }, [currentCompany]);

  // Background rotation effect
  useEffect(() => {
    if (heroBgs.length <= 1) return;
    
    const interval = setInterval(() => {
      setCurrentBgIndex((prev) => (prev + 1) % heroBgs.length);
    }, 5000);
    
    return () => clearInterval(interval);
  }, [heroBgs]);

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

  const deleteAnnouncement = (id: string | number) => {
    const updated = announcements.filter(a => a.id !== id);
    setAnnouncements(updated);
    saveData({ announcements: updated });
  };

  const addAnnouncement = (newAnn: Omit<Announcement, 'id' | 'active'>) => {
    const id = Date.now().toString();
    const updated = [{ ...newAnn, id, active: true }, ...announcements];
    setAnnouncements(updated);
    saveData({ announcements: updated });
  };

  const toggleAnnouncement = (id: string | number, currentActive: boolean) => {
    const updated = announcements.map(a => a.id === id ? { ...a, active: !currentActive } : a);
    setAnnouncements(updated);
    saveData({ announcements: updated });
  };

  const deleteVideo = (id: string | number) => {
    const updated = videos.filter(v => v.id !== id);
    setVideos(updated);
    saveData({ videos: updated });
  };

  const addVideo = (newVideo: Omit<VideoType, 'id'>) => {
    const updated = [{ ...newVideo, id: Date.now().toString() }, ...videos];
    setVideos(updated);
    saveData({ videos: updated });
  };

  const addPartyPhoto = (url: string) => {
    const updated = [{ id: Date.now().toString(), url }, ...partyPhotos];
    setPartyPhotos(updated);
    saveData({ partyPhotos: updated });
  };

  const deletePartyPhoto = (id: string | number) => {
    const updated = partyPhotos.filter(p => p.id !== id);
    setPartyPhotos(updated);
    saveData({ partyPhotos: updated });
  };

  const handleSetVisitInfo = (val: string | ((prev: string) => string)) => {
    const newValue = typeof val === 'function' ? val(visitInfo) : val;
    setVisitInfo(newValue);
    saveData({ visitInfo: newValue });
  };

  const handleSetHeroBgs = (val: string[] | ((prev: string[]) => string[])) => {
    const newValue = typeof val === 'function' ? val(heroBgs) : val;
    setHeroBgs(newValue);
    saveData({ heroBgs: newValue });
  };

  const handleSetRhVideo = (val: string | null | ((prev: string | null) => string | null)) => {
    const newValue = typeof val === 'function' ? val(rhVideo) : val;
    setRhVideo(newValue);
    saveData({ rhVideo: newValue });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-500 font-bold animate-pulse">Cargando Intranet...</p>
        </div>
      </div>
    );
  }

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
        onRHVideoClick={() => setShowRHVideoModal(true)}
        onPartyPhotosClick={() => setShowPartyPhotosModal(true)}
        handleModuleClick={handleModuleClick}
      />

      <Announcements 
        announcements={announcements}
        setAnnouncements={setAnnouncements}
        currentCompany={currentCompany}
      />

      <main className="flex-grow flex flex-col">
        <Hero news={news} heroBgs={heroBgs} currentBgIndex={currentBgIndex} />

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
          setVisitInfo={handleSetVisitInfo}
          announcements={announcements}
          deleteAnnouncement={deleteAnnouncement}
          toggleAnnouncement={toggleAnnouncement}
          addAnnouncement={addAnnouncement}
          videos={videos}
          deleteVideo={deleteVideo}
          addVideo={addVideo}
          heroBgs={heroBgs}
          setHeroBgs={handleSetHeroBgs}
          rhVideo={rhVideo}
          setRhVideo={handleSetRhVideo}
          partyPhotos={partyPhotos}
          addPartyPhoto={addPartyPhoto}
          deletePartyPhoto={deletePartyPhoto}
        />

        <VideosModal 
          isOpen={showVideosModal}
          onClose={() => setShowVideosModal(false)}
          videos={videos}
        />

        <RHVideoModal 
          isOpen={showRHVideoModal}
          onClose={() => setShowRHVideoModal(false)}
          videoUrl={rhVideo}
        />

        <PartyPhotosModal 
          isOpen={showPartyPhotosModal}
          onClose={() => setShowPartyPhotosModal(false)}
          photos={partyPhotos}
        />
      </AnimatePresence>

      <style>{`
        :root {
          --primary: #1B4969;
          --primary-overlay: rgba(0, 0, 0, 0.75);
          --secondary-overlay: rgba(0, 0, 0, 0.6);
        }
        .theme-sx {
          --primary: #264074;
          --primary-overlay: rgba(0, 0, 0, 0.75);
          --secondary-overlay: rgba(0, 0, 0, 0.6);
        }
        .theme-so {
          --primary: #e2171b;
          --primary-overlay: rgba(0, 0, 0, 0.75);
          --secondary-overlay: rgba(0, 0, 0, 0.6);
        }
        .theme-pl {
          --primary: #FF6600;
          --primary-overlay: rgba(0, 0, 0, 0.75);
          --secondary-overlay: rgba(0, 0, 0, 0.6);
        }
      `}</style>
    </div>
  );
}
