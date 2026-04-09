import React, { useState, useEffect } from 'react';
import { AnimatePresence } from 'motion/react';
import { CONFIG } from './constants/config';
import { Announcement, Video as VideoType, NewsItem, CompanyCode, Module, PartyPhoto } from './types';
import { getDb, handleFirestoreError, OperationType } from './lib/firebase';
import { 
  collection, 
  onSnapshot, 
  addDoc, 
  deleteDoc, 
  doc, 
  updateDoc, 
  setDoc, 
  query,
  orderBy,
  serverTimestamp
} from 'firebase/firestore';

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
  const [videos, setVideos] = useState<VideoType[]>([
    { id: 1, title: 'Mensaje de Gerencia', url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' }
  ]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [heroBg, setHeroBg] = useState<string | null>(null);
  const [visitInfo, setVisitInfo] = useState("Hoy nos visita Bancolombia para asesoría en crédito de vivienda");
  const [rhVideo, setRhVideo] = useState<string | null>(null);
  const [partyPhotos, setPartyPhotos] = useState<PartyPhoto[]>([]);
  const [isDataReady, setIsDataReady] = useState(false);
  
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [showVideosModal, setShowVideosModal] = useState(false);
  const [showRHVideoModal, setShowRHVideoModal] = useState(false);
  const [showPartyPhotosModal, setShowPartyPhotosModal] = useState(false);
  
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginMessage, setLoginMessage] = useState({ text: '', color: '' });

  // --- EFFECTS ---
  useEffect(() => {
    document.body.className = `theme-${currentCompany.toLowerCase()}`;
  }, [currentCompany]);

  // Real-time listeners
  useEffect(() => {
    let unsubs: (() => void)[] = [];

    const setupListeners = async () => {
      const db = await getDb();
      
      const unsubAnn = onSnapshot(query(collection(db, 'announcements'), orderBy('createdAt', 'desc')), 
        (snapshot) => {
          setAnnouncements(snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as any)));
        },
        (error) => handleFirestoreError(error, OperationType.LIST, 'announcements')
      );

      const unsubVideos = onSnapshot(query(collection(db, 'videos'), orderBy('createdAt', 'desc')), 
        (snapshot) => {
          setVideos(snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as any)));
        },
        (error) => handleFirestoreError(error, OperationType.LIST, 'videos')
      );

      const unsubPhotos = onSnapshot(query(collection(db, 'partyPhotos'), orderBy('createdAt', 'desc')), 
        (snapshot) => {
          setPartyPhotos(snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as any)));
        },
        (error) => handleFirestoreError(error, OperationType.LIST, 'partyPhotos')
      );

      const unsubSettings = onSnapshot(doc(db, 'settings', 'global'), 
        (docSnap) => {
          if (docSnap.exists()) {
            const data = docSnap.data();
            if (data.visitInfo) setVisitInfo(data.visitInfo);
            if (data.heroBg) setHeroBg(data.heroBg);
            if (data.rhVideo) setRhVideo(data.rhVideo);
          }
          setIsDataReady(true);
        },
        (error) => handleFirestoreError(error, OperationType.GET, 'settings/global')
      );

      unsubs = [unsubAnn, unsubVideos, unsubPhotos, unsubSettings];
    };

    setupListeners();

    return () => {
      unsubs.forEach(unsub => unsub());
    };
  }, []);

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

  const deleteAnnouncement = async (id: string) => {
    try {
      const db = await getDb();
      await deleteDoc(doc(db, 'announcements', id));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `announcements/${id}`);
    }
  };

  const addAnnouncement = async (newAnn: Omit<Announcement, 'id' | 'active'>) => {
    try {
      const db = await getDb();
      await addDoc(collection(db, 'announcements'), {
        ...newAnn,
        active: true,
        createdAt: serverTimestamp()
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'announcements');
    }
  };

  const toggleAnnouncement = async (id: string, currentActive: boolean) => {
    try {
      const db = await getDb();
      await updateDoc(doc(db, 'announcements', id), {
        active: !currentActive
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `announcements/${id}`);
    }
  };

  const deleteVideo = async (id: string) => {
    try {
      const db = await getDb();
      await deleteDoc(doc(db, 'videos', id));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `videos/${id}`);
    }
  };

  const addVideo = async (newVideo: Omit<VideoType, 'id'>) => {
    try {
      const db = await getDb();
      await addDoc(collection(db, 'videos'), {
        ...newVideo,
        createdAt: serverTimestamp()
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'videos');
    }
  };

  const addPartyPhoto = async (url: string) => {
    try {
      const db = await getDb();
      await addDoc(collection(db, 'partyPhotos'), {
        url,
        createdAt: serverTimestamp()
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'partyPhotos');
    }
  };

  const deletePartyPhoto = async (id: string) => {
    try {
      const db = await getDb();
      await deleteDoc(doc(db, 'partyPhotos', id));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `partyPhotos/${id}`);
    }
  };

  const updateGlobalSettings = async (updates: Partial<{ visitInfo: string, heroBg: string, rhVideo: string }>) => {
    try {
      const db = await getDb();
      await setDoc(doc(db, 'settings', 'global'), updates, { merge: true });
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, 'settings/global');
    }
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
        onRHVideoClick={() => setShowRHVideoModal(true)}
        onPartyPhotosClick={() => setShowPartyPhotosModal(true)}
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
          setVisitInfo={(val) => updateGlobalSettings({ visitInfo: val })}
          announcements={announcements}
          deleteAnnouncement={deleteAnnouncement}
          toggleAnnouncement={toggleAnnouncement}
          addAnnouncement={addAnnouncement}
          videos={videos}
          deleteVideo={deleteVideo}
          addVideo={addVideo}
          setHeroBg={(val) => updateGlobalSettings({ heroBg: val })}
          rhVideo={rhVideo}
          setRhVideo={(val) => updateGlobalSettings({ rhVideo: val })}
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
