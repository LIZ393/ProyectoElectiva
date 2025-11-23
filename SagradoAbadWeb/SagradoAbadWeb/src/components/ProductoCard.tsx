"use client";

import type React from "react";

import { useState } from "react";
import type { Producto } from "../Types/Productos";

interface ProductCardProps {
  producto: Producto;
  onEdit: (producto: Producto) => void;
  onDelete: (producto: Producto) => void;
  onUploadImages: (productId: string, files: FileList) => void;
  uploadingImages: boolean;
}

const ProductCard = ({
  producto,
  onEdit,
  onDelete,
  onUploadImages,
  uploadingImages,
}: ProductCardProps) => {
  const [showImages, setShowImages] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      onUploadImages(producto.id, files);
      // Reset input
      event.target.value = "";
    }
  };

  const allImages = [
    producto.imagenPrincipal,
    ...producto.imagenes.map((img) => img.urlImagen),
  ].filter(Boolean);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-md transition-shadow duration-200">
      {/* Image Section */}
      <div className="relative h-48 bg-gray-100 dark:bg-gray-700">
        {allImages.length > 0 ? (
          <div className="relative h-full">
            <img
              src={
                "http://localhost:5082/" + allImages[selectedImageIndex] ||
                "/placeholder.svg"
              }
              alt={producto.nombreProducto}
              className="w-full h-full object-cover"
            />
            {allImages.length > 1 && (
              <div className="absolute bottom-2 left-2 right-2">
                <div className="flex gap-1 justify-center">
                  {allImages.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImageIndex(index)}
                      className={`w-2 h-2 rounded-full transition-colors ${
                        index === selectedImageIndex
                          ? "bg-white"
                          : "bg-white/50"
                      }`}
                    />
                  ))}
                </div>
              </div>
            )}
            <div className="absolute top-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
              {allImages.length} imagen{allImages.length !== 1 ? "es" : ""}
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center h-full">
            <svg
              className="h-12 w-12 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-semibold text-gray-900 dark:text-white text-lg truncate">
            {producto.nombreProducto}
          </h3>
          <span className="text-lg font-bold text-green-600 dark:text-green-400 ml-2">
            ${producto.precio.toFixed(2)}
          </span>
        </div>

        <p className="text-gray-600 dark:text-gray-400 text-sm mb-3 line-clamp-2">
          {producto.descripcion}
        </p>

        <div className="flex items-center justify-between mb-4">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
            {producto.categoria.nombreCategoria}
          </span>
        </div>

        {/* Image Upload Section */}
        <div className="mb-4 border-t border-gray-200 dark:border-gray-700 pt-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Imágenes
            </span>
            <button
              onClick={() => setShowImages(!showImages)}
              className="text-xs text-blue-600 hover:text-blue-800 dark:text-blue-400"
            >
              {showImages ? "Ocultar" : "Ver todas"}
            </button>
          </div>

          <div className="relative">
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleImageUpload}
              disabled={uploadingImages}
              className="hidden"
              id={`upload-${producto.id}`}
            />
            <label
              htmlFor={`upload-${producto.id}`}
              className={`flex items-center justify-center w-full px-3 py-2 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${
                uploadingImages
                  ? "border-gray-300 bg-gray-50 cursor-not-allowed"
                  : "border-gray-300 hover:border-blue-400 hover:bg-blue-50 dark:border-gray-600 dark:hover:border-blue-500 dark:hover:bg-blue-900/20"
              }`}
            >
              {uploadingImages ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                  <span className="text-sm text-gray-600">Subiendo...</span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <svg
                    className="h-4 w-4 text-gray-400"
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
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Agregar imágenes
                  </span>
                </div>
              )}
            </label>
          </div>

          {/* Image Gallery */}
          {showImages && allImages.length > 0 && (
            <div className="mt-3 grid grid-cols-3 gap-2">
              {allImages.map((imageUrl, index) => (
                <div key={index} className="relative group">
                  <img
                    src={imageUrl || "/placeholder.svg"}
                    alt={`${producto.nombreProducto} ${index + 1}`}
                    className="w-full h-16 object-cover rounded border cursor-pointer hover:opacity-75 transition-opacity"
                    onClick={() => setSelectedImageIndex(index)}
                  />
                  {index === 0 && (
                    <div className="absolute top-1 left-1 bg-blue-500 text-white text-xs px-1 rounded">
                      Principal
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <button
            onClick={() => onEdit(producto)}
            className="flex-1 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg transition-colors duration-200 text-sm font-medium"
          >
            <svg
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
              />
            </svg>
            Editar
          </button>
          <button
            onClick={() => onDelete(producto)}
            className="flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-lg transition-colors duration-200 text-sm font-medium"
          >
            <svg
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
