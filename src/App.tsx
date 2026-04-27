/**
 * Proyecto: Intranet Corporativa - Grupo Simex
 * Autor: Juan Fernando Agudelo
 * Descripción: Componente principal que orquestra la navegación, el estado global 
 * y la persistencia de datos de toda la plataforma.
 */
import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Routes, Route, useParams, useNavigate } from 'react-router-dom';
import { Calendar } from 'lucide-react';
import { CONFIG } from './constants/config';
import { Announcement, Video as VideoType, NewsItem, CompanyCode, Module, PartyPhoto, Visit, NetworkConfig } from './types';

// Components
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { Announcements } from './components/Announcements';
import { LoginModal } from './components/LoginModal';
import { AdminModal } from './components/AdminModal';
import { VideosModal } from './components/VideosModal';
import PartyPhotosPage from './pages/PartyPhotosPage';
import DirectoryPage from './pages/DirectoryPage';
import BulletinPage from './pages/BulletinPage';

function IntranetContent({ 
  currentCompany, 
  setCurrentCompany,
  isAdminLoggedIn,
  setIsAdminLoggedIn,
  videos,
  setVideos,
  announcements,
  setAnnouncements,
  heroBgs,
  setHeroBgs,
  currentBgIndex,
  visits,
  setVisits,
  rhVideo,
  setRhVideo,
  partyPhotos,
  setPartyPhotos,
  bulletinQuincenal,
  setBulletinQuincenal,
  bulletinMensual,
  setBulletinMensual,
  networkConfig,
  setNetworkConfig,
  saveData,
  showAdminModal,
  setShowAdminModal
}: any) {
  const { companyName } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (companyName) {
      const code = companyName.toLowerCase().includes('simex') ? 'SX' : 
                   companyName.toLowerCase().includes('soinco') ? 'SO' : 
                   companyName.toLowerCase().includes('plastinovo') ? 'PL' : null;
      if (code && code !== currentCompany) {
        setCurrentCompany(code as CompanyCode);
      }
    }
  }, [companyName, currentCompany, setCurrentCompany]);

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showVideosModal, setShowVideosModal] = useState(false);
  const [currentVisitIndex, setCurrentVisitIndex] = useState(0);
  
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginMessage, setLoginMessage] = useState({ text: '', color: '' });

  const handleModuleClick = (mod: Module) => {
    if (mod.type === 'internal') {
      navigate(mod.url);
      return;
    }
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

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginMessage({ text: 'Validando credenciales...', color: 'text-blue-600' });

    try {
      // Consumo del servicio de autenticación a través del proxy del servidor
      const response = await fetch('/api/proxy/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          username: username.trim(),
          password: password.trim()
        })
      });

      const data = await response.json();

      if (response.ok && data.status === 'success') {
        setIsAdminLoggedIn(true);
        setShowLoginModal(false);
        setShowAdminModal(true);
        setPassword('');
        setUsername('');
        setLoginMessage({ text: '', color: '' });
      } else {
        // Mostramos el error específico que viene del proxy (ej. error de conexión a la IP interna)
        setLoginMessage({ 
          text: data.error || data.message || 'Usuario o contraseña incorrectos', 
          color: 'text-red-500' 
        });
      }
    } catch (error: any) {
      console.error('Error de autenticación:', error);
      setLoginMessage({ 
        text: `Error de red: No se pudo contactar al servidor. (${error.message})`, 
        color: 'text-red-600' 
      });
    }
  };

  const deleteAnnouncement = (id: string | number) => {
    const updated = announcements.filter((a: any) => a.id !== id);
    setAnnouncements(updated);
    saveData({ announcements: updated });
  };

  const addAnnouncement = (newAnn: Omit<Announcement, 'id' | 'active'>) => {
    const id = Date.now().toString();
    let updated = [{ ...newAnn, id, active: true }, ...announcements];
    
    // If the new announcement is priority, uncheck all others
    if (newAnn.isPriority) {
      updated = updated.map(a => ({
        ...a,
        isPriority: a.id === id ? true : false
      }));
    }
    
    setAnnouncements(updated);
    saveData({ announcements: updated });
  };

  const toggleAnnouncement = (id: string | number, currentActive: boolean) => {
    const updated = announcements.map((a: any) => a.id === id ? { ...a, active: !currentActive } : a);
    setAnnouncements(updated);
    saveData({ announcements: updated });
  };

  const togglePriority = (id: string | number) => {
    // Only one can be priority, so we turn off others and toggle the target
    const updated = announcements.map((a: any) => ({
      ...a,
      isPriority: a.id === id ? !a.isPriority : false
    }));
    setAnnouncements(updated);
    saveData({ announcements: updated });
  };

  const deleteVideo = (id: string | number) => {
    const updated = videos.filter((v: any) => v.id !== id);
    setVideos(updated);
    saveData({ videos: updated });
  };

  const addVideo = (newVideo: Omit<VideoType, 'id'>) => {
    const updated = [{ ...newVideo, id: Date.now().toString() }, ...videos];
    setVideos(updated);
    saveData({ videos: updated });
  };

  const addPartyPhotos = (urls: string[], year: string) => {
    const newPhotos = urls.map(url => ({ id: Math.random().toString(36).substr(2, 9), url, year }));
    const updated = [...newPhotos, ...partyPhotos];
    setPartyPhotos(updated);
    saveData({ partyPhotos: updated });
  };

  const deletePartyPhoto = (id: string | number) => {
    const updated = partyPhotos.filter((p: any) => p.id !== id);
    setPartyPhotos(updated);
    saveData({ partyPhotos: updated });
  };

  // Visit rotation effect
  useEffect(() => {
    if (visits.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentVisitIndex((prev) => (prev + 1) % visits.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [visits]);

  return (
    <div className="min-h-screen flex flex-col font-sans selection:bg-blue-100 selection:text-blue-900 bg-[#f8fafc]">
      <Header 
        currentCompany={currentCompany}
        setCurrentCompany={setCurrentCompany}
        isMobileMenuOpen={isMobileMenuOpen}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
        isAdminLoggedIn={isAdminLoggedIn}
        onAdminClick={() => {
          if (isAdminLoggedIn) {
            setShowAdminModal(true);
          } else {
            setUsername('');
            setPassword('');
            setLoginMessage({ text: '', color: '' });
            setShowLoginModal(true);
          }
        }}
        onVideosClick={() => setShowVideosModal(true)}
        onPartyPhotosClick={() => navigate('/fotos-fiesta')}
        bulletinQuincenal={bulletinQuincenal}
        bulletinMensual={bulletinMensual}
        handleModuleClick={handleModuleClick}
      />

      <Announcements 
        announcements={announcements}
        setAnnouncements={setAnnouncements}
        currentCompany={currentCompany}
      />

      <main className="flex-grow relative overflow-hidden flex flex-col">
        <Hero news={[]} heroBgs={heroBgs} currentBgIndex={currentBgIndex} />
      </main>

      {/* Visit Banner - Minimalist Corporate Footer */}
      <footer className="z-20 bg-white/95 backdrop-blur-md pt-4 pb-6 border-t border-gray-100 shadow-[0_-10px_40px_rgba(0,0,0,0.05)] safe-area-pb">
        <div className="container-custom flex items-center justify-between">
          <div className="flex items-center gap-3 text-gray-400 font-bold text-[10px] uppercase tracking-widest shrink-0">
            <Calendar size={14} className="text-blue-500" />
            <span>Visitas</span>
          </div>

          <div className="flex-grow flex items-center justify-center relative min-h-[30px] overflow-hidden">
            <AnimatePresence mode="wait">
              {visits.length > 0 ? (
                <motion.div
                  key={currentVisitIndex}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.4 }}
                  className="absolute text-center px-4"
                >
                  <span className="text-gray-900 text-[12px] md:text-sm font-black tracking-wide">
                    {visits[currentVisitIndex]?.text}
                  </span>
                </motion.div>
              ) : (
                <div className="text-gray-300 italic text-[10px] tracking-widest uppercase font-bold">Aquí podrás ver las visitas cuando estén disponibles</div>
              )}
            </AnimatePresence>
          </div>

          <div className="w-[80px] hidden md:block" /> {/* Spacer to keep center alignment */}
        </div>
      </footer>

      {/* Modals */}
      <AnimatePresence>
        <LoginModal 
          isOpen={showLoginModal}
          onClose={() => setShowLoginModal(false)}
          onLogin={handleLogin}
          username={username}
          setUsername={setUsername}
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
          visits={visits}
          setVisits={(val: any) => {
            setVisits((prev) => {
              const newValue = typeof val === 'function' ? val(prev) : val;
              saveData({ visits: newValue });
              return newValue;
            });
          }}
          announcements={announcements}
          deleteAnnouncement={deleteAnnouncement}
          toggleAnnouncement={toggleAnnouncement}
          togglePriority={togglePriority}
          addAnnouncement={addAnnouncement}
          videos={videos}
          deleteVideo={deleteVideo}
          addVideo={addVideo}
          heroBgs={heroBgs}
          setHeroBgs={(val: any) => {
            setHeroBgs((prev) => {
              const newValue = typeof val === 'function' ? val(prev) : val;
              saveData({ heroBgs: newValue });
              return newValue;
            });
          }}
          rhVideo={rhVideo}
          setRhVideo={(val: any) => {
            setRhVideo((prev) => {
              const newValue = typeof val === 'function' ? val(prev) : val;
              saveData({ rhVideo: newValue });
              return newValue;
            });
          }}
          partyPhotos={partyPhotos}
          setPartyPhotos={(val: any) => {
            setPartyPhotos((prev) => {
              const newValue = typeof val === 'function' ? val(prev) : val;
              saveData({ partyPhotos: newValue });
              return newValue;
            });
          }}
          addPartyPhotos={addPartyPhotos}
          deletePartyPhoto={deletePartyPhoto}
          bulletinQuincenal={bulletinQuincenal}
          setBulletinQuincenal={(val: any) => {
            setBulletinQuincenal((prev) => {
              const newValue = typeof val === 'function' ? val(prev) : val;
              saveData({ bulletinQuincenal: newValue });
              return newValue;
            });
          }}
          bulletinMensual={bulletinMensual}
          setBulletinMensual={(val: any) => {
            setBulletinMensual((prev) => {
              const newValue = typeof val === 'function' ? val(prev) : val;
              saveData({ bulletinMensual: newValue });
              return newValue;
            });
          }}
          networkConfig={networkConfig}
          setNetworkConfig={(val: any) => {
            setNetworkConfig((prev) => {
              const newValue = typeof val === 'function' ? val(prev) : val;
              saveData({ config: newValue });
              return newValue;
            });
          }}
        />

        <VideosModal 
          isOpen={showVideosModal}
          onClose={() => setShowVideosModal(false)}
          videos={videos}
          rhVideo={rhVideo}
        />
      </AnimatePresence>

      <style>{`
        :root {
          --primary: #1B4969;
          --primary-overlay: rgba(0, 0, 0, 0.15);
          --secondary-overlay: rgba(0, 0, 0, 0.05);
        }
        .theme-sx {
          --primary: #264074;
          --primary-overlay: rgba(0, 0, 0, 0.15);
          --secondary-overlay: rgba(0, 0, 0, 0.05);
        }
        .theme-so {
          --primary: #e2171b;
          --primary-overlay: rgba(0, 0, 0, 0.15);
          --secondary-overlay: rgba(0, 0, 0, 0.05);
        }
        .theme-pl {
          --primary: #FF6600;
          --primary-overlay: rgba(0, 0, 0, 0.15);
          --secondary-overlay: rgba(0, 0, 0, 0.05);
        }
      `}</style>
    </div>
  );
}

