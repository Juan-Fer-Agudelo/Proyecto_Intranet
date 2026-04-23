import React from 'react';
import { X, FileText } from 'lucide-react';
import { motion, AnimatePresence, useScroll, useTransform } from 'motion/react';
import { Announcement, CompanyCode } from '../types';

interface AnnouncementsProps {
  announcements: Announcement[];
  setAnnouncements: React.Dispatch<React.SetStateAction<Announcement[]>>;
  currentCompany: CompanyCode;
}

const CarouselCard: React.FC<{ ann: Announcement; onClick: () => void }> = ({ ann, onClick }) => {
  return (
    <motion.div 
      whileHover={{ y: -10, scale: 1.02 }}
      onClick={onClick}
      className={`w-[280px] md:w-[320px] h-[350px] md:h-[400px] flex-shrink-0 bg-white rounded-[32px] shadow-2xl overflow-hidden cursor-pointer border relative transition-shadow duration-300 ${
        ann.isPriority ? 'border-orange-500/50 shadow-orange-500/20' : 'border-gray-100'
      }`}
    >
      {ann.isPriority && (
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: [1, 1.1, 1], opacity: 1 }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute top-4 left-4 z-10 px-3 py-1 bg-orange-600 text-white text-[10px] font-black uppercase tracking-widest rounded-full shadow-lg border border-orange-400"
        >
          Prioridad
        </motion.div>
      )}
      <div className="h-44 md:h-56 overflow-hidden bg-gray-50/50">
        {ann.image ? (
          ann.image.startsWith('data:application/pdf') || ann.image.toLowerCase().endsWith('.pdf') ? (
            <div className="w-full h-full flex flex-col items-center justify-center bg-red-50 gap-2">
              <FileText className="text-red-500" size={48} />
              <span className="text-xs font-black text-red-600 uppercase tracking-widest">Documento PDF</span>
            </div>
          ) : (
            <img src={ann.image} alt="" className="w-full h-full object-cover" />
          )
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
            <div className="w-16 h-16 rounded-full bg-blue-500/10 flex items-center justify-center">
              <span className="text-blue-600 font-black text-2xl">!</span>
            </div>
          </div>
        )}
      </div>
      <div className="p-6 md:p-8 flex flex-col justify-between h-[calc(100%-11rem)] md:h-[calc(100%-14rem)] bg-white">
        <div>
          <h4 className="font-black text-gray-900 text-sm md:text-lg mb-2 line-clamp-2 leading-tight tracking-tight uppercase">
            {ann.title}
          </h4>
          <p className="text-gray-600 text-xs md:text-sm line-clamp-3 leading-relaxed opacity-70">
            {ann.content}
          </p>
        </div>
        <div className="flex items-center gap-2 mt-4">
            <span className="w-2 h-2 rounded-full bg-blue-500"></span>
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Ver más detalle</span>
        </div>
      </div>
    </motion.div>
  );
};

