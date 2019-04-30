import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';
import { TabsPage } from '../tabs/tabs';
import { Productos } from '../../models/Productos';
import { SocketNegocioService3, conexionSocketComportamiento, SocketConfigService } from '../../services/socket-config.service';
import { Negocio } from '../../models/Negocio';
import { Subscription } from 'rxjs';

/**
 * Generated class for the DetallesTiendaPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-detalles-tienda',
  templateUrl: 'detalles-tienda.html',
})
export class DetallesTiendaPage {

  producto: Productos;
  listProductTop: Productos[] = [];
  suscripctionSocket: Subscription;
  nombrene: String;
  fotone: String;
  direccione: String;
  negocioaux: Negocio;
  direcciongpsne: String;
  telefonone: String;

  constructor(public navCtrl: NavController,public navParams: NavParams,private productoServ: SocketNegocioService3,private productsnegocio: SocketConfigService) {
    this.getProduct();
    this.iniciarnegocio();
    this.connectionBackendSocket();
    this.getProductTop();
  }

  getProductTop() {
    this.productsnegocio.emit("listar-productos-negocio",{ termino: this.producto.negocio });
  }

  connectionBackendSocket() {
    this.suscripctionSocket = this.respuestaProductTop().subscribe((data: any) => {
      this.listProductTop = data;
    });
  }

  respuestaProductTop() {
    return this.productsnegocio.fromEvent<any>('respuesta-listado-productos-negocio').map(data => data)
  }

  atras(){
    this.navCtrl.setRoot(TabsPage);
  }

  sacarDatos() {
    this.productoServ.emit("sacar-negocio", { id: this.producto.negocio });
  }

   sacarnegocio(){
    return this.productoServ
    .fromEvent<any>("respuesta-sacar-negocio")
    .map( data => data );
  }

   iniciarnegocio(){
    this.sacarnegocio().subscribe(datos=>{
      this.nombrene=datos.nombre;
      this.fotone=datos.foto;
      this.direccione=datos.direccion.descripcion;
      this.direcciongpsne=datos.direccion.ubicaciongps;
      this.telefonone=datos.telefono;
    });
  }

   getProduct() {
    this.producto = this.navParams.get("producto");
   }

  ionViewDidLoad() {
    this.sacarDatos();
  }

}
