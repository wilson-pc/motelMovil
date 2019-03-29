import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform, ViewController } from 'ionic-angular';

/**
 * Generated class for the DescripcionProductoPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-descripcion-producto',
  templateUrl: 'descripcion-producto.html',
})
export class DescripcionProductoPage {
  character:any;
  cantidadReserva = 1;
 
  constructor(public navCtrl: NavController, public navParams: NavParams,public platform: Platform,public viewCtrl: ViewController
    ) {}

  ionViewDidLoad() {
    console.log('ionViewDidLoad DescripcionProductoPage');
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

}

