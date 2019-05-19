"use strict"
var mongose = require("mongoose");
var Schema = mongose.Schema;
var Producto=require("./producto").schema;
var Reservaproducto = Schema({
    cliente:{type: Schema.ObjectId, ref: "Usuarios"},
    negocio:{type: Schema.ObjectId, ref: "Negocios"},
    tiempo:{fechareserva:Date,fechalimite:Date},
    producto:{type: Schema.ObjectId, ref: "Productos"},
    precioactual:Number,
    cantidad:Number,
    fechaentrega:Date,
    estado:String,
    dueno:String
})
Reservaproducto.plugin(require('mongoose-autopopulate'));
module.exports = mongose.model("Reservas",Reservaproducto)