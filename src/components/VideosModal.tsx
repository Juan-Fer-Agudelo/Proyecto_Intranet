import React from 'react';
import { X } from 'lucide-react';
import { motion } from 'motion/react';
import { Video } from '../types';

interface VideosModalProps {
  isOpen: boolean;
  onClose: () => void;
  videos: Video[];
}

export const VideosModal: React.FC<VideosModalProps> = ({ isOpen, onClose, videos }) => {
  if (!isOpen) return null;

  const extractYouTubeId = (url: string) => {
    if (url.includes('v=')) return url.split('v=')[1].split('&')[0];
    return url.split('/').pop();
  };

  return (
    <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/80 backdrop-blur-md"
        onClick={onClose}
      />
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
        className="relative glass rounded-[32px] p-6 md:p-10 w-full max-w-[1000px] max-h-[90vh] overflow-y-auto shadow-2xl custom-scrollbar"
      >
        <div className="flex justify-between items-center mb-10 sticky top-0 bg-transparent backdrop-blur-md z-10 pb-4 border-b border-gray-200">
          <h2 className="text-3xl font-black text-gray-900 tracking-tight">Videos de Recursos Humanos</h2>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={28} className="text-gray-500" />
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {videos.map(video => (
            <motion.div 
              key={video.id} 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="space-y-4"
            >
              <div className="aspect-video rounded-3xl overflow-hidden bg-black shadow-2xl border-4 border-gray-50">
                <iframe 
                  src={`https://www.youtube.com/embed/${extractYouTubeId(video.url)}`}
                  className="w-full h-full"
                  allowFullScreen
                  title={video.title}
                />
              </div>
              <p className="font-black text-gray-800 text-center text-lg tracking-tight">{video.title}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};
