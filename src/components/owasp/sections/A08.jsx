// src/components/owasp/sections/A08.jsx
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
  { pattern: /\bCDN\b/giu,
    title: "CDN (Content Delivery Network)",
    content: "Red de servidores que entrega contenido web de forma rápida y distribuida." },
  { pattern: /\bCI\/CD\b|integraci[óo]n\s+continua.*entrega\s+continua/giu,
    title: "CI/CD",
    content: "Automatiza integración, pruebas y despliegue del software." },
  { pattern: /OWASP\s+Dependency-Check/giu,
    title: "OWASP Dependency-Check",
    content: "Detecta librerías con vulnerabilidades conocidas (CVEs)." },
  { pattern: /\bCycloneDX\b|OWASP\s+CycloneDX/giu,
    title: "CycloneDX",
    content: "Estándar/SBOM para listar componentes y gestionar riesgos." },
  { pattern: /\bSBOM\b/giu,
    title: "SBOM (Software Bill of Materials)",
    content: "Lista de componentes/dependencias de una aplicación." },
  { pattern: /\bdeserializaci[óo]n\s+insegura\b/giu,
    title: "Deserialización insegura",
    content: "Reconstrucción de objetos manipulados que puede ejecutar código." },
  { pattern: /\bfirma\s+digital\b/giu,
    title: "Firma digital",
    content: "Garantiza origen e integridad de archivos/artefactos." },
  { pattern: /\bintegridad\b/giu,
    title: "Integridad",
    content: "Los datos no han sido alterados sin autorización." },
  { pattern: /\bMaven\b/giu,
    title: "Maven",
    content: "Herramienta/repositorio para dependencias Java." },
  { pattern: /\bnpm\b/giu,
    title: "npm",
    content: "Gestor de paquetes oficial de Node.js." },
  { pattern: /\bRepositorio\s+oficial\b/giu,
    title: "Repositorio oficial",
    content: "Fuente validada y confiable para descargar componentes." },
  { pattern: /\bPipeline\b/giu,
    title: "Pipeline",
    content: "Pasos automatizados de build, prueba y despliegue." },
  { pattern: /\bplugins?\b/giu,
    title: "Plugin",
    content: "Complemento que extiende funcionalidades de una app." },
  { pattern: /\bbibliotecas?\b/giu,
    title: "Biblioteca",
    content: "Conjunto reutilizable de funciones/recursos para tu app." },
];

export default function A08() {
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
    <section id="a08" className="section" ref={ref}>
      <h2 className="h3 text-center">A08:2021 – Fallas en el Software y en la Integridad de los Datos</h2>

      <p>
        Esta vulnerabilidad se presenta cuando el software, sus componentes o los datos que maneja no cuentan con mecanismos
        que garanticen su integridad, permitiendo que sean alterados por atacantes.
      </p>

      <h3 className="h5 mt-3">Situaciones comunes incluyen:</h3>
      <ul className="ms-3">
        <li className="mb-2">
          Uso de plugins, bibliotecas o módulos descargados desde fuentes, repositorios o redes de entrega de contenido (CDN) no confiables.
        </li>
        <li className="mb-2">
          Pipelines de integración y entrega continua (CI/CD) inseguros, que pueden permitir la inserción de código malicioso o accesos no autorizados.
        </li>
        <li className="mb-2">
          Funcionalidades de actualización automática sin verificación de integridad, que permiten que un atacante distribuya versiones alteradas de la aplicación.
        </li>
        <li className="mb-2">
          Serialización o codificación de objetos y datos que luego pueden ser manipulados y provocar deserialización insegura, ejecutando código no autorizado.
        </li>
      </ul>

      <p>
        Estos problemas pueden comprometer el software en su totalidad, permitir la ejecución de código malicioso y poner en riesgo la información del sistema y de los usuarios.
      </p>

      <h3 className="h5 mt-4">Cómo se previene</h3>
      <ol className="ms-3">
        <li className="mb-3">
          <strong>Verificación de integridad:</strong>
          <ul className="ms-3 mt-2">
            <li className="mb-2">
              Utilizar firmas digitales o mecanismos similares para garantizar que el software o datos provienen de una fuente confiable y no han sido modificados.
            </li>
          </ul>
        </li>

        <li className="mb-3">
          <strong>Fuentes confiables de componentes:</strong>
          <ul className="ms-3 mt-2">
            <li className="mb-2">Descargar bibliotecas y dependencias solo de repositorios oficiales (como npm o Maven).</li>
            <li className="mb-2">En entornos de alto riesgo, almacenar las dependencias en un repositorio interno validado.</li>
          </ul>
        </li>

        <li className="mb-3">
          <strong>Análisis de componentes de terceros:</strong>
          <ul className="ms-3 mt-2">
            <li className="mb-2">
              Usar herramientas como OWASP Dependency-Check o OWASP CycloneDX para identificar vulnerabilidades conocidas en librerías externas.
            </li>
          </ul>
        </li>

        <li className="mb-3">
          <strong>Control en el pipeline CI/CD:</strong>
          <ul className="ms-3 mt-2">
            <li className="mb-2">Proteger el pipeline con controles de acceso estrictos y separación de responsabilidades.</li>
            <li className="mb-2">Revisar cada cambio en el código y las configuraciones antes de su integración para evitar código malicioso.</li>
          </ul>
        </li>

        <li className="mb-3">
          <strong>Protección de datos y serialización segura:</strong>
          <ul className="ms-3 mt-2">
            <li className="mb-2">Evitar enviar datos sin cifrar ni firmar a clientes no confiables.</li>
            <li className="mb-2">
              Implementar mecanismos de verificación de integridad o firmas electrónicas para prevenir modificaciones o reutilización indebida de datos serializados.
            </li>
          </ul>
        </li>
      </ol>
      <hr />
    </section>
  );
}
