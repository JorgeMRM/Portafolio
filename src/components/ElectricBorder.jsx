import React from "react";
import "./electric-border.css";

/**
 * ElectricBorder — borde eléctrico irregular con glow (responsive).
 * Se ajusta a cualquier tamaño de contenedor (ancho/alto variables).
 *
 * Props:
 *  - color      hex   -> color del brillo (default: #6FF3FF)
 *  - radius     px    -> borderRadius visual (default: 24)
 *  - thickness  px    -> grosor del trazo (default: 2.6)
 *  - intensity  0–1   -> qué tan “roto” el borde (default: 0.95)
 *  - speed      s     -> velocidad del ruido/parpadeo (default: 3.8)
 *  - className, style -> estilos extra
 */
export default function ElectricBorder({
  children,
  color = "#6FF3FF",
  radius = 24,
  thickness = 2.6,
  intensity = 0.95,
  speed = 3.8,
  className = "",
  style = {},
}) {
  const id = React.useId();

  // Radio expresado en "unidades del viewBox (0..100)" para que sea responsive
  // 100 unidades de viewBox ≈ ancho/alto del contenedor. 6–12 suele verse bien.
  const rView = Math.max(0, Math.min(20, Math.round((radius / 300) * 100))) || 8;

  return (
    <div
      className={`eb-card ${className}`}
      style={{ "--eb-color": color, "--eb-radius": `${radius}px` , ...style }}
    >
      <div className="eb-inner">{children}</div>

      {/* SVG que SIEMPRE rellena el contenedor */}
      <svg
        className="eb-svg"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <defs>
          {/* Ruido animado */}
          <filter id={`${id}-electric`} x="-20%" y="-20%" width="140%" height="140%">
            <feTurbulence type="fractalNoise" baseFrequency="0.015" numOctaves="3" seed="8" result="noise">
              <animate attributeName="baseFrequency" dur={`${speed}s`}
                       values="0.012;0.02;0.014;0.018;0.012" repeatCount="indefinite" />
            </feTurbulence>
            <feDisplacementMap in="SourceGraphic" in2="noise"
              scale={intensity * 22} xChannelSelector="R" yChannelSelector="G" />
            <feGaussianBlur stdDeviation="0.4" />
          </filter>

          {/* Glow compuesto */}
          <filter id={`${id}-glow`} x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="2" result="b1" />
            <feGaussianBlur stdDeviation="6" in="b1" result="b2" />
            <feMerge><feMergeNode in="b1" /><feMergeNode in="b2" /></feMerge>
          </filter>

          {/* Máscara para que se vea SOLO el borde (no el centro) */}
          <mask id={`${id}-ringMask`}>
           
            <rect x="0" y="0" width="100" height="100" fill="black" />
           
            <rect x="1" y="1" width="98" height="98" rx={rView} ry={rView} fill="white" />
            <rect x={1 + thickness} y={1 + thickness}
                  width={98 - thickness * 2}
                  height={98 - thickness * 2}
                  rx={Math.max(0, rView - thickness * 0.8)}
                  ry={Math.max(0, rView - thickness * 0.8)}
                  fill="black" />
          </mask>
        </defs>

        {/* Glow (debajo) */}
        <rect x="1" y="1" width="98" height="98" rx={rView} ry={rView}
              fill="none" stroke={color} strokeWidth={thickness * 2.2}
              opacity="0.65" filter={`url(#${id}-glow)`} />

        {/* Borde eléctrico irregular */}
        <rect x="1" y="1" width="98" height="98" rx={rView} ry={rView}
              fill={`url(#${id}-grad)`}
              stroke={color} strokeWidth={thickness}
              mask={`url(#${id}-ringMask)`}
              filter={`url(#${id}-electric)`}
              strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  );
}
