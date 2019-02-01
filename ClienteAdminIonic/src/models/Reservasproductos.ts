import { Productos } from "./Productos";
import { TiempoReservaProducto } from "./TiempoReservaProductos";

export class ReservasProductos{
    public id:string;
    public cliente:string;
    public negocio:string;
    public tiempo:TiempoReservaProducto;
    public producto:Productos;
    public estado:String;
}