// src/components/owasp/sections/A07.jsx
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
  { pattern: /\bMFA\b|autenticaci[óo]n\s+multifactor/giu,
    title: "Autenticación multifactor (MFA)",
    content: "Verificación con dos o más factores (algo que sabes, tienes o eres)." },
  { pattern: /NIST\s*800-63B/giu,
    title: "NIST 800-63B",
    content: "Estándar que define lineamientos modernos para contraseñas y autenticación." },
  { pattern: /\bentrop[ií]a\b/giu,
    title: "Entropía",
    content: "Aleatoriedad suficiente en contraseñas o IDs para impedir su predicción." },
  { pattern: /\bfuerza\s+bruta\b/giu,
    title: "Fuerza bruta",
    content: "Intentar muchas combinaciones de usuario/contraseña hasta acertar." },
  { pattern: /\bhash\b/giu,
    title: "Hash",
    content: "Transformación unidireccional para almacenar contraseñas de forma segura." },
  { pattern: /identificadores?\s+de\s+ses[ií]on/giu,
    title: "Identificador de sesión",
    content: "Código único que representa tu sesión autenticada en el servidor." },
  { pattern: /\bsesi[óo]n\b/giu,
    title: "Sesión",
    content: "Periodo autenticado que termina al cerrar o por inactividad/expiración." },
  { pattern: /relleno\s+de\s+credenciales|credential\s+stuffing/giu,
    title: "Relleno de credenciales (Credential stuffing)",
    content: "Uso de pares usuario/contraseña filtrados en otros sitios para iniciar sesión." },
  { pattern: /reutilizaci[óo]n\s+de\s+credenciales/giu,
    title: "Reutilización de credenciales",
    content: "Volver a usar la misma contraseña entre servicios distintos (riesgoso)." },
  { pattern: /\bcredenciales?\b/giu,
    title: "Credenciales",
    content: "Datos de acceso (usuario y contraseña) que debes proteger." },
  { pattern: /listas?\s+de\s+contraseñas?\s+d[ée]biles?\s+conocidas/giu,
    title: "Lista de contraseñas débiles conocidas",
    content: "Relación de contraseñas comunes/fáciles que se deben bloquear." },
  { pattern: /\bcookies?\s+seguras?\b/giu,
    title: "Cookie segura",
    content: "Usa atributos HttpOnly, Secure y SameSite para proteger el ID de sesión." },
  { pattern: /enumeraci[óo]n\s+de\s+usuarios/giu,
    title: "Enumeración de usuarios",
    content: "Revelar si un usuario existe mediante mensajes o timings diferentes." },
  { pattern: /inicio\s+de\s+ses[ií]on/giu,
    title: "Inicio de sesión",
    content: "Proceso de autenticación; aplica límites y monitoreo ante fallos repetidos." },
];

export default function A07() {
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

    // Popovers: desktop hover/focus; móvil click y click-fuera
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
      const hide = () => pop.hide();
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
    <section id="a07" className="section" ref={ref}>
      <h2 className="h3 text-center">A07:2021 – Fallas de Identificación y Autenticación</h2>

      <p>
        La identificación, autenticación y gestión de sesiones son procesos esenciales para proteger a los
        usuarios y prevenir accesos no autorizados. Cuando estos mecanismos son débiles o están mal
        implementados, los atacantes pueden aprovecharlos para tomar el control de cuentas legítimas.
      </p>

      <h3 className="h5 mt-3">Una aplicación puede ser vulnerable si:</h3>
      <ul className="ms-3">
        <li className="mb-2">
          Permite ataques automatizados como la reutilización de credenciales conocidas (listas de usuario y contraseña filtradas).
        </li>
        <li className="mb-2">Es susceptible a ataques de fuerza bruta u otros intentos repetidos de inicio de sesión.</li>
        <li className="mb-2">Acepta contraseñas débiles o predefinidas como "admin/admin" o "Password1".</li>
        <li className="mb-2">
          Utiliza procesos inseguros para la recuperación de contraseñas, como preguntas de seguridad fáciles de adivinar.
        </li>
        <li className="mb-2">
          Almacena contraseñas en texto claro o usa funciones de hash inseguras (ver A02: Fallas Criptográficas).
        </li>
        <li className="mb-2">No cuenta con autenticación multifactor (MFA) o su implementación es ineficaz.</li>
        <li className="mb-2">Incluye el identificador de sesión en la URL, exponiéndolo a ataques.</li>
        <li className="mb-2">
          Reutiliza identificadores de sesión después de iniciar sesión o no los invalida correctamente al cerrar sesión o por inactividad.
        </li>
      </ul>

      <p className="mt-2">
        Estas fallas pueden permitir el acceso indebido a cuentas de usuario e incluso a cuentas administrativas críticas.
      </p>

      <h3 className="h5 mt-4">Cómo se previene</h3>
      <p>Para reducir estas vulnerabilidades, se recomienda:</p>

      <ol className="ms-3">
        <li className="mb-3">
          <strong>Autenticación robusta:</strong>
          <ul className="ms-3 mt-2">
            <li className="mb-2">Implementar autenticación multifactor (MFA) siempre que sea posible.</li>
            <li className="mb-2">Bloquear intentos automatizados de reutilización de credenciales y ataques de fuerza bruta.</li>
          </ul>
        </li>

        <li className="mb-3">
          <strong>Políticas de contraseñas seguras:</strong>
          <ul className="ms-3 mt-2">
            <li className="mb-2">Eliminar credenciales por defecto, especialmente en cuentas administrativas.</li>
            <li className="mb-2">Verificar que las nuevas contraseñas no estén en listas de contraseñas débiles conocidas.</li>
            <li className="mb-2">
              Seguir estándares como NIST 800-63B, aplicando contraseñas largas, complejas y con rotación razonable.
            </li>
          </ul>
        </li>

        <li className="mb-3">
          <strong>Protección en el registro y recuperación de credenciales:</strong>
          <ul className="ms-3 mt-2">
            <li className="mb-2">Usar mensajes genéricos para evitar ataques de enumeración de usuarios.</li>
            <li className="mb-2">
              Hay que asegurar que los procesos de recuperación de contraseñas no revelen información adicional sobre cuentas válidas.
            </li>
          </ul>
        </li>

        <li className="mb-3">
          <strong>Gestión de sesiones segura:</strong>
          <ul className="ms-3 mt-2">
            <li className="mb-2">Generar identificadores de sesión aleatorios y de alta entropía en el servidor.</li>
            <li className="mb-2">No incluir identificadores de sesión en la URL; deben almacenarse en cookies seguras.</li>
            <li className="mb-2">
              Invalidar los identificadores al cerrar sesión, tras inactividad o después de un tiempo límite.
            </li>
          </ul>
        </li>

        <li className="mb-1">
          <strong>Monitoreo y registros:</strong>
          <ul className="ms-3 mt-2">
            <li className="mb-2">Registrar intentos de inicio de sesión fallidos y generar alertas ante actividades sospechosas.</li>
            <li className="mb-2">
              Analizar patrones que indiquen ataques de relleno de credenciales o fuerza bruta.
            </li>
          </ul>
        </li>
      </ol>
      <hr />
    </section>
  );
}
