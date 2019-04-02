import { Negocio } from "./Negocio";
import { Tipo } from "./TipoProducto";

export class Productos{
    public _id:string;
    public nombre:string;   
    public negocio:Negocio;
    public precio:Number;  
    public precioReserva:Number;
    public cantidad:Number;
    public tipo:Tipo;
    public foto:{normal:string,miniatura:string};
    public descripcion:string;
    public eliminado:{estado:Boolean,razon:string};
    public creacion:{fecha:string};
    public modificacion:{fecha:string};

    public estado:string;
    public fotos:[string];    
    public seccionubicacion:string;    
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