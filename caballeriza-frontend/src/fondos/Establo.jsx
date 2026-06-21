import './Establo.css'

export default function Establo({ children }) {
  return (
    <div className="establo">
      <div className="establo-techo">
        <span className="fixture" />
        <span className="fixture" />
        <span className="fixture" />
      </div>

      <div className="establo-cuerpo">
        <div className="establo-pilar" />
        <div className="establo-contenido">{children}</div>
        <div className="establo-pilar" />
      </div>

      <div className="establo-piso" />
    </div>
  )
}
