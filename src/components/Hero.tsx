import React from 'react';
import { motion } from 'motion/react';
import { Image as ImageIcon } from 'lucide-react';
import { NewsItem } from '../types';

interface HeroProps {
  news: NewsItem[];
  heroBg: string | null;
}

export const Hero: React.FC<HeroProps> = ({ news, heroBg }) => {
  return (
    <section 
      className="relative min-h-[500px] md:min-h-[calc(100vh-120px)] flex flex-col items-center justify-start p-6 md:p-12 text-center bg-cover bg-center transition-all duration-700 ease-in-out"
      style={{ backgroundImage: `url(${heroBg || 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?q=80&w=2070&auto=format&fit=crop'})` }}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-[var(--primary-overlay)] to-[var(--secondary-overlay)]" />
      
      <div className="relative z-10 w-full container-custom flex flex-col gap-8 items-center pt-8 md:pt-16">
        {news.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 w-full">
            {news.map((item, idx) => (
              <motion.article 
                key={item.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1, duration: 0.5 }}
                className="bg-white/95 backdrop-blur-md rounded-[24px] overflow-hidden shadow-2xl text-left border border-white/30 hover:-translate-y-2 transition-all duration-300 group"
              >
                {item.image && (
                  <div className="overflow-hidden h-48">
                    <img src={item.image} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  </div>
                )}
                <div className="p-6">
                  <div className="flex justify-between text-[10px] text-gray-500 mb-3 uppercase tracking-widest font-bold">
                    <span>{item.category} • {item.author}</span>
                    <span>{item.date}</span>
                  </div>
                  <h3 className="text-xl font-extrabold text-[var(--primary)] mb-3 leading-tight group-hover:text-blue-700 transition-colors">{item.title}</h3>
                  <p className="text-sm text-gray-700 line-clamp-4 leading-relaxed">{item.content}</p>
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
