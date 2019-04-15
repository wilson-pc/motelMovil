import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';
import { TopsPage } from '../tops/tops';

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

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  atras(){
    this.navCtrl.setRoot(TopsPage);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad DetallesTiendaPage');
  }

}
