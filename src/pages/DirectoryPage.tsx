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

      <main className="flex-grow p-4 md:p-8">
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
            <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50/50 border-b border-slate-100">
                      <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Usuario</th>
                      <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Empresa / Área</th>
                      <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Cargo</th>
                      <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400 text-center">Extensión</th>
                      <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Contacto</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    <AnimatePresence mode="popLayout">
                      {filteredContacts.map((contact) => (
                        <motion.tr
                          key={contact.id}
                          layout
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="group hover:bg-blue-50/30 transition-colors"
                        >
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 font-black text-xs shrink-0 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                {contact.nombre?.charAt(0)}
                              </div>
                              <div>
                                <p className="text-sm font-black text-slate-800 uppercase tracking-tight">{contact.nombre}</p>
                                <p className="text-[10px] font-bold text-slate-400 lowercase">{contact.correo || 'sin correo'}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex flex-col">
                              <span className="text-[10px] font-black text-blue-600 uppercase tracking-tighter">{contact.empresa}</span>
                              <span className="text-xs font-bold text-slate-500 uppercase">{contact.area}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">
                            {contact.cargo}
                          </td>
                          <td className="px-6 py-4 text-center">
                            <span className="inline-block px-4 py-1.5 bg-blue-100 text-blue-700 rounded-lg font-black text-lg tracking-tighter">
                              {contact.extension || '---'}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              {contact.celular && (
                                <a 
                                  href={`tel:${contact.celular}`} 
                                  className="p-2 bg-slate-100 text-slate-400 hover:bg-blue-600 hover:text-white rounded-lg transition-all"
                                  title={`Llamar a ${contact.celular}`}
                                >
                                  <Phone size={14} />
                                </a>
                              )}
                              {contact.correo && (
                                <a 
                                  href={`mailto:${contact.correo}`} 
                                  className="p-2 bg-slate-100 text-slate-400 hover:bg-blue-600 hover:text-white rounded-lg transition-all"
                                  title={`Enviar correo a ${contact.correo}`}
                                >
                                  <Mail size={14} />
                                </a>
                              )}
                            </div>
                          </td>
                        </motion.tr>
                      ))}
                    </AnimatePresence>
                  </tbody>
                </table>
              </div>
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
