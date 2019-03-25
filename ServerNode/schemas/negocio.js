"use strict"
var mongose = require("mongoose");
var TipoNegocio=require("./tipoNegocio").schema;
var Visitante=require("./visitante").schema;
var calificacion=require("./calificacion").schema;
var Schema = mongose.Schema;
var NegocioSchema = Schema({
nombre:String,
titular:String,
foto:String,
tipo:TipoNegocio,
direccion:{ubicaciongps:String,descripcion:String},
telefono:String,
correo:String,
nit:String,
productos:Number,
reportes:Number,
valoracion:Number,
ganancia:{total:Number,pasado:Number,actual:Number},
eliminado:{estado:Boolean,razon:String},
calificacion:[calificacion],
visitas:[{usuario:{type: Schema.ObjectId, ref: "Usuarios"},fecha:Date}],
creacion: {usuario:{type: Schema.ObjectId, ref: "Usuarios"},fecha:Date },
modificacion:{fecha:Date,usuario:{ type: Schema.ObjectId, ref: "Usuarios" }}
})

module.exports = mongose.model("Negocios", NegocioSchema)