import { LIMIT_OPTIONS } from '../hooks/useProducts.js';

// Construye la lista de páginas con "..." (ej. 1 … 4 5 6 … 20).
function buildPages(page, totalPages) {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }
  const pages = [1];
  const start = Math.max(2, page - 1);
  const end = Math.min(totalPages - 1, page + 1);
  if (start > 2) pages.push('start-gap');
  for (let current = start; current <= end; current += 1) pages.push(current);
  if (end < totalPages - 1) pages.push('end-gap');
  pages.push(totalPages);
  return pages;
}

/**
 * Paginación 
 * Props:
 *  - page, totalPages, total, limit (números)
 *  - disabled (boolean): bloquea los controles mientras carga
 *  - onPageChange(page)
 *  - onLimitChange(limit)
 */
export default function Pagination({ page, totalPages, total, limit, disabled, onPageChange, onLimitChange }) {
  const from = total === 0 ? 0 : (page - 1) * limit + 1;
  const to = Math.min(page * limit, total);

  return (
    <div className="pt-pagination">
      <p className="pt-pagination-info">
        Mostrando {from}–{to} de {total} registros
      </p>

      <nav className="pt-pages" aria-label="Paginación">
        <button
          type="button"
          className="pt-page-btn"
          onClick={() => onPageChange(page - 1)}
          disabled={disabled || page <= 1}
          aria-label="Página anterior"
        >
          ‹
        </button>

        {buildPages(page, totalPages).map((item) =>
          typeof item === 'string' ? (
            <span key={item} className="pt-page-gap">
              …
            </span>
          ) : (
            <button
              key={item}
              type="button"
              className={`pt-page-btn ${item === page ? 'is-current' : ''}`}
              onClick={() => onPageChange(item)}
              disabled={disabled}
              aria-current={item === page ? 'page' : undefined}
            >
              {item}
            </button>
          )
        )}

        <button
          type="button"
          className="pt-page-btn"
          onClick={() => onPageChange(page + 1)}
          disabled={disabled || page >= totalPages}
          aria-label="Página siguiente"
        >
          ›
        </button>
      </nav>

      <label className="pt-limit">
        <span>Mostrar</span>
        <select
          className="input"
          value={limit}
          onChange={(event) => onLimitChange(Number(event.target.value))}
          disabled={disabled}
        >
          {LIMIT_OPTIONS.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </label>
    </div>
  );
}
