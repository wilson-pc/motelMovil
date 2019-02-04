import { Component } from '@angular/core';
import { NavController, NavParams, ModalController } from 'ionic-angular';
import { CommerceProvider } from '../../providers/commerce/commerce';
import { UserOnlyProvider } from '../../providers/user-only/user-only';
import { SocketServiceCommerce, SocketServiceProduct } from '../../providers/socket-config/socket-config';
import * as CryptoJS from 'crypto-js';
import { clave } from "../../app/cryptoclave";
import { Negocio } from '../../models/Negocio';
import { Observable } from 'rxjs';
import { Productos } from '../../models/Productos';
import { RegisterProductsPage } from '../register-products/register-products';

@Component({
  selector: 'page-list-products',
  templateUrl: 'list-products.html',
})
export class ListProductsPage {

  // variables de acceso interno y externo
  listCommerce: Negocio[] = [];
  listProducts: Productos[] = [];
  commerceName: string;

  // variables internas
  productOnly: Productos;
  commerceOnly: Negocio;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public userOnlyProvider: UserOnlyProvider,
    public commerceProvider: CommerceProvider,
    public commerceService: SocketServiceCommerce,
    public productService: SocketServiceProduct,
    public modalCtrl: ModalController) {
    //Inicializacion
    this.connectionBackendSocket();
    this.getAllCommerce();
  }

  ionViewDidLoad() {
  }

  doRefresh(event) {
    console.log('Comenzar la operación asíncrona');
    //this.getAllCommerce();
    setTimeout(() => {
      console.log('La operación asíncrona ha finalizado');
      this.getAllCommerce();
      event.complete();
    }, 2000);
  }

  //Consumos de Servicios
  getAllCommerce() {
    // Consulta todos los negocios de un usuario
    let data = { id: this.userOnlyProvider.userSesion.datos._id, tipo: "negocios" }
    var ciphertext = CryptoJS.AES.encrypt(JSON.stringify(data), clave.clave);
    this.commerceService.emit("listar-negocios-de-usuario", ciphertext.toString());
  }

  //Consumos de Servicios
  getProducts(commerce) {
    this.commerceName = commerce.nombre;
    this.commerceOnly = commerce;
    console.log("Carga de productos del negocio: => ", commerce);
    let data = { termino: commerce._id }
    //var ciphertext = CryptoJS.AES.encrypt(JSON.stringify(data), clave.clave);
    //this.productService.emit("listar-producto-negocio", ciphertext.toString());

    this.productService.emit("listar-producto-negocio", data);
  }

  addProduct() {
    console.log("Producto para guardar => ", this.commerceOnly);
    let modal = this.modalCtrl.create(RegisterProductsPage, { negocio: this.commerceOnly });
    modal.present();
  }

  getAllProduct() {

  }

  // Conexion con el Backend
  connectionBackendSocket() {
    // negocios de un usuario
    this.respuestaNegociosUsuario().subscribe((data: any) => {
      this.listCommerce = data;
    });

    // productos de un negocio
    this.respuestaProductosNegocio().subscribe((data: any) => {
      this.listProducts = data;
      console.log("Products of List: ", this.listProducts);
    });

  }

  respuestaNegociosUsuario() {
    let observable = new Observable(observer => {
      this.commerceService.on('respuesta-listar-negocio-de-usuario', (data) => {
        observer.next(data);
      });
    })
    return observable;
  }
  respuestaProductosNegocio() {
    let observable = new Observable(observer => {
      this.productService.on('respuesta-listado-producto-negocio', (data) => {
        observer.next(data);
      });
    })
    return observable;
  }
}
