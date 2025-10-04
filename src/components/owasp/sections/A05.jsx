// src/components/owasp/sections/A05.jsx
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
  { pattern: /\bHSTS\b/giu, title: "HSTS",
    content: "HTTP Strict Transport Security: obliga al navegador a usar siempre HTTPS." },
  { pattern: /\bCSP\b/giu, title: "CSP (Content Security Policy)",
    content: "Política que limita orígenes de scripts/recursos para evitar XSS e inyecciones." },
  { pattern: /X-Content-Type-Options/giu, title: "X-Content-Type-Options",
    content: "Evita que el navegador 'adivine' tipos; usa 'nosniff' para mayor seguridad." },
  { pattern: /\bACLs?\b/giu, title: "ACL (Access Control List)",
    content: "Lista de control de acceso que define permisos a recursos/acciones." },
  { pattern: /\bhardening\b/giu, title: "Hardening",
    content: "Reforzar seguridad eliminando servicios/configuraciones innecesarias." },
  { pattern: /\bASP\.?NET\b/giu, title: "ASP.NET",
    content: "Framework de Microsoft para construir aplicaciones y servicios web." },
  { pattern: /\bframeworks?\b/giu, title: "Framework",
    content: "Conjunto de herramientas/componentes reutilizables para desarrollo." },
  { pattern: /\bbibliotecas?\b/giu, title: "Biblioteca",
    content: "Colección de funciones y recursos que integra tu aplicación." },
  { pattern: /\bAmazon\s+S3\b/giu, title: "Amazon S3",
    content: "Almacenamiento en AWS; requiere permisos y políticas seguras en buckets." },
  { pattern: /\bbuckets?\b/giu, title: "Bucket (S3)",
    content: "Contenedor de objetos en S3; configura políticas, cifrado y acceso mínimo." },
  { pattern: /\bAWS\b|Amazon Web Services/giu, title: "AWS",
    content: "Plataforma de servicios en la nube de Amazon." },
  { pattern: /\bpuertos?\b/giu, title: "Puertos",
    content: "Canales lógicos de red; cierra los que no se usen y filtra con firewall." },
  { pattern: /\bSegmentación\b/giu, title: "Segmentación",
    content: "Divide red/app en zonas aisladas para limitar el impacto de intrusiones." },
  { pattern: /\bServicios? en la nube\b/giu, title: "Servicios en la nube",
    content: "Plataformas como AWS, GCP o Azure que ofrecen recursos por Internet." },
  { pattern: /\bparches? de seguridad\b|Actualización de seguridad|\bparche\b/giu, title: "Parche / actualización de seguridad",
    content: "Corrección oficial que soluciona fallos o vulnerabilidades." },
  { pattern: /\bHTTPS\b/giu, title: "HTTPS",
    content: "HTTP sobre TLS: cifra el tráfico entre navegador y servidor." },
  { pattern: /\bcontenedores?\b/giu, title: "Contenedores",
    content: "Aislan apps y dependencias; aplica principios de mínimos privilegios." },
  { pattern: /\bgrupos de seguridad\b/giu, title: "Grupos de seguridad",
    content: "Listas de reglas de firewall asociadas a recursos (por ej., en la nube)." },
  { pattern: /\bcredenciales? predeterminadas?\b/giu, title: "Credenciales predeterminadas",
    content: "Usuarios/contraseñas de fábrica; cámbialas y deshabilita las no usadas." },
];

