"use strict"
var nodemailer = require('nodemailer');
var Producto=require('../schemas/producto');
var Negocio=require('../schemas/negocio');
var Crypto = require("../variables/desincryptar");
module.exports = async function (io) {
    var clients = [];
    io.on('connection', async function (socket) {
        socket.on('calificar-producto', async (data) => {
            try {
                var datos = await Crypto.Desincryptar(data);
                if (!datos.error) {
                    var cliente=datos.idcliente;
                    var producto=datos.idproducto;
                    var valoracion={usuario:cliente,fecha:datos.fecha}
                    await Producto.update({_id:producto},{ $pull: { 'desvaloracion.usuario': cliente } });
                    Producto.findOneAndUpdate({_id:producto}, { $push: { valoracion: valoracion } },{new: true},(error, actualizado) => {
                        if (error) {
                          io.to(socket.id).emit('respuesta-calificar-producto',{error: "error al calificar"});
                        //    res.status(500).send({ mensaje: "error al guradar" })
                        } else {
                          io.to(socket.id).emit('respuesta-calificar-producto',{datos:actualizado});  
                  //        io.emit('respuesta-actualizar-negocio-todos',{datos:actualizado});  
                          
                        }
                    })

               
            }
            return data;
            }
            
            catch (e) {
              console.log(e);
            }
          });

          socket.on('calificar-negocio', async (data) => {
            try {
                var datos = await Crypto.Desincryptar(data);
                if (!datos.error) {
                    var cliente=datos.idcliente;
                    var negocio=datos.idnegocio;
                    var calificacion={usuario:cliente,fecha:datos.fecha,puntuacion:datos.puntuacion}
                    await Producto.update({_id:negocio},{ $pull: { 'calificacion.usuario': cliente } });
                    Negocio.findOneAndUpdate({_id:negocio}, { $push: { calificacion: calificacion } },{new: true},(error, actualizado) => {
                        if (error) {
                          io.to(socket.id).emit('respuesta-calificar-negocio',{error: "error al calificar"});
                        //    res.status(500).send({ mensaje: "error al guradar" })
                        } else {
                          io.to(socket.id).emit('respuesta-calificar-negocio',{datos:actualizado});  
                  //        io.emit('respuesta-actualizar-negocio-todos',{datos:actualizado});  
                          
                        }
                    })
               
            }
            return data;
            }
            
            catch (e) {
              console.log(e);
            }
          });

          socket.on('descalificar-producto', async (data) => {
            try {
                var datos = await Crypto.Desincryptar(data);
                if (!datos.error) {
                    var cliente=datos.idcliente;
                    var producto=datos.idproducto;
                    var valoracion={usuario:cliente,fecha:datos.fecha}
                    await Producto.update({_id:producto},{ $pull: { 'valoracion.usuario': cliente } });
                    Producto.findOneAndUpdate({_id:producto}, { $push: { desvaloracion: valoracion } },{new: true},(error, actualizado) => {
                        if (error) {
                          io.to(socket.id).emit('respuesta-descalificar-producto',{error: "error al guradar nuevos datos"});
                        //    res.status(500).send({ mensaje: "error al guradar" })
                        } else {
                          io.to(socket.id).emit('respuesta-descalificar-producto',{datos:actualizado});  
                        //  io.emit('respuesta-actualizar-negocio-todos',{datos:actualizado});  
                          
                        }
                    })

               
            }
            return data;
            }
            
            catch (e) {
              console.log(e);
            }
          });
    });
}