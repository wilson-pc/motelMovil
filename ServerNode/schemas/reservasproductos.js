"use strict"
var mongose = require("mongoose");
var Schema = mongose.Schema;
var Producto=require("./producto").schema;
var Reservaproducto = Schema({
    cliente:{type: Schema.ObjectId, ref: "Usuarios"},
    negocio:{type: Schema.ObjectId, ref: "Negocios"},
    tiempo:{type: Schema.ObjectId, ref: "Tiemporeservado"},
    producto:Producto
})

module.exports = mongose.model("Tiemporeservadoproductos",Reservaproducto)