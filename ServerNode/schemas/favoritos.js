"use strict"
var mongose = require("mongoose");
var Schema = mongose.Schema;
var FavoritoSchema = Schema({
producto:{type: Schema.ObjectId, ref: "Productos",autopopulate: true},
tipo:String,
usuario:String,
//fecha:Date
})
FavoritoSchema.plugin(require('mongoose-autopopulate'));;
module.exports = mongose.model("Favoritos", FavoritoSchema)