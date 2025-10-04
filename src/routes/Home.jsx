import { Link } from "react-router-dom";
import ElectricBorder from "../components/ElectricBorder";

export default function Home() {
  return (
    <>
      {/* HERO */}
      <header
        id="inicio"
        className="hero d-flex align-items-start justify-content-center text-center"
        style={{ minHeight: "100vh", paddingTop: "9rem", boxSizing: "border-box" }}
      >
        <div className="container">
          <img
            className="avatar hero-avatar mb-3"
            src="https://cdn-icons-png.flaticon.com/512/847/847969.png"
            alt="Foto perfil"
            style={{
              width: 120,
              height: 120,
              borderRadius: "50%",
              objectFit: "cover",
              boxShadow: "0 10px 30px rgba(0,0,0,.08)",
              border: "4px solid #fff",
            }}
          />
          <h1 className="display-5 mb-2">
            Hola, soy <span className="text-primary">Jorge Mario Rogel Martínez</span>
          </h1>
          <p className="lead tagline mb-3">
            Estudiante de Ingeniería en Sistemas en la UMG. Aquí comparto mis tareas y proyectos.
          </p>

          <div className="d-flex flex-wrap gap-2 justify-content-center mt-2">
            <span className="skill-badge"><i className="bi bi-shield-lock" /> OWASP</span>
            <span className="skill-badge"><i className="bi bi-bug" /> Tipos de prueba</span>
            <span className="skill-badge"><i className="bi bi-diagram-3" /> Redes</span>
            <span className="skill-badge"><i className="bi bi-cpu" /> IA</span>
          </div>
        </div>
      </header>

      {/* SOBRE MÍ */}
      <section id="sobre-mi" className="py-5 bg-white">
        <div className="container">
          <div className="col-lg-8 mx-auto text-center">
            <h2 className="h1 mb-3">Sobre mí</h2>
            <p className="mb-3">
              Soy estudiante de Ingeniería en Sistemas de Información y Ciencias de la Computación
              con un interés profundo en desarrollo de software y tecnologías emergentes. Estoy
              buscando oportunidades para aplicar mis conocimientos teóricos en proyectos prácticos
              y adquirir experiencia en la industria.
            </p>
            <div className="d-flex justify-content-center flex-wrap gap-3 mt-2">
              <span className="badge rounded-pill text-bg-primary px-3 py-2 fw-semibold">Responsable</span>
              <span className="badge rounded-pill text-bg-secondary px-3 py-2 fw-semibold">Autodidacta</span>
              <span className="badge rounded-pill text-bg-success px-3 py-2 fw-semibold">Trabajo en equipo</span>
              <span className="badge rounded-pill text-bg-info px-3 py-2 fw-semibold">Documentación</span>
            </div>
          </div>
        </div>
      </section>

      {/* TAREAS con ElectricBorder */}
      <section
        id="tareas"
        className="py-5"
        style={{ background: "radial-gradient(80% 120% at 50% 0%, #0b1224 0%, #090e1b 100%)" }}
      >
        <div className="container">
          <h2 className="h1 mb-4 text-light">Tareas</h2>

          <div className="row g-4">
            <div className="col-md-4">
              <ElectricBorder>
                <div className="card h-100" style={{ background: "transparent", border: "none" }}>
                  <div className="card-body">
                    <h5 className="card-title">Guía OWASP, Investigación Planes y Casos de prueba</h5>
                    <p className="card-text">
                      Guía para usuarios no técnicos con mitigaciones del OWASP Top 10 – 2021.
                    </p>
                    <Link to="/owasp" className="btn btn-light w-100">
                      <strong>Ver</strong>
                    </Link>
                  </div>
                </div>
              </ElectricBorder>
            </div>

            <div className="col-md-4">
              <ElectricBorder>
                <div className="card h-100" style={{ background: "transparent", border: "none" }}>
                  <div className="card-body">
                    <h5 className="card-title">Herramientas para Pruebas de Software</h5>
                    <p className="card-text">Tipos: Funcionales, Rendimiento y Seguridad.</p>
                    <Link to="/pruebas" className="btn btn-light w-100">
                      <strong>Ver</strong>
                    </Link>
                  </div>
                </div>
              </ElectricBorder>
            </div>

            <div className="col-md-4">
              <ElectricBorder>
                <div className="card h-100" style={{ background: "transparent", border: "none" }}>
                  <div className="card-body">
                    <h5 className="card-title">Pendiente</h5>
                    <p className="card-text">Pendiente</p>
                    <button className="btn btn-outline-light w-100" disabled>Ver</button>
                  </div>
                </div>
              </ElectricBorder>
            </div>
          </div>
        </div>
      </section>

      {/* CONTACTO */}
      <section id="contacto" className="py-5 bg-light">
        <div className="container">
          <h2 className="h1 mb-3">Contacto</h2>
          <p className="text-muted">Formulario demo.</p>
        </div>
      </section>

      <footer className="py-4 text-center bg-white border-top">
        <p className="mb-0">
          &copy; {new Date().getFullYear()} Jorge Mario Rogel Martínez — Portafolio Universitario
        </p>
      </footer>
    </>
  );
}
