import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Image as ImageIcon } from 'lucide-react';
import { NewsItem } from '../types';

interface HeroProps {
  news: NewsItem[];
  heroBgs: string[];
  currentBgIndex: number;
}

export const Hero: React.FC<HeroProps> = ({ news, heroBgs, currentBgIndex }) => {
  const defaultBgs = [
    'https://www.simex.com.co/wp-content/uploads/2024/07/imagen-carrusel-cosmetico-3.jpg',
    'https://media.licdn.com/dms/image/v2/C4D22AQFp83y2KccQng/feedshare-shrink_2048_1536/feedshare-shrink_2048_1536/0/1600198479440?e=1778112000&v=beta&t=nQ4Njty3VBhDq4BAnsLhTorIY7hddceRDWuB41TjQZ8'
  ];
  const displayBgs = heroBgs.length > 0 ? heroBgs : defaultBgs;
  
  return (
    <section className="relative min-h-[400px] md:min-h-[calc(100vh-140px)] flex flex-col items-center justify-start p-2 md:p-6 text-center overflow-hidden">
      {/* Background Images with Transitions */}
      <AnimatePresence mode="popLayout">
        <motion.img
          key={currentBgIndex}
          src={displayBgs[currentBgIndex % displayBgs.length]}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="absolute inset-0 w-full h-full object-cover z-0"
          alt="Background"
        />
      </AnimatePresence>

      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/10 z-[1]" />
      
      <div className="relative z-10 w-full container-custom flex flex-col gap-8 items-center pt-8 md:pt-16">
        {news.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 md:gap-12 w-full max-w-7xl">
            {news.map((item, idx) => (
              <motion.article 
                key={item.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1, duration: 0.5 }}
                className="bg-white/95 backdrop-blur-md rounded-[32px] overflow-hidden shadow-2xl text-left border border-white/40 hover:-translate-y-2 transition-all duration-300 group max-w-[450px] mx-auto w-full"
              >
                {item.image && (
                  <div className="overflow-hidden h-60 md:h-64">
                    <img src={item.image} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  </div>
                )}
                <div className="p-8">
                  <div className="flex justify-between text-[11px] text-gray-500 mb-4 uppercase tracking-[0.15em] font-bold">
                    <span>{item.category} • {item.author}</span>
                    <span>{item.date}</span>
                  </div>
                  <h3 className="text-2xl font-black text-[var(--primary)] mb-4 leading-[1.1] group-hover:text-blue-700 transition-colors uppercase tracking-tight">{item.title}</h3>
                  <p className="text-base text-gray-700 line-clamp-5 leading-relaxed">{item.content}</p>
                </div>
              </motion.article>
            ))}
          </div>
        ) : (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-white/80 mt-20"
          >
            <p className="max-w-md mx-auto mt-2">Selecciona una empresa para ver sus módulos específicos o espera a las próximas noticias.</p>
          </motion.div>
        )}
      </div>
    </section>
  );
};
