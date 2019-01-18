"use strict"
var mongose = require("mongoose");
var Schema = mongose.Schema;
var Rol= require("./rol").schema;
var UsuarioSchema = Schema({
nombre:String,
apellido:String,
ci:String,
rol:Rol,
genero:String,
telefono:String,
email:String,
login:{usuario:String,password:String},
eliminado:{estado:Boolean,razon:String},
creacion: {usuario:{type: Schema.ObjectId, ref: "Usuarios"},fecha:Date },
modificacion:{fecha:Date,usuario:{ type: Schema.ObjectId, ref: "Usuarios" }}
})

module.exports = mongose.model("Usuarios", UsuarioSchema)