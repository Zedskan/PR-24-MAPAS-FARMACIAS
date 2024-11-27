# Manual Técnico: Proyecto de Mapas de Farmacias Afiliadas al SEDES

---

## Introducción

La aplicación de **Mapas de Farmacias** es un proyecto desarrollado para ofrecer una herramienta interactiva que permita a los usuarios localizar farmacias afiliadas al **SEDES** (Servicio Departamental de Salud). Además de proporcionar comodidad a los usuarios, esta aplicación contribuye a combatir la venta ilegal de medicamentos.

Este documento detalla los aspectos técnicos del sistema, incluyendo la arquitectura, herramientas utilizadas, requerimientos, configuración, despliegue y soporte técnico. Está dirigido al personal de TI y desarrolladores encargados del mantenimiento y futuras actualizaciones.

---

## Descripción del Proyecto

El proyecto se basa en una aplicación web que consta de los siguientes componentes principales:

### Frontend

- **Framework**: React
- **Descripción**: Ofrece una interfaz amigable e intuitiva para que los usuarios puedan buscar farmacias en un mapa interactivo.
- **Características clave**:
  - Uso de componentes funcionales.
  - Hooks como `useState` y `useEffect` para el manejo del estado.
  - Integración con la API de Google Maps.

### Backend

- **Framework**: Node.js con Express.js
- **Base de Datos**: MySQL
- **Descripción**: Gestiona las operaciones relacionadas con la búsqueda de farmacias, almacenamiento de datos y autenticación de usuarios.
- **Características clave**:
  - Creación de APIs RESTful para la comunicación con el frontend.
  - Validación de datos y manejo de errores.

### Mapas

- **API utilizada**: Google Maps API
- **Funcionalidades**:
  - Visualización de farmacias en un mapa interactivo.
  - Obtención de datos geográficos para localizaciones precisas.

---

## Roles e Integrantes

El equipo de desarrollo estuvo compuesto por:

- **Daniel Eduardo Miranda Canaviri**: Team Leader y desarrollador Full Stack.
- **Cristhian Andrés Escalera Muñoz**: Desarrollador Full Stack y encargado del diseño de la base de datos.

---

## Arquitectura del Software

El proyecto utiliza una arquitectura cliente-servidor.

### Frontend

- **Tecnologías**:
  - React (v18.x)
  - React Router para la navegación.

### Backend

- **Tecnologías**:
  - Node.js con Express.js
  - MySQL como base de datos.

### Patrones

- **Separación de responsabilidades (SRP)**.
- **RESTful API** para la interacción entre frontend y backend.
- **Diseño modular** para el manejo de la lógica de negocio.

---

## Instalación y Configuración

### Set-up

1. **Clonar el repositorio**:
   ```bash
   git clone https://github.com/Zedskan/PR-24-MAPAS-FARMACIAS.git

2. **Instalar dependencias**:
   ```bash
   npm install

# Configuración y Ejecución del Proyecto

## Configuración de Variables

### Archivo `.env`
Configurar las variables de entorno en un archivo `.env`:

```plaintext
MYSQL_HOST=127.0.0.1          # O la IP donde está corriendo el servidor MySQL
MYSQL_USER=Admin              # El nombre del usuario de la base de datos
MYSQL_PASSWORD=123            # La contraseña del usuario de la base de datos
MYSQL_DATABASE=pharmacy       # El nombre de la base de datos
MYSQL_PORT=3306               # El puerto donde está corriendo MySQL (por defecto 3306)
```

## Modificar apiConfig.js
Editar el archivo apiConfig.js en la aplicación:

```JS
const API_BASE_URL = "http://192.168.100.87:8080"; // Dirección IP local.
```
# Ejecución de Servidores
## Ejecutar el Servidor Backend
```bash
npm run dev
```
## Iniciar el Servidor de Desarrollo (Frontend)
```bash
npm start
```

# Depuración y Solución de Problemas
## Frontend
Errores en la interfaz: Revisar el panel de desarrollo del navegador.
Fallas en las peticiones: Verificar las respuestas HTTP en la consola.
## Backend
Errores en la API: Revisar los logs del servidor.
Conexión fallida a la base de datos: Comprobar la configuración de la cadena de conexión.
# Referencias

Documentación React
Documentación Google Maps API
Documentación Node.js
