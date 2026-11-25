# PA4 — Next.js: SSR, SSG y rutas dinámicas

**Proyecto:** Plataforma de Gestión de Solicitudes Académicas  
**Curso:** Programación Web II — ISIL  
**Evaluación:** PA4 — Actividad 2  
**Responsable:** Diego Fernando Salva Puerta

## 1. Objetivo

Implementar una aplicación funcional con Next.js que permita comparar distintas estrategias de renderizado, utilizando generación estática (SSG), renderizado del lado del servidor (SSR) y enrutamiento dinámico.

Esta implementación forma parte de la cuarta etapa del proyecto académico y complementa la aplicación React y el backend Node.js/Express desarrollados anteriormente.

## 2. Tecnologías utilizadas

- Next.js 16
- React
- TypeScript
- Next.js App Router
- Node.js y Express como API de consulta
- Git y GitHub para control de versiones

## 3. Funcionalidades implementadas

### 3.1. Generación estática (SSG)

**Ruta:** `/tramites`

Se desarrolló un catálogo informativo de trámites académicos, utilizando datos demostrativos de constancias de estudios, rectificación de notas y reserva de matrícula.

La página utiliza generación estática porque su contenido informativo no requiere consultar la base de datos ni modificarse en cada petición.

**Evidencia de compilación:**

`○ /tramites — Static: prerendered as static content`

### 3.2. Renderizado del lado del servidor (SSR)

**Ruta:** `/estado-servicio`

Se implementó una página que consulta el endpoint público de la API Node.js/Express para visualizar la disponibilidad del servicio académico.

La página utiliza:

- `dynamic = "force-dynamic"` para forzar el renderizado dinámico.
- `fetch()` con `cache: "no-store"` para solicitar datos actualizados.
- Manejo de respuestas no exitosas y errores de conexión.
- Presentación del estado y la fecha de consulta.

Se eligió SSR porque el estado del backend puede variar y es conveniente obtener una respuesta actualizada durante cada petición.

**Evidencia de compilación:**

`ƒ /estado-servicio — Dynamic: server-rendered on demand`

**Nota:** la implementación local consulta `http://localhost:3000/`. Antes del despliegue, esta dirección deberá sustituirse por una URL de API configurable y accesible desde el entorno de producción.

### 3.3. Rutas dinámicas

**Ruta:** `/solicitudes/[id]`

Se implementó una página dinámica que utiliza el parámetro `id` para mostrar información correspondiente a distintas solicitudes académicas.

Se utilizaron registros demostrativos para evitar exponer información privada de estudiantes.

Las rutas probadas fueron:

| Ruta | Resultado HTTP |
|---|---|
| `/solicitudes/1` | 200 |
| `/solicitudes/2` | 200 |
| `/solicitudes/3` | 200 |
| `/solicitudes/999` | 404 |

La función `notFound()` permite gestionar identificadores inexistentes.

**Evidencia de compilación:**

`ƒ /solicitudes/[id] — Dynamic: server-rendered on demand`

## 4. Comparación entre SSR y SSG

| Criterio | SSG | SSR |
|---|---|---|
| Momento de generación | Durante el build | Durante una petición |
| Vista implementada | Catálogo de trámites | Estado del servicio |
| Naturaleza de los datos | Relativamente estables | Variables |
| Ventaja | Menor procesamiento durante las visitas | Información actualizada |
| Consideración | Requiere regeneración para actualizar el contenido | Depende del servidor durante la petición |

**Justificación:** SSG resulta apropiado para información institucional relativamente estable, mientras que SSR es conveniente para información que puede variar entre consultas.

## 5. Ejecución del proyecto

Desde la carpeta `plataforma-next`:

```bash
npm install
npm run dev
```

Abrir la dirección local indicada por Next.js, normalmente `http://localhost:3001` si el backend ya utiliza el puerto 3000.

Para comprobar el comportamiento de producción:

```bash
npm run build
npm run start
```

Para visualizar correctamente `/estado-servicio` en el entorno local, mantener ejecutándose la API Express en `http://localhost:3000`.

## 6. Pruebas y resultados

Se realizaron las siguientes verificaciones manuales:

1. Visualización del catálogo de tres trámites académicos.
2. Compilación y verificación de SSG en `/tramites`.
3. Consulta exitosa al backend mediante `/estado-servicio`.
4. Compilación y verificación de SSR en `/estado-servicio`.
5. Acceso a las solicitudes demostrativas 1, 2 y 3.
6. Verificación de respuesta 404 para el identificador 999.
7. Compilación final de producción sin errores.

La tabla final de Next.js mostró:

```text
Route (app)
┌ ○ /
├ ○ /_not-found
├ ƒ /estado-servicio
├ ƒ /solicitudes/[id]
└ ○ /tramites
```

## 7. Evidencias recomendadas

- **Figura 1:** catálogo de trámites académicos generado con SSG.
- **Figura 2:** visualización de la página SSR conectada a Node.js.
- **Figura 3:** páginas dinámicas de solicitudes con identificadores diferentes.
- **Figura 4:** error 404 para una solicitud inexistente.
- **Figura 5:** compilación final que evidencia rutas estáticas y dinámicas.

Las capturas deben adjuntarse al informe de evaluación o enlazarse desde el repositorio.

## 8. Conclusiones

La implementación permitió comprobar que Next.js ofrece diferentes estrategias de generación de contenido según las necesidades de cada vista.

SSG permite entregar contenido informativo previamente generado, mientras que SSR facilita consultar información actualizada desde el servidor.

Las rutas dinámicas permiten organizar páginas parametrizadas sin crear manualmente una página independiente para cada identificador.

La aplicación queda preparada para integrarse con las siguientes actividades de despliegue y configuración de producción de la PA4.