export const Announcements: React.FC<AnnouncementsProps> = ({ announcements, currentCompany }) => {
  const [expandedId, setExpandedId] = React.useState<string | number | null>(null);
  const containerRef = React.useRef<HTMLDivElement>(null);
  const { scrollXProgress } = useScroll({
    container: containerRef
  });

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

  const isAnyExpanded = expandedId !== null;

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
        className={`fixed inset-x-0 bottom-8 md:bottom-20 pointer-events-none transition-all duration-700 ${isAnyExpanded ? 'top-0 flex items-center justify-center p-4 md:p-24 z-[1400]' : 'z-[1450] h-[450px] md:h-[550px]'}`}
      >
        {!isAnyExpanded ? (
          <div className="w-full relative h-full flex flex-col justify-end pointer-events-auto">
             <div className="absolute top-0 left-12 z-20">
                <span className="px-4 py-2 bg-white/10 backdrop-blur text-white text-[10px] font-black uppercase tracking-[0.3em] rounded-full border border-white/20">
                   Noticias del Grupo
                </span>
             </div>
             
             <div 
               ref={containerRef}
               className="flex gap-8 overflow-x-auto py-12 px-12 md:px-24 no-scrollbar snap-x snap-mandatory items-center h-full"
               style={{ scrollBehavior: 'smooth' }}
             >
                {activeAnnouncements.map((ann) => (
                  <div key={ann.id} className="snap-center shrink-0">
                    <CarouselCard ann={ann} onClick={() => setExpandedId(ann.id)} />
                  </div>
                ))}
             </div>
             
             {/* Scroll Progress Bar */}
             <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-32 h-1 bg-white/10 rounded-full overflow-hidden">
                <motion.div 
                   className="h-full bg-white/50 w-full origin-left"
                   style={{ scaleX: scrollXProgress }}
                />
             </div>
          </div>
        ) : (
          <div className="flex justify-center w-full max-w-7xl mx-auto pointer-events-auto h-full items-center">
            {activeAnnouncements.filter(ann => ann.id === expandedId).map(ann => (
              <motion.div 
                key={`expanded-${ann.id}`}
                layoutId={`ann-${ann.id}`}
                initial={{ opacity: 0, scale: 0.9, y: 40 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 40 }}
                className={`w-full ${ann.isPriority ? 'max-w-[950px]' : 'max-w-[700px]'} max-h-[85vh] bg-white rounded-[40px] md:rounded-[56px] shadow-[0_60px_150px_rgba(0,0,0,0.7)] flex flex-col overflow-y-auto no-scrollbar border border-gray-100 relative group`}
              >
                <div className="shrink-0 h-64 md:h-[500px] relative overflow-hidden">
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
                      <div className="w-full h-full bg-gray-100 flex flex-col">
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
                      <motion.img 
                        initial={{ scale: 1.1 }}
                        animate={{ scale: 1 }}
                        src={ann.image} 
                        alt="" 
                        className="w-full h-full object-cover" 
                      />
                    )
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center">
                      <div className="w-32 h-32 rounded-full bg-white/5 border border-white/10 flex items-center justify-center backdrop-blur-3xl">
                        <span className="text-white font-black text-6xl">!</span>
                      </div>
                    </div>
                  )}
                  <button 
                    onClick={() => setExpandedId(null)}
                    className="absolute top-8 right-8 p-4 bg-white/20 hover:bg-white backdrop-blur-2xl rounded-3xl text-white hover:text-gray-900 shadow-2xl transition-all hover:rotate-90 group-hover:scale-110"
                  >
                    <X size={28} />
                  </button>
                </div>
                <div className="p-10 md:p-20 pb-32 md:pb-40 bg-white">
                  <div className="flex items-center gap-4 mb-8">
                    <span className="px-4 py-1.5 bg-blue-600 text-[10px] font-black text-white rounded-full uppercase tracking-[0.2em] shadow-lg shadow-blue-600/20">
                      {ann.company === 'Global' ? 'Corporativo' : ann.company}
                    </span>
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">Comunicado Simex</span>
                  </div>
                  <h4 className="font-black text-gray-900 text-4xl md:text-7xl mb-8 leading-[1] tracking-tighter">
                    {ann.title}
                  </h4>
                  <div className="text-gray-600 text-xl md:text-2xl leading-relaxed whitespace-pre-wrap font-medium">
                    {ann.content}
                  </div>
                </div>
                <div className="sticky bottom-0 p-10 md:p-20 pt-0 bg-gradient-to-t from-white via-white/80 to-transparent flex justify-end">
                  <button 
                    onClick={() => setExpandedId(null)}
                    className="px-12 py-5 bg-gray-900 text-white rounded-2xl font-black text-sm uppercase tracking-[0.3em] shadow-2xl hover:bg-black transition-all hover:scale-105 active:scale-95"
                  >
                    Cerrar Comunicado
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
