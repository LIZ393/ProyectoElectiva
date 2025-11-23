import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import {
  createCategoria,
  deleteCategoria,
  getCategorias,
  updateCategoria,
} from "../API/ApiRequest";
import type { Categoria } from "../Types/Productos";
import CategoriaCard from "./CategoriaCard";
import CategoriaModal from "./CategoriaModal";
import DeleteConfirmModal from "./DeleteConfirmation";

const CategoriasManagement = () => {
  const navigate = useNavigate();
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editingCategoria, setEditingCategoria] = useState<Categoria | null>(
    null
  );
  const [deletingCategoria, setDeletingCategoria] = useState<Categoria | null>(
    null
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const call = async () => {
      var categoriasRes = await getCategorias();

      console.log("Categorias:", categoriasRes);

      setCategorias(categoriasRes);
    };
    call();
  }, []);

  const filteredProducts = categorias?.filter((producto) => {
    const matchesSearch = producto.nombreCategoria
      ?.toLowerCase()
      .includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const handleAddCategoria = async (categoriaData: {
    NombreCategoria: string;
  }) => {
    setIsLoading(true);
    try {
      await createCategoria({ nombreCategoria: categoriaData.NombreCategoria });

      const categoriasRes = await getCategorias();
      setCategorias(categoriasRes);

      setIsModalOpen(false);
      toast.success("Categoría agregada exitosamente");
    } catch (error) {
      console.error("Error adding category:", error);
      toast.error("Error al agregar la categoría");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditCategoria = async (categoriaData: {
    NombreCategoria: string;
  }) => {
    if (!editingCategoria) return;

    setIsLoading(true);
    try {
      await updateCategoria(editingCategoria.id, {
        nombreCategoria: categoriaData.NombreCategoria,
      });

      const categoriasRes = await getCategorias();
      setCategorias(categoriasRes);

      setIsModalOpen(false);
      setEditingCategoria(null);
      toast.success("Categoría actualizada exitosamente");
    } catch (error) {
      console.error("Error updating category:", error);
      toast.error("Error al actualizar la categoría");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteCategoria = async () => {
    if (!deletingCategoria) return;

    setIsLoading(true);
    try {
      await deleteCategoria(deletingCategoria.id);

      const categoriasRes = await getCategorias();
      setCategorias(categoriasRes);

      setIsDeleteModalOpen(false);
      setDeletingCategoria(null);
      toast.success("Categoría eliminada exitosamente");
    } catch (error) {
      console.error("Error deleting category:", error);
      toast.error(
        "Error al eliminar la categoria, probablemente ya tiene productos asociados"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const openEditModal = (categoria: Categoria) => {
    setEditingCategoria(categoria);
    setIsModalOpen(true);
  };

  const openDeleteModal = (categoria: Categoria) => {
    setDeletingCategoria(categoria);
    setIsDeleteModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingCategoria(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Gestión de Categorias
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Administra tu inventario de categorias
          </p>
          <div className="place-self-end mt-4">
            <button
              className="bg-red-500 text-white px-4 py-2 rounded shadow hover:bg-red-600 transition-colors duration-200"
              onClick={() => {
                localStorage.removeItem("data");
                window.location.href = "/login";
              }}
            >
              Cerrar sesion
            </button>
          </div>
        </div>

        {/* Controls */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 mb-6">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-4 flex-1">
              {/* Search */}
              <div className="relative flex-1 max-w-md">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg
                    className="h-5 w-5 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </div>
                <input
                  type="text"
                  placeholder="Buscar categorias..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-full px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
            </div>

            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors duration-200 font-medium"
            >
              <svg
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 4v16m8-8H4"
                />
              </svg>
              Agregar Categoria
            </button>
            <button
              onClick={() => navigate("/productos")}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors duration-200 font-medium"
            >
              Productos
            </button>
            <button
              onClick={() => navigate("/ordenes   ")}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors duration-200 font-medium"
            >
              Ordenes
            </button>
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((producto) => (
            <CategoriaCard
              key={producto.id}
              categoria={producto}
              onEdit={openEditModal}
              onDelete={openDeleteModal}
            />
          ))}
        </div>

        {/* Empty State */}
        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2M4 13h2m13-8V4a1 1 0 00-1-1H7a1 1 0 00-1 1v1m8 0V4a1 1 0 00-1-1H9a1 1 0 00-1 1v1"
              />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">
              No hay categorias
            </h3>
          </div>
        )}

        {/* Modals */}
        <CategoriaModal
          isOpen={isModalOpen}
          onClose={closeModal}
          onSubmit={editingCategoria ? handleEditCategoria : handleAddCategoria}
          editingCategoria={editingCategoria}
          isLoading={isLoading}
        />

        <DeleteConfirmModal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          onConfirm={handleDeleteCategoria}
          productName={deletingCategoria?.nombreCategoria || ""}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
};

export default CategoriasManagement;
