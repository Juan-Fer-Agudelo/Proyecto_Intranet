import React from 'react';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Announcement } from '../types';

interface AnnouncementsProps {
  announcements: Announcement[];
  setAnnouncements: React.Dispatch<React.SetStateAction<Announcement[]>>;
}

export const Announcements: React.FC<AnnouncementsProps> = ({ announcements, setAnnouncements }) => {
  const [expandedId, setExpandedId] = React.useState<number | null>(null);

  const activeAnnouncements = announcements.filter(a => a.active).slice(-5);
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

      <div className="fixed bottom-24 left-0 right-0 flex justify-center items-end px-6 z-[1450] pointer-events-none">
        <div className="flex flex-row justify-center flex-wrap gap-4 w-full max-w-7xl">
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
                    zIndex: isExpanded ? 1500 : 1
                  }}
                  exit={{ opacity: 0, scale: 0.8, y: 20 }}
                  onClick={() => setExpandedId(isExpanded ? null : ann.id)}
                  className={`
                    pointer-events-auto bg-white/95 rounded-[28px] shadow-2xl overflow-hidden relative border border-white/40 backdrop-blur-xl cursor-pointer transition-all duration-500
                    ${isExpanded 
                      ? 'w-[95vw] max-w-[500px] shadow-blue-500/40 ring-4 ring-blue-500/10 mb-4' 
                      : 'w-full max-w-[240px] hover:shadow-xl hover:-translate-y-2'}
                  `}
                >
                  {ann.image && (
                    <div className={`overflow-hidden transition-all duration-700 ${isExpanded ? 'h-72' : 'h-32'}`}>
                      <img src={ann.image} alt="" className="w-full h-full object-cover" />
                    </div>
                  )}
                  <div className={`transition-all duration-500 ${isExpanded ? 'p-10' : 'p-5'}`}>
                    <h4 className={`font-black text-gray-900 mb-3 transition-all ${isExpanded ? 'text-3xl' : 'text-sm'}`}>
                      {ann.title}
                    </h4>
                    <p className={`text-gray-600 leading-relaxed transition-all ${isExpanded ? 'text-lg line-clamp-none' : 'text-xs line-clamp-3'}`}>
                      {ann.content}
                    </p>
                    {isExpanded && (
                      <motion.div 
                        initial={{ opacity: 0, y: 10 }} 
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="mt-8 pt-8 border-t border-gray-100 flex justify-between items-center"
                      >
                        <div className="flex flex-col">
                          <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest">Comunicado Oficial</span>
                          <span className="text-xs text-gray-400 font-bold">Intranet Corporativa</span>
                        </div>
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest bg-gray-50 px-3 py-1 rounded-full">Click para cerrar</span>
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
