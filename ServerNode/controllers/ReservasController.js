"use strict"
var Crypto = require("../variables/desincryptar");
var Reservas = require("../schemas/reservasproductos");
var Producto = require("../schemas/producto");
var moment = require("moment");

function sumarDias(fecha, dias) {
  fecha.setDate(fecha.getDate() + dias);
  return fecha;
}

module.exports = async function (io) {
  var clients = [];
  io.on('connection', async function (socket) {
    socket.on('reserva-producto', async (data) => {
      /*     try {
                 var datos = await Crypto.Desincryptar(data);
                 if (!datos.error) {*/
      var reserva = new Reservas();
      var datos = JSON.parse(data);
      var fecha = new Date().toUTCString();
      reserva.cliente = datos.idcliente;
      reserva.cantidad = datos.cantidad;
      reserva.negocio = datos.idnegocio;
      reserva.producto = datos.idproducto;
      var producto = await Producto.findById(datos.idproducto, { valoracion: 0, desvaloracion: 0, eliminado: 0, creacion: 0, modificacion: 0 });
      reserva.precioactual = producto.precio;
      reserva.tiempo = { fechareserva: fecha, fechalimite: moment(fecha).add(datos.tiempo, 'hours') };
      reserva.estado = "espera"
      console.log(fecha);
      console.log(console.log(reserva));
      if (producto.cantidad >= reserva.cantidad) {
        reserva.save(async (error, nuevaReserve) => {
          if (error) {
            io.to(socket.id).emit('respuesta-reserva-producto', { error: "error no se pudo guardar la reserva" });

            //    res.status(500).send({ mensaje: "error al guradar" })
          } else {
            //console.log(nuevoNegocio);

            await Producto.findByIdAndUpdate(datos.idproducto, { "$inc": { "cantidad": -reserva.cantidad } });
            io.emit('respuesta-reserva-producto', nuevaReserve);
          }
        })
      } else {
        io.to(socket.id).emit('respuesta-reserva-producto', { error: "Cantidad no disponible" });
      }

      /*          }
  return data;
  }
  
  catch (e) {
    console.log(e);
  }*/
    });


    socket.on('cambiar-reserva', async (data) => {
      /*     try {
                 var datos = await Crypto.Desincryptar(data);
                 if (!datos.error) {*/
      var reserva = new Reservas();
      var datos = JSON.parse(data);
      reserva.cantidad = datos.cantidad;
      reserva.estado = datos.estado;

     if(datos.cantidad){
      Reservas.findByIdAndUpdate(datos._id, reserva, { new: true }, async (error, actualizado) => {
        if (error) {
          io.to(socket.id).emit('respuesta-cambiar-reserva', { error: "error no se pudo guardar la reserva" });

          //    res.status(500).send({ mensaje: "error al guradar" })
        } else {
          if(datos.cantidad>datos.cantidadanterior){
            var cantidad=datos.cantidad-datos.cantidadanterior;
            await Producto.findByIdAndUpdate(datos.idproducto, { "$inc": { "cantidad": -cantidad } });
          }else{
            var cantidad=datos.cantidadanterior-datos.cantidad;
            await Producto.findByIdAndUpdate(datos.idproducto, { "$inc": { "cantidad": reserva.cantidad } });
          }
          //console.log(nuevoNegocio);
          io.emit('respuesta-cambiar-reserva', actualizado);
        }
      })
 

     }else{
      Reservas.findByIdAndUpdate(datos._id, reserva, { new: true }, async (error, actualizado) => {
        if (error) {
          io.to(socket.id).emit('respuesta-cambiar-reserva', { error: "error no se pudo guardar la reserva" });

          //    res.status(500).send({ mensaje: "error al guradar" })
        } else {
          //console.log(nuevoNegocio);
          io.emit('respuesta-cambiar-reserva', actualizado);
        }
      })
    }

      /*          }
  return data;
  }
  
  catch (e) {
    console.log(e);
  }*/
    });


  });
}