// src/components/owasp/sections/A01.jsx
import { Popover } from "bootstrap";
import { useEffect, useRef } from "react";

/* ---------- utilidades para envolver términos sin tocar tu HTML ---------- */
function walkTextNodes(root, cb) {
  const SKIP = new Set(["SCRIPT", "STYLE"]);
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
    acceptNode(node) {
      const p = node.parentElement;
      if (!p) return NodeFilter.FILTER_REJECT;
      if (SKIP.has(p.tagName)) return NodeFilter.FILTER_REJECT;
      if (p.closest(".gloss-pop, a, code, pre")) return NodeFilter.FILTER_REJECT;
      if (!node.nodeValue || !node.nodeValue.trim()) return NodeFilter.FILTER_REJECT;
      return NodeFilter.FILTER_ACCEPT;
    },
  });
  const arr = [];
  while (walker.nextNode()) arr.push(walker.currentNode);
  arr.forEach(cb);
}
function wrapOnce(textNode, regex, makeSpan) {
  const s = textNode.nodeValue;
  regex.lastIndex = 0;
  const m = regex.exec(s);
  if (!m) return null;

  const before = s.slice(0, m.index);
  const match = m[0];
  const after = s.slice(m.index + match.length);

  const frag = document.createDocumentFragment();
  if (before) frag.appendChild(document.createTextNode(before));
  frag.appendChild(makeSpan(match));
  const tail = document.createTextNode(after);
  if (after) frag.appendChild(tail);

  textNode.replaceWith(frag);
  return tail.nodeValue ? tail : null;
}

/* ---------- diccionario de términos (popovers) ---------- */
const TERMS = [
  { pattern: /\bAPIs?\b/giu,
    title: "API (Interfaz de Programación de Aplicaciones)",
    content: "Puente que permite que una aplicación se comunique con otra o con una base de datos para intercambiar información." },
  { pattern: /\bCORS\b/giu,
    title: "CORS (Cross-Origin Resource Sharing)",
    content: "Configuración que controla qué sitios web pueden comunicarse con una aplicación o API." },
  { pattern: /\bURLs?\b/giu,
    title: "URL",
    content: "Dirección web para acceder a una página o recurso." },
  { pattern: /\bIDs?\b/giu,
    title: "ID",
    content: "Identificador único de un recurso o usuario; nunca debe usarse sin controles de autorización." },
  { pattern: /\bJWT\b/giu,
    title: "JWT (Token de acceso)",
    content: "Clave digital que identifica a un usuario durante una sesión y le permite usar la app sin iniciar sesión constantemente." },
  { pattern: /\bcookies?\b/giu,
    title: "Cookies",
    content: "Pequeños archivos que guardan información de la sesión del usuario en el navegador." },
  { pattern: /\bsesión\b/giu,
    title: "Sesión",
    content: "Periodo autenticado de interacción del usuario con una aplicación." },
  { pattern: /\bOAuth\b/giu,
    title: "OAuth",
    content: "Estándar para autorizar y revocar accesos de forma segura sin compartir contraseñas." },
  { pattern: /principio de mínimo privilegio|mínimo privilegio/giu,
    title: "Principio de mínimo privilegio",
    content: "Regla: cada usuario solo debe tener los permisos estrictamente necesarios para sus funciones." },
  { pattern: /\bpermisos?\b/giu,
    title: "Permisos",
    content: "Autorizaciones que definen qué puede hacer un usuario dentro de la aplicación." },
  { pattern: /elevación de privilegios?/giu,
    title: "Elevación de privilegios",
    content: "Obtener privilegios de administrador u otro rol superior sin autorización." },
  { pattern: /fuerza bruta/giu,
    title: "Fuerza bruta",
    content: "Intentar muchas combinaciones (por ejemplo de contraseña) hasta acertar." },
];

