// src/routes/Owasp.jsx
import { useEffect } from "react";
import PageCrumb from "../components/PageCrumb.jsx";
import Sidebar from "../components/Sidebar.jsx";
import "../styles/owasp.css";

import {
  GlosarioA11,
  SectionA01,
  SectionA02,
  SectionA03,
  SectionA04,
  SectionA05,
  SectionA06,
  SectionA07,
  SectionA08,
  SectionA09,
  SectionA10,
} from "../components/owasp";

export default function Owasp() {
  useEffect(() => {
    const cssVar = getComputedStyle(document.documentElement).getPropertyValue(
      "--owasp-anchor-offset"
    );
    const anchorOffset = parseInt(cssVar, 10) || 112;

    /* ---------- TOC activo al hacer scroll + clic ---------- */
    const links = Array.from(document.querySelectorAll("#toc a.nav-link"));
    const sections = links
      .map((a) => document.querySelector(a.getAttribute("href")))
      .filter(Boolean);

    const setActiveByScroll = () => {
      const scroll = window.scrollY + anchorOffset + 1;
      let currentIndex = 0;
      for (let i = 0; i < sections.length; i++) {
        const secTop = sections[i].offsetTop;
        if (secTop <= scroll) currentIndex = i;
        else break;
      }
      links.forEach((a, i) => a.classList.toggle("active", i === currentIndex));
    };

    const scrollToSection = (secEl, replaceHash = true) => {
      if (!secEl) return;
      const y = secEl.getBoundingClientRect().top + window.scrollY - anchorOffset;
      window.scrollTo({ top: y, behavior: "smooth" });
      if (replaceHash) history.replaceState(null, "", `#${secEl.id}`);
    };

    const clickHandlers = links.map((a) => {
      const handler = (e) => {
        e.preventDefault();
        const target = document.querySelector(a.getAttribute("href"));
        if (target) scrollToSection(target);
      };
      a.addEventListener("click", handler);
      return { a, handler };
    });

    setActiveByScroll();
    window.addEventListener("scroll", setActiveByScroll, { passive: true });
    window.addEventListener("resize", setActiveByScroll);

    const jumpHash = () => {
      if (location.hash) {
        const target = document.querySelector(location.hash);
        if (target) setTimeout(() => scrollToSection(target, false), 0);
      }
    };
    jumpHash();

    /* ---------- BUSCADOR ---------- */
    const root = document.querySelector(".content-area"); // dónde buscar
    const input = document.getElementById("owasp-search-input");
    const form = document.getElementById("owasp-search-form");
    const btnNext = document.getElementById("owasp-search-next");
    const counter = document.getElementById("owasp-search-count");
    const btnSearch = document.getElementById("owasp-search-btn");

    let hits = [];    // Array<HTMLElement mark>
    let idx = -1;     // índice actual

    const updateCounter = () => {
      if (!hits.length) {
        counter.textContent = "0";
      } else {
        counter.textContent = `${idx + 1}/${hits.length}`;
      }
    };

    const clearMarks = () => {
      const marks = root.querySelectorAll("mark.owasp-hit, mark.owasp-hit-current");
      marks.forEach((m) => {
        const text = document.createTextNode(m.textContent || "");
        m.replaceWith(text);
      });
      root.normalize(); // une nodos de texto contiguos
      hits = [];
      idx = -1;
      updateCounter();
    };

    const escapeReg = (s) =>
      s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

    const SKIP_TAGS = new Set(["SCRIPT", "STYLE", "MARK", "NAV", "BUTTON", "INPUT", "TEXTAREA"]);

    const highlightNode = (textNode, regex) => {
      const text = textNode.nodeValue;
      if (!regex.test(text)) return;

      regex.lastIndex = 0;
      const frag = document.createDocumentFragment();
      let lastIndex = 0;
      let m;

      while ((m = regex.exec(text)) !== null) {
        const start = m.index;
        const end = start + m[0].length;
        if (start > lastIndex) {
          frag.appendChild(document.createTextNode(text.slice(lastIndex, start)));
        }
        const mark = document.createElement("mark");
        mark.className = "owasp-hit";
        mark.textContent = text.slice(start, end);
        frag.appendChild(mark);
        hits.push(mark);
        lastIndex = end;
      }
      if (lastIndex < text.length) {
        frag.appendChild(document.createTextNode(text.slice(lastIndex)));
      }
      textNode.replaceWith(frag);
    };

    const walk = (node, regex) => {
      if (node.nodeType === 3) {
        highlightNode(node, regex);
        return;
      }
      if (node.nodeType !== 1) return;
      if (SKIP_TAGS.has(node.tagName)) return;

      let child = node.firstChild;
      while (child) {
        const next = child.nextSibling;
        walk(child, regex);
        child = next;
      }
    };

    const scrollToHit = () => {
      if (!hits.length || idx < 0) return;
      hits.forEach((m) => m.classList.remove("owasp-hit-current"));
      const current = hits[idx];
      current.classList.add("owasp-hit-current");
      const y = current.getBoundingClientRect().top + window.scrollY - anchorOffset - 8;
      window.scrollTo({ top: y, behavior: "smooth" });
      updateCounter();
    };

    const doSearch = (term) => {
      clearMarks();
      if (!term || term.trim().length === 0) return;
      const regex = new RegExp(escapeReg(term.trim()), "gi");
      walk(root, regex);
      if (hits.length) {
        idx = 0;
        scrollToHit();
      } else {
        updateCounter();
      }
    };

    const onSubmit = (e) => {
      e.preventDefault();
      doSearch(input.value);
    };

    const onNext = () => {
      if (!hits.length) return;
      idx = (idx + 1) % hits.length;
      scrollToHit();
    };

    if (form) form.addEventListener("submit", onSubmit);
    if (btnNext) btnNext.addEventListener("click", onNext);
    if (btnSearch) btnSearch.addEventListener("click", onSubmit);
    if (input) {
      input.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
          // el submit ya se encarga; esta línea evita el scroll por defecto
          e.preventDefault();
        }
        if (e.key === "Escape") {
          clearMarks();
          input.value = "";
        }
      });
    }

    /* Limpieza */
    return () => {
      window.removeEventListener("scroll", setActiveByScroll);
      window.removeEventListener("resize", setActiveByScroll);
      clickHandlers.forEach(({ a, handler }) =>
        a.removeEventListener("click", handler)
      );
      if (form) form.removeEventListener("submit", onSubmit);
      if (btnNext) btnNext.removeEventListener("click", onNext);
      if (btnSearch) btnSearch.removeEventListener("click", onSubmit);
      clearMarks();
    };
  }, []);

  return (
    <>
      <div id="owasp-top"></div>

      <PageCrumb
        title="OWASP"
        icon="bi-shield-check"
        homeHref="#owasp-top"
        backHref="/#tareas"
      />

      {/* Encabezado */}
      <header className="hero text-center py-4">
        <div className="container">
          <h1 className="display-5 fw-bold text-uppercase mb-1">
            GUÍA OWASP, INVESTIGACIÓN PLANES Y CASOS DE PRUEBA
          </h1>
          <p className="lead tagline mb-0">
            Explicación corta y clara de mitigaciones para cada riesgo.
          </p>
        </div>
      </header>

      {/* Contenido con sidebar */}
      <div className="container-fluid">
        <div className="row g-0">
          <Sidebar />

          <main className="col-md-8 col-lg-9 col-xxl-10 p-4 content-area">
            <SectionA01 />
            <SectionA02 />
            <SectionA03 />
            <SectionA04 />
            <SectionA05 />
            <SectionA06 />
            <SectionA07 />
            <SectionA08 />
            <SectionA09 />
            <SectionA10 />
            <GlosarioA11 />
          </main>
        </div>
      </div>
    </>
  );
}
