import type React from "react";

import { useEffect, useState } from "react";
import type { Categoria, CreateProducto, Producto } from "../Types/Productos";

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (productData: CreateProducto) => void;
  categorias: Categoria[];
  editingProduct?: Producto | null;
  isLoading: boolean;
}

type ErrorMessages = {
  NombreProducto?: string;
  Descripcion?: string;
  Precio?: string;
  CategoriaId?: string;
  ImagenPrincipal?: string;
};

const ProductModal: React.FC<ProductModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  categorias,
  editingProduct,
  isLoading,
}) => {
  const [formData, setFormData] = useState<CreateProducto>({
    NombreProducto: "",
    Descripcion: "",
    Precio: 0,
    CategoriaId: "",
    ImagenPrincipal: "",
  });

  const [errors, setErrors] = useState<Partial<ErrorMessages>>({});

  useEffect(() => {
    if (editingProduct) {
      setFormData({
        NombreProducto: editingProduct.nombreProducto,
        Descripcion: editingProduct.descripcion,
        Precio: editingProduct.precio,
        CategoriaId: editingProduct.categoria.id,
        ImagenPrincipal: editingProduct.imagenPrincipal,
      });
    } else {
      setFormData({
        NombreProducto: "",
        Descripcion: "",
        Precio: 0,
        CategoriaId: "",
        ImagenPrincipal: "",
      });
    }
    setErrors({});
  }, [editingProduct, isOpen]);

  const validateForm = (): boolean => {
    const newErrors: Partial<ErrorMessages> = {};

    if (!formData.NombreProducto.trim()) {
      newErrors.NombreProducto = "El nombre del producto es requerido";
    }

    if (!formData.Descripcion.trim()) {
      newErrors.Descripcion = "La descripción es requerida";
    }

    if (formData.Precio <= 0) {
      newErrors.Precio = "El precio debe ser mayor a 0";
    }

    if (!formData.CategoriaId) {
      newErrors.CategoriaId = "Selecciona una categoría";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const handleInputChange = (
    field: keyof CreateProducto,
    value: string | number
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              {editingProduct ? "Editar Producto" : "Agregar Producto"}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              disabled={isLoading}
            >
              <svg
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            {/* Product Name */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Nombre del Producto
              </label>
              <input
                type="text"
                value={formData.NombreProducto}
                onChange={(e) =>
                  handleInputChange("NombreProducto", e.target.value)
                }
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white ${
                  errors.NombreProducto
                    ? "border-red-500"
                    : "border-gray-200 dark:border-gray-600"
                }`}
                placeholder="Ingresa el nombre del producto"
                disabled={isLoading}
              />
              {errors.NombreProducto && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.NombreProducto}
                </p>
              )}
            </div>

            {/* Description */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Descripción
              </label>
              <textarea
                value={formData.Descripcion}
                onChange={(e) =>
                  handleInputChange("Descripcion", e.target.value)
                }
                rows={3}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none ${
                  errors.Descripcion
                    ? "border-red-500"
                    : "border-gray-200 dark:border-gray-600"
                }`}
                placeholder="Describe el producto"
                disabled={isLoading}
              />
              {errors.Descripcion && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.Descripcion}
                </p>
              )}
            </div>

            {/* Price */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Precio
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={formData.Precio}
                onChange={(e) =>
                  handleInputChange(
                    "Precio",
                    Number.parseFloat(e.target.value) || 0
                  )
                }
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white ${
                  errors.Precio
                    ? "border-red-500"
                    : "border-gray-200 dark:border-gray-600"
                }`}
                placeholder="0.00"
                disabled={isLoading}
              />
              {errors.Precio && (
                <p className="text-red-500 text-sm mt-1">{errors.Precio}</p>
              )}
            </div>

            {/* Category */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Categoría
              </label>
              <select
                value={formData.CategoriaId}
                onChange={(e) =>
                  handleInputChange("CategoriaId", e.target.value)
                }
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white ${
                  errors.CategoriaId
                    ? "border-red-500"
                    : "border-gray-200 dark:border-gray-600"
                }`}
                disabled={isLoading}
              >
                <option value="">Selecciona una categoría</option>
                {categorias.map((categoria) => (
                  <option key={categoria.id} value={categoria.id}>
                    {categoria.nombreCategoria}
                  </option>
                ))}
              </select>
              {errors.CategoriaId && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.CategoriaId}
                </p>
              )}
            </div>

            {/* Image URL */}

            {/* Buttons */}
            <div className="flex gap-3">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2 border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
                disabled={isLoading}
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className={`flex-1 px-4 py-2 text-white rounded-lg transition-colors duration-200 ${
                  isLoading
                    ? "bg-blue-400 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700 active:bg-blue-800"
                }`}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    {editingProduct ? "Actualizando..." : "Agregando..."}
                  </div>
                ) : editingProduct ? (
                  "Actualizar Producto"
                ) : (
                  "Agregar Producto"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProductModal;
