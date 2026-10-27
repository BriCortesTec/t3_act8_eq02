import { BoxIcon } from '../components/Icons.jsx';

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return 'Buenos días';
  if (hour < 19) return 'Buenas tardes';
  return 'Buenas noches';
}

/**
 * Props:
 *  - user: usuario autenticado
 *  - onNavigate(viewId)
 */
export default function Home({ user, onNavigate }) {
  return (
    <section className="home">
      <div className="page-header">
        <div>
          <h2 className="page-title">
            {getGreeting()}, {user.firstName}
          </h2>
          <p className="page-subtitle">Este es el resumen de tu actividad de tueste (datos de demostración).</p>
        </div>
        <button type="button" className="btn btn-primary" onClick={() => onNavigate('productos')}>
          <BoxIcon size={16} />
          Ver productos
        </button>
      </div>

      <div className="stat-grid">
        <article className="stat-card">
          <p className="stat-label">Tuestes del mes</p>
          <p className="stat-value">24</p>
          <p className="stat-note">+12% vs. mes anterior</p>
        </article>
        <article className="stat-card">
          <p className="stat-label">Temperatura máxima</p>
          <p className="stat-value">215 °C</p>
          <p className="stat-note">Promedio 207 °C</p>
        </article>
        <article className="stat-card">
          <p className="stat-label">Último lote</p>
          <p className="stat-value stat-value-text">Oaxaca pluma</p>
          <p className="stat-note">Hoy, 09:42 · 12.5 kg</p>
        </article>
      </div>

      <article className="curve-card">
        <h3>Curva de tueste de hoy</h3>
        <svg viewBox="0 0 700 260" role="img" aria-label="Curva de temperatura de tueste de hoy">
          <defs>
            <linearGradient id="curveFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#B87A4B" stopOpacity="0.28" />
              <stop offset="100%" stopColor="#B87A4B" stopOpacity="0" />
            </linearGradient>
          </defs>
          {[40, 90, 140, 190].map((y) => (
            <line key={y} x1="50" x2="680" y1={y} y2={y} stroke="#E8E1D8" strokeDasharray="4 4" />
          ))}
          <path
            d="M50 225 C150 215 200 160 290 120 C380 80 460 62 680 52 L680 225 L50 225 Z"
            fill="url(#curveFill)"
          />
          <path
            d="M50 225 C150 215 200 160 290 120 C380 80 460 62 680 52"
            fill="none"
            stroke="#B87A4B"
            strokeWidth="3"
          />
          <path
            d="M50 205 C150 190 210 130 300 98 C390 66 480 50 680 42"
            fill="none"
            stroke="#1E4D2B"
            strokeWidth="3"
          />
          <circle cx="520" cy="63" r="5" fill="#B87A4B" />
          <text x="520" y="48" textAnchor="middle" fontSize="11" fill="#7A6457">
            Primer crack · 12:00
          </text>
          {['0 min', '3 min', '6 min', '9 min', '12 min', '15 min'].map((label, index) => (
            <text key={label} x={50 + index * 126} y="250" textAnchor="middle" fontSize="11" fill="#7A6457">
              {label}
            </text>
          ))}
        </svg>
      </article>
    </section>
  );
}
