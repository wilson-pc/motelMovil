import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';
import { DescripcionProductoPage } from '../descripcion-producto/descripcion-producto';
import { DetallesTiendaPage } from '../detalles-tienda/detalles-tienda';
import { SocketConfigService, conexionSocketComportamiento } from '../../services/socket-config.service';
import { Subscription } from 'rxjs';
import { Productos } from '../../models/Productos';
import * as CryptoJS from 'crypto-js';
import { clave } from '../../app/cryptoclave';
import { UsuarioProvider } from '../../providers/usuario/usuario';

@IonicPage()
@Component({
  selector: 'page-tops',
  templateUrl: 'tops.html',
})
export class TopsPage {

  Negocios = "Moteles";
  listProductTop: Productos[] = [];
  suscripctionSocket: Subscription;
  calificarProducto: any = [];

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public modalCtrl: ModalController,
    private userServ:UsuarioProvider,
    public productService: SocketConfigService,
    public comportamientoService: conexionSocketComportamiento) {
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

  encryptData(data) {
    try {
      return CryptoJS.AES.encrypt(JSON.stringify(data), clave.clave).toString();
    } catch (e) {
      console.log(e);
    }
  }

  //Consumo Socket 
  getProductTop() {
    let tipo = {};

    if (this.Negocios == "Moteles") {
      console.log("negocios motelesshhhhh hj");
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

  likeProduct(idProducto){
    console.log("Producto: ", idProducto);
    var datos = { idcliente: this.userServ.UserSeCion.datos._id, idproducto: idProducto };
    var datosCrypt = this.encryptData(datos);
    this.comportamientoService.emit('calificar-producto', datosCrypt);
  }

  dislikeProduct(idProducto){
    console.log("Producto: ", idProducto);
    var datos = { idcliente: this.userServ.UserSeCion.datos._id, idproducto: idProducto };
    var datosCrypt = this.encryptData(datos);
    this.comportamientoService.emit('descalificar-producto', datosCrypt);
  }

  // Respuestas Socket
  connectionBackendSocket() {
    this.suscripctionSocket = this.respuestaProductTop().subscribe((data: any) => {
      this.listProductTop = data;
    });

    this.suscripctionSocket = this.respuestaCalificarProducto().subscribe((data: any) => {
      console.log("Calificado ");
    });

    this.suscripctionSocket = this.respuestaDescalificarProducto().subscribe((data: any) => {
      console.log("Descalificado ");
    });
  }

  respuestaProductTop() {
    return this.productService.fromEvent<any>('respuesta-top-productos').map(data => data)
  }

  respuestaCalificarProducto(){
    return this.comportamientoService.fromEvent<any>('respuesta-calificar-producto').map(data => data)
  }

  respuestaDescalificarProducto(){
    return this.comportamientoService.fromEvent<any>('respuesta-descalificar-producto').map(data => data)
  }

  ngOnDestroy() {
    this.suscripctionSocket.unsubscribe();
  }
}
