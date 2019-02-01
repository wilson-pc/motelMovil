import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

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

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  openModal(characterNum) {

    let modal = this.modalCtrl.create(ModalContentPage, characterNum);
    modal.present();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad TopsPage');
  }

}
