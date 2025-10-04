// src/components/owasp/sections/A06.jsx
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
  { pattern: /\bCVE\b/giu,
    title: "CVE (Common Vulnerabilities and Exposures)",
    content: "Listado público de vulnerabilidades de software con identificadores únicos." },
  { pattern: /\bNVD\b/giu,
    title: "NVD (National Vulnerability Database)",
    content: "Base de datos oficial que publica vulnerabilidades y su severidad." },
  { pattern: /OWASP\s+Dependency-Check/giu,
    title: "OWASP Dependency-Check",
    content: "Herramienta que detecta dependencias con CVEs conocidos." },
  { pattern: /retire\.js/giu,
    title: "Retire.js",
    content: "Detecta bibliotecas JavaScript obsoletas o vulnerables." },
  { pattern: /\bSCA\b/giu,
    title: "SCA (Software Composition Analysis)",
    content: "Identifica componentes de terceros y verifica su seguridad." },
  { pattern: /\bHTTPS\b/giu,
    title: "HTTPS",
    content: "HTTP sobre TLS: descarga desde fuentes oficiales y enlaces cifrados." },
  { pattern: /\bparches?\b/giu,
    title: "Parche",
    content: "Actualización que corrige fallos o vulnerabilidades." },
  { pattern: /\bparche\s+virtual\b/giu,
    title: "Parche virtual",
    content: "Mitigación temporal sin cambiar el código (p. ej., reglas en WAF)." },
  { pattern: /\bbibliotecas?\b/giu,
    title: "Biblioteca",
    content: "Conjunto de funciones y recursos reutilizables que integra tu app." },
  { pattern: /\bdependencias?\b/giu,
    title: "Dependencia",
    content: "Elemento externo (lib, módulo, plugin) que tu app necesita." },
  { pattern: /\bframeworks?\b/giu,
    title: "Framework",
    content: "Conjunto de herramientas/estructuras para desarrollar software." },
  { pattern: /\bcomponente[s]?\s+firmado[s]?\s+digitalmente\b/giu,
    title: "Componente firmado digitalmente",
    content: "Incluye firma electrónica para asegurar origen e integridad." },
  { pattern: /\barchivo[s]?\s+de\s+prueba\b/giu,
    title: "Archivo de prueba",
    content: "Material de desarrollo; elimínalo en producción." },
  { pattern: /\bsegmentación\b/giu,
    title: "Segmentación",
    content: "Separar sistemas/redes para limitar el impacto de intrusiones." },
];

/* ---------- componente ---------- */
export default function A06() {
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
    <section id="a06" className="section" ref={ref}>
      <h2 className="h3 text-center">A06:2021 – Componentes Vulnerables y Desactualizados</h2>

      <p>
        Esta vulnerabilidad aparece cuando una aplicación utiliza software, bibliotecas o componentes
        desactualizados o sin soporte, lo que abre la puerta a ataques conocidos. Esto incluye tanto
        el software utilizado directamente como las dependencias internas que forman parte del sistema.
      </p>

      <h3 className="h5 mt-3">Una aplicación puede ser vulnerable si:</h3>
      <ul className="ms-3">
        <li className="mb-2">
          No se conoce con precisión qué versiones de componentes, frameworks, bibliotecas o dependencias
          se están utilizando.
        </li>
        <li className="mb-2">
          Se ejecuta software sin soporte, desactualizado o con vulnerabilidades conocidas.
        </li>
        <li className="mb-2">
          No se realizan análisis periódicos en búsqueda de vulnerabilidades ni se siguen boletines de
          seguridad oficiales.
        </li>
        <li className="mb-2">
          No se aplican parches y actualizaciones de forma oportuna, lo que deja expuestos sistemas durante
          días o meses.
        </li>
        <li className="mb-2">
          No se prueba la compatibilidad después de actualizar o parchear bibliotecas y dependencias.
        </li>
        <li className="mb-2">
          No se aseguran adecuadamente las configuraciones de los componentes, lo que amplifica los riesgos
          (ver A05: Configuración de Seguridad Incorrecta).
        </li>
      </ul>

      <h3 className="h5 mt-4">Cómo se previene</h3>
      <p>
        Para mitigar esta vulnerabilidad, es fundamental contar con un proceso robusto de gestión de
        actualizaciones y parches:
      </p>

      <ol className="ms-3">
        <li className="mb-3">
          <strong>Inventario de componentes:</strong>
          <ul className="ms-3 mt-2">
            <li className="mb-2">
              Mantener una lista actualizada de todos los componentes utilizados (frameworks, bibliotecas,
              dependencias y sus versiones).
            </li>
            <li className="mb-2">
              Incluir tanto los componentes del lado del servidor como los del lado del cliente.
            </li>
          </ul>
        </li>

        <li className="mb-3">
          <strong>Monitoreo constante de vulnerabilidades:</strong>
          <ul className="ms-3 mt-2">
            <li className="mb-2">Utilizar fuentes confiables como CVE (Common Vulnerabilities and Exposures) y la NVD (National Vulnerability Database).</li>
            <li className="mb-2">
              Suscribirse a boletines de seguridad oficiales y alertas de los proveedores de software utilizado.
            </li>
          </ul>
        </li>

        <li className="mb-3">
          <strong>Uso de herramientas de análisis automatizado:</strong>
          <ul className="ms-3 mt-2">
            <li className="mb-2">
              Implementar herramientas como OWASP Dependency-Check, retire.js o análisis de composición de software (SCA) para detectar librerías vulnerables.
            </li>
          </ul>
        </li>

        <li className="mb-3">
          <strong>Eliminación de componentes innecesarios:</strong>
          <ul className="ms-3 mt-2">
            <li className="mb-2">
              Quitar dependencias no utilizadas, funciones obsoletas, archivos de prueba, documentación y
              cualquier componente que no sea indispensable.
            </li>
          </ul>
        </li>

        <li className="mb-3">
          <strong>Actualización y parches oportunos:</strong>
          <ul className="ms-3 mt-2">
            <li className="mb-2">
              Aplicar parches y actualizaciones tan pronto como estén disponibles, priorizando según el riesgo.
            </li>
            <li className="mb-2">
              Probar la compatibilidad de los cambios antes de implementarlos en producción.
            </li>
          </ul>
        </li>

        <li className="mb-3">
          <strong>Fuentes confiables y componentes firmados:</strong>
          <ul className="ms-3 mt-2">
            <li className="mb-2">Descargar siempre software desde fuentes oficiales mediante enlaces seguros (HTTPS).</li>
            <li className="mb-2">Preferir componentes firmados digitalmente para reducir el riesgo de modificaciones maliciosas.</li>
          </ul>
        </li>

        <li className="mb-1">
          <strong>Plan de mantenimiento continuo:</strong>
          <ul className="ms-3 mt-2">
            <li className="mb-2">
              Establecer un plan que contemple revisiones periódicas de versiones, configuraciones y parches durante toda la vida útil de la aplicación.
            </li>
            <li className="mb-2">
              En caso de no poder actualizar un componente crítico, considerar medidas temporales como parches virtuales, segmentación de sistemas y monitoreo reforzado.
            </li>
          </ul>
        </li>
      </ol>
      <hr />
    </section>
  );
}
