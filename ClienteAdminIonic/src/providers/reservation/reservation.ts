import { SocketServiceReserva } from './../socket-config/socket-config';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

/*
  Generated class for the ReservationProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class ReservationProvider {

  constructor(public http: HttpClient,private socketReserva:SocketServiceReserva) {
    console.log('Hello ReservationProvider Provider');
  }
  getReservas() {
    return this.socketReserva
    .fromEvent<any>("respuesta-listrar-reserva")
    .map( data => data );
	//	this.socket.emit("listar-usuario", { data: "nada" });
  }
  sendEmitGetReservas(usuario){
    this.socketReserva.emit("listar-reserva",usuario );
  }
  sendEmitCambiarReserva(data){
    this.socketReserva.emit("cambiar-reserva",data)
  }
  //respuesta-cambiar-reserva
  cambiarReserva(){
    return this.socketReserva
    .fromEvent<any>("respuesta-cambiar-reserva")
    .map( data => data );
  }

}
