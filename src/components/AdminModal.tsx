import React, { useState } from 'react';
import { X, Trash2, LogOut, Camera, Eye, EyeOff, Video as VideoIcon, FileText, ArrowUp, ArrowDown } from 'lucide-react';
import { motion } from 'motion/react';
import { Announcement, Video, PartyPhoto, Visit } from '../types';

interface AdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogout: () => void;
  visits: Visit[];
  setVisits: (val: Visit[] | ((prev: Visit[]) => Visit[])) => void;
  announcements: Announcement[];
  deleteAnnouncement: (id: string) => void;
  toggleAnnouncement: (id: string, currentActive: boolean) => void;
  videos: Video[];
  deleteVideo: (id: string) => void;
  addVideo: (video: Omit<Video, 'id'>) => void;
  heroBgs: string[];
  setHeroBgs: (val: string[] | ((prev: string[]) => string[])) => void;
  rhVideo: string | null;
  setRhVideo: (url: string | null) => void;
  partyPhotos: PartyPhoto[];
  setPartyPhotos: (val: PartyPhoto[] | ((prev: PartyPhoto[]) => PartyPhoto[])) => void;
  addPartyPhotos: (urls: string[], year: string) => void;
  deletePartyPhoto: (id: string) => void;
  bulletinQuincenal: { SX: any[]; SO: any[]; PL: any[] };
  setBulletinQuincenal: (val: any | ((prev: any) => any)) => void;
  bulletinMensual: any[];
  setBulletinMensual: (val: any[] | ((prev: any[]) => any[])) => void;
  addAnnouncement: (ann: Omit<Announcement, 'id' | 'active'>) => void;
}

/**
 * Componente AdminModal: Panel de control para administradores.
 * Permite gestionar visitas, anuncios, videos, imágenes de fondo y el boletín semanal.
 */
