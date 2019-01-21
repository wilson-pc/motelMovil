"use strict"
var CryptoJS = require("crypto-js");
var Usuario = require("../schemas/usuario");
var clave=require("./../variables/claveCrypto");
var Rol=require("./../schemas/rol");
module.exports = async function(io) {
var clients = [];
  io.on('connection', async function (socket) {
    console.log("tngourtoigyjhij");
   // var host=socket.handshake.headers.host;
    var rol = new Rol();
    rol.rol="AdminAdmi";
    rol.save((error,nuevo)=>{
        console.log(nuevo);
    });
   
    clients.push(socket.id);
    console.log("alguien se conecto");

    socket.on('registrar-usuario',async (data) => {

 /*     try {
        const bytes = CryptoJS.AES.decrypt(data, clave.clave);
        if (bytes.toString()) {
          datos = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
          var usuario = new Usuario();
          var params = datos.usuario;
          usuario.nombre=params.nombre;
          usuario.apellido = params.apellido;
          usuario.ci=params.ci;
          usuario.telefono=params.telefono;
          usuario.email=params.email;
          usuario.login=params.login;
          usuario.foto=par.foto;
          usuario.eliminado={estado:false,razon:""};
          usuario.creacion=params.creacion
          usuario.modificacion=params.modificacion;
          usuario.rol=await Rol.findById(params.rol);
          if (params.ci) {
              //encripta el pasword del usuario
              bcript.hash(login.password, null, null, function(error, hash) {
                  login.password=hash;
                  usuario.login=login
                  if (login.usuario != null) {
                      //guarda al nuevo usuario en la bd
                  
                      usuario.save((error, nuevoUsuario) => {
                          if (error) {
                  
                              res.status(500).send({ mensaje: "error al guradar" })
                          } else {
                            io.emit('respuesta',nuevoUsuario);  
                          }
                      })
                  }
      
            });
          } 
        }
        return data;
      } catch (e) {
        console.log(e);
      }
      */
    //console.log(req.body);
   
     
      
    });

    
      socket.on('actualizar-usuario', async (data) => {
     
        try {
            const bytes = CryptoJS.AES.decrypt(data, clave.clave);
            if (bytes.toString()) {
             var datos = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
              var usuario = new Usuario();
              var params = datos.usuario;
              usuario._id=params._id;
              usuario.nombre=params.nombre;
              usuario.apellido = params.apellido;
              usuario.ci=params.ci;
              usuario.telefono=params.telefono;
              usuario.email=params.email;
              usuario.login=params.login;
              usuario.foto=par.foto;
              usuario.modificacion=params.modificacion;
           
                          //guarda al nuevo usuario en la bd
                      
                          Usuario.findByIdAndUpdate(params.id,usuario,{new: true},(error, actualizado) => {
                              if (error) {
                      
                                 // res.status(500).send({ mensaje: "error al guradar" })
                              } else {
                                io.emit('respuesta',actualizado);  
                              }
                          })
                    
            }
           else{

           }
          } catch (e) {
            console.log(e);
          }
        
        //console.log(req.body);
      });

      socket.on('eliminar-usuario', async (data) => {
     
        try {
            const bytes = CryptoJS.AES.decrypt(data, clave.clave);
            if (bytes.toString()) {
             var datos = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
              var usuario = new Usuario();
              var params = datos.usuario;
              usuario._id=params._id;
              usuario.eliminado={estado:true,razon:params.razon},
                          //guarda al nuevo usuario en la bd
                      
                          Usuario.findByIdAndUpdate(params.id,usuario,{new: true},(error, actualizado) => {
                              if (error) {
                      
                                 // res.status(500).send({ mensaje: "error al guradar" })
                              } else {
                                io.emit('respuesta',actualizado);  
                              }
                          })
                    
            }
           else{

           }
          } catch (e) {
            console.log(e);
          }
        
      });

      socket.on('listar-usuario', async (data) => {
      Usuario.find({"eliminado.estado":false}, function (error, lista){
        if (error) {
           // res.status(500).send({ mensaje: "Error al listar" })
        } else {
            if (!lista) {
             //   res.status(404).send({ mensaje: "Error al listar" })
            } else {
                io.emit('respuesta',lista);  
            }
        }
      });
      });
     
      
      socket.on('sacar-usuario', async (data) => {
        try {
            const bytes = CryptoJS.AES.decrypt(data, clave.clave);
            if (bytes.toString()) {
             var datos = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
               
                
        Usuario.findOne({_id:datos.id,"eliminado.estado":false}, function (error, dato){
            if (error) {
               // res.status(500).send({ mensaje: "Error al listar" })
            } else {
                if (!lista) {
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
        socket.on('buscar-usuario', async (data) => {
            try {
                const bytes = CryptoJS.AES.decrypt(data, clave.clave);
                if (bytes.toString()) {
                 var datos = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
                   
                    
            Usuario.find({"eliminado.estado":false,nombre:datos.termino,apellido:datos.termino}, function (error, lista){
                if (error) {
                   // res.status(500).send({ mensaje: "Error al listar" })
                } else {
                    if (!lista) {
                     //   res.status(404).send({ mensaje: "Error al listar" })
                    } else {
                        io.emit('respuesta',lista);  
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
