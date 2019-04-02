"use strict"
var mongose = require("mongoose");
var Schema = mongose.Schema;
var FavoritoSchema = Schema({
producto:{type: Schema.ObjectId, ref: "Productos",autopopulate: true},
usuario:String,
fecha:Date
})
FavoritoSchema.plugin(require('mongoose-autopopulate'));;
module.exports = mongose.model("Favoritoa", FavoritoSchema)