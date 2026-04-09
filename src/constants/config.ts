import { Factory, Book, ShieldCheck, Monitor, UserCheck, Contact, Clock, Tag, Banknote, Settings2, FileText, CheckCircle, Wrench, Layers, Truck, Users, HardHat, ShoppingCart, Archive, FileSpreadsheet, ClipboardList, Gauge, FileSearch, LayoutDashboard, Search } from 'lucide-react';
import { Module, CompanyCode } from '../types';

export const CONFIG = {
  DEFAULT_COMPANY: 'SX' as CompanyCode,
  SECURITY_TOKEN: 'Admin2027*',
  LOGOS: {
    SX: 'https://media.licdn.com/dms/image/v2/C4E0BAQFZHWX79Enq_g/company-logo_200_200/company-logo_200_200/0/1630580415587?e=2147483647&v=beta&t=zsj_Lhq0pgti6kAiuKfuNwk8Kq5tuFEyL9JYiew2Dmk',
    SO: 'https://media.licdn.com/dms/image/v2/C4E0BAQHN0aLWJ1NY9Q/company-logo_200_200/company-logo_200_200/0/1630607524238?e=2147483647&v=beta&t=6bmcpkeVOfN8WDHxAbWyH2fweQgFr8UEFps8ndsdk9o',
    PL: 'https://media.licdn.com/dms/image/v2/C4D0BAQEOJPOihuV0Wg/company-logo_200_200/company-logo_200_200/0/1648690982751/plastinovo_sas_logo?e=2147483647&v=beta&t=9o4jzta2a_COdM0gXh2Axc5NciTogcNFkY_xaoD-2ZE'
  }
};

