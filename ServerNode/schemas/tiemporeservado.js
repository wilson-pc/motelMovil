"use strict"
var mongose = require("mongoose");
var Schema = mongose.Schema;
var TiempoReservadoSchema = Schema({
fechaInicio:String,
tiempo:String,
concretada:Boolean,
descripcion:String,
habitacion:{type: Schema.ObjectId, ref: "Negocios"},
})

module.exports = mongose.model("Tiemporeservado", TiempoReservadoSchema)