export const AdminModal: React.FC<AdminModalProps> = ({
  isOpen,
  onClose,
  onLogout,
  visits,
  setVisits,
  announcements,
  deleteAnnouncement,
  toggleAnnouncement,
  videos,
  deleteVideo,
  addVideo,
  heroBgs,
  setHeroBgs,
  rhVideo,
  setRhVideo,
  partyPhotos,
  addPartyPhotos,
  deletePartyPhoto,
  bulletinQuincenal,
  setBulletinQuincenal,
  bulletinMensual,
  setBulletinMensual,
  addAnnouncement,
  setPartyPhotos
}) => {
  // --- ESTADOS LOCALES PARA FORMULARIOS ---
  const [newAnn, setNewAnn] = useState<{ title: string; content: string; image: string; company: 'SX' | 'SO' | 'PL' | 'Global' }>({ 
    title: '', 
    content: '', 
    image: '', 
    company: 'Global' 
  });
  const [newVideo, setNewVideo] = useState<{ title: string; description: string; url: string; type: 'youtube' | 'local' }>({ title: '', description: '', url: '', type: 'youtube' });
  const [photoYear, setPhotoYear] = useState(new Date().getFullYear().toString());
  const [newVisit, setNewVisit] = useState('');
  const [selectedQuincenalCompany, setSelectedQuincenalCompany] = useState<'SX' | 'SO' | 'PL'>('SX');

  if (!isOpen) return null;

  const relevantAnnouncements = announcements.filter(a => 
    a.active && (a.company === 'Global' || a.company === newAnn.company)
  );
  const isAnnLimitReached = relevantAnnouncements.length >= 5;

  const getCompanyName = (code: string) => {
    switch (code) {
      case 'SX': return 'Simex';
      case 'SO': return 'Soinco';
      case 'PL': return 'Plastinovo';
      default: return 'todas las empresas';
    }
  };

  /**
   * Maneja la creación de un nuevo anuncio.
   * Valida que no se superen los 5 anuncios activos por empresa.
   */
  const handleAddAnn = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAnn.title || !newAnn.content) return;
    
    // Calcular anuncios actuales para la empresa seleccionada
    // (Anuncios globales + Anuncios específicos de la empresa)
    const relevantAnnouncements = announcements.filter(a => 
      a.active && (a.company === 'Global' || a.company === newAnn.company)
    );

    if (relevantAnnouncements.length >= 5) {
      alert(`Límite alcanzado: Ya hay 5 noticias flotantes activas para ${newAnn.company === 'Global' ? 'todas las empresas' : newAnn.company} (incluyendo las generales).`);
      return;
    }

    addAnnouncement(newAnn);
    setNewAnn({ title: '', content: '', image: '', company: 'Global' });
  };

  /**
   * Maneja la adición de un nuevo video corporativo.
   */
  const handleAddVideo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newVideo.title || !newVideo.url) return;
    addVideo(newVideo);
    setNewVideo({ title: '', description: '', url: '', type: 'youtube' });
  };

  /**
   * Maneja la adición de una nueva visita rotativa.
   */
  const handleAddVisit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newVisit.trim()) return;
    setVisits([...visits, { id: Date.now().toString(), text: newVisit.trim() }]);
    setNewVisit('');
  };

  /**
   * Elimina una visita específica.
   */
  const deleteVisit = (id: string) => {
    setVisits(visits.filter(v => v.id !== id));
  };

  /**
   * Maneja la carga masiva de fotos de la fiesta.
   */
  const handleBulkPhotos = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      const urls: string[] = [];
      let processed = 0;

      files.forEach((file: File) => {
        const reader = new FileReader();
        reader.onload = (ev) => {
          urls.push(ev.target?.result as string);
          processed++;
          if (processed === files.length) {
            addPartyPhotos(urls, photoYear);
          }
        };
        reader.readAsDataURL(file);
      });
    }
  };

  /**
   * Maneja la carga del boletín quincenal por empresa.
   * Soporta imágenes y archivos PDF.
   */
  const handleQuincenalUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files).slice(0, 30);
      const newFiles: any[] = [];
      let processed = 0;

      files.forEach((file: File, index: number) => {
        const reader = new FileReader();
        reader.onload = (ev) => {
          newFiles.push({
            id: Math.random().toString(36).substr(2, 9),
            url: ev.target?.result as string,
            type: file.type,
            name: file.name,
            order: index
          });
          processed++;
          if (processed === files.length) {
            setBulletinQuincenal((prev: any) => ({
              ...prev,
              [selectedQuincenalCompany]: newFiles
            }));
          }
        };
        reader.readAsDataURL(file);
      });
    }
  };

  /**
   * Maneja la carga del boletín mensual (global).
   * Soporta imágenes y archivos PDF.
   */
  const handleMensualUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files).slice(0, 30);
      const newFiles: any[] = [];
      let processed = 0;

      files.forEach((file: File, index: number) => {
        const reader = new FileReader();
        reader.onload = (ev) => {
          newFiles.push({
            id: Math.random().toString(36).substr(2, 9),
            url: ev.target?.result as string,
            type: file.type,
            name: file.name,
            order: index
          });
          processed++;
          if (processed === files.length) {
            setBulletinMensual(newFiles);
          }
        };
        reader.readAsDataURL(file);
      });
    }
  };

  return (
    <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />
      <motion.div 
        initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 50, opacity: 0 }}
        className="relative glass rounded-3xl p-6 md:p-10 w-full max-w-[650px] max-h-[90vh] overflow-y-auto shadow-2xl custom-scrollbar"
      >
        <div className="flex justify-between items-center mb-8 sticky top-0 bg-transparent backdrop-blur-md z-10 pb-4 border-b border-gray-200">
          <h2 className="text-3xl font-black text-gray-900 tracking-tight">Panel de Control</h2>
          <div className="flex items-center gap-2">
            <button 
              onClick={onLogout}
              className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-xl text-xs font-black hover:bg-red-100 transition-colors"
            >
              <LogOut size={16} /> Cerrar Sesión
            </button>
            <button 
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X size={28} className="text-gray-500" />
            </button>
          </div>
        </div>
        
        <div className="space-y-10">
          <div className="bg-blue-50 p-5 rounded-2xl border-l-8 border-[var(--primary)] text-sm text-blue-900 font-semibold leading-relaxed">
            Bienvenido al centro de mando. Aquí puedes actualizar la información en tiempo real para todos los empleados.
          </div>

          {/* Visitas */}
          <section className="space-y-4">
            <h3 className="text-lg font-black text-gray-900 flex items-center gap-2">
              <span className="w-8 h-8 bg-gray-900 text-white rounded-lg flex items-center justify-center text-sm">1</span>
              Gestión de Visitas (Rotativas)
            </h3>
            
            <form onSubmit={handleAddVisit} className="space-y-3 bg-gray-50 p-4 rounded-2xl border-2 border-gray-100">
              <textarea 
                className="w-full px-5 py-3 rounded-xl border-2 border-gray-100 focus:border-blue-500 outline-none font-semibold h-24 resize-none"
                placeholder="Ej: Hoy nos visita Bancolombia para asesoría financiera"
                value={newVisit}
                onChange={(e) => setNewVisit(e.target.value)}
              />
              <button 
                type="submit"
                className="w-full py-2 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-colors"
              >
                Agregar Visita
              </button>
            </form>

            <div className="space-y-3">
              {visits.map(v => (
                <div key={v.id} className="flex justify-between items-center p-4 bg-gray-50 rounded-2xl border-2 border-gray-100 group hover:border-blue-200 transition-colors">
                  <span className="text-sm font-semibold text-gray-700 leading-tight">{v.text}</span>
                  <button 
                    onClick={() => deleteVisit(v.id)} 
                    className="text-red-500 p-2 hover:bg-red-50 rounded-xl transition-colors"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              ))}
              {visits.length === 0 && (
                <p className="text-sm text-gray-400 italic text-center py-4">No hay visitas programadas.</p>
              )}
            </div>
          </section>

          {/* Anuncios */}
          <section className="space-y-4">
            <h3 className="text-lg font-black text-gray-900 flex items-center gap-2">
              <span className="w-8 h-8 bg-gray-900 text-white rounded-lg flex items-center justify-center text-sm">2</span>
              Anuncios Flotantes (Máx 5 por empresa)
            </h3>
            
            <form onSubmit={handleAddAnn} className="space-y-3 bg-gray-50 p-4 rounded-2xl border-2 border-gray-100">
              <input 
                className="w-full px-4 py-2 rounded-xl border border-gray-200 outline-none focus:border-blue-500"
                placeholder="Título del anuncio"
                value={newAnn.title}
                onChange={e => setNewAnn({...newAnn, title: e.target.value})}
              />
              <textarea 
                className="w-full px-4 py-2 rounded-xl border border-gray-200 outline-none focus:border-blue-500 h-20 resize-none"
                placeholder="Contenido del anuncio"
                value={newAnn.content}
                onChange={e => setNewAnn({...newAnn, content: e.target.value})}
              />
              
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Mostrar en:</label>
                <div className="flex flex-wrap gap-2">
                  {['Global', 'SX', 'SO', 'PL'].map((comp) => (
                    <button
                      key={comp}
                      type="button"
                      onClick={() => setNewAnn({...newAnn, company: comp as any})}
                      className={`px-3 py-1 rounded-full text-[10px] font-bold transition-all ${
                        newAnn.company === comp 
                          ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' 
                          : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                      }`}
                    >
                      {comp === 'Global' ? 'Todas las empresas' : comp}
                    </button>
                  ))}
                </div>
                {isAnnLimitReached && (
                  <motion.p 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="text-[10px] font-black text-red-600 bg-red-50 p-2 rounded-lg border border-red-100 uppercase tracking-tight"
                  >
                    ⚠️ Se llenó el espacio de noticias para {getCompanyName(newAnn.company)}
                  </motion.p>
                )}
              </div>

              <input 
                type="file"
                accept="image/*"
                onChange={(e) => {
                  if (e.target.files?.[0]) {
                    const reader = new FileReader();
                    reader.onload = (ev) => setNewAnn({...newAnn, image: ev.target?.result as string});
                    reader.readAsDataURL(e.target.files[0]);
                  }
                }}
                className="w-full text-xs text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
              <button 
                type="submit"
                disabled={isAnnLimitReached}
                className={`w-full py-2 rounded-xl font-bold transition-all ${
                  isAnnLimitReached 
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                {isAnnLimitReached ? 'Límite alcanzado' : 'Agregar Anuncio'}
              </button>
            </form>

            <div className="space-y-3">
              {announcements.length > 0 ? announcements.map(ann => (
                <div key={ann.id} className="flex justify-between items-center p-4 bg-gray-50 rounded-2xl border-2 border-gray-100 group hover:border-blue-200 transition-colors">
                  <div className="flex items-center gap-3">
                    {ann.image && <img src={ann.image} className="w-10 h-10 rounded-lg object-cover" alt="" />}
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-gray-800 truncate max-w-[150px]">{ann.title}</span>
                      <span className={`text-[8px] font-black px-2 py-0.5 rounded-full w-fit uppercase ${
                        ann.company === 'Global' ? 'bg-purple-100 text-purple-600' : 'bg-blue-100 text-blue-600'
                      }`}>
                        {ann.company}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => toggleAnnouncement(ann.id.toString(), ann.active)} 
                      className={`p-2 rounded-xl transition-colors flex items-center gap-1 group/toggle ${ann.active ? 'text-green-600 hover:bg-green-50' : 'text-gray-400 hover:bg-gray-100'}`}
                      title={ann.active ? "Ocultar" : "Mostrar"}
                    >
                      <span className="text-xs font-bold opacity-0 group-hover/toggle:opacity-100 transition-opacity">
                        {ann.active ? "Ocultar" : "Mostrar"}
                      </span>
                      {ann.active ? <Eye size={20} /> : <EyeOff size={20} />}
                    </button>
                    <button 
                      onClick={() => deleteAnnouncement(ann.id.toString())} 
                      className="text-red-500 p-2 hover:bg-red-50 rounded-xl transition-colors flex items-center gap-1 group/del"
                    >
                      <span className="text-xs font-bold opacity-0 group-hover/del:opacity-100 transition-opacity">Borrar</span>
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>
              )) : (
                <p className="text-sm text-gray-400 italic text-center py-4">No hay anuncios activos actualmente.</p>
              )}
            </div>
          </section>

          {/* Video RH */}
          <section className="space-y-4">
            <h3 className="text-lg font-black text-gray-900 flex items-center gap-2">
              <span className="w-8 h-8 bg-gray-900 text-white rounded-lg flex items-center justify-center text-sm">3</span>
              Vídeo RH (Archivo)
            </h3>
            <div className="p-6 border-2 border-dashed border-gray-200 rounded-3xl text-center hover:border-blue-400 transition-colors cursor-pointer relative group">
              <input 
                type="file" 
                accept="video/*"
                onChange={(e) => {
                  if (e.target.files?.[0]) {
                    const reader = new FileReader();
                    reader.onload = (ev) => setRhVideo(ev.target?.result as string);
                    reader.readAsDataURL(e.target.files[0]);
                  }
                }}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
              <div className="space-y-2">
                <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
                  <VideoIcon size={24} />
                </div>
                <p className="text-sm font-bold text-gray-600">Haz clic para subir un vídeo de RH</p>
                <p className="text-xs text-gray-400">Formatos: MP4, WebM</p>
              </div>
            </div>
            {rhVideo && (
              <div className="flex justify-between items-center p-4 bg-green-50 rounded-2xl border-2 border-green-100">
                <span className="text-sm font-bold text-green-800">Vídeo cargado correctamente</span>
                <button 
                  onClick={() => setRhVideo(null)} 
                  className="text-red-500 p-2 hover:bg-red-50 rounded-xl transition-colors"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            )}
          </section>

          {/* Videos Corporativos */}
          <section className="space-y-4">
            <h3 className="text-lg font-black text-gray-900 flex items-center gap-2">
              <span className="w-8 h-8 bg-gray-900 text-white rounded-lg flex items-center justify-center text-sm">4</span>
              Videos Corporativos
            </h3>
            
            <form onSubmit={handleAddVideo} className="space-y-3 bg-gray-50 p-4 rounded-2xl border-2 border-gray-100">
              <input 
                className="w-full px-4 py-2 rounded-xl border border-gray-200 outline-none focus:border-blue-500"
                placeholder="Título del vídeo"
                value={newVideo.title}
                onChange={e => setNewVideo({...newVideo, title: e.target.value})}
              />
              <textarea 
                className="w-full px-4 py-2 rounded-xl border border-gray-200 outline-none focus:border-blue-500 h-20 resize-none"
                placeholder="Descripción del vídeo"
                value={newVideo.description}
                onChange={e => setNewVideo({...newVideo, description: e.target.value})}
              />
              <div className="flex gap-2">
                <button 
                  type="button"
                  onClick={() => setNewVideo({...newVideo, type: 'youtube'})}
                  className={`flex-1 py-1 rounded-lg text-xs font-bold transition-all ${newVideo.type === 'youtube' ? 'bg-red-600 text-white' : 'bg-gray-100 text-gray-500'}`}
                >
                  YouTube
                </button>
                <button 
                  type="button"
                  onClick={() => setNewVideo({...newVideo, type: 'local'})}
                  className={`flex-1 py-1 rounded-lg text-xs font-bold transition-all ${newVideo.type === 'local' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-500'}`}
                >
                  Local
                </button>
              </div>
              {newVideo.type === 'youtube' ? (
                <input 
                  className="w-full px-4 py-2 rounded-xl border border-gray-200 outline-none focus:border-blue-500"
                  placeholder="URL de YouTube"
                  value={newVideo.url}
                  onChange={e => setNewVideo({...newVideo, url: e.target.value})}
                />
              ) : (
                <div className="relative">
                  <input 
                    type="file"
                    accept="video/*"
                    className="w-full text-xs text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    onChange={(e) => {
                      if (e.target.files?.[0]) {
                        const reader = new FileReader();
                        reader.onload = (ev) => setNewVideo({...newVideo, url: ev.target?.result as string});
                        reader.readAsDataURL(e.target.files[0]);
                      }
                    }}
                  />
                </div>
              )}
              <button 
                type="submit"
                className="w-full py-2 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-colors"
              >
                Agregar Vídeo
              </button>
            </form>

            <div className="space-y-3">
              {videos.map(v => (
                <div key={v.id} className="flex justify-between items-center p-4 bg-gray-50 rounded-2xl border-2 border-gray-100 group hover:border-blue-200 transition-colors">
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-gray-800 truncate max-w-[250px]">{v.title}</span>
                    <span className="text-[10px] text-gray-400 uppercase font-black">{v.type}</span>
                  </div>
                  <button 
                    onClick={() => deleteVideo(v.id.toString())} 
                    className="text-red-500 p-2 hover:bg-red-50 rounded-xl transition-colors"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              ))}
            </div>
          </section>

          {/* Hero BGs */}
          <section className="space-y-4">
            <h3 className="text-lg font-black text-gray-900 flex items-center gap-2">
              <span className="w-8 h-8 bg-gray-900 text-white rounded-lg flex items-center justify-center text-sm">5</span>
              Imágenes de Bienvenida Dinámicas (Máx 10)
            </h3>
            
            <div className="grid grid-cols-2 gap-4">
              {heroBgs.map((bg, idx) => (
                <div key={idx} className="relative aspect-video rounded-2xl overflow-hidden border-2 border-gray-100 group">
                  <img src={bg} className="w-full h-full object-cover" alt="" />
                  <button 
                    onClick={() => setHeroBgs(heroBgs.filter((_, i) => i !== idx))}
                    className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-xl opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
              
              {heroBgs.length < 10 && (
                <div className="p-4 border-2 border-dashed border-gray-200 rounded-2xl text-center hover:border-blue-400 transition-colors cursor-pointer relative group flex flex-col items-center justify-center aspect-video">
                  <input 
                    type="file" 
                    accept="image/*"
                    onChange={(e) => {
                      if (e.target.files?.[0]) {
                        const reader = new FileReader();
                        reader.onload = (ev) => setHeroBgs([...heroBgs, ev.target?.result as string]);
                        reader.readAsDataURL(e.target.files[0]);
                      }
                    }}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                  <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-2">
                    <Camera size={20} />
                  </div>
                  <p className="text-[10px] font-bold text-gray-500">Subir imagen</p>
                </div>
              )}
            </div>
          </section>

          {/* Fotos Fiesta */}
          <section className="space-y-4">
            <h3 className="text-lg font-black text-gray-900 flex items-center gap-2">
              <span className="w-8 h-8 bg-gray-900 text-white rounded-lg flex items-center justify-center text-sm">6</span>
              Fotos de la Fiesta
            </h3>
            <div className="flex gap-2 mb-4">
              <input 
                type="number"
                className="w-24 px-3 py-2 rounded-xl border-2 border-gray-100 outline-none focus:border-blue-500 font-bold"
                value={photoYear}
                onChange={e => setPhotoYear(e.target.value)}
                placeholder="Año"
              />
              <div className="flex-grow p-4 border-2 border-dashed border-gray-200 rounded-2xl text-center hover:border-blue-400 transition-colors cursor-pointer relative group flex items-center justify-center gap-2">
                <input 
                  type="file" 
                  accept="image/*"
                  multiple
                  onChange={handleBulkPhotos}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
                <Camera size={20} className="text-purple-600" />
                <span className="text-xs font-bold text-gray-600">Subir fotos para {photoYear}</span>
              </div>
            </div>

            <div className="grid grid-cols-4 gap-2 max-h-[400px] overflow-y-auto p-2 border rounded-2xl custom-scrollbar">
              {partyPhotos.map((photo, index) => (
                <div key={photo.id} className="relative group aspect-square rounded-lg overflow-hidden border border-gray-100 bg-gray-50">
                  <img src={photo.url} className="w-full h-full object-cover" alt="" />
                  
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2">
                    <div className="flex gap-1">
                      <button 
                        onClick={() => {
                          if (index > 0) {
                            const newPhotos = [...partyPhotos];
                            [newPhotos[index-1], newPhotos[index]] = [newPhotos[index], newPhotos[index-1]];
                            setPartyPhotos(newPhotos);
                          }
                        }}
                        className="p-1.5 bg-white text-gray-900 rounded-lg hover:bg-gray-200 transition-colors"
                        title="Mover arriba"
                      >
                        <ArrowUp size={14} />
                      </button>
                      <button 
                        onClick={() => {
                          if (index < partyPhotos.length - 1) {
                            const newPhotos = [...partyPhotos];
                            [newPhotos[index+1], newPhotos[index]] = [newPhotos[index], newPhotos[index+1]];
                            setPartyPhotos(newPhotos);
                          }
                        }}
                        className="p-1.5 bg-white text-gray-900 rounded-lg hover:bg-gray-200 transition-colors"
                        title="Mover abajo"
                      >
                        <ArrowDown size={14} />
                      </button>
                    </div>
                    <button 
                      onClick={() => deletePartyPhoto(photo.id.toString())}
                      className="p-1.5 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                      title="Eliminar"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>

                  <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-white text-[8px] font-black text-center py-1 backdrop-blur-sm">
                    {photo.year} • #{index + 1}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Boletín Quincenal (Por Empresa) */}
          <section className="space-y-4">
            <h3 className="text-lg font-black text-gray-900 flex items-center gap-2">
              <span className="w-8 h-8 bg-gray-900 text-white rounded-lg flex items-center justify-center text-sm">7</span>
              Boletín Quincenal (Por Empresa)
            </h3>
            
            <div className="flex gap-2 mb-4">
              {['SX', 'SO', 'PL'].map((comp) => (
                <button
                  key={comp}
                  onClick={() => setSelectedQuincenalCompany(comp as any)}
                  className={`flex-1 py-2 rounded-xl text-xs font-black transition-all ${
                    selectedQuincenalCompany === comp 
                      ? 'bg-blue-600 text-white shadow-lg' 
                      : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                  }`}
                >
                  {comp === 'SX' ? 'SIMEX' : comp === 'SO' ? 'SOINCO' : 'PLASTINOVO'}
                </button>
              ))}
            </div>

            <div className="p-6 border-2 border-dashed border-gray-200 rounded-3xl text-center hover:border-blue-400 transition-colors cursor-pointer relative group">
              <input 
                type="file" 
                accept="image/*,application/pdf"
                multiple
                onChange={handleQuincenalUpload}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
              <div className="space-y-2">
                <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
                  <FileText size={24} />
                </div>
                <p className="text-sm font-bold text-gray-600">Subir Boletín Quincenal para {selectedQuincenalCompany}</p>
                <p className="text-xs text-gray-400">Imágenes o PDFs (Máx 30 archivos)</p>
              </div>
            </div>

            {bulletinQuincenal[selectedQuincenalCompany].length > 0 && (
              <div className="space-y-3">
                <div className="flex justify-between items-center p-4 bg-blue-50 rounded-2xl border-2 border-blue-100">
                  <span className="text-sm font-bold text-blue-800">{bulletinQuincenal[selectedQuincenalCompany].length} archivos cargados</span>
                  <button 
                    onClick={() => setBulletinQuincenal((prev: any) => ({ ...prev, [selectedQuincenalCompany]: [] }))} 
                    className="text-red-500 p-2 hover:bg-red-50 rounded-xl transition-colors"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
                <div className="grid grid-cols-5 gap-2 max-h-[150px] overflow-y-auto p-2 border rounded-xl custom-scrollbar">
                  {bulletinQuincenal[selectedQuincenalCompany].map((file: any, idx: number) => (
                    <div key={file.id} className="relative aspect-[3/4] rounded-lg overflow-hidden border bg-gray-100 flex items-center justify-center">
                      {file.type?.includes('pdf') || file.url?.startsWith('data:application/pdf') ? (
                        <div className="flex flex-col items-center gap-1 p-2">
                          <FileText size={24} className="text-red-500" />
                          <span className="text-[8px] font-bold text-gray-500 truncate w-full text-center">{file.name || 'PDF'}</span>
                        </div>
                      ) : (
                        <img src={file.url} className="w-full h-full object-cover" alt="" />
                      )}
                      <div className="absolute top-1 left-1 bg-black/50 text-white text-[8px] px-1 rounded">{idx + 1}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </section>

          {/* Boletín Mensual (Global) */}
          <section className="space-y-4">
            <h3 className="text-lg font-black text-gray-900 flex items-center gap-2">
              <span className="w-8 h-8 bg-gray-900 text-white rounded-lg flex items-center justify-center text-sm">8</span>
              Boletín Mensual (Todas las Empresas)
            </h3>
            
            <div className="p-6 border-2 border-dashed border-gray-200 rounded-3xl text-center hover:border-orange-400 transition-colors cursor-pointer relative group">
              <input 
                type="file" 
                accept="image/*,application/pdf"
                multiple
                onChange={handleMensualUpload}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
              <div className="space-y-2">
                <div className="w-12 h-12 bg-orange-50 text-orange-600 rounded-2xl flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
                  <FileText size={24} />
                </div>
                <p className="text-sm font-bold text-gray-600">Subir Boletín Mensual Global</p>
                <p className="text-xs text-gray-400">Imágenes o PDFs (Máx 30 archivos)</p>
              </div>
            </div>

            {bulletinMensual.length > 0 && (
              <div className="space-y-3">
                <div className="flex justify-between items-center p-4 bg-orange-50 rounded-2xl border-2 border-orange-100">
                  <span className="text-sm font-bold text-orange-800">{bulletinMensual.length} archivos cargados</span>
                  <button 
                    onClick={() => setBulletinMensual([])} 
                    className="text-red-500 p-2 hover:bg-red-50 rounded-xl transition-colors"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
                <div className="grid grid-cols-5 gap-2 max-h-[150px] overflow-y-auto p-2 border rounded-xl custom-scrollbar">
                  {bulletinMensual.map((file: any, idx: number) => (
                    <div key={file.id} className="relative aspect-[3/4] rounded-lg overflow-hidden border bg-gray-100 flex items-center justify-center">
                      {file.type?.includes('pdf') || file.url?.startsWith('data:application/pdf') ? (
                        <div className="flex flex-col items-center gap-1 p-2">
                          <FileText size={24} className="text-red-500" />
                          <span className="text-[8px] font-bold text-gray-500 truncate w-full text-center">{file.name || 'PDF'}</span>
                        </div>
                      ) : (
                        <img src={file.url} className="w-full h-full object-cover" alt="" />
                      )}
                      <div className="absolute top-1 left-1 bg-black/50 text-white text-[8px] px-1 rounded">{idx + 1}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </section>

          <div className="pt-6 border-t">
            <button 
              onClick={onLogout}
              className="w-full py-4 bg-red-50 text-red-600 rounded-2xl font-black flex items-center justify-center gap-3 hover:bg-red-100 transition-all"
            >
              <LogOut size={22} /> Cerrar Sesión de Administrador
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
