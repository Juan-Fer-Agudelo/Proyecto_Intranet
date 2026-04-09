import React, { useState } from 'react';
import { X, Trash2, LogOut, Camera, Eye, EyeOff, Video as VideoIcon } from 'lucide-react';
import { motion } from 'motion/react';
import { Announcement, Video, PartyPhoto } from '../types';

interface AdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogout: () => void;
  visitInfo: string;
  setVisitInfo: React.Dispatch<React.SetStateAction<string>>;
  announcements: Announcement[];
  deleteAnnouncement: (id: string) => void;
  toggleAnnouncement: (id: string, currentActive: boolean) => void;
  videos: Video[];
  deleteVideo: (id: string) => void;
  addVideo: (video: Omit<Video, 'id'>) => void;
  heroBgs: string[];
  setHeroBgs: React.Dispatch<React.SetStateAction<string[]>>;
  rhVideo: string | null;
  setRhVideo: (url: string | null) => void;
  partyPhotos: PartyPhoto[];
  addPartyPhoto: (url: string) => void;
  deletePartyPhoto: (id: string) => void;
  addAnnouncement: (ann: Omit<Announcement, 'id' | 'active'>) => void;
}

export const AdminModal: React.FC<AdminModalProps> = ({
  isOpen,
  onClose,
  onLogout,
  visitInfo,
  setVisitInfo,
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
  addPartyPhoto,
  deletePartyPhoto,
  addAnnouncement
}) => {
  const [newAnn, setNewAnn] = useState<{ title: string; content: string; image: string; company: 'SX' | 'SO' | 'PL' | 'Global' }>({ 
    title: '', 
    content: '', 
    image: '', 
    company: 'Global' 
  });
  const [newVideo, setNewVideo] = useState({ title: '', url: '' });

  if (!isOpen) return null;

  const handleAddAnn = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAnn.title || !newAnn.content) return;
    addAnnouncement(newAnn);
    setNewAnn({ title: '', content: '', image: '', company: 'Global' });
  };

  const handleAddVideo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newVideo.title || !newVideo.url) return;
    addVideo(newVideo);
    setNewVideo({ title: '', url: '' });
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
          <button 
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={28} className="text-gray-500" />
          </button>
        </div>
        
        <div className="space-y-10">
          <div className="bg-blue-50 p-5 rounded-2xl border-l-8 border-[var(--primary)] text-sm text-blue-900 font-semibold leading-relaxed">
            Bienvenido al centro de mando. Aquí puedes actualizar la información en tiempo real para todos los empleados.
          </div>

          {/* Visitas */}
          <section className="space-y-4">
            <h3 className="text-lg font-black text-gray-900 flex items-center gap-2">
              <span className="w-8 h-8 bg-gray-900 text-white rounded-lg flex items-center justify-center text-sm">1</span>
              Gestión de Visitas
            </h3>
            <div className="grid gap-3">
              <input 
                className="w-full px-5 py-3 rounded-xl border-2 border-gray-100 focus:border-blue-500 outline-none font-semibold"
                placeholder="Nombre de la entidad (ej: Bancolombia)"
                onBlur={(e) => setVisitInfo(prev => e.target.value ? `Hoy nos visita ${e.target.value} para ${prev.split(' para ')[1] || ''}` : prev)}
              />
              <textarea 
                className="w-full px-5 py-3 rounded-xl border-2 border-gray-100 focus:border-blue-500 outline-none font-semibold h-24 resize-none"
                placeholder="Tema de asesoría o motivo de la visita"
                onBlur={(e) => setVisitInfo(prev => e.target.value ? `${prev.split(' para ')[0]} para ${e.target.value}` : prev)}
              />
            </div>
          </section>

          {/* Anuncios */}
          <section className="space-y-4">
            <h3 className="text-lg font-black text-gray-900 flex items-center gap-2">
              <span className="w-8 h-8 bg-gray-900 text-white rounded-lg flex items-center justify-center text-sm">2</span>
              Anuncios Flotantes (Máx 5)
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
                disabled={announcements.length >= 5}
                className="w-full py-2 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-colors disabled:bg-gray-400"
              >
                {announcements.length >= 5 ? 'Límite alcanzado (5)' : 'Agregar Anuncio'}
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

          {/* Videos */}
          <section className="space-y-4">
            <h3 className="text-lg font-black text-gray-900 flex items-center gap-2">
              <span className="w-8 h-8 bg-gray-900 text-white rounded-lg flex items-center justify-center text-sm">3</span>
              Video RH (Archivo)
            </h3>
            <div className="p-6 border-2 border-dashed border-gray-200 rounded-3xl text-center hover:border-blue-400 transition-colors cursor-pointer relative group">
              <input 
                type="file" 
                accept="video/*"
                onChange={(e) => {
                  if (e.target.files?.[0]) {
                    const url = URL.createObjectURL(e.target.files[0]);
                    setRhVideo(url);
                  }
                }}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
              <div className="space-y-2">
                <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
                  <VideoIcon size={24} />
                </div>
                <p className="text-sm font-bold text-gray-600">Haz clic para subir un video de RH</p>
                <p className="text-xs text-gray-400">Formatos: MP4, WebM</p>
              </div>
            </div>
            {rhVideo && (
              <div className="flex justify-between items-center p-4 bg-green-50 rounded-2xl border-2 border-green-100">
                <span className="text-sm font-bold text-green-800">Video cargado correctamente</span>
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
              Videos Corporativos (YouTube)
            </h3>
            
            <form onSubmit={handleAddVideo} className="space-y-3 bg-gray-50 p-4 rounded-2xl border-2 border-gray-100">
              <input 
                className="w-full px-4 py-2 rounded-xl border border-gray-200 outline-none focus:border-blue-500"
                placeholder="Título del video"
                value={newVideo.title}
                onChange={e => setNewVideo({...newVideo, title: e.target.value})}
              />
              <input 
                className="w-full px-4 py-2 rounded-xl border border-gray-200 outline-none focus:border-blue-500"
                placeholder="URL del video (YouTube/Vimeo)"
                value={newVideo.url}
                onChange={e => setNewVideo({...newVideo, url: e.target.value})}
              />
              <button 
                type="submit"
                className="w-full py-2 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-colors"
              >
                Agregar Video
              </button>
            </form>

            <div className="space-y-3">
              {videos.map(v => (
                <div key={v.id} className="flex justify-between items-center p-4 bg-gray-50 rounded-2xl border-2 border-gray-100 group hover:border-blue-200 transition-colors">
                  <span className="text-sm font-bold text-gray-800 truncate max-w-[250px]">{v.title}</span>
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
              Imágenes de Bienvenida Dinámicas (Máx 4)
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
              
              {heroBgs.length < 4 && (
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
              Fotos Fiesta 2025
            </h3>
            <div className="p-6 border-2 border-dashed border-gray-200 rounded-3xl text-center hover:border-blue-400 transition-colors cursor-pointer relative group">
              <input 
                type="file" 
                accept="image/*"
                multiple
                onChange={(e) => {
                  if (e.target.files) {
                    Array.from(e.target.files).forEach((file) => {
                      const reader = new FileReader();
                      reader.onload = (ev) => addPartyPhoto(ev.target?.result as string);
                      reader.readAsDataURL(file as File);
                    });
                  }
                }}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
              <div className="space-y-2">
                <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
                  <Camera size={24} />
                </div>
                <p className="text-sm font-bold text-gray-600">Haz clic para subir fotos de la fiesta</p>
                <p className="text-xs text-gray-400">Puedes seleccionar varias imágenes</p>
              </div>
            </div>

            <div className="grid grid-cols-4 gap-2">
              {partyPhotos.map(photo => (
                <div key={photo.id} className="relative group aspect-square rounded-lg overflow-hidden border border-gray-100">
                  <img src={photo.url} className="w-full h-full object-cover" alt="" />
                  <button 
                    onClick={() => deletePartyPhoto(photo.id.toString())}
                    className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-md opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              ))}
            </div>
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
