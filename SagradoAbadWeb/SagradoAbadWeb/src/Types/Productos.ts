export type Producto ={ 
    id: string
    nombreProducto: string
    descripcion: string
    precio: number
    categoria: Categoria
    imagenPrincipal: string
    imagenes: Imagenes[]
}

type Imagenes = {
    id: string
    productoId: string
    urlImagen: string
}




export type Categoria = {
    id: string
    nombreCategoria: string
}

export type CreateProducto ={
    NombreProducto: string
    Descripcion: string
    Precio: number
    CategoriaId: string
    ImagenPrincipal: string
}