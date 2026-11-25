# Plataforma de Gestión de Solicitudes Académicas — PA4

**Curso:** Programación Web II (30690) · **Institución:** ISIL  
**Evaluación:** PA4 · **Fecha de corte:** 25 de noviembre de 2026  
**Estado:** avance implementado y publicado parcialmente; algunas verificaciones pendientes  
**Rama de entrega:** [`pa4-produccion`](https://github.com/Ing-DiegoSalva/Plataforma-de-Gestion-de-Solicitudes-Academicas/tree/pa4-produccion)

> Este documento distingue las funciones implementadas de las pruebas efectivamente realizadas. No se presentan tareas pendientes como finalizadas.

## 1. Descripción y objetivo

La plataforma permite registrar, consultar y gestionar solicitudes académicas de estudiantes. Para la PA4 se amplió la SPA React desarrollada previamente con una API REST, autenticación JWT y persistencia en MongoDB Atlas. Además, se implementó un módulo Next.js para demostrar generación estática (SSG), renderizado del servidor (SSR) y rutas dinámicas.

## 2. Tecnologías y arquitectura

| Módulo | Tecnologías | Responsabilidad |
| --- | --- | --- |
| Frontend principal | React, Vite, React Router | Navegación, formularios y listado de solicitudes |
| Estado en React | Context API, Redux Toolkit | Solicitudes compartidas y filtros |
| Backend | Node.js, Express | API REST, validación y autenticación |
| Autenticación | JWT en cookie HttpOnly | Registro, login, consulta de sesión y logout |
| Base de datos | MongoDB Atlas, Mongoose | Almacenamiento persistente |
| Frontend complementario | Next.js, TypeScript, App Router | SSG, SSR y rutas dinámicas |
| Despliegue | Vercel, Render | Frontends y API publicada |

La aplicación React consume rutas `/api/auth` y `/api/solicitudes`. En Vercel se utilizan reglas de reescritura para acceder al backend en Render. En desarrollo local se configuró un proxy equivalente en Vite.

## 3. Funcionalidades y grado de validación

| Funcionalidad | Estado |
| --- | --- |
| Navegación SPA con rutas protegidas | Implementada y comprobada |
| Registro, inicio y cierre de sesión | Comprobados en la aplicación publicada |
| Persistencia de sesión tras recargar (F5) | Comprobada |
| Consulta de solicitudes (GET) | Comprobada |
| Registro de solicitudes (POST) | Comprobado |
| Filtros con Redux Toolkit | Implementados; probados en etapas anteriores |
| Actualización de solicitudes (PUT) desde React | Código incorporado; prueba funcional completa pendiente |
| Eliminación de solicitudes (DELETE) desde React | Código incorporado; prueba funcional completa pendiente |
| Confirmación antes de eliminar | Incorporada en la interfaz; prueba funcional pendiente |
| Compilación React con `npm run build` | Correcta antes de los cambios finales; repetir después de estos |
| Pruebas automatizadas de extremo a extremo | Pendientes |

**Nota:** la visualización de los botones **Editar** y **Eliminar** en localhost no demuestra por sí sola que las operaciones se guarden correctamente en MongoDB. Es necesario realizar las pruebas y actualizar la página para verificar la persistencia.

## 4. API REST y autenticación

La API de solicitudes está protegida por middleware de autenticación. Se implementaron las siguientes rutas:

| Método | Endpoint | Función |
| --- | --- | --- |
| GET | `/api/solicitudes` | Listar solicitudes |
| GET | `/api/solicitudes/:id` | Consultar por identificador |
| POST | `/api/solicitudes` | Crear solicitud |
| PUT | `/api/solicitudes/:id` | Actualizar una solicitud |
| PATCH | `/api/solicitudes/:id` | Actualizar campos específicos |
| DELETE | `/api/solicitudes/:id` | Eliminar solicitud |

La autenticación se administra mediante rutas bajo `/api/auth`, JWT y cookies HttpOnly. La API recibe principalmente `estudiante`, `curso`, `descripcion` y `estado`; el frontend React adapta el campo `curso` como `tipo` para su presentación.

## 5. Next.js — Actividad 2

El módulo `plataforma-next` demuestra las siguientes estrategias:

- **SSG — `/tramites`:** catálogo informativo de trámites académicos, generado de manera estática.
- **SSR — `/estado-servicio`:** consulta del estado del backend con renderizado dinámico.
- **Rutas dinámicas — `/solicitudes/[id]`:** muestra datos demostrativos para los identificadores 1, 2 y 3; el identificador 999 devuelve una página 404.

Se verificaron las rutas, su comportamiento y la compilación de Next.js durante el desarrollo. **Las solicitudes de esta demostración son datos de ejemplo, no registros privados de MongoDB.**

Detalles técnicos y evidencias: [README de Next.js](plataforma-next/README.md).

## 6. Despliegues y enlaces

- **API Express — Render:** https://pa4-solicitudes-api.onrender.com/ — comprobada con respuesta `estado: OK`.
- **Frontend React — Vercel:** https://pa4-solicitudes-react.vercel.app/ — comprobado para registro, autenticación, consulta y creación de solicitudes.
- **Frontend Next.js:** desplegado en Vercel y probado durante el desarrollo; consultar su URL vigente en la configuración del proyecto.

**Importante:** la rama `pa4-produccion` contiene los últimos cambios de edición y eliminación, pero **no se confirmó que esa versión se haya desplegado en Vercel**. El sitio público puede mostrar una versión anterior.

## 7. Instrucciones de ejecución

### 7.1 React local

Desde la raíz del repositorio:

```bash
cd plataforma-react
npm install
npm run dev
```

Para utilizar el backend publicado desde localhost, crear `plataforma-react/.env.local` (no incluir este archivo en Git) con:

```dotenv
VITE_AUTH_URL=/api/auth
VITE_API_URL=/api/solicitudes
```

Configurar `plataforma-react/vite.config.js` con un proxy de desarrollo:

```javascript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'https://pa4-solicitudes-api.onrender.com',
        changeOrigin: true,
        secure: true,
      },
    },
  },
});
```

Reiniciar el servidor de Vite después de actualizar la configuración.

**Advertencia:** al usar la API de Render, las operaciones pueden modificar datos de MongoDB Atlas. Utilizar únicamente registros de prueba para validar edición y eliminación. No subir credenciales, tokens ni archivos de entorno con secretos.

Para verificar la compilación:

```bash
npm run build
```

### 7.2 Next.js

```bash
cd plataforma-next
npm install
npm run dev
npm run build
```

La vista SSR requiere una URL de API accesible desde el entorno de ejecución.

### 7.3 Backend

```bash
cd backend
npm install
npm start
```

Configurar previamente las variables de entorno necesarias siguiendo `backend/.env.example`, sin publicar datos privados.

## 8. Estructura principal

```text
backend/             API REST, middleware JWT y MongoDB
plataforma-react/    SPA React, rutas, Context API, Redux y CRUD
plataforma-next/     Next.js con SSG, SSR y rutas dinámicas
plataforma-gestion/  Desarrollo Angular de etapas anteriores
README.md            Documentación y estado global de la PA4
```

## 9. Evidencias y pruebas

### Comprobaciones realizadas

- Conectividad del backend de Render y respuesta de estado `OK`.
- Registro, login, recuperación de sesión, cierre de sesión y consulta/creación de solicitudes desde el frontend publicado.
- Rutas SSG, SSR y dinámicas de Next.js, incluida página 404 para una solicitud demostrativa inexistente.
- Compilación de React exitosa antes de las últimas modificaciones.
- Visualización de las acciones **Editar** y **Eliminar** en React local después de configurar el proxy de Vite.
- Publicación de los cambios en GitHub, rama `pa4-produccion`.

### Verificaciones pendientes

1. Probar edición y eliminación con registros de prueba y comprobar persistencia después de F5.
2. Ejecutar una compilación final con todos los cambios realizados.
3. Confirmar los valores permitidos para los estados de solicitud y las reglas de autorización.
4. Publicar o verificar el despliegue de la versión final React en Vercel, si la entrega lo exige.
5. Completar capturas, pruebas adicionales y materiales de exposición según la rúbrica del docente.

Las comprobaciones anteriores son principalmente pruebas manuales; no equivalen a una suite automatizada de extremo a extremo.

## 10. Repositorios y entrega

- **Repositorio original del equipo:** https://github.com/Toriewe/Plataforma-de-Gestion-de-Solicitudes-Academicas
- **Fork y rama de entrega:** https://github.com/Ing-DiegoSalva/Plataforma-de-Gestion-de-Solicitudes-Academicas/tree/pa4-produccion

La rama indicada contiene los avances de la PA4 para su revisión. Las responsabilidades completas de cada integrante deben corroborarse con el equipo; este documento no atribuye actividades que no se hayan verificado.

## 11. Conclusión

La PA4 integra una SPA React, una API REST con autenticación y persistencia, y un proyecto complementario Next.js que demuestra SSG, SSR y rutas dinámicas. Las funciones de edición y eliminación fueron incorporadas al código, pero sus pruebas funcionales completas y la publicación de la última versión del frontend React quedan pendientes. Este README refleja el alcance alcanzado y los aspectos aún no cerrados.
