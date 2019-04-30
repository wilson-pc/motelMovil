import { ProductProvider } from './../../providers/product/product';
import { Component } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';
import { Negocio } from '../../models/Negocio';
import * as CryptoJS from 'crypto-js';
import { SocketServiceProduct } from '../../providers/socket-config/socket-config';
import { Productos } from '../../models/Productos';
import { clave } from '../../app/cryptoclave';
import { Observable } from 'rxjs';
import { Subscription } from 'rxjs/Subscription';


@Component({
  selector: 'page-view-products',
  templateUrl: 'view-products.html',
})
export class ViewProductsPage {

  private suscribe: Subscription = new Subscription();
  commerceOnly: Negocio;
  productOnly: Productos;
  listImages:string[]=[];

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public productService: SocketServiceProduct,
    public viewCtrl: ViewController, ) {
    //Inicializacion
    this.getProduct();
  }

  ionViewDidLoad() {
    this.connection();
  }
sacarProducto(){
  this.productService.emit("sacar-producto",{id:this.productOnly._id})
}

  dismissModal(){
    this.viewCtrl.dismiss();
  }

  connection(){
   this.suscribe= this.respuestaSacarProducto().subscribe((data: Productos) => {
      console.log(data);
     this.listImages=data.fotos;
   
     });
  }
  ionViewWillLeave() {
    console.log("close");
    this.suscribe.unsubscribe();
    }
  respuestaSacarProducto() {
    let observable = new Observable(observer => {
      this.productService.on('respuesta-sacar-producto', (data) => {

        observer.next(data);
      });
    })
    return observable;
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
    
    this.commerceOnly = this.navParams.get('commerce');
    this.sacarProducto();
  }

}
