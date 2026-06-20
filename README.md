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
