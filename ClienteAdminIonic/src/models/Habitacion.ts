import { Footer } from "ionic-angular";
import { Tipo } from "./TipoProducto";

export class Habitacion {
    public id:string;
    public nombre: string;
    public descripcion : string;
    public tipo:Tipo;
    public precioReserva:Number;
    public seccionubicacion:string;    
    public foto:{imagen:string,miniatura:string,tipo:string};
    public fotos:[string];    
    public precio:string;    
    public estado:string;
    public eliminado:{estado:Boolean,razon:string};
    public creacion:{usuario:string,fecha:Date}
    public modificacion:{fecha:string,usuario:string};
   
}