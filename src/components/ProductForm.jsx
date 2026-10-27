import { useState } from 'react';

const EMPTY_VALUES = {
  title: '',
  brand: '',
  category: '',
  price: '',
  stock: '',
  description: '',
  thumbnail: '',
};

/**
 * Formulario para crear o editar un producto.
 * Props:
 *  - initialValues (objeto | null): producto existente al editar; null al crear.
 *  - categories (array): lista de { slug, name } para el selector de categoría.
 *  - onSubmit(values): recibe { title, brand, category, price (number), stock (number), description, thumbnail }
 *      solo se llama cuando todas las validaciones pasan.
 *  - onCancel()
 *  - submitLabel (string): texto del botón principal, por defecto "Guardar"
 *  - loading (boolean)
 * Nota: Modal desmonta su contenido al cerrarse, por lo que el estado del formulario se reinicia solo.
 */
export default function ProductForm({
  initialValues = null,
  categories = [],
  onSubmit,
  onCancel,
  submitLabel = 'Guardar',
  loading = false,
}) {
  const [values, setValues] = useState(() => ({
    ...EMPTY_VALUES,
    ...(initialValues
      ? {
          title: initialValues.title ?? '',
          brand: initialValues.brand ?? '',
          category: initialValues.category ?? '',
          price: initialValues.price ?? '',
          stock: initialValues.stock ?? '',
          description: initialValues.description ?? '',
          thumbnail: initialValues.thumbnail ?? '',
        }
      : {}),
  }));
  const [errors, setErrors] = useState({});

  const handleChange = (event) => {
    const { name, value } = event.target;
    setValues((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const validate = () => {
    const result = {};
    if (values.title.trim().length < 3) result.title = 'El nombre debe tener al menos 3 caracteres.';
    if (!values.category) result.category = 'Selecciona una categoría.';

    const price = Number(values.price);
    if (values.price === '' || Number.isNaN(price) || price <= 0) {
      result.price = 'Ingresa un precio mayor a 0.';
    }

    const stock = Number(values.stock);
    if (values.stock === '' || !Number.isInteger(stock) || stock < 0) {
      result.stock = 'Ingresa un stock entero de 0 o más.';
    }

    if (values.thumbnail.trim() && !/^https?:\/\/.+/i.test(values.thumbnail.trim())) {
      result.thumbnail = 'La imagen debe ser una URL que empiece con http:// o https://';
    }
    return result;
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const validationErrors = validate();
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    onSubmit({
      title: values.title.trim(),
      brand: values.brand.trim(),
      category: values.category,
      price: Number(values.price),
      stock: Number(values.stock),
      description: values.description.trim(),
      thumbnail: values.thumbnail.trim(),
    });
  };

  return (
    <form className="product-form" onSubmit={handleSubmit} noValidate>
      <div className="form-grid">
        <div className="field field-full">
          <label htmlFor="pf-title">Nombre del producto</label>
          <input
            id="pf-title"
            name="title"
            className={`input ${errors.title ? 'has-error' : ''}`}
            value={values.title}
            onChange={handleChange}
            disabled={loading}
          />
          {errors.title && <span className="field-error">{errors.title}</span>}
        </div>

        <div className="field">
          <label htmlFor="pf-brand">Marca</label>
          <input
            id="pf-brand"
            name="brand"
            className="input"
            value={values.brand}
            onChange={handleChange}
            disabled={loading}
          />
        </div>

        <div className="field">
          <label htmlFor="pf-category">Categoría</label>
          <select
            id="pf-category"
            name="category"
            className={`input ${errors.category ? 'has-error' : ''}`}
            value={values.category}
            onChange={handleChange}
            disabled={loading}
          >
            <option value="">Selecciona una categoría</option>
            {categories.map((category) => (
              <option key={category.slug} value={category.slug}>
                {category.name}
              </option>
            ))}
          </select>
          {errors.category && <span className="field-error">{errors.category}</span>}
        </div>

        <div className="field">
          <label htmlFor="pf-price">Precio (USD)</label>
          <input
            id="pf-price"
            name="price"
            type="number"
            min="0"
            step="0.01"
            className={`input ${errors.price ? 'has-error' : ''}`}
            value={values.price}
            onChange={handleChange}
            disabled={loading}
          />
          {errors.price && <span className="field-error">{errors.price}</span>}
        </div>

        <div className="field">
          <label htmlFor="pf-stock">Stock</label>
          <input
            id="pf-stock"
            name="stock"
            type="number"
            min="0"
            step="1"
            className={`input ${errors.stock ? 'has-error' : ''}`}
            value={values.stock}
            onChange={handleChange}
            disabled={loading}
          />
          {errors.stock && <span className="field-error">{errors.stock}</span>}
        </div>

        <div className="field field-full">
          <label htmlFor="pf-thumbnail">URL de la imagen (opcional)</label>
          <input
            id="pf-thumbnail"
            name="thumbnail"
            className={`input ${errors.thumbnail ? 'has-error' : ''}`}
            placeholder="https://..."
            value={values.thumbnail}
            onChange={handleChange}
            disabled={loading}
          />
          {errors.thumbnail && <span className="field-error">{errors.thumbnail}</span>}
        </div>

        <div className="field field-full">
          <label htmlFor="pf-description">Descripción (opcional)</label>
          <textarea
            id="pf-description"
            name="description"
            rows="3"
            className="input"
            value={values.description}
            onChange={handleChange}
            disabled={loading}
          />
        </div>
      </div>

      <div className="modal-actions">
        <button type="button" className="btn btn-outline" onClick={onCancel} disabled={loading}>
          Cancelar
        </button>
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? 'Guardando...' : submitLabel}
        </button>
      </div>
    </form>
  );
}
