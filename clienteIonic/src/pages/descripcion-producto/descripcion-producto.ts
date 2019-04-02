import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform, ViewController, ToastController } from 'ionic-angular';
import { Productos } from '../../models/Productos';
import { Observable } from 'rxjs';
import { SocketReservaService } from '../../services/socket-config.service';
import { UsuarioProvider } from '../../providers/usuario/usuario';

@IonicPage()
@Component({
  selector: 'page-descripcion-producto',
  templateUrl: 'descripcion-producto.html',
})
export class DescripcionProductoPage {

  cantidadReserva = 1;
  product: Productos;

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
      position: 'top'
    });
    toast.present();
  }

  getProduct() {
    this.product = this.navParams.get("producto");
    console.log(this.product);
  }

  //Consumo Socket 
  reserveProduct() {
    console.log("reserva");
    let reserva = {
      idcliente: this.userService.UserSeCion.datos._id,
      cantidad: this.cantidadReserva,
      idproducto: this.product._id
    }
    this.productService.emit("reserva-producto", reserva);
    
  }

  // Respuestas Socket
  connectionBackendSocket() {
    this.respuestaReserva().subscribe((data: any) => {
      if(data.error){
        this.presentToast(data.error);
      }else{
        //this.presentToast("Error Imposible reservar");
        console.log(data);
        this.dismissModal();
      }
    });
  }

  respuestaReserva() {
    let observable = new Observable(observer => {
      this.productService.on('respuesta-reserva-producto', (data) => {
        observer.next(data);
      });
    })
    return observable;
  }
}

