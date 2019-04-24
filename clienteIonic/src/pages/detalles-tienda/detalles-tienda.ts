import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';
import { TabsPage } from '../tabs/tabs';
import { Productos } from '../../models/Productos';
import { SocketNegocioService3, conexionSocketComportamiento, SocketConfigService } from '../../services/socket-config.service';
import { Negocio } from '../../models/Negocio';

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
  nombrene: String;
  fotone: String;
  direccione: String;
  negocioaux: Negocio;
  direcciongpsne: String;
  telefonone: String;

  constructor(public navCtrl: NavController,public navParams: NavParams,private productoServ: SocketNegocioService3,private productsnegocio: SocketConfigService) {
    this.getProduct();
    this.iniciarnegocio();
    this.datosproductos();
  }

  atras(){
    this.navCtrl.setRoot(TabsPage);
  }

  sacarDatos() {
    this.productoServ.emit("sacar-negocio", { id: this.producto.negocio });
  }

  sacarProductos(){
    this.productsnegocio.emit("listar-productos-negocio",{ negocio: this.producto.negocio });
  }

   sacarnegocio(){
    return this.productoServ
    .fromEvent<any>("respuesta-sacar-negocio")
    .map( data => data );
  }

  sacarProductosNegocio(){
    return this.productsnegocio
    .fromEvent<any>("respuesta-listado-productos-negocio")
    .map( data => data);
  }

   iniciarnegocio(){
    this.sacarnegocio().subscribe(datos=>{
      console.log(datos);
      this.nombrene=datos.nombre;
      this.fotone=datos.foto;
      this.direccione=datos.direccion.descripcion;
      this.direcciongpsne=datos.direccion.ubicaciongps;
      this.telefonone=datos.telefono;
    });
  }

  datosproductos(){
    this.sacarProductosNegocio().subscribe(datos=>{
      console.log(datos);
    });
  }

   getProduct() {
    this.producto = this.navParams.get("producto");
    console.log(this.producto.negocio);
   }

  ionViewDidLoad() {
    this.sacarDatos();
    this.sacarProductos();
  }

}
