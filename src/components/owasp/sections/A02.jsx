// src/components/owasp/sections/A02.jsx
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
  // Protocolos y conceptos
  { pattern: /\bTLS(?:\s*1\.[23])?\b/giu, title: "TLS",
    content: "Transport Layer Security. Protocolo que cifra las comunicaciones (el candado de HTTPS)." },
  { pattern: /\bHSTS\b/giu, title: "HSTS",
    content: "HTTP Strict Transport Security: obliga al navegador a usar siempre HTTPS." },
  { pattern: /\bHTTPS?\b/giu, title: "HTTP/HTTPS",
    content: "HTTP es el protocolo web; HTTPS es HTTP sobre TLS (cifrado)." },
  { pattern: /\bFTP\b/giu, title: "FTP",
    content: "File Transfer Protocol. Inseguro si no se usa cifrado (usar SFTP/FTPS)." },
  { pattern: /\bSMTP\b/giu, title: "SMTP",
    content: "Protocolo para envío de correo; debe usarse con TLS para cifrar." },
  { pattern: /\bGDPR\b/giu, title: "GDPR",
    content: "Regulación europea de protección de datos personales." },
  { pattern: /\bPCI\s*DSS\b/giu, title: "PCI DSS",
    content: "Estándar de seguridad para datos de tarjetas de pago." },

  // Algoritmos / funciones
  { pattern: /\bMD5\b/giu, title: "MD5",
    content: "Función hash obsoleta; no debe usarse para seguridad." },
  { pattern: /\bSHA-?1\b/giu, title: "SHA-1",
    content: "Función hash obsoleta; usa SHA-256/3 en su lugar." },
  { pattern: /\bSHA-?256\b/giu, title: "SHA-256",
    content: "Función hash moderna de la familia SHA-2." },
  { pattern: /\bSHA-?3\b/giu, title: "SHA-3",
    content: "Función hash moderna basada en Keccak." },
  { pattern: /\bArgon2\b/giu, title: "Argon2",
    content: "Función de derivación de contraseñas resistente a GPU/ASIC." },
  { pattern: /\bbcrypt\b/giu, title: "bcrypt",
    content: "Función de derivación de contraseñas con factor de trabajo." },
  { pattern: /\bscrypt\b/giu, title: "scrypt",
    content: "Función de derivación de contraseñas intensiva en memoria." },
  { pattern: /\bPBKDF2\b/giu, title: "PBKDF2",
    content: "Función de derivación de contraseñas (usa iteraciones)." },

  // Cripto/operación
  { pattern: /\bCSPRNG\b/giu, title: "CSPRNG",
    content: "Generador de números aleatorios criptográficamente seguro." },
  { pattern: /\bIV\b/giu, title: "IV (Vector de inicialización)",
    content: "Valor no secreto que debe ser único por mensaje; no reutilizar." },
  { pattern: /\bECB\b/giu, title: "ECB",
    content: "Modo de cifrado inseguro; no preservar la confidencialidad." },
  { pattern: /PKCS#?1\s*v?1\.5/giu, title: "PKCS#1 v1.5",
    content: "Esquema de relleno (padding) antiguo; preferir OAEP/PSS." },
  { pattern: /Oracle\s+Padding/giu, title: "Oracle Padding",
    content: "Ataque que explota respuestas de error para descifrar." },
  { pattern: /\btokenización\b/giu, title: "Tokenización",
    content: "Reemplazar datos reales por sustitutos sin valor externo." },
  { pattern: /\bvector(?:es)? de inicialización\b/giu, title: "Vector de inicialización (IV)",
    content: "Valor aleatorio/único para algunos cifrados; no reutilizar." },
  { pattern: /\bFS\b/giu, title: "Forward Secrecy (FS)",
    content: "Confidencialidad adelantada: comprometer una clave no descubre sesiones pasadas." },
];

