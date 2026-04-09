import React from 'react';
import { X, AlertCircle } from 'lucide-react';
import { motion } from 'motion/react';

interface RHVideoModalProps {
  isOpen: boolean;
  onClose: () => void;
  videoUrl: string | null;
}

export const RHVideoModal: React.FC<RHVideoModalProps> = ({ isOpen, onClose, videoUrl }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/80 backdrop-blur-md"
        onClick={onClose}
      />
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
        className="relative bg-white rounded-[2rem] overflow-hidden w-full max-w-4xl shadow-2xl"
      >
        <div className="flex justify-between items-center p-6 bg-white border-b">
          <h2 className="text-2xl font-black text-gray-900 tracking-tight">Video de Recursos Humanos</h2>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={24} className="text-gray-500" />
          </button>
        </div>

        <div className="aspect-video bg-black flex items-center justify-center">
          {videoUrl ? (
            <video 
              src={videoUrl} 
              controls 
              autoPlay 
              className="w-full h-full"
            >
              Tu navegador no soporta el elemento de video.
            </video>
          ) : (
            <div className="text-center p-10 space-y-4">
              <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto">
                <AlertCircle size={32} className="text-gray-400" />
              </div>
              <p className="text-gray-400 font-bold">No hay un video de RH cargado actualmente.</p>
              <p className="text-gray-500 text-sm">El administrador debe subir un video desde el panel de control.</p>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};
