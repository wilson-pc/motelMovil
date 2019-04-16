import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform, ViewController, ToastController, AlertController } from 'ionic-angular';
import { Productos } from '../../models/Productos';
import { Observable, Subscription } from 'rxjs';
import { SocketReservaService, conexionSocketComportamiento } from '../../services/socket-config.service';
import { UsuarioProvider } from '../../providers/usuario/usuario';
import * as CryptoJS from 'crypto-js';
import { clave } from '../../app/cryptoclave';
import { DetallesTiendaPage } from '../detalles-tienda/detalles-tienda';

@IonicPage()
@Component({
  selector: 'page-descripcion-producto',
  templateUrl: 'descripcion-producto.html',
})
export class DescripcionProductoPage {

  cantidadReserva = 1;
  product: Productos;
  suscripctionSocket: Subscription;
  cantidad:number[]=[];
  motivo: string;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public platform: Platform,
    public viewCtrl: ViewController,
    public toastCtrl: ToastController,
    public alertCtrl: AlertController,
    public productService: SocketReservaService,
    private provedorFavoritos: conexionSocketComportamiento,
    public userService: UsuarioProvider) {
    //Inicializacion del constructor
    this.connectionBackendSocket()
    this.getProduct();
  }

  ionViewDidLoad() {
    for (let index = 1; index < 20; index++) {
      this.cantidad.push(index);
      
    }
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

  //Confirmacion de Denuncia
  showPrompt() {
    const prompt = this.alertCtrl.create({
      title: '¿Denunciar producto?',
      message: "Escribe el motivo de la denuncia: ",
      inputs: [
        {
          name: 'motivo',
          placeholder: 'Motivo'
        },
      ],
      buttons: [
        {
          text: 'Cancelar',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Enviar',
          handler: data => {
            console.log('Saved clicked');
            console.log(data.motivo);
            this.motivo = data.motivo;
            this.reportProduct()
          }
        }
      ]
    });
    prompt.present();
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

  reportProduct() {
    if(this.userService.UserSeCion.datos){
      let denuncia = {
        idusuario: this.userService.UserSeCion.datos._id,
        idproducto: this.product._id,
        detalle: this.motivo
      }
      this.provedorFavoritos.emit('denuncia-producto', denuncia);
    }
    else{
      this.presentToast("Debes iniciar sesion primero!");
    }

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

    this.suscripctionSocket = this.respuestaDenuncia().subscribe((data: any) => {
      if (data.error) {
        this.presentToast(data.error);
      } else {
        this.presentToast("Producto Denunciado");
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

  respuestaDenuncia() {
    return this.provedorFavoritos.fromEvent<any>('respuesta-denuncia-negocio').map(data => data)
  }

  irdetallestienda(){
    this.navCtrl.setRoot(DetallesTiendaPage);
  }

  ngOnDestroy() {
    this.suscripctionSocket.unsubscribe();
  }

}
