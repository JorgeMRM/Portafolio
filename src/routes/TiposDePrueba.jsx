import "../styles/tiposdeprueba.css";

export default function TiposDePrueba() {
  return (
    <>
      {/* Aquí NO usamos PageCrumb */}
      <header className="hero text-center py-4">
        <div className="container">
          <h1 className="display-6 fw-bold mb-1">Tipos de Prueba</h1>
          <p className="lead tagline mb-0">Funcionales, Rendimiento y Seguridad.</p>
        </div>
      </header>

      <div className="container py-4">
        <section className="tp-section">
          <h2 className="h3">Pruebas Funcionales</h2>
          <p>…tu contenido…</p>
        </section>
        <section className="tp-section">
          <h2 className="h3">Pruebas de Rendimiento</h2>
          <p>…tu contenido…</p>
        </section>
        <section className="tp-section">
          <h2 className="h3">Pruebas de Seguridad</h2>
          <p>…tu contenido…</p>
        </section>
      </div>
    </>
  );
}
