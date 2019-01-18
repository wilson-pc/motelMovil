"use strict"
var mongose = require("mongoose");
var Schema = mongose.Schema;
var TipoNegocioSchema = Schema({
nombre:String,
})

module.exports = mongose.model("Tiponegocios", TipoNegocioSchema)