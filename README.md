# Proyecto: Arquitectura de Microservicios con Docker Compose

**Autor:** José Antonio Pinto Aguilar

Este proyecto implementa una arquitectura de microservicios (Frontend, API, Base de Datos) utilizando Docker y Docker Compose, desplegada en una instancia EC2 de AWS.

---

## 📋 Tabla de Contenidos

- [Arquitectura](#arquitectura)
- [Servicios y Comunicación](#servicios-y-comunicación)
- [Endpoints Personalizados](#endpoints-personalizados)
- [Diagrama de Flujo](#diagrama-de-flujo)
- [Requisitos Previos](#requisitos-previos)
- [Instalación y Despliegue](#instalación-y-despliegue)
- [Prueba de Persistencia](#prueba-de-persistencia)
- [Variables de Entorno](#variables-de-entorno)
- [Comandos Útiles](#comandos-útiles)

---

## 🏗️ Arquitectura

El proyecto consta de tres servicios orquestados por `docker-compose.yml`:

### 1. **Frontend** (Puerto 3000)
Un servidor web basado en Node.js/Express que sirve una aplicación estática (HTML/JS). Esta interfaz de usuario consume datos de la API para mostrar y gestionar información.

### 2. **API** (Puerto 5000)
Una API RESTful basada en Node.js/Express. Se conecta a la base de datos PostgreSQL para realizar operaciones CRUD (Create, Read, Update, Delete) sobre los usuarios.

### 3. **Base de Datos** (Puerto 5432)
Una base de datos PostgreSQL (imagen oficial) que utiliza un volumen nombrado (`db-data`) para garantizar la persistencia de datos incluso cuando los contenedores son destruidos y recreados.

---

## 🔄 Servicios y Comunicación

### Usuario → Frontend
```
http://54.224.213.119:3000
```
El usuario accede a la interfaz web a través del navegador.

### Frontend → API
```javascript
http://54.224.213.119:5000/usuarios
```
El `script.js` del frontend realiza peticiones HTTP (fetch) a la IP pública de la API para obtener y enviar datos.

### API → Base de Datos
```
host: db
port: 5432
```
La API utiliza la red interna de Docker para conectarse a PostgreSQL usando el nombre del servicio como hostname, aprovechando el DNS interno de Docker.

---

## 🚀 Endpoints Personalizados

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `GET` | `http://54.224.213.119:5000/Pinto` | Retorna el nombre completo del autor (en mi caso, mi nombre "José Antonio Pinto Aguilar" |
| `GET` | `http://54.224.213.119:5000/usuarios` | Retorna todos los usuarios de la base de datos |
| `POST` | `http://54.224.213.119:5000/usuarios` | Añade un nuevo usuario a la base de datos |

---

## 📊 Diagrama de Flujo

```
┌─────────────────────────────┐
│  Navegador del Usuario      │
└──────────────┬──────────────┘
               │
               │ Petición: http://54.224.213.119:3000
               ▼
┌─────────────────────────────┐
│   Contenedor FRONTEND       │
│  (Node.js/Express :3000)    │
└──────────────┬──────────────┘
               │
               │ Petición: http://54.224.213.119:5000/usuarios
               ▼
┌─────────────────────────────┐
│   Contenedor API            │
│  (Node.js/Express :5000)    │
└──────────────┬──────────────┘
               │
               │ Conexión interna: host='db', port=5432
               ▼
┌─────────────────────────────┐
│   Contenedor DB             │
│  (PostgreSQL :5432)         │
└──────────────┬──────────────┘
               │
               │ Persistencia
               ▼
┌─────────────────────────────┐
│   Volumen: db-data          │
└─────────────────────────────┘
```

---

## 📦 Requisitos Previos

Antes de comenzar, asegúrate de tener instalado:

- [Docker](https://docs.docker.com/get-docker/) (versión 20.10 o superior)
- [Docker Compose](https://docs.docker.com/compose/install/) (versión 1.29 o superior)
- Acceso a una instancia EC2 de AWS (o cualquier servidor con Docker)
- Puertos 3000, 5000 y 5432 disponibles

---

## 🚀 Instalación y Despliegue

### 1. Clonar el Repositorio
```bash
git clone https://github.com/JosephAntony37900/Microservicios-docker.compose.git
cd Microservicios-docker.compose
```

### 2. Construir las Imágenes
```bash
docker-compose build
```

### 3. Levantar los Servicios
```bash
docker-compose up -d
```

El flag `-d` ejecuta los contenedores en modo *detached* (segundo plano).

### 4. Verificar que los Servicios Están Corriendo
```bash
docker-compose ps
```

### 5. Acceder a la Aplicación
Abre tu navegador y visita:
```
http://<IP_PUBLICA_DEL_HOST>:3000
```

---

## 🧪 Prueba de Persistencia

Para verificar que el volumen `db-data` mantiene los datos:

1. **Añadir datos** desde el frontend (crear algunos usuarios).

2. **Detener y eliminar los contenedores**:
   ```bash
   docker-compose down
   ```
   ⚠️ Esto destruye los contenedores pero **NO** elimina el volumen.

3. **Recrear los contenedores**:
   ```bash
   docker-compose up -d
   ```

4. **Verificar los datos**: Refresca el navegador en `http://<IP_PUBLICA>:3000`. Los usuarios creados anteriormente deben seguir allí, confirmando que la persistencia funciona correctamente.

---

## 🔐 Variables de Entorno

El archivo `docker-compose.yml` define las siguientes variables para PostgreSQL:

```yaml
POSTGRES_USER: admin
POSTGRES_PASSWORD: secret
POSTGRES_DB: miapp
```

Estas credenciales son utilizadas por la API para conectarse a la base de datos.

---

## 🛠️ Comandos Útiles

### Ver logs de todos los servicios
```bash
docker-compose logs -f
```

### Ver logs de un servicio específico
```bash
docker-compose logs -f api
```

### Detener los servicios sin eliminar contenedores
```bash
docker-compose stop
```

### Iniciar servicios detenidos
```bash
docker-compose start
```

### Detener y eliminar contenedores, redes (mantiene volúmenes)
```bash
docker-compose down
```

### Eliminar todo incluyendo volúmenes (⚠️ se pierden los datos)
```bash
docker-compose down -v
```

### Reconstruir un servicio específico
```bash
docker-compose build api
docker-compose up -d api
```

### Acceder a la shell de un contenedor
```bash
docker-compose exec api sh
docker-compose exec db psql -U admin -d miapp
```

---

## 📝 Notas Adicionales

- **Seguridad**: En producción, evita exponer la base de datos directamente. Solo la API debe tener acceso a ella.
- **HTTPS**: Considera implementar un reverse proxy con Nginx y certificados SSL/TLS para producción.
- **Backups**: Configura backups regulares del volumen `db-data` o de la base de datos PostgreSQL.
- **Escalabilidad**: Docker Compose es ideal para desarrollo y pruebas. Para producción, considera Kubernetes o Docker Swarm.

---

## 📄 Licencia

Este proyecto es de uso educativo.

---

## 👤 Contacto

**José Antonio Pinto Aguilar**

Para consultas o sugerencias sobre este proyecto, no dudes en contactar al autor.
