/**
 * Proyecto: Intranet Corporativa - Grupo Simex
 * Autor: Juan Fernando Agudelo
 * Descripción: Página independiente para la visualización de boletines 
 * quincenales y mensuales con navegación inmersiva.
 */
import React from 'react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { X, FileText, ChevronLeft } from 'lucide-react';
import { CompanyCode } from '../types';

interface BulletinPageProps {
  type: 'quincenal' | 'mensual';
  bulletinQuincenal: { SX: any[]; SO: any[]; PL: any[] };
  bulletinMensual: any[];
  currentCompany: CompanyCode;
}

const BulletinPage: React.FC<BulletinPageProps> = ({ 
  type, 
  bulletinQuincenal, 
  bulletinMensual, 
  currentCompany 
}) => {
  const navigate = useNavigate();
  
  const data = type === 'quincenal' 
    ? (bulletinQuincenal?.[currentCompany] || []) 
    : (bulletinMensual || []);

  const companyName = currentCompany === 'SX' ? 'SIMEX' : currentCompany === 'SO' ? 'SOINCO' : 'PLASTINOVO';

  return (
    <div className="min-h-screen bg-black text-white selection:bg-blue-500/30">
      {/* Barra de Navegación Superior */}
      <header className="sticky top-0 z-[100] bg-black/80 backdrop-blur-xl border-b border-white/5 py-4 px-6 md:px-12 flex justify-between items-center">
        <div className="flex items-center gap-6">
          <button 
            onClick={() => navigate(-1)}
            className="p-3 bg-white/5 hover:bg-white/10 rounded-2xl transition-all flex items-center gap-2 group"
          >
            <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
            <span className="text-xs font-bold uppercase tracking-widest hidden md:block">Volver</span>
          </button>
          
          <div className="h-10 w-px bg-white/10 hidden md:block" />
          
          <div className="flex flex-col">
            <h1 className="text-xl md:text-2xl font-black tracking-tighter">
              {type === 'quincenal' ? 'Boletín Quincenal' : 'Boletín Mensual'}
            </h1>
            <p className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em]">
              {companyName} • {data.length} Páginas Publicadas
            </p>
          </div>
        </div>

        <button 
          onClick={() => navigate('/')}
          className="p-3 bg-white/5 hover:bg-white/10 rounded-2xl transition-all"
          title="Cerrar y volver al inicio"
        >
          <X size={24} />
        </button>
      </header>

      {/* Contenedor Principal de Lectura */}
      <main className="max-w-7xl mx-auto p-4 md:p-12 custom-scrollbar">
        {data.length === 0 ? (
          <div className="h-[60vh] flex flex-col items-center justify-center space-y-6">
            <div className="w-24 h-24 bg-white/5 rounded-[40px] flex items-center justify-center animate-pulse">
              <FileText size={40} className="text-white/20" />
            </div>
            <p className="text-white/40 font-bold text-center">
              No hay contenido disponible para este boletín en este momento.
            </p>
          </div>
        ) : (
          <div className="space-y-20 py-10">
            {data.map((img: any, idx: number) => (
              <motion.div 
                key={img.id}
                initial={{ opacity: 0, y: 60 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="relative"
              >
                {/* Contenedor de Imagen o PDF */}
                <div className="relative rounded-[40px] overflow-hidden shadow-[0_60px_120px_-30px_rgba(0,0,0,0.8)] border border-white/10 bg-white/5 group">
                  {img.type?.includes('pdf') || img.url?.startsWith('data:application/pdf') ? (
                    <div className="flex flex-col w-full">
                      <div className="bg-white/5 p-5 flex justify-between items-center border-b border-white/10 backdrop-blur-sm">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-red-500/20 rounded-xl flex items-center justify-center text-red-400 shadow-inner">
                            <FileText size={22} />
                          </div>
                          <div className="flex flex-col">
                            <span className="text-xs font-bold text-white tracking-wide truncate max-w-[200px]">
                              {img.name || 'Documento Corporativo'}
                            </span>
                            <span className="text-[9px] text-white/30 font-black uppercase">Formato PDF</span>
                          </div>
                        </div>
                        <button 
                          onClick={() => {
                            const link = document.createElement('a');
                            link.href = img.url;
                            link.download = img.name || 'boletin.pdf';
                            link.click();
                          }}
                          className="px-5 py-2 bg-white/10 hover:bg-white/20 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all hover:scale-105 active:scale-95 shadow-lg"
                        >
                          Descargar Documento
                        </button>
                      </div>
                      <iframe 
                        src={`${img.url}#toolbar=0&navpanes=0&scrollbar=1`} 
                        title={`Página ${idx + 1}`}
                        className="w-full h-[85vh] md:h-[90vh] block border-none bg-white"
                      />
                    </div>
                  ) : (
                    <img 
                      src={img.url} 
                      alt={`Página ${idx + 1}`} 
                      className="w-full h-auto block transition-transform duration-1000 group-hover:scale-[1.01]"
                      referrerPolicy="no-referrer"
                    />
                  )}
                </div>

                {/* Marcador de Página Lateral */}
                <div className="absolute -left-24 top-0 bottom-0 hidden xl:flex flex-col items-center justify-center gap-6 opacity-30 hover:opacity-100 transition-opacity">
                  <div className="w-[1px] flex-grow bg-gradient-to-b from-transparent via-white to-transparent" />
                  <div className="flex flex-col items-center gap-2">
                    <span className="text-[10px] font-black text-white/50 rotate-180 [writing-mode:vertical-lr] tracking-[0.5em]">PÁGINA ELECTRÓNICA</span>
                    <span className="text-4xl font-black text-white tabular-nums tracking-tighter select-none">
                      {idx + 1 < 10 ? `0${idx + 1}` : idx + 1}
                    </span>
                  </div>
                  <div className="w-[1px] flex-grow bg-gradient-to-b from-transparent via-white to-transparent" />
                </div>
              </motion.div>
            ))}

            {/* Footer de Finalización */}
            <footer className="py-40 text-center space-y-8">
              <motion.div 
                animate={{ 
                  rotate: [45, 90, 45],
                  scale: [1, 1.1, 1]
                }}
                transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                className="w-24 h-24 bg-white/5 rounded-[35px] flex items-center justify-center mx-auto border border-white/10 rotate-45"
              >
                <FileText size={36} className="text-white/20 -rotate-45" />
              </motion.div>
              <div className="space-y-3">
                <p className="text-white text-base font-black uppercase tracking-[0.6em] opacity-40">
                  Lectura Finalizada
                </p>
                <div className="w-16 h-1 bg-white/10 mx-auto rounded-full" />
                <button 
                  onClick={() => navigate('/')}
                  className="mt-8 px-8 py-3 bg-white hover:bg-gray-100 text-black rounded-full font-black text-xs uppercase tracking-widest transition-all hover:scale-105 active:scale-95 shadow-2xl"
                >
                  Regresar al Inicio
                </button>
              </div>
            </footer>
          </div>
        )}
      </main>
    </div>
  );
};

export default BulletinPage;
