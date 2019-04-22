"use strict"
var mongose = require("mongoose");
var Schema = mongose.Schema;
var Rol= require("./rol").schema;
var UsuarioSchema = Schema({
nombre:String,
apellidos:String,
ci:String,
rol:Rol,
genero:String,
telefono:String,
email:String,
foto:String,
suspendido:{estado: { type: Boolean, default:false },razon:String,duracion:Number,fecha:Date},
login:{usuario:String,password:String,estado:Boolean},
eliminado:{estado:Boolean,razon:String},
creacion: {usuario:{type: Schema.ObjectId, ref: "Usuarios"},fecha:Date },
modificacion:{fecha:Date,usuario:{ type: Schema.ObjectId, ref: "Usuarios" }},
tokenrecuperacion:{token:String,fecha:Date,vencimiento:Date}
})

module.exports = mongose.model("Usuarios", UsuarioSchema)