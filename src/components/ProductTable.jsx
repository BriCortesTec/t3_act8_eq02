import { EditIcon, TrashIcon } from './Icons.jsx';
import { formatCategory } from '../services/productService.js';

const formatPrice = (value) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value ?? 0);

/**
 * Tabla de productos 
 * Props:
 *  - products (array)
 *  - loading (boolean): muestra "Cargando productos..."
 *  - error (string): muestra el mensaje y el botón "Reintentar"
 *  - onRetry()
 *  - onEdit(product)
 *  - onDelete(product)
 */
export default function ProductTable({ products, loading, error, onRetry, onEdit, onDelete }) {
  if (loading) {
    return (
      <div className="pt-state" role="status">
        <span className="pt-spinner" aria-hidden="true" />
        <p>Cargando productos...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="pt-state pt-state-error" role="alert">
        <p>No se pudieron cargar los productos. {error}</p>
        <button type="button" className="btn btn-primary btn-sm" onClick={onRetry}>
          Reintentar
        </button>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="pt-state">
        <p>No se encontraron productos con esos filtros. Prueba con otra búsqueda o categoría.</p>
      </div>
    );
  }

  return (
    <div className="pt-table-wrap">
      <table className="pt-table">
        <thead>
          <tr>
            <th>Imagen</th>
            <th>Producto</th>
            <th>Categoría</th>
            <th className="pt-num">Precio</th>
            <th className="pt-num">Stock</th>
            <th className="pt-num">Rating</th>
            <th className="pt-actions-col">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id}>
              <td>
                {product.thumbnail ? (
                  <img className="pt-thumb" src={product.thumbnail} alt={product.title} loading="lazy" />
                ) : (
                  <span className="pt-thumb pt-thumb-empty" aria-hidden="true" />
                )}
              </td>
              <td>
                <strong className="pt-name">{product.title}</strong>
                {product.brand && <span className="pt-brand">{product.brand}</span>}
                {product.isLocal && <span className="pt-tag-local">Nuevo</span>}
              </td>
              <td>
                <span className="pt-badge">{formatCategory(product.category)}</span>
              </td>
              <td className="pt-num">{formatPrice(product.price)}</td>
              <td className="pt-num">{product.stock}</td>
              <td className="pt-num">{product.rating != null ? Number(product.rating).toFixed(1) : '—'}</td>
              <td className="pt-actions-col">
                <div className="pt-actions">
                  <button
                    type="button"
                    className="pt-icon-btn"
                    onClick={() => onEdit(product)}
                    aria-label={`Editar ${product.title}`}
                    title="Editar"
                  >
                    <EditIcon size={16} />
                  </button>
                  <button
                    type="button"
                    className="pt-icon-btn pt-icon-btn-danger"
                    onClick={() => onDelete(product)}
                    aria-label={`Eliminar ${product.title}`}
                    title="Eliminar"
                  >
                    <TrashIcon size={16} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
