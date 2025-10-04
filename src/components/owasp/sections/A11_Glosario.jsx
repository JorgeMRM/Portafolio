// src/components/owasp/sections/Glossary.jsx
export default function Glossary() {
  return (
    <section id="a11" className="section">
      <h2 className="h3 text-center">Glosario</h2>

      <dl className="ms-1">
        <dt className="fw-bold">ACL (Access Control List)</dt>
        <dd>Lista que define qué usuarios o sistemas tienen permisos para acceder a determinados recursos o realizar acciones específicas.</dd>

        <dt className="fw-bold">Actualización</dt>
        <dd>Proceso de instalar nuevas versiones de un software para mejorar su seguridad, rendimiento o agregar funciones.</dd>

        <dt className="fw-bold">Actualización de seguridad (parche)</dt>
        <dd>Corrección oficial que soluciona fallos o vulnerabilidades en un software o sistema.</dd>

        <dt className="fw-bold">Algoritmos de cifrado</dt>
        <dd>Métodos matemáticos utilizados para proteger datos. Ejemplos: AES (seguro) frente a DES (obsoleto).</dd>

        <dt className="fw-bold">Amazon S3 (Buckets)</dt>
        <dd>Servicio de almacenamiento en la nube de Amazon donde los “buckets” son contenedores de archivos que requieren permisos seguros para evitar accesos no autorizados.</dd>

        <dt className="fw-bold">API (Interfaz de Programación de Aplicaciones)</dt>
        <dd>Puente que permite que una aplicación se comunique con otra o con una base de datos para intercambiar información.</dd>

        <dt className="fw-bold">Archivo de prueba</dt>
        <dd>Ficheros utilizados durante el desarrollo que no son necesarios en producción y que pueden representar riesgos si permanecen accesibles.</dd>

        <dt className="fw-bold">Argon2, bcrypt, scrypt, PBKDF2</dt>
        <dd>Algoritmos seguros para almacenar contraseñas de forma protegida y evitar que puedan ser descifradas fácilmente.</dd>

        <dt className="fw-bold">ASP.NET</dt>
        <dd>Framework de desarrollo web de Microsoft usado para crear aplicaciones y servicios en línea.</dd>

        <dt className="fw-bold">Auditoría de integridad</dt>
        <dd>Proceso que asegura que los registros o datos no sean alterados, garantizando su confiabilidad para análisis forenses.</dd>

        <dt className="fw-bold">Autenticación multifactor (MFA)</dt>
        <dd>Método de verificación que requiere dos o más pruebas de identidad (como contraseña, código enviado al teléfono o huella digital).</dd>

        <dt className="fw-bold">Autenticidad</dt>
        <dd>Propiedad que asegura que la identidad de los usuarios o sistemas es verdadera y legítima.</dd>

        <dt className="fw-bold">Biblioteca</dt>
        <dd>Conjunto de funciones y recursos reutilizables que se integran dentro de una aplicación.</dd>

        <dt className="fw-bold">CDN (Content Delivery Network)</dt>
        <dd>Red de servidores distribuidos que entregan contenido web (como imágenes, scripts y videos) de forma rápida y eficiente.</dd>

        <dt className="fw-bold">CI/CD (Integración Continua y Entrega Continua)</dt>
        <dd>Práctica que automatiza la integración de código y su despliegue en producción de forma rápida y frecuente.</dd>

        <dt className="fw-bold">Cifrado</dt>
        <dd>Técnica que transforma datos en información ilegible para protegerla, permitiendo que solo personas autorizadas puedan leerla.</dd>

        <dt className="fw-bold">Ciclo de Desarrollo Seguro (S-SDLC)</dt>
        <dd>Metodología que integra la seguridad en todas las fases del desarrollo de software.</dd>

        <dt className="fw-bold">Componente firmado digitalmente</dt>
        <dd>Software que incluye una firma electrónica que garantiza que no ha sido modificado maliciosamente desde su publicación original.</dd>

        <dt className="fw-bold">Confidencialidad</dt>
        <dd>Principio que garantiza que la información solo sea accesible para personas autorizadas.</dd>

        <dt className="fw-bold">Consultas parametrizadas</dt>
        <dd>Método seguro para enviar datos a una base de datos evitando inyecciones de código.</dd>

        <dt className="fw-bold">Control de acceso</dt>
        <dd>Sistema que define qué acciones puede realizar cada usuario en una aplicación o sistema.</dd>

        <dt className="fw-bold">Cookies</dt>
        <dd>Pequeños archivos que guardan información de la sesión del usuario en el navegador.</dd>

        <dt className="fw-bold">CORS (Cross-Origin Resource Sharing)</dt>
        <dd>Configuración que controla qué sitios web pueden comunicarse con una aplicación o API.</dd>

        <dt className="fw-bold">Credenciales</dt>
        <dd>Información utilizada para acceder a un sistema, como nombre de usuario y contraseña.</dd>

        <dt className="fw-bold">Credenciales predeterminadas</dt>
        <dd>Usuario y contraseña de fábrica que deben cambiarse inmediatamente.</dd>

        <dt className="fw-bold">CSPRNG</dt>
        <dd>Generador de números aleatorios criptográficamente seguro.</dd>

        <dt className="fw-bold">CVE (Common Vulnerabilities and Exposures)</dt>
        <dd>Listado público de vulnerabilidades de software con identificadores únicos.</dd>

        <dt className="fw-bold">CycloneDX</dt>
        <dd>Estándar/herramienta que genera SBOM para identificar vulnerabilidades.</dd>

        <dt className="fw-bold">DAST</dt>
        <dd>Pruebas de seguridad dinámicas mientras la aplicación está en ejecución.</dd>

        <dt className="fw-bold">Datos sensibles</dt>
        <dd>Información privada que requiere protección especial (contraseñas, tarjetas, salud, etc.).</dd>

        <dt className="fw-bold">Dependencia</dt>
        <dd>Elemento externo que una aplicación necesita para funcionar (biblioteca, módulo, plugin).</dd>

        <dt className="fw-bold">Deserialización insegura</dt>
        <dd>Vulnerabilidad al reconstruir objetos manipulados que puede ejecutar código malicioso.</dd>

        <dt className="fw-bold">DNS (Domain Name System)</dt>
        <dd>Sistema que traduce nombres de dominio en direcciones IP.</dd>

        <dt className="fw-bold">ELK Stack</dt>
        <dd>Conjunto de herramientas (Elasticsearch, Logstash, Kibana) para logs y visualización.</dd>

        <dt className="fw-bold">Enlace de DNS</dt>
        <dd>Técnica maliciosa que manipula respuestas DNS para redirigir solicitudes.</dd>

        <dt className="fw-bold">Entropía</dt>
        <dd>Medida de aleatoriedad en contraseñas/identificadores.</dd>

        <dt className="fw-bold">Escalamiento de incidentes</dt>
        <dd>Proceso para elevar un problema a niveles superiores hasta su resolución.</dd>

        <dt className="fw-bold">Eventos críticos</dt>
        <dd>Sucesos importantes (logins, transacciones, accesos fallidos).</dd>

        <dt className="fw-bold">Firma digital</dt>
        <dd>Método criptográfico que garantiza origen y no modificación.</dd>

        <dt className="fw-bold">Firewall</dt>
        <dd>Sistema que filtra tráfico de red según reglas de seguridad.</dd>

        <dt className="fw-bold">Formato estandarizado de registros</dt>
        <dd>Estructura uniforme para facilitar análisis automático de logs.</dd>

        <dt className="fw-bold">Framework</dt>
        <dd>Conjunto de herramientas reutilizables para desarrollo (Spring, Struts, ASP.NET).</dd>

        <dt className="fw-bold">Fuerza bruta</dt>
        <dd>Intentar muchas combinaciones de usuario/contraseña hasta acertar.</dd>

        <dt className="fw-bold">Funciones hash</dt>
        <dd>Operaciones que convierten datos en cadenas únicas (seguras: SHA-256, SHA-3; inseguras: MD5, SHA-1).</dd>

        <dt className="fw-bold">GDPR y PCI DSS</dt>
        <dd>Regulaciones para proteger datos personales (GDPR) y de tarjetas (PCI DSS).</dd>

        <dt className="fw-bold">Hardening</dt>
        <dd>Reforzar seguridad eliminando configuraciones/servicios innecesarios.</dd>

        <dt className="fw-bold">Hash</dt>
        <dd>Resultado de aplicar una función hash a un dato (p. ej., contraseña) para almacenarlo de forma segura.</dd>

        <dt className="fw-bold">HSTS</dt>
        <dd>Política que obliga a usar siempre HTTPS con un sitio web.</dd>

        <dt className="fw-bold">IAST</dt>
        <dd>Pruebas interactivas que combinan dinámicas y estáticas durante la ejecución.</dd>

        <dt className="fw-bold">Identificador de sesión</dt>
        <dd>Código único para identificar una sesión activa de usuario.</dd>

        <dt className="fw-bold">Integridad</dt>
        <dd>Propiedad de que los datos no han sido alterados sin autorización.</dd>

        <dt className="fw-bold">Integridad de registros</dt>
        <dd>Garantía de que los logs no han sido modificados/eliminados.</dd>

        <dt className="fw-bold">JSON</dt>
        <dd>Formato de texto para intercambiar datos de forma sencilla y legible.</dd>

        <dt className="fw-bold">LDAP</dt>
        <dd>Protocolo para acceder/administrar servicios de directorio.</dd>

        <dt className="fw-bold">Lista de contraseñas débiles conocidas</dt>
        <dd>Conjunto de contraseñas comunes fácilmente adivinables.</dd>

        <dt className="fw-bold">Lista positiva (whitelist / allow-list)</dt>
        <dd>Conjunto de orígenes/recursos explícitamente permitidos.</dd>

        <dt className="fw-bold">Localhost (127.0.0.1)</dt>
        <dd>Dirección IP que se refiere al equipo local.</dd>

        <dt className="fw-bold">Lógica de negocio</dt>
        <dd>Reglas y procesos que definen el funcionamiento de la aplicación.</dd>

        <dt className="fw-bold">Maven</dt>
        <dd>Herramienta/repositorio muy usado para gestionar dependencias Java.</dd>

        <dt className="fw-bold">ModSecurity</dt>
        <dd>WAF que filtra/bloquea tráfico malicioso mediante reglas (p. ej., OWASP CRS).</dd>

        <dt className="fw-bold">Modelado de amenazas</dt>
        <dd>Identificar y analizar riesgos/ataques potenciales a un sistema.</dd>

        <dt className="fw-bold">Monitoreo activo</dt>
        <dd>Supervisión en tiempo real para detectar comportamientos sospechosos.</dd>

        <dt className="fw-bold">Multi-tenant</dt>
        <dd>Arquitectura donde una app sirve a varios clientes de forma aislada y segura.</dd>

        <dt className="fw-bold">NIST 800-61r2</dt>
        <dd>Guía del NIST para gestión de incidentes de seguridad informática.</dd>

        <dt className="fw-bold">NIST 800-63B</dt>
        <dd>Estándar de seguridad con lineamientos para contraseñas y autenticación.</dd>

        <dt className="fw-bold">NoSQL</dt>
        <dd>Bases de datos que no usan tablas tradicionales (flexibles, gran volumen).</dd>

        <dt className="fw-bold">npm</dt>
        <dd>Gestor de paquetes oficial de Node.js.</dd>

        <dt className="fw-bold">NVD</dt>
        <dd>Base de datos oficial de vulnerabilidades con su severidad.</dd>

        <dt className="fw-bold">OAuth</dt>
        <dd>Estándar para autorizar acceso sin compartir contraseñas.</dd>

        <dt className="fw-bold">OGNL</dt>
        <dd>Lenguaje de expresiones usado en algunas apps Java que puede ser explotado si no se controla.</dd>

        <dt className="fw-bold">OpenID</dt>
        <dd>Protocolo de autenticación para iniciar sesión en múltiples servicios.</dd>

        <dt className="fw-bold">ORM</dt>
        <dd>Herramienta que facilita la interacción con bases de datos sin escribir SQL manual.</dd>

        <dt className="fw-bold">OWASP CycloneDX</dt>
        <dd>Herramienta OWASP para crear SBOM y detectar vulnerabilidades en componentes.</dd>

        <dt className="fw-bold">OWASP Dependency-Check</dt>
        <dd>Analiza aplicaciones para identificar bibliotecas con vulnerabilidades conocidas.</dd>

        <dt className="fw-bold">Parche</dt>
        <dd>Corrección del fabricante para solucionar fallos de seguridad o errores.</dd>

        <dt className="fw-bold">Parche virtual</dt>
        <dd>Medida temporal que mitiga una vulnerabilidad sin modificar el código afectado.</dd>

        <dt className="fw-bold">Patrones de diseño seguros</dt>
        <dd>Soluciones probadas que ayudan a construir apps resistentes a ataques.</dd>

        <dt className="fw-bold">Permisos</dt>
        <dd>Autorizaciones que definen qué puede hacer un usuario.</dd>

        <dt className="fw-bold">Pipeline</dt>
        <dd>Pasos automatizados de build, prueba y despliegue del software.</dd>

        <dt className="fw-bold">Principio de mínimo privilegio</dt>
        <dd>Dar a cada usuario solo los permisos estrictamente necesarios.</dd>

        <dt className="fw-bold">Privacidad</dt>
        <dd>Protección de datos personales/sensibles ante accesos no autorizados.</dd>

        <dt className="fw-bold">Puertos</dt>
        <dd>Canales lógicos para enviar/recibir información; mantener cerrados los innecesarios.</dd>

        <dt className="fw-bold">Redirección HTTP</dt>
        <dd>Enviar al navegador de una URL a otra automáticamente.</dd>

        <dt className="fw-bold">Registro de eventos</dt>
        <dd>Almacenar información de acciones/sucesos importantes para análisis posterior.</dd>

        <dt className="fw-bold">Relleno de credenciales (Credential stuffing)</dt>
        <dd>Uso de combinaciones filtradas de otros sitios para intentar acceder a cuentas.</dd>

        <dt className="fw-bold">Repositorio oficial</dt>
        <dd>Fuente validada y confiable para descargar componentes.</dd>

        <dt className="fw-bold">Requerimientos de seguridad</dt>
        <dd>Condiciones específicas para proteger datos y funcionalidades.</dd>

        <dt className="fw-bold">Retire.js</dt>
        <dd>Herramienta que detecta bibliotecas JavaScript obsoletas o vulnerables.</dd>

        <dt className="fw-bold">SBOM (Software Bill of Materials)</dt>
        <dd>Lista de componentes y dependencias de una aplicación.</dd>

        <dt className="fw-bold">SAST</dt>
        <dd>Análisis estático de seguridad del código fuente.</dd>

        <dt className="fw-bold">Sanitización</dt>
        <dd>Limpiar/validar datos de usuario para eliminar contenido malicioso.</dd>

        <dt className="fw-bold">SCA (Software Composition Analysis)</dt>
        <dd>Identifica componentes de terceros y verifica su seguridad.</dd>

        <dt className="fw-bold">Segmentación</dt>
        <dd>Dividir red/aplicación en partes aisladas para limitar el alcance de ataques.</dd>

        <dt className="fw-bold">Serialización</dt>
        <dd>Convertir estructuras de datos a un formato que pueda almacenarse o transmitirse.</dd>

        <dt className="fw-bold">Servicios en la nube</dt>
        <dd>Plataformas (AWS, GCP, Azure) que ofrecen recursos por internet.</dd>

        <dt className="fw-bold">Sesión</dt>
        <dd>Periodo de interacción autenticada de un usuario con una aplicación.</dd>

        <dt className="fw-bold">SQL</dt>
        <dd>Lenguaje para gestionar y consultar bases de datos relacionales.</dd>

        <dt className="fw-bold">SSRF</dt>
        <dd>Vulnerabilidad que permite forzar al servidor a hacer solicitudes manipuladas.</dd>

        <dt className="fw-bold">TLS</dt>
        <dd>Protocolo que asegura conexiones en internet (HTTPS).</dd>

        <dt className="fw-bold">Token de acceso (JWT)</dt>
        <dd>Clave digital que identifica a un usuario durante una sesión.</dd>

        <dt className="fw-bold">Tokenización</dt>
        <dd>Reemplazar datos reales por valores ficticios sin utilidad externa.</dd>

        <dt className="fw-bold">TOCTOU</dt>
        <dd>Condición de carrera: el recurso cambia entre la verificación y su uso.</dd>

        <dt className="fw-bold">Trazabilidad</dt>
        <dd>Rastrear cambios y acciones dentro de un sistema para auditoría.</dd>

        <dt className="fw-bold">URL</dt>
        <dd>Dirección web para acceder a una página o recurso.</dd>

        <dt className="fw-bold">Vector de inicialización (IV)</dt>
        <dd>Valor aleatorio usado por ciertos cifrados; no debe reutilizarse.</dd>

        <dt className="fw-bold">VPN</dt>
        <dd>Conexión segura y cifrada entre un dispositivo y una red privada.</dd>

        <dt className="fw-bold">XML</dt>
        <dd>Formato de texto para organizar datos estructurados.</dd>

        <dt className="fw-bold">X-Content-Type-Options</dt>
        <dd>Encabezado que impide que el navegador interprete archivos como otro tipo declarado.</dd>
      </dl>

      <hr />
    </section>
  );
}