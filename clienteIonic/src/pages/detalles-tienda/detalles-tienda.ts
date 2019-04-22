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

  constructor(public navCtrl: NavController,public navParams: NavParams,private productoServ: SocketNegocioService3) {
    this.getProduct();
    this.iniciarnegocio();
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
      console.log(datos);
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
