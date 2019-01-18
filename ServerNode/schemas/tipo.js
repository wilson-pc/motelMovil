"use strict"
var mongose = require("mongoose");
var Schema = mongose.Schema;
var TipoSchema = Schema({
nombre:String,
})

module.exports = mongose.model("Tipos", TipoSchema)