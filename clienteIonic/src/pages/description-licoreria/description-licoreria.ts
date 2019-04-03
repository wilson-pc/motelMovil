import { Component, OnDestroy } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, ToastController } from 'ionic-angular';
import { Productos } from '../../models/Productos';
import { Favoritos } from '../../models/Favoritos';
import * as CryptoJS from 'crypto-js';
import { clave } from '../../app/cryptoclave';
import { Subscription } from 'rxjs';
import { SocketReservaService, conexionSocketComportamiento, SocketConfigService } from '../../services/socket-config.service';
import { UsuarioProvider } from '../../providers/usuario/usuario';

/**
 * Generated class for the DescriptionLicoreriaPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

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
  favorito: Favoritos;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public viewCtrl: ViewController,
    public toastCtrl: ToastController,
    private reservaProduct: SocketReservaService,
    private userService: UsuarioProvider,
    private productoServ: SocketConfigService,
    private provedorFavoritos: conexionSocketComportamiento,
    private usuarioLogin: UsuarioProvider) {
    //Incializacion del constrictor
    this.favorito = new Favoritos();
    this.clientesSubscription = this.eventoSacarDatos().subscribe(data => {
      this.imagenProducto = data.foto.normal;
      console.log("entrando", this.imagenProducto);
    })
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

  encryptData(data) {
    try {
      return CryptoJS.AES.encrypt(JSON.stringify(data), clave.clave).toString();
    } catch (e) {
      console.log(e);
    }
  }

  sacarDatos() {
    this.productoServ.emit("sacar-producto", { id: this.productoRecibido._id })
  }

  eventoSacarDatos() {
    return this.productoServ.fromEvent<any>('respuesta-sacar-producto').map(data => data)
  }

  respuestaReserva() {
    return this.reservaProduct.fromEvent<any>('respuesta-reserva-producto').map(data => data)
  }

  guardarFavorito() {

    let data = { idproducto: this.productoRecibido._id, idsuario: this.usuarioLogin.UserSeCion.datos._id };

    console.log("datos favoritos:", data);
    this.provedorFavoritos.emit('agregar-favorito', this.encryptData(data));

  }
}
