import { Subscription } from 'rxjs';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, ViewController } from 'ionic-angular';
import { SocketReservaService } from '../../services/socket-config.service';
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
    public userService: UsuarioProvider,
    public viewCtrl: ViewController,
    public toastCtrl: ToastController) {
      //Inicializacion del constructor
      
     this.GetEvent();
  }

  ionViewDidLoad() {
    this.getListReserve(this.estado);
  }

  presentToast(reserveMessage: string) {
    const toast = this.toastCtrl.create({
      message: reserveMessage,
      duration: 2000,
      position: 'buttom'
    });
    toast.present();
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

  //Consumo Socket 
  getListReserve(estado:string) {
    if(this.userService.UserSeCion.datos){
      let data = {idcliente: this.userService.UserSeCion.datos._id,estado:estado}
      console.log(data);
      this.reserveService.emit("listar-reserva", data);
    }
    else{
      this.presentToast("Debes iniciar sesion primero!");
    }
  }

  GetEvent(){
  this.suscripctionSocket= this.respuestaListarReserva().subscribe((data)=>{
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
