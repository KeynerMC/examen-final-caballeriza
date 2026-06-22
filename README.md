# Sistema de Gestión de Caballeriza

Sistema web para administrar caballos, personal, calendario de citas/paseos,
alimentación, inventario de insumos y notificaciones, con backend en
**Spring Boot (Java 17)** y frontend en **React + Vite + Tailwind**.

## Estructura

```
proyecto-final/
├── sistema-caballeriza/      → Backend (Spring Boot, abrir con IntelliJ)
├── caballeriza-frontend/     → Frontend (React, abrir con VS Code)
└── docker-compose.yml        → Levanta todo el stack (DB + backend + frontend)
```

## Cómo correr el proyecto (con Docker, recomendado)

Requisitos: Docker y Docker Compose instalados.

```bash
# Desde la carpeta proyecto-final/
docker compose up --build
```

Esto levanta:
- **Postgres** en el puerto `5432`
- **Backend** (Spring Boot) en `http://localhost:8080`
- **Frontend** (React, servido por Nginx) en `http://localhost:5173`

La primera vez puede tardar unos minutos porque Maven descarga las
dependencias dentro del contenedor. Para detener todo:

```bash
docker compose down
```

Para borrar también los datos de la base de datos:

```bash
docker compose down -v
```

## Cómo correr en modo desarrollo (sin Docker para el código)

Si prefieren trabajar con hot-reload mientras programan, pueden levantar
solo la base de datos con Docker y correr el backend/frontend localmente:

```bash
# 1. Solo la base de datos
docker compose up postgres -d

# 2. Backend (desde sistema-caballeriza/, con IntelliJ o:)
./mvnw spring-boot:run

# 3. Frontend (desde caballeriza-frontend/, con VS Code o:)
npm install
npm run dev
```

El frontend queda en `http://localhost:5173` y el backend en `http://localhost:8080`.

## Documentación de la API

Con el backend corriendo, Swagger UI queda disponible en:

```
http://localhost:8080/swagger-ui.html
```

## Migración a aplicación móvil

El backend es una API REST sin estado (JWT, sin sesiones de servidor) y el
frontend web nunca llama directamente a la base de datos: toda la lógica de
negocio vive en el backend y se consume por HTTP/JSON. Esto permite construir
una app móvil (por ejemplo con **React Native** o **Expo**) reutilizando el
mismo backend sin cambios, siguiendo estos puntos:

- **Misma API, mismos endpoints.** Todos los endpoints documentados en Swagger
  (`/swagger-ui.html`) son los que consumiría la app móvil; no hay endpoints
  exclusivos para web.
- **Capa de API reutilizable.** `caballeriza-frontend/src/api/services.js` ya
  separa cada recurso (`horseApi`, `employeeApi`, `appointmentApi`,
  `feedingApi`, `inventoryApi`, `notificationApi`, `authApi`) en funciones que
  llaman a `axios`. En React Native se puede copiar ese archivo casi sin
  cambios: solo se reemplaza `localStorage` (web) por `AsyncStorage` (móvil)
  para guardar el JWT, y se ajusta el `baseURL` de axios para apuntar a la URL
  pública del backend en vez de usar el proxy de Vite.
- **Autenticación portable.** El login devuelve un JWT (`AuthResponse.token`)
  que se manda en el header `Authorization: Bearer <token>` en cada petición
  ([`axios.js`](caballeriza-frontend/src/api/axios.js)). Ese mismo mecanismo
  funciona igual desde un cliente móvil.
- **Roles y permisos sin cambios.** Los 4 roles (`ADMIN`, `CUIDADOR`,
  `VETERINARIO`, `CLIENTE`) y las reglas `@PreAuthorize` están en el backend,
  así que la app móvil hereda los mismos permisos sin reimplementar nada de
  seguridad.
- **Archivos estáticos accesibles.** Las fotos de los caballos se sirven en
  `/uploads/**` con URL absoluta, consumibles igual desde una `<Image>` de
  React Native que desde un `<img>` web.
- **CORS no es un bloqueo para móvil.** La restricción de orígenes en
  `SecurityConfig` solo aplica a navegadores; una app nativa (React
  Native/Expo) no la sufre porque no es una petición same-origin/cross-origin
  de navegador. Si se publica una versión web adicional, basta agregar su
  dominio a la lista de `allowedOrigins`.
- **UI ya pensada en componentes pequeños.** Las páginas del frontend están
  separadas en componentes simples (`Modal`, `Badge`, `PageHeader`, etc.) y la
  lógica de formularios usa `react-hook-form`, un patrón que tiene
  equivalentes directos en React Native (`react-hook-form` también funciona
  ahí) facilitando portar las pantallas sin rediseñar la arquitectura.

## Usuarios y roles

El registro (`/register` en el frontend) permite crear cuentas con rol
`CLIENTE`, `CUIDADOR`, `VETERINARIO` o `ADMIN`. El primer usuario que
quieran usar como administrador para probar todo el sistema, regístrenlo
con rol `ADMIN`.

## Pruebas

Pruebas unitarias del backend (lógica de cupos de paseos y alertas de stock bajo):

```bash
cd sistema-caballeriza
./mvnw test
```

Pruebas de componentes del frontend (Vitest + React Testing Library: validación del
login, contexto de autenticación/roles, y componentes de UI compartidos):

```bash
cd caballeriza-frontend
npm test           # modo watch
npm run test:run   # una sola corrida (CI)
```

## Notas para el video de demo

Para cumplir la rúbrica, en el video conviene mostrar, en este orden:
1. Registro/login con distintos roles.
2. CRUD de caballos + subir foto + historial médico.
3. CRUD de personal + asignación de turnos.
4. Crear una cita de paseo, reservarla hasta llenar el cupo (mostrar el bloqueo).
5. Crear un plan de alimentación y registrar un suministro.
6. Crear un insumo con cantidad menor al stock mínimo y mostrar la alerta/notificación generada.
7. Bandeja de notificaciones marcando como leídas.
8. Swagger UI mostrando los endpoints documentados.
