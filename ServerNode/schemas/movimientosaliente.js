"use strict"
var mongose = require("mongoose");
var Schema = mongose.Schema;
var MovimientosalienteSchema = Schema({
     fecha:Date,
     monto:Number,
     usuario:{type: Schema.ObjectId, ref: "Usuarios"}
})

module.exports = mongose.model("Movimientosaliente", MovimientosalienteSchema)