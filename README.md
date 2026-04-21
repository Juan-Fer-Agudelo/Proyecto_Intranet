# Intranet Corporativa - Grupo Simex

## Proyecto: Plataforma Unificada de Comunicación Operativa
Esta aplicación es el portal central del Grupo Simex, diseñado para unificar la comunicación, los recursos y la operatividad de sus tres empresas principales: **Simex**, **Soinco** y **Plastinovo**. La plataforma ofrece una arquitectura moderna basada en microservicios, optimizando procesos legacy hacia una interfaz de alto rendimiento.

**Autor Principal:** Juan Fernando Agudelo

---

## Módulos y Funcionalidades del Proyecto

### 1. Directorio Inteligente (Integración via Microservicios con n8n)
Este es el módulo principal de consulta de personal, desarrollado para reemplazar procesos manuales por una solución automatizada.
- **Arquitectura de Microservicios:** Se implementó una integración robusta mediante flujos de trabajo en **n8n**.
- **Flujo de Datos:** La aplicación consume un Webhook de n8n que actúa como orquestador, realizando consultas SQL a la base de datos `tbl_directorio` en el servidor corporativo y retornando una respuesta JSON optimizada.
- **Seguridad:** La comunicación con el microservicio de n8n está protegida mediante **Autenticación Básica (Basic Auth)** y cabeceras de seguridad personalizadas.
- **Funcionalidades:** Búsqueda omnicanal en tiempo real, filtrado dinámico por gestión/área y empresa, y visualización jerárquica de contactos.

### 2. Sistema de Gestión de Identidad Dinámica
La intranet adapta toda su apariencia visual (UI/UX) dependiendo de la empresa seleccionada en el menú superior:
- **Simex (SX):** Tematización en Azul Profundo Corporativo.
- **Soinco (SO):** Tematización en Rojo Industrial.
- **Plastinovo (PL):** Tematización en Naranja Vibrante.
- **Lógica:** Implementación de variables CSS dinámicas que cambian en tiempo real sin recargar la página.

### 3. Centro de Medios y Comunicados
- **Integración de Boletines:** Visualizador avanzado que soporta imágenes de alta resolución y archivos PDF. Diseñado específicamente para comunicados tipo infografía vertical.
- **Carrusel de Noticias:** Sistema de comunicados dinámicos con persistencia en `data.json`, permitiendo mensajes específicos por cada empresa.
- **Videoteca:** Soporte para videos locales y de YouTube integrados en una interfaz de cine (Modal).

### 4. Galería de Recuerdos (Fotos de Eventos)
- **Visualización:** Galería optimizada para gran volumen de imágenes, organizada cronológicamente.
- **Interacción:** Incluye un visor de fotos (Lightbox) con navegación por teclado y soporte para descarga de archivos originales.

### 5. Dashboards Operativos (Report Server)
- Integración directa con los tableros de control del **Report Server (EpicorDB10)**.
- Acceso segmentado por empresa para monitorear: Estado de Planta, Estado de Máquinas (Ensambles, Envases, Inyección) y Reportes de Paros.

### 6. Panel de Administración y Autenticación
- panel centralizado para la actualización de contenidos por parte del equipo de TI o Comunicaciones.
- **Consumo de Microservicio de Auth:** La validación de credenciales para administradores se realiza mediante un flujo de microservicios en **n8n** que valida identidades contra el directorio corporativo.

---

## Especificaciones Técnicas

- **Frontend Core:** React 19 + Vite (Aprovechando el renderizado ultra rápido).
- **Estilos:** Tailwind CSS con arquitectura de temas dinámicos.
- **Animaciones:** Motion (framer-motion) para transiciones de estado y micro-interacciones.
- **Orquestación de Datos:** Microservicios construidos en **n8n**, permitiendo una capa de abstracción entre la base de datos SQL y el cliente web.
- **Backend de Soporte:** Servidor Express nativo para la gestión de archivos estáticos, persistencia de datos local y gestión de rutas SPA.

## Documentación de Desarrollo
Tanto los componentes (`src/components`) como las páginas especializadas (`src/pages`) cuentan con una documentación interna exhaustiva. Cada bloque de código está comentado explicando la integración con n8n, la gestión de estados globales y la lógica de renderizado condicional.

---
© 2026 Juan Fernando Agudelo - Grupo Simex. 
"Transformando la comunicación industrial a través de tecnología de microservicios."
