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
            onClick={() => window.open('http://srvaplicaciones/desarrollos/archivos/apps/directorioDinamicoV/', '_blank')}
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
          {bulletinQuincenal[currentCompany] && bulletinQuincenal[currentCompany].length > 0 && (
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
            className="fixed inset-0 z-[3000] bg-black/90 backdrop-blur-xl flex flex-col"
          >
            {/* Barra superior minimalista */}
            <div className="flex justify-between items-center p-6 md:px-12">
              <div className="flex flex-col">
                <h2 className="text-2xl font-black text-white tracking-tighter flex items-center gap-3">
                  {viewingBulletinType === 'quincenal' ? 'Boletín Quincenal' : 'Boletín Mensual'}
                </h2>
                <p className="text-white/40 text-xs font-bold uppercase tracking-widest">
                  {viewingBulletinType === 'quincenal' 
                    ? `${bulletinQuincenal[currentCompany].length} Páginas • ${currentCompany === 'SX' ? 'Simex' : currentCompany === 'SO' ? 'Soinco' : 'Plastinovo'}`
                    : `${bulletinMensual.length} Páginas • Corporativo Global`
                  }
                </p>
              </div>
              <button 
                onClick={() => {
                  setShowBulletin(false);
                  setViewingBulletinType(null);
                }}
                className="p-4 bg-white/5 hover:bg-white/10 rounded-full text-white transition-all hover:scale-110 active:scale-95"
              >
                <X size={28} />
              </button>
            </div>
            
            {/* Contenedor de imágenes: Enfoque en fotos verticales y scroll suave */}
            <div className="flex-grow overflow-y-auto p-4 md:p-8 custom-scrollbar flex justify-center scroll-smooth">
              <div className="w-full max-w-2xl space-y-12 py-8">
                {(viewingBulletinType === 'quincenal' ? bulletinQuincenal[currentCompany] : bulletinMensual).map((img: any, idx: number) => (
                  <motion.div 
                    key={img.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    className="relative group"
                  >
                    {/* Sombra suave y bordes redondeados elegantes */}
                    <div className="absolute -inset-4 bg-white/5 rounded-[40px] blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                    
                    <div className="relative rounded-2xl overflow-hidden shadow-[0_32px_64px_-16px_rgba(0,0,0,0.6)] border border-white/10 bg-white/5">
                      {img.type?.includes('pdf') || img.url?.startsWith('data:application/pdf') ? (
                        <div className="flex flex-col w-full">
                          <div className="bg-white/10 p-4 flex justify-between items-center border-b border-white/10">
                            <div className="flex items-center gap-3">
                              <FileText className="text-red-400" size={20} />
                              <span className="text-xs font-bold text-white truncate max-w-[200px]">{img.name || 'Documento PDF'}</span>
                            </div>
                            <button 
                              onClick={() => {
                                const link = document.createElement('a');
                                link.href = img.url;
                                link.download = img.name || 'boletin.pdf';
                                link.click();
                              }}
                              className="px-3 py-1 bg-white/10 hover:bg-white/20 rounded-lg text-[10px] font-black uppercase tracking-wider transition-colors"
                            >
                              Descargar / Ver Completo
                            </button>
                          </div>
                          <iframe 
                            src={`${img.url}#toolbar=0&navpanes=0&scrollbar=1`} 
                            title={`Página ${idx + 1}`}
                            className="w-full h-[70vh] md:h-[85vh] block border-none bg-white"
                          />
                        </div>
                      ) : (
                        <img 
                          src={img.url} 
                          alt={`Página ${idx + 1}`} 
                          className="w-full h-auto block"
                          referrerPolicy="no-referrer"
                        />
                      )}
                    </div>

                    {/* Indicador de página elegante y discreto */}
                    <div className="absolute -left-12 top-1/2 -translate-y-1/2 hidden lg:flex flex-col items-center gap-2">
                      <div className="w-px h-12 bg-gradient-to-b from-transparent via-white/20 to-transparent" />
                      <span className="text-[10px] font-black text-white/20 rotate-180 [writing-mode:vertical-lr]">
                        PÁG {idx + 1}
                      </span>
                      <div className="w-px h-12 bg-gradient-to-b from-transparent via-white/20 to-transparent" />
                    </div>
                  </motion.div>
                ))}
                
                {/* Final del boletín */}
                <div className="py-20 text-center space-y-4">
                  <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center mx-auto">
                    <FileText size={20} className="text-white/20" />
                  </div>
                  <p className="text-white/20 text-[10px] font-black uppercase tracking-[0.3em]">
                    Has llegado al final
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
