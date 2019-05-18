
import { Tipo } from "./TipoProducto";

export class Habitacion {
    public _id:string;
    public nombre: string;
    public descripcion : string;
    public tipo:Tipo;
    public valoracion:Number;
    public reportes:Number;
    public seccionubicacion:string;    
    public foto:{imagen:string,miniatura:string,tipo:string};    
    public precio:string;    
    public precioReserva:Number;
    public estado:string;
    public eliminado:{estado:Boolean,razon:string};
    public creacion:{usuario:string,fecha:Date}
    public modificacion:{fecha:string,usuario:string};
   
}