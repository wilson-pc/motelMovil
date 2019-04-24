import { Usuarios } from "./Usuarios";
import { TipoNegocio } from "./TipoNegocio";

export class Negocio {
    public _id:string;
    public nombre:string;
    public titular:string;
    public foto:string;
    public tipo:TipoNegocio;
    public direccion:{ubicacionFisica:string,latitud:number,longitud:number};
    public telefono:string;//ok
    public nit:string;//ok
    public correo:string;//ok
    public eliminado:{estado:Boolean,razon:string}
    public creacion:{usuario:string,fecha:string};
    public modificacion:{fecha:string,usuario:string};
}

/**
 * nombre:String,
titular:{type: Schema.ObjectId, ref: "Usuarios"},
foto:String,
tipo:TipoNegocio,
direccion:{ubicaciongps:String,descripcion:String},
telefono:String,
correo:String,
eliminado:{estado:Boolean,razon:String},
creacion: {usuario:{type: Schema.ObjectId, ref: "Usuarios"},fecha:Date },
modificacion:{fecha:Date,usuario:{ type: Schema.ObjectId, ref: "Usuarios" }}

 */