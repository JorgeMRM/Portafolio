// src/components/owasp/sections/A04.jsx
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
  { pattern: /\bS-?SDLC\b/giu,
    title: "Ciclo de Desarrollo Seguro (S-SDLC)",
    content: "Metodología que integra la seguridad en todas las fases del desarrollo de software." },
  { pattern: /\bautenticidad\b/giu,
    title: "Autenticidad",
    content: "Garantiza que la identidad de usuarios o sistemas es verdadera y legítima." },
  { pattern: /\bconfidencialidad\b/giu,
    title: "Confidencialidad",
    content: "Solo personas autorizadas pueden acceder a la información." },
  { pattern: /\bintegridad\b/giu,
    title: "Integridad",
    content: "Los datos no se alteran de forma indebida o sin autorización." },
  { pattern: /\bdisponibilidad\b/giu,
    title: "Disponibilidad",
    content: "La información y servicios están accesibles cuando se necesitan." },
  { pattern: /\blógica de negocio\b/giu,
    title: "Lógica de negocio",
    content: "Reglas y procesos que definen el funcionamiento de la aplicación." },
  { pattern: /\bmodelado de amenazas\b/giu,
    title: "Modelado de amenazas",
    content: "Proceso de identificar y analizar riesgos y ataques potenciales." },
  { pattern: /\bmulti-?tenant|multiempresa|multiusuario\b/giu,
    title: "Multi-tenant",
    content: "Una sola app sirve a varios clientes/usuarios con aislamiento seguro." },
  { pattern: /\bpatrones de diseño seguros\b/giu,
    title: "Patrones de diseño seguros",
    content: "Soluciones probadas para construir apps resistentes a ataques." },
  { pattern: /\bprivacidad\b/giu,
    title: "Privacidad",
    content: "Protección de datos personales y sensibles frente a accesos no autorizados." },
  { pattern: /\brequerimientos? de seguridad\b/giu,
    title: "Requerimientos de seguridad",
    content: "Condiciones que debe cumplir la app para proteger datos y funcionalidades." },
  { pattern: /\bbibliotecas?\b/giu,
    title: "Biblioteca",
    content: "Conjunto reutilizable de funciones/recursos que integra tu app." },
  { pattern: /\bcomponentes?\b/giu,
    title: "Componente",
    content: "Parte del sistema (módulo, servicio, librería) con una función específica." },
];

/* ---------- componente ---------- */
export default function A04() {
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
    <section id="a04" className="section" ref={ref}>
      <h2 className="h3 text-center">A04:2021 – Diseño Inseguro</h2>

      <p>
        El diseño inseguro ocurre cuando una aplicación o sistema carece de los controles de seguridad necesarios
        desde su etapa de planificación y construcción. A diferencia de los errores de implementación, un diseño
        inseguro implica que nunca se definieron mecanismos efectivos para proteger la aplicación contra amenazas
        específicas.
      </p>

      <h3 className="h5 mt-3">Un diseño inseguro puede originarse por:</h3>
      <ul className="ms-3">
        <li className="mb-2">Falta de análisis de riesgos y perfiles de amenazas durante la fase inicial del proyecto.</li>
        <li className="mb-2">Requerimientos de seguridad poco claros o inexistentes.</li>
        <li className="mb-2">Ausencia de separación entre funciones críticas o datos sensibles.</li>
        <li className="mb-2">No integrar prácticas de seguridad durante todo el ciclo de vida del desarrollo.</li>
      </ul>

      <p className="mt-2">
        Incluso si la implementación técnica es correcta, un diseño inseguro no puede ser corregido posteriormente
        sin rediseñar el sistema.
      </p>

      <h3 className="h5 mt-4">Cómo se previene</h3>
      <p>
        Para evitar el diseño inseguro, es necesario integrar la seguridad desde el inicio del proyecto y
        mantenerla durante todo el ciclo de desarrollo:
      </p>

      <ol className="ms-3">
        <li className="mb-3">
          <strong>Adoptar un Ciclo de Desarrollo Seguro (S-SDLC):</strong>
          <ul className="ms-3 mt-2">
            <li className="mb-2">Incorporar la seguridad como parte integral del ciclo de vida del software.</li>
            <li className="mb-2">Trabajar junto a especialistas en seguridad desde la fase de análisis hasta el mantenimiento.</li>
          </ul>
        </li>

        <li className="mb-3">
          <strong>Definir requerimientos claros de seguridad:</strong>
          <ul className="ms-3 mt-2">
            <li className="mb-2">
              Identificar la información sensible que manejará la aplicación (confidencialidad, integridad,
              disponibilidad y autenticidad).
            </li>
            <li className="mb-2">Documentar los requerimientos de seguridad y privacidad junto con los funcionales.</li>
          </ul>
        </li>

        <li className="mb-3">
          <strong>Aplicar patrones de diseño seguros:</strong>
          <ul className="ms-3 mt-2">
            <li className="mb-2">Usar componentes probados y bibliotecas confiables ("camino pavimentado").</li>
            <li className="mb-2">Mantener un catálogo de patrones de diseño seguros reutilizables.</li>
          </ul>
        </li>

        <li className="mb-3">
          <strong>Realizar modelado de amenazas:</strong>
          <ul className="ms-3 mt-2">
            <li className="mb-2">Analizar los riesgos en flujos críticos como autenticación, control de acceso y lógica de negocio.</li>
            <li className="mb-2">Revisar los supuestos de seguridad de forma periódica.</li>
          </ul>
        </li>

        <li className="mb-3">
          <strong>Pruebas y validaciones constantes:</strong>
          <ul className="ms-3 mt-2">
            <li className="mb-2">
              Implementar pruebas unitarias e integrales que validen los controles de seguridad en cada capa de la aplicación.
            </li>
            <li className="mb-2">Documentar casos de uso y casos de mal uso para anticipar posibles ataques.</li>
          </ul>
        </li>

        <li className="mb-1">
          <strong>Separación y control de recursos:</strong>
          <ul className="ms-3 mt-2">
            <li className="mb-2">Dividir correctamente las capas de red y aplicación según su nivel de exposición.</li>
            <li className="mb-2">Aislar de forma segura los entornos multiusuario o multiempresa (multi-tenant).</li>
            <li className="mb-2">Limitar el uso de recursos por usuario o servicio para evitar abusos.</li>
          </ul>
        </li>
      </ol>
      <hr />
    </section>
  );
}
