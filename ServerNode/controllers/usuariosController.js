"use strict"
var CryptoJS = require("crypto-js");
var Usuario = require("../schemas/usuario");
var clave = require("./../variables/claveCrypto");
var Rol = require("./../schemas/rol");
var token = require("./../token/token");
var token2 = require("./../token/tokenRequest");
var TipoNegocio = require("../schemas/tipoNegocio");
var Negocio = require("../schemas/negocio");
const bcrypt = require('bcrypt-nodejs');
var token55 = require("jwt-simple");
var nodemailer = require('nodemailer');
var generator = require('generate-password');
var moment = require("moment");

function sumarDias(fecha, dias) {
  fecha.setDate(fecha.getDate() + dias);
  return fecha;
}


module.exports = async function (io) {
  var clients = [];

  io.on('connection', async function (socket) {



    // var host=socket.handshake.headers.host;
    console.log(socket.id);
    clients.push(socket.id);

    socket.on('registrar-tipo-negocio', async (data) => {

      try {
        var tipoNegocio = new TipoNegocio();
        //  var tipo = new Tipo();
        var params = data.negocio;
        tipoNegocio.nombre = "SexVago";
        //  negocio.titular = params.titular;

        tipoNegocio.save((error, nuevoNegocio) => {
          if (error) {
            io.to(socket.id).emit('respuesta-registro-producto', { error: "error no se pudo guardar el negocio" });

            //    res.status(500).send({ mensaje: "error al guradar" })
          } else {

            io.emit('respuesta-registro-producto', nuevoNegocio);
          }
        })

      }
      catch (e) {
        console.log(e);
      }



      //console.log(req.body);



    });


    socket.on('registrar-usuario-cliente', async (data) => {


      try {
        const bytes = CryptoJS.AES.decrypt(data, clave.clave);
        if (bytes.toString()) {
          var datos = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
          var usuario = new Usuario();

          var params = datos.usuario;

          usuario.nombre = params.nombre;
          usuario.apellidos = params.apellidos;
          usuario.genero = params.genero;
          usuario.email = params.email;
          usuario.login = params.login;
          usuario.foto = params.foto;
          usuario.eliminado = { estado: false, razon: "" };
          usuario.creacion = params.creacion
          usuario.modificacion = params.modificacion;
          usuario.rol = await Rol.findById(params.rol);
          var cantidad = await Usuario.countDocuments({ email: params.email });
          if (cantidad < 1) {
            if (params.nombre) {
              //encripta el pasword del usuario
              bcrypt.hash(usuario.login.password, null, null, async function (error, hash) {
                usuario.login.password = hash;

                if (usuario.login.usuario != null) {
                  //guarda al nuevo usuario en la bd

                  usuario.save(async (error, nuevoUsuario) => {
                    if (error) {
                      io.to(socket.id).emit('respuesta-registrar-usuario-cliente', { error: "Error no se pudo crear el registro" });

                    } else {

                      io.to(socket.id).emit('respuesta-registrar-usuario-cliente', { dato: nuevoUsuario });

                    }
                  })
                }

              });
            }
          }
          else {
            io.to(socket.id).emit('respuesta-registrar-usuario-cliente', { error: "este usuario ya esta registrado" });
            //console.log("usuario existe");
          }

        }
        return data;
      } catch (e) {
        console.log(e);
      }

      //console.log(req.body);
    });

    socket.on('registrar-sa', async () => {

     
          var usuario = new Usuario();


          usuario.nombre = "Super";
          usuario.apellidos = "Admin";
          usuario.genero = "otro";
          usuario.ci = "9595633";
          usuario.telefono = "45252523";
          usuario.email = "sa@yandex.com";
          usuario.login = { usuario: 'sa', password: '123', estado: false };
          usuario.rol = await Rol.findById("5c45eed64d12261e10b57845");

          
              //encripta el pasword del usuario
              bcrypt.hash(usuario.login.password, null, null, async function (error, hash) {
                usuario.login.password = hash;

                if (usuario.login.usuario != null) {
                  //guarda al nuevo usuario en la bd

                  usuario.save(async (error, nuevoUsuario) => {
                    if (error) {
                      console.log(error);
                      io.to(socket.id).emit('respuesta-crear', { error: "Error no se pudo crear el registro" });

                    } else {
                      
                      console.log("exito ");
                      io.to(socket.id).emit('respuesta-crear', { exito: "registro guardado con exito" });
                      io.emit('respuesta-crear-todos', { usuario: nuevoUsuario });
                    }
                  })
                }

              });

      //console.log(req.body);
    });


    socket.on('registrar-usuario', async (data) => {

      console.log(data);
      try {
        const bytes = CryptoJS.AES.decrypt(data, clave.clave);
        if (bytes.toString()) {
          var datos = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
          console.log(datos);
          var usuario = new Usuario();

          var params = datos.usuario;

          usuario.nombre = params.nombre;
          usuario.apellidos = params.apellidos;
          usuario.genero = params.genero;
          usuario.ci = params.ci;
          usuario.telefono = params.telefono;
          usuario.email = params.email;
          usuario.login = params.login;
          usuario.foto = params.foto;
          usuario.eliminado = { estado: false, razon: "" };
          usuario.creacion = params.creacion
          usuario.modificacion = params.modificacion;
          usuario.rol = await Rol.findById(params.rol);
          var cantidad = await Usuario.countDocuments({ email: params.email });
          if (cantidad < 1) {
            if (params.ci) {
              //encripta el pasword del usuario
              bcrypt.hash(usuario.login.password, null, null, async function (error, hash) {
                usuario.login.password = hash;

                if (usuario.login.usuario != null) {
                  //guarda al nuevo usuario en la bd

                  usuario.save(async (error, nuevoUsuario) => {
                    if (error) {
                      console.log(error);
                      io.to(socket.id).emit('respuesta-crear', { error: "Error no se pudo crear el registro" });

                    } else {
                      if (datos.negocio) {
                        for (let index = 0; index < datos.negocio.length; index++) {
                          const element = datos.negocio[index];
                          var negocio = new Negocio();
                          negocio._id = element;
                          negocio.titular = nuevoUsuario._id;
                          console.log(negocio);
                          var Nnegocio = await Negocio.findByIdAndUpdate(element, negocio);
                        }
                      }
                      console.log("exito ");
                      io.to(socket.id).emit('respuesta-crear', { exito: "registro guardado con exito" });
                      io.emit('respuesta-crear-todos', { usuario: nuevoUsuario });
                    }
                  })
                }

              });
            }
          }
          else {
            io.to(socket.id).emit('respuesta-crear', { mensaje: "este usuario ya esta registrado" });
            console.log("usuario existe");
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
          usuario.apellidos = params.apellidos;
          usuario.ci = params.ci;
          usuario.telefono = params.telefono;
          usuario.email = params.email;
          usuario.login = params.login;
          usuario.foto = params.foto;
          usuario.modificacion = params.modificacion;

          //guarda al nuevo usuario en la bd

          Usuario.findByIdAndUpdate(params._id, usuario, { new: true }, async (error, actualizado) => {
            if (error) {
              io.to(socket.id).emit('respuesta-actualizar-usuario', { mensaje: "error al actualizar usuario" });
              // res.status(500).send({ mensaje: "error al guradar" })
            } else {

              if (datos.negocio) {
                for (let index = 0; index < datos.negocio.length; index++) {
                  const element = datos.negocio[index];
                  var negocio = new Negocio();
                  negocio._id = element;
                  negocio.titular = actualizado._id;

                  var Nnegocio = await Negocio.findByIdAndUpdate(element, negocio);
                }
              }

              console.log(actualizado);
              io.to(socket.id).emit('respuesta-actualizar-usuario', { exito: "actualizado con exito" });

              io.emit('respuesta-actualizar-usuario-todos', actualizado);
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

          usuario._id = datos.id;
          usuario.eliminado = { estado: true, razon: datos.razon };
          var dat = await Negocio.find({ titular: datos.id });


          Usuario.findByIdAndUpdate(datos.id, usuario, { new: true }, async (error, actualizado) => {
            if (error) {
              console.log(error);
              io.to(socket.id).emit('respuesta-eliminar-usuario', { error: "Ocurrio un error en ls eliminacion" });

            } else {

              await Negocio.updateMany({ titular: datos.id }, { eliminado: { estado: true, razon: "eliminado por borrado de usuario" } });


              io.to(socket.id).emit('respuesta-eliminar-usuario', { exito: "eliminado con exito" });
              io.emit('respuesta-eliminar-usuario-todos', actualizado);
            }
          })

        }
        else {

        }
      } catch (e) {
        console.log(e);
      }

    });
    socket.on('correo-recuperacion', async (data) => {

      try {
        const bytes = CryptoJS.AES.decrypt(data, clave.clave);

        if (bytes.toString()) {

          var datos = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
          var email = datos.email;
          var fecha = new Date();
          var usuario = await Usuario.findOne({ email: email, "eliminado.estado": false });
          if (usuario) {
            var transporter = nodemailer.createTransport({
              service: 'yandex',
              auth: {
                user: 'wilson-pc@yandex.com',
                pass: 'tengosueno123'
              }
            });
            var password = generator.generate({
              length: 20,
              numbers: true,
              symbols: false,
              exclude: "/",
            });
            console.log(password);
            var hash = token2.crearToken(password);

            var mailOptions = {
              from: '"Triservice" <wilson-pc@yandex.com>',
              to: email,
              subject: 'correo de recuperacion',
              text: 'Recupera tu correo',
              html: '<div> <table cellspacing="0" cellpadding="0" border="0"><tbody><tr width="100%"><td valign="top" align="left" style="background:#f0f0f0; font:15px"><table style="border:none; padding:0 18px; margin:50px auto; width:500px">' +
                '<tbody><tr width="100%" height="57"> <td valign="top" align="left" style="border-top-left-radius:4px; border-top-right-radius:4px; background:#0079BF; padding:12px 18px; text-align:center"> <h2  style="font-weight:bold; font-size:18px; color:#fff; vertical-align:top"> Tri service</h2>' +
                '</td> </tr><tr width="100%"> <td valign="top" align="left" style="border-bottom-left-radius:4px; border-bottom-right-radius:4px; background:#fff; padding:18px"><h1 style="font-size:20px; margin:0; color:#333">Buenas: </h1>' +
                ' <p style="font:15px/1.25em,Arial,Helvetica; color:#333">Hemos notado que esta tratando de recuperar su usuario y contraseña de triservice.</p><p style="font:15px/1.25em, Arial,Helvetica; color:#333"><strong>Fecha y hora:</strong>' + fecha + '<br>' +
                '<p style="font:15px/1.25em ,Arial,Helvetica; color:#333">Si no es usted ignore este correo</p>' +
                ' <p style="font:15px/1.25em ,Arial,Helvetica; color:#333">Si es usted as click <a href="http://triservicedemo.herokuapp.com/recuperacion/' + hash + '" target="_blank" rel="noopener noreferrer" data-auth="NotApplicable"> ' +
                'aqui</a> para poder crear sus nuevos creenciales </p></td></tr></tbody></table> </td></tr> </tbody> </div>'
            };

            /*   Usuario.findOneAndUpdate({email:email},{tokenrecuperacion:{token:hash,fecha:"12-12-12"}},{new: true }, async (error, actualizado) => {
                  console.log(actualizado);
     });*/

            transporter.sendMail(mailOptions, async function (error, info) {
              if (error) {
                io.to(socket.id).emit('correo-recuperacion', { error: "Ocurrio un error no se pudo enviar el correo de recuperacion" });
              } else {
                var vencimiento = sumarDias(fecha, 1);
                Usuario.findOneAndUpdate({ email: email }, { tokenrecuperacion: { token: hash, fecha: fecha, vencimiento: vencimiento } }, { new: true }, async (error, actualizado) => {
                  io.to(socket.id).emit('correo-recuperacion', { error: "Revise su correo para ver el enlace de recuperacion" });
                });
              }
            });
          } else {
            console.log("Este correo no esta registrado utilise el correo con la que registro la cuenta");
            io.to(socket.id).emit('correo-recuperacion', { error: "Este correo no esta registrado utilise el correo con la que registro la cuenta" });
          }
        } else {
          io.to(socket.id).emit('correo-recuperacion', { error: "Este ocurrio un error de encriptado" });
        }

      } catch (e) {
        console.log(e);
      }

    });


    socket.on('validar-token', async (data) => {
      var claveSecreta = "nuevaclave";
      // var hash= token2.crearToken("rjireubitrwmhcngfrefrur");
      // console.log(hash);
      var token = data;
      try {
        var loadToken = token55.decode(token, claveSecreta);

        if (loadToken.exp <= moment().unix()) {

          io.to(socket.id).emit('respuesta-validar-token', { error: "token invalido" });

        } else {
          console.log(loadToken);

          Usuario.findOne({ "tokenrecuperacion.token": token, "eliminado.estado": false }, { foto: 0 }, function (error, dato) {
            if (error) {

              io.to(socket.id).emit('respuesta-validar-token', { error: "token invalido" });
              // res.status(500).send({ mensaje: "Error al listar" })
            } else {
              if (!dato) {
                io.to(socket.id).emit('respuesta-validar-token', { error: "token invalido" });
                //   res.status(404).send({ mensaje: "Error al listar" })
              } else {
                console.log(dato);
                io.to(socket.id).emit('respuesta-validar-token', dato);
              }
            }
          });

        }

      } catch (error) {
        io.to(socket.id).emit('respuesta-validar-token', { error: "token invalido" });
      }


    });

    socket.on('listar-usuario', async (data) => {

      Usuario.find({ "rol.rol": "Admin", "eliminado.estado": false }, { foto: 0 }, function (error, lista) {
        if (error) {
          // res.status(500).send({ mensaje: "Error al listar" })
        } else {
          if (!lista) {
            //   res.status(404).send({ mensaje: "Error al listar" })
          } else {
            io.to(socket.id).emit('respuesta-listado', lista);
          }
        }
      });
    });

    socket.on('cambiar-login', async (data) => {
      try {
        const bytes = CryptoJS.AES.decrypt(data, clave.clave);
        if (bytes.toString()) {
          var datos = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));

          bcrypt.hash(datos.usuario.password, null, null, async function (error, hash) {


            var usuario = new Usuario();
            usuario._id = datos.usuario.id;
            usuario.login = { usuario: datos.usuario.usuario, password: hash, estado: false }
            Usuario.findByIdAndUpdate(usuario._id, usuario, { new: true }, function (error, dato) {
              if (error) {
                console.log(error);
                io.to(socket.id).emit('respuesta-cambiar-login', { error: "Error no se pudo cambiar los datos" });
                // res.status(500).send({ mensaje: "Error al listar" })
              } else {
                if (!dato) {
                  io.to(socket.id).emit('respuesta-cambiar-login', { error: "Error no se pudo cambiar los datos" });
                  //   res.status(404).send({ mensaje: "Error al listar" })
                } else {
                  console.log(dato);
                  io.to(socket.id).emit('respuesta-cambiar-login', dato);

                }
              }

            });
          })
        }
        return data;
      } catch (e) {
        console.log(e);
      }

    });

    socket.on('sacar-usuario', async (data) => {
      try {
        const bytes = CryptoJS.AES.decrypt(data, clave.clave);
        if (bytes.toString()) {
          var datos = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));

          console.log(datos);
          Usuario.findOne({ _id: datos.id, "eliminado.estado": false }, function (error, dato) {
            if (error) {
              // res.status(500).send({ mensaje: "Error al listar" })
            } else {
              if (!dato) {
                //   res.status(404).send({ mensaje: "Error al listar" })
              } else {
                io.to(socket.id).emit('respuesta-sacar-usuario', dato);

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
        Usuario.find({ "eliminado.estado": false, $or: [{ nombre: new RegExp(data.termino, 'i') }, { apellido: new RegExp(data.termino, 'i') }] }, function (error, lista) {
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

    socket.on('recuperar-login', async (data) => {
      try {
        const bytes = CryptoJS.AES.decrypt(data, clave.clave);
        if (bytes.toString()) {
          var datos = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));

          bcrypt.hash(datos.password, null, null, async function (error, hash) {


            var usuario = new Usuario();
            usuario._id = datos.id;
            usuario.login = { usuario: datos.usuario, password: hash, estado: false };
            usuario.tokenrecuperacion = null;
            Usuario.findByIdAndUpdate(usuario._id, usuario, { new: true }, function (error, dato) {
              if (error) {

                io.to(socket.id).emit('respuesta-recuperar-login', { error: "Error no se pudo cambiar los datos" });
                // res.status(500).send({ mensaje: "Error al listar" })
              } else {
                if (!dato) {
                  io.to(socket.id).emit('respuesta-recuperar-login', { error: "Error no se pudo cambiar los datos" });
                  //   res.status(404).send({ mensaje: "Error al listar" })
                } else {

                  io.to(socket.id).emit('respuesta-recuperar-login', { exito: "credenciales cambiados con exito, inicie cesion en la aplicacion con los nuevos credenciales" });

                }
              }

            });
          })
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
          var tipo = params.tipo;
          console.log(params);

          Usuario.findOne({ 'login.usuario': usuario, 'rol.rol': tipo }, (error, user) => {

            if (error) {
              console.log(error);
              io.to(socket.id).emit('respuesta-login', { mensaje: "error al buscar" });
              //  res.status(500).send({ mensaje: "Error al buscar usuario" })
            } else {

              if (user == null) {
                console.log("usuario no existe");
                io.to(socket.id).emit('respuesta-login', { mensaje: "usuario no exite" });
                //alert("Usuario o Contraseña incorrecta");
                //    res.status(404).send({ mensaje: "usuario no existe " })
              } else {

                // res.status(200).send({ user });
                if (user.login.estado != true) {
                  var usuario = new Usuario();
                  usuario._id = user._id;
                  usuario.login = { usuario: user.login.usuario, password: user.login.password, estado: true }
                  console.log(user.login);

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


    socket.on('login-usuario-clientes', async (data) => {
      // console.log("jntrnrkmrktmkrlbm{kl mmklmlk n ntj");
      try {
        const bytes = CryptoJS.AES.decrypt(data, clave.clave);
        if (bytes.toString()) {
          var datos = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
          //  console.log(datos);

          var params = datos;
          var usuario = params.usuario;
          var pass = params.password;
          var tipo = params.tipo;

          Usuario.findOne({ 'login.usuario': usuario, 'rol.rol': tipo }, (error, user) => {

            if (error) {
              io.to(socket.id).emit('respuesta-login', { mensaje: "error al buscar" });
              //  res.status(500).send({ mensaje: "Error al buscar usuario" })
            } else {

              if (user == null) {
                io.to(socket.id).emit('respuesta-login', { mensaje: "usuario no exite" });
                //alert("Usuario o Contraseña incorrecta");
                //    res.status(404).send({ mensaje: "usuario no existe " })
              } else {
                console.log(user);
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
          console.log(usuario2);
          var usuario = new Usuario();
          usuario._id = datos.id;
          usuario.login = { usuario: usuario2.login.usuario, password: usuario2.login.password, estado: false };

          // console.log(lista);
          Usuario.findByIdAndUpdate(datos.id, usuario, { new: true }, function (error, data) {
            console.log(data);

            if (error) {
              //  io.to(socket.id).emit('progreso',{total:image.length,progreso:index+1});
              io.to(socket.id).emit('respuesta-cerrar', { mensaje: "ocurrio un error durante el cierre se cesion" });
              //  res.status(500).send({ mensaje: "Error desconocido" })
            } else {
              if (!data) {
                io.to(socket.id).emit('respuesta-cerrar', { mensaje: "ocurrio un error durante el cierre se cesion" });
                //  res.status(404).send({ mensaje: "Error no se  pudo cerrar secion" })
              } else {
                io.to(socket.id).emit('respuesta-cerrar', { data: true });
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
