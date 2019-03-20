import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';

/**
 * Generated class for the DescriptionSexshopPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-description-sexshop',
  templateUrl: 'description-sexshop.html',
})
export class DescriptionSexshopPage {

  constructor(public navCtrl: NavController,
     public navParams: NavParams,
     public viewCtrl: ViewController) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad DescriptionSexshopPage');
  }
  dismiss() {
    this.viewCtrl.dismiss();
  }

}
