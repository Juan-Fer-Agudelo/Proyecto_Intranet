import React from 'react';
import { X } from 'lucide-react';
import { motion } from 'motion/react';
import { Video } from '../types';

interface VideosModalProps {
  isOpen: boolean;
  onClose: () => void;
  videos: Video[];
  rhVideo: string | null;
}

export const VideosModal: React.FC<VideosModalProps> = ({ isOpen, onClose, videos, rhVideo }) => {
  if (!isOpen) return null;

  const extractYouTubeId = (url: string) => {
    if (url.includes('v=')) return url.split('v=')[1].split('&')[0];
    if (url.includes('youtu.be/')) return url.split('youtu.be/')[1].split('?')[0];
    return url.split('/').pop();
  };

  const isYouTube = (url: string) => url.includes('youtube.com') || url.includes('youtu.be');

  return (
    <div className="fixed inset-0 z-[70000] flex items-center justify-center p-2 md:p-4">
      <motion.div 
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/80 backdrop-blur-md"
        onClick={onClose}
      />
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
        className="relative glass rounded-3xl md:rounded-[32px] p-4 md:p-10 w-full max-w-[1000px] max-h-[95vh] md:max-h-[90vh] overflow-y-auto shadow-2xl custom-scrollbar"
      >
        <div className="flex justify-between items-center mb-6 sticky top-0 bg-white/95 md:bg-transparent backdrop-blur-md z-20 pb-4 border-b border-gray-200">
          <h2 className="text-xl md:text-3xl font-black text-gray-900 tracking-tight">Galería de Vídeos</h2>
          <button 
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={24} className="text-gray-500 md:w-7 md:h-7" />
          </button>
        </div>

        <div className="space-y-12">
          {/* RH Video Section */}
          {rhVideo && (
            <section className="space-y-6">
              <h3 className="text-xl font-black text-blue-600 border-l-4 border-blue-600 pl-4 uppercase tracking-wider">Vídeo de Recursos Humanos</h3>
              <div className="max-w-2xl mx-auto aspect-video rounded-3xl overflow-hidden bg-black shadow-2xl border-4 border-white">
                {isYouTube(rhVideo) ? (
                  <iframe 
                    src={`https://www.youtube.com/embed/${extractYouTubeId(rhVideo)}`}
                    className="w-full h-full"
                    allowFullScreen
                  />
                ) : (
                  <video src={rhVideo} controls className="w-full h-full" />
                )}
              </div>
            </section>
          )}

          {/* Corporative Videos Section */}
          <section className="space-y-6">
            <h3 className="text-xl font-black text-gray-800 border-l-4 border-gray-800 pl-4 uppercase tracking-wider">Vídeos Corporativos</h3>
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
                    {video.type === 'youtube' || isYouTube(video.url) ? (
                      <iframe 
                        src={`https://www.youtube.com/embed/${extractYouTubeId(video.url)}`}
                        className="w-full h-full"
                        allowFullScreen
                        title={video.title}
                      />
                    ) : (
                      <video 
                        src={video.url} 
                        controls 
                        className="w-full h-full"
                      />
                    )}
                  </div>
                  <p className="font-black text-gray-800 text-center text-lg tracking-tight">{video.title}</p>
                  {video.description && (
                    <p className="text-sm text-gray-600 text-center leading-relaxed">{video.description}</p>
                  )}
                </motion.div>
              ))}
              {videos.length === 0 && !rhVideo && (
                <p className="col-span-full text-center py-10 text-gray-400 font-bold italic">No hay vídeos disponibles en este momento.</p>
              )}
            </div>
          </section>
        </div>
      </motion.div>
    </div>
  );
};
