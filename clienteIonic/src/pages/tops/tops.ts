import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';
import { DescripcionProductoPage } from '../descripcion-producto/descripcion-producto';
import { SocketConfigService } from '../../services/socket-config.service';
import { Subscription } from 'rxjs';
import { Productos } from '../../models/Productos';

@IonicPage()
@Component({
  selector: 'page-tops',
  templateUrl: 'tops.html',
})
export class TopsPage {

  Negocios = "Moteles";
  listProductTop: Productos[] = [];
  suscripctionSocket: Subscription;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public modalCtrl: ModalController,
    public productService: SocketConfigService) {
    //Inicializacion del constructor
    this.connectionBackendSocket();
    this.getProductTop();
  }

  productDescription(product: Productos) {
    const modal = this.modalCtrl.create(DescripcionProductoPage, { producto: product });
    modal.present();
  }

  ionViewDidLoad() {

  }

  //Consumo Socket 
  getProductTop() {
    let tipo = {};

    if (this.Negocios == "Moteles") {
      tipo = { tipo: "Motel" };
      this.productService.emit("top-productos", tipo);
    }
    if (this.Negocios == "Licorerias") {
      tipo = { tipo: "Licoreria" };
      this.productService.emit("top-productos", tipo);
    }
    if (this.Negocios == "Sexshops") {
      tipo = { tipo: "SexShop" };
      this.productService.emit("top-productos", tipo);
    }
  }

  // Respuestas Socket
  connectionBackendSocket() {
    this.suscripctionSocket = this.respuestaProductTop().subscribe((data: any) => {
      this.listProductTop = data;
    });
  }

  respuestaProductTop() {
    return this.productService.fromEvent<any>('respuesta-top-productos').map(data => data)
  }

  ngOnDestroy() {
    this.suscripctionSocket.unsubscribe();
  }
}
