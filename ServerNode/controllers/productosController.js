"use strict"
var CryptoJS = require("crypto-js");
var Producto = require("../schemas/producto");
var Negocio = require("../schemas/negocio");
var clave = require("./../variables/claveCrypto");
var Tipo = require("../schemas/tipo");
var Crypto = require("../variables/desincryptar");
var mongoose = require("mongoose");
require('mongoose-pagination');
module.exports = async function (io) {
  var clients = [];
  io.on('connection', async function (socket) {
    // var host=socket.handshake.headers.host;
    console.log("Hola soy ionic Productos");
    clients.push(socket.id);

    socket.on('listar-tipos', async (data) => {

      Tipo.find({ tipo: data.tipo }, function (error, lista) {
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


    socket.on('listar-tiposproductos-negocio', async (data) => {

      Tipo.find({ tiponegocio: data.tipo }, function (error, lista) {
        if (error) {
          // res.status(500).send({ mensaje: "Error al listar" })
        } else {
          if (!lista) {
            //   res.status(404).send({ mensaje: "Error al listar" })
          } else {
            io.emit('respuesta-listar-tiposproductos-negocio', lista);
          }
        }
      });
    });


    socket.on('registrar-tipo-producto', async (data) => {

      try {
        var tipo = new Tipo();
        //  var tipo = new Tipo();
        tipo.tipo = data.tipo;
        tipo.nombre = data.nombre;
        tipo.tiponegocio = data.negocio;
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


    socket.on('importar-productos', async (data) => {

      try {
        const bytes = CryptoJS.AES.decrypt(data, clave.clave);
        var idnegocios = "";
        if (bytes.toString()) {
          var datos = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));

          for (let index = 0; index < datos.length; index++) {
            idnegocios = datos[index].tipo.idnegocio;
            var tipo = await Tipo.findOne({ tipo: datos[index].tipo.tipo });
          
            if (tipo != null) {
              datos[index].tipo = tipo;
            } else {
              var tipos = new Tipo();
              tipos.tipo = datos[index].tipo.tipo;
              tipos.tiponegocio = datos[index].tipo.negocio;
              datos[index].tipo = await tipos.save();
            }

          }


          Producto.create(datos, async (error, nuevoProducto) => {
            if (error) {
              
              io.emit('respuesta-importar-productos', { error: "no se pudo importar el excel" });
            } else {

              
              var negocio = await Negocio.findByIdAndUpdate(idnegocios, { $inc: { productos: datos.length } });
             
              io.emit('respuesta-importar-productos', { exito: "guardado" });
            }
          })

        }
        return data;
      } catch (e) {
        console.log(e);
      }

      //console.log(req.body);



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
          producto.tipo = await Tipo.findById(params.tipo);
          producto.foto = params.foto;
          producto.fotos=params.fotos;
          producto.eliminado = { estado: false, razon: "" };
          producto.descripcion = params.descripcion;
          producto.creacion = params.creacion
          producto.modificacion = params.modificacion;

          producto.save(async (error, nuevoProducto) => {
            if (error) {
              console.log(error);

            } else {
              var negocio = await Negocio.findByIdAndUpdate(params.negocio, { $inc: { productos: 1 } });
              io.emit('respuesta-producto', nuevoProducto);
              const ObjectId = mongoose.Types.ObjectId;
              Producto.aggregate([
                { $match: { "_id": ObjectId(nuevoProducto._id), "eliminado.estado": false, } },
                {
                  $project: {
                    _id: "$_id",
                    "likes": { $size: "$valoracion.usuario" },
                    "dislike": { $size: "$desvaloracion.usuario" },
                    "eliminado": "$eliminado",
                    "foto": { miniatura: "$foto.miniatura" },
                    "creacion": "$creacion",
                    "modificacion": "$modificacion",
                    "nombre": "$nombre",
                    "negocio": "$negocio",
                    "precio": "$precio",
                    "cantidad": "$cantidad",
                    "tipo": "$tipo",
                    "descripcion": "$descripcion"
                  }
                }
              ], function (error, lista) {
                if (error) {
                      console.log(error);
                   // io.emit('respuesta-listado-producto', lista);
                  
                }else{
                  io.emit('nuevo-producto', lista);
                }
              });
            }
          })

        }
        return data;
      } catch (e) {
        console.log(e);
      }

      //console.log(req.body);



    });

    socket.on('eliminar-producto', async (data) => {
      try {
        var datos = await Crypto.Desincryptar(data);
        if (!datos.error) {
          var producto = new Producto();
          producto._id = datos.id;
          producto.eliminado = { estado: true, razon: datos.razon };
          Producto.findByIdAndUpdate(datos.id, producto, { new: true }, async (error, actualizado) => {
            if (error) {
              console.log(error);
              io.to(socket.id).emit('respuesta-eliminar-producto', { error: "Ocurrio un error en la eliminacion" });

            } else {
              io.to(socket.id).emit('respuesta-eliminar-producto', { exito: "eliminado con exito" });

            }
          })

        } else {

        }

      } catch (error) {
        console.log(error);
      }

    });

    socket.on('registrar-tipos', async (data) => {

      try {
        const bytes = CryptoJS.AES.decrypt(data, clave.clave);
        if (bytes.toString()) {
          var datos = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
          var tipo = new Tipo();
          var params = datos.tipo;
          tipo.nombre = datos.tipos.nombre;

          tipo.save((error, nuevoTipo) => {
            if (error) {
              console.log(error);

            } else {

              io.emit('respuesta-registrar-tipos', nuevoTipo);
            }
          })

        }
        return data;
      } catch (e) {
        console.log(e);
      }


    });

    socket.on('actualizar-producto', async (data) => {
      try {
        const bytes = CryptoJS.AES.decrypt(data, clave.clave);
        if (bytes.toString()) {
          var datos = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
          var producto = new Producto();
          var params = datos.producto;
          producto._id = params._id;
          producto.nombre = params.nombre;
          producto.negocio = params.negocio;
          producto.precio = params.precio;
          producto.estado = params.estado;
          producto.tipo = await Tipo.findById(params.tipo);
          producto.foto = params.foto;
          producto.fotos = params.fotos;
          // usuario.eliminado = { estado: false, razon: "" };
          producto.descripcion = params.descripcion;
          //  producto.creacion = params.creacion
          producto.modificacion = params.modificacion;
          Producto.findByIdAndUpdate(params._id, producto, { new: true }, async (error, productoActualizado) => {
            if (error) {
              console.log(error);
              io.to(socket.id).emit('respuesta-actualizar-producto', { error: "ocurio un error al crear el producto" });
            } else {
              io.emit('respuesta-actualizar-producto', productoActualizado);
            }
          })

        }
        return data;
      } catch (e) {
        console.log(e);
      }

    })

    /*socket.on('sacar-producto', async (data) => {

      
      Producto.findOne({ _id: data.id, "eliminado.estado": false }, { denuncias: 0 }, function (error, dato) {
        if (error) {
          console.log(error);
          // res.status(500).send({ mensaje: "Error al listar" })
        } else {
          if (!dato) {
            //   res.status(404).send({ mensaje: "Error al listar" })
          } else {
         
            io.to(socket.id).emit('respuesta-sacar-producto', dato);

          }
        }
      });

    });*/

    socket.on('sacar-producto', async (data) => {
    
      Producto.findOne({ _id: data._id, "eliminado.estado": false }, { denuncias: 0 }, function (error, dato) {
        if (error) {
          // res.status(500).send({ mensaje: "Error al listar" })
          console.log("error", error);
        } else {
          if (!dato) {
            //   res.status(404).send({ mensaje: "Error al listar" })
            console.log("error vacio");
          } else {

            io.to(socket.id).emit('respuesta-sacar-producto', dato);

          }
        }
      });
    });

    socket.on('sacar-producto-denuncias', async (data) => {
      Producto.findOne({ _id: data._id, "eliminado.estado": false },{ foto:0,"foto.miniatura":0,desvaloracion:0,valoracion:0,modificacion:0 }).populate('denuncias.usuario',{_id:1,nombre:1}).exec(function (error, dato) {
        if (error) {
          io.to(socket.id).emit('respuesta-sacar-producto-denuncias', {error:"error"});
      
        } else {
          if (!dato) {
            io.to(socket.id).emit('respuesta-sacar-producto-denuncias', {error:"error"});
          
          } else {
           console.log("Encontrado!")
            io.to(socket.id).emit('respuesta-sacar-producto-denuncias', dato);

          }
        }
      });
    });

    socket.on('listar-producto-licores', async (data) => {

     
      Producto.aggregate([
        { $match: { "tipo.tiponegocio": "Licoreria", "eliminado.estado": false, } },
        {
          $project: {
            _id: "$_id",
            "likes": { $size: "$valoracion.usuario" },
            "dislike": { $size: "$desvaloracion.usuario" },
            "eliminado": "$eliminado",
            "foto": { miniatura: "$foto.miniatura" },
            "creacion": "$creacion",
            "modificacion": "$modificacion",
            "nombre": "$nombre",
            "negocio": "$negocio",
            "precio": "$precio",
            "estado": "$estado",
            "cantidad": "$cantidad",
            "tipo": "$tipo",
            "descripcion": "$descripcion"
          }
        }, {
          $skip: 10 * data.parte 
        }, {
          $limit: 10
        }
      ], function (error, lista) {
        if (error) {
          console.log("este es el error:", error)
          // res.status(500).send({ mensaje: "Error al listar" })
          io.to(socket.id).emit('respuesta-listado-producto-licores', { error: "ocurrio un error al listar productos" });
        } else {
          if (!lista) {
           
            //   res.status(404).send({ mensaje: "Error al listar" })
            io.to(socket.id).emit('respuesta-listado-producto-licores', { error: "no hay productos en la base de datos" });
          } else {
           
            io.to(socket.id).emit('respuesta-listado-producto-licores', lista);
          }
        }
      });
      // io.emit('respuesta-listar-producto', { user: socket.nickname, event: 'left' });
    });


    //METODO PARA SACAR PRODUCTOS -SEXSHOPS
    socket.on('listar-producto-sexshops', async (data) => {

      console.log(data);
      Producto.aggregate([
        { $match: { "tipo.tiponegocio": 'SexShop', "eliminado.estado": false, } },
        {
          $project: {
            _id: "$_id",
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
            "cantidad": "$cantidad",
            "tipo": "$tipo",
            "descripcion": "$descripcion"
          }
        }, {
          $skip: 10 * data.parte
        }, {
          $limit: 10
        }
      ], function (error, lista) {
        if (error) {
          console.log("este es el error:", error)
          // res.status(500).send({ mensaje: "Error al listar" })
          io.to(socket.id).emit('respuesta-listado-producto-sexshops', { error: "ocurrio un error al listar productos" });
        } else {
          if (!lista) {
          
            //   res.status(404).send({ mensaje: "Error al listar" })
            io.to(socket.id).emit('respuesta-listado-producto-sexshops', { error: "no hay productos en la base de datos" });
          } else {
            
            io.to(socket.id).emit('respuesta-listado-producto-sexshops', lista);
          }
        }
      });
      // io.emit('respuesta-listar-producto', { user: socket.nickname, event: 'left' });
    });


    //METODO PARA SACAR PRODUCTOS MOTELES
    socket.on('listar-producto-moteles', async (data) => {

      
      Producto.aggregate([
        { $match: { "tipo.tiponegocio": 'Motel', "eliminado.estado": false, } },
        {
          $project: {
            _id: "$_id",
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
            "cantidad": "$cantidad",
            "tipo": "$tipo",
            "descripcion": "$descripcion"
          }
        }, {
          $skip: 10 * data.parte
        }, {
          $limit: 10
        }
      ], function (error, lista) {
        if (error) {
          console.log("este es el error:", error)
          // res.status(500).send({ mensaje: "Error al listar" })
          io.to(socket.id).emit('respuesta-listado-producto-moteles', { error: "ocurrio un error al listar productos" });
        } else {
          if (!lista) {
            
            //   res.status(404).send({ mensaje: "Error al listar" })
            io.to(socket.id).emit('respuesta-listado-producto-moteles', { error: "no hay productos en la base de datos" });
          } else {
            
            io.to(socket.id).emit('respuesta-listado-producto-moteles', lista);
          }
        }
      });
      // io.emit('respuesta-listar-producto', { user: socket.nickname, event: 'left' });
    });

    //PRODUCTOS PARA LISTAR EN CLIENTES
    socket.on('listar-productos-negocio', async (data) => {

    const ObjectId = mongoose.Types.ObjectId;
      Producto.aggregate([
        { $match: { "negocio": ObjectId(data.termino), "eliminado.estado": false } },
        {
          $project: {
            _id: "$_id",
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
            "cantidad": "$cantidad",
            "tipo": "$tipo",
            "descripcion": "$descripcion"
          }
        },
        { $sort: { "likes": -1 } },
        { $limit: 10 }
      ], function (error, lista) {
        if (error) {
         
          io.to(socket.id).emit('respuesta-listar-productos-negocio', { error: "ocurrio un error en el servidor" });
        } else {
          if (!lista) {
            io.to(socket.id).emit('respuesta-listar-productos-negocio', { error: "no hay productos en la base de datos" });
          } else {
            
            io.to(socket.id).emit('respuesta-listar-productos-negocio', lista);
          }
        }
      });

    });


    socket.on('listar-todos-productos', async (data) => {

      Producto.find({ "eliminado.estado": false }, { "foto.normal": 0 }).paginate(data.parte, 10, function (error, lista, total) {
        if (error) {
          // res.status(500).send({ mensaje: "Error al listar" })
          io.to(socket.id).emit('respuesta-listar-todos-productos', { error: "ocurrio un error al listar productos" });
        } else {
          if (!lista) {
            //   res.status(404).send({ mensaje: "Error al listar" })
            io.to(socket.id).emit('respuesta-listar-todos-productos', { error: "no hay productos en la base de datos" });
          } else {
            //console.log(lista);
            io.to(socket.id).emit('respuesta-listar-todos-productos', { productos: lista, total: total });
          }
        }
      });
      // io.emit('respuesta-listar-producto', { user: socket.nickname, event: 'left' });
    });
    //
    socket.on('listar-producto-negocio', async (data) => {
  

      Producto.find({ negocio: data.termino, "eliminado.estado": false }, { "foto.normal": 0,fotos:0 }, function (error, lista) {

        if (error) {
          // res.status(500).send({ mensaje: "Error al listar" })
          io.to(socket.id).emit('respuesta-listado-producto-negocio', { error: "ocurrio un error al listar productos" });
        } else {
          if (!lista) {
            //   res.status(404).send({ mensaje: "Error al listar" })
            io.to(socket.id).emit('respuesta-listado-producto-negocio', { error: "no hay productos en la base de datos" });
          } else {

            io.to(socket.id).emit('respuesta-listado-producto-negocio', lista);
          }
        }
      });
    });

    socket.on('buscar-producto', async (data) => {
          console.log(data);
      Producto.find({
        "tipo.tiponegocio": data.tipo, "eliminado.estado": false,
        $or: [{ nombre: new RegExp(data.termino, 'i') }, { descripcion: new RegExp(data.termino, 'i') },
        { 'tipo.tipo': new RegExp(data.termino, 'i') }]
      }, { "foto.normal": 0 }, function (error, lista) {
        if (error) {
          console.log(error+"578");
          // res.status(500).send({ mensaje: "Error al listar" })
          io.to(socket.id).emit('respuesta-listado-producto-search', { error: "ocurrio un error al listar productos" });
        } else {
          if (lista.length==0) {
            console.log("sin resultado");
            //   res.status(404).send({ mensaje: "Error al listar" })
            io.to(socket.id).emit('respuesta-listado-producto-search', { error: "no hay productos en la base de datos" });
          } else {
             console.log(lista[0].nombre+"587");
            io.to(socket.id).emit('respuesta-listado-producto-search', lista);
          }
        }

      });
      // io.emit('respuesta-listar-producto', { user: socket.nickname, event: 'left' });
    });

    socket.on('top-productos', async (data) => {
        console.log(data);
      Producto.aggregate([
        { $match: { "tipo.tiponegocio": data.tipo, "eliminado.estado": false, } },
        {
          $project: {
            _id: "$_id",
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
            "cantidad": "$cantidad",
            "tipo": "$tipo",
            "descripcion": "$descripcion"
          }
        },
        { $sort: { "likes": -1 } },
        { $limit: 10 }
      ], function (error, lista) {
        if (error) {
          
          io.to(socket.id).emit('respuesta-top-productos', { error: "ocurrio un error en el servidor" });
        } else {
          if (!lista) {
            io.to(socket.id).emit('respuesta-top-productos', { error: "no hay productos en la base de datos" });
          } else {
          
            io.to(socket.id).emit('respuesta-top-productos', lista);
          }
        }
      });

    });

  })


};
