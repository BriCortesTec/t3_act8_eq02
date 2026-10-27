import { useState } from 'react';
import '../styles/products.css';
import useProducts from '../hooks/useProducts.js';
import Filters from '../components/Filters.jsx';
import ProductTable from '../components/ProductTable.jsx';
import Pagination from '../components/Pagination.jsx';
import Toast from '../components/Toast.jsx';
import Modal from '../components/Modal.jsx';
import ConfirmDialog from '../components/ConfirmDialog.jsx';
import ProductForm from '../components/ProductForm.jsx';
import { PlusIcon } from '../components/Icons.jsx';

export default function Products() {
  const {
    products,
    categories,
    total,
    totalPages,
    page,
    limit,
    search,
    category,
    loading,
    error,
    saving,
    notification,
    goToPage,
    changeLimit,
    applyFilters,
    clearFilters,
    retry,
    addProduct,
    editProduct,
    removeProduct,
    dismissNotification,
  } = useProducts();

  const [isAdding, setIsAdding] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null); // producto que se está editando
  const [pendingEdit, setPendingEdit] = useState(null); // valores del formulario esperando confirmación
  const [deletingProduct, setDeletingProduct] = useState(null); // producto que se va a eliminar

  const handleAddSubmit = async (values) => {
    const ok = await addProduct(values);
    if (ok) setIsAdding(false);
  };

  // Al enviar el formulario de edición se pide confirmación antes de guardar.
  const handleEditSubmit = (values) => setPendingEdit(values);

  const handleEditConfirm = async () => {
    const ok = await editProduct(editingProduct, pendingEdit);
    setPendingEdit(null);
    if (ok) setEditingProduct(null);
  };

  const handleDeleteConfirm = async () => {
    await removeProduct(deletingProduct);
    setDeletingProduct(null);
  };

  return (
    <section className="pt-page">
      <div className="page-header">
        <div>
          <h2 className="page-title">Registros de productos</h2>
          <p className="page-subtitle">Consulta, agrega, edita y elimina productos del catálogo.</p>
        </div>
        <button type="button" className="btn btn-primary" onClick={() => setIsAdding(true)}>
          <PlusIcon size={16} />
          Nuevo producto
        </button>
      </div>

      <Filters
        search={search}
        category={category}
        categories={categories}
        onApply={applyFilters}
        onClear={clearFilters}
      />

      <Toast notification={notification} onClose={dismissNotification} />

      <ProductTable
        products={products}
        loading={loading}
        error={error}
        onRetry={retry}
        onEdit={setEditingProduct}
        onDelete={setDeletingProduct}
      />

      {!error && (
        <Pagination
          page={page}
          totalPages={totalPages}
          total={total}
          limit={limit}
          disabled={loading}
          onPageChange={goToPage}
          onLimitChange={changeLimit}
        />
      )}

      {/* Agregar */}
      <Modal isOpen={isAdding} title="Nuevo producto" onClose={() => setIsAdding(false)}>
        <ProductForm
          categories={categories}
          onSubmit={handleAddSubmit}
          onCancel={() => setIsAdding(false)}
          submitLabel="Agregar producto"
          loading={saving}
        />
      </Modal>

      {/* Editar: formulario + confirmación */}
      <Modal isOpen={Boolean(editingProduct)} title="Editar producto" onClose={() => setEditingProduct(null)}>
        <ProductForm
          initialValues={editingProduct}
          categories={categories}
          onSubmit={handleEditSubmit}
          onCancel={() => setEditingProduct(null)}
          submitLabel="Guardar cambios"
          loading={saving}
        />
      </Modal>

      <ConfirmDialog
        isOpen={Boolean(pendingEdit)}
        title="Confirmar edición"
        message={
          <p>
            ¿Seguro que quieres guardar los cambios de <strong>{editingProduct?.title}</strong>?
          </p>
        }
        confirmText="Sí, guardar"
        loading={saving}
        onConfirm={handleEditConfirm}
        onCancel={() => setPendingEdit(null)}
      />

      {/* Eliminar */}
      <ConfirmDialog
        isOpen={Boolean(deletingProduct)}
        title="Eliminar producto"
        message={
          <p>
            ¿Seguro que quieres eliminar <strong>{deletingProduct?.title}</strong>? Esta acción quitará el producto de
            la tabla.
          </p>
        }
        confirmText="Sí, eliminar"
        variant="danger"
        loading={saving}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeletingProduct(null)}
      />
    </section>
  );
}
