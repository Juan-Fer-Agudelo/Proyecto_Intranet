import React from 'react';
import { X, FileText } from 'lucide-react';
import { motion, AnimatePresence, useScroll, useTransform } from 'motion/react';
import { Announcement, CompanyCode } from '../types';

interface AnnouncementsProps {
  announcements: Announcement[];
  setAnnouncements: React.Dispatch<React.SetStateAction<Announcement[]>>;
  currentCompany: CompanyCode;
}

const CarouselCard: React.FC<{ ann: Announcement; onClick: () => void; position: number }> = ({ ann, onClick, position }) => {
  // Calculamos escala, opacidad y posición 3D basada en la posición relativa al centro (0)
  const isCenter = position === 0;
  const isSide = Math.abs(position) === 1;
  const isFar = Math.abs(position) > 1;

  const scale = isCenter ? 1 : isSide ? 0.75 : 0.55;
  const opacity = isCenter ? 1 : isSide ? 0.5 : 0.2;
  const zIndex = 100 - Math.abs(position) * 10;
  const xOffset = position * (window.innerWidth < 768 ? 130 : 200);
  const rotateY = position * -35; 

  return (
    <motion.div 
      initial={false}
      animate={{ 
        scale, 
        opacity, 
        x: xOffset,
        zIndex,
        rotateY,
        filter: isCenter ? 'blur(0px)' : 'blur(2px)'
      }}
      transition={{ type: "spring", stiffness: 200, damping: 25 }}
      whileHover={{ scale: isCenter ? 1.25 : scale * 1.2, y: -20, zIndex: 200 }}
      onClick={isCenter ? onClick : undefined}
      className={`absolute w-[140px] md:w-[180px] h-[160px] md:h-[200px] bg-white rounded-[24px] md:rounded-[32px] shadow-2xl overflow-hidden cursor-pointer border-2 transition-shadow duration-300 pointer-events-auto ${
        ann.isPriority ? 'border-orange-500 shadow-orange-500/30' : 'border-gray-100 shadow-black/10'
      }`}
      style={{ perspective: "1000px" }}
    >
      {ann.isPriority && isCenter && (
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: [1, 1.1, 1], opacity: 1 }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute top-3 left-3 z-10 px-2 py-0.5 bg-orange-600 text-white text-[8px] font-black uppercase tracking-widest rounded-full shadow-lg border border-orange-400"
        >
          Prioridad
        </motion.div>
      )}
      <div className="h-28 md:h-36 overflow-hidden bg-gray-50/50">
        {ann.image ? (
          ann.image.startsWith('data:application/pdf') || ann.image.toLowerCase().endsWith('.pdf') ? (
            <div className="w-full h-full flex flex-col items-center justify-center bg-red-50 gap-2">
              <FileText className="text-red-500" size={32} />
              <span className="text-[10px] font-black text-red-600 uppercase tracking-widest">PDF</span>
            </div>
          ) : (
            <img src={ann.image} alt="" className="w-full h-full object-cover" />
          )
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
            <span className="text-blue-600 font-extrabold text-3xl">!</span>
          </div>
        )}
      </div>
      <div className="p-4 md:p-6 flex flex-col justify-between h-[calc(100%-7rem)] md:h-[calc(100%-9rem)] bg-white">
        <div>
          <h4 className="font-black text-gray-900 text-[10px] md:text-sm mb-1 line-clamp-2 leading-tight uppercase tracking-tight">
            {ann.title}
          </h4>
          <p className="text-gray-500 text-[9px] md:text-[11px] line-clamp-2 leading-tight opacity-80">
            {ann.content}
          </p>
        </div>
        {isCenter && (
          <div className="flex items-center gap-1.5 mt-2 overflow-hidden">
            <div className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse"></div>
            <span className="text-[8px] font-black text-blue-600 uppercase tracking-widest">Abrir Noticia</span>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export const Announcements: React.FC<AnnouncementsProps> = ({ announcements, currentCompany }) => {
  const [expandedId, setExpandedId] = React.useState<string | number | null>(null);
  const [activeIndex, setActiveIndex] = React.useState(0);
  const [isPaused, setIsPaused] = React.useState(false);
  const [initialFocusDone, setInitialFocusDone] = React.useState(false);

  const activeAnnouncements = announcements
    .filter(a => {
      const isCompanyMatch = a.company === currentCompany || a.company === 'Global';
      if (!a.active || !isCompanyMatch) return false;
      const now = new Date();
      const start = a.startDate ? new Date(a.startDate) : null;
      const end = a.endDate ? new Date(a.endDate) : null;
      if (start && now < start) return false;
      if (end && now > end) return false;
      return true;
    });

  const handleDragEnd = (_: any, info: any) => {
    if (activeAnnouncements.length <= 1) return;
    const threshold = 50;
    if (info.offset.x < -threshold) {
      setActiveIndex((prev) => (prev + 1) % activeAnnouncements.length);
    } else if (info.offset.x > threshold) {
      setActiveIndex((prev) => (prev - 1 + activeAnnouncements.length) % activeAnnouncements.length);
    }
  };

  // Al cargar, buscar la primera noticia con prioridad y ponerla en el centro
  React.useEffect(() => {
    if (!initialFocusDone && activeAnnouncements.length > 0) {
      const priorityIndex = activeAnnouncements.findIndex(a => a.isPriority);
      if (priorityIndex !== -1) {
        setActiveIndex(priorityIndex);
      }
      setInitialFocusDone(true);
    }
  }, [activeAnnouncements, initialFocusDone]);

  // Auto-play interval
  React.useEffect(() => {
    if (activeAnnouncements.length <= 1 || isPaused || expandedId) return;

    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % activeAnnouncements.length);
    }, 4500);

    return () => clearInterval(interval);
  }, [activeAnnouncements.length, isPaused, expandedId]);

  const isAnyExpanded = expandedId !== null;

  // Calculamos la posición visual de cada tarjeta para el loop infinito
  const getRelativePosition = (itemIndex: number) => {
    const total = activeAnnouncements.length;
    let position = itemIndex - activeIndex;

    // Manejo de loop infinito suave
    if (position > total / 2) position -= total;
    if (position < -total / 2) position += total;

    return position;
  };

  return (
    <>
      <AnimatePresence>
        {isAnyExpanded && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setExpandedId(null)}
            className="fixed inset-0 bg-black/80 backdrop-blur-xl z-[1400] pointer-events-auto"
          />
        )}
      </AnimatePresence>

      <div 
        className={`fixed inset-x-0 bottom-4 md:bottom-12 pointer-events-none transition-all duration-700 ${isAnyExpanded ? 'top-20 md:top-24 flex items-start justify-center p-4 md:p-8 z-[1400]' : 'z-[1450] h-[350px] md:h-[400px]'}`}
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        {!isAnyExpanded ? (
          <motion.div 
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            onDragEnd={handleDragEnd}
            className="w-full relative h-full flex flex-col items-center justify-center cursor-grab active:cursor-grabbing pointer-events-auto"
          >
             <div className="absolute top-0 left-12 z-20">
                <span className="px-3 py-1 bg-white/20 backdrop-blur-md text-white text-[8px] font-black uppercase tracking-[0.2em] rounded-full border border-white/20">
                   Noticias Globales
                </span>
             </div>
             
             <div className="relative w-full h-full flex items-center justify-center overflow-visible">
                {activeAnnouncements.map((ann, index) => (
                    <CarouselCard 
                      key={ann.id} 
                      ann={ann} 
                      position={getRelativePosition(index)} 
                      onClick={() => setExpandedId(ann.id)} 
                    />
                ))}
             </div>

             {/* Controles rápidos / Indicadores */}
             <div className="absolute bottom-4 flex gap-2 z-30 pointer-events-auto">
                {activeAnnouncements.map((_, idx) => (
                  <button 
                    key={idx}
                    onClick={() => setActiveIndex(idx)}
                    className={`w-6 h-1 rounded-full transition-all duration-300 ${activeIndex === idx ? 'bg-white w-10' : 'bg-white/20'}`}
                  />
                ))}
             </div>
          </motion.div>
        ) : (
          <div className="flex justify-center w-full max-w-7xl mx-auto pointer-events-auto h-full items-start pt-4">
            {activeAnnouncements.filter(ann => ann.id === expandedId).map(ann => (
              <motion.div 
                key={`expanded-${ann.id}`}
                layoutId={`ann-${ann.id}`}
                initial={{ opacity: 0, scale: 0.9, y: 40 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 40 }}
                className={`w-full ${ann.isPriority ? 'max-w-[950px]' : 'max-w-[700px]'} max-h-[85vh] bg-white rounded-[40px] md:rounded-[56px] shadow-[0_60px_150px_rgba(0,0,0,0.7)] flex flex-col overflow-y-auto no-scrollbar border border-gray-100 relative group`}
              >
                <div className="shrink-0 min-h-[300px] md:min-h-[500px] relative overflow-hidden bg-gray-50">
                  {ann.isPriority && (
                    <div className="absolute top-8 left-8 z-10 px-5 py-2 bg-orange-600 text-white text-xs md:text-sm font-black uppercase tracking-[0.2em] rounded-full shadow-2xl border border-orange-400 flex items-center gap-3">
                       <motion.div 
                        animate={{ scale: [1, 1.5, 1], opacity: [1, 0.5, 1] }} 
                        transition={{ duration: 1.5, repeat: Infinity }}
                        className="w-2.5 h-2.5 bg-white rounded-full" 
                       />
                       Importante / Prioridad
                    </div>
                  )}
                  {ann.image ? (
                    ann.image.startsWith('data:application/pdf') || ann.image.toLowerCase().endsWith('.pdf') ? (
                      <div className="w-full h-[500px] flex flex-col">
                         <div className="bg-white p-6 border-b flex justify-between items-center">
                            <div className="flex items-center gap-4">
                              <FileText className="text-red-500" size={32} />
                              <span className="text-sm font-black text-gray-900 uppercase tracking-widest">Documento Oficial</span>
                            </div>
                            <button 
                              onClick={() => {
                                const link = document.createElement('a');
                                link.href = ann.image!;
                                link.download = 'anuncio.pdf';
                                link.click();
                              }}
                              className="px-6 py-2.5 bg-gray-900 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-black transition-all shadow-xl"
                            >
                              Descargar PDF
                            </button>
                         </div>
                         <iframe 
                           src={`${ann.image}#toolbar=0&navpanes=0&scrollbar=0`}
                           className="w-full flex-grow border-none bg-white"
                           title="Documento PDF"
                         />
                      </div>
                    ) : (
                      <div className="w-full flex justify-center items-center bg-gray-100/50">
                        <motion.img 
                          initial={{ scale: 1.05, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          src={ann.image} 
                          alt="" 
                          className="w-full h-auto max-h-[70vh] object-contain shadow-sm" 
                        />
                      </div>
                    )
                  ) : (
                    <div className="w-full h-[300px] md:h-[400px] bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center">
                      <div className="w-32 h-32 rounded-full bg-white/5 border border-white/10 flex items-center justify-center backdrop-blur-3xl">
                        <span className="text-white font-black text-6xl">!</span>
                      </div>
                    </div>
                  )}
                  <button 
                    onClick={() => setExpandedId(null)}
                    className="absolute top-8 right-8 p-4 bg-white/40 hover:bg-white backdrop-blur-2xl rounded-3xl text-gray-900 shadow-2xl transition-all hover:rotate-90 group-hover:scale-110"
                  >
                    <X size={28} />
                  </button>
                </div>
                <div className="p-10 md:p-20 bg-white">
                  <div className="flex items-center gap-4 mb-6">
                    <span className="px-4 py-1.5 bg-blue-600 text-[10px] font-black text-white rounded-full uppercase tracking-[0.2em] shadow-lg shadow-blue-600/20">
                      {ann.company === 'Global' ? 'Corporativo' : ann.company}
                    </span>
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">Comunicado Simex</span>
                  </div>
                  <h4 className="font-black text-gray-900 text-3xl md:text-5xl mb-8 leading-tight tracking-tighter">
                    {ann.title}
                  </h4>
                  <div className="text-gray-700 text-lg md:text-xl leading-relaxed whitespace-pre-wrap font-medium opacity-90">
                    {ann.content}
                  </div>
                </div>
                <div className="sticky bottom-0 p-10 md:p-12 pt-0 bg-gradient-to-t from-white via-white/80 to-transparent flex justify-end">
                  <button 
                    onClick={() => setExpandedId(null)}
                    className="px-10 py-4 bg-gray-900 text-white rounded-xl font-black text-xs uppercase tracking-[0.3em] shadow-2xl hover:bg-black transition-all hover:scale-105 active:scale-95"
                  >
                    Cerrar Detalle
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};
