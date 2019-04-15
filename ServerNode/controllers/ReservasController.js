"use strict"
var Crypto = require("../variables/desincryptar");
var Reservas = require("../schemas/reservasproductos");
var Producto = require("../schemas/producto");
var moment = require("moment");
var Negocio = require("../schemas/negocio");

function sumarDias(fecha, dias) {
  fecha.setDate(fecha.getDate() + dias);
  return fecha;
}

module.exports = async function (io) {
  var clients = [];

  io.on('connection', async function (socket) {

    socket.on('reserva-producto', async (data) => {
      console.log("Reserva backend");
      /*     try {
                 var datos = await Crypto.Desincryptar(data);
                 if (!datos.error) {*/
      var reserva = new Reservas();
      var datos = data;
      var fecha = new Date().toUTCString();
      reserva.cliente = datos.idcliente;
      reserva.cantidad = datos.cantidad;
      reserva.producto = datos.idproducto;
      var producto = await Producto.findById(datos.idproducto, { valoracion: 0, desvaloracion: 0, eliminado: 0, creacion: 0, modificacion: 0 });
      //var dueno =await Dueno.findById(producto.pro);
      var negocio = await Negocio.findById(producto.negocio);
      reserva.negocio = producto.negocio
      reserva.dueno = negocio.titular;
      reserva.precioactual = producto.precio;
      reserva.tiempo = { fechareserva: fecha, fechalimite: moment(fecha).add(datos.tiempo, 'hours') };
      reserva.estado = "espera"
      reserva.save(async (error, nuevaReserve) => {
        if (error) {
          console.log(error);
          io.to(socket.id).emit('respuesta-reserva-producto', { error: "error no se pudo guardar la reserva" });

          //    res.status(500).send({ mensaje: "error al guradar" })
        } else {
          //console.log(nuevoNegocio);


          console.log("Guardado")
          io.emit('respuesta-reserva-producto', nuevaReserve);
        }
      })


      /*          }
  return data;
  }
  
  catch (e) {
    console.log(e);
  }*/
    });

    /* socket.on('reserva-producto', async (data) => {
       console.log("Reserva backend");
       /*     try {
                  var datos = await Crypto.Desincryptar(data);
                  if (!datos.error) {*/
    /*  var reserva = new Reservas();
      var datos = data;
      var fecha = new Date().toUTCString();
      reserva.cliente = datos.idcliente;
      reserva.cantidad = datos.cantidad;
      reserva.producto = datos.idproducto;
      var producto = await Producto.findById(datos.idproducto, { valoracion: 0, desvaloracion: 0, eliminado: 0, creacion: 0, modificacion: 0 });
      //var dueno =await Dueno.findById(producto.pro);
      var negocio= await Negocio.findById(producto.negocio);
      reserva.negocio=producto.negocio
      reserva.dueno=negocio.titular;
      reserva.precioactual = producto.precio;
      reserva.tiempo = { fechareserva: fecha, fechalimite: moment(fecha).add(datos.tiempo, 'hours') };
      reserva.estado = "espera"
      if (producto.cantidad >= reserva.cantidad) {
        reserva.save(async (error, nuevaReserve) => {
          if (error) {
            console.log(error);
            io.to(socket.id).emit('respuesta-reserva-producto', { error: "error no se pudo guardar la reserva" });

            //    res.status(500).send({ mensaje: "error al guradar" })
          } else {
            //console.log(nuevoNegocio);
            
            await Producto.findByIdAndUpdate(datos.idproducto, { "$inc": { "cantidad": -(reserva.cantidad )} });
            console.log("Guardado")
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
    //  });


    socket.on('cambiar-reserva', async (data) => {

      var reserva = new Reservas();
      var datos = data;
      reserva._id = datos._id;
      reserva.cantidad = datos.cantidad;
      reserva.estado = datos.estado;

      if (datos.cantidad) {
        Reservas.findByIdAndUpdate(datos._id, reserva, { new: true }, async (error, actualizado) => {
          if (error) {

            io.to(socket.id).emit('respuesta-cambiar-reserva', { error: "error no se pudo guardar la reserva" });


          } else {

            io.emit('respuesta-cambiar-reserva', actualizado);
          }
        })
      } else {

        Reservas.findByIdAndUpdate(datos._id, reserva, { new: true }, async (error, actualizado) => {
          if (error) {

            io.to(socket.id).emit('respuesta-cambiar-reserva', { error: "error no se cambiar estado" });
            // io.to(socket.id).emit('respuesta-cambiar-reserva', { error: "error no se pudo guardar la reserva" });

          } else {

            io.emit('respuesta-cambiar-reserva', actualizado);
          }
        })
      }


    });


    /*    socket.on('cambiar-reserva', async (data) => {
        
          var reserva = new Reservas();
          var datos = JSON.parse(data);
          reserva.cantidad = datos.cantidad;
          reserva.estado = datos.estado;
    
         if(datos.cantidad){
          Reservas.findByIdAndUpdate(datos._id, reserva, { new: true }, async (error, actualizado) => {
            if (error) {
              io.to(socket.id).emit('respuesta-cambiar-reserva', { error: "error no se pudo guardar la reserva" });
    
          
            } else {
              if(datos.cantidad>datos.cantidadanterior){
                var cantidad=datos.cantidad-datos.cantidadanterior;
                await Producto.findByIdAndUpdate(datos.idproducto, { "$inc": { "cantidad": -cantidad } });
              }else{
                var cantidad=datos.cantidadanterior-datos.cantidad;
                await Producto.findByIdAndUpdate(datos.idproducto, { "$inc": { "cantidad": reserva.cantidad } });
              }
           
              io.emit('respuesta-cambiar-reserva', actualizado);
            }
          })
     
    
         }else{
          Reservas.findByIdAndUpdate(datos._id, reserva, { new: true }, async (error, actualizado) => {
            if (error) {
              io.to(socket.id).emit('respuesta-cambiar-reserva', { error: "error no se pudo guardar la reserva" });
    
             
            } else {
             
              io.emit('respuesta-cambiar-reserva', actualizado);
            }
          })
        }
    
       
        });
    
    */

    socket.on('listar-reserva', async (data) => {
      /*     try {
                 var datos = await Crypto.Desincryptar(data);
                 if (!datos.error) {*/
      console.log(clients);
      var datos = data;

      if (datos.idcliente) {
        clients.push({ socketid: socket.id, idcliente: datos.idcliente });
        Reservas.find({ cliente: datos.idcliente }, {}, (error, reservsas) => {
          if (error) {
            io.to(socket.id).emit('respuesta-listrar-reserva', { error: "error no se pudo listar la reserva" });
          }

          io.to(socket.id).emit('respuesta-listrar-reserva', reservsas);
        })
      } else {
        var query = {};
        console.log(datos);

        if (datos.estado == "espera") {
          query = { dueno: datos.iddueno, $or: [{ estado: datos.estado }, { estado: "confirmacion" }] };
        } else {
          query = { dueno: datos.iddueno, estado: datos.estado }
        }
        Reservas.find(query, {}, (error, reservsas) => {
          if (error) {
            io.to(socket.id).emit('respuesta-listrar-reserva', { error: "error no se pudo listar la reserva" });
          }
          io.to(socket.id).emit('respuesta-listrar-reserva', reservsas);
        })
      }

      /*          }
  return data;
  }
  
  catch (e) {
    console.log(e);
  }*/
    });

    socket.on('listar-reserva-rango', async (data) => {
      /*     try {
                 var datos = await Crypto.Desincryptar(data);
                 if (!datos.error) {*/
      var datos = JSON.parse(data);
      Reservas.find({
        "tiempo.fechareserva": {
          "$gte": new Date(datos.rangofecha.inicio),
          "$lt": new Date(datos.rangofecha.fin)
        }
      }, {}, (error, reservsas) => {
        if (error) {
          io.to(socket.id).emit('respuesta-listrar-reserva-rango', { error: "error no se pudo listar la reserva" });
        }
        console.log("Reservas", reservsas);
        io.to(socket.id).emit('respuesta-listrar-reserva-rango', reservsas);
      })


      /*          }
  return data;
  }
  
  catch (e) {
    console.log(e);
  }*/
    });
  });
}