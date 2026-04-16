import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Image as ImageIcon, Search, Filter, ArrowLeft, ArrowRight, Download, ZoomIn, X } from 'lucide-react';
import { PartyPhoto } from '../types';

export default function PartyPhotosPage() {
  const [photos, setPhotos] = useState<PartyPhoto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedYear, setSelectedYear] = useState<string>('Todos');
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState<number | null>(null);

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

  const years = ['Todos', ...Array.from(new Set(photos.map(p => p.year || 'Sin fecha'))).sort((a, b) => String(b).localeCompare(String(a)))];

  const filteredPhotos = photos.filter(photo => {
    const matchesYear = selectedYear === 'Todos' || photo.year === selectedYear;
    return matchesYear;
  });

  const nextPhoto = (e?: React.MouseEvent) => {
    e?.stopPropagation();
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

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-500 font-bold animate-pulse">Cargando galería...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200 px-6 py-4 shadow-sm">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => window.location.href = '/'}
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-sm font-bold transition-all group"
            >
              <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
              <span>Volver al Inicio</span>
            </button>
            <div className="h-8 w-px bg-gray-200 mx-2 hidden md:block" />
            <div>
              <h1 className="text-2xl font-black text-gray-900 tracking-tight">Galería de la Fiesta</h1>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Recuerdos Corporativos</p>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="relative flex-grow md:w-48">
              <Filter size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <select 
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-100 border-none rounded-xl text-sm font-bold text-gray-700 outline-none focus:ring-2 focus:ring-purple-500 transition-all appearance-none"
              >
                {years.map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
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
                    className="group relative aspect-square bg-white rounded-[2rem] overflow-hidden shadow-md hover:shadow-2xl transition-all duration-500 cursor-zoom-in border border-gray-100"
                    onClick={() => setSelectedPhotoIndex(idx)}
                  >
                    <img 
                      src={photo.url} 
                      alt={`Fiesta ${photo.year}`} 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
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
            <div className="flex flex-col items-center justify-center py-32 text-center space-y-6">
              <div className="w-24 h-24 bg-white shadow-xl rounded-[2rem] flex items-center justify-center text-gray-200">
                <ImageIcon size={48} />
              </div>
              <div>
                <h3 className="text-2xl font-black text-gray-800">No se encontraron fotos</h3>
                <p className="text-gray-500 mt-2">Intenta cambiar el filtro de año para ver más recuerdos.</p>
              </div>
              <button 
                onClick={() => setSelectedYear('Todos')}
                className="px-6 py-3 bg-purple-600 text-white rounded-2xl font-black shadow-lg hover:shadow-purple-200 transition-all"
              >
                Ver todas las fotos
              </button>
            </div>
          )}
        </div>
      </main>

      {/* Lightbox Overlay */}
      <AnimatePresence>
        {selectedPhotoIndex !== null && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-10">
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
              {/* Close Button */}
              <button 
                onClick={() => setSelectedPhotoIndex(null)}
                className="absolute -top-16 right-0 p-3 bg-white/10 hover:bg-white/30 text-white rounded-full transition-all z-20"
              >
                <X size={28} />
              </button>

              {/* Navigation Arrows */}
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

              {/* Image Container */}
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
                  />
                </AnimatePresence>
                
                {/* Mobile Navigation info */}
                <div className="absolute top-4 right-4 bg-black/50 px-3 py-1 rounded-full text-[10px] font-bold text-white uppercase tracking-widest md:hidden">
                  {selectedPhotoIndex + 1} / {filteredPhotos.length}
                </div>
              </div>

              <div className="flex items-center gap-4 mt-8">
                <button 
                  onClick={prevPhoto}
                  className="md:hidden p-3 bg-white/10 text-white rounded-full"
                >
                  <ArrowLeft size={20} />
                </button>

                <button 
                  onClick={() => window.open(filteredPhotos[selectedPhotoIndex].url, '_blank')}
                  className="px-8 py-4 bg-white text-black rounded-2xl font-black flex items-center gap-2 hover:bg-gray-100 hover:scale-105 active:scale-95 transition-all shadow-xl"
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

      {/* Footer */}
      <footer className="bg-white border-t border-gray-100 py-8 px-6 text-center">
        <p className="text-xs font-bold text-gray-400 uppercase tracking-[0.2em]">Intranet Corporativa • Galería de Recuerdos</p>
      </footer>
    </div>
  );
}

