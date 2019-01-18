"use strict"
var mongose = require("mongoose");
var Schema = mongose.Schema;
var VisitanteSchema = Schema({
negocio:{type: Schema.ObjectId, ref: "Negocios"},
tiponegocio:{type: Schema.ObjectId, ref: "Tiponegocios"},
visitante:{type: Schema.ObjectId, ref: "Usuarios"},
fecha:Date
})

module.exports = mongose.model("Vistantes", VisitanteSchema)