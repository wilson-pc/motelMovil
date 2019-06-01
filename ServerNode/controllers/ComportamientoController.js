"use strict"
var Producto = require('../schemas/producto');
var Negocio = require('../schemas/negocio');
var Crypto = require("../variables/desincryptar");
var Calificacion = require("../schemas/calificacion");
var mongoose = require("mongoose");
var Favorito = require("../schemas/favoritos");
var Reservas = require("../schemas/reservasproductos");
var Deseos = require("../schemas/deseos");


module.exports = async function (io) {
  var clients = [];
  io.on('connection', async function (socket) {

    socket.on('agregar-deseos', async (data) => {
      console.log("agregar");
      try {
        var datos = data;

        if (!datos.error) {

          var deseos = new Deseos();
          deseos.producto = datos.idproducto;
          deseos.usuario = datos.idsuario;
          deseos.tipo = datos.tipoproducto;
          //favorito.fecha=new Date().toUTCString();
          console.log(deseos);

          try {
            var cantidad = await Deseos.countDocuments({ producto: datos.idproducto, usuario: datos.idsuario });
            console.log(cantidad);
            //   await Producto.update({_id:producto},{ $pull: { "desvaloracion": {usuario:cliente}} });
            if (cantidad == 0) {
              deseos.save(async (error, deseo) => {
                if (error) {
                  console.log(error);
                  io.to(socket.id).emit('respuesta-agregar-deseos', { error: "error a agregar a deseos" });
                  //    res.status(500).send({ mensaje: "error al guradar" })
                } else {
                  io.to(socket.id).emit('respuesta-agregar-deseos', { exito: "agregado a deseo con exito" });
                  //        io.emit('respuesta-actualizar-negocio-todos',{datos:actualizado});  

                }
              })
            } else {
              console.log("ya existe");
              io.to(socket.id).emit('respuesta-agregar-deseos', { error: "el producto ya esta en los deseos" });
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

    socket.on('quitar-deseos', async (data) => {

      try {

        Deseos.remove({ producto: data.idproducto, usuario: data.idsuario }, (error, ndeseos) => {
          if (error) {
            io.to(socket.id).emit('respuesta-quitar-deseos', { error: "error al borrar" });
            //    res.status(500).send({ mensaje: "error al guradar" })
          } else {
            io.to(socket.id).emit('respuesta-quitar-deseos', { datos: data.idproducto });
            //        io.emit('respuesta-actualizar-negocio-todos',{datos:actualizado});  

          }
        })

      } catch (error) {
        console.log("error");
      }
    }
    );

    socket.on('listar-deseos-moteles', async (data) => {
      console.log(data);
      try {
        //   await Producto.update({_id:producto},{ $pull: { "desvaloracion": {usuario:cliente}} });
        Deseos.find({ usuario: data.idusuario, tipo: "Motel" }).populate('producto', { fotos: 0, "foto.normal": 0 }).exec((error, deseos) => {
          if (error) {
            io.to(socket.id).emit('respuesta-listar-deseos-moteles', { error: "error al listar" });
            //    res.status(500).send({ mensaje: "error al guradar" })
          } else {
            console.log("favoritos exito", deseos.length);
            io.to(socket.id).emit('respuesta-listar-deseos-moteles', { datos: deseos });
            //        io.emit('respuesta-actualizar-negocio-todos',{datos:actualizado});  

          }
        })
      } catch (error) {
        console.log("error");
      }


    });

    socket.on('agregar-favorito', async (data) => {
      console.log("agregar");
      try {
        var datos = await Crypto.Desincryptar(data);

        if (!datos.error) {

          var favorito = new Favorito();
          favorito.producto = datos.idproducto;
          favorito.usuario = datos.idsuario;
          favorito.tipo = datos.tipoproducto;
          //favorito.fecha=new Date().toUTCString();


          try {
            var cantidad = await Favorito.countDocuments({ producto: datos.idproducto, usuario: datos.idsuario });

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
        Favorito.remove({ producto: data.idproducto, usuario: data.idsuario }, (error, nofavorito) => {
          if (error) {
            io.to(socket.id).emit('respuesta-quitar-favorito', { error: "error al borrar" });
            //    res.status(500).send({ mensaje: "error al guradar" })
          } else {

            io.to(socket.id).emit('respuesta-quitar-favorito', { datos: data.idproducto });
            //        io.emit('respuesta-actualizar-negocio-todos',{datos:actualizado});  

          }
        })

      } catch (error) {
        io.to(socket.id).emit('respuesta-quitar-favorito', { error: "error al borrar" });
      }
    }
    );

    //LISTAR TODOS LOS FAVORITOS
    socket.on('listar-favoritos', async (data) => {
      try {
        //   await Producto.update({_id:producto},{ $pull: { "desvaloracion": {usuario:cliente}} });
        Favorito.find({ usuario: data.idusuario }).populate('producto', { fotos: 0, "foto.normal": 0 }).exec((error, favoritos) => {
          console.log(favoritos);
          if (error) {
            io.to(socket.id).emit('respuesta-listar-favoritos', { error: "error al listar" });
            //    res.status(500).send({ mensaje: "error al guradar" })
          } else {
            console.log(favoritos);
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
      console.log(data);
      try {
        //   await Producto.update({_id:producto},{ $pull: { "desvaloracion": {usuario:cliente}} });
        Favorito.find({ usuario: data.idusuario, tipo: "Motel" }).populate('producto', { fotos: 0, "foto.normal": 0 }).exec((error, favoritos) => {
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
        if (!datos.error) {
          console.log(datos);
          var cliente = datos.idcliente;
          var producto = datos.idproducto;
          var valoracion = { usuario: cliente, fecha: new Date().toUTCString() };

          try {
            var countReservas = await Reservas.count({ cliente: cliente, producto: producto });
            console.log(countReservas);
            if (countReservas > 0) {
              await Producto.update({ _id: producto }, { $pull: { "desvaloracion": { usuario: cliente } } });
              var countlikes = await Producto.count({ _id: producto, "valoracion.usuario": cliente });
              console.log(countlikes);
              if (countlikes < 1) {
                Producto.findOneAndUpdate({ _id: producto }, { $push: { valoracion: valoracion } }, { new: true }, (error, actualizado) => {
                  if (error) {
                    io.to(socket.id).emit('respuesta-calificar-producto', { error: "error al calificar" });
                    //    res.status(500).send({ mensaje: "error al guradar" })
                  } else {
                    io.to(socket.id).emit('respuesta-calificar-producto', { datos: producto });
                    //        io.emit('respuesta-actualizar-negocio-todos',{datos:actualizado});  

                  }
                })
              } else {
                io.to(socket.id).emit('respuesta-calificar-producto', { error: "ya calificaste este producto" });
              }
            } else {
              io.to(socket.id).emit('respuesta-calificar-producto', { error: "primero deves reservar el producto " });
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

    socket.on('visitar-negocio', async (datos) => {

      var cliente = datos.idcliente;
      var negocio = datos.idnegocio;
      var fecha = new Date().toUTCString();
      var visita = { usuario: cliente, fecha: fecha }

      Negocio.findOneAndUpdate({ _id: negocio }, { $push: { visitas: visita } }, { new: true }, (error, actualizado) => {
        if (error) {
          io.to(socket.id).emit('respuesta-visitar-negocio', { error: "error contar visita" });

          //    res.status(500).send({ mensaje: "error al guradar" })
        } else {
          io.to(socket.id).emit('respuesta-visitar-negocio', { datos: actualizado });
          //        io.emit('respuesta-actualizar-negocio-todos',{datos:actualizado});  

        }
      })

    });

    socket.on('listar-denuncia', async (datos) => {


      if (datos.idcliente) {
        /*    Producto.find({"denuncias.usuario": { $all: [datos.idcliente]}},{denuncias:$size},(error,data)=>{
                 io.to(socket.id).emit('respuesta-listar-denuncia', { datos: data });
              })*/
        const ObjectId = mongoose.Types.ObjectId;
        var producto = await Producto.aggregate([
          {
            $match: {
              "denuncias.usuario": { $all: [ObjectId(datos.idcliente)] },
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
      } else if (datos.iddueno) {
        var negocios = await Negocio.find({ titular: datos.iddueno }, { titular: 1 })
        console.log(negocios);

        const ObjectId = mongoose.Types.ObjectId;
        var productos = [];
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
      } else {
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
              "negocio": { nombre: { $arrayElemAt: ["$negociodata.nombre", 0] }, "_id": { $arrayElemAt: ["$negociodata._id", 0] } },
              "estado": "$estado",
              "precio": "$precio",
              "tipo": "$tipo",
              "descripcion": "$descripcion"
            }
          },
          { $sort: { "denuncias": 1 } },

        ])

        io.to(socket.id).emit('respuesta-listar-denuncia', { datos: producto });
      }

    });

    socket.on('denuncia-producto', async (datos) => {
      var countReservas = await Reservas.count({ cliente: datos.idusuario, producto: datos.idproducto });
      console.log(countReservas);
      /*     try {
                 var datos = await Crypto.Desincryptar(data);
                 if (!datos.error) {*/
      //   var datos=JSON.parse(data);
      if (countReservas > 0) {
        var usuario = datos.idusuario;
        var fecha = new Date().toUTCString();

        var count = await Producto.count({ _id: datos.idproducto, "denuncias.usuario": { $all: [usuario] } });

        if (count == 0) {
          Producto.findOneAndUpdate({ _id: datos.idproducto }, { $push: { denuncias: { usuario: usuario, fecha: fecha, detalle: datos.detalle } } }, { new: true }, (error, actualizado) => {
            if (error) {
              console.log(error);
              io.to(socket.id).emit('respuesta-denuncia-negocio', { error: "error al guardar denuncia" });
              //    res.status(500).send({ mensaje: "error al guradar" })
            } else {

              io.to(socket.id).emit('respuesta-denuncia-negocio', { datos: actualizado });
              //        io.emit('respuesta-actualizar-negocio-todos',{datos:actualizado});  

            }
          })
        } else {
          io.to(socket.id).emit('respuesta-denuncia-negocio', { error: "error solo se permite una denuncia por producto" });
        }
      } else {
        io.to(socket.id).emit('respuesta-denuncia-negocio', { error: "error deve reservar primero el producto" });
      }

      /*          }
  return data;
  }
  
  catch (e) {
    console.log(e);
  }*/
    });


    socket.on('calificar-negocio', async (data) => {
      console.log(data);
      try {
        var datos = await Crypto.Desincryptar(data);
        if (!datos.error) {

          var calificacion = new Calificacion();

          calificacion.usuario = datos.idcliente;
          calificacion.negocio = datos.idnegocio;
          calificacion.estrella = datos.estrella;
          calificacion.fecha = new Date().toUTCString();
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
      console.log(data + "ei3jfiok45gpok");
      try {
        var datos = await Crypto.Desincryptar(data);
        if (!datos.error) {

          var cliente = datos.idcliente;
          var producto = datos.idproducto;
          var valoracion = { usuario: cliente, fecha: datos.fecha }
          var countReservas = await Reservas.count({ cliente: cliente, producto: producto });
          if (countReservas > 0) {
            await Producto.update({ _id: producto }, { $pull: { "valoracion": { usuario: cliente } } });
            var countlikes = await Producto.count({ _id: producto, "valoracion.usuario": cliente });
            console.log(countlikes);
            if (countlikes < 1) {
              Producto.update({ _id: producto }, { $push: { desvaloracion: valoracion } }, (error, actualizado) => {
                if (error) {
                  io.to(socket.id).emit('respuesta-descalificar-producto', { error: "error al guradar nuevos datos" });
                  //    res.status(500).send({ mensaje: "error al guradar" })
                } else {
                  io.to(socket.id).emit('respuesta-descalificar-producto', { datos: producto });
                  //  io.emit('respuesta-actualizar-negocio-todos',{datos:actualizado});  

                }
              })
            } else {
              io.to(socket.id).emit('respuesta-descalificar-producto', { error: "ya calificaste este producto" });
            }
          } else {
            io.to(socket.id).emit('respuesta-calificar-producto', { error: "primero deves reservar el producto " });
          }


        }
        return data;
      }

      catch (e) {

      }
    });

    socket.on('visitas-grafica', async (datos) => {

      const ObjectId = mongoose.Types.ObjectId;
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