"use strict"
var mongose = require("mongoose");
var Schema = mongose.Schema;
var Tipo=require("./tipo").schema;
var calificacion=require("./calificacion").schema;
var ProductoSchema = Schema({
nombre:String,
negocio:{type: Schema.ObjectId, ref: "Negocios"},
precio:Number,
precioReserva:Number,
cantidad:Number,
calificacion:[calificacion],
reportes:Number,
tipo:Tipo,
foto:{normal:String,miniatura:String},
descripcion:String,
eliminado:{estado:Boolean,razon:String},
creacion: {fecha:String },
modificacion:{fecha:String}
})

module.exports = mongose.model("Productos", ProductoSchema)