import { useState } from 'react';
import { loginUser } from '../services/authService.js';
import { UserIcon, EyeIcon, EyeOffIcon, AlertIcon } from './Icons.jsx';

/**
 * Props:
 *  - onLogin(user): se llama con los datos del usuario cuando el login es correcto.
 */
export default function LoginForm({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  const [formError, setFormError] = useState('');
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const errors = {};
    if (!username.trim()) {
      errors.username = 'Ingresa tu usuario.';
    }
    if (!password) {
      errors.password = 'Ingresa tu contraseña.';
    } else if (password.length < 4) {
      errors.password = 'La contraseña debe tener al menos 4 caracteres.';
    }
    return errors;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setFormError('');

    const errors = validate();
    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) return;

    setLoading(true);
    try {
      const user = await loginUser(username.trim(), password);
      onLogin(user);
    } catch (error) {
      setFormError(error.message);
      setLoading(false);
    }
  };

  return (
    <form className="login-form" onSubmit={handleSubmit} noValidate>
      <p className="login-eyebrow">Bienvenido de nuevo</p>
      <h1 className="login-title">Iniciar sesión</h1>

      {formError && (
        <div className="form-alert" role="alert">
          <AlertIcon size={18} />
          <span>{formError}</span>
        </div>
      )}

      <div className="field">
        <label htmlFor="login-username">Usuario</label>
        <div className={`input-wrap ${fieldErrors.username ? 'has-error' : ''}`}>
          <UserIcon size={18} />
          <input
            id="login-username"
            type="text"
            autoComplete="username"
            placeholder="usuario"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            disabled={loading}
          />
        </div>
        {fieldErrors.username && <span className="field-error">{fieldErrors.username}</span>}
      </div>

      <div className="field">
        <label htmlFor="login-password">Contraseña</label>
        <div className={`input-wrap ${fieldErrors.password ? 'has-error' : ''}`}>
          <button
            type="button"
            className="input-icon-btn"
            onClick={() => setShowPassword((prev) => !prev)}
            aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
          >
            {showPassword ? <EyeOffIcon size={18} /> : <EyeIcon size={18} />}
          </button>
          <input
            id="login-password"
            type={showPassword ? 'text' : 'password'}
            autoComplete="current-password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
          />
        </div>
        {fieldErrors.password && <span className="field-error">{fieldErrors.password}</span>}
      </div>

      <button type="submit" className="btn btn-primary btn-block btn-lg" disabled={loading}>
        {loading ? 'Entrando...' : 'Entrar'}
      </button>

      <p className="login-hint">
        Cuenta de prueba: <strong>emilys</strong> / <strong>emilyspass</strong>
      </p>
    </form>
  );
}
