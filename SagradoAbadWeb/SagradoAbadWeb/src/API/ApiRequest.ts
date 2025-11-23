import type { Logged } from "../Types/Auth";
import type { Orden } from "../Types/Ordenes";
import type { Categoria, CreateProducto, Producto } from "../Types/Productos";


const API_URL = "http://localhost:5082/api";

export const LoginReq = async (
  correoElectronico: string,
  password: string
): Promise<Logged> => {
  const response = await fetch(`${API_URL}/sesion/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ correoElectronico, password }),
  });

  if (!response.ok) {
   
    throw new Error( "Usuario o contraseña incorrectos");
  }

  const data = await response.json();

  localStorage.setItem("data", JSON.stringify(data));

  return data as Logged;
};


export const getProductos = async (): Promise<Producto[]> => {
  const response = await fetch(`${API_URL}/productos`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${JSON.parse(localStorage.getItem("data") || "{}").token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch products");
  }

  return await response.json();
}

export const getCategorias = async (): Promise<Categoria[]> => {
  const response = await fetch(`${API_URL}/categorias`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${JSON.parse(localStorage.getItem("data") || "{}").token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch categories");
  }

  return await response.json();
}

export const createProducto = async (producto: CreateProducto): Promise<Producto> => {
  const response = await fetch(`${API_URL}/productos`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${JSON.parse(localStorage.getItem("data") || "{}").token}`,
    },
    body: JSON.stringify(producto),
  });

  if (!response.ok) {
    throw new Error("Failed to create product");
  }
  const data = await response.json()
  return data
}

export const deleteProducto = async (id: string): Promise<void> => {
  const response = await fetch(`${API_URL}/productos/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${JSON.parse(localStorage.getItem("data") || "{}").token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to delete product");
  }
};

export const updateProducto = async (id: string, producto: CreateProducto): Promise<Producto> => {
  const response = await fetch(`${API_URL}/productos/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${JSON.parse(localStorage.getItem("data") || "{}").token}`,
    },
    body: JSON.stringify(producto),
  });

  if (!response.ok) {
    throw new Error("Failed to update product");
  }

  return response.json();
}
export const getProductoById = async (id: string): Promise<Producto> => {
  const response = await fetch(`${API_URL}/productos/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${JSON.parse(localStorage.getItem("data") || "{}").token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch product");
  }

  return response.json();
} 

export const createCategoria = async (categoria: { nombreCategoria: string }): Promise<Categoria> => {  
  const response = await fetch(`${API_URL}/categorias`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${JSON.parse(localStorage.getItem("data") || "{}").token}`,
    },
    body: JSON.stringify(categoria),
  });

  if (!response.ok) {
    throw new Error("Failed to create category");
  }

  return response.json();
}

export const updateCategoria = async (id: string, categoria: { nombreCategoria: string }): Promise<Categoria> => {
  const response = await fetch(`${API_URL}/categorias/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${JSON.parse(localStorage.getItem("data") || "{}").token}`,
    },
    body: JSON.stringify(categoria),
  });

  if (!response.ok) {
    throw new Error("Failed to update category");
  }

  return response.json();
}

export const deleteCategoria = async (id: string): Promise<void> => {
  const response = await fetch(`${API_URL}/categorias/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${JSON.parse(localStorage.getItem("data") || "{}").token}`,
    },
  });
  if (!response.ok) {
    throw new Error("Failed to delete category");
  }
}

export const getOrdenes = async (): Promise<Orden[]> => {
  const response = await fetch(`${API_URL}/orden`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${JSON.parse(localStorage.getItem("data") || "{}").token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch orders");
  }

  return response.json();
}