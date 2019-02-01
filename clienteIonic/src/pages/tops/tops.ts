import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';
import { DescripcionProductoPage } from '../descripcion-producto/descripcion-producto';

/**
 * Generated class for the TopsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-tops',
  templateUrl: 'tops.html',
})
export class TopsPage {

  constructor(public navCtrl: NavController, public navParams: NavParams,public modalCtrl: ModalController) {
  }

  presentModal() {
    const modal = this.modalCtrl.create(DescripcionProductoPage);
    modal.present();
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad TopsPage');
  }

}
