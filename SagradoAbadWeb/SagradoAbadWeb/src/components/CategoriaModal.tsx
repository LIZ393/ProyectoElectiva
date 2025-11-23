import type React from "react";

import { useEffect, useState } from "react";
import type { Categoria } from "../Types/Productos";

interface CategoriaModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (categoriaData: { NombreCategoria: string }) => void;
  editingCategoria: Categoria | null;
  isLoading: boolean;
}

type ErrorMessages = {
  NombreCategoria?: string;
};

const CategoriaModal: React.FC<CategoriaModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  editingCategoria,
  isLoading,
}) => {
  const [formData, setFormData] = useState<{
    NombreCategoria: string;
  }>({
    NombreCategoria: "",
  });

  const [errors, setErrors] = useState<Partial<ErrorMessages>>({});

  useEffect(() => {
    if (editingCategoria) {
      setFormData({
        NombreCategoria: editingCategoria.nombreCategoria,
      });
    } else {
      setFormData({
        NombreCategoria: "",
      });
    }
    setErrors({});
  }, [editingCategoria, isOpen]);

  const validateForm = (): boolean => {
    const newErrors: Partial<ErrorMessages> = {};

    if (!formData.NombreCategoria.trim()) {
      newErrors.NombreCategoria = "El nombre de la categoria es requerido";
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

  const handleInputChange = (field: "NombreCategoria", value: string) => {
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
              {editingCategoria ? "Editar Categoría" : "Agregar Categoría"}
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
            {/* Category Name */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Nombre de la Categoría
              </label>
              <input
                type="text"
                value={formData.NombreCategoria}
                onChange={(e) =>
                  handleInputChange("NombreCategoria", e.target.value)
                }
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white ${
                  errors.NombreCategoria
                    ? "border-red-500"
                    : "border-gray-200 dark:border-gray-600"
                }`}
                placeholder="Ingresa el nombre de la categoría"
                disabled={isLoading}
              />
              {errors.NombreCategoria && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.NombreCategoria}
                </p>
              )}
            </div>

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
                    {editingCategoria ? "Actualizando..." : "Agregando..."}
                  </div>
                ) : editingCategoria ? (
                  "Actualizar Categoría"
                ) : (
                  "Agregar Categoría"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CategoriaModal;
