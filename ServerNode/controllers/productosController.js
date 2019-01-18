"use strict"
var CryptoJS = require("crypto-js");
var Usuario = require("../schemas/usuario");
var clave=require("./../variables/claveCrypto");

module.exports = async function(io) {
var clients = [];
  io.on('connection', async function (socket) {
    console.log("tngourtoigyjhij");
   // var host=socket.handshake.headers.host;
    clients.push(socket.id);
    console.log("alguien se conecto");

    socket.on('registrar-usuario',async (data) => {

      try {
        const bytes = CryptoJS.AES.decrypt(data, clave.clave);
        if (bytes.toString()) {
          datos = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
          var usuario = new Usuario();
          var params = datos.usuario;
          usuario.nombre=params.nombre;
          usuario.apellido = params.apellido;
          usuario.ci=params.ci;
          usuario.telefono=params.telefono;
          usuario.email=params.email;
          usuario.login=params.login;
          usuario.eliminado=params.eliminado;
          usuario.creacion=params.creacion
          usuario.modificacion=params.modificacion;
          usuario.rol=await Rol.findById(params.rol);
          if (params.ci) {
              //encripta el pasword del usuario
              bcript.hash(login.password, null, null, function(error, hash) {
                  login.password=hash;
                  usuario.login=login
                  if (login.usuario != null) {
                      //guarda al nuevo usuario en la bd
                  
                      usuario.save((error, nuevoUsuario) => {
                          if (error) {
                  
                              res.status(500).send({ mensaje: "error al guradar" })
                          } else {
                            io.emit('respuesta',nuevoUsuario);  
                          }
                      })
                  }
      
            });
          } 
        }
        return data;
      } catch (e) {
        console.log(e);
      }
      
    //console.log(req.body);
   
     
      
    });

    
      socket.on('registrar-tienda', async (data) => {
     
        io.emit('respuesta', {user: socket.nickname, event: 'left'});   
      });

      socket.on('registrar-producto', async (data) => {
     
        io.emit('respuesta', {user: socket.nickname, event: 'left'});   
      });
     
})


};
