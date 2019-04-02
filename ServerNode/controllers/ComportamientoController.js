"use strict"
var nodemailer = require('nodemailer');
var Producto=require('../schemas/producto');
var Negocio=require('../schemas/negocio');
var Crypto = require("../variables/desincryptar");
var Calificacion=require("../schemas/calificacion");
var mongoose=require("mongoose");
var Favorito = require("../schemas/favoritos");


module.exports = async function (io) {
    var clients = [];
    io.on('connection', async function (socket) {
      socket.on('agregar-favorito', async (data) => {
        try {
           var datos = await Crypto.Desincryptar(data);
            if (!datos.error) {

                var favorito=new Favorito();
                 favorito.producto=datos.idproducto;
                  favorito.usuario=datos.idsuario;
                  //favorito.fecha=new Date().toUTCString();
                
               try {
               var cantidad= await favorito.countDocuments({producto:datos.idproducto,usuario:datos.idsuario});
             //   await Producto.update({_id:producto},{ $pull: { "desvaloracion": {usuario:cliente}} });
             if(cantidad!=0){
                favorito.save((error, favoritos) => {
                    if (error) {
                      io.to(socket.id).emit('respuesta-agregar-favorito',{error: "error al calificar"});
                    //    res.status(500).send({ mensaje: "error al guradar" })
                    } else {
                      console.log(actualizado);
                      io.to(socket.id).emit('respuesta-agregar-favorito',{datos:favoritos});  
              //        io.emit('respuesta-actualizar-negocio-todos',{datos:actualizado});  
                      
                    }
                })
              }else{
                io.to(socket.id).emit('respuesta-agregar-favorito',{error: "el producto ya esta en los favoritos"});
              }
               } catch (error) {
                 console.log("error");
               }
                   }
        return data;
        }
        
        catch (e) {
          console.log(e);
        }
      });

      socket.on('quitar-favorito', async (data) => {
        try {
           var datos = await Crypto.Desincryptar(data);
            if (!datos.error) {

               
                
               try {
                Favorito.remove({producto:data.idproducto,usuario:data.idsuario},(error, nofavorito) => {
                    if (error) {
                      io.to(socket.id).emit('respuesta-quitar-favorito',{error: "error al borrar"});
                    //    res.status(500).send({ mensaje: "error al guradar" })
                    } else {
                      console.log(actualizado);
                      io.to(socket.id).emit('respuesta-quitar-favorito',{datos:nofavorito});  
              //        io.emit('respuesta-actualizar-negocio-todos',{datos:actualizado});  
                      
                    }
                })
           
               } catch (error) {
                 console.log("error");
               }
                   }
        return data;
        }
        
        catch (e) {
          console.log(e);
        }
      });

      socket.on('listar-favorito', async (data) => {
        
           
                
               try {
             //   await Producto.update({_id:producto},{ $pull: { "desvaloracion": {usuario:cliente}} });
                Favorito.find({usuario:data.idusuario},(error, favoritos) => {
                    if (error) {
                      io.to(socket.id).emit('respuesta-listar-favorito',{error: "error al listar"});
                    //    res.status(500).send({ mensaje: "error al guradar" })
                    } else {
                      console.log(actualizado);
                      io.to(socket.id).emit('respuesta-listar-favorito',{datos:favoritos});  
              //        io.emit('respuesta-actualizar-negocio-todos',{datos:actualizado});  
                      
                    }
                })
               } catch (error) {
                 console.log("error");
               }
                   
      
      });

        socket.on('calificar-producto', async (data) => {
            try {
               var datos = await Crypto.Desincryptar(data);
                if (!datos.error) {
    
                 
                    var cliente=datos.idcliente;
                    var producto=datos.idproducto;
                    var valoracion={usuario:cliente,fecha:new Date().toUTCString()};
                    
                   try {
                    await Producto.update({_id:producto},{ $pull: { "desvaloracion": {usuario:cliente}} });
                    Producto.findOneAndUpdate({_id:producto}, { $push: { valoracion: valoracion } },{new: true},(error, actualizado) => {
                        if (error) {
                          io.to(socket.id).emit('respuesta-calificar-producto',{error: "error al calificar"});
                        //    res.status(500).send({ mensaje: "error al guradar" })
                        } else {
                          console.log(actualizado);
                          io.to(socket.id).emit('respuesta-calificar-producto',{datos:actualizado});  
                  //        io.emit('respuesta-actualizar-negocio-todos',{datos:actualizado});  
                          
                        }
                    })
                   } catch (error) {
                     console.log("error");
                   }
                       }
            return data;
            }
            
            catch (e) {
              console.log(e);
            }
          });

          socket.on('denuncia-producto', async (data) => {
            /*     try {
                       var datos = await Crypto.Desincryptar(data);
                       if (!datos.error) {*/
                         
                       
                         var datos=JSON.parse(data);
                           
                          
                           var usuario=datos.idusuario;
                           var fecha=new Date().toUTCString();
                           
                         //  await Negocio.update({_id:datos.idnegocio},{ $pull: { "visitas": {usuario:datos.idcliente}} });
                           Producto.findOneAndUpdate({_id:datos.idproducto}, { $push: {denuncias: {usuario:usuario,fecha:fecha,detalle:datos.detalle} } },{new: true},(error, actualizado) => {
                               if (error) {
                                 console.log(error);
                                 io.to(socket.id).emit('respuesta-denuncia-negocio',{error: "error al guardar denuncia"});
                               //    res.status(500).send({ mensaje: "error al guradar" })
                               } else {
                                 console.log(actualizado);
                                 io.to(socket.id).emit('respuesta-denuncia-negocio',{datos:actualizado});  
                         //        io.emit('respuesta-actualizar-negocio-todos',{datos:actualizado});  
                                 
                               }
                           })
                      
                       /*          }
                   return data;
                   }
                   
                   catch (e) {
                     console.log(e);
                   }*/
                 });


          socket.on('calificar-negocio', async (data) => {
          try {
                var datos = await Crypto.Desincryptar(data);
                if (!datos.error) {
                  
                  var calificacion= new Calificacion();
                    
                    calificacion.usuario=datos.idcliente;
                    calificacion.negocio=datos.idnegocio;
                    calificacion.estrella=datos.estrella;
                    calificacion.fecha=new Date().toUTCString();
                    console.log(calificacion);
                    await Negocio.update({_id:datos.idnegocio},{ $pull: { "calificacion": {usuario:datos.idcliente}} });
                    Negocio.findOneAndUpdate({_id:datos.idnegocio}, { $push: {calificacion: calificacion } },{new: true},(error, actualizado) => {
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
                    await Producto.update({_id:producto},{ $pull: { "valoracion": {usuario:cliente} } });
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

          socket.on('visitas-grfica', async (data) => {

            console.log(data);
            /*     try {
                       var datos = await Crypto.Desincryptar(data);
                       if (!datos.error) {*/
             const ObjectId = mongoose.Types.ObjectId;
             var datos = JSON.parse(data);
             Negocio.aggregate([
              {$unwind : "$visitas"}, 
              {$match : {"_id":ObjectId(datos.idnegocio),"visitas.fecha":{
                $gte:new Date(datos.rangofecha.inicio),
                $lt:new Date(datos.rangofecha.fin)
            }}},
            { $project : { day : {$substr: ["$visitas.fecha", 0, 7] }}},
            {
                    $group : {
                   _id : "$day",  visitas : { $sum : 1 }}
                     
                      }
            ], function (error, lista) {
              if (error) {
      
                // res.status(500).send({ mensaje: "Error al listar" })
                io.to(socket.id).emit('respuesta-visitas-grfica', { error: "ocurrio un error al listar productos" });
              } else {
                if (!lista) {
                  //   res.status(404).send({ mensaje: "Error al listar" })
                  io.to(socket.id).emit('respuesta-visitas-grfica', { error: "no hay productos en la base de datos" });
                } else {

                  console.log(lista);
                  console.log("oifh reghu9nhgiuhfierhfuinhfephgceuep gy");
                  io.to(socket.id).emit('respuesta-visitas-grfica', lista);
                }
              }
            });
      
            /*          }
        return data;
        }
        
        catch (e) {
          console.log(e);
        }*/
          });
      
    });
}