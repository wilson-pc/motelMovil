"use strict"
var mongose = require("mongoose");
var Schema = mongose.Schema;
var RolSchema = Schema({
rol:String,
})

module.exports = mongose.model("Roles", RolSchema)