import { Usuarios } from "./Usuarios";
import { TipoNegocio } from "./TipoNegocio";

export class Negocio {
    public id:string;
    public nombre:string;
    public titular:string;
    public foto:string;
    public tipo:TipoNegocio;
    public direccion:{ubicaciongps:string,descripcion:string}
    public telefono:string
    public correo:string
    public eliminado:{estado:Boolean,razon:string}
    public creacion:{usuario:string,fecha:Date};
    public modificacion:{fecha:Date,usuario:string}
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