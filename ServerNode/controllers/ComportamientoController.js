"use strict"
var nodemailer = require('nodemailer');
var Producto = require('../schemas/producto');
var Negocio = require('../schemas/negocio');
var Crypto = require("../variables/desincryptar");
var Calificacion = require("../schemas/calificacion");
var mongoose = require("mongoose");
var Favorito = require("../schemas/favoritos");


module.exports = async function (io) {
  var clients = [];
  io.on('connection', async function (socket) {
    socket.on('agregar-favorito', async (data) => {
      console.log("entro favor", data);
      try {
        var datos = await Crypto.Desincryptar(data);

        if (!datos.error) {

          var favorito = new Favorito();
          favorito.producto = datos.idproducto;
          favorito.usuario = datos.idsuario;
          favorito.tipo = datos.tipoproducto;
          //favorito.fecha=new Date().toUTCString();
          console.log("soy favorito:", favorito);

          try {
            var cantidad = await Favorito.countDocuments({ producto: datos.idproducto, usuario: datos.idsuario });
            console.log("yosoy la cantidad:", cantidad);
            //   await Producto.update({_id:producto},{ $pull: { "desvaloracion": {usuario:cliente}} });
            if (cantidad == 0) {
              favorito.save((error, favoritos) => {
                if (error) {
                  io.to(socket.id).emit('respuesta-agregar-favorito', { error: "error al calificar" });
                  //    res.status(500).send({ mensaje: "error al guradar" })
                } else {
                  // console.log(actualizado);
                  io.to(socket.id).emit('respuesta-agregar-favorito', { datos: favoritos });
                  //        io.emit('respuesta-actualizar-negocio-todos',{datos:actualizado});  

                }
              })
            } else {
              io.to(socket.id).emit('respuesta-agregar-favorito', { error: "el producto ya esta en los favoritos" });
            }
          } catch (error) {
            console.log("error", error);
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
            Favorito.remove({ producto: data.idproducto, usuario: data.idsuario }, (error, nofavorito) => {
              if (error) {
                io.to(socket.id).emit('respuesta-quitar-favorito', { error: "error al borrar" });
                //    res.status(500).send({ mensaje: "error al guradar" })
              } else {
                console.log(actualizado);
                io.to(socket.id).emit('respuesta-quitar-favorito', { datos: nofavorito });
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

    //LISTAR TODOS LOS FAVORITOS
    socket.on('listar-favoritos', async (data) => {


      console.log("entraste lista", data);
      try {
        //   await Producto.update({_id:producto},{ $pull: { "desvaloracion": {usuario:cliente}} });
        Favorito.find({ usuario: data.idusuario }, (error, favoritos) => {
          if (error) {
            io.to(socket.id).emit('respuesta-listar-favoritos', { error: "error al listar" });
            //    res.status(500).send({ mensaje: "error al guradar" })
          } else {
            //console.log(favoritos);
            io.to(socket.id).emit('respuesta-listar-favoritos', { datos: favoritos });
            //        io.emit('respuesta-actualizar-negocio-todos',{datos:actualizado});  

          }
        })
      } catch (error) {
        console.log("error");
      }


    });

    //INICIO DE FAVORITO POR TIPO DE LICORERIAS

    socket.on('listar-favorito-licores', async (data) => {


      console.log("entraste lista", data);
      try {
        //   await Producto.update({_id:producto},{ $pull: { "desvaloracion": {usuario:cliente}} });
        Favorito.find({ usuario: data.idusuario, tipo: "Licoreria" }, (error, favoritos) => {
          if (error) {
            io.to(socket.id).emit('respuesta-listar-favorito-licores', { error: "error al listar" });
            //    res.status(500).send({ mensaje: "error al guradar" })
          } else {
            //console.log(favoritos);
            io.to(socket.id).emit('respuesta-listar-favorito-licores', { datos: favoritos });
            //        io.emit('respuesta-actualizar-negocio-todos',{datos:actualizado});  

          }
        })
      } catch (error) {
        console.log("error");
      }


    });

    //INICIO DE FAVORITOS POR TIPO DE MOTELES

    socket.on('listar-favorito-moteles', async (data) => {


      console.log("entraste lista", data);
      try {
        //   await Producto.update({_id:producto},{ $pull: { "desvaloracion": {usuario:cliente}} });
        Favorito.find({ usuario: data.idusuario, tipo: "Motel" }, (error, favoritos) => {
          if (error) {
            io.to(socket.id).emit('respuesta-listar-favorito-moteles', { error: "error al listar" });
            //    res.status(500).send({ mensaje: "error al guradar" })
          } else {
            //console.log(favoritos);
            io.to(socket.id).emit('respuesta-listar-favorito-moteles', { datos: favoritos });
            //        io.emit('respuesta-actualizar-negocio-todos',{datos:actualizado});  

          }
        })
      } catch (error) {
        console.log("error");
      }


    });


    // INICIOO DE FAVORITOS POR TIPO DE SEXHOPS

    socket.on('listar-favorito-sexshops', async (data) => {


      console.log("entraste lista", data);
      try {
        //   await Producto.update({_id:producto},{ $pull: { "desvaloracion": {usuario:cliente}} });
        Favorito.find({ usuario: data.idusuario, tipo: "SexShop" }, (error, favoritos) => {
          if (error) {
            io.to(socket.id).emit('respuesta-listar-favorito-sexshops', { error: "error al listar" });
            //    res.status(500).send({ mensaje: "error al guradar" })
          } else {
            //console.log(favoritos);
            io.to(socket.id).emit('respuesta-listar-favorito-sexshops', { datos: favoritos });
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
        console.log("datos: ",datos);
        if (!datos.error) {
          var cliente = datos.idcliente;
          var producto = datos.idproducto;
          var valoracion = { usuario: cliente, fecha: new Date().toUTCString() };

          try {
            await Producto.update({ _id: producto }, { $pull: { "desvaloracion": { usuario: cliente } } });
            Producto.findOneAndUpdate({ _id: producto }, { $push: { valoracion: valoracion } }, { new: true }, (error, actualizado) => {
              if (error) {
                io.to(socket.id).emit('respuesta-calificar-producto', { error: "error al calificar" });
                //    res.status(500).send({ mensaje: "error al guradar" })
              } else {
                console.log(actualizado);
                io.to(socket.id).emit('respuesta-calificar-producto', { datos: actualizado });
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

    socket.on('visitar-negocio', async (datos) => {

      console.log(datos)
      var cliente = datos.idcliente;
      var negocio = datos.idnegocio;
      var fecha = new Date().toUTCString();
      var visita = { usuario: cliente, fecha: fecha }

      Negocio.findOneAndUpdate({ _id: negocio }, { $push: { visitas: visita } }, { new: true }, (error, actualizado) => {
        if (error) {
          io.to(socket.id).emit('respuesta-visitar-negocio', { error: "error contar visita" });

          //    res.status(500).send({ mensaje: "error al guradar" })
        } else {
          console.log(actualizado);
          io.to(socket.id).emit('respuesta-visitar-negocio', { datos: actualizado });
          //        io.emit('respuesta-actualizar-negocio-todos',{datos:actualizado});  

        }
      })

    });

    socket.on('listar-denuncia', async (datos) => {
    console.log(datos);
      if (datos.idcliente) {
  /*    Producto.find({"denuncias.usuario": { $all: [datos.idcliente]}},{denuncias:$size},(error,data)=>{
           io.to(socket.id).emit('respuesta-listar-denuncia', { datos: data });
        })*/
        const ObjectId = mongoose.Types.ObjectId;
        var producto = await Producto.aggregate([
          {
            $match: {
              "denuncias.usuario": { $all: [ObjectId(datos.idcliente)]},
              "eliminado.estado": false,
              
            }
          },
          {
            $project: {
              _id: "$_id",
              "denuncias": { $size: "$denuncias" },
              "likes": { $size: "$valoracion.usuario" },
              "dislike": { $size: "$desvaloracion.usuario" },
              "eliminado": "$eliminado",
              "foto": { miniatura: "$foto.miniatura" },
              "creacion": "$creacion",
              "modificacion": "$modificacion",
              "nombre": "$nombre",
              "negocio": "$negocio",
              "estado": "$estado",
              "precio": "$precio",
              "tipo": "$tipo",
              "descripcion": "$descripcion"
            }
          },
          { $sort: { "denuncias": 1 } },

        ])
 
        io.to(socket.id).emit('respuesta-listar-denuncia', { datos: producto });
      } else if(datos.iddueno){
        var negocios = await Negocio.find({ titular: datos.iddueno }, { titular: 1 })
     
        const ObjectId = mongoose.Types.ObjectId;
        var productos=[];
        for (let index = 0; index < negocios.length; index++) {
          const element = negocios[index];
     
          var producto = await Producto.aggregate([
            {
              $match: {
                negocio: ObjectId(element._id),
                "denuncias.0": { "$exists": true },
                "eliminado.estado": false,
                
              }
            },
            {
              $project: {
                _id: "$_id",
                "denuncias": { $size: "$denuncias" },
                "likes": { $size: "$valoracion.usuario" },
                "dislike": { $size: "$desvaloracion.usuario" },
                "eliminado": "$eliminado",
                "foto": { miniatura: "$foto.miniatura" },
                "creacion": "$creacion",
                "modificacion": "$modificacion",
                "nombre": "$nombre",
                "negocio": "$negocio",
                "estado": "$estado",
                "precio": "$precio",
                "tipo": "$tipo",
                "descripcion": "$descripcion"
              }
            },
            { $sort: { "denuncias": 1 } },

          ])

          // var producto=await Producto.find({negocio:ObjectId(element._id),"denuncias.0": { "$exists": true }})
 for (let index2 = 0; index2 < producto.length; index2++) {
   const element2 = producto[index2];
   productos.push(element2); 
 }
      
        }

    
        io.to(socket.id).emit('respuesta-listar-denuncia', { datos: productos });
        /*  Producto.find({"denuncias.usuario":{ $all: [usuario] }},{},(error,lista)=>{
              if(error){
                io.to(socket.id).emit('respuesta-listar-denuncia', { error: "error listar Denuncias" });
              }else{
                io.to(socket.id).emit('respuesta-listar-denuncia', { datos: lista });
              }
    
            })*/
      }else{
        const ObjectId = mongoose.Types.ObjectId;
        var producto = await Producto.aggregate([
          {
            $match: {
              "denuncias.0": { "$exists": true },
              "eliminado.estado": false,
              
            }
          },
 {
          "$lookup": {
            "from": "negocios", 
            "localField": "negocio", 
            "foreignField": "_id", 
            "as": "negociodata"
          }
        },
        
        { $project: {
              _id: "$_id",
              "denuncias": { $size: "$denuncias" },
              "likes": { $size: "$valoracion.usuario" },
              "dislike": { $size: "$desvaloracion.usuario" },
              "eliminado": "$eliminado",
              "foto": { miniatura: "$foto.miniatura" },
              "creacion": "$creacion",
              "modificacion": "$modificacion",
              "nombre": "$nombre",
              "negocio": {nombre:{ $arrayElemAt: [ "$negociodata.nombre", 0 ] },"_id":{ $arrayElemAt: [ "$negociodata._id", 0 ] }},
              "estado": "$estado",
              "precio": "$precio",
              "tipo": "$tipo",
              "descripcion": "$descripcion"
             }
         },
          { $sort: { "denuncias": 1 } },

        ])
        console.log(producto);
        io.to(socket.id).emit('respuesta-listar-denuncia', { datos: producto });
      }

    });

    socket.on('denuncia-producto', async (datos) => {
      /*     try {
                 var datos = await Crypto.Desincryptar(data);
                 if (!datos.error) {*/
      //   var datos=JSON.parse(data);
      var usuario = datos.idusuario;
      var fecha = new Date().toUTCString();

      var count = await Producto.count({ _id: datos.idproducto, "denuncias.usuario": { $all: [usuario] } });
      console.log(count);
      if (count == 0) {
        Producto.findOneAndUpdate({ _id: datos.idproducto }, { $push: { denuncias: { usuario: usuario, fecha: fecha, detalle: datos.detalle } } }, { new: true }, (error, actualizado) => {
          if (error) {
            console.log(error);
            io.to(socket.id).emit('respuesta-denuncia-negocio', { error: "error al guardar denuncia" });
            //    res.status(500).send({ mensaje: "error al guradar" })
          } else {
            console.log(actualizado);
            io.to(socket.id).emit('respuesta-denuncia-negocio', { datos: actualizado });
            //        io.emit('respuesta-actualizar-negocio-todos',{datos:actualizado});  

          }
        })
      } else {
        io.to(socket.id).emit('respuesta-denuncia-negocio', { error: "error solo se permite una denuncia por producto" });
      }

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

          var calificacion = new Calificacion();

          calificacion.usuario = datos.idcliente;
          calificacion.negocio = datos.idnegocio;
          calificacion.estrella = datos.estrella;
          calificacion.fecha = new Date().toUTCString();
          console.log(calificacion);
          await Negocio.update({ _id: datos.idnegocio }, { $pull: { "calificacion": { usuario: datos.idcliente } } });
          Negocio.findOneAndUpdate({ _id: datos.idnegocio }, { $push: { calificacion: calificacion } }, { new: true }, (error, actualizado) => {
            if (error) {
              io.to(socket.id).emit('respuesta-calificar-negocio', { error: "error al calificar" });
              //    res.status(500).send({ mensaje: "error al guradar" })
            } else {
              io.to(socket.id).emit('respuesta-calificar-negocio', { datos: actualizado });
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

          var cliente = datos.idcliente;
          var producto = datos.idproducto;
          var valoracion = { usuario: cliente, fecha: datos.fecha }
          await Producto.update({ _id: producto }, { $pull: { "valoracion": { usuario: cliente } } });
          Producto.findOneAndUpdate({ _id: producto }, { $push: { desvaloracion: valoracion } }, { new: true }, (error, actualizado) => {
            if (error) {
              io.to(socket.id).emit('respuesta-descalificar-producto', { error: "error al guradar nuevos datos" });
              //    res.status(500).send({ mensaje: "error al guradar" })
            } else {
              io.to(socket.id).emit('respuesta-descalificar-producto', { datos: actualizado });
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

    socket.on('visitas-grafica', async (datos) => {

      console.log(datos);
      /*     try {
                 var datos = await Crypto.Desincryptar(data);
                 if (!datos.error) {*/
      const ObjectId = mongoose.Types.ObjectId;
      //var datos = JSON.parse(data);
      Negocio.aggregate([
        { $unwind: "$visitas" },
        {
          $match: {
            "_id": ObjectId(datos.idnegocio), "visitas.fecha": {
              $gte: new Date(datos.rangofecha.inicio),
              $lt: new Date(datos.rangofecha.fin)
            }
          }
        },
        { $project: { day: { $substr: ["$visitas.fecha", 0, 7] } } },
        {
          $group: {
            _id: "$day", visitas: { $sum: 1 }
          }

        },
        { $sort: { "_id": 1 } },
      ], function (error, lista) {
        if (error) {
          console.log(error);
          // res.status(500).send({ mensaje: "Error al listar" })
          io.to(socket.id).emit('respuesta-visitas-grfica', { error: "ocurrio un error al listar visitas" });
        } else {
          if (!lista) {
            //   res.status(404).send({ mensaje: "Error al listar" })
            io.to(socket.id).emit('respuesta-visitas-grfica', { error: "no hay visitas en la base de datos" });
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