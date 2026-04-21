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
  const [showBulletin, setShowBulletin] = useState(false);
  const [viewingBulletinType, setViewingBulletinType] = useState<'quincenal' | 'mensual' | null>(null);
  
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
        subItems: [
          { name: "Estado Planta", url: "http://epicordb10/ReportServer/Pages/ReportViewer.aspx?%2fReportsCustom%2fMES_Produccion%2fEstado_Maquinas_Planta_SO&rs:Command=Render" },
          { name: "P-Inyección", url: "http://epicordb10/ReportServer/Pages/ReportViewer.aspx?%2fReportsCustom%2fMES_Produccion%2fEstado_Maquina_Inyeccion_Soinco_TODO&rs:Command=Render" },
          { name: "P-Acabados", url: "http://epicordb10/ReportServer/Pages/ReportViewer.aspx?%2fReportsCustom%2fMES_Produccion%2fEstado_Maquina_Decoracion_Soinco&rs:Command=Render" }
        ]
      },
      { 
        name: "Plastinovo",
        subItems: [
          { name: "Estado Planta", url: "http://epicordb10/ReportServer/Pages/ReportViewer.aspx?%2fReportsCustom%2fMES_Produccion%2fEstado_Maquinas_Planta_PL&rs:Command=Render" }
        ]
      }
    ]
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
    <header className="sticky top-0 z-[1500] bg-[var(--primary)]/90 backdrop-blur-md text-white px-4 md:px-8 py-3 flex justify-between items-center shadow-lg border-b border-white/10 transition-all duration-300">
      <div className="flex items-center gap-3 md:gap-5">
        <img 
          src={CONFIG.LOGOS[currentCompany]} 
          alt="Logo" 
          className="h-8 md:h-10 w-auto max-w-[150px] md:max-w-[180px] object-contain transition-transform hover:scale-105"
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

      <nav 
        ref={dropdownRef}
        className={`
          fixed md:static top-[60px] md:top-0 right-0 bottom-0 w-[280px] md:w-auto
          bg-[var(--primary)] md:bg-transparent
          flex flex-col md:flex-row items-start md:items-center gap-6 md:gap-6
          p-6 md:p-0 transition-transform duration-300 z-[1600]
          ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full md:translate-x-0'}
          shadow-[-5px_0_20px_rgba(0,0,0,0.2)] md:shadow-none
        `}
      >
        {/* Empresas Dropdown */}
        <div className="relative w-full md:w-auto">
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
                className="md:absolute md:top-full md:left-0 mt-3 w-full md:w-[320px] glass rounded-2xl shadow-2xl p-3 z-[1700] md:overflow-visible overflow-y-auto max-h-[60vh] md:max-h-none custom-scrollbar"
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
        <div className="relative w-full md:w-auto">
          <button 
            className={`
              w-full md:w-auto px-5 py-2.5 rounded-xl text-sm font-black transition-all flex items-center justify-between md:justify-center gap-2
              bg-white/10 text-white hover:bg-white/20 border border-white/20
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
                className="md:absolute md:top-full md:left-0 mt-3 w-full md:w-[300px] glass rounded-2xl shadow-2xl p-3 z-[1700] md:overflow-visible overflow-y-auto max-h-[60vh] md:max-h-none custom-scrollbar"
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
        <div className="relative w-full md:w-auto">
          <button 
            className={`
              w-full md:w-auto px-5 py-2.5 rounded-xl text-sm font-black transition-all flex items-center justify-between md:justify-center gap-2
              bg-white/10 text-white hover:bg-white/20 border border-white/20
            `}
            onClick={() => toggleDropdown('SITIOS')}
          >
            <div className="flex items-center gap-2">
              <Globe size={18} />
              <span>Sitios Web</span>
            </div>
            <ChevronDown size={16} className={`transition-transform duration-300 ${activeDropdown === 'SITIOS' ? 'rotate-180' : ''}`} />
          </button>

          <AnimatePresence>
            {activeDropdown === 'SITIOS' && (
              <motion.div 
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                className="md:absolute md:top-full md:left-0 mt-3 w-full md:w-[240px] glass rounded-2xl shadow-2xl p-3 z-[1700]"
              >
                <div className="space-y-1">
                  <button 
                    className="w-full flex items-center justify-between p-3 rounded-xl text-sm font-bold text-gray-700 hover:bg-blue-50 hover:text-[var(--primary)] transition-all"
                    onClick={() => {
                      window.open('https://www.simex.com.co/', '_blank');
                      setActiveDropdown(null);
                      setIsMobileMenuOpen(false);
                    }}
                  >
                    Simex
                  </button>
                  <button 
                    className="w-full flex items-center justify-between p-3 rounded-xl text-sm font-bold text-gray-700 hover:bg-blue-50 hover:text-[var(--primary)] transition-all"
                    onClick={() => {
                      window.open('https://www.soinco-sas.com/', '_blank');
                      setActiveDropdown(null);
                      setIsMobileMenuOpen(false);
                    }}
                  >
                    Soinco
                  </button>
                  <button 
                    className="w-full flex items-center justify-between p-3 rounded-xl text-sm font-bold text-gray-700 hover:bg-blue-50 hover:text-[var(--primary)] transition-all"
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

        <div className="flex flex-col md:flex-row gap-3 w-full md:w-auto border-t md:border-none border-white/10 pt-6 md:pt-0">
          <button 
            className="flex items-center gap-2 px-4 py-2 bg-white/10 rounded-xl text-sm font-semibold hover:bg-white/20 transition-all group"
            onClick={() => {
              navigate('/directorio');
              setIsMobileMenuOpen(false);
            }}
          >
            <User size={18} className="group-hover:scale-110 transition-transform" /> Directorio
          </button>
          <button 
            className="flex items-center gap-2 px-4 py-2 bg-white/10 rounded-xl text-sm font-semibold hover:bg-white/20 transition-all group"
            onClick={() => {
              onPartyPhotosClick();
              setIsMobileMenuOpen(false);
            }}
          >
            <Camera size={18} className="group-hover:scale-110 transition-transform" /> Ver las fotos de la fiesta
          </button>
          <button 
            className="flex items-center gap-2 px-4 py-2 bg-white/10 rounded-xl text-sm font-semibold hover:bg-white/20 transition-all group"
            onClick={() => {
              onVideosClick();
              setIsMobileMenuOpen(false);
            }}
          >
            <Video size={18} className="group-hover:scale-110 transition-transform" /> Vídeos
          </button>
          
          {/* Botón del Boletín Quincenal: Específico por empresa */}
          {bulletinQuincenal?.[currentCompany] && bulletinQuincenal[currentCompany].length > 0 && (
            <button 
              className="flex items-center gap-2 px-4 py-2 bg-white/10 rounded-xl text-sm font-semibold hover:bg-white/20 transition-all group"
              onClick={() => {
                setViewingBulletinType('quincenal');
                setShowBulletin(true);
                setIsMobileMenuOpen(false);
              }}
            >
              <FileText size={18} className="text-white group-hover:scale-110 transition-transform" /> 
              <span>Boletín Quincenal</span>
            </button>
          )}

          {/* Botón del Boletín Mensual: Global para todos */}
          {bulletinMensual && bulletinMensual.length > 0 && (
            <button 
              className="flex items-center gap-2 px-4 py-2 bg-white/10 rounded-xl text-sm font-semibold hover:bg-white/20 transition-all group"
              onClick={() => {
                setViewingBulletinType('mensual');
                setShowBulletin(true);
                setIsMobileMenuOpen(false);
              }}
            >
              <FileText size={18} className="text-white group-hover:scale-110 transition-transform" /> 
              <span>Boletín Mensual</span>
            </button>
          )}

          <button 
            className="p-2 bg-white/10 rounded-xl hover:bg-white/20 transition-all flex items-center gap-2 md:block group"
            onClick={() => {
              onAdminClick();
              setIsMobileMenuOpen(false);
            }}
          >
            <Settings size={24} className="transition-transform group-hover:rotate-90" />
            <span className="md:hidden font-semibold">Administración</span>
          </button>
        </div>
      </nav>

      {/* Visualizador de Boletines: Diseño elegante para fotos verticales */}
      <AnimatePresence>
        {showBulletin && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[3000] bg-black/40 backdrop-blur-md flex items-center justify-center p-4 md:p-10"
          >
            <motion.div 
              initial={{ scaleY: 0, opacity: 0 }}
              animate={{ scaleY: 1, opacity: 1 }}
              exit={{ scaleY: 0, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="w-full h-full bg-black/95 backdrop-blur-3xl rounded-[40px] shadow-[0_0_100px_rgba(0,0,0,0.5)] border border-white/10 flex flex-col overflow-hidden origin-top"
            >
              {/* Barra superior minimalista */}
              <div className="flex justify-between items-center p-6 md:px-12 border-b border-white/5 bg-white/5">
                <div className="flex flex-col">
                  <h2 className="text-2xl font-black text-white tracking-tighter">
                    {viewingBulletinType === 'quincenal' ? 'Boletín Quincenal' : 'Boletín Mensual'}
                  </h2>
                  <p className="text-white/40 text-[10px] font-black uppercase tracking-[0.2em] mt-1">
                    {viewingBulletinType === 'quincenal' 
                      ? `${(bulletinQuincenal?.[currentCompany] || []).length} PÁGINAS • ${currentCompany === 'SX' ? 'SIMEX' : currentCompany === 'SO' ? 'SOINCO' : 'PLASTINOVO'}`
                      : `${(bulletinMensual || []).length} PÁGINAS • CORPORATIVO GLOBAL`
                    }
                  </p>
                </div>
                <button 
                  onClick={() => {
                    setShowBulletin(false);
                    setViewingBulletinType(null);
                  }}
                  className="p-3 bg-white/10 hover:bg-white/20 rounded-2xl text-white transition-all hover:rotate-90"
                >
                  <X size={24} />
                </button>
              </div>
              
              {/* Contenedor de imágenes: Enfoque en fotos verticales y scroll suave */}
              <div className="flex-grow overflow-y-auto p-4 md:p-12 custom-scrollbar flex justify-center scroll-smooth bg-gradient-to-b from-transparent via-black/20 to-transparent">
                <div className="w-full max-w-7xl space-y-16 py-10">
                  {(viewingBulletinType === 'quincenal' ? (bulletinQuincenal?.[currentCompany] || []) : (bulletinMensual || [])).map((img: any, idx: number) => (
                    <motion.div 
                      key={img.id}
                      initial={{ opacity: 0, y: 50 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: "-50px" }}
                      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                      className="relative"
                    >
                      <div className="relative rounded-3xl overflow-hidden shadow-[0_50px_100px_-20px_rgba(0,0,0,0.7)] border border-white/10 bg-white/5 group">
                        {img.type?.includes('pdf') || img.url?.startsWith('data:application/pdf') ? (
                          <div className="flex flex-col w-full">
                            <div className="bg-white/5 p-4 flex justify-between items-center border-b border-white/10 backdrop-blur-sm">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-red-500/20 rounded-lg flex items-center justify-center text-red-400">
                                  <FileText size={18} />
                                </div>
                                <span className="text-xs font-bold text-white tracking-wide truncate max-w-[200px]">{img.name || 'Documento PDF'}</span>
                              </div>
                              <button 
                                onClick={() => {
                                  const link = document.createElement('a');
                                  link.href = img.url;
                                  link.download = img.name || 'boletin.pdf';
                                  link.click();
                                }}
                                className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all hover:scale-105 active:scale-95"
                              >
                                Descargar Completo
                              </button>
                            </div>
                            <iframe 
                              src={`${img.url}#toolbar=0&navpanes=0&scrollbar=1`} 
                              title={`Página ${idx + 1}`}
                              className="w-full h-[80vh] md:h-[90vh] block border-none bg-white"
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

                      {/* Indicador de página vertical elegante */}
                      <div className="absolute -left-20 top-0 bottom-0 hidden xl:flex flex-col items-center justify-center gap-4 opacity-30 hover:opacity-100 transition-opacity">
                        <div className="w-[1px] flex-grow bg-gradient-to-b from-transparent via-white to-transparent" />
                        <div className="flex flex-col items-center gap-1">
                          <span className="text-[10px] font-black text-white rotate-180 [writing-mode:vertical-lr] tracking-[0.4em]">PÁGINA</span>
                          <span className="text-2xl font-black text-white tabular-nums tracking-tighter">{idx + 1 < 10 ? `0${idx + 1}` : idx + 1}</span>
                        </div>
                        <div className="w-[1px] flex-grow bg-gradient-to-b from-transparent via-white to-transparent" />
                      </div>
                    </motion.div>
                  ))}
                  <div className="py-32 text-center space-y-6">
                    <div className="w-20 h-20 bg-white/5 rounded-[30px] flex items-center justify-center mx-auto border border-white/10 rotate-45 group hover:rotate-90 transition-transform duration-700">
                      <FileText size={32} className="text-white/20 -rotate-45 group-hover:-rotate-90 transition-transform duration-700" />
                    </div>
                    <p className="text-white text-sm font-black uppercase tracking-[0.5em] opacity-30">Fin de la Edición</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
