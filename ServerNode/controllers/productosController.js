"use strict"
module.exports = async function(io) {
  var users=[];
  
var clients = [];
  io.on('connection', async function (socket) {
    var host=socket.handshake.headers.host;
    clients.push(socket.id);
    console.log("alguin se conecto");
    
      socket.on('registrar-tienda', async (data) => {
     
        io.emit('respuesta', {user: socket.nickname, event: 'left'});   
      });
     
})
};
