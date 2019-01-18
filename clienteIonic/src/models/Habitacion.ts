import { Footer } from "ionic-angular";

export class Habitacion {
    public id:string;
    public nombre: string;
    public descripcion : string;
    public tipohabitacion:string;
    public seccionubicacion:string;
    public creacion : {fecha:Date,usuario:string};
    public foto:{imagen:string,miniatura:string,tipo:string};    
    public precio:string;
    public modificacion:{fecha:string,usuario:string};
    public estado:string;
    public borrado:boolean;
}