export default function A01() {
  const ref = useRef(null);

  useEffect(() => {
    const root = ref.current;
    if (!root) return;

    // Envolver términos con <span.gloss-pop> sin modificar tu marcado
    walkTextNodes(root, (node) => {
      TERMS.forEach((t) => {
        let current = node;
        while (current && current.nodeType === 3) {
          const next = wrapOnce(current, t.pattern, (matched) => {
            const el = document.createElement("span");
            el.className = "gloss-pop";
            el.textContent = matched;
            el.setAttribute("data-bs-toggle", "popover");
            el.setAttribute("data-bs-title", t.title);
            el.setAttribute("data-bs-content", t.content);
            el.setAttribute("tabindex", "0");
            el.setAttribute("role", "button");
            return el;
          });
          current = next;
        }
      });
    });

    // Popovers: desktop hover/focus, móvil click (se cierra al tocar fuera)
    const isTouch = "ontouchstart" in window || navigator.maxTouchPoints > 0;
    const trigger = isTouch ? "click" : "hover focus";

    const targets = Array.from(
      root.querySelectorAll('.gloss-pop[data-bs-toggle="popover"]')
    );

    const instances = targets.map((el) => {
      const pop = new Popover(el, {
        trigger,
        container: "body",
        placement: "auto",
        html: true,
        sanitize: false,
      });
      const hide = () => pop.hide(); // cerrar al quitar cursor/focus
      el.addEventListener("mouseleave", hide);
      el.addEventListener("blur", hide);
      el._hideGloss = hide;
      return pop;
    });

    const handleDocClick = (e) => {
      if (!e.target.closest(".gloss-pop")) instances.forEach((i) => i.hide());
    };
    if (isTouch) document.addEventListener("click", handleDocClick);

    return () => {
      if (isTouch) document.removeEventListener("click", handleDocClick);
      targets.forEach((el) => {
        if (el._hideGloss) {
          el.removeEventListener("mouseleave", el._hideGloss);
          el.removeEventListener("blur", el._hideGloss);
          delete el._hideGloss;
        }
      });
      instances.forEach((i) => i.dispose());
    };
  }, []);

  return (
    <section id="a01" className="section" ref={ref}>
      <h2 className="h3 text-center">A01:2021 - Pérdida de Control de Acceso</h2>

      <p>
        El control de acceso asegura que cada usuario solo pueda realizar las acciones y ver la
        información que le corresponden según sus permisos. Cuando falla, personas no autorizadas
        pueden ver, modificar o eliminar datos importantes, o incluso ejecutar funciones reservadas
        para otros roles.
      </p>

      <h3 className="h5 mt-3">Las vulnerabilidades comunes de control de acceso incluyen:</h3>
      <ul className="ms-3">
        <li className="mb-2">
          No aplicar el principio de mínimo privilegio, lo que permite que cualquier usuario
          tenga acceso a funciones o datos que deberían estar restringidos.
        </li>
        <li className="mb-2">
          Alterar direcciones web (URLs) o parámetros para entrar en áreas privadas de la
          aplicación sin autorización.
        </li>
        <li className="mb-2">
          Poder ver o modificar cuentas de otros usuarios solo conociendo su identificador (ID).
        </li>
        <li className="mb-2">
          Falta de controles en operaciones críticas de APIs como crear, editar o eliminar
          datos (POST, PUT, DELETE).
        </li>
        <li className="mb-2">
          Elevación de privilegios, como actuar como administrador iniciando sesión solo
          como usuario normal.
        </li>
        <li className="mb-2">
          Manipulación de tokens de acceso (JWT), cookies u otros datos para obtener más
          permisos de forma indebida.
        </li>
        <li className="mb-2">
          Errores de configuración en CORS, que permiten que aplicaciones externas
          accedan a datos de la API sin control.
        </li>
        <li className="mb-2">
          Acceder a páginas protegidas sin iniciar sesión o entrar en páginas de
          administrador sin tener permisos.
        </li>
      </ul>

      <h3 className="h5 mt-4">
        Cómo prevenir los controles de acceso rotos (Broken Access Control)
      </h3>
      <p>
        Para evitar esta vulnerabilidad, es fundamental aplicar los controles de acceso
        correctamente y desde el lado del servidor, ya que de esta manera los atacantes
        no podrán modificarlos ni manipular datos sensibles.
      </p>

      <h4 className="h6 mt-3">Medidas de prevención prácticas:</h4>
      <ul className="ms-3">
        <li className="mb-2">
          Implementar los controles de acceso en el servidor o API, no en el navegador,
          para evitar que sean manipulados.
        </li>
        <li className="mb-2">
          Usar el principio de “denegar por defecto”, permitiendo acceso solo a los
          recursos o funciones estrictamente autorizados.
        </li>
        <li className="mb-2">
          Crear un mecanismo centralizado de control de acceso que pueda aplicarse en
          toda la aplicación.
        </li>
        <li className="mb-2">
          Limitar el uso de CORS únicamente a los orígenes confiables y necesarios.
        </li>
        <li className="mb-2">
          Asegurar que los usuarios solo puedan crear, leer, actualizar o eliminar sus
          propios datos, sin acceso a información de otros.
        </li>
        <li className="mb-2">
          Configurar los modelos de negocio para que respeten los límites de permisos
          establecidos.
        </li>
        <li className="mb-2">
          Deshabilitar el listado de directorios en el servidor web y bloquear el acceso
          a archivos internos o de respaldo (como carpetas .git).
        </li>
        <li className="mb-2">
          Registrar los intentos fallidos de acceso y enviar alertas a los
          administradores en caso de actividad sospechosa.
        </li>
        <li className="mb-2">
          Establecer límites de peticiones a la API, para evitar ataques automatizados
          de fuerza bruta.
        </li>
        <li className="mb-2">
          Invalidad los identificadores de sesión al cerrar sesión. Los tokens de acceso (JWT)
          deben ser de corta duración, o bien usar estándares como OAuth para revocarlos si
          son de larga duración.
        </li>
      </ul>

      <hr />
    </section>
  );
}
