import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';
import { DescripcionProductoPage } from '../descripcion-producto/descripcion-producto';
import { SocketConfigService } from '../../services/socket-config.service';
import { Observable } from 'rxjs';
import { Productos } from '../../models/Productos';

@IonicPage()
@Component({
  selector: 'page-tops',
  templateUrl: 'tops.html',
})
export class TopsPage {

  Negocios = "Moteles";
  listProductTop: Productos [] = [];

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public modalCtrl: ModalController,
    public productService: SocketConfigService) {
    //Inicializacion del constructor
    this.connectionBackendSocket();
    this.getProductTop();
  }

  presentModal() {
    const modal = this.modalCtrl.create(DescripcionProductoPage);
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
    this.respuestaProductTop().subscribe((data: any) => {
      this.listProductTop = data;
      console.log(this.listProductTop);
    });
  }

  respuestaProductTop() {
    let observable = new Observable(observer => {
      this.productService.on('respuesta-top-productos', (data) => {
        observer.next(data);
      });
    })
    return observable;
  }


}
