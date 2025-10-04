// src/components/PageCrumb.jsx
export default function PageCrumb({
  title = "OWASP",
  icon = "bi-shield-check",
  homeHref = "#",
  backHref = "/",
}) {
  return (
    <nav
      className="owasp-crumb navbar bg-white sticky-top border-bottom"
      style={{ zIndex: 1030 }}
    >
      <div className="container">
        <div className="d-flex w-100 align-items-center justify-content-between">
          {/* IZQUIERDA: marca OWASP */}
          <div className="d-inline-flex align-items-center">
            <i className={`bi ${icon} text-primary me-2`} />
            <span className="owasp-brand text-primary fw-bold text-uppercase">
              {title}
            </span>
          </div>

          {/* CENTRO: buscador */}
          <div className="owasp-search d-none d-md-flex align-items-center justify-content-center">
            <form id="owasp-search-form" className="d-flex gap-2">
              <input
                id="owasp-search-input"
                type="text"
                className="form-control form-control-sm"
                placeholder="Buscar títulos o palabras…"
                autoComplete="off"
              />
              <button id="owasp-search-btn" type="submit" className="btn btn-outline-secondary btn-sm">
                Buscar
              </button>
              <button id="owasp-search-next" type="button" className="btn btn-secondary btn-sm">
                Siguiente
              </button>
              <span id="owasp-search-count" className="badge bg-light text-dark ms-1 align-self-center">0</span>
            </form>
          </div>

          {/* DERECHA: enlaces */}
          <div className="d-inline-flex align-items-center gap-3">
            <a href={homeHref} className="owasp-link">
              <i className="bi bi-house me-1" /> Inicio
            </a>
            <a href={backHref} className="owasp-link">
              <i className="bi bi-arrow-left-short me-1" /> Volver
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
}
