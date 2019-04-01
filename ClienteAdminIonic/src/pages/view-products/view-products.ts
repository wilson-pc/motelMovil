import { Component } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';
import { Negocio } from '../../models/Negocio';
import { Productos } from '../../models/Productos';

@Component({
  selector: 'page-view-products',
  templateUrl: 'view-products.html',
})
export class ViewProductsPage {

  commerceOnly: Negocio;
  productOnly: Productos;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public viewCtrl: ViewController, ) {
    //Inicializacion
    this.getProduct();
  }

  ionViewDidLoad() {
  }

  dismissModal(){
    this.viewCtrl.dismiss();
  }

  getProduct() {
    this.productOnly = this.navParams.get('product');
    this.commerceOnly = this.navParams.get('commerce');
  }

}