/* ---------- componente ---------- */
export default function A02() {
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
    <section id="a02" className="section" ref={ref}>
      <h2 className="h3 text-center">A02:2021 – Fallas Criptográficas</h2>

      <p>
        Las fallas criptográficas ocurren cuando los datos sensibles no se protegen adecuadamente
        mediante técnicas de cifrado. Esto incluye información como contraseñas, números de tarjetas
        de crédito, historiales médicos, datos personales o secretos comerciales. Estas fallas pueden
        permitir que atacantes accedan o manipulen información crítica, especialmente cuando existen
        requisitos legales o regulatorios como el GDPR o el PCI DSS.
      </p>

      <h3 className="h5 mt-3">Situaciones comunes que generan fallas criptográficas:</h3>
      <ul className="ms-3">
        <li className="mb-2">
          Transmisión de datos en texto plano (sin cifrado) mediante protocolos inseguros como HTTP, FTP o SMTP.
        </li>
        <li className="mb-2">Uso de algoritmos o protocolos criptográficos obsoletos o débiles.</li>
        <li className="mb-2">
          Empleo de claves criptográficas predeterminadas, mal generadas o sin rotación periódica.
        </li>
        <li className="mb-2">
          Ausencia de cifrado obligatorio, como la falta de directivas de seguridad en encabezados HTTP.
        </li>
        <li className="mb-2">Certificados de servidor mal configurados o no validados correctamente.</li>
        <li className="mb-2">
          Reutilización o generación insegura de vectores de inicialización (IV) o modos inseguros como ECB.
        </li>
        <li className="mb-2">
          Uso de contraseñas como claves criptográficas sin una función de derivación de claves adecuada.
        </li>
        <li className="mb-2">Generación de números aleatorios no aptos para fines criptográficos.</li>
        <li className="mb-2">Uso de funciones hash obsoletas como MD5 o SHA1.</li>
        <li className="mb-2">Métodos de relleno (padding) inseguros como PKCS#1 v1.5.</li>
        <li className="mb-2">
          Mensajes de error que filtran información útil para ataques de criptoanálisis (ejemplo: ataques de Oracle Padding).
        </li>
      </ul>

      <h3 className="h5 mt-4">Cómo prevenir las fallas criptográficas</h3>
      <p>
        Para mitigar este tipo de vulnerabilidades, se recomienda aplicar las siguientes prácticas:
      </p>

      <ol className="ms-3">
        <li className="mb-3">
          <strong>Clasificación y manejo de datos sensibles:</strong>
          <ul className="ms-3 mt-2">
            <li className="mb-2">Identificar qué datos requieren protección especial según leyes y regulaciones.</li>
            <li className="mb-2">Evitar almacenar datos sensibles innecesariamente y eliminarlos lo antes posible.</li>
            <li className="mb-2">Usar técnicas de tokenización o truncamiento para información como números de tarjeta.</li>
          </ul>
        </li>

        <li className="mb-3">
          <strong>Protección de datos en reposo y en tránsito:</strong>
          <ul className="ms-3 mt-2">
            <li className="mb-2">Cifrar todos los datos sensibles almacenados (en reposo).</li>
            <li className="mb-2">
              Usar protocolos seguros como TLS 1.2 o superior para datos en tránsito, habilitando cifradores
              con confidencialidad adelantada (FS).
            </li>
            <li className="mb-2">Forzar el cifrado con políticas como HSTS (HTTP Strict Transport Security).</li>
          </ul>
        </li>

        <li className="mb-3">
          <strong>Gestión de contraseñas y claves:</strong>
          <ul className="ms-3 mt-2">
            <li className="mb-2">
              Almacenar contraseñas con funciones seguras como Argon2, scrypt, bcrypt o PBKDF2, que añaden sal y factor de trabajo.
            </li>
            <li className="mb-2">
              Generar claves de forma aleatoria y gestionarlas adecuadamente (rotación periódica y almacenamiento seguro).
            </li>
          </ul>
        </li>

        <li className="mb-3">
          <strong>Buenas prácticas criptográficas:</strong>
          <ul className="ms-3 mt-2">
            <li className="mb-2">Usar cifrado autenticado en lugar de cifrado simple.</li>
            <li className="mb-2">Elegir vectores de inicialización seguros y no reutilizarlos.</li>
            <li className="mb-2">Evitar funciones hash y esquemas de relleno obsoletos como MD5, SHA1 o PKCS#1 v1.5.</li>
          </ul>
        </li>

        <li className="mb-3">
          <strong>Aleatoriedad y generación de números:</strong>
          <ul className="ms-3 mt-2">
            <li className="mb-2">Emplear generadores de números aleatorios criptográficamente seguros (CSPRNG).</li>
            <li className="mb-2">No usar semillas predecibles o con baja entropía.</li>
          </ul>
        </li>

        <li className="mb-1">
          <strong>Verificación y monitoreo:</strong>
          <ul className="ms-3 mt-2">
            <li className="mb-2">Validar certificados y cadenas de confianza en conexiones cifradas.</li>
            <li className="mb-2">Deshabilitar el almacenamiento en caché para respuestas que contengan datos sensibles.</li>
            <li className="mb-2">Revisar periódicamente la configuración criptográfica para asegurar que cumple con los estándares actuales.</li>
          </ul>
        </li>
      </ol>
      <hr />
    </section>
  );
}