export default function A05() {
  const ref = useRef(null);

  useEffect(() => {
    const root = ref.current;
    if (!root) return;

    // Envolver términos interactivos sin tocar tu contenido
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

    const targets = Array.from(root.querySelectorAll('.gloss-pop[data-bs-toggle="popover"]'));
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
    <section id="a05" className="section" ref={ref}>
      <h2 className="h3 text-center">A05:2021 – Configuración de Seguridad Incorrecta</h2>

      <p>
        La configuración incorrecta de seguridad ocurre cuando una aplicación, servidor o servicio no está ajustado de manera segura,
        dejando funciones habilitadas, cuentas predeterminadas o configuraciones por defecto que los atacantes pueden aprovechar.
      </p>

      <h3 className="h5 mt-3">Una aplicación puede ser vulnerable si:</h3>
      <ul className="ms-3">
        <li className="mb-2">
          No se han aplicado configuraciones de seguridad recomendadas (hardening) en el sistema o en servicios en la nube.
        </li>
        <li className="mb-2">Hay funciones, puertos, servicios, páginas o privilegios innecesarios habilitados.</li>
        <li className="mb-2">Las cuentas predeterminadas aún están activas con sus contraseñas por defecto.</li>
        <li className="mb-2">Los mensajes de error muestran información técnica detallada (como trazas de pila).</li>
        <li className="mb-2">Las últimas funciones de seguridad están deshabilitadas o mal configuradas.</li>
        <li className="mb-2">
          Los servidores, frameworks (como Spring, Struts, ASP.NET), bibliotecas o bases de datos no tienen valores seguros configurados.
        </li>
        <li className="mb-2">Faltan encabezados de seguridad en las respuestas del servidor (por ejemplo, HSTS o CSP).</li>
        <li className="mb-2">El software está desactualizado o presenta vulnerabilidades conocidas.</li>
      </ul>

      <p className="mt-2">
        Sin un proceso estándar y repetible de configuración segura, los sistemas quedan más expuestos a ataques.
      </p>

      <h3 className="h5 mt-4">Cómo se previene</h3>
      <p>Para evitar configuraciones inseguras, se deben aplicar prácticas de seguridad consistentes y automatizadas:</p>

      <ol className="ms-3">
        <li className="mb-3">
          <strong>Hardening de seguridad:</strong>
          <ul className="ms-3 mt-2">
            <li className="mb-2">Aplicar configuraciones mínimas y seguras eliminando funciones, puertos o servicios innecesarios.</li>
            <li className="mb-2">
              Usar un proceso repetible que configure de forma segura todos los entornos (desarrollo, pruebas y producción) con credenciales distintas.
            </li>
          </ul>
        </li>

        <li className="mb-3">
          <strong>Automatización y consistencia:</strong>
          <ul className="ms-3 mt-2">
            <li className="mb-2">Automatizar la configuración inicial y validarla periódicamente.</li>
            <li className="mb-2">Asegurar que todos los entornos sean idénticos en su configuración básica, reduciendo errores manuales.</li>
          </ul>
        </li>

        <li className="mb-3">
          <strong>Gestión de cuentas y permisos:</strong>
          <ul className="ms-3 mt-2">
            <li className="mb-2">Deshabilitar cuentas predeterminadas y cambiar sus contraseñas.</li>
            <li className="mb-2">Revisar los permisos de almacenamiento en la nube (por ejemplo, buckets en Amazon S3).</li>
          </ul>
        </li>

        <li className="mb-3">
          <strong>Actualización constante:</strong>
          <ul className="ms-3 mt-2">
            <li className="mb-2">Revisar y aplicar parches de seguridad y actualizaciones de forma regular.</li>
            <li className="mb-2">Seguir notas de seguridad y guías oficiales para cada tecnología usada.</li>
          </ul>
        </li>

        <li className="mb-3">
          <strong>Arquitectura segura:</strong>
          <ul className="ms-3 mt-2">
            <li className="mb-2">
              Segmentar la aplicación en componentes aislados (contenedores, grupos de seguridad o ACLs) para reducir el impacto de una posible intrusión.
            </li>
          </ul>
        </li>

        <li className="mb-3">
          <strong>Encabezados y directivas de seguridad:</strong>
          <ul className="ms-3 mt-2">
            <li className="mb-2">
              Configurar encabezados como HSTS, CSP y X-Content-Type-Options para reforzar la seguridad del lado del cliente.
            </li>
          </ul>
        </li>

        <li className="mb-1">
          <strong>Verificación continua:</strong>
          <ul className="ms-3 mt-2">
            <li className="mb-2">Implementar herramientas automáticas que verifiquen configuraciones y alerten sobre posibles errores.</li>
          </ul>
        </li>
      </ol>
      <hr />
    </section>
  );
}
