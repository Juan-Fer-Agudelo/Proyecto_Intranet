import React from 'react';
import { X, Image as ImageIcon } from 'lucide-react';
import { motion } from 'motion/react';
import { PartyPhoto } from '../types';

interface PartyPhotosModalProps {
  isOpen: boolean;
  onClose: () => void;
  photos: PartyPhoto[];
}

export const PartyPhotosModal: React.FC<PartyPhotosModalProps> = ({ isOpen, onClose, photos }) => {
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
        className="relative bg-white rounded-[2rem] overflow-hidden w-full max-w-5xl max-h-[90vh] flex flex-col shadow-2xl"
      >
        <div className="flex justify-between items-center p-6 bg-white border-b">
          <h2 className="text-2xl font-black text-gray-900 tracking-tight">Fotos Fiesta 2025</h2>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={24} className="text-gray-500" />
          </button>
        </div>

        <div className="flex-grow overflow-y-auto p-6 custom-scrollbar">
          {photos.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {photos.map(photo => (
                <motion.div 
                  key={photo.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="aspect-square rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-shadow cursor-zoom-in"
                  onClick={() => window.open(photo.url, '_blank')}
                >
                  <img src={photo.url} className="w-full h-full object-cover hover:scale-110 transition-transform duration-500" alt="Fiesta 2025" />
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
              <div className="w-20 h-20 bg-gray-50 text-gray-300 rounded-full flex items-center justify-center">
                <ImageIcon size={40} />
              </div>
              <div>
                <p className="text-xl font-bold text-gray-800">Aún no hay fotos cargadas</p>
                <p className="text-gray-500">El administrador subirá las fotos pronto.</p>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};
