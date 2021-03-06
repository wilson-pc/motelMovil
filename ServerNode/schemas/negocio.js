"use strict"
var mongose = require("mongoose");
var TipoNegocio=require("./tipoNegocio").schema;
var Visitante=require("./visitante").schema;
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
visitas:Number,
ganancia:{total:Number,pasado:Number,actual:Number},
eliminado:{estado:Boolean,razon:String},
calificacion:[{usuario:{type: Schema.ObjectId, ref: "Usuarios"},fecha:Date,puntuacion:Number }],
creacion: {usuario:{type: Schema.ObjectId, ref: "Usuarios"},fecha:Date },
modificacion:{fecha:Date,usuario:{ type: Schema.ObjectId, ref: "Usuarios" }}
})

module.exports = mongose.model("Negocios", NegocioSchema)