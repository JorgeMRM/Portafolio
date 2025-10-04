import { Outlet, useLocation } from "react-router-dom";

export default function Layout() {
  const { pathname } = useLocation();
  const hideMainNavbar = pathname === "/owasp"; // ⬅️ sin barra principal en OWASP

  return (
    <>
      {!hideMainNavbar && (
        <nav className="navbar bg-white shadow-sm sticky-top">
          <div className="container">
            <a className="navbar-brand fw-bold text-primary" href="/">
              <i className="bi bi-mortarboard-fill me-1"></i> Portafolio UMG
            </a>

            <ul className="navbar-nav ms-auto flex-row gap-4">
              <li className="nav-item">
                <a className="nav-link fw-medium" href="/#inicio">Inicio</a>
              </li>
              <li className="nav-item">
                <a className="nav-link fw-medium" href="/#tareas">Tareas</a>
              </li>
              <li className="nav-item">
                <a className="nav-link fw-medium" href="/#contacto">Contacto</a>
              </li>
            </ul>
          </div>
        </nav>
      )}

      <Outlet />
    </>
  );
}
