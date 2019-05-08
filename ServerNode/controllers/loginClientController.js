"use strict"
var nodemailer = require('nodemailer');
var Usuario = require('../schemas/usuario');
var Crypto = require("../variables/desincryptar");
var moment = require("moment");
var Rol = require('../schemas/rol');
const bcrypt = require('bcrypt-nodejs');
var token = require("./../token/token");

module.exports = async function (io) {
  var clients = [];
  io.on('connection', async function (socket) {
  
    socket.on('login-facebook', async (data) => {

      try {
        var datos = await Crypto.Desincryptar(data);

        if (!datos.error) {

          var login = { usuario: datos.usuario.nombre, estado: true }
          var params = datos.usuario;

          var login = { estado: true }
          var usuario = await Usuario.findOneAndUpdate({ email: params.email }, { login: login }, { new: true });

          if (!usuario) {
            var usuarios = new Usuario();
            usuarios.nombre = params.nombre;
            usuarios.apellidos = params.apellidos;
            usuarios.genero = params.genero;
            usuarios.email = params.email;
            usuarios.foto = params.foto;
            usuarios.tiporegistro = params.tiporegistro;
            usuarios.eliminado = { estado: false, razon: "" };
            usuarios.creacion = params.creacion
            usuarios.login = { usuario: params.nombre, estado: true }
            usuarios.modificacion = params.modificacion;
            usuarios.rol = await Rol.findById(params.rol);

            usuarios.save((error, usuario2) => {
              if (error) {
                io.to(socket.id).emit('respuesta-login-facebook', { error: "error no se pudo guardar el registro" });
                //    res.status(500).send({ mensaje: "error al guradar" })
              } else {
              
                io.to(socket.id).emit('respuesta-login-facebook', { token: token.crearToken(usuario2), datos: usuario2 });
                //        io.emit('respuesta-actualizar-negocio-todos',{datos:actualizado});  

              }
            })
          } else {
           
            io.to(socket.id).emit('respuesta-login-facebook', { token: token.crearToken(usuario), datos: usuario });
          }


        }
        return data;
      }

      catch (e) {
        console.log(e);
      }
    });


    socket.on('login-googlepus', async (data) => {
   
      try {
        var datos = await Crypto.Desincryptar(data);
        
        if (!datos.error) {

          var login = { usuario: datos.usuario.nombre, estado: true }
          var params = datos.usuario;

          var login = { estado: true }
          var usuario = await Usuario.findOneAndUpdate({ email: params.email }, { login: login }, { new: true });

          if (!usuario) {
            var usuarios = new Usuario();
            usuarios.nombre = params.nombre;
            usuarios.apellidos = params.apellidos;
            usuarios.genero = params.genero;
            usuarios.tiporegistro = params.tiporegistro;
            usuarios.email = params.email;
            usuarios.foto = params.foto;
            usuarios.eliminado = { estado: false, razon: "" };
            usuarios.creacion = params.creacion
            usuarios.login = { usuario: params.nombre, estado: true }
            usuarios.modificacion = params.modificacion;
            usuarios.rol = await Rol.findById(params.rol);

            usuarios.save((error, usuario2) => {
              if (error) {
                io.to(socket.id).emit('respuesta-login-googlepus', { error: "error no se pudo guardar el registro" });
                //    res.status(500).send({ mensaje: "error al guradar" })
              } else {
               
                io.to(socket.id).emit('respuesta-login-googlepus', { token: token.crearToken(usuario2), datos: usuario2 });
                //        io.emit('respuesta-actualizar-negocio-todos',{datos:actualizado});  

              }
            })
          } else {
            
            io.to(socket.id).emit('respuesta-login-googlepus', { token: token.crearToken(usuario), datos: usuario });
          }


        }
        return data;
      }

      catch (e) {
        console.log(e);
      }
    });

    socket.on('verificar-suspencion', async (data) => {
      
      Usuario.findById(data.id,{login:0,foto:0},(error,datos)=>{
        if (error) {
        
        }else if(datos.suspendido){
               if(datos.suspendido.estado==true){
                io.to(socket.id).emit('respuesta-verificar-suspencion', { error: "false" });
               }
        } else {
        //  io.to(socket.id).emit('respuesta-calificar-negocio', { datos: actualizado });
          //        io.emit('respuesta-actualizar-negocio-todos',{datos:actualizado});  

        }
      });
    });
    socket.on('calificar-negocio', async (data) => {
      try {
        var datos = await Crypto.Desincryptar(data);
        if (!datos.error) {
          var cliente = datos.idcliente;
          var negocio = datos.idnegocio;
          var calificacion = { usuario: cliente, fecha: datos.fecha, puntuacion: datos.puntuacion }
          await Usuario.update({ _id: negocio }, { $pull: { 'calificacion.usuario': cliente } });
          Negocio.findOneAndUpdate({ _id: negocio }, { $push: { calificacion: calificacion } }, { new: true }, (error, actualizado) => {
            if (error) {
              io.to(socket.id).emit('respuesta-calificar-negocio', { error: "error al calificar" });
              //    res.status(500).send({ mensaje: "error al guradar" })
            } else {
              io.to(socket.id).emit('respuesta-calificar-negocio', { datos: actualizado });
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

    socket.on('actualizar-usuario-cliente', async (data) => {

      try {
        var datos = await Crypto.Desincryptar(data);
        if (!datos.error) {
          var usuario = new Usuario();
          var params = datos.usuario;
          usuario._id = params._id;
          usuario.nombre = params.nombre;
          usuario.apellidos = params.apellidos;
          usuario.email = params.email;
          //usuario.login = params.login;
          usuario.foto = params.foto;
          usuario.modificacion = params.modificacion;
          
          //guarda al nuevo usuario en la bd

          Usuario.findByIdAndUpdate(params._id, usuario, { new: true }, async (error, actualizado) => {
            if (error) {
              io.to(socket.id).emit('respuesta-actualizar-usuario-cliente', { mensaje: "error al canbiar datos" });
              // res.status(500).send({ mensaje: "error al guradar" })
            } else {

              
              io.to(socket.id).emit('respuesta-actualizar-usuario-cliente', actualizado);

              //  io.emit('respuesta-actualizar-usuario-todos', actualizado);
            }
          })

        }
        else {
          io.to(socket.id).emit('respuesta-actualizar-usuario-cliente', { mensaje: "error al actualizar datos de usuario usuario" });
        }
      } catch (e) {
        console.log(e);
      }

      //console.log(req.body);
    });


    socket.on('login-usuario-clientes', async (data) => {
      // console.log("jntrnrkmrktmkrlbm{kl mmklmlk n ntj");
      try {
        var datos = await Crypto.Desincryptar(data);
        
        if (!datos.error) {
 
          var params = datos;
          var usuario = params.usuario;
          var pass = params.password;
          var tipo = params.tipo;

          Usuario.findOne({ 'login.usuario': usuario, 'rol.rol': tipo },async (error, user) => {

            if (error) {
              io.to(socket.id).emit('respuesta-login', { mensaje: "error al buscar" });
              //  res.status(500).send({ mensaje: "Error al buscar usuario" })
            } else {

              if (user == null) {
                io.to(socket.id).emit('respuesta-login', { mensaje: "usuario no exsite" });
                //alert("Usuario o Contraseña incorrecta");
                //    res.status(404).send({ mensaje: "usuario no existe " })
              } else {

                // res.status(200).send({ user });
                if (user.login.estado != true) {
                  if (user.suspendido.estado == false) {
                    var usuario = new Usuario();
                    usuario._id = user._id;
                    usuario.login = { usuario: user.login.usuario, password: user.login.password, estado: true }

                    bcrypt.compare(pass, user.login.password, function (error, ok) {

                      if (ok) {

                        Usuario.findByIdAndUpdate(user._id, usuario, { new: true }, function (error, lista) {

                          io.to(socket.id).emit('respuesta-login', { token: token.crearToken(user), datos: user });
                          //  res.status(200).send({ token: token.crearToken(user), datos:user });
                        });

                      }
                      else {
                        io.to(socket.id).emit('respuesta-login', { mensaje: "error usuario y contraseñ incorrecta" });
                        //  res.status(404).send({ mensaje: "usuario o contraseña incorrectas " })
                      }
                    });
                  } else {
                    var fecha = moment(user.suspendido.fecha, "DD-MM-YYYY").add(user.suspendido.duracion, 'days').toISOString();
                   
                    if (new Date().toISOString() >= fecha) {


                    var usuario = new Usuario();
                    usuario._id = user._id;
                    usuario.suspendido = {estado:false};
                    usuario.login = { usuario: user.login.usuario, password: user.login.password, estado: true }

                    bcrypt.compare(pass, user.login.password,  function (error, ok){

                      if (ok) {

  
                     //  await Usuario.findByIdAndUpdate(params._id, nusuario);
                        Usuario.findByIdAndUpdate(user._id, usuario, { new: true }, function (error, lista) {

                          io.to(socket.id).emit('respuesta-login', { token: token.crearToken(user), datos: user });
                          //  res.status(200).send({ token: token.crearToken(user), datos:user });
                        });

                      }
                      else {
                        io.to(socket.id).emit('respuesta-login', { mensaje: "error usuario y contraseñ incorrecta" });
                        //  res.status(404).send({ mensaje: "usuario o contraseña incorrectas " })
                      }
                    });
                    } else {
                      io.to(socket.id).emit('respuesta-login', { mensaje: "su cuenta a sido suspendido por " + user.suspendido.duracion + " dias por " + user.suspendido.razon });
                    }

                  }

                } else {

                  io.to(socket.id).emit('respuesta-login', { mensaje: "Ocurrio un error" });
                  //res.status(401).send({ mensaje: "Usuario activo actualmente" })
                }
              }
            }
          });

        }
        return data;
      } catch (e) {
        console.log(e);
      }
    })

  });
}