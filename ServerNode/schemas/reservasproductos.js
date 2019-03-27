"use strict"
var mongose = require("mongoose");
var Schema = mongose.Schema;
var Producto=require("./producto").schema;
var Reservaproducto = Schema({
<<<<<<< HEAD
    cliente:{type: Schema.ObjectId, ref: "Usuarios",autopopulate: true},
    negocio:{type: Schema.ObjectId, ref: "Negocios",autopopulate: true},
    tiempo:{fechareserva:Date,fechalimite:Date},
    producto:{type: Schema.ObjectId, ref: "Productos",autopopulate: true},
    precioactual:Number,
    cantidad:Number,
    fechaentrega:Date,
    estado:String,
    dueno:String
=======
    cliente:{type: Schema.ObjectId, ref: "Usuarios"},
    negocio:{type: Schema.ObjectId, ref: "Negocios"},
    tiempo:{type: Schema.ObjectId, ref: "Tiemporeservado"},
    producto:Producto,
    estado:String,
>>>>>>> parent of 68945d6... Solucion de mergeen ClienteAdminIonic
})

module.exports = mongose.model("Tiemporeservadoproductos",Reservaproducto)