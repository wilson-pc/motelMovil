"use strict"
var mongose = require("mongoose");
var Schema = mongose.Schema;
var Tipo=require("./tipo").schema;
var calificacion=require("./calificacion").schema;
<<<<<<< HEAD
=======
var mongooseAggregatePaginate = require('mongoose-aggregate-paginate');
>>>>>>> 26b9e961e9b4217b073c44c68b0cc980e6f27982
var ProductoSchema = Schema({
nombre:String,
negocio:{type: Schema.ObjectId, ref: "Negocios"},
precio:Number,
precioReserva:Number,
cantidad:Number,
valoracion:[{usuario:{type: Schema.ObjectId, ref: "Usuarios"},fecha:Date }],
desvaloracion:[{usuario:{type: Schema.ObjectId, ref: "Usuarios"},fecha:Date }],
denuncias:[{usuario:{type: Schema.ObjectId, ref: "Usuarios"},fecha:Date,detalle:String }],
reportes:Number,
tipo:Tipo,
foto:{normal:String,miniatura:String},
descripcion:String,
eliminado:{estado:Boolean,razon:String},
creacion: {fecha:String },
modificacion:{fecha:String}
})
ProductoSchema.plugin(mongooseAggregatePaginate);
module.exports = mongose.model("Productos", ProductoSchema)