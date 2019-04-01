import { Injectable } from '@angular/core';
import { SocketConfigService2 } from '../socket-config.service';

@Injectable({
  providedIn: 'root'
})
export class OwnerService {

  constructor(private socket: SocketConfigService2) { 
  }
  getOwner() {
    return this.socket
    .fromEvent<any>("respuesta-listado")
    .map( data => data );
	//	this.socket.emit("listar-usuario", { data: "nada" });
  }
  sendEmitGetOwner(){
    this.socket.emit("listar-usuario", { data: "nada" });
  }
  saveOwner(Owner){
    this.socket.emit("registrar-usuario", Owner);
  }
  deleteOwner(data){
    this.socket.emit("eliminar-usuario", data);
  }
  eventDeleteOwner(){
    return this.socket
    .fromEvent<any>("respuesta-eliminar-usuario")
    .map( data => data );
  }


  //respuesta-crear
   eventSaveOwner(){
    return this.socket
    .fromEvent<any>("respuesta-crear")
    .map( data => data );
   }

   eventSaveOwnerAll(){
     console.log("hola mundi");
    return this.socket
    .fromEvent<any>("respuesta-crear-todos")
    .map( data => data );
   }
}