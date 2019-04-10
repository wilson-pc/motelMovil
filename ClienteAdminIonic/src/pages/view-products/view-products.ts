import { Component } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';
import { Negocio } from '../../models/Negocio';
import * as CryptoJS from 'crypto-js';
import { SocketServiceProduct } from '../../providers/socket-config/socket-config';
import { Productos } from '../../models/Productos';
import { clave } from '../../app/cryptoclave';

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
    public productService: SocketServiceProduct,
    public viewCtrl: ViewController, ) {
    //Inicializacion
    this.getProduct();
  }

  ionViewDidLoad() {
  }

  dismissModal(){
    this.viewCtrl.dismiss();
  }
  changeEstado(event){
console.log(event);

var date = new Date().toUTCString();
//this.productOnly.negocio = this.commerceOnly._id as any;
this.productOnly.modificacion = { fecha: date };
this.productOnly.estado=event;

let data = this.productOnly;
var ciphertext = CryptoJS.AES.encrypt(JSON.stringify({ producto: data }), clave.clave);
this.productService.emit("actualizar-producto", ciphertext.toString());
  }
  getProduct() {
    this.productOnly = this.navParams.get('product');
    console.log(this.productOnly);
    this.commerceOnly = this.navParams.get('commerce');
  }

}
