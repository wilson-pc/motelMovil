"use strict"
var app = require("./app");
var mongoose = require("mongoose");
var http = require('http').Server(app);
var io = require('socket.io')(http);
var log4js = require('log4js');
log4js.configure({
    appenders: { cheese: { type: 'file', filename: 'logs/index.log' } },
    categories: { default: { appenders: ['index'], level: 'error' } }
  });
const logger = log4js.getLogger('index');
//
const host = '0.0.0.0';
const port = process.env.PORT || 3000;
//
var productos = io.of('/productos');
var negocios=io.of('/negocios');
var usuarios=io.of('/usuarios');
var home=io.of('/home');
var habitacion=io('/habitacion');
var comportamiento=io('/comportamiento')

var UseProductos =require('./controllers/productosController')(productos);
var UseUsuarios =require('./controllers/usuariosController')(usuarios);
var UseNegocios =require('./controllers/NegocioController')(negocios);
var useHome=require('./controllers/homeController')(home);
var UseHabitacion=require('./controllers/habitacionController')(habitacion);
var useComportamineto=require('./controllers/ComportamientoController')(comportamiento);

mongoose.connect('mongodb://root:toor123@ds161104.mlab.com:61104/triservicesapp',{ useNewUrlParser: true },(error, respuesta) => {
 //   mongoose.connect('mongodb://127.0.0.1:27017/Node', (error, respuesta) => {
        if (error) {
         
            logger.fatal('no se pudo conectar a la base de datos,revise la conexion al servidor',error);
            throw error;
        } else {
            console.log("correcta");
            //lanzar el servior
            http.listen(port,host, function(){
              console.log('listening on *:3000');
            });
        }
    });