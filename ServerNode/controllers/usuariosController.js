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
var nodemailer = require('nodemailer');
var generator = require('generate-password');

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
    socket.on('registrar-usuario', async (data) => {


      try {
        const bytes = CryptoJS.AES.decrypt(data, clave.clave);
        if (bytes.toString()) {
          var datos = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
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
          var cantidad=await Usuario.countDocuments({email:params.email});
         if(cantidad<1){
          if (params.ci) {
            //encripta el pasword del usuario
            bcrypt.hash(usuario.login.password, null, null, async function (error, hash) {
              usuario.login.password = hash;

              if (usuario.login.usuario != null) {
                //guarda al nuevo usuario en la bd

                usuario.save(async (error, nuevoUsuario) => {
                  if (error) {
                    io.to(socket.id).emit('respuesta-crear', { error:"Error no se pudo crear el registro"});

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
        console.log(nuevoUsuario);
                    io.to(socket.id).emit('respuesta-crear', { exito:"registro guardado con exito" });
                    io.emit('respuesta-crear-todos',{ usuario: nuevoUsuario});
                  }
                })
              }

            });
          }
         }
         else{
          io.to(socket.id).emit('respuesta-crear', { mensaje:"este usuario ya esta registrado"});
           //console.log("usuario existe");
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
              io.to(socket.id).emit('respuesta-actualizar-usuario', {exito:"actualizado con exito"});

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

                   
              io.to(socket.id).emit('respuesta-eliminar-usuario',{exito:"eliminado con exito"});
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
            var email="wilverhidalgo@outlook.com";
            var usuario=await Usuario.findOne({email:email,"eliminado.estado": false});
            if(usuario){
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
              symbols:false,
              exclude:"/",
          });
            console.log(password);
           var hash= token2.crearToken(password);
           console.log(hash);
            var mailOptions = {
              from:'"Triservice" <wilson-pc@yandex.com>',
              to: 'wilverhidalgobarja74757@gmail.com',
              subject: 'Sending Email using js',
              text: 'That was easy!',
              html: '<div> <table cellspacing="0" cellpadding="0" border="0"><tbody><tr width="100%"><td valign="top" align="left" style="background:#f0f0f0; font:15px"><table style="border:none; padding:0 18px; margin:50px auto; width:500px">'+
                 '<tbody><tr width="100%" height="57"> <td valign="top" align="left" style="border-top-left-radius:4px; border-top-right-radius:4px; background:#0079BF; padding:12px 18px; text-align:center"> <h2  style="font-weight:bold; font-size:18px; color:#fff; vertical-align:top"> Tri service</h2>'+
                  '</td> </tr><tr width="100%"> <td valign="top" align="left" style="border-bottom-left-radius:4px; border-bottom-right-radius:4px; background:#fff; padding:18px"><h1 style="font-size:20px; margin:0; color:#333">Buenas: </h1>'+
                 ' <p style="font:15px/1.25em,Arial,Helvetica; color:#333">Hemos notado que esta tratando de recuperar su usuario y contraseña de triservice.</p><p style="font:15px/1.25em, Arial,Helvetica; color:#333"><strong>Fecha y hora:</strong> 25 de enero de 2019 a las 20:07 HEOS<br>'+
                  '<strong>Dirección IP :</strong> 190.129.127.18 </p><p style="font:15px/1.25em ,Arial,Helvetica; color:#333">Si no es usted verifique que a quien presto su dispositivo la en las fecha indicadas</p>'+
                 ' <p style="font:15px/1.25em ,Arial,Helvetica; color:#333">Si es usted as click en la direccion url de abajo para poder crear sus nuevos credenciales,<a href="http://localhost:4200/recuperacion/'+hash+'" target="_blank" rel="noopener noreferrer" data-auth="NotApplicable">'+
                  ' cambie la contraseña</a> de inmediato. </p></td></tr></tbody></table> </td></tr> </tbody> </div>'
            };
            
        /*   Usuario.findOneAndUpdate({email:email},{tokenrecuperacion:{token:hash,fecha:"12-12-12"}},{new: true }, async (error, actualizado) => {
              console.log(actualizado);
 });*/
            
         transporter.sendMail(mailOptions, async function(error, info){
              if (error) {
                console.log(error);
              } else {
                Usuario.findOneAndUpdate({email:"wilverhidalgo@outlook.com"},{tokenrecuperacion:{token:hash,fecha:"12-12-12"}},{new: true }, async (error, actualizado) => {
                  console.log(actualizado);
     });
              }
            });
          }else{
            console.log("sin resultado");
          }
        }else{
          console.log("heg7hougoheh");
        }
      
      } catch (e) {
        console.log(e);
      }

    });


    socket.on('validar-token', async (data) => {
      console.log("ifnuhu4hg94h8mh98");
       var token="eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJoYXNoIjoiUGVyekJ4M1QwRllLcVhua0VZbFEiLCJub3ciOjE1NDg0NzQyMDksImV4cCI6MTU1MTA2NjIwOX0.MY3UpKsmHqLn5n9pfgxsFKQOYM3WdQu-U6CcZD9Zjm8";
      Usuario.findOne({"tokenrecuperacion.token": token, "eliminado.estado": false }, { foto: 0 }, function (error, lista) {
        if (error) {
          console.log(error);
          // res.status(500).send({ mensaje: "Error al listar" })
        } else {
          if (!lista) {
            //   res.status(404).send({ mensaje: "Error al listar" })
          } else {
            io.to(socket.id).emit('respuesta-validar-token', lista);
          }
        }
      });
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
          var tipo=params.tipo;

          Usuario.findOne({ 'login.usuario': usuario,'rol.rol':tipo}, (error, user) => {

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
          var tipo=params.tipo;

<<<<<<< HEAD
          Usuario.findOne({ 'login.usuario': usuario }, (error, user) => {
          
=======
          Usuario.findOne({ 'login.usuario': usuario,'rol.rol':tipo}, (error, user) => {

>>>>>>> c5363e7ead0a0071666f564791d58dcc9ba15e5f
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
          
          // console.log(lista);
          Usuario.findByIdAndUpdate(datos.id, usuario, { new: true }, function (error, lista) {

            if (error) {
              //  io.to(socket.id).emit('progreso',{total:image.length,progreso:index+1});
              io.to(socket.id).emit('respuesta-cerrar', { mensaje: false });
              //  res.status(500).send({ mensaje: "Error desconocido" })
            } else {
              if (!lista) {
                io.to(socket.id).emit('respuesta-cerrar', { mensaje: false });
                //  res.status(404).send({ mensaje: "Error no se  pudo cerrar secion" })
              } else {
                io.to(socket.id).emit('respuesta-cerrar', { mensaje: true });
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
