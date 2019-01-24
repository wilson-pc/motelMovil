"use strict"
var CryptoJS = require("crypto-js");
var Producto = require("../schemas/producto");
var clave = require("./../variables/claveCrypto");
var Tipo = require("../schemas/tipo");
module.exports = async function (io) {
  var clients = [];
  io.on('connection', async function (socket) {
    // var host=socket.handshake.headers.host;
    clients.push(socket.id);


    socket.on('registrar-tipo-producto', async (data) => {

      try {
        var tipo = new Tipo();
        //  var tipo = new Tipo();
        var params = data.negocio;
        tipo.nombre = params.nombre;
        //  negocio.titular = params.titular;

        tipo.save((error, nuevoTipo) => {
          if (error) {
            io.to(socket.id).emit('respuesta-registro-tipoproducto', { error: "error no se pudo guardar el negocio" });

            //    res.status(500).send({ mensaje: "error al guradar" })
          } else {
            //console.log(nuevoNegocio);
            io.emit('respuesta-registro-tipoproducto', nuevoTipo);
          }
        })
      }
      catch (e) {
        console.log(e);
      }
    });
    socket.on('registrar-producto', async (data) => {

      try {
        const bytes = CryptoJS.AES.decrypt(data, clave.clave);
        if (bytes.toString()) {
          var datos = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
          var producto = new Producto();
          //  var tipo = new Tipo();
          var params = datos.producto;
          producto.nombre = params.nombre;
          producto.negocio = params.negocio;
          producto.precio = params.precio;
          producto.disponibilidad = params.disponibilidad;
          producto.cantidad = params.cantidad;
          producto.tipo = await Tipo.findById(params.tito);
          producto.foto = params.foto;
          usuario.eliminado = { estado: false, razon: "" };
          producto.descripcion = params.descripcion;
          producto.creacion = params.creacion
          producto.modificacion = params.modificacion;
          producto.save((error, nuevoProducto) => {
            if (error) {

              res.status(500).send({ mensaje: "error al guradar" })
            } else {
              io.emit('respuesta', nuevoProducto);
            }
          })

        }
        return data;
      } catch (e) {
        console.log(e);
      }

      //console.log(req.body);



    });


    socket.on('registrar-tipos', async (data) => {

      io.emit('respuesta-registrar-tipos', { user: socket.nickname, event: 'left' });
    });

    socket.on('registrar-producto', async (data) => {

      io.emit('respuesta', { user: socket.nickname, event: 'left' });
    });

  })


};
