"use strict"
var nodemailer = require('nodemailer');
var Usuario=require('../schemas/usuario');
var Crypto = require("../variables/desincryptar");
var Rol = require('../schemas/rol');
var token = require("./../token/token");
module.exports = async function (io) {
    var clients = [];
    io.on('connection', async function (socket) {
        console.log("hola desde ionic 2");
        socket.on('login-facebook', async (data) => {
            
            try {
                var datos = await Crypto.Desincryptar(data);
              
                if (!datos.error) {
                  
                    var login={usuario:datos.usuario.nombre,estado:true}
                  var params=datos.usuario;
                 
                  var login={estado:true}
                   var usuario = await Usuario.findOneAndUpdate({email:params.email},{login:login},{new:true});
                   
                    if(!usuario){
                       var usuarios=new Usuario();
                        usuarios.nombre = params.nombre;
                        usuarios.apellidos = params.apellidos;
                        usuarios.genero = params.genero;
                        usuarios.email = params.email;
                        usuarios.foto = params.foto;
                        usuarios.eliminado = { estado: false, razon: "" };
                        usuarios.creacion = params.creacion
                        usuarios.login={usuario:params.nombre,estado:true}
                        usuarios.modificacion = params.modificacion;
                        usuarios.rol = await Rol.findById(params.rol);
                        
                        usuarios.save((error, usuario2) => {
                            if (error) {
                              io.to(socket.id).emit('respuesta-login-facebook',{error: "error no se pudo guardar el registro"});
                            //    res.status(500).send({ mensaje: "error al guradar" })
                            } else {
                                console.log("nuevo");
                              io.to(socket.id).emit('respuesta-login-facebook',{token: token.crearToken(usuario2),datos:usuario2});  
                      //        io.emit('respuesta-actualizar-negocio-todos',{datos:actualizado});  
                              
                            }
                        })
                    }else{
                        console.log("actualizao");
                        io.to(socket.id).emit('respuesta-login-facebook',{token: token.crearToken(usuario),datos:usuario});  
                    }

               
            }
            return data;
            }
            
            catch (e) {
              console.log(e);
            }
          });


          socket.on('login-googlepus', async (data) => {
            console.log("llega");
            try {
                var datos = await Crypto.Desincryptar(data);
              console.log(datos);
                if (!datos.error) {
                  
                    var login={usuario:datos.usuario.nombre,estado:true}
                  var params=datos.usuario;
                 
                  var login={estado:true}
                   var usuario = await Usuario.findOneAndUpdate({email:params.email},{login:login},{new:true});
                   
                    if(!usuario){
                       var usuarios=new Usuario();
                        usuarios.nombre = params.nombre;
                        usuarios.apellidos = params.apellidos;
                        usuarios.genero = params.genero;
                        usuarios.email = params.email;
                        usuarios.foto = params.foto;
                        usuarios.eliminado = { estado: false, razon: "" };
                        usuarios.creacion = params.creacion
                        usuarios.login={usuario:params.nombre,estado:true}
                        usuarios.modificacion = params.modificacion;
                        usuarios.rol = await Rol.findById(params.rol);
                        
                        usuarios.save((error, usuario2) => {
                            if (error) {
                              io.to(socket.id).emit('respuesta-login-googlepus',{error: "error no se pudo guardar el registro"});
                            //    res.status(500).send({ mensaje: "error al guradar" })
                            } else {
                                console.log("nuevo");
                              io.to(socket.id).emit('respuesta-login-googlepus',{token: token.crearToken(usuario2),datos:usuario2});  
                      //        io.emit('respuesta-actualizar-negocio-todos',{datos:actualizado});  
                              
                            }
                        })
                    }else{
                        console.log("actualizao");
                        io.to(socket.id).emit('respuesta-login-googlepus',{token: token.crearToken(usuario),datos:usuario});  
                    }

               
            }
            return data;
            }
            
            catch (e) {
              console.log(e);
            }
          });

          socket.on('calificar-negocio', async (data) => {
            try {
                var datos = await Crypto.Desincryptar(data);
                if (!datos.error) {
                    var cliente=datos.idcliente;
                    var negocio=datos.idnegocio;
                    var calificacion={usuario:cliente,fecha:datos.fecha,puntuacion:datos.puntuacion}
                    await Usuario.update({_id:negocio},{ $pull: { 'calificacion.usuario': cliente } });
                    Negocio.findOneAndUpdate({_id:negocio}, { $push: { calificacion: calificacion } },{new: true},(error, actualizado) => {
                        if (error) {
                          io.to(socket.id).emit('respuesta-calificar-negocio',{error: "error al calificar"});
                        //    res.status(500).send({ mensaje: "error al guradar" })
                        } else {
                          io.to(socket.id).emit('respuesta-calificar-negocio',{datos:actualizado});  
                  //        io.emit('respuesta-actualizar-negocio-todos',{datos:actualizado});  
                          
                        }
                    })
               
            }
            return data;
            }
            
            catch (e) {
              console.log(e);
            }
          });

          socket.on('descalificar-usuario', async (data) => {
            try {
                var datos = await Crypto.Desincryptar(data);
                if (!datos.error) {
                    var cliente=datos.idcliente;
                    var usuario=datos.idproducto;
                    var valoracion={usuario:cliente,fecha:datos.fecha}
                    await Usuario.update({_id:usuario},{ $pull: { 'valoracion.usuario': cliente } });
                    Usuario.findOneAndUpdate({_id:usuario}, { $push: { desvaloracion: valoracion } },{new: true},(error, actualizado) => {
                        if (error) {
                          io.to(socket.id).emit('respuesta-descalificar-usuario',{error: "error al guradar nuevos datos"});
                        //    res.status(500).send({ mensaje: "error al guradar" })
                        } else {
                          io.to(socket.id).emit('respuesta-descalificar-usuario',{datos:actualizado});  
                        //  io.emit('respuesta-actualizar-negocio-todos',{datos:actualizado});  
                          
                        }
                    })

               
            }
            return data;
            }
            
            catch (e) {
              console.log(e);
            }
          });
    });
}