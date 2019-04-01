import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { Productos } from '../../models/Productos';

/**
 * Generated class for the DescriptionMotelPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-description-motel',
  templateUrl: 'description-motel.html',
})
export class DescriptionMotelPage {
  producto:Productos;

  constructor(public navCtrl: NavController,
     public navParams: NavParams,
     public viewCtrl: ViewController) {
      //console.log("esto es el producto",this.producto.nombre);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad DescriptionMotelPage');
  }
  dismiss() {
    this.viewCtrl.dismiss();
  }

}
