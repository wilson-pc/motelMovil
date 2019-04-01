"use strict"
var CryptoJS = require("crypto-js");
var Producto = require("../schemas/producto");
var Negocio = require("../schemas/negocio");
var clave = require("./../variables/claveCrypto");
var Tipo = require("../schemas/tipo");
var Crypto = require("../variables/desincryptar");
var pagination = require('mongoose-pagination');
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
    socket.on('registrar-producto', async (data) => {

      try {
        const bytes = CryptoJS.AES.decrypt(data, clave.clave);

        if (bytes.toString()) {
          var datos = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
          console.log("|-> ", datos);
          var producto = new Producto();
          var params = datos.producto;
          producto.nombre = params.nombre;
          producto.negocio = params.negocio;
          producto.precio = params.precio;
          producto.cantidad = params.cantidad;
          producto.tipo = await Tipo.findById(params.tipo);
          producto.foto = params.foto;
          producto.eliminado = { estado: false, razon: "" };
          producto.descripcion = params.descripcion;
          producto.creacion = params.creacion
          producto.modificacion = params.modificacion;

          producto.save(async (error, nuevoProducto) => {
            if (error) {
              console.log(error);

            } else {
              console.log("nuevo producto creado");
              var negocio = await Negocio.findByIdAndUpdate(params.negocio, { $inc: { productos: 1 } });
              console.log("ervkjrbeui fgeriu");
              io.emit('respuesta-producto', nuevoProducto);


              Producto.aggregate([
                {$match : {"tipo.tiponegocio":params.tipo, "eliminado.estado": false,}},
                {
                  $project: {
                    _id: "$_id",
                    "likes": { $size: "$valoracion.usuario" },
                    "dislike":{$size: "$desvaloracion.usuario"},
                    "eliminado": "$eliminado",
                    "foto":{miniatura:"$foto.miniatura"},
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
        
                  // res.status(500).send({ mensaje: "Error al listar" })
                  io.to(socket.id).emit('respuesta-listado-producto', { error: "ocurrio un error al listar productos" });
                } else {
                  if (!lista) {
                    //   res.status(404).send({ mensaje: "Error al listar" })
                    io.to(socket.id).emit('respuesta-listado-producto', { error: "no hay productos en la base de datos" });
                  } else {
                    console.log("oifh reghu9nhgiuhfierhfuinhfephgceuep gy");
                    io.emit('respuesta-listado-producto', lista);
                  }
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

          console.log(datos);

          var producto = new Producto();
          var params = datos.producto;
          producto._id = params._id;
          producto.nombre = params.nombre;
          producto.negocio = params.negocio;
          producto.precio = params.precio;
          producto.cantidad = params.cantidad;
          producto.tipo = await Tipo.findById(params.tipo);
          producto.foto = params.foto;
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

    socket.on('sacar-producto', async (data) => {
      try {
        const bytes = CryptoJS.AES.decrypt(data, clave.clave);
        if (bytes.toString()) {
          var datos = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));

          console.log(datos);
          Producto.findOne({ _id: datos.id, "eliminado.estado": false },{denuncias:0}, function (error, dato) {
            if (error) {
              // res.status(500).send({ mensaje: "Error al listar" })
            } else {
              if (!dato) {
                //   res.status(404).send({ mensaje: "Error al listar" })
              } else {
                io.to(socket.id).emit('respuesta-sacar-usuario', dato);

              }
            }
          });

        }
        return data;
      } catch (e) {
        console.log(e);
      }

    });

    socket.on('listar-producto', async (data) => {

      console.log(data);
      Producto.aggregate([
        {$match : {"tipo.tiponegocio": data.termino, "eliminado.estado": false,}},
        {
          $project: {
            _id: "$_id",
            "likes": { $size: "$valoracion.usuario" },
            "dislike":{$size: "$desvaloracion.usuario"},
            "eliminado": "$eliminado",
            "foto":{miniatura:"$foto.miniatura"},
            "creacion": "$creacion",
            "modificacion": "$modificacion",
            "nombre": "$nombre",
            "negocio": "$negocio",
            "precio": "$precio",
            "cantidad": "$cantidad",
            "tipo": "$tipo",
            "descripcion": "$descripcion"
          }
        },{
          $skip:10*data.parte
        },{
          $limit:10
        }
      ], function (error, lista) {
        if (error) {
          console.log("este es el error:",error)
          // res.status(500).send({ mensaje: "Error al listar" })
          io.to(socket.id).emit('respuesta-listado-producto', { error: "ocurrio un error al listar productos" });
        } else {
          if (!lista) {
            console.log("lista 2");
            //   res.status(404).send({ mensaje: "Error al listar" })
            io.to(socket.id).emit('respuesta-listado-producto', { error: "no hay productos en la base de datos" });
          } else {
            console.log("lista");
            io.to(socket.id).emit('respuesta-listado-producto', lista);
          }
        }
      });
      // io.emit('respuesta-listar-producto', { user: socket.nickname, event: 'left' });
    });


    //


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

      console.log("dentro de la consulta", data);
      Producto.find({ negocio: data.termino, "eliminado.estado": false }, { "foto.normal": 0 }, function (error, lista) {

        if (error) {
          // res.status(500).send({ mensaje: "Error al listar" })
          io.to(socket.id).emit('respuesta-listado-producto-negocio', { error: "ocurrio un error al listar productos" });
        } else {
          if (!lista) {
            //   res.status(404).send({ mensaje: "Error al listar" })
            io.to(socket.id).emit('respuesta-listado-producto-negocio', { error: "no hay productos en la base de datos" });
          } else {
            console.log("lista =>: ", lista);
            io.to(socket.id).emit('respuesta-listado-producto-negocio', lista);
          }
        }
      });
    });

    socket.on('buscar-producto', async (data) => {

      Producto.find({
        "tipo.tiponegocio": data.tipo, "eliminado.estado": false,
        $or: [{ nombre: new RegExp(data.termino, 'i') }, { descripcion: new RegExp(data.termino, 'i') },
        { 'tipo.tipo': new RegExp(data.termino, 'i') }]
      }, { "foto.normal": 0 }, function (error, lista) {
        if (error) {
          // res.status(500).send({ mensaje: "Error al listar" })
          io.to(socket.id).emit('respuesta-listado-producto-search', { error: "ocurrio un error al listar productos" });
        } else {
          if (!lista) {
            //   res.status(404).send({ mensaje: "Error al listar" })
            io.to(socket.id).emit('respuesta-listado-producto-search', { error: "no hay productos en la base de datos" });
          } else {
            console.log(lista);
            io.to(socket.id).emit('respuesta-listado-producto-search', lista);
          }
        }

      });
      // io.emit('respuesta-listar-producto', { user: socket.nickname, event: 'left' });
    });

    socket.on('top-productos', async (data) => {
      var datos=JSON.parse(data);
      Producto.aggregate([
        {$match : {"tipo.tiponegocio": datos.tipo, "eliminado.estado": false,}},
        {
          $project: {
            _id: "$_id",
            "likes": { $size: "$valoracion.usuario" },
            "dislike":{$size: "$desvaloracion.usuario"},
            "eliminado": "$eliminado",
            "foto":{miniatura:"$foto.miniatura"},
            "creacion": "$creacion",
            "modificacion": "$modificacion",
            "nombre": "$nombre",
            "negocio": "$negocio",
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
          console.log(lista);
          io.to(socket.id).emit('respuesta-top-productos',{ error: "ocurrio un error en el servidor" });
        } else {
          if (!lista) {
            io.to(socket.id).emit('respuesta-top-productos', { error: "no hay productos en la base de datos" });
          } else {
            console.log("exito listado");
            io.to(socket.id).emit('respuesta-top-productos', lista);
          }
        }
      });

    });

  })


};
