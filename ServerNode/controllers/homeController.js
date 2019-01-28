"use strict"
var nodemailer = require('nodemailer');
var CryptoJS = require("crypto-js");
var clave = require("./../variables/claveCrypto");
module.exports = async function (io) {
    var clients = [];
    io.on('connection', async function (socket) {
        socket.on('enviar-contacto', async (data) => {
            try {
                const bytes = CryptoJS.AES.decrypt(data, clave.clave);
                if (bytes.toString()) {
                  var datos = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
           
                  var transporter = nodemailer.createTransport({
                    service: 'yandex',
                    auth: {
                      user: 'wilson-pc@yandex.com',
                      pass: 'tengosueno123'
                    }
                  });
                     
                  var mailOptions = {
                    from:'"Triservice" <wilson-pc@yandex.com>',
                    to: 'rolandoalvarezfaye@gmail.com',
                    subject: 'Contacto inicio',
                    text: 'That was easy!',
                    html: '<div> <table cellspacing="0" cellpadding="0" border="0"><tbody><tr width="100%"><td valign="top" align="left" style="background:#f0f0f0; font:15px"><table style="border:none; padding:0 18px; margin:50px auto; width:500px">'+
                    '<tbody><tr width="100%" height="57"> <td valign="top" align="left" style="border-top-left-radius:4px; border-top-right-radius:4px; background:#0079BF; padding:12px 18px; text-align:center"> <h2  style="font-weight:bold; font-size:18px; color:#fff; vertical-align:top"> Tri service</h2>'+
                     '</td> </tr><tr width="100%"> <td valign="top" align="left" style="border-bottom-left-radius:4px; border-bottom-right-radius:4px; background:#fff; padding:18px"><h1 style="font-size:20px; margin:0; color:#333">Correo de contacto: </h1>'+
                    ' <p style="font:15px/1.25em,Arial,Helvetica; color:#333"></p><p style="font:15px/1.25em, Arial,Helvetica; color:#333"><strong>Fecha y hora:</strong>'+datos.mensaje.fecha+'</p>'+
                        
                        '<p style="font:15px/1.25em,Arial,Helvetica; color:#333"></p><p style="font:15px/1.25em, Arial,Helvetica; color:#333"><strong>Nombre:</strong>'+datos.mensaje.nombre+'</p>'+
                            '<p style="font:15px/1.25em,Arial,Helvetica; color:#333"></p><p style="font:15px/1.25em, Arial,Helvetica; color:#333"><strong>Apellidos:</strong>'+datos.mensaje.apellido+'</p>'+
                           
                           '<p style="font:15px/1.25em,Arial,Helvetica; color:#333"></p><p style="font:15px/1.25em, Arial,Helvetica; color:#333"><strong>email:</strong>'+datos.mensaje.email+'</p>'+
                           '<p style="font:15px/1.25em,Arial,Helvetica; color:#333"></p><p style="font:15px/1.25em, Arial,Helvetica; color:#333"><strong>Telefono:</strong>'+datos.mensaje.telefono+'</p>'+
                           
                            '<p style="font:15px/1.25em ,Arial,Helvetica; color:#333">'+ datos.mensaje.mensaje+'</p>'+
                    ' <p style="font:15px/1.25em ,Arial,Helvetica; color:#333"> </p></td></tr></tbody></table> </td></tr> </tbody> </div>'
                  };

                  transporter.sendMail(mailOptions, async function(error, info){
                    if (error) {
                        io.to(socket.id).emit('respuesta-enviar-contacto', { error: "ocurrio un error al enviar un correo" });
                    } else {
                        io.to(socket.id).emit('respuesta-enviar-contacto', { mensaje: "su mensaje a sido enviado con exito" });
                    }
                  });
                     
            }
            return data;
            }
            
            catch (e) {
              console.log(e);
            }
      
      
      
            //console.log(req.body);
      
      
      
          });
    });
}