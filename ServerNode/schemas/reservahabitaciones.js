"use strict"
var mongose = require("mongoose");
var Schema = mongose.Schema;
var Habitacion=require("./habitacion").schema;
var ReservahabitacionSchema = Schema({
    cliente:{type: Schema.ObjectId, ref: "Usuarios"},
    negocio:{type: Schema.ObjectId, ref: "Negocios"},
    tiempo:{type: Schema.ObjectId, ref: "Tiemporeservado"},
     habitacion:Habitacion
})

module.exports = mongose.model("Reservahabitacion",ReservahabitacionSchema)