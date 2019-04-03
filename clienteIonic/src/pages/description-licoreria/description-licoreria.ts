import { Component, OnDestroy } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, ToastController } from 'ionic-angular';
import { Productos } from '../../models/Productos';
import { SocketConfigService, SocketReservaService } from '../../services/socket-config.service';
import { Subscription } from 'rxjs/Subscription';
import { UsuarioProvider } from '../../providers/usuario/usuario';

@IonicPage()
@Component({
  selector: 'page-description-licoreria',
  templateUrl: 'description-licoreria.html',
})
export class DescriptionLicoreriaPage implements OnDestroy {
  productoRecibido: Productos;
  imagenProducto: any;
  cantidadReserva = 1;
  clientesSubscription: Subscription;
  suscripctionSocket: Subscription;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public viewCtrl: ViewController,
    public toastCtrl: ToastController,
    private productoServ: SocketConfigService,
    private reservaProduct: SocketReservaService,
    private userService: UsuarioProvider) {
    //Incializacion del constrictor
      this.obtenerDatosProducto();
      this.connectionBackendSocket();
  }

  ngOnDestroy() {
    this.clientesSubscription.unsubscribe();
    this.suscripctionSocket.unsubscribe();
  }

  obtenerDatosProducto() {
    this.productoRecibido = this.navParams.get("producto")
    this.sacarDatos();
  }

  ionViewDidLoad() {
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

  sacarDatos() {
    this.productoServ.emit("sacar-producto", { id: this.productoRecibido._id })
  }

  //Consumo Socket 
  reserveProduct() {
    let reserva = {
      idcliente: this.userService.UserSeCion.datos._id,
      cantidad: this.cantidadReserva,
      idproducto: this.productoRecibido._id
    }

    this.reservaProduct.emit("reserva-producto", reserva)
  }

  // Respuestas Socket
  connectionBackendSocket() {
    this.clientesSubscription = this.eventoSacarDatos().subscribe(data => {
      this.imagenProducto = data.foto.normal;
    })

    this.suscripctionSocket = this.respuestaReserva().subscribe((data: any) => {
      if (data.error) {
        this.presentToast(data.error);
      } else {
        this.presentToast("Producto Reservado");
        this.dismiss();
      }
    });
  }

  eventoSacarDatos() {
    return this.productoServ.fromEvent<any>('respuesta-sacar-producto').map(data => data)
  }

  respuestaReserva() {
    return this.reservaProduct.fromEvent<any>('respuesta-reserva-producto').map(data => data)
  }

}
