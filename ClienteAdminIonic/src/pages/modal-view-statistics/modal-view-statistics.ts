import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';

/**
 * Generated class for the ModalViewStatisticsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-modal-view-statistics',
  templateUrl: 'modal-view-statistics.html',
})
export class ModalViewStatisticsPage {

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public modalController : ViewController) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ModalViewStatisticsPage');
  }

  atras(){
    this.modalController.dismiss();
  }

}
