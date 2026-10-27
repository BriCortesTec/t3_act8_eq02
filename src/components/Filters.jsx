import { useEffect, useState } from 'react';
import { SearchIcon } from './Icons.jsx';

/**
 * Props:
 *  - search (string): texto activo (viene de la URL)
 *  - category (string): slug de categoría activa (viene de la URL)
 *  - categories (array): [{ slug, name }]
 *  - onApply({ search, category }): se llama al pulsar "Filtrar", al enviar con Enter o al cambiar la categoría
 *  - onClear(): quita todos los filtros
 */
export default function Filters({ search, category, categories, onApply, onClear }) {
  const [searchText, setSearchText] = useState(search);
  const [selectedCategory, setSelectedCategory] = useState(category);

  // Mantiene los campos sincronizados cuando la URL cambia (atrás/adelante del navegador).
  useEffect(() => setSearchText(search), [search]);
  useEffect(() => setSelectedCategory(category), [category]);

  const handleSubmit = (event) => {
    event.preventDefault();
    onApply({ search: searchText, category: selectedCategory });
  };

  const handleCategoryChange = (event) => {
    const value = event.target.value;
    setSelectedCategory(value);
    onApply({ search: searchText, category: value });
  };

  const hasFilters = Boolean(search || category);

  return (
    <form className="pt-filters" onSubmit={handleSubmit}>
      <div className="field pt-filter-search">
        <label htmlFor="filter-search">Buscar producto</label>
        <div className="input-wrap">
          <SearchIcon size={16} />
          <input
            id="filter-search"
            type="search"
            placeholder="Buscar por nombre..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
        </div>
      </div>

      <div className="field pt-filter-category">
        <label htmlFor="filter-category">Categoría</label>
        <select id="filter-category" className="input" value={selectedCategory} onChange={handleCategoryChange}>
          <option value="">Todas las categorías</option>
          {categories.map((item) => (
            <option key={item.slug} value={item.slug}>
              {item.name}
            </option>
          ))}
        </select>
      </div>

      <div className="pt-filter-actions">
        <button type="submit" className="btn btn-primary">
          Filtrar
        </button>
        {hasFilters && (
          <button type="button" className="btn btn-outline" onClick={onClear}>
            Limpiar
          </button>
        )}
      </div>
    </form>
  );
}
