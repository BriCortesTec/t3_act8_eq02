const LOGIN_URL = 'https://dummyjson.com/auth/login';

/**
 * Inicia sesión contra la API de DummyJSON.
 * Credenciales de prueba: usuario "emilys" / contraseña "emilyspass".
 * Devuelve los datos del usuario (id, username, firstName, lastName, email, image, tokens...).
 * Lanza un Error con un mensaje legible si algo falla.
 */
export async function loginUser(username, password) {
  let response;

  try {
    response = await fetch(LOGIN_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password, expiresInMins: 30 }),
    });
  } catch {
    throw new Error('No se pudo conectar con el servidor. Revisa tu conexión a internet.');
  }

  let data = null;
  try {
    data = await response.json();
  } catch {
    data = null;
  }

  if (!response.ok) {
    if (response.status === 400 || response.status === 401) {
      throw new Error('Usuario o contraseña incorrectos');
    }
    throw new Error('El servicio de inicio de sesión no está disponible. Intenta de nuevo en unos minutos.');
  }

  if (!data || !data.username) {
    throw new Error('La respuesta del servidor no es válida.');
  }

  return data;
}
