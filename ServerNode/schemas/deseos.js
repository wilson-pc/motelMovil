"use strict"
var mongose = require("mongoose");
var Schema = mongose.Schema;
var DeseoSchema = Schema({
producto:{type: Schema.ObjectId, ref: "Productos"},
tipo:String,
usuario:String,
//fecha:Date
})
//FavoritoSchema.plugin(require('mongoose-autopopulate'));;
module.exports = mongose.model("Deseos", DeseoSchema)