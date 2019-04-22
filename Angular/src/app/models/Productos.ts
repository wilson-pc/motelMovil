import { Negocio } from "./Negocio";
import { Tipo } from "./TipoProducto";
import { Denuncias } from "./Denuncias";

export class Productos{
    public id:string;
    public nombre:string;   
    public negocio:Negocio;
    public precio:{precio:Number,moneda:string}    
    public disponibilidad:string;
    public cantidad:Number;
    public tipo:Tipo;
    public foto:{normal:string,miniatura:string};
    public denuncias:Denuncias;
    public descripcion:string;
    public eliminado:{estado:Boolean,razon:string};
    public creacion:{estado:Boolean,razon:string};
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