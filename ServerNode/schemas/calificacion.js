"use strict"
var mongose = require("mongoose");
var Schema = mongose.Schema;
var CalificacionSchema = Schema({
negocio:{type: Schema.ObjectId, ref: "Negocios"},
usuario:{type: Schema.ObjectId, ref: "Usuarios"},
calificacion:Number,
fecha:Date
})

module.exports = mongose.model("Calificaciones", CalificacionSchema)