"use strict"
var mongose = require("mongoose");
var Schema = mongose.Schema;
var TiempoReservadoproductoSchema = Schema({
fechaInicio:String,
tiempo:String,
concretada:Boolean,
descripcion:String,
producto:{type: Schema.ObjectId, ref: "Productos"},
})

module.exports = mongose.model("Tiemporeservadoproductos", TiempoReservadoproductoSchema)