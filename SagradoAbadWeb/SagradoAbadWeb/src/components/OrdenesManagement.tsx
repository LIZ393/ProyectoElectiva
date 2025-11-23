import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import { getOrdenes } from "../API/ApiRequest";
import type { Producto } from "../Types/Productos";

// Define order types
export type OrdenDetalle = {
  id: string;
  producto: Producto;
  cantidad: number;
  precioUnitario: number;
};

export type Orden = {
  id: string;
  usuarioId: string;
  fechaOrden: Date;
  total: number;
  metodoPago: string;
  estadoEnvio: string;
  detalles: OrdenDetalle[];
};

const OrdenesManagement = () => {
  const [ordenes, setOrdenes] = useState<Orden[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  const navigate = useNavigate();
  useEffect(() => {
    const fetchOrdenes = async () => {
      setIsLoading(true);
      try {
        // Replace with your actual API call
        const data = await getOrdenes();

        setOrdenes(data);
      } catch (error) {
        console.error("Error fetching orders:", error);
        toast.error("Error al cargar las órdenes");
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrdenes();
  }, []);

  const filteredOrdenes = ordenes.filter((orden) => {
    const matchesStatus = selectedStatus
      ? orden.estadoEnvio === selectedStatus
      : true;
    const matchesSearch = searchTerm
      ? orden.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        orden.usuarioId.toLowerCase().includes(searchTerm.toLowerCase())
      : true;
    return matchesStatus && matchesSearch;
  });

  const toggleOrderDetails = (orderId: string) => {
    if (expandedOrder === orderId) {
      setExpandedOrder(null);
    } else {
      setExpandedOrder(orderId);
    }
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case "Pendiente":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
      case "Enviado":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
      case "Entregado":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      case "Cancelado":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Gestión de Órdenes
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Administra y visualiza todas las órdenes
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
                  placeholder="Buscar órdenes..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-full px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>

              {/* <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="">Todos los estados</option>
                <option value="Pendiente">Pendiente</option>
                <option value="Enviado">Enviado</option>
                <option value="Entregado">Entregado</option>
                <option value="Cancelado">Cancelado</option>
              </select> */}
            </div>
            <button
              onClick={() => navigate("/categorias")}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors duration-200 font-medium"
            >
              Categorias
            </button>
            <button
              onClick={() => navigate("/productos   ")}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors duration-200 font-medium"
            >
              Productos
            </button>
          </div>
        </div>

        {/* Orders List */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
          {isLoading ? (
            <div className="p-8 flex justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : filteredOrdenes.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                    >
                      Cliente
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                    >
                      Fecha
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                    >
                      Total
                    </th>

                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                    >
                      Método de Pago
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                    >
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {filteredOrdenes.map((orden) => (
                    <React.Fragment key={orden.id}>
                      <tr className="hover:bg-gray-50 dark:hover:bg-gray-700">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                          {orden.usuarioId}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                          {formatDate(orden.fechaOrden)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                          ${orden.total.toFixed(2)}
                        </td>

                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                          {orden.metodoPago}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button
                            onClick={() => toggleOrderDetails(orden.id)}
                            className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                          >
                            {expandedOrder === orden.id
                              ? "Ocultar Detalles"
                              : "Ver Detalles"}
                          </button>
                        </td>
                      </tr>
                      {expandedOrder === orden.id && (
                        <tr>
                          <td
                            colSpan={7}
                            className="px-6 py-4 bg-gray-50 dark:bg-gray-700"
                          >
                            <div className="border-t border-gray-200 dark:border-gray-600 pt-4">
                              <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                                Detalles de la Orden
                              </h4>
                              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                <thead>
                                  <tr>
                                    <th
                                      scope="col"
                                      className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase"
                                    >
                                      Producto
                                    </th>
                                    <th
                                      scope="col"
                                      className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase"
                                    >
                                      Precio Unitario
                                    </th>
                                    <th
                                      scope="col"
                                      className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase"
                                    >
                                      Cantidad
                                    </th>
                                    <th
                                      scope="col"
                                      className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase"
                                    >
                                      Subtotal
                                    </th>
                                  </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                  {orden.detalles.map((detalle) => (
                                    <tr key={detalle.id}>
                                      <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                                        <div className="flex items-center">
                                          {detalle.producto.imagenPrincipal && (
                                            <img
                                              src={
                                                detalle.producto.imagenPrincipal
                                              }
                                              alt={
                                                detalle.producto.nombreProducto
                                              }
                                              className="h-10 w-10 rounded-full mr-3 object-cover"
                                            />
                                          )}
                                          <span>
                                            {detalle.producto.nombreProducto}
                                          </span>
                                        </div>
                                      </td>
                                      <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                                        ${detalle.precioUnitario.toFixed(2)}
                                      </td>
                                      <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                                        {detalle.cantidad}
                                      </td>
                                      <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                                        $
                                        {(
                                          detalle.cantidad *
                                          detalle.precioUnitario
                                        ).toFixed(2)}
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                                <tfoot>
                                  <tr className="bg-gray-100 dark:bg-gray-600">
                                    <td
                                      colSpan={3}
                                      className="px-4 py-2 text-right text-sm font-semibold text-gray-900 dark:text-white"
                                    >
                                      Total:
                                    </td>
                                    <td className="px-4 py-2 whitespace-nowrap text-sm font-bold text-gray-900 dark:text-white">
                                      ${orden.total.toFixed(2)}
                                    </td>
                                  </tr>
                                </tfoot>
                              </table>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
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
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">
                No hay órdenes
              </h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                {searchTerm || selectedStatus
                  ? "No se encontraron órdenes con los filtros aplicados."
                  : "No hay órdenes registradas en el sistema."}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrdenesManagement;
