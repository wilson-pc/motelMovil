"use strict"
var CryptoJS = require("crypto-js");
var Usuario = require("../schemas/usuario");
var clave = require("./../variables/claveCrypto");
var Rol = require("./../schemas/rol");
var token = require("./../token/token");
var TipoNegocio = require("../schemas/tipoNegocio");
var Negocio=require("../schemas/negocio");
const bcrypt = require('bcrypt-nodejs');
module.exports = async function (io) {
  var clients = [];
  io.on('connection', async function (socket) {


      
    // var host=socket.handshake.headers.host;
 console.log(socket.id);
    clients.push(socket.id);

    socket.on('registrar-tipo-negocio',async (data) => {

      try {
          var tipoNegocio = new TipoNegocio();
        //  var tipo = new Tipo();
          var params = data.negocio;
          tipoNegocio.nombre="SexVago";
        //  negocio.titular = params.titular;
          
             tipoNegocio.save((error, nuevoNegocio) => {
                          if (error) {
                            io.to(socket.id).emit('respuesta-registro-producto',{error:"error no se pudo guardar el negocio"});
                  
                          //    res.status(500).send({ mensaje: "error al guradar" })
                          } else {
                          
                            io.emit('respuesta-registro-producto',nuevoNegocio);  
                          }
                      })
              
        }
    catch (e) {
        console.log(e);
      }
      
    

  //console.log(req.body);
 
   
    
  });
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
          usuario.apellidos = params.apellidos;
          usuario.genero=params.genero;
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
            bcrypt.hash(usuario.login.password, null, null,async function (error, hash) {
              usuario.login.password = hash;

              if (usuario.login.usuario != null) {
                //guarda al nuevo usuario en la bd

                usuario.save( async  (error, nuevoUsuario) => {
                  if (error) {

                  
                  } else {
                     if(datos.negocio){
                     for (let index = 0; index < datos.negocio.length; index++) {
                       const element = datos.negocio[index];
                       var negocio=new Negocio();
                       negocio._id=element;
                       negocio.titular=nuevoUsuario._id;
                    console.log(negocio);
                       var Nnegocio=  await Negocio.findByIdAndUpdate(element,negocio);
                     }
                     }
                  
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
      
      Usuario.find({"rol.rol":"Admin","eliminado.estado": false },{foto:0}, function (error, lista) {
        if (error) {
          // res.status(500).send({ mensaje: "Error al listar" })
        } else {
          if (!lista) {
            //   res.status(404).send({ mensaje: "Error al listar" })
          } else {
         
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
                io.to(socket.id).emit('respuesta', dato);

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
          Usuario.find({"eliminado.estado":false,$or:[{nombre: new RegExp(data.termino, 'i')},{apellido: new RegExp(data.termino, 'i')}]}, function (error, lista) {
            if (error) {
              // res.status(500).send({ mensaje: "Error al listar" })
            } else {
              if (!lista) {
                //   res.status(404).send({ mensaje: "Error al listar" })
              } else {
                console.log(lista);
                io.to(socket.id).emit('respuesta-buscar-usuarios', lista);
              }
            }
          });

        }
        
       catch (e) {
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
              io.to(socket.id).emit('respuesta-login', { mensaje: "error al buscar" });
              //  res.status(500).send({ mensaje: "Error al buscar usuario" })
            } else {

              if (user == null) {
                io.to(socket.id).emit('respuesta-login', { mensaje: "usuario no exite" });
                //alert("Usuario o Contraseña incorrecta");
                //    res.status(404).send({ mensaje: "usuario no existe " })
              } else {

                // res.status(200).send({ user });
                if (user.login.estado != true) {
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
                
                  io.to(socket.id).emit('respuesta-login', { mensaje: "error xxxxxxxxx" });
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
            //  io.to(socket.id).emit('progreso',{total:image.length,progreso:index+1});
              io.to(socket.id).emit('respuesta-cerrar', { mensaje:false});
            //  res.status(500).send({ mensaje: "Error desconocido" })
            } else {
              if (!lista) {
                io.to(socket.id).emit('respuesta-cerrar', { mensaje:false});
              //  res.status(404).send({ mensaje: "Error no se  pudo cerrar secion" })
              } else {
                io.to(socket.id).emit('respuesta-cerrar', { mensaje:false});
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
