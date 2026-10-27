import { DashboardIcon, BoxIcon, UserIcon, SettingsIcon, LogoutIcon } from './Icons.jsx';

export const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', Icon: DashboardIcon },
  { id: 'productos', label: 'Productos', Icon: BoxIcon },
  { id: 'perfil', label: 'Perfil', Icon: UserIcon },
  { id: 'configuracion', label: 'Configuración', Icon: SettingsIcon },
];

function getInitials(user) {
  const first = user.firstName?.[0] ?? user.username?.[0] ?? '';
  const last = user.lastName?.[0] ?? '';
  return `${first}${last}`.toUpperCase();
}

/**
 * Props:
 *  - activeView: id de la vista activa ('dashboard' | 'productos' | 'perfil' | 'configuracion')
 *  - onNavigate(viewId)
 *  - user: usuario autenticado
 *  - onLogout()
 */
export default function Sidebar({ activeView, onNavigate, user, onLogout }) {
  return (
    <aside className="sidebar">
      <div className="sidebar-brand">RoastLab</div>

      <nav className="sidebar-nav" aria-label="Menú principal">
        <p className="sidebar-label">Menú principal</p>
        {NAV_ITEMS.map(({ id, label, Icon }) => (
          <button
            key={id}
            type="button"
            className={`sidebar-link ${activeView === id ? 'is-active' : ''}`}
            onClick={() => onNavigate(id)}
            aria-current={activeView === id ? 'page' : undefined}
          >
            <Icon size={18} />
            <span>{label}</span>
          </button>
        ))}
      </nav>

      <div className="sidebar-footer">
        <div className="sidebar-user">
          <span className="avatar avatar-sm">{getInitials(user)}</span>
          <div className="sidebar-user-text">
            <strong>{user.username}</strong>
            <span>Tostador principal</span>
          </div>
        </div>
        <button type="button" className="sidebar-link sidebar-logout" onClick={onLogout}>
          <LogoutIcon size={18} />
          <span>Cerrar sesión</span>
        </button>
      </div>
    </aside>
  );
}
