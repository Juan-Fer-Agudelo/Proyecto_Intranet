import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, 
  ArrowLeft, 
  Phone, 
  Mail, 
  Building2, 
  User, 
  Filter, 
  X, 
  Hash,
  Briefcase,
  MapPin,
  RefreshCw,
  AlertCircle
} from 'lucide-react';
import { DirectoryEntry } from '../types';

/**
 * DirectorioPage: Pantalla de consulta de contactos y extensiones corporativas.
 * consume el microservicio de n8n con autenticación básica.
 */
export default function DirectoryPage() {
  const navigate = useNavigate();
  const [contacts, setContacts] = useState<DirectoryEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedArea, setSelectedArea] = useState<string>('Todas');
  const [selectedEmpresa, setSelectedEmpresa] = useState<string>('Todas');

  /**
   * Obtiene los contactos desde el microservicio backend.
   */
  const fetchDirectory = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('http://192.101.2.50:5678/webhook/directorio', {
        method: 'GET',
        headers: {
          'Authorization': 'Basic ' + btoa('intranet:intranet')
        }
      });

      if (!response.ok) {
        throw new Error('Error al conectar con el servidor de directorio.');
      }

      const data = await response.json();
      // Asumimos que la respuesta es un arreglo directo o viene en una propiedad (basado en la descripción del jefe)
      const directoryData = Array.isArray(data) ? data : data.data || [];
      setContacts(directoryData);
    } catch (err) {
      console.error('Error fetching directory:', err);
      setError('No se pudo cargar el directorio. Verifique su conexión a la red interna.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDirectory();
  }, []);

  // Extraemos áreas y empresas únicas para los filtros
  const areas = useMemo(() => {
    const set = new Set(contacts.map(c => c.area).filter(Boolean));
    return ['Todas', ...Array.from(set).sort()];
  }, [contacts]);

  const empresas = useMemo(() => {
    const set = new Set(contacts.map(c => c.empresa).filter(Boolean));
    return ['Todas', ...Array.from(set).sort()];
  }, [contacts]);

  // Filtrado de la lista basado en búsqueda y selects
  const filteredContacts = useMemo(() => {
    return contacts.filter(contact => {
      const matchesSearch = 
        contact.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        contact.cargo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        contact.extension?.toString().includes(searchTerm) ||
        contact.correo?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesArea = selectedArea === 'Todas' || contact.area === selectedArea;
      const matchesEmpresa = selectedEmpresa === 'Todas' || contact.empresa === selectedEmpresa;

      return matchesSearch && matchesArea && matchesEmpresa;
    });
  }, [contacts, searchTerm, selectedArea, selectedEmpresa]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
        <div className="p-8 rounded-[2.5rem] bg-white shadow-2xl flex flex-col items-center gap-6">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-blue-600/20 border-t-blue-600 rounded-full animate-spin"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <RefreshCw size={24} className="text-blue-600/50" />
            </div>
          </div>
          <div className="text-center">
            <p className="text-xl font-black text-slate-800 tracking-tight">Sincronizando Directorio</p>
            <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mt-1">Simex SAS • Microservicios</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Header Corporativo */}
      <header className="sticky top-0 z-50 bg-[#1B4969] text-white px-6 py-6 shadow-2xl">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-5">
            <button 
              onClick={() => navigate(-1)}
              className="p-3 bg-white/10 hover:bg-white/20 rounded-2xl transition-all group"
              title="Volver"
            >
              <ArrowLeft size={24} className="group-hover:-translate-x-1 transition-transform" />
            </button>
            <div className="h-10 w-px bg-white/10" />
            <div>
              <h1 className="text-2xl md:text-3xl font-black tracking-tighter leading-none">Directorio Ejecutivo</h1>
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-200/60 mt-1">Contactos y Extensiones Corporativas</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            <div className="relative flex-grow md:w-80 group">
              <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 group-focus-within:text-white transition-colors" />
              <input 
                type="text" 
                placeholder="Buscar por nombre, cargo o extensión..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3.5 bg-white/10 border border-white/10 rounded-2xl text-sm font-bold placeholder:text-white/30 focus:bg-white/20 outline-none transition-all focus:ring-2 focus:ring-white/20"
              />
              {searchTerm && (
                <button 
                  onClick={() => setSearchTerm('')}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white"
                >
                  <X size={18} />
                </button>
              )}
            </div>
            
            <button 
              onClick={fetchDirectory}
              className="p-3.5 bg-white/10 hover:bg-white/20 rounded-2xl transition-all"
              title="Refrescar datos"
            >
              <RefreshCw size={20} />
            </button>
          </div>
        </div>
      </header>

      {/* Filtros Secundarios */}
      <div className="bg-white border-b border-slate-200 py-4 px-6 sticky top-[92px] md:top-[100px] z-40">
        <div className="max-w-7xl mx-auto flex flex-wrap gap-4 items-center">
          <div className="flex items-center gap-2 text-slate-400 font-black text-[10px] uppercase tracking-widest">
            <Filter size={14} />
            <span>Filtrar por:</span>
          </div>

          <div className="flex gap-3">
            <select 
              value={selectedEmpresa}
              onChange={(e) => setSelectedEmpresa(e.target.value)}
              className="px-4 py-2 bg-slate-100 border-none rounded-xl text-xs font-black text-slate-600 outline-none focus:ring-2 focus:ring-blue-500 transition-all cursor-pointer"
            >
              <option value="Todas">Empresa: Todas</option>
              {empresas.filter(e => e !== 'Todas').map(e => <option key={e} value={e}>{e}</option>)}
            </select>

            <select 
              value={selectedArea}
              onChange={(e) => setSelectedArea(e.target.value)}
              className="px-4 py-2 bg-slate-100 border-none rounded-xl text-xs font-black text-slate-600 outline-none focus:ring-2 focus:ring-blue-500 transition-all cursor-pointer"
            >
              <option value="Todas">Área: Todas</option>
              {areas.filter(a => a !== 'Todas').map(a => <option key={a} value={a}>{a}</option>)}
            </select>
          </div>

          <div className="flex-grow md:text-right">
            <span className="text-xs font-bold text-slate-400">
              Mostrando <span className="text-blue-600">{filteredContacts.length}</span> de {contacts.length} contactos
            </span>
          </div>
        </div>
      </div>

      <main className="flex-grow p-6 md:p-10">
        <div className="max-w-7xl mx-auto">
          {error ? (
            <div className="bg-red-50 border-2 border-red-100 rounded-[2.5rem] p-12 text-center max-w-2xl mx-auto">
              <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto text-red-500 mb-6">
                <AlertCircle size={40} />
              </div>
              <h3 className="text-2xl font-black text-red-900 mb-2">Error de Conexión</h3>
              <p className="text-red-700 font-bold mb-8 leading-relaxed">{error}</p>
              <button 
                onClick={fetchDirectory}
                className="px-8 py-4 bg-red-600 text-white rounded-2xl font-black shadow-lg shadow-red-200 hover:bg-red-700 transition-all flex items-center gap-3 mx-auto"
              >
                <RefreshCw size={20} />
                Reintentar Conexión
              </button>
            </div>
          ) : filteredContacts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <AnimatePresence mode="popLayout">
                {filteredContacts.map((contact) => (
                  <motion.div
                    key={contact.id}
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="group bg-white rounded-[2rem] p-6 shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100 relative overflow-hidden"
                  >
                    {/* Indicador de empresa lateral */}
                    <div className={`absolute top-0 right-0 w-16 h-16 bg-slate-50 flex items-center justify-center rounded-bl-[2rem] border-l border-b border-slate-100 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-500`}>
                      <span className="text-xs font-black uppercase tracking-tighter">{contact.empresa?.substring(0, 3)}</span>
                    </div>

                    <div className="flex items-start gap-4 mb-6">
                      <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-500 shrink-0">
                        <User size={28} />
                      </div>
                      <div className="pr-12">
                        <h4 className="text-lg font-black text-slate-800 leading-tight group-hover:text-blue-600 transition-colors uppercase">{contact.nombre}</h4>
                        <div className="flex items-center gap-1.5 text-slate-400 mt-1">
                          <Briefcase size={12} />
                          <p className="text-[11px] font-bold uppercase tracking-wider">{contact.cargo}</p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3 pt-4 border-t border-slate-50 group-hover:border-blue-50 transition-colors">
                      <div className="flex items-center justify-between pb-3 border-b border-slate-50 last:border-none">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                            <Hash size={16} />
                          </div>
                          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Extensión</span>
                        </div>
                        <span className="text-xl font-black text-blue-600 tracking-tighter">{contact.extension || '---'}</span>
                      </div>

                      <div className="flex items-center justify-between pb-3 border-b border-slate-50 last:border-none">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                            <Building2 size={16} />
                          </div>
                          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Área</span>
                        </div>
                        <span className="text-xs font-bold text-slate-700 text-right uppercase truncate max-w-[150px]">{contact.area || 'General'}</span>
                      </div>

                      {contact.celular && (
                        <div className="flex items-center justify-between pb-3 border-b border-slate-50 last:border-none">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                              <Phone size={16} />
                            </div>
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Celular</span>
                          </div>
                          <a href={`tel:${contact.celular}`} className="text-sm font-bold text-slate-700 hover:text-blue-600 transition-colors">{contact.celular}</a>
                        </div>
                      )}

                      {contact.correo && (
                        <div className="flex items-center justify-between pb-3 border-b border-slate-50 last:border-none">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                              <Mail size={16} />
                            </div>
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Email</span>
                          </div>
                          <a href={`mailto:${contact.correo}`} className="text-[11px] font-bold text-blue-600 hover:underline truncate max-w-[150px]" title={contact.correo}>
                            {contact.correo}
                          </a>
                        </div>
                      )}

                      {contact.sede && (
                        <div className="flex items-center justify-between pb-3 border-b border-slate-50 last:border-none">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                              <MapPin size={16} />
                            </div>
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Sede</span>
                          </div>
                          <span className="text-xs font-bold text-slate-700 uppercase">{contact.sede}</span>
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-32 text-center bg-white rounded-[4rem] shadow-sm border border-slate-100">
              <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center text-slate-200 mb-6">
                <Search size={48} />
              </div>
              <h3 className="text-2xl font-black text-slate-800 tracking-tight">Sin resultados</h3>
              <p className="text-slate-400 font-bold max-w-xs mx-auto mt-2 leading-relaxed">No encontramos contactos que coincidan con la búsqueda "{searchTerm}"</p>
              <button 
                onClick={() => {
                  setSearchTerm('');
                  setSelectedArea('Todas');
                }}
                className="mt-8 px-6 py-3 bg-blue-600 text-white rounded-2xl font-black shadow-lg shadow-blue-100 hover:bg-blue-700 transition-all"
              >
                Limpiar filtros
              </button>
            </div>
          )}
        </div>
      </main>

      {/* Footer Minimalista */}
      <footer className="bg-white border-t border-slate-100 py-10 px-6 text-center">
        <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.4em]">Simex SAS • Directorio Integrado n8n</p>
      </footer>
    </div>
  );
}
