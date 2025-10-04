export default function Sidebar() {
  const items = [
    ["a01", "A01 — Pérdida de Control de Acceso"],
    ["a02", "A02 — Fallas Criptográficas"],
    ["a03", "A03 — Inyección"],
    ["a04", "A04 — Diseño Inseguro"],
    ["a05", "A05 — Configuración Incorrecta"],
    ["a06", "A06 — Componentes Vulnerables/Desactualizados"],
    ["a07", "A07 — Identificación y Autenticación"],
    ["a08", "A08 — Integridad Software/Datos"],
    ["a09", "A09 — Registro y Monitoreo"],
    ["a10", "A10 — SSRF"],
    ["a11", "Glosario"],
  ];

  return (
    <aside className="col-md-4 col-lg-3 col-xxl-2 sidebar-col">
      <div id="toc">
        <div className="toc-title">OWASP</div>
        <nav className="nav flex-column">
          {items.map(([id, label]) => (
            <a key={id} className="nav-link" href={`#${id}`}>
              {label}
            </a>
          ))}
        </nav>
      </div>
    </aside>
  );
}
