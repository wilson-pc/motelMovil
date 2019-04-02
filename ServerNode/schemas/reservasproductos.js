"use strict"
var mongose = require("mongoose");
var Schema = mongose.Schema;
var Producto=require("./producto").schema;
var Reservaproducto = Schema({
    cliente:{type: Schema.ObjectId, ref: "Usuarios",autopopulate: true},
    negocio:{type: Schema.ObjectId, ref: "Negocios",autopopulate: true},
    tiempo:{fechareserva:Date,fechalimite:Date},
    producto:{type: Schema.ObjectId, ref: "Productos",autopopulate: true},
    precioactual:Number,
    cantidad:Number,
    fechaentrega:Date,
    estado:String,
    dueno:String
})

module.exports = mongose.model("Reservas",Reservaproducto)