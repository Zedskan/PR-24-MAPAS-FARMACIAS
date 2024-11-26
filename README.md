Manual Técnico: Proyecto de Mapas de Farmacias Afiliadas al SEDES
________________________________________
Introducción
La aplicación de Mapas de Farmacias es un proyecto desarrollado para ofrecer una herramienta interactiva que permita a los usuarios localizar farmacias afiliadas al SEDES (Servicio Departamental de Salud). Además de proporcionar comodidad a los usuarios, esta aplicación contribuye a combatir la venta ilegal de medicamentos. Este documento detalla los aspectos técnicos del sistema, incluyendo la arquitectura, herramientas utilizadas, requerimientos, configuración, despliegue y soporte técnico. Está dirigido al personal de TI y desarrolladores encargados del mantenimiento y futuras actualizaciones.
________________________________________
Descripción del Proyecto
El proyecto se basa en una aplicación web que consta de los siguientes componentes principales:
Frontend
•	Framework: React
•	Descripción: Ofrece una interfaz amigable e intuitiva para que los usuarios puedan buscar farmacias en un mapa interactivo.
•	Características clave:
o	Uso de componentes funcionales.
o	Hooks como useState y useEffect para el manejo del estado.
o	Integración con la API de Google Maps.
Backend
•	Framework: Node.js con Express.js
•	Base de Datos: MySQL
•	Descripción: Gestiona las operaciones relacionadas con la búsqueda de farmacias, almacenamiento de datos y autenticación de usuarios.
•	Características clave:
o	Creación de APIs RESTful para la comunicación con el frontend.
o	Validación de datos y manejo de errores.
Mapas
•	API utilizada: Google Maps API
•	Funcionalidades:
o	Visualización de farmacias en un mapa interactivo.
o	Obtención de datos geográficos para localizaciones precisas.
________________________________________
Roles e Integrantes
El equipo de desarrollo estuvo compuesto por:
•	Daniel Eduardo Miranda Canaviri: Team Leader y desarrollador Full Stack.
•	Cristhian Andrés Escalera Muñoz: Desarrollador Full Stack y encargado del diseño de la base de datos.
________________________________________
Arquitectura del Software
El proyecto utiliza una arquitectura cliente-servidor:
Frontend
•	Tecnologías:
o	React Native(v18.x)
o	React Router para la navegación.
o	Axios para el manejo de peticiones HTTP.
o	Bootstrap para el diseño visual.
Backend
•	Tecnologías:
o	Node.js con Express.js
o	MySQL como base de datos.
o	JWT (JSON Web Tokens) para autenticación.
Patrones
•	Separación de responsabilidades (SRP).
•	RESTful API para la interacción entre frontend y backend.
•	Diseño modular para el manejo de la lógica de negocio.
________________________________________
Instalación y Configuración
Set-up
1.	Clonar el repositorio:
git clone https://github.com/Zedskan/PR-24-MAPAS-FARMACIAS.git

2.	Instalar dependencias tanto en la Aplicación y la API:
npm install
Base de Datos
1.	Instalar MySQL y MySQL Workbench.
2.	Importar el archivo SQL proporcionado:
3.	Correr el archivo SQL y recuperar la base, una vez recuperada.
4.	Después correr la siguiente consulta:
CREATE USER 'Admin'@'%' IDENTIFIED BY '123';
GRANT ALL PRIVILEGES ON pharmacy.* TO 'Admin'@'%';
FLUSH PRIVILEGES;
Configuración de Variables
1.	Configurar las variables de entorno en un archivo .env:
o	MYSQL_HOST=127.0.0.1  # O la IP donde está corriendo el servidor MySQL
o	MYSQL_USER=Admin       # El nombre del usuario de la base de datos
o	MYSQL_PASSWORD=123     # La contraseña del usuario de la base de datos
o	MYSQL_DATABASE=pharmacy # El nombre de la base de datos
o	MYSQL_PORT=3306        # El puerto donde está corriendo MySQL (por defecto 3306)Instalar dependencias:
2.	Modificar el archivo apiConfig.js en la Aplicación
o	const API_BASE_URL = "http://192.168.100.87:8080"; #Colocar aqui la dirección ip local.
3.	Ejecutar el servidor:
npm run dev
4.	Iniciar el servidor de desarrollo (Aplicación):
npm start
________________________________________
Depuración y Solución de Problemas
Frontend
•	Errores en la interfaz: Revisar el panel de desarrollo del navegador.
•	Fallos en las peticiones: Verificar las respuestas HTTP en la consola.

Backend
•	Errores en la API: Revisar los logs del servidor.
•	Conexión fallida a la base de datos: Comprobar la configuración de la cadena de conexión.
________________________________________
Referencias
•	Documentación React: https://reactjs.org/docs
•	Documentación Google Maps API: https://developers.google.com/maps
•	Documentación Node.js: https://nodejs.org

