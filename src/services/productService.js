const BASE_URL = 'https://dummyjson.com/products';

/**
 * Hace una petición y devuelve el JSON.
 * Si falla, lanza un Error con mensaje legible y la propiedad `status` (0 = sin conexión).
 */
async function request(url, options) {
  let response;
  try {
    response = await fetch(url, options);
  } catch {
    const networkError = new Error('No se pudo conectar con el servidor. Verifica tu conexión a internet.');
    networkError.status = 0;
    throw networkError;
  }

  if (!response.ok) {
    const httpError = new Error(`La API respondió con un error (código ${response.status}).`);
    httpError.status = response.status;
    throw httpError;
  }

  return response.json();
}

const JSON_HEADERS = { 'Content-Type': 'application/json' };

/**
 * Lista productos con paginación, búsqueda por título y filtro por categoría.
 * Devuelve { products, total }.
 * - Solo búsqueda o solo categoría o ninguno: usa la paginación de la API (limit/skip).
 * - Búsqueda + categoría: la API no permite combinarlas, así que se busca por texto,
 *   se filtra la categoría en el cliente y se pagina localmente.
 */
export async function getProducts({ page = 1, limit = 10, search = '', category = '' }) {
  const skip = (page - 1) * limit;
  const query = encodeURIComponent(search);

  if (search && category) {
    const data = await request(`${BASE_URL}/search?q=${query}&limit=0`);
    const filtered = data.products.filter((product) => product.category === category);
    return { products: filtered.slice(skip, skip + limit), total: filtered.length };
  }

  let url;
  if (search) {
    url = `${BASE_URL}/search?q=${query}&limit=${limit}&skip=${skip}`;
  } else if (category) {
    url = `${BASE_URL}/category/${encodeURIComponent(category)}?limit=${limit}&skip=${skip}`;
  } else {
    url = `${BASE_URL}?limit=${limit}&skip=${skip}`;
  }

  const data = await request(url);
  return { products: data.products, total: data.total };
}

/**
 * Lista de categorías normalizada como [{ slug, name }].
 * (La API puede devolver textos simples u objetos, se aceptan ambos.)
 */
export async function getCategories() {
  const data = await request(`${BASE_URL}/categories`);
  return data.map((item) => {
    if (typeof item === 'string') {
      return { slug: item, name: formatCategory(item) };
    }
    return { slug: item.slug, name: item.name || formatCategory(item.slug) };
  });
}

// POST: agrega un producto (la API solo simula el guardado).
export function createProduct(values) {
  return request(`${BASE_URL}/add`, {
    method: 'POST',
    headers: JSON_HEADERS,
    body: JSON.stringify(values),
  });
}

// PUT: actualiza un producto (la API solo simula el guardado).
export function updateProduct(id, values) {
  return request(`${BASE_URL}/${id}`, {
    method: 'PUT',
    headers: JSON_HEADERS,
    body: JSON.stringify(values),
  });
}

// DELETE: elimina un producto (la API solo simula el borrado).
export function deleteProduct(id) {
  return request(`${BASE_URL}/${id}`, { method: 'DELETE' });
}

// "kitchen-accessories" -> "Kitchen Accessories"
export function formatCategory(slug = '') {
  return slug
    .split('-')
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}