export const MODULES_BY_COMPANY: Record<CompanyCode, Module[]> = {
  SX: [
    { id: 'inyeccion', name: 'Inyección', icon: Factory, type: 'external', url: 'http://srvaplicaciones/desarrollos/archivos/apps/DataInyeccionV03/system/login.php' },
    { id: 'bitacora', name: 'Bitácora', icon: Book, type: 'external', url: 'http://srvaplicaciones/desarrollos/archivos/Appsint2/bitacoraV/' },
    { id: 'circulares', name: 'Circulares', icon: Layers, type: 'external', url: 'http://srvaplicaciones/desarrollos/archivos/appsLoadFiles/circularesV/login.php' },
    { id: 'ingreso', name: 'Control Ingreso', icon: UserCheck, type: 'external', url: 'http://192.101.0.209/ControlIngreso/views/' },
    { id: 'directorio', name: 'Directorio', icon: Contact, type: 'external', url: 'http://srvaplicaciones/desarrollos/archivos/apps/directorioDinamicoV/' },
    { id: 'formatos-financieros', name: 'Formatos financieros', icon: FileSpreadsheet, type: 'external', url: 'http://srvaplicaciones/desarrollos/archivos/apps/Ffinanciera/' },
    { id: 'marcaciones', name: 'Marcaciones', icon: Clock, type: 'external', url: 'https://app.powerbi.com/view?r=eyJrIjoiMjAyODc0NmMtZTE4Ny00MTYyLWE5MDMtZDJkY2RhZDVjZDk4IiwidCI6IjUwMDI1MTNkLTcyNGEtNDc3NC1hYmEwLWMxZTZiNzI5YzhiNiIsImMiOjR9' },
    { id: 'rotulos', name: 'Rótulos', icon: Tag, type: 'external', url: 'http://srvaplicaciones/desarrollos/archivos/apps/etiquetas/' },
    { id: 'solmat', name: 'Solmat', icon: ClipboardList, type: 'external', url: 'http://srvapp/prod/SOLMAT/index.php' },
    { id: 'unidad-empaque', name: 'Unidad Empaque', icon: Archive, type: 'external', url: 'http://srvaplicaciones/desarrollos/archivos/apps/UnidadEmpaque/' },
    { id: 'ajuste-soplado', name: 'Ajuste de soplado', icon: Gauge, type: 'external', url: 'http://srvaplicaciones/desarrollos/archivos/apps/datasoplado/' },
    { id: 'cajero', name: 'Cajero', icon: Banknote, type: 'external', url: 'https://srvnomina.simex.corp/SelfService/frmLogin.aspx' },
    { id: 'consecutivos', name: 'Consecutivos', icon: FileSearch, type: 'external', url: 'http://srvaplicaciones/desarrollos/archivos/appsLoadFiles/ConsecutivosV3.0V/index_1.php' },
    { id: 'documentos-sgi', name: 'Documentos SGI', icon: ShieldCheck, type: 'external', url: 'http://srvaplicaciones/desarrollos/archivos/apps/sgi/' },
    { id: 'isolucion', name: 'Isolución', icon: Settings2, type: 'external', url: 'https://simex.isolucion.co/Homes/HomeConsulta.aspx' },
    { id: 'remisiones', name: 'Remisiones', icon: FileText, type: 'external', url: 'http://srvaplicaciones/desarrollos/archivos/apps/Remisiones_webv1.0/sistema/login.php' },
    { id: 'sbm', name: 'SBM', icon: LayoutDashboard, type: 'external', url: 'http://srvaplicaciones/desarrollos/archivos/apps/sbm/' },
    { id: 'tic', name: 'Solicitudes TIC', icon: Monitor, type: 'external', url: 'https://192.101.2.20/Helpdesk' },
    { id: 'sview', name: 'Sview', icon: Search, type: 'external', url: 'http://srvaplicaciones/desarrollos/archivos/apps/sviewV2/' }
  ],
  SO: [
    { id: 'inyeccion-soinco', name: 'Ajustes de inyeccion Soinco', icon: Factory, type: 'external', url: 'http://srvaplicaciones/desarrollos/archivos/apps/DataInyeccionsoinco/system/login.php' },
    { id: 'ingreso-soinco', name: 'Control de Ingreso', icon: UserCheck, type: 'external', url: 'http://192.101.0.209/ControlIngreso_soinco/views/' },
    { id: 'directorio', name: 'Directorio', icon: Contact, type: 'external', url: 'http://srvaplicaciones/desarrollos/archivos/apps/directorioDinamicoV/' },
    { id: 'marcaciones-soinco', name: 'Marcaciones', icon: Clock, type: 'external', url: 'https://app.powerbi.com/view?r=eyJrIjoiYTZiNWFlY2EtMDQ4ZC00NDEwLWJkNGEtOWViNjM5YmE0OTQ2IiwidCI6IjUwMDI1MTNkLTcyNGEtNDc3NC1hYmEwLWMxZTZiNzI5YzhiNiIsImMiOjR9' },
    { id: 'rotulos', name: 'Rótulos', icon: Tag, type: 'external', url: 'http://srvaplicaciones/desarrollos/archivos/apps/etiquetas/' },
    { id: 'cajero', name: 'Cajero', icon: Banknote, type: 'external', url: 'https://srvnomina.simex.corp/SelfService/frmLogin.aspx' },
    { id: 'documentos-sgi-soinco', name: 'Documentos SGI', icon: ShieldCheck, type: 'external', url: 'http://srvaplicaciones/desarrollos/apps/soinco/sgi/' },
    { id: 'isolucion', name: 'Isolución', icon: Settings2, type: 'external', url: 'https://simex.isolucion.co/Homes/HomeConsulta.aspx' },
    { id: 'tic', name: 'Solicitudes TIC', icon: Monitor, type: 'external', url: 'https://192.101.2.20/Helpdesk' }
  ],
  PL: [
    { id: 'inyeccion-pl', name: 'Ajuste de inyección', icon: Factory, type: 'external', url: 'http://srvaplicaciones/desarrollos/archivos/apps/DataInyeccionplast/system/login.php' },
    { id: 'ingreso-pl', name: 'Control Ingreso', icon: UserCheck, type: 'external', url: 'http://192.101.0.209/ControlIngreso_pl/views/' },
    { id: 'directorio', name: 'Directorio', icon: Contact, type: 'external', url: 'http://srvaplicaciones/desarrollos/archivos/apps/directorioDinamicoV/' },
    { id: 'marcaciones-pl', name: 'Marcaciones', icon: Clock, type: 'external', url: 'https://app.powerbi.com/view?r=eyJrIjoiOTA2NmRmYWMtNjU0NC00ZDliLTllMjUtZDYyMmJmNDkwOGQyIiwidCI6IjUwMDI1MTNkLTcyNGEtNDc3NC1hYmEwLWMxZTZiNzI5YzhiNiIsImMiOjR9' },
    { id: 'cajero', name: 'Cajero', icon: Banknote, type: 'external', url: 'https://srvnomina.simex.corp/SelfService/frmLogin.aspx' },
    { id: 'remisiones', name: 'Remisiones', icon: FileText, type: 'external', url: 'http://srvaplicaciones/desarrollos/archivos/apps/Remisiones_webv1.0/sistema/login.php' },
    { id: 'documentos-sgi-pl', name: 'Documentos SGI', icon: ShieldCheck, type: 'external', url: 'http://srvaplicaciones/desarrollos/apps/plastinovo/sgi/' },
    { id: 'isolucion', name: 'Isolución', icon: Settings2, type: 'external', url: 'https://simex.isolucion.co/Homes/HomeConsulta.aspx' },
    { id: 'pausas-activas', name: 'Pausas Activas', icon: HardHat, type: 'external', url: 'http://srvaplicaciones/desarrollos/archivos/apps/SXPausasActivas/' },
    { id: 'tic', name: 'Solicitudes TIC', icon: Monitor, type: 'external', url: 'https://192.101.2.20/Helpdesk' }
  ]
};
