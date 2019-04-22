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
  estado:string="espera";

  suscripctionSocket: Subscription;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public reserveService: SocketReservaService,
    public userService: UsuarioProvider) {
      //Inicializacion del constructor
      
     this.GetEvent();
  }

  ionViewDidLoad() {
    this.getListReserve(this.estado);
  }



  //Consumo Socket 
  getListReserve(estado:string) {
    let data = {idcliente: this.userService.UserSeCion.datos._id,estado:estado}
    this.reserveService.emit("listar-reserva", data);
  }

  GetEvent(){
    this.respuestaListarReserva().subscribe((data)=>{
      console.log(data);
      this.reservationsListCompleted=[];
      if(data.error){

      }else{
        data.forEach((element: any )=> {
          if(element.estado == "aceptado"){
            this.reservationsListCompleted.push(element);
          }else{
            this.reservationsList.push(element);
          }
        });
      }
    })
  }
  // Respuestas Socket


  respuestaListarReserva() {
    return this.reserveService.fromEvent<any>('respuesta-listrar-reserva').map(data => data)
  }

  ngOnDestroy() {
    this.suscripctionSocket.unsubscribe();
  }
}
