import { LogoutIcon } from './Icons.jsx';

/**
 * Props:
 *  - user: usuario autenticado (image, firstName, lastName, username)
 *  - breadcrumb: texto pequeño sobre el título (ej. "Productos")
 *  - title: título de la vista actual
 *  - onLogout()
 */
export default function Navbar({ user, breadcrumb, title, onLogout }) {
  const fullName = [user.firstName, user.lastName].filter(Boolean).join(' ') || user.username;

  return (
    <header className="navbar">
      <div className="navbar-heading">
        <p className="navbar-breadcrumb">
          RoastLab / <strong>{breadcrumb}</strong>
        </p>
        <h2 className="navbar-title">{title}</h2>
      </div>

      <div className="navbar-user">
        <img className="avatar avatar-md" src={user.image} alt={`Foto de perfil de ${fullName}`} />
        <div className="navbar-user-text">
          <strong>{fullName}</strong>
          <span>@{user.username}</span>
        </div>
        <button type="button" className="btn btn-outline btn-sm" onClick={onLogout}>
          <LogoutIcon size={16} />
          Cerrar sesión
        </button>
      </div>
    </header>
  );
}
