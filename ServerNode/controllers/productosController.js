"use strict"
var CryptoJS = require("crypto-js");
var Producto = require("../schemas/producto");
var Negocio= require("../schemas/negocio");
var clave = require("./../variables/claveCrypto");
var Tipo = require("../schemas/tipo");
module.exports = async function (io) {
  var clients = [];
  io.on('connection', async function (socket) {
    // var host=socket.handshake.headers.host;
    clients.push(socket.id);

    socket.on('listar-tipos', async (data) => {
      
      Tipo.find({}, function (error, lista) {
        if (error) {
          // res.status(500).send({ mensaje: "Error al listar" })
        } else {
          if (!lista) {
            //   res.status(404).send({ mensaje: "Error al listar" })
          } else {
            io.emit('respuesta-listado-tipos', lista);
          }
        }
      });
    });
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
          //  var tipo = new Tipo();
      /*    var params = datos.producto;
          producto.nombre ="Cocacola";
          producto.negocio ="5c4b64eb9d43c514ec0f0957";
          producto.precio =13.5;
          producto.disponibilidad = "Disponible";
          producto.cantidad = 12;
          producto.tipo = await Tipo.findById("5c4884160a1ca42b68044bc6");
          producto.foto = "";
          //usuario.eliminado = {usuario:"",};
          producto.descripcion = "Vevida refrescante";*/
       //   producto.creacion =cion
         // producto.modificacion = icacion;
          producto.save(async (error, nuevoProducto) => {
            if (error) {
                 console.log(error);
             // res.status(500).send({ mensaje: "error al guradar" })
            } else {
              console.log(nuevoProducto);
              var negocio= await Negocio.findByIdAndUpdate("5c4b64eb9d43c514ec0f0957",{ $inc: { productos: 1 } });
              io.emit('respuesta-producto', nuevoProducto);
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

      try {
        const bytes = CryptoJS.AES.decrypt(data, clave.clave);
        if (bytes.toString()) {
          var datos = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
          var tipo = new Tipo();
      /*    var params = datos.producto;
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
          producto.modificacion = params.modificacion;*/
          //  var tipo = new Tipo();
          var params = datos.tipo;
          tipo.nombre ="Gaseosa";
         
          tipo.save((error, nuevoTipo) => {
            if (error) {
                 console.log(error);
              //res.status(500).send({ mensaje: "error al guradar" })
            } else {
              //console.log("Negocio");
              console.log(nuevoTipo);
              io.emit('respuesta-registrar-tipos', nuevoTipo);
            }
          })

        }
        return data;
      } catch (e) {
        console.log(e);
      }

   
    });

    socket.on('registrar-producto', async (data) => {

      io.emit('respuesta', { user: socket.nickname, event: 'left' });
    });

  })


};
