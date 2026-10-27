import LoginForm from '../components/LoginForm.jsx';
import { BeanIcon } from '../components/Icons.jsx';

/**
 * Props:
 *  - onLogin(user)
 */
export default function Login({ onLogin }) {
  return (
    <div className="login-page">
      <aside className="login-brand">
        <div className="login-brand-frame">
          <div className="login-brand-content">
            <div className="login-logo">
              <span className="login-logo-mark">
                <BeanIcon size={26} />
              </span>
              <span className="login-logo-text">RoastLab</span>
            </div>
            <span className="login-brand-rule" />
            <p className="login-brand-tagline">Monitoreo de curvas de tueste</p>
          </div>
        </div>
      </aside>

      <main className="login-panel">
        <LoginForm onLogin={onLogin} />
      </main>
    </div>
  );
}
