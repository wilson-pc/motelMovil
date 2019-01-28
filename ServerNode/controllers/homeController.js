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
                  console.log(datos);
                  var transporter = nodemailer.createTransport({
                    service: 'yandex',
                    auth: {
                      user: 'wilson-pc@yandex.com',
                      pass: 'tengosueno123'
                    }
                  });
                     
                  var mailOptions = {
                    from:'"Triservice" <wilson-pc@yandex.com>',
                    to: 'wilverhidalgobarja74757@gmail.com',
                    subject: 'Contacto inicio',
                    text: 'That was easy!',
                    html: '<div> <table cellspacing="0" cellpadding="0" border="0"><tbody><tr width="100%"><td valign="top" align="left" style="background:#f0f0f0; font:15px"><table style="border:none; padding:0 18px; margin:50px auto; width:500px">'+
                       '<tbody><tr width="100%" height="57"> <td valign="top" align="left" style="border-top-left-radius:4px; border-top-right-radius:4px; background:#0079BF; padding:12px 18px; text-align:center"> <h2  style="font-weight:bold; font-size:18px; color:#fff; vertical-align:top"> Tri service</h2>'+
                        '</td> </tr><tr width="100%"> <td valign="top" align="left" style="border-bottom-left-radius:4px; border-bottom-right-radius:4px; background:#fff; padding:18px"><h1 style="font-size:20px; margin:0; color:#333">Buenas: </h1>'+
                       ' <p style="font:15px/1.25em,Arial,Helvetica; color:#333">Hemos notado que esta tratando de recuperar su usuario y contraseña de triservice.</p><p style="font:15px/1.25em, Arial,Helvetica; color:#333"><strong>Fecha y hora:</strong> 25 de enero de 2019 a las 20:07 HEOS<br>'+
                        '<strong>Dirección IP :</strong> 190.129.127.18 </p><p style="font:15px/1.25em ,Arial,Helvetica; color:#333">Si no es usted verifique que a quien presto su dispositivo la en las fecha indicadas</p>'+
                       ' <p style="font:15px/1.25em ,Arial,Helvetica; color:#333">Si es usted as click en la direccion url de abajo para poder crear sus nuevos credenciales,<a href="http://localhost:4200/recuperacion/'+hash+'" target="_blank" rel="noopener noreferrer" data-auth="NotApplicable">'+
                        ' cambie la contraseña</a> de inmediato. </p></td></tr></tbody></table> </td></tr> </tbody> </div>'
                  };
                     
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