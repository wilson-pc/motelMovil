"use strict"
var CryptoJS = require("crypto-js");
var Negocio = require("../schemas/negocio");
var TipoNegocio = require("../schemas/tipoNegocio");
var Productos = require("../schemas/producto");
var clave = require("../variables/claveCrypto");
module.exports = async function (io) {
  var clients = [];
  io.on('connection', async function (socket) {
    // var host=socket.handshake.headers.host;
    clients.push(socket.id);
    socket.on('registrar-negocio', async (data) => {

      console.log("entro");

      try {
        const bytes = CryptoJS.AES.decrypt(data, clave.clave);
        if (bytes.toString()) {
          var datos = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
          var negocio = new Negocio();
          //  var tipo = new Tipo();
          console.log(datos)
          var params = datos.negocio;
          negocio.nombre = params.nombre;
          //  negocio.titular = params.titular;
          negocio.foto = params.foto;
          negocio.tipo = await TipoNegocio.findById(params.tipo);
          negocio.direccion = params.direccion;
          negocio.telefono = params.telefono;
          negocio.correo = params.correo;
          negocio.nit = params.nit;
          negocio.eliminado = { estado: false, razon: "" };
          negocio.creacion = params.creacion
          negocio.productos = 0;
          negocio.modificacion = params.modificacion;

          var contador = await Negocio.countDocuments({ "negocio.nit": params.nit });
          if (contador < 1) {
            console.log(negocio);

            negocio.save((error, nuevonegocio) => {
              if (error) {

                console.log(error)
                io.to(socket.id).emit('respuesta-registro-negocio', { error: "error no se pudo guardar el negocio" }

                );

                //    res.status(500).send({ mensaje: "error al guradar" })
              } else {
                console.log(nuevonegocio);
                console.log("Se guardo el negocio correctamente");
                io.to(socket.id).emit('respuesta-registro-negocio', { datos: nuevonegocio });
                io.emit('respuesta-registro-negocio-todos', { datos: nuevonegocio });
              }
            });
          } else {
            io.to(socket.id).emit('respuesta-registro-negocio', { error: "Ya existe un negocio registrado con este nit" });
          }

        }
        return data;
      } catch (e) {
        console.log(e);
      }
    });
    socket.on('registrar-tipo-negocio', async (data) => {

      try {
        var tipoNegocio = new TipoNegocio();
        //  var tipo = new Tipo();
        var params = data.negocio;
        tipoNegocio.nombre = params.nombre;
        //  negocio.titular = params.titular;

        tipoNegocio.save((error, nuevoNegocio) => {
          if (error) {
            io.to(socket.id).emit('respuesta-registro-producto', { error: "error no se pudo guardar el negocio" });

            //    res.status(500).send({ mensaje: "error al guradar" })
          } else {
            console.log(nuevoNegocio);
            io.emit('respuesta-registro-producto', nuevoNegocio);
          }
        })

      }
      catch (e) {
        console.log(e);
      }
      //console.log(req.body);
    });

    socket.on('actualizar-negocio', async (data) => {

      console.log(data);
      try {
        const bytes = CryptoJS.AES.decrypt(data, clave.clave);
        if (bytes.toString()) {
          var datos = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
          var negocio = new Negocio();
          //  var tipo = new Tipo();
          var params = datos.negocio;
          negocio._id = params._id;
          negocio.nombre = params.nombre;
          negocio.titular = params.titular;
          negocio.foto = params.foto;
          negocio.direccion = params.direccion;
          negocio.telefono = params.telefono;
          negocio.nit = params.nit;

          negocio.correo = params.correo;
          negocio.modificacion = params.modificacion;

          console.log("LLEGO A ACTUALIZAR");

          Negocio.findOneAndUpdate({ _id: params._id }, negocio, { new: true }, (error, actualizado) => {
            if (error) {
              io.to(socket.id).emit('respuesta-actualizar-negocio', { error: "error al guradar nuevos datos" });
              //    res.status(500).send({ mensaje: "error al guradar" })
            } else {
              io.to(socket.id).emit('respuesta-actualizar-negocio', { datos: actualizado });
              io.emit('respuesta-actualizar-negocio-todos', { datos: actualizado });

            }
          })

        }
        return data;
      } catch (e) {
        console.log(e);
      }
    });


    //
    //
    //
    //
    socket.on('eliminar-negocio', async (data) => {

      console.log("Entro a la peticion")
      try {
        console.log("Entro a la peticion y try")
        const bytes = CryptoJS.AES.decrypt(data, clave.clave);
        if (bytes.toString()) {
          var datos = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
          console.log(datos);
          var negocio = new Negocio();
          var params = datos.negocio;
          negocio._id = params._id;
          negocio.productos = 0;
          negocio.eliminado = { estado: true, razon: params.razon },
            negocio.modificacion = params.modificacion;

          //guarda al nuevo usuario en la bd

          Negocio.findOneAndUpdate({ _id: params._id }, negocio, { new: true }, (error, actualizado) => {
            if (error) {
              io.to(socket.id).emit('respuesta-elimina-negocio', { error: "error no se pudo guardar" })
              // res.status(500).send({ mensaje: "error al guradar" })
            } else {
              io.to(socket.id).emit('respuesta-elimina-negocio', { datos: actualizado });
              io.emit('respuesta-elimina-negocio-todos', { datos: actualizado });
            }
          })

        }
        else {

        }
      } catch (e) {
        console.log(e);
      }

    });



    socket.on('eliminar-negocio-de-usuarios', async (data) => {

      console.log("Entro a la peticion")
      try {
        console.log("Entro a la peticion y try")
        const bytes = CryptoJS.AES.decrypt(data, clave.clave);
        if (bytes.toString()) {
          var datos = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));

          var negocio = new Negocio();
          var params = datos.negocio;
          negocio._id = params._id;
          negocio.productos = 0;
          negocio.eliminado = { estado: true, razon: params.razon },
            negocio.modificacion = params.modificacion;

          //guarda al nuevo usuario en la bd

          Negocio.findOneAndUpdate({ _id: params._id }, negocio, { new: true }, (error, actualizado) => {
            if (error) {
              io.to(socket.id).emit('respuesta-elimina-negocio-de-usuario', { error: "error no se pudo guardar" })
              // res.status(500).send({ mensaje: "error al guradar" })
            } else {
              io.to(socket.id).emit('respuesta-elimina-negocio-de-usuario', actualizado);

            }
          })

        }
        else {

        }
      } catch (e) {
        console.log(e);
      }

    });

    //{"eliminado.estado":false,"tipo.nombre":data.termino},{foto:0}
    socket.on('listar-negocio', async (data) => {
      Negocio.find({ "eliminado.estado": false, "tipo.nombre": data.termino }, { foto: 0 }, function (error, lista) {
        if (error) {
          io.to(socket.id).emit('respuesta-listar-negocio', { error: "No se pudo listar los negocios" })
          // res.status(500).send({ mensaje: "Error al listar" })
        } else {
          if (!lista) {
            io.to(socket.id).emit('respuesta-listar-negocio', { error: "aun no hay negocios en registrados" })
            //   res.status(404).send({ mensaje: "Error al listar" })
          } else {
            console.log(lista);
            io.to(socket.id).emit('respuesta-listar-negocio', lista);
          }
        }
      });
    });

    socket.on('listar-negocio-detallado', async (data) => {
      Negocio.find({ "eliminado.estado": false, "tipo.nombre": data.termino }, { foto: 0 }, async function (error, lista) {
        if (error) {
          io.to(socket.id).emit('respuesta-listar-negocio-detallado', { error: "No se pudo listar los negocios" })
          // res.status(500).send({ mensaje: "Error al listar" })
        } else {
          if (!lista) {
            io.to(socket.id).emit('respuesta-listar-negocio-detallado', { error: "aun no hay negocios en registrados" })
            //   res.status(404).send({ mensaje: "Error al listar" })
          } else {

            io.to(socket.id).emit('respuesta-listar-negocio-detallado', lista);
          }
        }
      });
    });

    socket.on('listar-negocio2', async (data) => {
      Negocio.find({ "eliminado.estado": false, titular: { $exists: false } }, { foto: 0 }, function (error, lista) {
        if (error) {
          console.log(error);
          io.to(socket.id).emit('respuesta-listar-negocio2', { error: "No se pudo listar los negocios" })
          // res.status(500).send({ mensaje: "Error al listar" })
        } else {
          if (!lista) {
            //  console.log(nada);
            io.to(socket.id).emit('respuesta-listar-negocio2', { error: "aun no hay negocios en registrados" })
            //   res.status(404).send({ mensaje: "Error al listar" })
          } else {

            io.to(socket.id).to(socket.id).emit('respuesta-listar-negocio2', lista);
          }
        }
      });
    });

    socket.on('listar-negocio-de-usuario-completo', async (data) => {
      try {
        const bytes = CryptoJS.AES.decrypt(data, clave.clave);
        if (bytes.toString()) {
          var datos = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));

          Negocio.find({ "eliminado.estado": false, titular: datos.id }, function (error, lista) {
            if (error) {
              console.log(error);
              io.to(socket.id).emit('listar-negocio-de-usuario-completo', { error: "No se pudo listar los negocios" })
              // res.status(500).send({ mensaje: "Error al listar" })
            } else {
              if (!lista) {
                //  console.log(nada);
                io.to(socket.id).emit('listar-negocio-de-usuario-completo', { error: "error no se listar negocios" })
                //   res.status(404).send({ mensaje: "Error al listar" })
              } else {

                io.to(socket.id).emit('listar-negocio-de-usuario-completo', lista);
              }
            }
          });
        }
        return data;
      } catch (e) {
        console.log(e);
      }
    });


    socket.on('buscar-negocio', async (data) => {
      try {
        console.log(data);
        Negocio.find({ "eliminado.estado": false, "tipo.nombre": data.tipo, nombre: new RegExp(data.termino, 'i') }, function (error, lista) {
          if (error) {
            // res.status(500).send({ mensaje: "Error al listar" })
          } else {
            if (!lista) {
              //   res.status(404).send({ mensaje: "Error al listar" })
            } else {
              console.log(lista);
              io.to(socket.id).emit('respuesta-buscar-negocios', lista);
            }
          }
        });

      }

      catch (e) {
        console.log(e);
      }

    });


    socket.on('listar-negocios-de-usuario', async (data) => {

      try {
        const bytes = CryptoJS.AES.decrypt(data, clave.clave);
        if (bytes.toString()) {
          var datos = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
          if (datos.tipo == "negocios") {
            Negocio.find({ "eliminado.estado": false, titular: datos.id }, { foto: 0 }, function (error, lista) {
              if (error) {
                console.log(error);
                io.to(socket.id).emit('respuesta-listar-negocio-de-usuario', { error: "No se pudo listar los negocios" })
                // res.status(500).send({ mensaje: "Error al listar" })
              } else {
                if (!lista) {
                  //  console.log(nada);
                  io.to(socket.id).emit('respuesta-listar-negocio-de-usuario', { error: "error no se listar negocios" })
                  //   res.status(404).send({ mensaje: "Error al listar" })
                } else {

                  io.to(socket.id).emit('respuesta-listar-negocio-de-usuario', lista);
                }
              }
            });
          } else {
            var cantidad = await Negocio.countDocuments({ titular: datos.id });
            io.to(socket.id).emit('respuesta-listar-negocio-de-usuario', cantidad);
          }


        }
        return data;
      } catch (e) {
        console.log(e);
      }

    });


    socket.on('sacar-negocio', async (data) => {
      try {
        const bytes = CryptoJS.AES.decrypt(data, clave.clave);
        if (bytes.toString()) {
          var datos = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));


          Negocio.findOne({ _id: datos.id, "eliminado.estado": false }, function (error, dato) {
            if (error) {
              io.to(socket.id).emit('respuesta-sacar-negocio', { error: "no se pudo buscar al negocio" })
              // res.status(500).send({ mensaje: "Error al listar" })
            } else {
              if (!lista) {
                io.to(socket.id).emit('respuesta-sacar-negocio', { error: "no se pudo encontrar al negocio" })
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
    socket.on('buscar-negocio', async (data) => {
      try {
        const bytes = CryptoJS.AES.decrypt(data, clave.clave);
        if (bytes.toString()) {
          var datos = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));


          Negocio.find({ "eliminado.estado": false, nombre: datos.termino, nit: datos.termino }, { foto: 0 }, function (error, lista) {
            if (error) {
              io.to(socket.id).emit('respuesta-buscar-negocio', { error: "aun no hay negocios en registrados" })
              // res.status(500).send({ mensaje: "Error al listar" })
            } else {
              if (!lista) {
                io.to(socket.id).emit('respuesta-buscar-negocio', { error: "aun no hay negocios en registrados" })
                //   res.status(404).send({ mensaje: "Error al listar" })
              } else {
                io.to(socket.id).emit('respuesta-buscar-negocio', lista);
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
