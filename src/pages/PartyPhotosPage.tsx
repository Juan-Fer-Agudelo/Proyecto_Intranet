// Importaciones de React y librerías necesarias
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
// Iconos de Lucide React para acciones y navegación
import { Image as ImageIcon, Search, Filter, ArrowLeft, ArrowRight, Download, ZoomIn, X, RefreshCw } from 'lucide-react';
// Interfaz de datos para las fotos
import { PartyPhoto } from '../types';

/**
 * PartyPhotosPage: Galería de fotos corporativas.
 * Permite visualizar recuerdos de eventos organizados por años, con un visor (lightbox) integrado.
 */
export default function PartyPhotosPage() {
  const navigate = useNavigate();
  
  // Estados para datos y UI
  const [photos, setPhotos] = useState<PartyPhoto[]>([]); // Almacena todas las fotos del API
  const [isLoading, setIsLoading] = useState(true); // Controla el estado de carga inicial
  const [selectedYear, setSelectedYear] = useState<string>('Todos'); // Filtro por año del evento
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState<number | null>(null); // Índice de la foto abierta en zoom

  /**
   * Carga los datos de las fotos desde el endpoint central de datos.
   */
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/data');
        const data = await response.json();
        setPhotos(data.partyPhotos || []);
      } catch (error) {
        console.error('Error fetching photos:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  /**
   * useMemo para extraer y ordenar los años disponibles en la galería.
   */
  const years = ['Todos', ...Array.from(new Set(photos.map(p => p.year || 'Sin fecha'))).sort((a, b) => String(b).localeCompare(String(a)))];

  /**
   * photos.filter: Filtra la colección de fotos según el año seleccionado por el usuario.
   */
  const filteredPhotos = photos.filter(photo => {
    const matchesYear = selectedYear === 'Todos' || photo.year === selectedYear;
    return matchesYear;
  });

  /**
   * Funciones de navegación para el visor de fotos (Lightbox).
   */
  const nextPhoto = (e?: React.MouseEvent) => {
    e?.stopPropagation(); // Evita cerrar el visor al hacer clic en el botón
    if (selectedPhotoIndex !== null) {
      setSelectedPhotoIndex((selectedPhotoIndex + 1) % filteredPhotos.length);
    }
  };

  const prevPhoto = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (selectedPhotoIndex !== null) {
      setSelectedPhotoIndex((selectedPhotoIndex - 1 + filteredPhotos.length) % filteredPhotos.length);
    }
  };

  /**
   * Manejador de eventos de teclado para navegación fluida con flechas y tecla Escape.
   */
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedPhotoIndex === null) return;
      if (e.key === 'ArrowRight') nextPhoto();
      if (e.key === 'ArrowLeft') prevPhoto();
      if (e.key === 'Escape') setSelectedPhotoIndex(null);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedPhotoIndex, filteredPhotos.length]);

  // Pantalla de carga con estilo corporativo
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
        <div className="p-8 rounded-[2.5rem] bg-white shadow-2xl flex flex-col items-center gap-6">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-blue-600/20 border-t-blue-600 rounded-full animate-spin"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <RefreshCw size={24} className="text-blue-600/50" />
            </div>
          </div>
          <div className="text-center">
            <p className="text-xl font-black text-slate-800 tracking-tight">Cargando Galería</p>
            <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mt-1">Recuerdos Corporativos</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* HEADER CORPORATIVO (Identidad Unificada con el Directorio) */}
      <header className="sticky top-0 z-50 bg-[#1B4969] text-white px-6 py-6 shadow-2xl">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-5">
            <button 
              onClick={() => navigate(-1)}
              className="p-3 bg-white/10 hover:bg-white/20 rounded-2xl transition-all group"
              title="Volver"
            >
              <ArrowLeft size={24} className="group-hover:-translate-x-1 transition-transform" />
            </button>
            <div className="h-10 w-px bg-white/10" />
            <div>
              <h1 className="text-2xl md:text-3xl font-black tracking-tighter leading-none">Galería de la Fiesta</h1>
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-200/60 mt-1">Recuerdos Corporativos</p>
            </div>
          </div>
        </div>
      </header>

      {/* BARRA DE FILTROS POR AÑO */}
      <div className="bg-white border-b border-slate-200 py-4 px-6 sticky top-[92px] md:top-[100px] z-40 text-neutral-900">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-4 justify-between items-center">
          <div className="flex flex-wrap gap-4 items-center w-full md:w-auto">
            <div className="flex items-center gap-2 text-slate-400 font-black text-[10px] uppercase tracking-widest whitespace-nowrap">
              <Filter size={14} />
              <span>Filtrar por:</span>
            </div>

            <div className="flex gap-2">
              <select 
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className="px-4 py-2 bg-slate-100 border-none rounded-xl text-xs font-black text-slate-600 outline-none focus:ring-2 focus:ring-blue-500 transition-all cursor-pointer"
              >
                {years.map(year => (
                  <option key={year} value={year}>Año: {year}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="whitespace-nowrap">
            <span className="text-xs font-bold text-slate-400">
              Mostrando <span className="text-blue-600 font-black">{filteredPhotos.length}</span> registros de recuerdos
            </span>
          </div>
        </div>
      </div>

      {/* GRID DE FOTOS: Cuadrícula responsive adaptable */}
      <main className="flex-grow p-6 md:p-10">
        <div className="max-w-7xl mx-auto">
          {filteredPhotos.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              <AnimatePresence mode="popLayout">
                {filteredPhotos.map((photo, idx) => (
                  <motion.div
                    key={photo.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.3, delay: idx * 0.05 }}
                    className="group relative aspect-square bg-white rounded-[2rem] overflow-hidden shadow-md hover:shadow-2xl transition-all duration-500 cursor-zoom-in border border-slate-100"
                    onClick={() => setSelectedPhotoIndex(idx)}
                  >
                    <img 
                      src={photo.url} 
                      alt={`Fiesta ${photo.year}`} 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      referrerPolicy="no-referrer"
                    />
                    {/* Overlay al pasar el mouse por encima */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                      <div className="flex justify-between items-end">
                        <div>
                          <span className="text-[10px] font-black text-white/70 uppercase tracking-widest">Año</span>
                          <p className="text-lg font-black text-white">{photo.year || 'Sin fecha'}</p>
                        </div>
                        <div className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white">
                          <ZoomIn size={20} />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          ) : (
            /* Estado cuando no hay fotos para el filtro seleccionado */
            <div className="flex flex-col items-center justify-center py-32 text-center space-y-6">
              <div className="w-24 h-24 bg-white shadow-xl rounded-[2rem] flex items-center justify-center text-slate-200">
                <ImageIcon size={48} />
              </div>
              <div>
                <h3 className="text-2xl font-black text-slate-800">No se encontraron fotos</h3>
                <p className="text-slate-500 mt-2">Intenta cambiar el filtro de año para ver más recuerdos.</p>
              </div>
              <button 
                onClick={() => setSelectedYear('Todos')}
                className="px-6 py-3 bg-blue-600 text-white rounded-2xl font-black shadow-lg hover:shadow-blue-200 transition-all font-sans"
              >
                Ver todas las fotos
              </button>
            </div>
          )}
        </div>
      </main>

      {/* VISOR DE FOTOS (LIGHTBOX): Pantalla completa */}
      <AnimatePresence>
        {selectedPhotoIndex !== null && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-10">
            {/* Fondo oscuro con desenfoque */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/95 backdrop-blur-md"
              onClick={() => setSelectedPhotoIndex(null)}
            />
            
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative w-full max-w-5xl max-h-[85vh] z-10 flex flex-col items-center"
            >
              {/* Botón de cierre */}
              <button 
                onClick={() => setSelectedPhotoIndex(null)}
                className="absolute -top-16 right-0 p-3 bg-white/10 hover:bg-white/30 text-white rounded-full transition-all z-20"
              >
                <X size={28} />
              </button>

              {/* Controles de navegación laterales (solo en Desktop) */}
              <div className="absolute inset-y-0 -left-16 -right-16 hidden md:flex items-center justify-between pointer-events-none">
                <button 
                  onClick={prevPhoto}
                  className="p-4 bg-white/10 hover:bg-white/20 text-white rounded-full transition-all pointer-events-auto backdrop-blur-md border border-white/10"
                >
                  <ArrowLeft size={32} />
                </button>
                <button 
                  onClick={nextPhoto}
                  className="p-4 bg-white/10 hover:bg-white/20 text-white rounded-full transition-all pointer-events-auto backdrop-blur-md border border-white/10"
                >
                  <ArrowRight size={32} />
                </button>
              </div>

              {/* Imagen central */}
              <div className="w-full h-full overflow-hidden rounded-3xl shadow-2xl border-2 border-white/10 bg-black/50 flex items-center justify-center relative">
                <AnimatePresence mode="wait">
                  <motion.img 
                    key={filteredPhotos[selectedPhotoIndex].url}
                    src={filteredPhotos[selectedPhotoIndex].url} 
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="w-full h-full object-contain"
                    alt="Zoom"
                    referrerPolicy="no-referrer"
                  />
                </AnimatePresence>
                
                {/* Contador de fotos en móvil */}
                <div className="absolute top-4 right-4 bg-black/50 px-3 py-1 rounded-full text-[10px] font-bold text-white uppercase tracking-widest md:hidden">
                  {selectedPhotoIndex + 1} / {filteredPhotos.length}
                </div>
              </div>

              {/* Botón de descarga y controles móviles */}
              <div className="flex items-center gap-4 mt-8">
                <button 
                  onClick={prevPhoto}
                  className="md:hidden p-3 bg-white/10 text-white rounded-full"
                >
                  <ArrowLeft size={20} />
                </button>

                <button 
                  onClick={() => window.open(filteredPhotos[selectedPhotoIndex].url, '_blank')}
                  className="px-8 py-4 bg-white text-black rounded-2xl font-black flex items-center gap-2 hover:bg-slate-100 hover:scale-105 active:scale-95 transition-all shadow-xl font-sans"
                >
                  <Download size={20} /> 
                  <span className="hidden md:inline">Descargar Foto Original</span>
                  <span className="md:hidden">Descargar</span>
                </button>

                <button 
                  onClick={nextPhoto}
                  className="md:hidden p-3 bg-white/10 text-white rounded-full"
                >
                  <ArrowRight size={20} />
                </button>
              </div>

              <div className="mt-4 text-center">
                <p className="text-white/40 text-xs font-black uppercase tracking-[0.3em]">
                  {filteredPhotos[selectedPhotoIndex].year || 'Recuerdo Sin Fecha'} • {selectedPhotoIndex + 1} de {filteredPhotos.length}
                </p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* FOOTER CORPORATIVO */}
      <footer className="bg-white border-t border-slate-100 py-10 px-6 text-center">
        <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.4em]">Intranet Corporativa • Galería de Recuerdos Integrada</p>
      </footer>
    </div>
  );
}

