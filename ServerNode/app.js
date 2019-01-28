"use strict"
var express = require("express");
var app = express();
var path = require('path');
// middleware para permitir o denegar acceso a pagias usar la API
app.use(function (req, res, next) {

    // Sitio web que desea permitir que se conecte
    //http://localhost:8101
    var allowedOrigins = ['http://192.168.1.3:8100','http://localhost:8100', 'http://localhost:8200','http://localhost:8080','http://localhost:8101'];
    // Sitio web que desea permitir que se conecte
    var host = req.get("origin");

    if(host !=undefined){
    allowedOrigins.forEach(function(val, key){
        if (host.indexOf(val) > -1){
            res.setHeader('Access-Control-Allow-Origin', host);
        }
      })}
      else{
        res.setHeader('Access-Control-Allow-Origin', "http://localhost:8100");
      }

    //Solicite los métodos que desea permitir
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Solicitar encabezados que desees permitir
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pase a la siguiente capa de middleware
    next();
});
app.use(express.static(path.join(__dirname, 'views')));
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'views/index.html'));
  //  app.use(express.static(path.join(__dirname, 'dist')));
  });

module.exports = app;