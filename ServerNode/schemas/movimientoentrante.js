"use strict"
var mongose = require("mongoose");
var Schema = mongose.Schema;
var MovimientoentranteSchema = Schema({
     fecha:Date,
     monto:Number,
     usuario:{type: Schema.ObjectId, ref: "Usuarios"},
     producto:{type: Schema.ObjectId, ref: "Productos"}
})

module.exports = mongose.model("Movimientoentrante", MovimientoentranteSchema)