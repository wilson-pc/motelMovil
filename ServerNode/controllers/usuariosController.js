"use strict"
var CryptoJS = require("crypto-js");
var Usuario = require("../schemas/usuario");
var clave = require("./../variables/claveCrypto");
var Rol = require("./../schemas/rol");
var token = require("./../token/token");
const bcrypt = require('bcrypt-nodejs');
module.exports = async function (io) {
  var clients = [];
  io.on('connection', async function (socket) {

    // var host=socket.handshake.headers.host;

    clients.push(socket.id);
    console.log("alguien se conecto");

    socket.on('registrar-usuario', async (data) => {
      // console.log("entra entra");
      // console.log(data);
      // var rol = new Rol();
      // rol.rol="Cliente";
      // rol.save((error,nuevo)=>{
      //     console.log(nuevo);
      // });

      try {
        const bytes = CryptoJS.AES.decrypt(data, clave.clave);
        if (bytes.toString()) {
          var datos = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
          console.log(datos);
          var usuario = new Usuario();
          var params = datos.usuario;
          usuario.nombre = params.nombre;
          usuario.apellido = params.apellido;
          usuario.ci = params.ci;
          usuario.telefono = params.telefono;
          usuario.email = params.email;
          usuario.login = params.login;
          usuario.foto = params.foto;
          usuario.eliminado = { estado: false, razon: "" };
          usuario.creacion = params.creacion
          usuario.modificacion = params.modificacion;
          usuario.rol = await Rol.findById(params.rol);
          if (params.ci) {
            //encripta el pasword del usuario
            bcrypt.hash(usuario.login.password, null, null, function (error, hash) {
              usuario.login.password = hash;

              if (usuario.login.usuario != null) {
                //guarda al nuevo usuario en la bd

                usuario.save((error, nuevoUsuario) => {
                  if (error) {

                    console.log(error);
                  } else {
                    console.log(nuevoUsuario);
                    io.emit('respuesta-crear', {usuario:nuevoUsuario});
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


    socket.on('actualizar-usuario', async (data) => {

      try {
        const bytes = CryptoJS.AES.decrypt(data, clave.clave);
        if (bytes.toString()) {
          var datos = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
          var usuario = new Usuario();
          var params = datos.usuario;
          usuario._id = params._id;
          usuario.nombre = params.nombre;
          usuario.apellido = params.apellido;
          usuario.ci = params.ci;
          usuario.telefono = params.telefono;
          usuario.email = params.email;
          usuario.login = params.login;
          usuario.foto = par.foto;
          usuario.modificacion = params.modificacion;

          //guarda al nuevo usuario en la bd

          Usuario.findByIdAndUpdate(params.id, usuario, { new: true }, (error, actualizado) => {
            if (error) {

              // res.status(500).send({ mensaje: "error al guradar" })
            } else {
              io.emit('respuesta', actualizado);
            }
          })

        }
        else {

        }
      } catch (e) {
        console.log(e);
      }

      //console.log(req.body);
    });

    socket.on('eliminar-usuario', async (data) => {

      try {
        const bytes = CryptoJS.AES.decrypt(data, clave.clave);
        if (bytes.toString()) {
          var datos = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
          var usuario = new Usuario();
          var params = datos.usuario;
          usuario._id = params._id;
          usuario.eliminado = { estado: true, razon: params.razon },
            //guarda al nuevo usuario en la bd

            Usuario.findByIdAndUpdate(params.id, usuario, { new: true }, (error, actualizado) => {
              if (error) {

                // res.status(500).send({ mensaje: "error al guradar" })
              } else {
                io.emit('respuesta', actualizado);
              }
            })

        }
        else {

        }
      } catch (e) {
        console.log(e);
      }

    });

    socket.on('listar-usuario', async (data) => {
      console.log("f34f3g4");
      Usuario.find({"rol.rol":"Admin","eliminado.estado": false }, function (error, lista) {
        if (error) {
          // res.status(500).send({ mensaje: "Error al listar" })
        } else {
          if (!lista) {
            //   res.status(404).send({ mensaje: "Error al listar" })
          } else {
            console.log(lista);
            io.emit('respuesta-listado', lista);
          }
        }
      });
    });


    socket.on('sacar-usuario', async (data) => {
      try {
        const bytes = CryptoJS.AES.decrypt(data, clave.clave);
        if (bytes.toString()) {
          var datos = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));


          Usuario.findOne({ _id: datos.id, "eliminado.estado": false }, function (error, dato) {
            if (error) {
              // res.status(500).send({ mensaje: "Error al listar" })
            } else {
              if (!lista) {
                //   res.status(404).send({ mensaje: "Error al listar" })
              } else {
                io.emit('respuesta', dato);

              }
            }
          });

        }
        return data;
      } catch (e) {
        console.log(e);
      }

    });
    socket.on('buscar-usuario', async (data) => {
      try {
        const bytes = CryptoJS.AES.decrypt(data, clave.clave);
        if (bytes.toString()) {
          var datos = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));


          Usuario.find({ "eliminado.estado": false, nombre: datos.termino, apellido: datos.termino }, function (error, lista) {
            if (error) {
              // res.status(500).send({ mensaje: "Error al listar" })
            } else {
              if (!lista) {
                //   res.status(404).send({ mensaje: "Error al listar" })
              } else {
                io.emit('respuesta', lista);
              }
            }
          });

        }
        return data;
      } catch (e) {
        console.log(e);
      }

    });

    socket.on('login-usuario', async (data) => {
      // console.log("jntrnrkmrktmkrlbm{kl mmklmlk n ntj");
      try {
        const bytes = CryptoJS.AES.decrypt(data, clave.clave);
        if (bytes.toString()) {
          var datos = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
          //  console.log(datos);

          var params = datos;
          var usuario = params.usuario;
          var pass = params.password;

          Usuario.findOne({'login.usuario': usuario }, (error, user) => {

            if (error) {
              io.emit('respuesta-login', { mensaje: "error al buscar" });
              //  res.status(500).send({ mensaje: "Error al buscar usuario" })
            } else {

              if (user == null) {
                io.emit('respuesta-login', { mensaje: "usuario no exite" });
                //alert("Usuario o Contraseña incorrecta");
                //    res.status(404).send({ mensaje: "usuario no existe " })
              } else {

                // res.status(200).send({ user });
                if (user.login.estado != true) {
                  var usuario = new Usuario();
                  usuario._id = user._id;
                  usuario.login = { usuario: user.login.usuario, password: user.login.password, estado: true }

                  bcrypt.compare(pass, user.login.password, function (error, ok) {
                    console.log(ok);
                    if (ok) {

                      Usuario.findByIdAndUpdate(user._id, usuario, { new: true }, function (error, lista) {

                        io.emit('respuesta-login', { token: token.crearToken(user), datos: user });
                        //  res.status(200).send({ token: token.crearToken(user), datos:user });
                      });


                    }
                    else {
                      io.emit('respuesta-login', { mensaje: "error usuario y contraseñ incorrecta" });
                      //  res.status(404).send({ mensaje: "usuario o contraseña incorrectas " })
                    }
                  });

                } else {
                  io.emit('respuesta-login', { mensaje: "error xxxxxxxxx" });
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


    socket.on('cerrar-secion', async (data) => {
      
      try {
        const bytes = CryptoJS.AES.decrypt(data, clave.clave);
        if (bytes.toString()) {
          var datos = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
        
          var usuario2 = await Usuario.findById(datos.id);
          var usuario = new Usuario();
          usuario._id = datos.id;
          usuario.login = { usuario: usuario2.login.usuario, password: usuario2.login.password, estado: false };
          console.log(usuario);
         // console.log(lista);
          Usuario.findByIdAndUpdate(datos.id, usuario, { new: true }, function (error, lista) {

            if (error) {
              io.emit('respuesta-cerrar', { mensaje:false});
            //  res.status(500).send({ mensaje: "Error desconocido" })
            } else {
              if (!lista) {
                io.emit('respuesta-cerrar', { mensaje:false});
              //  res.status(404).send({ mensaje: "Error no se  pudo cerrar secion" })
              } else {
                io.emit('respuesta-cerrar', { mensaje:true});
              }
            }
          });

        }
        return data;
      } catch (e) {
        console.log(e);
      }

    });
  })


};
