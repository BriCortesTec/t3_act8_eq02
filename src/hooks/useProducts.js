import { useCallback, useEffect, useMemo, useState } from 'react';
import useUrlParams from './useUrlParams.js';
import {
  getProducts,
  getCategories,
  createProduct,
  updateProduct,
  deleteProduct,
} from '../services/productService.js';

export const LIMIT_OPTIONS = [10, 20, 40, 50];
const DEFAULT_LIMIT = 10;

function parsePage(value) {
  const number = parseInt(value, 10);
  return Number.isNaN(number) || number < 1 ? 1 : number;
}

function parseLimit(value) {
  const number = parseInt(value, 10);
  return LIMIT_OPTIONS.includes(number) ? number : DEFAULT_LIMIT;
}

/**
 * Hook principal de la tabla de productos 
 * Maneja: parámetros de la URL, carga desde la API, filtros, paginación y CRUD.
 *
 * Estado local (useState) para reflejar las escrituras simuladas de DummyJSON:
 *  - added: productos agregados (se muestran al inicio de la página 1)
 *  - edits: productos editados, por id
 *  - deletedIds: ids de productos eliminados
 */
export default function useProducts() {
  const [params, updateParams] = useUrlParams();

  const page = parsePage(params.get('page'));
  const limit = parseLimit(params.get('limit'));
  const search = (params.get('q') || '').trim();
  const category = params.get('category') || '';

  const [fetched, setFetched] = useState({ products: [], total: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [categories, setCategories] = useState([]);
  const [reloadKey, setReloadKey] = useState(0);

  const [added, setAdded] = useState([]);
  const [edits, setEdits] = useState({});
  const [deletedIds, setDeletedIds] = useState([]);

  const [saving, setSaving] = useState(false);
  const [notification, setNotification] = useState(null);

  // Si la URL llega sin page/limit, se completa con los valores por defecto.
  useEffect(() => {
    if (!params.get('page') || !params.get('limit')) {
      updateParams({ page, limit }, { replace: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Categorías para el filtro y el formulario.
  useEffect(() => {
    let cancelled = false;
    getCategories()
      .then((list) => {
        if (!cancelled) setCategories(list);
      })
      .catch(() => {
        if (!cancelled) setCategories([]);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  // Carga de productos cada vez que cambia la página, el límite o los filtros.
  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError('');

    getProducts({ page, limit, search, category })
      .then((data) => {
        if (cancelled) return;
        setFetched(data);
        setLoading(false);
      })
      .catch((err) => {
        if (cancelled) return;
        setError(err.message);
        setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [page, limit, search, category, reloadKey]);

  // Productos agregados que cumplen los filtros actuales.
  const addedMatching = useMemo(
    () =>
      added.filter(
        (product) =>
          (!category || product.category === category) &&
          (!search || product.title.toLowerCase().includes(search.toLowerCase()))
      ),
    [added, category, search]
  );

  const products = useMemo(() => {
    const visible = fetched.products
      .filter((product) => !deletedIds.includes(product.id))
      .map((product) => edits[product.id] || product);
    return page === 1 ? [...addedMatching, ...visible] : visible;
  }, [fetched.products, deletedIds, edits, addedMatching, page]);

  const total = Math.max(0, fetched.total + addedMatching.length - deletedIds.length);
  const totalPages = Math.max(1, Math.ceil(total / limit));

  // Si los filtros dejan menos páginas que la actual, se ajusta la página.
  useEffect(() => {
    if (!loading && !error && page > totalPages) {
      updateParams({ page: totalPages }, { replace: true });
    }
  }, [loading, error, page, totalPages, updateParams]);

  const notify = useCallback((type, message) => {
    setNotification({ type, message, id: Date.now() });
  }, []);

  const dismissNotification = useCallback(() => setNotification(null), []);

  // ----- Paginación y filtros (actualizan la URL) -----
  const goToPage = (newPage) => {
    const safePage = Math.min(Math.max(1, newPage), totalPages);
    updateParams({ page: safePage });
  };

  const changeLimit = (newLimit) => {
    updateParams({ limit: newLimit, page: 1 });
  };

  const applyFilters = ({ search: newSearch, category: newCategory }) => {
    updateParams({ q: newSearch.trim(), category: newCategory, page: 1 });
  };

  const clearFilters = () => {
    updateParams({ q: '', category: '', page: 1 });
  };

  const retry = () => setReloadKey((key) => key + 1);

  // ----- CRUD: primero la petición real a la API, luego se actualiza el estado local -----
  const addProduct = async (values) => {
    setSaving(true);
    try {
      const apiResponse = await createProduct(values);
      const newProduct = {
        ...values,
        id: Date.now(), // id local único (la API siempre devuelve el mismo id para los nuevos)
        apiId: apiResponse.id,
        rating: null,
        isLocal: true,
      };
      setAdded((prev) => [newProduct, ...prev]);
      notify('success', `Producto "${values.title}" agregado. La API simula el guardado: el cambio se ve solo en esta sesión.`);
      return true;
    } catch (err) {
      notify('error', `No se pudo agregar el producto. ${err.message}`);
      return false;
    } finally {
      setSaving(false);
    }
  };

  const editProduct = async (product, values) => {
    setSaving(true);
    try {
      try {
        await updateProduct(product.id, values);
      } catch (err) {
        // Un producto creado localmente no existe en la API: responde 404 pero el cambio local es válido.
        if (!(product.isLocal && err.status === 404)) throw err;
      }

      const updated = { ...product, ...values };
      if (product.isLocal) {
        setAdded((prev) => prev.map((item) => (item.id === product.id ? updated : item)));
      } else {
        setEdits((prev) => ({ ...prev, [product.id]: updated }));
      }
      notify('success', `Producto "${values.title}" actualizado en la tabla (la API solo simula el guardado).`);
      return true;
    } catch (err) {
      notify('error', `No se pudo editar el producto. ${err.message}`);
      return false;
    } finally {
      setSaving(false);
    }
  };

  const removeProduct = async (product) => {
    setSaving(true);
    try {
      try {
        await deleteProduct(product.id);
      } catch (err) {
        if (!(product.isLocal && err.status === 404)) throw err;
      }

      if (product.isLocal) {
        setAdded((prev) => prev.filter((item) => item.id !== product.id));
      } else {
        setDeletedIds((prev) => [...prev, product.id]);
      }
      notify('success', `Producto "${product.title}" eliminado de la tabla (la API solo simula el borrado).`);
      return true;
    } catch (err) {
      notify('error', `No se pudo eliminar el producto. ${err.message}`);
      return false;
    } finally {
      setSaving(false);
    }
  };

  return {
    // datos
    products,
    categories,
    total,
    totalPages,
    // parámetros actuales
    page,
    limit,
    search,
    category,
    // estado de la petición
    loading,
    error,
    saving,
    notification,
    // acciones
    goToPage,
    changeLimit,
    applyFilters,
    clearFilters,
    retry,
    addProduct,
    editProduct,
    removeProduct,
    dismissNotification,
  };
}
