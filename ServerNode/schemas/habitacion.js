"use strict"
var mongose = require("mongoose");
var Schema = mongose.Schema;
var Tipo=require("./tipo").schema;
var HabitacionSchema = Schema({
nombre:String,
negocio:{type: Schema.ObjectId, ref: "Negocios"},
precio:{precio:Number,moneda:String},
estado:String,
tipo:Tipo,
foto:{portada:String,interior:[String]},
descripcion:String,
eliminado:{estado:Boolean,razon:String},
creacion: {usuario:{type: Schema.ObjectId, ref: "Usuarios"},fecha:Date },
modificacion:{fecha:Date,usuario:{ type: Schema.ObjectId, ref: "Usuarios" }}
})

module.exports = mongose.model("Habitaciones", ProductoSchema)