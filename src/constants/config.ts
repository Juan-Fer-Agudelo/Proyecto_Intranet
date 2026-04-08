import { Factory, Book, ShieldCheck, Monitor, UserCheck, Contact, Clock, Tag, Banknote, Settings2, FileText, CheckCircle, Wrench, Layers, Truck, Users, HardHat, ShoppingCart, Archive } from 'lucide-react';
import { Module, CompanyCode } from '../types';

export const CONFIG = {
  DEFAULT_COMPANY: 'SX' as CompanyCode,
  SECURITY_TOKEN: 'andrea2026*',
  LOGOS: {
    SX: 'https://storage.googleapis.com/static-assets-public/ais-images/179320507912/ais-dev-gnodi6v4de5p2o7mqqi7wo-179320507912.us-east5.run.app/2026-04-07T21:30:50.000Z-image.png',
    SO: 'https://storage.googleapis.com/static-assets-public/ais-images/179320507912/ais-dev-gnodi6v4de5p2o7mqqi7wo-179320507912.us-east5.run.app/2026-04-07T15:28:06.000Z-image.png',
    PL: 'https://storage.googleapis.com/static-assets-public/ais-images/179320507912/ais-dev-gnodi6v4de5p2o7mqqi7wo-179320507912.us-east5.run.app/2026-04-07T21:30:50.000Z-image.png'
  }
};

export const MODULES_BY_COMPANY: Record<CompanyCode, Module[]> = {
  SX: [
    { id: 'inyeccion', name: 'Inyección', icon: Factory, type: 'external', url: '#' },
    { id: 'bitacora', name: 'Bitácora', icon: Book, type: 'external', url: '#' },
    { id: 'sgi', name: 'SGI', icon: ShieldCheck, type: 'secure', url: '#' },
    { id: 'tic', name: 'Solicitudes TIC', icon: Monitor, type: 'external', url: 'https://glpi.simex.com' },
    { id: 'ingreso', name: 'Control Ingreso', icon: UserCheck, type: 'external', url: '#' },
    { id: 'directorio', name: 'Directorio', icon: Contact, type: 'external', url: '#' },
    { id: 'marcaciones', name: 'Marcaciones', icon: Clock, type: 'external', url: '#' },
    { id: 'rotulos', name: 'Rótulos', icon: Tag, type: 'external', url: '#' },
    { id: 'cajero', name: 'Cajero', icon: Banknote, type: 'external', url: 'https://cajero.simex.com' },
    { id: 'isolucion', name: 'Isolución', icon: Settings2, type: 'external', url: '#' },
    { id: 'remisiones', name: 'Remisiones', icon: FileText, type: 'external', url: '#' },
    { id: 'calidad', name: 'Calidad', icon: CheckCircle, type: 'external', url: '#' },
    { id: 'mantenimiento', name: 'Mantenimiento', icon: Wrench, type: 'external', url: '#' },
    { id: 'produccion', name: 'Producción', icon: Layers, type: 'external', url: '#' },
    { id: 'logistica', name: 'Logística', icon: Truck, type: 'external', url: '#' },
    { id: 'rrhh', name: 'Recursos Humanos', icon: Users, type: 'external', url: '#' },
    { id: 'seguridad', name: 'Seguridad Industrial', icon: HardHat, type: 'external', url: '#' },
    { id: 'compras', name: 'Compras', icon: ShoppingCart, type: 'external', url: '#' },
    { id: 'inventarios', name: 'Inventarios', icon: Archive, type: 'external', url: '#' }
  ],
  SO: [
    { id: 'inyeccion', name: 'Inyección', icon: Factory, type: 'external', url: '#' },
    { id: 'ingreso', name: 'Control Ingreso', icon: UserCheck, type: 'external', url: '#' },
    { id: 'directorio', name: 'Directorio', icon: Contact, type: 'external', url: '#' },
    { id: 'marcaciones', name: 'Marcaciones', icon: Clock, type: 'external', url: '#' },
    { id: 'rotulos', name: 'Rótulos', icon: Tag, type: 'external', url: '#' },
    { id: 'cajero', name: 'Cajero', icon: Banknote, type: 'external', url: 'https://cajero.simex.com' },
    { id: 'sgi', name: 'SGI', icon: ShieldCheck, type: 'secure', url: '#' },
    { id: 'isolucion', name: 'Isolución', icon: Settings2, type: 'external', url: '#' },
    { id: 'tic', name: 'Solicitudes TIC', icon: Monitor, type: 'external', url: 'https://glpi.simex.com' }
  ],
  PL: [
    { id: 'inyeccion', name: 'Inyección', icon: Factory, type: 'external', url: '#' },
    { id: 'ingreso', name: 'Control Ingreso', icon: UserCheck, type: 'external', url: '#' },
    { id: 'directorio', name: 'Directorio', icon: Contact, type: 'external', url: '#' },
    { id: 'marcaciones', name: 'Marcaciones', icon: Clock, type: 'external', url: '#' },
    { id: 'rotulos', name: 'Rótulos', icon: Tag, type: 'external', url: '#' },
    { id: 'cajero', name: 'Cajero', icon: Banknote, type: 'external', url: 'https://cajero.simex.com' },
    { id: 'sgi', name: 'SGI', icon: ShieldCheck, type: 'secure', url: '#' },
    { id: 'isolucion', name: 'Isolución', icon: Settings2, type: 'external', url: '#' },
    { id: 'remisiones', name: 'Remisiones', icon: FileText, type: 'external', url: '#' },
    { id: 'tic', name: 'Solicitudes TIC', icon: Monitor, type: 'external', url: 'https://glpi.simex.com' }
  ]
};
