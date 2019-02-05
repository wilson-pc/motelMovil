"use strict"
var CryptoJS = require("crypto-js");
var Habitacion = require("../schemas/habitacion");
var Negocio = require("../schemas/negocio");
var clave = require("./../variables/claveCrypto");
var Tipo = require("../schemas/tipo");
var Crypto = require("../variables/desincryptar");
require ('mongoose-pagination');
module.exports = async function (io) {
  var clients = [];
  io.on('connection', async function (socket) {
    // var host=socket.handshake.headers.host;
    console.log("Hola soy ionic Habitacion");

    socket.on('registrar-habitacion', async (data) => {

      try {
        const bytes = CryptoJS.AES.decrypt(data, clave.clave);

        if (bytes.toString()) {
          var datos = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
          console.log("|-> ", datos);
          var habitacion = new Habitacion();
          var params = datos.habitacion;
          habitacion.nombre = params.nombre;
          habitacion.negocio = params.negocio;
          habitacion.precio = params.precio;
          habitacion.precioreserva = params.precioreserva;
          habitacion.estado=params.estado;
          habitacion.foto = params.foto;
          habitacion.descripcion = params.descripcion;
          habitacion.modificacion = params.modificacion;

          habitacion.save(async (error, nuevoProducto) => {
            if (error) {
              

            } else {
             
              var negocio = await Negocio.findByIdAndUpdate(params.negocio, { $inc: { productos: 1 } });
              io.emit('respuesta-habitacion', nuevoProducto);
            }
          })

        }
        return data;
      } catch (e) {
        console.log(e);
      }

      //console.log(req.body);



    });

    socket.on('eliminar-habitacion', async (data) => {
      try {
        var datos = await Crypto.Desincryptar(data);
        console.log("back Product ->", datos);
        if (!datos.error) {
          var habitacion = new Habitacion();
          habitacion._id = datos.id;
          habitacion.eliminado = { estado: true, razon: datos.razon };
          Habitacion.findByIdAndUpdate(datos.id, habitacion, { new: true }, async (error, actualizado) => {
            if (error) {
              console.log(error);
              io.to(socket.id).emit('respuesta-eliminar-habitacion', { error: "Ocurrio un error en la eliminacion" });

            } else {
              io.to(socket.id).emit('respuesta-eliminar-habitacion', { exito: "eliminado con exito" });

            }
          })

        } else {

        }

      } catch (error) {
        console.log(error);
      }

    });

    socket.on('actualizar-habitacion', async (data) => {
      try {
        const bytes = CryptoJS.AES.decrypt(data, clave.clave);
        if (bytes.toString()) {
          var datos = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
          var habitacion = new Habitacion();
          var params = datos.habitacion;
          habitacion.nombre = params.nombre;
          habitacion.negocio = params.negocio;
          habitacion.precio = params.precio;
          habitacion.precioreserva = params.precioreserva;
          habitacion.estado=params.estado;
          habitacion.tipo = await Tipo.findById(params.tipo);
          habitacion.foto = params.foto;
          habitacion.eliminado = { estado: false, razon: "" };
          habitacion.descripcion = params.descripcion;
          habitacion.creacion = params.creacion
          habitacion.modificacion = params.modificacion;

          habitacion.findByIdAndUpdate(params._id, habitacion, { new: true }, async (error, productoActualizado) => {
            if (error) {
              io.to(socket.id).emit('respuesta-actualizar-habitacion', { error: "ocurio un error al crear el habitacion" });
            } else {

              io.emit('respuesta-actualizar-habitacion', productoActualizado);
            }
          })

        }
        return data;
      } catch (e) {
        console.log(e);
      }

    })

    socket.on('listar-habitacion', async (data) => {

      Habitacion.find({"eliminado.estado": false }, { "foto.portada": 0 }, function (error, lista) {
        if (error) {
          // res.status(500).send({ mensaje: "Error al listar" })
          io.to(socket.id).emit('respuesta-listado-habitacion', { error: "ocurrio un error al listar habitaciones" });
        } else {
          if (!lista) {
            //   res.status(404).send({ mensaje: "Error al listar" })
            io.to(socket.id).emit('respuesta-listado-habitacion', { error: "no habitaciones en la base de datos" });
          } else {
            console.log(lista);
            io.to(socket.id).emit('respuesta-listado-habitacion', lista);
          }
        }
      });
      // io.emit('respuesta-listar-habitacion', { user: socket.nickname, event: 'left' });
    });


//


socket.on('listar-todos-habitaciones', async (data) => {

  Habitacion.find({"eliminado.estado": false }, { "foto.portada": 0 }).paginate(data.parte, 10, function (error, lista, total) {
    if (error) {
      // res.status(500).send({ mensaje: "Error al listar" })
      io.to(socket.id).emit('respuesta-listar-todos-habitaciones', { error: "ocurrio un error al listar productos" });
    } else {
      if (!lista) {
        //   res.status(404).send({ mensaje: "Error al listar" })
        io.to(socket.id).emit('respuesta-listar-todos-habitaciones', { error: "no hay productos en la base de datos" });
      } else {
        console.log(lista);
        io.to(socket.id).emit('respuesta-listar-todos-habitaciones', {habitacion:lista,total:total});
      }
    }
  });
  // io.emit('respuesta-listar-habitacion', { user: socket.nickname, event: 'left' });
});
//
  
    socket.on('buscar-habitacion', async (data) => {

      Habitacion.find({
        "eliminado.estado": false,
        $or: [{ nombre: new RegExp(data.termino, 'i') }, { descripcion: new RegExp(data.termino, 'i') },
        { 'tipo.tipo': new RegExp(data.termino, 'i') }]
      }, { "foto.normal": 0 }, function (error, lista) {
        if (error) {
          // res.status(500).send({ mensaje: "Error al listar" })
          io.to(socket.id).emit('respuesta-listado-habitacion', { error: "ocurrio un error al listar habitacion" });
        } else {
          if (!lista) {
            //   res.status(404).send({ mensaje: "Error al listar" })
            io.to(socket.id).emit('respuesta-listado-habitacion', { error: "no hay habitaciones en la base de datos" });
          } else {
            console.log(lista);
            io.to(socket.id).emit('respuesta-listado-habitacion', lista);
          }
        }

      });
      // io.emit('respuesta-listar-habitacion', { user: socket.nickname, event: 'left' });
    });

  })


};
