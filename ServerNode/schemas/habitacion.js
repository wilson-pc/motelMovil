"use strict"
var mongose = require("mongoose");
var Schema = mongose.Schema;
var Tipo=require("./tipo").schema;
var HabitacionSchema = Schema({
nombre:String,
negocio:{type: Schema.ObjectId, ref: "Negocios"},
precio:Number,
precioreserva:Number,
estado:String,
valoracion:[{usuario:{type: Schema.ObjectId, ref: "Usuarios"},fecha:Date }],
desvaloracion:[{usuario:{type: Schema.ObjectId, ref: "Usuarios"},fecha:Date }],
reportes:Number,
tipo:Tipo,
foto:{portada:String,interior:[String]},
descripcion:String,
eliminado:{estado:Boolean,razon:String},
creacion: {usuario:{type: Schema.ObjectId, ref: "Usuarios"},fecha:Date },
modificacion:{fecha:Date,usuario:{ type: Schema.ObjectId, ref: "Usuarios" }}
})

module.exports = mongose.model("Habitaciones", HabitacionSchema)