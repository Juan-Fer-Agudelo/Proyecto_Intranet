import React from 'react';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Announcement, CompanyCode } from '../types';

interface AnnouncementsProps {
  announcements: Announcement[];
  setAnnouncements: React.Dispatch<React.SetStateAction<Announcement[]>>;
  currentCompany: CompanyCode;
}

export const Announcements: React.FC<AnnouncementsProps> = ({ announcements, setAnnouncements, currentCompany }) => {
  const [expandedId, setExpandedId] = React.useState<string | number | null>(null);
  const [isPaused, setIsPaused] = React.useState(false);
  const [hasShownPriority, setHasShownPriority] = React.useState(false);
  const containerRef = React.useRef<HTMLDivElement>(null);

  const now = new Date();
  const activeAnnouncements = announcements
    .filter(a => {
      const isCompanyMatch = a.company === currentCompany || a.company === 'Global';
      if (!a.active || !isCompanyMatch) return false;
      
      const start = a.startDate ? new Date(a.startDate) : null;
      const end = a.endDate ? new Date(a.endDate) : null;
      
      if (start && now < start) return false;
      if (end && now > end) return false;
      
      return true;
    });

  // Auto-show priority announcement on load
  React.useEffect(() => {
    if (!hasShownPriority && activeAnnouncements.length > 0) {
      const priority = activeAnnouncements.find(a => a.isPriority);
      if (priority) {
        setExpandedId(priority.id);
        setHasShownPriority(true);
      }
    }
  }, [activeAnnouncements, hasShownPriority]);

  const isAnyExpanded = expandedId !== null;

  // Carousel controls
  const variants = {
    animate: {
      x: [0, -1000], // Will be calculated based on content
      transition: {
        x: {
          repeat: Infinity,
          repeatType: "loop" as const,
          duration: 30,
          ease: "linear",
        },
      },
    },
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
            className="fixed inset-0 bg-black/60 backdrop-blur-md z-[1400] pointer-events-auto"
          />
        )}
      </AnimatePresence>

      <div 
        className={`fixed inset-x-0 bottom-12 md:bottom-28 pointer-events-none transition-all duration-500 ${isAnyExpanded ? 'top-0 flex items-center justify-center p-4 z-[2000]' : 'z-[1450] h-64 md:h-72'}`}
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        {!isAnyExpanded ? (
          <div className="w-full relative h-full overflow-hidden pointer-events-auto flex items-center">
            {/* Ticker Container */}
            <motion.div
              ref={containerRef}
              className="flex gap-4 md:gap-6 px-10 whitespace-nowrap cursor-grab active:cursor-grabbing"
              drag="x"
              dragConstraints={{ left: -2000, right: 0 }} // Approximate
              animate={isPaused ? {} : { x: ["0%", "-50%"] }}
              transition={{
                x: {
                  repeat: Infinity,
                  repeatType: "loop" as const,
                  duration: 25,
                  ease: "linear",
                },
              }}
              style={{ width: 'max-content' }}
            >
              {/* Duplicate contents for seamless loop */}
              {[...activeAnnouncements, ...activeAnnouncements].map((ann, idx) => (
                <motion.div 
                  key={`${ann.id}-${idx}`}
                  layoutId={idx < activeAnnouncements.length ? `ann-${ann.id}` : `ann-dup-${ann.id}`}
                  onClick={() => setExpandedId(ann.id)}
                  className={`w-[200px] md:w-[280px] h-[200px] md:h-[260px] flex-shrink-0 glass rounded-[24px] md:rounded-[28px] shadow-xl overflow-hidden cursor-pointer hover:shadow-2xl hover:scale-105 transition-all duration-300 border bg-white/10 relative ${
                    ann.isPriority ? 'border-orange-500/50 shadow-orange-500/20' : 'border-white/20'
                  }`}
                >
                  {ann.isPriority && (
                    <motion.div 
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: [1, 1.1, 1], opacity: 1 }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="absolute top-3 left-3 z-10 px-2 py-0.5 bg-orange-600 text-white text-[8px] font-black uppercase tracking-tighter rounded-full shadow-lg border border-orange-400"
                    >
                      Prioridad
                    </motion.div>
                  )}
                  <div className="h-24 md:h-32 overflow-hidden bg-gray-50/50">
                    {ann.image ? (
                      <img src={ann.image} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <div className="w-8 md:w-10 h-8 md:h-10 rounded-full bg-blue-500/20 flex items-center justify-center">
                          <span className="text-blue-600 font-black text-xs">!</span>
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="p-4 md:p-5 flex flex-col h-full bg-white/5 backdrop-blur-sm">
                    <h4 className="font-black text-gray-900 text-xs md:text-sm mb-1 line-clamp-2 leading-tight tracking-tight uppercase">
                      {ann.title}
                    </h4>
                    <p className="text-gray-600 text-[10px] md:text-xs line-clamp-2 leading-relaxed opacity-60">
                      {ann.content}
                    </p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        ) : (
          <div className="flex justify-center w-full max-w-7xl mx-auto pointer-events-auto">
            {activeAnnouncements.filter(ann => ann.id === expandedId).map(ann => (
              <motion.div 
                key={`expanded-${ann.id}`}
                layoutId={`ann-${ann.id}`}
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="w-full max-w-[600px] max-h-[85vh] glass rounded-[32px] md:rounded-[40px] shadow-[0_40px_100px_rgba(0,0,0,0.5)] flex flex-col overflow-y-auto custom-scrollbar border border-white/30"
              >
                <div className="shrink-0 h-48 md:h-96 relative">
                  {ann.isPriority && (
                    <div className="absolute top-6 left-6 z-10 px-4 py-1.5 bg-orange-600 text-white text-[10px] md:text-sm font-black uppercase tracking-widest rounded-full shadow-2xl border border-orange-400 flex items-center gap-2">
                       <motion.div 
                        animate={{ scale: [1, 1.5, 1], opacity: [1, 0.5, 1] }} 
                        transition={{ duration: 1.5, repeat: Infinity }}
                        className="w-2 h-2 bg-white rounded-full" 
                       />
                       Importante / Prioridad
                    </div>
                  )}
                  {ann.image ? (
                    <img src={ann.image} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-blue-500/10 to-blue-600/5 flex items-center justify-center">
                      <div className="w-20 h-20 rounded-full bg-blue-500/10 flex items-center justify-center">
                        <span className="text-blue-600 font-black text-4xl">!</span>
                      </div>
                    </div>
                  )}
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      setExpandedId(null);
                    }}
                    className="absolute top-6 right-6 p-3 bg-white/80 hover:bg-white backdrop-blur-md rounded-2xl text-gray-900 shadow-xl transition-all hover:rotate-90"
                  >
                    <X size={24} />
                  </button>
                </div>
                <div className="p-8 md:p-12 pb-24 md:pb-32 bg-white/80 backdrop-blur-xl">
                  <div className="flex items-center gap-3 mb-6">
                    <span className="px-3 py-1 bg-blue-600 text-[10px] font-black text-white rounded-full uppercase tracking-widest">
                      {ann.company === 'Global' ? 'Corporativo' : ann.company}
                    </span>
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Comunicado Oficial</span>
                  </div>
                  <h4 className="font-black text-gray-900 text-3xl md:text-5xl mb-6 leading-[1.1] tracking-tight">
                    {ann.title}
                  </h4>
                  <div className="text-gray-700 text-lg md:text-xl leading-relaxed whitespace-pre-wrap">
                    {ann.content}
                  </div>
                </div>
                <div className="sticky bottom-0 p-8 md:p-12 pt-0 bg-gradient-to-t from-white via-white/90 to-transparent flex justify-end">
                  <button 
                    onClick={() => setExpandedId(null)}
                    className="px-10 py-4 bg-gray-900 text-white rounded-2xl font-black text-sm uppercase tracking-[0.2em] shadow-2xl hover:bg-black transition-all hover:scale-105 active:scale-95"
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
