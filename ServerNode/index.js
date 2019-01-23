"use strict"
var app = require("./app");
var mongoose = require("mongoose");
var http = require('http').Server(app);
var io = require('socket.io')(http);
const host = '0.0.0.0';
const port = process.env.PORT || 3000;
var productos = io.of('/productos');
var negocios=io.of('/negocios');
var usuarios=io.of('/usuarios');
let UseProductos =require('./controllers/productosController')(productos);
let UseUsuarios =require('./controllers/usuariosController')(usuarios);
mongoose.connect('mongodb://root:toor123@ds161104.mlab.com:61104/triservicesapp',{ useNewUrlParser: true },(error, respuesta) => {
 //   mongoose.connect('mongodb://127.0.0.1:27017/Node', (error, respuesta) => {
        if (error) {
            throw error;
        } else {
            console.log("correcta");
            //lanzar el servior
            http.listen(port,host, function(){
              console.log('listening on *:3000');
            });
        }
    });