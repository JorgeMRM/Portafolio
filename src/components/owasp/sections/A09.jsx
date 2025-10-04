// src/components/owasp/sections/A09.jsx
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
  { pattern: /auditor[ií]a\s+de\s+integridad/giu,
    title: "Auditoría de integridad",
    content: "Garantiza que los registros no se alteran (solo-append, firmas, controles)." },
  { pattern: /ELK\s*Stack|Elasticsearch|Logstash|Kibana/giu,
    title: "ELK Stack",
    content: "Elasticsearch + Logstash + Kibana para centralizar, procesar y visualizar logs." },
  { pattern: /escalamiento\s+de\s+incidentes/giu,
    title: "Escalamiento de incidentes",
    content: "Proceso para elevar un incidente a mayor soporte/gestión con tiempos definidos." },
  { pattern: /eventos?\s+cr[ií]ticos/giu,
    title: "Eventos críticos",
    content: "Logins, intentos fallidos, transacciones de alto valor, cambios sensibles, etc." },
  { pattern: /formato\s+estandarizado\s+de\s+registros/giu,
    title: "Formato estandarizado de registros",
    content: "Estructura consistente (p. ej., JSON con timestamp, nivel, actor, IP, reqId)." },
  { pattern: /integridad\s+de\s+registros/giu,
    title: "Integridad de registros",
    content: "Asegura que los logs no se modifican ni eliminan una vez creados." },
  { pattern: /ModSecurity|WAF/giu,
    title: "ModSecurity (WAF)",
    content: "Cortafuegos de aplicaciones web; puede aplicar reglas OWASP CRS." },
  { pattern: /monitoreo\s+activo/giu,
    title: "Monitoreo activo",
    content: "Supervisión en tiempo real con alertas para detectar anomalías/ataques." },
  { pattern: /NIST\s*800-61r?2/giu,
    title: "NIST 800-61r2",
    content: "Guía para manejo de incidentes: preparación, detección, contención, erradicación, recuperación." },
  { pattern: /registro\s+de\s+eventos/giu,
    title: "Registro de eventos",
    content: "Almacenar información de acciones/sucesos para auditoría y forense." },
  { pattern: /trazabilidad/giu,
    title: "Trazabilidad",
    content: "Rastrear 'quién hizo qué y cuándo' a través de IDs de correlación y auditoría." },
  { pattern: /OWASP\s+ZAP/giu,
    title: "OWASP ZAP",
    content: "Herramienta DAST; útil para probar que tus alertas/monitoreo detectan ataques." },
  { pattern: /alertas?/giu,
    title: "Alertas",
    content: "Notificaciones automáticas ante patrones sospechosos (p. ej., múltiples 401/403)." },
];

export default function A09() {
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
    <section id="a09" className="section" ref={ref}>
      <h2 className="h3 text-center">A09:2021 – Fallas en el Registro y Monitoreo</h2>

      <p>
        Las fallas en el registro y monitoreo ocurren cuando una aplicación no detecta ni responde adecuadamente a actividades
        sospechosas o ataques en curso. Sin un sistema efectivo de registros, alertas y monitoreo, las brechas de seguridad
        pueden pasar desapercibidas durante largos períodos, aumentando el impacto de los ataques.
      </p>

      <h3 className="h5 mt-3">Una aplicación es vulnerable si:</h3>
      <ul className="ms-3">
        <li className="mb-2">No registra eventos importantes como inicios de sesión, intentos fallidos o transacciones críticas.</li>
        <li className="mb-2">Genera registros incompletos, confusos o directamente no los genera.</li>
        <li className="mb-2">No supervisa los registros de aplicaciones y APIs para identificar actividad maliciosa.</li>
        <li className="mb-2">Almacena los registros únicamente de manera local, sin centralizarlos para su análisis.</li>
        <li className="mb-2">No cuenta con alertas configuradas o procesos efectivos de escalamiento ante incidentes.</li>
        <li className="mb-2">
          No detecta ataques activos durante pruebas de seguridad, como análisis dinámicos con herramientas como OWASP ZAP.
        </li>
        <li className="mb-2">
          Filtra información sensible en los registros o hace que sean accesibles para usuarios no autorizados (relacionado con A01: Pérdida de Control de Acceso).
        </li>
      </ul>

      <h3 className="h5 mt-4">Cómo se previene</h3>
      <p>Para mitigar estas fallas, se recomienda implementar los siguientes controles:</p>

      <ol className="ms-3">
        <li className="mb-3">
          <strong>Registro de eventos críticos:</strong>
          <ul className="ms-3 mt-2">
            <li className="mb-2">Registrar inicios de sesión, intentos fallidos, errores de validación y transacciones de alto valor.</li>
            <li className="mb-2">Mantener los registros el tiempo suficiente para permitir análisis forense posterior.</li>
          </ul>
        </li>

        <li className="mb-3">
          <strong>Formato y protección de registros:</strong>
          <ul className="ms-3 mt-2">
            <li className="mb-2">Generar registros en un formato estandarizado, legible y compatible con herramientas de gestión de registros.</li>
            <li className="mb-2">
              Codificar los datos almacenados en registros para evitar ataques como inyección de comandos en sistemas de monitoreo.
            </li>
          </ul>
        </li>

        <li className="mb-3">
          <strong>Monitoreo y alertas activas:</strong>
          <ul className="ms-3 mt-2">
            <li className="mb-2">Configurar alertas automáticas para actividades sospechosas, como múltiples intentos de inicio de sesión fallidos.</li>
            <li className="mb-2">Establecer procesos claros de escalamiento ante incidentes.</li>
          </ul>
        </li>

        <li className="mb-3">
          <strong>Integridad y trazabilidad:</strong>
          <ul className="ms-3 mt-2">
            <li className="mb-2">
              Garantizar que las transacciones críticas tengan trazabilidad completa con auditoría de integridad (solo inserción en bases de datos, sin modificar ni eliminar).
            </li>
          </ul>
        </li>

        <li className="mb-3">
          <strong>Plan de respuesta y recuperación:</strong>
          <ul className="ms-3 mt-2">
            <li className="mb-2">
              Contar con un plan de respuesta basado en estándares como NIST 800-61r2, que permita actuar rápidamente ante incidentes detectados.
            </li>
          </ul>
        </li>

        <li className="mb-3">
          <strong>Herramientas de monitoreo:</strong>
          <ul className="ms-3 mt-2">
            <li className="mb-2">
              Utilizar frameworks y herramientas como ModSecurity (reglas OWASP) y soluciones de correlación de registros como ELK Stack (Elasticsearch, Logstash, Kibana) con paneles y alertas personalizadas.
            </li>
          </ul>
        </li>
      </ol>
      <hr />
    </section>
  );
}
