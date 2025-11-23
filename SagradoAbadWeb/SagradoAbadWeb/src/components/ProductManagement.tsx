"use client";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import {
  createProducto,
  deleteProducto,
  getCategorias,
  getProductos,
  updateProducto,
} from "../API/ApiRequest";
import type { Categoria, CreateProducto, Producto } from "../Types/Productos";
import DeleteConfirmModal from "./DeleteConfirmation";
import ProductModal from "./ProductModal";
import ProductCard from "./ProductoCard";

const ProductManagement = () => {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Producto | null>(null);
  const [deletingProduct, setDeletingProduct] = useState<Producto | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const [uploadingImages, setUploadingImages] = useState(false);

  const fetchProductos = async () => {
    const productosRes = await getProductos();
    setProductos(productosRes);
    console.log("Productos actualizados:", productosRes);
  };

  useEffect(() => {
    const call = async () => {
      var categoriasRes = await getCategorias();
      console.log("Categorias:", categoriasRes);
      setCategorias(categoriasRes);
      fetchProductos();
    };
    call();
  }, []);

  const filteredProducts = productos?.filter((producto) => {
    const matchesSearch =
      producto.nombreProducto
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      producto.descripcion?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "" || producto.categoria.id === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleAddProduct = async (productData: CreateProducto) => {
    setIsLoading(true);
    try {
      const categoria = categorias.find(
        (cat) => cat.id === productData.CategoriaId
      );
      if (!categoria) return;

      const newProduct: CreateProducto = {
        NombreProducto: productData.NombreProducto,
        Descripcion: productData.Descripcion,
        Precio: productData.Precio,
        CategoriaId: categoria.id,
        ImagenPrincipal: productData.ImagenPrincipal,
      };

      await createProducto(newProduct);
      await fetchProductos(); // Refresh products list
      setIsModalOpen(false);
      toast.success("Producto agregado exitosamente");
    } catch (error) {
      console.error("Error adding product:", error);
      toast.error("Error al agregar el producto");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditProduct = async (productData: CreateProducto) => {
    if (!editingProduct) return;

    setIsLoading(true);
    try {
      const categoria = categorias.find(
        (cat) => cat.id === productData.CategoriaId
      );
      if (!categoria) return;

      const updatedProduct: CreateProducto = {
        ...editingProduct,
        NombreProducto: productData.NombreProducto,
        Descripcion: productData.Descripcion,
        Precio: productData.Precio,
        CategoriaId: categoria.id,
        ImagenPrincipal: productData.ImagenPrincipal,
      };

      await updateProducto(editingProduct.id, updatedProduct);
      await fetchProductos(); // Refresh products list

      setIsModalOpen(false);
      setEditingProduct(null);
      toast.success("Producto actualizado exitosamente");
    } catch (error) {
      console.error("Error updating product:", error);
      toast.error("Error al actualizar el producto");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteProduct = async () => {
    if (!deletingProduct) return;

    setIsLoading(true);
    try {
      await deleteProducto(deletingProduct.id);
      await fetchProductos(); // Refresh products list

      setIsDeleteModalOpen(false);
      setDeletingProduct(null);
      toast.success("Producto eliminado exitosamente");
    } catch (error) {
      console.error("Error deleting product:", error);
      toast.error("Error al eliminar el producto");
    } finally {
      setIsLoading(false);
    }
  };

  const handleUploadImages = async (productId: string, files: FileList) => {
    if (!files || files.length === 0) return;

    setUploadingImages(true);
    try {
      const formData = new FormData();

      // Agregar todos los archivos al FormData
      Array.from(files).forEach((file) => {
        formData.append("files", file);
      });

      const response = await fetch(
        `http://localhost:5082/imagenes/${productId}`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error("Error al subir las imágenes");
      }

      await fetchProductos(); // Refresh products list
      toast.success("Imágenes subidas exitosamente");
    } catch (error) {
      console.error("Error uploading images:", error);
      toast.error("Error al subir las imágenes");
    } finally {
      setUploadingImages(false);
    }
  };

  const openEditModal = (product: Producto) => {
    setEditingProduct(product);
    setIsModalOpen(true);
  };

  const openDeleteModal = (product: Producto) => {
    setDeletingProduct(product);
    setIsDeleteModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingProduct(null);
  };

  const navigateToCategories = () => {
    navigate("/categorias");
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Gestión de Productos
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Administra tu inventario de productos
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
                  placeholder="Buscar productos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-full px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>

              {/* Category Filter */}
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="">Todas las categorías</option>
                {categorias.map((categoria) => (
                  <option key={categoria.id} value={categoria.id}>
                    {categoria.nombreCategoria}
                  </option>
                ))}
              </select>
            </div>

            {/* Add Product Button */}
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
              Agregar Producto
            </button>
            <button
              onClick={navigateToCategories}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors duration-200 font-medium"
            >
              Categorias
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
            <ProductCard
              key={producto.id}
              producto={producto}
              onEdit={openEditModal}
              onDelete={openDeleteModal}
              onUploadImages={handleUploadImages}
              uploadingImages={uploadingImages}
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
              No hay productos
            </h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {searchTerm || selectedCategory
                ? "No se encontraron productos con los filtros aplicados."
                : "Comienza agregando tu primer producto."}
            </p>
          </div>
        )}

        {/* Modals */}
        <ProductModal
          isOpen={isModalOpen}
          onClose={closeModal}
          onSubmit={editingProduct ? handleEditProduct : handleAddProduct}
          categorias={categorias}
          editingProduct={editingProduct}
          isLoading={isLoading}
        />

        <DeleteConfirmModal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          onConfirm={handleDeleteProduct}
          productName={deletingProduct?.nombreProducto || ""}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
};

export default ProductManagement;
