// Importaciones necesarias de React y librerías externas
import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
// Iconos de Lucide React para la interfaz
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
// Importamos la interfaz de datos
import { DirectoryEntry } from '../types';

/**
 * DirectorioPage: Pantalla de consulta de contactos y extensiones corporativas.
 * Esta pantalla consume un microservicio de n8n con autenticación básica.
 * Organiza los datos en una estructura de "árbol" por Empresa, Gestión, Cargo y Nombre.
 */
export default function DirectoryPage() {
  const navigate = useNavigate(); // Hook para navegación entre rutas
  
  // Estados para manejar los datos del directorio
  const [contacts, setContacts] = useState<DirectoryEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true); // Estado de carga
  const [error, setError] = useState<string | null>(null); // Manejo de errores de conexión
  
  // Estados para los filtros y búsqueda
  const [searchTerm, setSearchTerm] = useState(''); // Término de búsqueda de texto
  const [selectedArea, setSelectedArea] = useState<string>('Todas'); // Filtro de área (Gestión)
  const [selectedEmpresa, setSelectedEmpresa] = useState<string>('Todas'); // Filtro de empresa

  /**
   * fetchDirectory: Función asíncrona que obtiene los contactos desde el microservicio backend.
   * Utiliza Fetch API con cabeceras de autenticación básica requeridas por n8n.
   */
  const fetchDirectory = async () => {
    setIsLoading(true);
    setError(null);
    try {
      // Usamos el proxy del servidor para evitar bloqueos por contenido mixto (HTTPS intentando acceder a HTTP)
      const response = await fetch('/api/proxy/directorio');

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Error al conectar con el servidor de directorio.');
      }

      const data = await response.json();
      // Verificamos si la data viene directamente como array o en una propiedad 'data'
      const directoryData = Array.isArray(data) ? data : data.data || [];
      setContacts(directoryData);
    } catch (err) {
      console.error('Error fetching directory:', err);
      setError('No se pudo cargar el directorio. Verifique su conexión a la red interna.');
    } finally {
      setIsLoading(false);
    }
  };

  // Efecto inicial para cargar los datos al montar el componente
  useEffect(() => {
    fetchDirectory();
  }, []);

  /**
   * useMemo para extraer áreas únicas (gestión) de los contactos cargados.
   * Esto se usa para poblar dinámicamente el selector de filtros de área.
   */
  const areas = useMemo(() => {
    const set = new Set(contacts.map(c => c.gestion).filter(Boolean));
    return ['Todas', ...Array.from(set).sort()];
  }, [contacts]);

  /**
   * useMemo para extraer empresas únicas de los contactos cargados.
   * Esto se usa para poblar dinámicamente el selector de filtros de empresa.
   */
  const empresas = useMemo(() => {
    const set = new Set(contacts.map(c => c.empresa).filter(Boolean));
    return ['Todas', ...Array.from(set).sort()];
  }, [contacts]);

  /**
   * filteredContacts: Lógica de filtrado y ordenamiento multinivel.
   * 1. Filtra por búsqueda de texto (nombre, cargo, extensión, gestión).
   * 2. Filtra por empresa y área (si están seleccionados).
   * 3. Ordena los resultados por prioridad de empresa (SIMEX > SOINCO > PLASTINOVO),
   *    luego por gestión, cargo y finalmente nombre de usuario.
   */
  const filteredContacts = useMemo(() => {
    // Definimos prioridades numéricas para las empresas principales
    const getCompanyPriority = (empresa: string) => {
      const emp = empresa?.toUpperCase() || '';
      if (emp.includes('SIMEX')) return 1;
      if (emp.includes('SOINCO')) return 2;
      if (emp.includes('PLASTINOVO')) return 3;
      return 4;
    };

    return contacts
      .filter(contact => {
        const search = searchTerm.toLowerCase();
        // Criterio de búsqueda en múltiples campos
        const matchesSearch = 
          contact.nombre?.toLowerCase().includes(search) ||
          contact.cargo?.toLowerCase().includes(search) ||
          contact.extencion?.toString().includes(search) ||
          contact.gestion?.toLowerCase().includes(search);
        
        // Criterios de filtros por dropdown
        const matchesArea = selectedArea === 'Todas' || contact.gestion === selectedArea;
        const matchesEmpresa = selectedEmpresa === 'Todas' || contact.empresa === selectedEmpresa;

        return matchesSearch && matchesArea && matchesEmpresa;
      })
      .sort((a, b) => {
        // Ordenamiento jerárquico multinivel
        const priorityA = getCompanyPriority(a.empresa);
        const priorityB = getCompanyPriority(b.empresa);
        
        // 1er nivel: Prioridad por Empresa
        if (priorityA !== priorityB) {
          return priorityA - priorityB;
        }

        // 2do nivel: Alfabético por Gestión (Área)
        const gestionSort = (a.gestion || '').localeCompare(b.gestion || '');
        if (gestionSort !== 0) return gestionSort;

        // 3er nivel: Alfabético por Cargo
        const cargoSort = (a.cargo || '').localeCompare(b.cargo || '');
        if (cargoSort !== 0) return cargoSort;
        
        // 4to nivel: Alfabético por Nombre de Usuario
        return (a.nombre || '').localeCompare(b.nombre || '');
      });
  }, [contacts, searchTerm, selectedArea, selectedEmpresa]);

  /**
   * getCompanyStyle: Devuelve la clase CSS de color de texto según la empresa.
   */
  const getCompanyStyle = (empresa: string) => {
    const emp = empresa?.toUpperCase() || '';
    if (emp.includes('SIMEX')) return 'text-blue-600';
    if (emp.includes('SOINCO')) return 'text-red-600';
    if (emp.includes('PLASTINOVO')) return 'text-orange-600';
    return 'text-slate-800';
  };

  /**
   * getCompanyBadge: Devuelve las clases CSS para el fondo y borde según la empresa.
   */
  const getCompanyBadge = (empresa: string) => {
    const emp = empresa?.toUpperCase() || '';
    if (emp.includes('SIMEX')) return 'bg-blue-50 text-blue-700 border-blue-100';
    if (emp.includes('SOINCO')) return 'bg-red-50 text-red-700 border-red-100';
    if (emp.includes('PLASTINOVO')) return 'bg-orange-50 text-orange-700 border-orange-100';
    return 'bg-slate-50 text-slate-700 border-slate-100';
  };

  // Renderizado del estado de carga inicial
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
      {/* HEADER CORPORATIVO: Fijo en la parte superior con colores corporativos */}
      <header className="sticky top-0 z-50 bg-[#1B4969] text-white px-6 py-6 shadow-2xl">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-5">
            {/* Botón de regreso */}
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

          <div className="flex items-center gap-3">
            {/* Botón manual para refrescar los datos desde el API */}
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

      {/* BARRA DE FILTROS Y BÚSQUEDA: Se mantiene visible al hacer scroll (sticky) */}
      <div className="bg-white border-b border-slate-200 py-4 px-6 sticky top-[92px] md:top-[100px] z-40 text-neutral-900">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-4 justify-between items-center">
          <div className="flex flex-wrap gap-4 items-center w-full md:w-auto">
            {/* Etiqueta de filtros */}
            <div className="flex items-center gap-2 text-slate-400 font-black text-[10px] uppercase tracking-widest whitespace-nowrap">
              <Filter size={14} />
              <span>Filtrar por:</span>
            </div>

            {/* BUSCADOR OMNICANAL: Filtra por nombre, extensión, área o cargo */}
            <div className="relative w-full md:w-80 group">
              <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
              <input 
                type="text" 
                placeholder="Buscar por nombre, área, cargo o extensión..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-slate-100 border-none rounded-xl text-xs font-bold text-gray-900 placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              />
              {searchTerm && (
                <button 
                  onClick={() => setSearchTerm('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-500"
                >
                  <X size={14} />
                </button>
              )}
            </div>

            {/* DROPDOWNS PARA EMPRESA Y ÁREA */}
            <div className="flex gap-2">
              <select 
                value={selectedEmpresa}
                onChange={(e) => setSelectedEmpresa(e.target.value)}
                className="px-4 py-2 bg-slate-100 border-none rounded-xl text-xs font-black text-gray-900 outline-none focus:ring-2 focus:ring-blue-500 transition-all cursor-pointer"
              >
                <option value="Todas">Empresa: Todas</option>
                {empresas.filter(e => e !== 'Todas').map(e => <option key={e} value={e}>{e}</option>)}
              </select>

              <select 
                value={selectedArea}
                onChange={(e) => setSelectedArea(e.target.value)}
                className="px-4 py-2 bg-slate-100 border-none rounded-xl text-xs font-black text-gray-900 outline-none focus:ring-2 focus:ring-blue-500 transition-all cursor-pointer"
              >
                <option value="Todas">Área: Todas</option>
                {areas.filter(a => a !== 'Todas').map(a => <option key={a} value={a}>{a}</option>)}
              </select>
            </div>
          </div>

          {/* Contador de registros filtrados */}
          <div className="whitespace-nowrap">
            <span className="text-xs font-bold text-slate-400">
              Mostrando <span className="text-blue-600 font-black">{filteredContacts.length}</span> de {contacts.length} registros
            </span>
          </div>
        </div>
      </div>

      {/* CONTENIDO PRINCIPAL: La tabla de directorio */}
      <main className="flex-grow p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          {/* Pantalla de error si la conexión falla */}
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
            <>
              {/* VISTA MÓVIL (CARDS): Se muestra en pantallas pequeñas */}
              <div className="grid grid-cols-1 gap-4 md:hidden pb-10">
                {filteredContacts.map((contact) => (
                  <motion.div 
                    key={`mobile-${contact.id_directorio}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-3xl p-5 shadow-sm border border-slate-100 flex flex-col gap-4"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-3">
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-lg border ${getCompanyBadge(contact.empresa)}`}>
                          {contact.nombre?.charAt(0)}
                        </div>
                        <div>
                          <h4 className="font-black text-slate-800 text-sm leading-tight uppercase tracking-tight">{contact.nombre}</h4>
                          <span className={`inline-block px-3 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest border mt-1 ${getCompanyBadge(contact.empresa)}`}>
                            {contact.empresa}
                          </span>
                        </div>
                      </div>
                      <div className={`flex items-center justify-center px-4 py-2 rounded-2xl border-2 font-black text-xl tracking-tighter ${getCompanyBadge(contact.empresa)}`}>
                        {contact.extencion || '---'}
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 pt-2 border-t border-slate-50">
                      <div className="space-y-1">
                        <span className="text-[8px] font-black text-slate-300 uppercase tracking-widest block">Área:</span>
                        <p className="text-[10px] font-bold text-slate-500 uppercase leading-tight">{contact.gestion || '---'}</p>
                      </div>
                      <div className="space-y-1">
                        <span className="text-[8px] font-black text-slate-300 uppercase tracking-widest block">Cargo:</span>
                        <p className="text-[10px] font-bold text-slate-500 uppercase leading-tight">{contact.cargo || '---'}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* VISTA DESKTOP (TABLA): Se oculta en móviles, se optimiza para TV y Monitor */}
              <div className="hidden md:block bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden mb-10">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50/50 border-b border-slate-100">
                        <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400 w-56">Empresa</th>
                        <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Área (Gestión)</th>
                        <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Usuario</th>
                        <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Cargo</th>
                        <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400 text-center">Extensión</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {/* AnimatePresence permite animar las filas cuando aparecen o desaparecen por el filtro */}
                      <AnimatePresence mode="popLayout">
                        {filteredContacts.map((contact) => (
                          <motion.tr
                            key={contact.id_directorio}
                            layout
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="group hover:bg-slate-50/80 transition-colors"
                          >
                            {/* Columna Empresa */}
                            <td className="px-6 py-4">
                              <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-tighter border block text-center ${getCompanyBadge(contact.empresa)}`}>
                                {contact.empresa}
                              </span>
                            </td>
                            {/* Columna Gesntión / Área */}
                            <td className="px-6 py-4">
                              <p className="text-xs font-bold text-slate-400 uppercase tracking-tight">{contact.gestion || '---'}</p>
                            </td>
                            {/* Columna Usuario */}
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-3">
                                <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-black text-xs shrink-0 border ${getCompanyBadge(contact.empresa)}`}>
                                  {contact.nombre?.charAt(0)}
                                </div>
                                <p className="text-xs font-bold text-slate-500 uppercase tracking-tight">
                                  {contact.nombre}
                                </p>
                              </div>
                            </td>
                            {/* Columna Cargo */}
                            <td className="px-6 py-4">
                              <p className="text-xs font-bold text-slate-500 uppercase tracking-tight">{contact.cargo || '---'}</p>
                            </td>
                            {/* Columna Extensión */}
                            <td className="px-6 py-4 text-center">
                              <span className={`inline-block px-5 py-2 rounded-xl font-black text-xl tracking-tighter shadow-sm border ${getCompanyBadge(contact.empresa)}`}>
                                {contact.extencion || '---'}
                              </span>
                            </td>
                          </motion.tr>
                        ))}
                      </AnimatePresence>
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          ) : (
            /* Pantalla informativa cuando no hay resultados en la búsqueda */
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
                  setSelectedEmpresa('Todas');
                }}
                className="mt-8 px-6 py-3 bg-blue-600 text-white rounded-2xl font-black shadow-lg shadow-blue-100 hover:bg-blue-700 transition-all font-sans"
              >
                Limpiar filtros
              </button>
            </div>
          )}
        </div>
      </main>

      {/* FOOTER CORPORATIVO: Información legal y de sistema */}
      <footer className="bg-white border-t border-slate-100 py-10 px-6 text-center">
        <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.4em]">Intranet Corporativa Directorio Corporativo Integrado</p>
      </footer>
    </div>
  );
}
