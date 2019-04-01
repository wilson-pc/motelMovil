"use strict"
var mongose = require("mongoose");
var Schema = mongose.Schema;
var Tipo=require("./tipo").schema;
var ProductoSchema = Schema({
nombre:String,
negocio:{type: Schema.ObjectId, ref: "Negocios"},
precio:Number,
precioReserva:Number,
cantidad:Number,
valoracion:[{usuario:{type: Schema.ObjectId, ref: "Usuarios"},fecha:Date }],
desvaloracion:[{usuario:{type: Schema.ObjectId, ref: "Usuarios"},fecha:Date }],
reportes:Number,
tipo:Tipo,
estado:String,
fotos:[String],
foto:{normal:String,miniatura:String},
descripcion:String,
eliminado:{estado:Boolean,razon:String},
creacion: {fecha:String },
tiempoespera:Number,
modificacion:{fecha:String}
})

module.exports = mongose.model("Productos", ProductoSchema)