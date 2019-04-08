import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform, ViewController, ToastController } from 'ionic-angular';
import { Productos } from '../../models/Productos';
import { Observable, Subscription } from 'rxjs';
import { SocketReservaService } from '../../services/socket-config.service';
import { UsuarioProvider } from '../../providers/usuario/usuario';
import * as CryptoJS from 'crypto-js';
import { clave } from '../../app/cryptoclave';

@IonicPage()
@Component({
  selector: 'page-descripcion-producto',
  templateUrl: 'descripcion-producto.html',
})
export class DescripcionProductoPage {

  cantidadReserva = 1;
  product: Productos;
  suscripctionSocket: Subscription;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public platform: Platform,
    public viewCtrl: ViewController,
    public toastCtrl: ToastController,
    public productService: SocketReservaService,
    public userService: UsuarioProvider) {
    //Inicializacion del constructor
    this.connectionBackendSocket()
    this.getProduct();
  }

  ionViewDidLoad() {
  }

  dismissModal() {
    this.viewCtrl.dismiss();
  }

  presentToast(reserveMessage: string) {
    const toast = this.toastCtrl.create({
      message: reserveMessage,
      duration: 2000,
      position: 'buttom'
    });
    toast.present();
  }

  getProduct() {
    this.product = this.navParams.get("producto");
    console.log(this.product);
  }

  //Consumo Socket 
  reserveProduct() {
    let reserva = {
      idcliente: this.userService.UserSeCion.datos._id,
      cantidad: this.cantidadReserva,
      idproducto: this.product._id
    }
    
    this.productService.emit("reserva-producto", reserva)
  }

  // Respuestas Socket
  connectionBackendSocket() {
    this.suscripctionSocket = this.respuestaReserva().subscribe((data: any) => {
      if(data.error){
        this.presentToast(data.error);
      }else{
        this.presentToast("Producto Reservado");
        this.dismissModal();
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

  respuestaReserva() {
    return this.productService.fromEvent<any> ('respuesta-reserva-producto').map(data=>data)
  }

  ngOnDestroy() {
    this.suscripctionSocket.unsubscribe();
  }

}
