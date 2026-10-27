/**
 * Props:
 *  - user: usuario autenticado
 */
export default function Profile({ user }) {
  const fullName = [user.firstName, user.lastName].filter(Boolean).join(' ');

  return (
    <section>
      <div className="page-header">
        <div>
          <h2 className="page-title">Perfil</h2>
          <p className="page-subtitle">Datos de tu cuenta obtenidos al iniciar sesión.</p>
        </div>
      </div>

      <article className="profile-card">
        <img className="avatar avatar-lg" src={user.image} alt={`Foto de perfil de ${fullName}`} />
        <dl className="profile-data">
          <div>
            <dt>Nombre</dt>
            <dd>{fullName}</dd>
          </div>
          <div>
            <dt>Usuario</dt>
            <dd>{user.username}</dd>
          </div>
          <div>
            <dt>Correo</dt>
            <dd>{user.email}</dd>
          </div>
        </dl>
      </article>
    </section>
  );
}
