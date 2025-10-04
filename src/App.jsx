import { Route, Routes } from "react-router-dom";
import Layout from "./components/Layout.jsx";
import Home from "./routes/Home.jsx";
import Owasp from "./routes/Owasp.jsx";
import TiposDePrueba from "./routes/TiposDePrueba.jsx";

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/owasp" element={<Owasp />} />
        <Route path="/pruebas" element={<TiposDePrueba />} />
      </Route>
      <Route path="*" element={<div className="p-5">404</div>} />
    </Routes>
  );
}
