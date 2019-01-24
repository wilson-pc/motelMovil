"use strict"
var CryptoJS = require("crypto-js");
var Negocio = require("../schemas/negocio");
var TipoNegocio = require("../schemas/tipoNegocio");
var clave=require("../variables/claveCrypto");
module.exports = async function(io) {
var clients = [];
  io.on('connection', async function (socket) {
   // var host=socket.handshake.headers.host;
    clients.push(socket.id);
    socket.on('registrar-negocio',async (data) => {

      console.log("entro");

      try {
        const bytes = CryptoJS.AES.decrypt(data, clave.clave);
        if (bytes.toString()) {
          var datos = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
          var negocio = new Negocio();
        //  var tipo = new Tipo();
        console.log(datos)
          var params = datos.negocio;
          negocio.nombre=params.nombre;
        //  negocio.titular = params.titular;
          negocio.foto=params.foto;
          negocio.tipo=await TipoNegocio.findById(params.tipo);
          negocio.direccion=params.direccion;
          negocio.telefono=params.telefono;
          negocio.correo=params.correo;
          negocio.nit=params.nit;
          negocio.eliminado={estado:false,razon:""};
          negocio.creacion=params.creacion
          negocio.modificacion=params.modificacion;
      
                      negocio.save((error, nuevoProducto) => {
                          if (error) {

                            console.log(error)
                            io.to(socket.id).emit('respuesta-registro-producto',{error:"error no se pudo guardar el negocio"});
                  
                          //    res.status(500).send({ mensaje: "error al guradar" })
                          } else {
                            io.emit('respuesta-registro-producto',nuevoProducto);  
                          }
                      })
              
        }
        return data;
      } catch (e) {
        console.log(e);
      }
    });

    
    socket.on('registrar-tipo-negocio',async (data) => {

      try {
          var tipoNegocio = new TipoNegocio();
        //  var tipo = new Tipo();
          var params = data.negocio;
          tipoNegocio .nombre=params.nombre;
        //  negocio.titular = params.titular;
          
             tipoNegocio.save((error, nuevoNegocio) => {
                          if (error) {
                            io.to(socket.id).emit('respuesta-registro-producto',{error:"error no se pudo guardar el negocio"});
                  
                          //    res.status(500).send({ mensaje: "error al guradar" })
                          } else {
                            console.log(nuevoNegocio);
                            io.emit('respuesta-registro-producto',nuevoNegocio);  
                          }
                      })
              
        }
    catch (e) {
        console.log(e);
      }
      
    
  //console.log(req.body);
 
   
    
  });

      socket.on('actualizar-negocio', async (data) => {
     
        
      try {
        const bytes = CryptoJS.AES.decrypt(data, clave.clave);
        if (bytes.toString()) {
         var datos = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
          var negocio = new Negocio();
        //  var tipo = new Tipo();
          var params = datos.negocio;
          negocio.nombre=params.nombre;
          negocio.titular = params.titular;
          negocio.foto=params.foto;
          negocio.direccion=params.direccion;
          negocio.telefono=params.telefono;
          negocio.nit=params.nit;
          negocio.correo=params.correo;
          negocio.modificacion=params.modificacion;
      
                      Negocio.findByIdAndUpdate(params.id,negocio,{new: true},(error, actualizado) => {
                          if (error) {
                            io.to(socket.id).emit('respuesta-actualizar-negocio',{error: "error al guradar nuevos datos"});
                          //    res.status(500).send({ mensaje: "error al guradar" })
                          } else {
                            io.emit('respuesta-actualizar-negocio',actualizado);  
                          }
                      })
              
        }
        return data;
      } catch (e) {
        console.log(e);
      }
      });

     
      //
      //
      //
      //
      socket.on('eliminar-negocio', async (data) => {
     
        try {
            const bytes = CryptoJS.AES.decrypt(data, clave.clave);
            if (bytes.toString()) {
             var datos = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
              var negocio = new Negocio();
              var params = datos.negocio;
              negocio._id=params._id;
              negocio.eliminado={estado:true,razon:params.razon},
                          //guarda al nuevo usuario en la bd
                      
                          Negocio.findByIdAndUpdate(params.id,negocio,{new: true},(error, actualizado) => {
                              if (error) {
                                io.to(socket.id).emit('respuesta-elimina-negocio',{error: "error no se pudo guardar"})
                                 // res.status(500).send({ mensaje: "error al guradar" })
                              } else {
                                io.emit('respuesta-elimina-negocio',actualizado);  
                              }
                          })
                    
            }
           else{

           }
          } catch (e) {
            console.log(e);
          }
        
      });

      socket.on('listar-negocio', async (data) => {
      Negocio.find({"eliminado.estado":false}, function (error, lista){
        if (error) {
          io.to(socket.id).emit('respuesta-listar-negocio',{error: "No se pudo listar los negocios"})
           // res.status(500).send({ mensaje: "Error al listar" })
        } else {
            if (!lista) {
              io.to(socket.id).emit('respuesta-listar-negocio',{error: "aun no hay negocios en registrados"})
             //   res.status(404).send({ mensaje: "Error al listar" })
            } else {
                io.emit('respuesta-listar-negocio',lista);  
            }  
        }
      });
      });
     
      
      socket.on('sacar-negocio', async (data) => {
        try {
            const bytes = CryptoJS.AES.decrypt(data, clave.clave);
            if (bytes.toString()) {
             var datos = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
               
                
        Negocio.findOne({_id:datos.id,"eliminado.estado":false}, function (error, dato){
            if (error) {
              io.to(socket.id).emit('respuesta-sacar-negocio',{error: "no se pudo buscar al negocio"})
               // res.status(500).send({ mensaje: "Error al listar" })
            } else {
                if (!lista) {
                  io.to(socket.id).emit('respuesta-sacar-negocio',{error: "no se pudo encontrar al negocio"})
                 //   res.status(404).send({ mensaje: "Error al listar" })
                } else {
                    io.emit('respuesta',dato);  

                }
            }
          });
            
            }
            return data;
          } catch (e) {
            console.log(e);
          }   

        });
        socket.on('buscar-negocio', async (data) => {
            try {
                const bytes = CryptoJS.AES.decrypt(data, clave.clave);
                if (bytes.toString()) {
                 var datos = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
                   
                    
            Negocio.find({"eliminado.estado":false,nombre:datos.termino,nit:datos.termino}, function (error, lista){
                if (error) {
                  io.to(socket.id).emit('respuesta-buscar-negocio',{error: "aun no hay negocios en registrados"})
                   // res.status(500).send({ mensaje: "Error al listar" })
                } else {
                    if (!lista) {
                      io.to(socket.id).emit('respuesta-buscar-negocio',{error: "aun no hay negocios en registrados"})
                     //   res.status(404).send({ mensaje: "Error al listar" })
                    } else {
                        io.emit('respuesta-buscar-negocio',lista);  
                    }
                }
              });
                
                }
                return data;
              } catch (e) {
                console.log(e);
              }   
    
            });
})


};
