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
    console.log("alguien se conecto");

    socket.on('registrar-negocio',async (data) => {

      try {
        const bytes = CryptoJS.AES.decrypt(data, clave.clave);
        if (bytes.toString()) {
          datos = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
          var negocio = new Producto();
        //  var tipo = new Tipo();
          var params = datos.negocio;
          negocio.nombre=params.nombre;
          negocio.titular = params.titular;
          negocio.foto=params.foto;
          negocio.tipo=await TipoNegocio.findById(params.tiponegocio);
          negocio.direccion=params.direccion;
          negocio.telefono=params.telefono;
          negocio.correo=params.correo;
          negocio.nit=params.nit;
          negocio.eliminado={estado:false,razon:""};
          negocio.creacion=params.creacion
          negocio.modificacion=params.modificacion;
      
                      negocio.save((error, nuevoProducto) => {
                          if (error) {
                  
                          //    res.status(500).send({ mensaje: "error al guradar" })
                          } else {
                            io.emit('respuesta',nuevoProducto);  
                          }
                      })
              
        }
        return data;
      } catch (e) {
        console.log(e);
      }
      
    //console.log(req.body);
   
     
      
    });

    
      socket.on('actualizar-negocio', async (data) => {
     
        
      try {
        const bytes = CryptoJS.AES.decrypt(data, clave.clave);
        if (bytes.toString()) {
          datos = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
          var negocio = new Producto();
        //  var tipo = new Tipo();
          var params = datos.negocio;
          negocio.nombre=params.nombre;
          negocio.titular = params.titular;
          negocio.foto=params.foto;
          negocio.direccion=params.direccion;
          negocio.telefono=params.telefono;
          negocio.correo=params.correo;
          negocio.modificacion=params.modificacion;
      
                      Negocio.findByIdAndUpdate(params.id,negocio,{new: true},(error, actualizado) => {
                          if (error) {
                  
                          //    res.status(500).send({ mensaje: "error al guradar" })
                          } else {
                            io.emit('respuesta',actualizado);  
                          }
                      })
              
        }
        return data;
      } catch (e) {
        console.log(e);
      }
      });

      socket.on('registrar-negocio', async (data) => {
     
        io.emit('respuesta', {user: socket.nickname, event: 'left'});   
      });
     
})


};
