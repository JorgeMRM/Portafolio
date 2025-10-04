// src/components/owasp/sections/A10.jsx
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
  { pattern: /\bSSRF\b|falsificaci[óo]n\s+de\s+solicitudes\s+del\s+lado\s+del\s+servidor/giu,
    title: "SSRF",
    content: "Hacer que el servidor solicite recursos internos/externos manipulados." },
  { pattern: /\bDNS\b/giu,
    title: "DNS",
    content: "Traduce nombres de dominio a direcciones IP." },
  { pattern: /enlace\s+de\s+DNS/giu,
    title: "Enlace de DNS",
    content: "Manipular respuestas DNS para redirigir solicitudes." },
  { pattern: /\bfirewall\b/giu,
    title: "Firewall",
    content: "Filtra tráfico de red según reglas de seguridad." },
  { pattern: /lista\s+positiva|allow-?list|whitelist/giu,
    title: "Lista positiva (allow-list)",
    content: "Conjunto de URLs/esquemas/puertos explícitamente permitidos." },
  { pattern: /redirecci[óo]n\s+http/giu,
    title: "Redirección HTTP",
    content: "Enviar automáticamente de una URL a otra." },
  { pattern: /sanitizaci[óo]n/giu,
    title: "Sanitización",
    content: "Limpiar/validar entradas de usuario para quitar contenido malicioso." },
  { pattern: /\bTOCTOU\b|tiempo\s+de\s+verificaci[óo]n.*tiempo\s+de\s+uso/giu,
    title: "TOCTOU",
    content: "Condición de carrera entre validar y usar un recurso." },
  { pattern: /\bOpenID\b/giu,
    title: "OpenID",
    content: "Protocolo de autenticación centralizada." },
  { pattern: /\bVPN\b|cifrado\s+de\s+red/giu,
    title: "VPN",
    content: "Túnel cifrado entre un dispositivo y una red privada." },
  { pattern: /localhost|127\.0\.0\.1/giu,
    title: "localhost (127.0.0.1)",
    content: "Dirección IP que apunta al propio servidor." },
];

export default function A10() {
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
    <section id="a10" className="section" ref={ref}>
      <h2 className="h3 text-center">
        A10:2021 – Falsificación de Solicitudes del Lado del Servidor (SSRF)
      </h2>

      <p>
        La vulnerabilidad de SSRF ocurre cuando una aplicación web obtiene un recurso remoto utilizando una URL
        proporcionada por el usuario sin validarla correctamente. Esto permite que un atacante manipule la
        aplicación para enviar solicitudes falsificadas hacia destinos internos o protegidos, como redes privadas,
        servicios en la nube o sistemas detrás de firewalls y VPNs.
      </p>
      <p>
        En las aplicaciones modernas, donde es común permitir al usuario ingresar URLs para cargar recursos, esta
        vulnerabilidad ha aumentado en frecuencia y gravedad debido a la adopción de arquitecturas complejas y
        servicios en la nube.
      </p>

      <h3 className="h5 mt-4">Cómo se previene</h3>
      <p>Para mitigar las fallas de SSRF, se recomienda implementar controles en varias capas:</p>

      <h4 className="h6 mt-3">1. Desde la capa de red:</h4>
      <ul className="ms-3">
        <li className="mb-2">
          Segmentar las funciones que acceden a recursos remotos en redes separadas para limitar el impacto.
        </li>
        <li className="mb-2">
          Aplicar políticas de firewall con enfoque de “denegar por defecto”, bloqueando todo el tráfico interno salvo el estrictamente necesario.
        </li>
        <li className="mb-2">
          Establecer reglas de firewall específicas por aplicación y mantener un ciclo de vida controlado para estas reglas.
        </li>
        <li className="mb-2">
          Registrar en logs todo el tráfico aceptado y bloqueado, integrándolo con sistemas de monitoreo (ver A09: Fallas en el Registro y Monitoreo).
        </li>
      </ul>

      <h4 className="h6 mt-3">2. Desde la capa de aplicación:</h4>
      <ul className="ms-3">
        <li className="mb-2">Validar y sanitizar todas las URLs ingresadas por los usuarios.</li>
        <li className="mb-2">
          Restringir las solicitudes únicamente a destinos aprobados mediante listas positivas (URLs, esquemas y puertos permitidos).
        </li>
        <li className="mb-2">Deshabilitar las redirecciones HTTP automáticas.</li>
        <li className="mb-2">
          Evitar devolver respuestas “crudas” al cliente que puedan exponer datos internos.
        </li>
        <li className="mb-2">
          Implementar mecanismos para detectar ataques como enlace de DNS y condiciones de carrera (TOCTOU: tiempo de verificación vs. tiempo de uso).
        </li>
        <li className="mb-2">
          No confiar en listas de denegación ni expresiones regulares, ya que los atacantes pueden eludirlas usando técnicas avanzadas.
        </li>
      </ul>

      <h4 className="h6 mt-3">3. Medidas adicionales:</h4>
      <ul className="ms-3">
        <li className="mb-2">
          No alojar servicios críticos relacionados con la seguridad (por ejemplo, autenticación OpenID) en los mismos sistemas frontales expuestos.
        </li>
        <li className="mb-2">
          Para entornos controlados, utilizar cifrado de red (VPN) para separar sistemas que requieran mayor protección.
        </li>
        <li className="mb-2">
          Supervisar y limitar el tráfico hacia direcciones internas como localhost (127.0.0.1).
        </li>
      </ul>
      <hr />
    </section>
  );
}
