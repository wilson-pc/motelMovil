"use strict"
var mongose = require("mongoose");
var Schema = mongose.Schema;
var BilleteraSchema = Schema({
saldo:Number,
usuario:{type: Schema.ObjectId, ref: "Usuarios"}
})

module.exports = mongose.model("Billeteras", BilleteraSchema)