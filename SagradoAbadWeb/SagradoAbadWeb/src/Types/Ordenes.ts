import type { Producto } from "./Productos"

export type Orden = {
    id: string
    usuarioId: string
    fechaOrden: Date
    total: number
    metodoPago: string
    estadoEnvio: string
    detalles: OrdenDetalle[]

}


export type OrdenDetalle = { 
    id: string
    producto: Producto
    cantidad: number
    precioUnitario: number  


}