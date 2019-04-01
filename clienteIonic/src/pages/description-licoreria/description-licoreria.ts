import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { Productos } from '../../models/Productos';

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
export class DescriptionLicoreriaPage {
  productoRecibido:Productos;
  imagenProducto:any;
  cantidadReserva = 1;

  constructor(public navCtrl: NavController, 
    public navParams: NavParams,
    public viewCtrl: ViewController) {
      this.obtenerDatosProducto();
  }
  obtenerDatosProducto(){
    this.productoRecibido=this.navParams.get("producto")
    this.imagenProducto=this.productoRecibido.foto.miniatura;
    console.log("esto es el producto",this.productoRecibido);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad DescriptionLicoreriaPage');
  }
  dismiss() {
    this.viewCtrl.dismiss();
  }

}