/**
 * Componente principal App: Gestiona el estado global de la aplicación,
 * la carga de datos desde el backend y el enrutamiento.
 */
export default function App() {
  // --- ESTADOS GLOBALES ---
  const [currentCompany, setCurrentCompany] = useState<CompanyCode>(CONFIG.DEFAULT_COMPANY);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showAdminModal, setShowAdminModal] = useState(false);
  
  // Datos persistidos en el Backend (data.json)
  const [videos, setVideos] = useState<VideoType[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [heroBgs, setHeroBgs] = useState<string[]>([]);
  const [currentBgIndex, setCurrentBgIndex] = useState(0);
  const [visits, setVisits] = useState<Visit[]>([]);
  const [rhVideo, setRhVideo] = useState<string | null>(null);
  const [partyPhotos, setPartyPhotos] = useState<PartyPhoto[]>([]);
  const [bulletinQuincenal, setBulletinQuincenal] = useState<any>({ SX: [], SO: [], PL: [] });
  const [bulletinMensual, setBulletinMensual] = useState<any[]>([]);
  const [networkConfig, setNetworkConfig] = useState<NetworkConfig>({ n8nUrl: '', n8nAuth: '' });
  
  // --- COMUNICACIÓN CON EL BACKEND ---

  /**
   * Obtiene todos los datos de la intranet desde el servidor.
   */
  const fetchData = async () => {
    try {
      const response = await fetch('/api/data');
      const data = await response.json();
      
      // Actualizamos los estados con la información recibida
      setVideos(data.videos || []);
      setAnnouncements(data.announcements || []);
      setHeroBgs(data.heroBgs || []);
      setVisits(data.visits || []);
      setRhVideo(data.rhVideo || null);
      setPartyPhotos(data.partyPhotos || []);
      setBulletinQuincenal(data.bulletinQuincenal || { SX: [], SO: [], PL: [] });
      setBulletinMensual(data.bulletinMensual || []);
      setNetworkConfig(data.config || { n8nUrl: 'http://192.101.2.50:5678', n8nAuth: 'intranet:intranet' });
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Envía actualizaciones al servidor para persistir cambios en data.json.
   * @param updates Objeto con los campos a actualizar.
   */
  const saveData = async (updates: any) => {
    try {
      console.log('--- Iniciando guardado de datos ---', Object.keys(updates));
      const response = await fetch('/api/data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      
      if (!response.ok) {
        throw new Error(`Error del Servidor (${response.status}): ${response.statusText}`);
      }
      
      const result = await response.json();
      if (result.success) {
        console.log('--- Datos guardados exitosamente en el servidor ---');
      }
    } catch (error: any) {
      console.error('Error crítico al guardar datos en el servidor:', error);
      alert(`No se pudo guardar: ${error.message}\n\nPosibles causas:\n1. El archivo es demasiado pesado para la red.\n2. Se perdió la conexión con el servidor.\n3. El tamaño excede el límite permitido por el proxy (Nginx).`);
    }
  };

  // --- EFFECTS ---
  useEffect(() => {
    fetchData();
    // Real-time polling every 10 seconds - Bloqueado si el admin está abierto
    const interval = setInterval(() => {
      if (!showAdminModal) {
        fetchData();
      } else {
        console.log('Polling detenido: Panel de administración activo');
      }
    }, 10000);
    return () => clearInterval(interval);
  }, [showAdminModal]);

  useEffect(() => {
    document.body.className = `theme-${currentCompany.toLowerCase()}`;
  }, [currentCompany]);

  // Background rotation effect
  useEffect(() => {
    const defaultBgsCount = 2; // El número de imágenes por defecto definidas en Hero.tsx
    const totalBgs = heroBgs.length > 0 ? heroBgs.length : defaultBgsCount;

    if (totalBgs <= 1) return;
    
    const interval = setInterval(() => {
      setCurrentBgIndex((prev) => (prev + 1) % totalBgs);
    }, 5000);
    
    return () => clearInterval(interval);
  }, [heroBgs]);

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
    <Routes>
      <Route path="/" element={
        <IntranetContent 
          currentCompany={currentCompany}
          setCurrentCompany={setCurrentCompany}
          isAdminLoggedIn={isAdminLoggedIn}
          setIsAdminLoggedIn={setIsAdminLoggedIn}
          videos={videos}
          setVideos={setVideos}
          announcements={announcements}
          setAnnouncements={setAnnouncements}
          heroBgs={heroBgs}
          setHeroBgs={setHeroBgs}
          currentBgIndex={currentBgIndex}
          visits={visits}
          setVisits={setVisits}
          rhVideo={rhVideo}
          setRhVideo={setRhVideo}
          partyPhotos={partyPhotos}
          setPartyPhotos={setPartyPhotos}
          bulletinQuincenal={bulletinQuincenal}
          setBulletinQuincenal={setBulletinQuincenal}
          bulletinMensual={bulletinMensual}
          setBulletinMensual={setBulletinMensual}
          networkConfig={networkConfig}
          setNetworkConfig={setNetworkConfig}
          saveData={saveData}
          showAdminModal={showAdminModal}
          setShowAdminModal={setShowAdminModal}
        />
      } />
      <Route path="/:companyName" element={
        <IntranetContent 
          currentCompany={currentCompany}
          setCurrentCompany={setCurrentCompany}
          isAdminLoggedIn={isAdminLoggedIn}
          setIsAdminLoggedIn={setIsAdminLoggedIn}
          videos={videos}
          setVideos={setVideos}
          announcements={announcements}
          setAnnouncements={setAnnouncements}
          heroBgs={heroBgs}
          setHeroBgs={setHeroBgs}
          currentBgIndex={currentBgIndex}
          visits={visits}
          setVisits={setVisits}
          rhVideo={rhVideo}
          setRhVideo={setRhVideo}
          partyPhotos={partyPhotos}
          setPartyPhotos={setPartyPhotos}
          bulletinQuincenal={bulletinQuincenal}
          setBulletinQuincenal={setBulletinQuincenal}
          bulletinMensual={bulletinMensual}
          setBulletinMensual={setBulletinMensual}
          networkConfig={networkConfig}
          setNetworkConfig={setNetworkConfig}
          saveData={saveData}
          showAdminModal={showAdminModal}
          setShowAdminModal={setShowAdminModal}
        />
      } />
      <Route path="/fotos-fiesta" element={<PartyPhotosPage />} />
      <Route path="/directorio" element={<DirectoryPage />} />
      <Route path="/boletin-quincenal" element={
        <BulletinPage 
          type="quincenal" 
          bulletinQuincenal={bulletinQuincenal} 
          bulletinMensual={bulletinMensual} 
          currentCompany={currentCompany} 
        />
      } />
      <Route path="/boletin-mensual" element={
        <BulletinPage 
          type="mensual" 
          bulletinQuincenal={bulletinQuincenal} 
          bulletinMensual={bulletinMensual} 
          currentCompany={currentCompany} 
        />
      } />
    </Routes>
  );
}
