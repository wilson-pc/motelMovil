import { Footer } from "ionic-angular";

export class Habitacion {
    public id:string;
    public nombre: string;
    public descriptcion : string;
    public creacion : {fecha:Date,usuario:string};
    public foto:{imagen:string,miniatura:string,tipo:string};
    public fotos:[string];
    public precio:string;
    public modificacion:{imagen:string,miniatura:string,tipo:string};
    public estado:string;
    public borrado:boolean;
}