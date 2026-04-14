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

  const activeAnnouncements = announcements
    .filter(a => a.active && (a.company === currentCompany || a.company === 'Global'))
    .slice(-5);
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
            className="fixed inset-0 bg-black/60 backdrop-blur-md z-[1400] pointer-events-auto"
          />
        )}
      </AnimatePresence>

      <div className={`fixed inset-0 flex justify-center px-4 md:px-6 pointer-events-none transition-all duration-500 ${isAnyExpanded ? 'items-center z-[2000]' : 'items-end pb-6 md:pb-24 z-[1450]'}`}>
        <div className="flex flex-row justify-center flex-wrap gap-3 md:gap-4 w-full max-w-7xl mx-auto">
          <AnimatePresence mode="popLayout">
            {activeAnnouncements.map(ann => {
              const isExpanded = expandedId === ann.id;
              
              // If any card is expanded, we hide the others to keep the UI clean
              if (isAnyExpanded && !isExpanded) return null;

              return (
                <motion.div 
                  key={ann.id}
                  layoutId={`ann-${ann.id}`}
                  initial={{ opacity: 0, scale: 0.8, y: 20 }}
                  animate={{ 
                    opacity: 1, 
                    scale: 1, 
                    y: 0,
                  }}
                  exit={{ opacity: 0, scale: 0.8, y: 20 }}
                  onClick={() => setExpandedId(isExpanded ? null : ann.id)}
                  className={`
                    pointer-events-auto glass rounded-[24px] md:rounded-[28px] shadow-2xl overflow-hidden relative cursor-pointer transition-all duration-500
                    ${isExpanded 
                      ? 'w-[92vw] md:w-[95vw] max-w-[550px] max-h-[80vh] flex flex-col shadow-blue-500/40 ring-4 ring-blue-500/10 overflow-y-auto custom-scrollbar' 
                      : 'w-[calc(50%-12px)] sm:w-[200px] md:w-[240px] h-[220px] md:h-[280px] flex flex-col hover:shadow-xl hover:-translate-y-2'}
                  `}
                >
                  <div className={`shrink-0 overflow-hidden transition-all duration-700 ${isExpanded ? 'h-48 md:h-64' : 'h-24 md:h-32 bg-gray-50'}`}>
                    {ann.image ? (
                      <img src={ann.image} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-blue-100 flex items-center justify-center">
                          <span className="text-blue-600 font-black text-xs">i</span>
                        </div>
                      </div>
                    )}
                  </div>
                  <div className={`transition-all duration-500 ${isExpanded ? 'p-6 md:p-10' : 'p-4 md:p-5'}`}>
                    <h4 className={`font-black text-gray-900 mb-2 md:mb-4 transition-all leading-tight break-words ${isExpanded ? 'text-2xl md:text-4xl' : 'text-xs md:text-sm'}`}>
                      {ann.title}
                    </h4>
                    <div className={`text-gray-600 leading-relaxed transition-all break-words ${isExpanded ? 'text-base md:text-lg' : 'text-[10px] md:text-xs line-clamp-2 md:line-clamp-3'}`}>
                      {ann.content}
                    </div>
                    {isExpanded && (
                      <motion.div 
                        initial={{ opacity: 0, y: 10 }} 
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="mt-6 md:mt-10 pt-6 md:pt-8 border-t border-gray-100 flex justify-between items-center sticky bottom-0 bg-white/50 backdrop-blur-sm -mx-6 -mb-6 p-6 md:-mx-10 md:-mb-10 md:p-10"
                      >
                        <div className="flex flex-col">
                          <span className="text-[9px] md:text-[10px] font-black text-blue-600 uppercase tracking-widest">Comunicado Oficial</span>
                          <span className="text-[10px] md:text-xs text-gray-400 font-bold">Intranet Corporativa</span>
                        </div>
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            setExpandedId(null);
                          }}
                          className="text-[9px] md:text-[10px] font-bold text-white uppercase tracking-widest bg-blue-600 px-4 py-2 rounded-full shadow-lg hover:bg-blue-700 transition-colors"
                        >
                          Cerrar
                        </button>
                      </motion.div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>
    </>
  );
};
