import { useId } from 'react'
import './CaballoCorriendo.scss'

const PARTICULAS = Array.from({ length: 30 })

export default function CaballoCorriendo() {
  const id = useId()

  return (
    <div className="horse-frame">
      <span className="corner corner-tl" />
      <span className="corner corner-tr" />
      <span className="corner corner-bl" />
      <span className="corner corner-br" />

      <input type="checkbox" id={id} />
      <label htmlFor={id} title="Clic para cámara lenta">
        <div className="floor" />

        <div className="horse-body animate">
          <div className="front-leg right">
            <div className="shoulder">
              <div className="upper">
                <div className="knee">
                  <div className="lower">
                    <div className="ankle">
                      <div className="foot">
                        <div className="hoof" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="back-leg right">
            <div className="top">
              <div className="thigh">
                <div className="lower-leg">
                  <div className="foot">
                    <div className="hoof" />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="tail">
            <div className="nub">
              <div className="section">
                <div className="section">
                  <div className="section">
                    <div className="section">
                      <div className="section">
                        <div className="section last" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="body">
            <div className="section">
              <div className="section">
                <div className="section">
                  <div className="section">
                    <div className="section last" />
                  </div>
                </div>
              </div>
            </div>
            <div className="back-side" />
          </div>

          <div className="neck">
            <div className="under" />
            <div className="front" />
            <div className="base" />
            <div className="top" />
            <div className="shoulder" />
          </div>
          <div className="front-leg left">
            <div className="shoulder">
              <div className="upper">
                <div className="knee">
                  <div className="lower">
                    <div className="ankle">
                      <div className="foot">
                        <div className="hoof" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="back-leg left">
            <div className="top">
              <div className="thigh">
                <div className="lower-leg">
                  <div className="foot">
                    <div className="hoof" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="head">
            <div className="skull" />
            <div className="nose" />
            <div className="face" />
            <div className="lip" />
            <div className="jaw" />
            <div className="chin" />
            <div className="ear" />
            <div className="eye" />
          </div>
        </div>

        <div className="dust front">
          {PARTICULAS.map((_, i) => (
            <div className="particle" key={i} />
          ))}
        </div>
        <div className="dust back">
          {PARTICULAS.map((_, i) => (
            <div className="particle" key={i} />
          ))}
        </div>
      </label>
    </div>
  )
}
