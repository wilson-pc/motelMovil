import { Negocio } from "./Negocio";
import { Tipo } from "./TipoProducto";

export class Productos{
    public _id:string;
    public nombre:string;   
    public negocio:Negocio;
    public precio:number;   
    public disponibilidad:string;
    public valoracion:number;
    public reportes:number;
    public cantidad:number;
    public tipo:Tipo;
    public estado:string;
    public foto:{normal:string,miniatura:string};
    public descripcion:string;
    public eliminado:{estado:boolean,razon:string};
    public creacion:{estado:boolean,razon:string};
    public modificacion:{fecha:Date,usuario:string};

}
/**
 * nombre:String,
negocio:{type: Schema.ObjectId, ref: "Negocios"},
precio:{precio:Number,moneda:String},
disponibilidad:String,
cantidad:Number,
tipo:Tipo,
foto:{normal:String,miniatura:String},
descripcion:String,
eliminado:{estado:Boolean,razon:String},
creacion: {usuario:{type: Schema.ObjectId, ref: "Usuarios"},fecha:Date },
modificacion:{fecha:Date,usuario:{ type: Schema.ObjectId, ref: "Usuarios" }}

 */