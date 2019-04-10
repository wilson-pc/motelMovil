import { Component } from '@angular/core';
import { NavController, NavParams, ModalController, AlertController, ToastController } from 'ionic-angular';
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
import { ViewProductsPage } from '../view-products/view-products';

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
  productNameDelte: string;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public userOnlyProvider: UserOnlyProvider,
    public commerceProvider: CommerceProvider,
    public commerceService: SocketServiceCommerce,
    public productService: SocketServiceProduct,
    public modalCtrl: ModalController,
    public alertCtrl: AlertController,
    private toastCtrl: ToastController) {
    //Inicializacion
    this.connectionBackendSocket();
    this.getAllCommerce();
  }

  ionViewDidLoad() {
  }

  alertMessage(message) {
    this.presentToast(message);
  }

  presentToast(message) {
    let toast = this.toastCtrl.create({
      message: message,
      duration: 3000,
      position: 'top'
    });

    toast.onDidDismiss(() => {
    });

    toast.present();
  }

  doRefresh(event) {
    setTimeout(() => {
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
  async getProductsCommerce() {
    let data = { termino: this.commerceOnly._id }
    this.productService.emit("listar-producto-negocio", data);
  }

  addProduct() {
    const modal = this.modalCtrl.create(RegisterProductsPage, { negocio: this.commerceOnly });
    modal.present();
  }

  infoProduct(product) {
    console.log(product);
    const modal = this.modalCtrl.create(ViewProductsPage, {product: product, commerce: this.commerceOnly });
    modal.present();
  }

  updateProduct(producto:Productos) {
      console.log(producto);
    const modal = this.modalCtrl.create(EditProductsPage, { product: producto, commerce: this.commerceOnly });
    modal.present();
    //this.getProductsCommerce();
  }

  deleteProduct(product:Productos) {
    console.log(product);
    const prompt = this.alertCtrl.create({
      title: 'Eliminar Producto',
      message: "Ingrese la razon por el cual esta eliminando este producto. (mínimo 15 caracteres)",
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
            if(data.razon.length >= 15){
              this.productNameDelte = product.nombre;
              product.eliminado.razon = data.razon;
              let datos = { id: product._id, razon: product.eliminado.razon }
              var ciphertext = CryptoJS.AES.encrypt(JSON.stringify(datos), clave.clave);
              this.productService.emit("eliminar-producto", ciphertext.toString());
            }else{
              this.alertMessage("La razon debe contener mínimo 15 caracteres.");
            }
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
      console.log(data);
      this.listProducts = data;
    });

    // Eliminar producto
    this.respuestaEliminarProductoNegocio().subscribe((data: any) => {
      this.alertMessage("Producto '" + this.productNameDelte + "', eliminado exitosamente.");
      this.getProductsCommerce();
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
  respuestaEliminarProductoNegocio() {
    let observable = new Observable(observer => {
      this.productService.on('respuesta-eliminar-producto', (data) => {
        observer.next(data);
      });
    })
    return observable;
  }
}
