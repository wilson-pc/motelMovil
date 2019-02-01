"use strict"
var mongose = require("mongoose");
var Schema = mongose.Schema;
var TipoSchema = Schema({
    tiponegocio: String,
    tipo: String,
    nombre:String,
})

module.exports = mongose.model("Tipos", TipoSchema)