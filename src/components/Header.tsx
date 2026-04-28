/**
 * Proyecto: Intranet Corporativa - Grupo Simex
 * Autor: Juan Fernando Agudelo
 * Descripción: Encabezado dinámico con sistema de navegación inteligente, 
 * gestión de empresas y visualizador inmersivo de boletines.
 */
import React, { useRef, useState, useEffect } from 'react';
import { Menu, X, Camera, Video, User, Settings, ChevronDown, Building2, LayoutDashboard, ChevronRight, Globe, FileText } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate, useLocation } from 'react-router-dom';
import { CONFIG, MODULES_BY_COMPANY } from '../constants/config';
import { CompanyCode, Module } from '../types';

interface HeaderProps {
  currentCompany: CompanyCode;
  setCurrentCompany: (company: CompanyCode) => void;
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: (open: boolean) => void;
  isAdminLoggedIn: boolean;
  onAdminClick: () => void;
  onVideosClick: () => void;
  onRHVideoClick: () => void;
  onPartyPhotosClick: () => void;
  bulletinQuincenal: { SX: any[]; SO: any[]; PL: any[] };
  bulletinMensual: any[];
  handleModuleClick: (mod: Module) => void;
}

/**
 * Componente Header: Maneja la navegación principal, el cambio de empresa,
 * los accesos directos a módulos y la visualización del boletín semanal.
 */
