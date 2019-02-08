import { Component } from '@angular/core';
import { NavController, NavParams, ModalController, AlertController } from 'ionic-angular';
import { CommerceProvider } from '../../providers/commerce/commerce';
import { UserOnlyProvider } from '../../providers/user-only/user-only';
import { SocketServiceCommerce, SocketServiceProduct } from '../../providers/socket-config/socket-config';
import * as CryptoJS from 'crypto-js';
import { clave } from "../../app/cryptoclave";
import { Negocio } from '../../models/Negocio';
import { Observable } from 'rxjs';
import { Productos } from '../../models/Productos';
import { RegisterProductsPage } from '../register-products/register-products';
import { EditProductsPage } from '../edit-products/edit-products';

@Component({
  selector: 'page-list-products',
  templateUrl: 'list-products.html',
})
export class ListProductsPage {

  // variables de acceso interno y externo
  space: string = "   ";
  listCommerce: Negocio[] = [];
  listProducts: Productos[] = [];
  commerceName: string;

  // variables internas
  productOnly: Productos;
  commerceOnly: Negocio;
  updateList: false;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public userOnlyProvider: UserOnlyProvider,
    public commerceProvider: CommerceProvider,
    public commerceService: SocketServiceCommerce,
    public productService: SocketServiceProduct,
    public modalCtrl: ModalController,
    public alertCtrl: AlertController) {
    //Inicializacion
    this.connectionBackendSocket();
    this.getAllCommerce();

    if(this.updateList){
      this.getAllCommerce();
    }

  }

  ionViewDidLoad() {
  }

  doRefresh(event) {
    console.log('Comenzar la operación asíncrona');
    //this.getAllCommerce();
    setTimeout(() => {
      console.log('La operación asíncrona ha finalizado');
      this.getProductsCommerce();
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

  getProducts(commerce) {
    this.commerceName = commerce.nombre;
    this.commerceOnly = commerce;
    let data = { termino: commerce._id }
    this.productService.emit("listar-producto-negocio", data);
  }

  // Metodo para actualizar lista despues de alguna accion
  getProductsCommerce() {
    let data = { termino: this.commerceOnly._id }
    this.productService.emit("listar-producto-negocio", data);
  }

  addProduct() {
    console.log("Producto para guardar => ", this.commerceOnly);
    let modal = this.modalCtrl.create(RegisterProductsPage, { negocio: this.commerceOnly });
    modal.present();
    this.getProductsCommerce();
  }

  infoProduct() {

  }

  updateProduct(product) {
    console.log("Editar producto: ", product.nombre);
    let modal = this.modalCtrl.create(EditProductsPage, { product: product, commerce: this.commerceOnly });
    modal.onDidDismiss(action => {
      this.getProductsCommerce();
    });
    modal.present();
  }

  deleteProduct(product) {
    const prompt = this.alertCtrl.create({
      title: 'Eliminar Producto',
      message: "Ingrese la razon por el cual esta eliminando este producto.",
      inputs: [
        {
          name: 'razon',
          placeholder: ''
        },
      ],
      buttons: [
        {
          text: 'cancelar',
          handler: data => {
            //console.log('Cancel clicked');
          }
        },
        {
          text: 'Eliminar',
          handler: data => {
            product.eliminado.razon = data.razon;
            let datos = { id: product._id, razon: product.eliminado.razon }
            var ciphertext = CryptoJS.AES.encrypt(JSON.stringify(datos), clave.clave);
            this.productService.emit("eliminar-producto", ciphertext.toString());
            this.getProductsCommerce();
          }
        }
      ]
    });
    prompt.present();
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
    });

    // Eliminar producto
    this.respuestaEliminarProductoNegocio().subscribe((data: any) => {
      console.log("estado eliminado: ", data);
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
  respuestaVerProductoNegocio() {
    let observable = new Observable(observer => {
      this.productService.on('respuesta-listado-producto-negocio', (data) => {
        observer.next(data);
      });
    })
    return observable;
  }
  respuestaEditarProductoNegocio() {
    let observable = new Observable(observer => {
      this.productService.on('respuesta-listado-producto-negocio', (data) => {
        observer.next(data);
      });
    })
    return observable;
  }
  respuestaEliminarProductoNegocio() {
    let observable = new Observable(observer => {
      this.productService.on('respuesta-eliminar-producto', (data) => {
        observer.next(data);
      });
    })
    return observable;
  }
}
