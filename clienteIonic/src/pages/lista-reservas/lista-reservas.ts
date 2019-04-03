import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { SocketReservaService } from '../../services/socket-config.service';
import { Subscription } from 'rxjs';
import { UsuarioProvider } from '../../providers/usuario/usuario';

@IonicPage()
@Component({
  selector: 'page-lista-reservas',
  templateUrl: 'lista-reservas.html',
})
export class ListaReservasPage {

  tipo = "Reserva";
  reservationsListCompleted: any [] = [];
  reservationsList: any [] = [];
  list: any [] = [];

  suscripctionSocket: Subscription;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public reserveService: SocketReservaService,
    public userService: UsuarioProvider) {
      //Inicializacion del constructor
      this.connectionBackendSocket();
      this.getListReserve();
  }

  ionViewDidLoad() {
    console.log(this.reservationsListCompleted);
    console.log(this.reservationsList);
  }

  listReserve(){
    this.list.forEach((element: any )=> {
      if(element.estado == "recogido"){
        this.reservationsListCompleted.push(element);
      }else{
        this.reservationsList.push(element);
      }
    });
  }

  //Consumo Socket 
  getListReserve() {
    let data = {idcliente: this.userService.UserSeCion.datos._id}
    this.reserveService.emit("listar-reserva", data);
  }

  // Respuestas Socket
  connectionBackendSocket() {
    this.suscripctionSocket = this.respuestaProductTop().subscribe((data: any) => {
      this.list = data;
      this.listReserve();
    });
  }

  respuestaProductTop() {
    return this.reserveService.fromEvent<any>('respuesta-listrar-reserva').map(data => data)
  }

  ngOnDestroy() {
    this.suscripctionSocket.unsubscribe();
  }
}
