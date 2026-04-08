import React from 'react';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Announcement } from '../types';

interface AnnouncementsProps {
  announcements: Announcement[];
  setAnnouncements: React.Dispatch<React.SetStateAction<Announcement[]>>;
}

export const Announcements: React.FC<AnnouncementsProps> = ({ announcements, setAnnouncements }) => {
  return (
    <div className="fixed bottom-24 right-6 left-6 flex flex-row justify-center flex-wrap gap-4 z-[1000] pointer-events-none p-2 items-end">
      <AnimatePresence>
        {announcements.filter(a => a.active).slice(-5).map(ann => (
          <motion.div 
            key={ann.id}
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            className="pointer-events-auto bg-white/90 rounded-2xl shadow-2xl overflow-hidden w-full max-w-[280px] relative border border-white/40 backdrop-blur-xl"
          >
            <button 
              className="absolute top-2 right-2 w-7 h-7 flex items-center justify-center bg-black/40 text-white rounded-full hover:bg-black/60 z-10 transition-colors"
              onClick={() => setAnnouncements(announcements.map(a => a.id === ann.id ? { ...a, active: false } : a))}
            >
              <X size={14} />
            </button>
            {ann.image && <img src={ann.image} alt="" className="w-full h-36 object-cover" />}
            <div className="p-4">
              <h4 className="font-bold text-gray-900 mb-1 text-sm">{ann.title}</h4>
              <p className="text-xs text-gray-600 line-clamp-3 leading-relaxed">{ann.content}</p>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};
