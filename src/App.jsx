import { useEffect, useState } from 'react';
import Login from './pages/Login.jsx';
import Home from './pages/Home.jsx';
import Products from './pages/Products.jsx';
import Profile from './pages/Profile.jsx';
import Settings from './pages/Settings.jsx';
import Sidebar from './components/Sidebar.jsx';
import Navbar from './components/Navbar.jsx';

const VIEW_INFO = {
  dashboard: { breadcrumb: 'Inicio', title: 'Inicio' },
  productos: { breadcrumb: 'Productos', title: 'Productos' },
  perfil: { breadcrumb: 'Perfil', title: 'Perfil' },
  configuracion: { breadcrumb: 'Configuración', title: 'Configuración' },
};

// Si la URL trae ?page=..., el enlace apunta a la tabla de productos.
const urlHasTableParams = () => new URLSearchParams(window.location.search).has('page');

export default function App() {
  // Estado de autenticación: null = sin sesión (no se puede ver el sistema).
  const [user, setUser] = useState(null);
  const [activeView, setActiveView] = useState(() => (urlHasTableParams() ? 'productos' : 'dashboard'));

  // Botones atrás/adelante del navegador: si la URL vuelve a tener parámetros de la tabla, se muestra la tabla.
  useEffect(() => {
    const handlePopState = () => {
      if (urlHasTableParams()) setActiveView('productos');
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const handleLogin = (loggedUser) => {
    setUser(loggedUser);
  };

  const handleLogout = () => {
    setUser(null);
    setActiveView('dashboard');
    window.history.replaceState({}, '', window.location.pathname);
  };

  const handleNavigate = (viewId) => {
    // Fuera de la tabla se limpian los parámetros de la URL.
    if (viewId !== 'productos') {
      window.history.replaceState({}, '', window.location.pathname);
    }
    setActiveView(viewId);
  };

  // Protección de la vista: sin usuario solo se muestra el login.
  if (!user) {
    return <Login onLogin={handleLogin} />;
  }

  const info = VIEW_INFO[activeView];

  let content;
  if (activeView === 'productos') content = <Products />;
  else if (activeView === 'perfil') content = <Profile user={user} />;
  else if (activeView === 'configuracion') content = <Settings />;
  else content = <Home user={user} onNavigate={handleNavigate} />;

  return (
    <div className="app-shell">
      <Sidebar activeView={activeView} onNavigate={handleNavigate} user={user} onLogout={handleLogout} />
      <div className="app-main">
        <Navbar user={user} breadcrumb={info.breadcrumb} title={info.title} onLogout={handleLogout} />
        <main className="app-content">{content}</main>
      </div>
    </div>
  );
}
