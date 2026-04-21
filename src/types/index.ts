/**
 * Define un módulo o acceso directo en la pantalla principal.
 */
export interface Module {
  id: string;      // Identificador único del módulo
  name: string;    // Nombre visible para el usuario
  icon: any;       // Componente de icono de Lucide
  type: 'external' | 'secure' | 'internal'; // Tipo de enlace (Abierto, Protegido o Interno)
  url: string;     // URL o ruta de navegación
}

/**
 * Representa un video (YouTube o local) para el carrusel principal.
 */
export interface Video {
  id: string | number;
  title: string;
  description?: string;
  url: string;
  type: 'youtube' | 'local';
}

/**
 * Representa un mensaje de bienvenida o visita.
 */
export interface Visit {
  id: string;
  text: string;
}

/**
 * Estructura para comunicados internos del banner superior.
 */
export interface Announcement {
  id: string | number;
  title: string;
  content: string;
  image?: string;
  active: boolean;
  company: CompanyCode | 'Global';
}

/**
 * Representa una noticia o artículo del boletín.
 */
export interface NewsItem {
  id: number;
  title: string;
  content: string;
  image?: string;
  category: string;
  author: string;
  date: string;
}

/**
 * Códigos internos de las empresas del grupo.
 */
export type CompanyCode = 'SX' | 'SO' | 'PL';

/**
 * Foto de eventos corporativos.
 */
export interface PartyPhoto {
  id: string | number;
  url: string;
  year: string;
}

/**
 * Estructura de contacto del Directorio.
 * Mapea directamente las columnas de la tabla tbl_directorio del servidor srvaplicaciones.
 */
export interface DirectoryEntry {
  id_directorio: number; // ID único de la base de datos
  nombre: string;        // Nombre completo (Usuario)
  cargo: string;         // Cargo ocupado
  empresa: string;       // Empresa (SIMEX, SOINCO, PLASTINOVO)
  extencion: string;     // Número de extensión interna
  gestion: string;       // Área o Departamento (Área)
  telefono: string;      // Teléfono directo
  email: string;         // Correo electrónico
}

/**
 * Imágenes que componen el boletín visual (imágenes de carrusel).
 */
export interface BulletinImage {
  id: string;
  url: string;
  order: number;
}