export const Header: React.FC<HeaderProps> = ({
  currentCompany,
  setCurrentCompany,
  isMobileMenuOpen,
  setIsMobileMenuOpen,
  isAdminLoggedIn,
  onAdminClick,
  onVideosClick,
  onRHVideoClick,
  onPartyPhotosClick,
  bulletinQuincenal,
  bulletinMensual,
  handleModuleClick
}) => {
  // --- ESTADOS LOCALES ---
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [activeSubMenu, setActiveSubMenu] = useState<string | null>(null);
  const [activeSubSubMenu, setActiveSubSubMenu] = useState<string | null>(null);
  const [expandedCompany, setExpandedCompany] = useState<CompanyCode | null>(null);
  
  // Referencia para detectar clics fuera de los menús desplegables
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const location = useLocation();

  /**
   * Efecto para cerrar los menús desplegables al hacer clic fuera de ellos.
   */
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setActiveDropdown(null);
        setActiveSubMenu(null);
        setActiveSubSubMenu(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  /**
   * Alterna la visibilidad de los menús desplegables superiores.
   */
  const toggleDropdown = (name: string | null) => {
    setActiveDropdown(activeDropdown === name ? null : name);
    setActiveSubMenu(null);
    setActiveSubSubMenu(null);
  };

  /**
   * Maneja el cambio de empresa y actualiza la URL.
   */
  const handleCompanyChange = (company: CompanyCode) => {
    setCurrentCompany(company);
    const companyName = company === 'SX' ? 'Simex' : company === 'SO' ? 'Soinco' : 'Plastinovo';
    navigate(`/${companyName}`);
    setExpandedCompany(expandedCompany === company ? null : company);
  };

  /**
   * Configuración de los Dashboards de Máquinas por empresa.
   */
  const dashboardMaquinas = {
    name: "Dashboard Maquinas",
    items: [
      {
        name: "Simex",
        code: 'SX',
        subItems: [
          { name: "Estado Planta", url: "http://epicordb10/ReportServer/Pages/ReportViewer.aspx?%2fReportsCustom%2fMES_Produccion%2fEstado_Maquinas_Planta&rs:Command=Render" },
          {
            name: "P-Producción",
            subItems: [
              { name: "P-Ensamble", url: "http://epicordb10/ReportServer/Pages/ReportViewer.aspx?%2fReportsCustom%2fMES_Produccion%2fEstado_Maquina_Ens&rs:Command=Render" },
              { name: "P-Envases", url: "http://epicordb10/ReportServer/Pages/ReportViewer.aspx?%2fReportsCustom%2fMES_Produccion%2fEstado_Maquinas&rs:Command=Render" },
              { name: "P-Estampacion", url: "http://epicordb10/ReportServer/Pages/ReportViewer.aspx?%2fReportsCustom%2fMES_Produccion%2fEstado_Maquinas_Estampacion_SX&rs:Command=Render" },
              { name: "P-Inyeccion", url: "http://epicordb10/ReportServer/Pages/ReportViewer.aspx?%2fReportsCustom%2fMES_Produccion%2fEstado_Maquinas_Inyeccion_SX&rs:Command=Render" },
              { name: "P-Tampografia-Serigrafia", url: "http://epicordb10/ReportServer/Pages/ReportViewer.aspx?%2fReportsCustom%2fMES_Produccion%2fEstado_Maquinas_Tampografia_SX&rs:Command=Render" }
            ]
          },
          {
            name: "Paros",
            subItems: [
              { name: "P-Calidad", url: "http://epicordb10/ReportServer/Pages/ReportViewer.aspx?%2fReportsCustom%2fMES_Produccion%2fEstado_Paros_x_Calidad_SX&rs:Command=Render" },
              { name: "P-Mantenimiento", url: "http://epicordb10/ReportServer/Pages/ReportViewer.aspx?%2fReportsCustom%2fMES_Produccion%2fEstado_Paros_x_Mtto_SX&rs:Command=Render" },
              { name: "P-Moldes", url: "http://epicordb10/ReportServer/Pages/ReportViewer.aspx?%2fReportsCustom%2fMES_Produccion%2fEstado_Paros_x_Molde_SX&rs:Command=Render" }
            ]
          },
          {
            name: "T-Moldes",
            subItems: [
              { name: "Planta Moldes", url: "http://epicordb10/ReportServer/Pages/ReportViewer.aspx?%2fReportsCustom%2fMES_Produccion%2fEstado_Maquinas_Moldes&rs:Command=Render" },
              { name: "T-Banco Pulida", url: "http://epicordb10/ReportServer/Pages/ReportViewer.aspx?%2fReportsCustom%2fMES_Produccion%2fEstado_Maquinas_BAN&rs:Command=Render" },
              { name: "T-Banco Ensamble", url: "http://epicordb10/ReportServer/Pages/ReportViewer.aspx?%2fReportsCustom%2fMES_Produccion%2fEstado_Maquinas_BCO&rs:Command=Render" },
              { name: "T-Mecanizado", url: "http://epicordb10/ReportServer/Pages/ReportViewer.aspx?%2fReportsCustom%2fMES_Produccion%2fEstado_Maquinas_CME&rs:Command=Render" },
              { name: "T-Electroerosión", url: "http://epicordb10/ReportServer/Pages/ReportViewer.aspx?%2fReportsCustom%2fMES_Produccion%2fEstado_Maquinas_EER&rs:Command=Render" },
              { name: "T-Programación", url: "http://epicordb10/ReportServer/Pages/ReportViewer.aspx?%2fReportsCustom%2fMES_Produccion%2fEstado_Maquinas_PRG&rs:Command=Render" },
              { name: "T-Rectificado", url: "http://epicordb10/ReportServer/Pages/ReportViewer.aspx?%2fReportsCustom%2fMES_Produccion%2fEstado_Maquinas_RTF&rs:Command=Render" },
              { name: "T-Torno", url: "http://epicordb10/ReportServer/Pages/ReportViewer.aspx?%2fReportsCustom%2fMES_Produccion%2fEstado_Maquinas_TOR&rs:Command=Render" },
              { name: "T-Const Moldes", url: "http://epicordb10/ReportServer/Pages/ReportViewer.aspx?%2fReportsCustom%2fMES_Produccion%2fEstado_Maquinas_CMO&rs:Command=Render" }
            ]
          }
        ]
      },
      {
        name: "Soinco",
        code: 'SO',
        subItems: [
          { name: "Estado Planta", url: "http://epicordb10/ReportServer/Pages/ReportViewer.aspx?%2fReportsCustom%2fMES_Produccion%2fEstado_Maquinas_Planta_SO&rs:Command=Render" },
          { name: "P-Inyección", url: "http://epicordb10/ReportServer/Pages/ReportViewer.aspx?%2fReportsCustom%2fMES_Produccion%2fEstado_Maquina_Inyeccion_Soinco_TODO&rs:Command=Render" },
          { name: "P-Acabados", url: "http://epicordb10/ReportServer/Pages/ReportViewer.aspx?%2fReportsCustom%2fMES_Produccion%2fEstado_Maquina_Decoracion_Soinco&rs:Command=Render" }
        ]
      },
      { 
        name: "Plastinovo",
        code: 'PL',
        subItems: [
          { name: "Estado Planta", url: "http://epicordb10/ReportServer/Pages/ReportViewer.aspx?%2fReportsCustom%2fMES_Produccion%2fEstado_Maquinas_Planta_PL&rs:Command=Render" }
        ]
      }
    ].filter(item => item.code === currentCompany)
  };

  /**
   * Abre un enlace de dashboard en una nueva pestaña.
   */
  const handleDashboardClick = (url?: string) => {
    if (url && url !== '#') {
      window.open(url, '_blank');
      setActiveDropdown(null);
      setActiveSubMenu(null);
      setActiveSubSubMenu(null);
      setIsMobileMenuOpen(false);
    } else if (url === '#') {
      alert('Este enlace aún no ha sido configurado.');
    }
  };

  /**
   * Determina el color del icono del boletín basado en la empresa actual.
   * Mantiene la identidad visual sin romper el estilo uniforme de los botones.
   */
  const getBulletinIconColor = () => {
    switch(currentCompany) {
      case 'SX': return 'text-blue-400';
      case 'SO': return 'text-red-400';
      case 'PL': return 'text-orange-400';
      default: return 'text-orange-400';
    }
  };

  return (
    <header className="sticky top-0 z-[50000] bg-[var(--primary)]/90 backdrop-blur-md text-white px-4 md:px-8 py-2 md:py-3 flex justify-between items-center shadow-lg border-b border-white/10 transition-all duration-300">
      <div className="flex items-center gap-2 md:gap-5 shrink-0">
        <img 
          src={CONFIG.LOGOS[currentCompany]} 
          alt="Logo" 
          className="h-7 md:h-10 w-auto max-w-[120px] md:max-w-[180px] object-contain transition-transform hover:scale-105"
        />
        <span className="hidden lg:block font-bold text-lg xl:text-xl uppercase tracking-wider">Intranet Corporativa</span>
      </div>

      <button 
        className="md:hidden p-2 hover:bg-white/10 rounded-lg transition-colors"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        aria-label={isMobileMenuOpen ? "Cerrar menú" : "Abrir menú"}
      >
        {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/98 backdrop-blur-2xl z-[80000] md:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}
      </AnimatePresence>

      <nav 
        ref={dropdownRef}
        className={`
          fixed md:static inset-y-0 right-0 w-[95%] md:w-auto
          bg-white md:bg-transparent
          flex flex-col md:flex-row items-start md:items-center gap-8 md:gap-2
          p-10 md:p-0 transition-transform duration-500 z-[80001] ease-out
          ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full md:translate-x-0'}
          shadow-[-50px_0_150px_rgba(0,0,0,0.95)] md:shadow-none
          md:pointer-events-auto overflow-y-auto md:overflow-visible
          md:flex-nowrap md:justify-end md:ml-4 h-screen md:h-auto
        `}
      >
        <div className="flex md:hidden items-center justify-between w-full mb-6 pb-4 border-b border-gray-100 shrink-0">
           <span className="text-[var(--primary)] font-black tracking-tighter text-lg">MENÚ DE NAVEGACIÓN</span>
           <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 bg-gray-100 rounded-full text-gray-500 hover:bg-gray-200 transition-colors">
             <X size={20} />
           </button>
        </div>

        {/* Empresas Dropdown */}
        <div className="relative w-full md:w-auto shrink-0">
          <button 
            className={`
              w-full md:w-auto px-5 py-2.5 rounded-xl text-sm font-black transition-all flex items-center justify-between md:justify-center gap-2
              bg-white text-[var(--primary)] shadow-lg hover:bg-blue-50
            `}
            onClick={() => {
              toggleDropdown('EMPRESAS');
              setExpandedCompany(null);
            }}
          >
            <div className="flex items-center gap-2">
              <Building2 size={18} />
              <span>EMPRESAS</span>
            </div>
            <ChevronDown size={16} className={`transition-transform duration-300 ${activeDropdown === 'EMPRESAS' ? 'rotate-180' : ''}`} />
          </button>

          <AnimatePresence>
            {activeDropdown === 'EMPRESAS' && (
              <motion.div 
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                className="md:absolute md:top-full md:left-0 mt-3 w-full md:w-[320px] bg-white rounded-2xl shadow-2xl p-3 z-[1700] md:overflow-visible overflow-y-auto max-h-[60vh] md:max-h-none custom-scrollbar border border-gray-100"
              >
                <div className="space-y-2">
                  {(['SX', 'SO', 'PL'] as CompanyCode[]).map(company => (
                    <div key={company} className="space-y-1">
                      <button 
                        className={`
                          w-full flex items-center justify-between p-3 rounded-xl text-sm font-black transition-all
                          ${currentCompany === company ? 'bg-blue-50 text-[var(--primary)]' : 'text-gray-500 hover:bg-gray-50'}
                        `}
                        onClick={() => handleCompanyChange(company)}
                      >
                        <span>{company === 'SX' ? 'SIMEX' : company === 'SO' ? 'SOINCO' : 'PLASTINOVO'}</span>
                        {currentCompany === company && <div className="w-2 h-2 bg-[var(--primary)] rounded-full" />}
                      </button>
                      
                      {expandedCompany === company && (
                        <motion.div 
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          className="pl-4 space-y-1 overflow-hidden"
                        >
                          {MODULES_BY_COMPANY[company].map(mod => (
                            <button 
                              key={mod.id}
                              className="w-full flex items-center gap-3 p-2 rounded-lg text-gray-600 hover:bg-gray-50 hover:text-[var(--primary)] transition-all text-xs font-bold text-left group"
                              onClick={() => {
                                handleModuleClick(mod);
                                setActiveDropdown(null);
                                setIsMobileMenuOpen(false);
                              }}
                            >
                              <mod.icon size={14} className="text-gray-400 group-hover:text-[var(--primary)] transition-colors" />
                              {mod.name}
                            </button>
                          ))}
                        </motion.div>
                      )}
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Dashboard Máquinas Dropdown */}
        <div className="relative w-full md:w-auto shrink-0">
          <button 
            className={`
              w-full md:w-auto px-5 py-2.5 rounded-xl text-sm font-black transition-all flex items-center justify-between md:justify-center gap-2
              bg-gray-50 md:bg-white/10 text-gray-700 md:text-white hover:bg-gray-100 md:hover:bg-white/20 border border-gray-100 md:border-white/20
            `}
            onClick={() => toggleDropdown('DASHBOARD')}
          >
            <div className="flex items-center gap-2">
              <LayoutDashboard size={18} />
              <span>Dashboard Máquinas</span>
            </div>
            <ChevronDown size={16} className={`transition-transform duration-300 ${activeDropdown === 'DASHBOARD' ? 'rotate-180' : ''}`} />
          </button>

          <AnimatePresence>
            {activeDropdown === 'DASHBOARD' && (
              <motion.div 
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                className="md:absolute md:top-full md:left-0 mt-3 w-full md:w-[300px] bg-white rounded-2xl shadow-2xl p-3 z-[1700] md:overflow-visible overflow-y-auto max-h-[60vh] md:max-h-none custom-scrollbar border border-gray-100"
              >
                <div className="space-y-1">
                  {dashboardMaquinas.items.map(item => (
                    <div key={item.name} className="relative group">
                      <button 
                        className="w-full flex items-center justify-between p-3 rounded-xl text-sm font-bold text-gray-700 hover:bg-blue-50 hover:text-[var(--primary)] transition-all"
                        onClick={() => {
                          if (item.subItems) {
                            setActiveSubMenu(activeSubMenu === item.name ? null : item.name);
                          } else {
                            setActiveDropdown(null);
                            setIsMobileMenuOpen(false);
                          }
                        }}
                      >
                        <span>{item.name}</span>
                        {item.subItems && <ChevronRight size={16} className={`transition-transform ${activeSubMenu === item.name ? 'rotate-90' : ''}`} />}
                      </button>

                      {/* Submenu Level 1 */}
                      <AnimatePresence>
                        {activeSubMenu === item.name && item.subItems && (
                          <motion.div 
                            initial={{ opacity: 0, x: 10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 10 }}
                            className="md:absolute md:left-full md:top-0 md:ml-2 w-full md:w-[250px] bg-white rounded-2xl shadow-2xl p-3 border border-gray-100 z-[1800]"
                          >
                            <div className="space-y-1">
                              {item.subItems.map(subItem => (
                                <div key={subItem.name} className="relative">
                                  <button 
                                    className="w-full flex items-center justify-between p-2.5 rounded-lg text-xs font-bold text-gray-600 hover:bg-gray-50 hover:text-[var(--primary)] transition-all"
                                    onClick={() => {
                                      if (subItem.subItems) {
                                        setActiveSubSubMenu(activeSubSubMenu === subItem.name ? null : subItem.name);
                                      } else {
                                        handleDashboardClick(subItem.url);
                                      }
                                    }}
                                  >
                                    <span>{subItem.name}</span>
                                    {subItem.subItems && <ChevronRight size={14} className={`transition-transform ${activeSubSubMenu === subItem.name ? 'rotate-90' : ''}`} />}
                                  </button>

                                  {/* Submenu Level 2 */}
                                  <AnimatePresence>
                                    {activeSubSubMenu === subItem.name && subItem.subItems && (
                                      <motion.div 
                                        initial={{ opacity: 0, x: 10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: 10 }}
                                        className="md:absolute md:left-full md:top-0 md:ml-2 w-full md:w-[220px] bg-white rounded-xl shadow-2xl p-2 border border-gray-100 z-[1900]"
                                      >
                                        <div className="space-y-1 max-h-[300px] overflow-y-auto custom-scrollbar">
                                          {subItem.subItems.map(subSubItem => (
                                            <button 
                                              key={subSubItem.name}
                                              className="w-full p-2 rounded-lg text-[11px] font-bold text-gray-500 hover:bg-gray-50 hover:text-[var(--primary)] transition-all text-left"
                                              onClick={() => {
                                                handleDashboardClick(subSubItem.url);
                                              }}
                                            >
                                              {subSubItem.name}
                                            </button>
                                          ))}
                                        </div>
                                      </motion.div>
                                    )}
                                  </AnimatePresence>
                                </div>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Sitios Web Dropdown */}
        <div className="relative w-full md:w-auto shrink-0">
          <button 
            className={`
              w-full md:w-auto px-3 py-2 rounded-xl text-xs font-black transition-all flex items-center justify-between md:justify-center gap-2
              bg-gray-50 md:bg-white/10 text-gray-700 md:text-white hover:bg-gray-100 md:hover:bg-white/20 border border-gray-100 md:border-white/20
            `}
            onClick={() => toggleDropdown('SITIOS')}
          >
            <div className="flex items-center gap-2">
              <Globe size={16} />
              <span>Sitios Web</span>
            </div>
            <ChevronDown size={14} className={`transition-transform duration-300 ${activeDropdown === 'SITIOS' ? 'rotate-180' : ''}`} />
          </button>

          <AnimatePresence>
            {activeDropdown === 'SITIOS' && (
              <motion.div 
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                className="md:absolute md:top-full md:left-0 mt-3 w-full md:w-[350px] bg-white rounded-2xl shadow-2xl p-2 z-[1700] border border-gray-100"
              >
                <div className="flex gap-2">
                  <button 
                    className="flex-1 flex items-center justify-center p-2.5 rounded-xl text-[10px] font-black text-gray-700 hover:bg-blue-50 hover:text-[var(--primary)] transition-all border border-gray-50 uppercase tracking-tighter"
                    onClick={() => {
                      window.open('https://www.simex.com.co/', '_blank');
                      setActiveDropdown(null);
                      setIsMobileMenuOpen(false);
                    }}
                  >
                    Simex
                  </button>
                  <button 
                    className="flex-1 flex items-center justify-center p-2.5 rounded-xl text-[10px] font-black text-gray-700 hover:bg-blue-50 hover:text-[var(--primary)] transition-all border border-gray-50 uppercase tracking-tighter"
                    onClick={() => {
                      window.open('https://www.soinco-sas.com/', '_blank');
                      setActiveDropdown(null);
                      setIsMobileMenuOpen(false);
                    }}
                  >
                    Soinco
                  </button>
                  <button 
                    className="flex-1 flex items-center justify-center p-2.5 rounded-xl text-[10px] font-black text-gray-700 hover:bg-blue-50 hover:text-[var(--primary)] transition-all border border-gray-50 uppercase tracking-tighter"
                    onClick={() => {
                      window.open('https://plastinovo.com/', '_blank');
                      setActiveDropdown(null);
                      setIsMobileMenuOpen(false);
                    }}
                  >
                    Plastinovo
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <button 
          className="flex items-center gap-2 px-3 py-2 bg-gray-50 md:bg-white/10 text-gray-700 md:text-white rounded-xl text-sm font-semibold hover:bg-gray-100 md:hover:bg-white/20 transition-all group w-full md:w-auto shrink-0"
          onClick={() => {
            navigate('/directorio');
            setIsMobileMenuOpen(false);
          }}
        >
          <User size={18} className="group-hover:scale-110 transition-transform" /> 
          <span className="md:inline">Directorio</span>
        </button>

        {/* Menú Desplegable Galería */}
        <div className="relative w-full md:w-auto shrink-0">
          <button 
            className="w-full flex items-center justify-between md:justify-center gap-2 px-3 py-2 bg-gray-50 md:bg-white/10 text-gray-700 md:text-white rounded-xl text-sm font-semibold hover:bg-gray-100 md:hover:bg-white/20 transition-all group"
            onClick={() => toggleDropdown('GALERIA')}
          >
            <div className="flex items-center gap-2">
              <Camera size={18} className="group-hover:scale-110 transition-transform" /> 
              <span>Galería</span>
            </div>
            <ChevronDown size={14} className={`transition-transform duration-300 ${activeDropdown === 'GALERIA' ? 'rotate-180' : ''}`} />
          </button>
          <AnimatePresence>
            {activeDropdown === 'GALERIA' && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 10 }}
                className="md:absolute md:top-full md:left-0 mt-2 w-full md:w-40 bg-white rounded-xl shadow-2xl p-2 z-[2000] border border-gray-100"
              >
                <button 
                  className="w-full text-left px-4 py-2 hover:bg-blue-50 hover:text-[var(--primary)] rounded-lg text-xs font-bold text-gray-700 transition-colors flex items-center justify-between"
                  onClick={() => {
                    onPartyPhotosClick();
                    setActiveDropdown(null);
                    setIsMobileMenuOpen(false);
                  }}
                >
                  <span>Fotos</span>
                  <Camera size={14} />
                </button>
                <button 
                  className="w-full text-left px-4 py-2 hover:bg-blue-50 hover:text-[var(--primary)] rounded-lg text-xs font-bold text-gray-700 transition-colors flex items-center justify-between"
                  onClick={() => {
                    onVideosClick();
                    setActiveDropdown(null);
                    setIsMobileMenuOpen(false);
                  }}
                >
                  <span>Videos</span>
                  <Video size={14} />
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        
        {/* Botón del Boletín Quincenal */}
        {bulletinQuincenal?.[currentCompany] && bulletinQuincenal[currentCompany].length > 0 && (
          <button 
            className="flex items-center gap-2 px-3 py-2 bg-gray-50 md:bg-white/10 text-gray-700 md:text-white rounded-xl text-sm font-semibold hover:bg-gray-100 md:hover:bg-white/20 transition-all group w-full md:w-auto shrink-0"
            onClick={() => {
              navigate('/boletin-quincenal');
              setIsMobileMenuOpen(false);
            }}
          >
            <FileText size={18} className="group-hover:scale-110 transition-transform" /> 
            <span>Boletín Quincenal</span>
          </button>
        )}

        {/* Botón del Boletín Mensual */}
        {bulletinMensual && bulletinMensual.length > 0 && (
          <button 
            className="flex items-center gap-2 px-3 py-2 bg-gray-50 md:bg-white/10 text-gray-700 md:text-white rounded-xl text-sm font-semibold hover:bg-gray-100 md:hover:bg-white/20 transition-all group w-full md:w-auto shrink-0"
            onClick={() => {
              navigate('/boletin-mensual');
              setIsMobileMenuOpen(false);
            }}
          >
            <FileText size={18} className="group-hover:scale-110 transition-transform" /> 
            <span>Boletín Mensual</span>
          </button>
        )}

        <button 
          className="p-2 bg-gray-50 md:bg-white/10 text-gray-700 md:text-white rounded-xl hover:bg-gray-100 md:hover:bg-white/20 transition-all flex items-center gap-2 md:inline-flex group w-full md:w-auto shrink-0"
          onClick={() => {
            onAdminClick();
            setIsMobileMenuOpen(false);
          }}
        >
          <Settings size={24} className="transition-transform group-hover:rotate-90" />
          <span className="md:hidden font-semibold">Administración</span>
        </button>
      </nav>
    </header>
  );
};
