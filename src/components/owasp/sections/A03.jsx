// src/components/owasp/sections/A03.jsx
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
  { pattern: /\bAPI(?:s)?\b/giu,
    title: "API (Interfaz de Programación de Aplicaciones)",
    content: "Conjunto de funciones que permite que distintas aplicaciones o sistemas se comuniquen entre sí." },
  { pattern: /\bSQL\b/giu,
    title: "SQL",
    content: "Lenguaje para gestionar y consultar bases de datos relacionales." },
  { pattern: /\bNoSQL\b/giu,
    title: "NoSQL",
    content: "Bases de datos no relacionales, aptas para datos flexibles y de gran volumen." },
  { pattern: /\bORM\b/giu,
    title: "ORM (Object-Relational Mapping)",
    content: "Capa que mapea objetos de la app a tablas sin escribir SQL manual." },
  { pattern: /\bLDAP\b/giu,
    title: "LDAP",
    content: "Protocolo para acceder/administrar servicios de directorio (usuarios, grupos, etc.)." },
  { pattern: /\bJSON\b/giu,
    title: "JSON",
    content: "Formato de texto ligero para intercambiar datos." },
  { pattern: /\bXML\b/giu,
    title: "XML",
    content: "Formato de texto para datos estructurados." },
  { pattern: /\bSOAP\b/giu,
    title: "SOAP",
    content: "Protocolo de mensajería para servicios web basado en XML." },
  { pattern: /\bOGNL\b/giu,
    title: "OGNL",
    content: "Lenguaje de expresiones usado en algunas apps Java; puede explotarse si no se controla." },
  { pattern: /consultas?\s+parametrizadas?/giu,
    title: "Consultas parametrizadas",
    content: "Preparan la consulta y envían los datos aparte, evitando concatenaciones inseguras." },
  { pattern: /\bSAST\b/giu,
    title: "SAST",
    content: "Static Application Security Testing: analiza el código sin ejecutarlo." },
  { pattern: /\bDAST\b/giu,
    title: "DAST",
    content: "Dynamic Application Security Testing: prueba la app en ejecución." },
  { pattern: /\bIAST\b/giu,
    title: "IAST",
    content: "Interactive AST: combina análisis estático y dinámico durante la ejecución." },
  { pattern: /\bLIMIT\b/giu,
    title: "LIMIT (SQL)",
    content: "Cláusula para restringir el número de filas devueltas por una consulta." },
];

export default function A03() {
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
    <section id="a03" className="section" ref={ref}>
      <h2 className="h3 text-center">A03:2021 – Inyección</h2>

      <p>
        Las vulnerabilidades de inyección ocurren cuando una aplicación permite que datos maliciosos
        proporcionados por el usuario se interpreten como comandos o consultas. Esto sucede, por ejemplo,
        cuando los datos ingresados no son validados ni filtrados correctamente antes de ser enviados
        a una base de datos, a un sistema operativo o a cualquier otro intérprete.
      </p>

      <h3 className="h5 mt-3">Una aplicación es vulnerable a estos tipos de ataque cuando:</h3>
      <ul className="ms-3">
        <li className="mb-2">Datos de usuario que no son validados, filtrados o sanitizados.</li>
        <li className="mb-2">
          Consultas SQL o NoSQL construidas dinámicamente que permiten modificar o extraer información no autorizada.
        </li>
        <li className="mb-2">
          Inyecciones en comandos del sistema operativo que pueden ejecutar instrucciones peligrosas.
        </li>
        <li className="mb-2">
          Manipulación de consultas ORM (Object-Relational Mapping) para extraer registros adicionales sensibles.
        </li>
        <li className="mb-2">Otras inyecciones en LDAP, JSON, XML, SOAP o expresiones OGNL.</li>
      </ul>

      <p className="mt-3">
        Este tipo de ataques puede permitir a un atacante acceder a datos confidenciales, alterar registros,
        ejecutar comandos en el servidor o incluso tomar el control total de la aplicación.
      </p>

      <h3 className="h5 mt-4">Cómo se previene</h3>
      <p>Para evitar ataques de inyección, se recomienda:</p>

      <ol className="ms-3">
        <li className="mb-3">
          <strong>Separar los datos de los comandos:</strong>
          <ul className="ms-3 mt-2">
            <li className="mb-2">Usar APIs seguras que no dependan de intérpretes directos.</li>
            <li className="mb-2">
              Implementar consultas parametrizadas en lugar de concatenar datos directamente en la consulta.
            </li>
            <li className="mb-2">
              Utilizar herramientas ORM que gestionen automáticamente la creación de consultas seguras.
            </li>
          </ul>
        </li>

        <li className="mb-3">
          <strong>Validación de entradas:</strong>
          <ul className="ms-3 mt-2">
            <li className="mb-2">Validar todos los datos ingresados por el usuario en el lado del servidor.</li>
            <li className="mb-2">
              Aplicar listas blancas que permitan únicamente datos esperados (por ejemplo, números, fechas, textos limitados).
            </li>
          </ul>
        </li>

        <li className="mb-3">
          <strong>Escapar caracteres especiales:</strong>
          <ul className="ms-3 mt-2">
            <li className="mb-2">
              En consultas dinámicas, escapar los caracteres peligrosos según la sintaxis del intérprete utilizado.
            </li>
            <li className="mb-2">
              Evitar que datos del usuario definan nombres de tablas, columnas o estructuras SQL.
            </li>
          </ul>
        </li>

        <li className="mb-1">
          <strong>Buenas prácticas adicionales:</strong>
          <ul className="ms-3 mt-2">
            <li className="mb-2">
              Limitar la cantidad de datos que puede devolver una consulta usando comandos como LIMIT en SQL.
            </li>
            <li className="mb-2">Revisar el código fuente periódicamente para detectar posibles puntos vulnerables.</li>
            <li className="mb-2">
              Implementar herramientas automáticas de análisis de seguridad como SAST, DAST o IAST dentro del proceso de
              desarrollo para identificar problemas antes de poner el sistema en producción.
            </li>
          </ul>
        </li>
      </ol>
      <hr />
    </section>
  );
}
