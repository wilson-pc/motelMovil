import { Component } from '@angular/core';
import { NavController, NavParams, ViewController, AlertController } from 'ionic-angular';
import { resizeBase64 } from 'base64js-es6';
import { Negocio } from '../../models/Negocio';
import { Productos } from '../../models/Productos';
import { Observable } from 'rxjs';
import { Tipo } from '../../models/TipoProducto';
import { SocketServiceProduct } from '../../providers/socket-config/socket-config';
import * as CryptoJS from 'crypto-js';
import { clave } from '../../app/cryptoclave';

@Component({
  selector: 'page-register-products',
  templateUrl: 'register-products.html',
})
export class RegisterProductsPage {

  // variables global para .ts y HTML
  commerceOnly: Negocio;
  product: Productos;
  listTypeProduct: Tipo []=[]
  typeProduct: Tipo;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public viewCtrl: ViewController,
    public alertCtrl: AlertController,
    public productService: SocketServiceProduct) {
    //Inicializacion
    this.product = new Productos;
    this.typeProduct = new Tipo;
    this.getCommerceOnly();
    this.connectionBackendSocket();
    this.getTypeProducts();

    console.log(this.listTypeProduct);
  }

  ionViewDidLoad() {
  }

  addTypeProduct() {
    const prompt = this.alertCtrl.create({
      title: 'Crear Tipo',
      message: "Ingrese el nombre de un tipo de producto.",
      inputs: [
        {
          name: 'tipo',
          placeholder: ''
        },
      ],
      buttons: [
        {
          text: 'cancelar',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Guardar',
          handler: data => {
            let dato = data.tipo;
            this.addTypeProducts(dato);
            console.log('Saved clicked', );
          }
        }
      ]
    });
    prompt.present();
  }

  getCommerceOnly() {
    this.commerceOnly = this.navParams.get("negocio");
  }

  closeModal() {
    this.viewCtrl.dismiss();
  }


  registerProduct() {
    console.log("producto registrado: -> ", this.product);
    //this.viewCtrl.dismiss();
  }

  // Carga de la foto
  changeListener($event): void {
    this.readThis($event.target);
  }
  readThis(inputValue: any): void {
    var file: File = inputValue.files[0];
    console.log(inputValue.files[0]);
    var myReader: FileReader = new FileReader();

    myReader.onloadend = (e) => {
      resizeBase64(myReader.result, 200, 300).then((result) => {
        this.product.foto = result;
      });
    }
    myReader.readAsDataURL(file);
  }

  //Consumos de Servicios
  getTypeProducts() {
    // Consulta tipos de producto
    let data = { tipo: this.commerceOnly.tipo.nombre}
    this.productService.emit("listar-tiposproductos-negocio", data);
  }

  addTypeProducts(typeNameProduct:string) {
    // Consulta tipos de producto
    this.typeProduct.tipo = typeNameProduct;
    this.typeProduct.negocio = this.commerceOnly.tipo.nombre;
    let data = this.typeProduct;
    console.log(this.typeProduct);
    this.productService.emit("registrar-tipo-producto", data);
  }

  // Conexion con el Backend
  connectionBackendSocket() {
    // tipos de producto
    this.respuestaTipoProducto().subscribe((data: any) => {
      this.listTypeProduct = data;
      console.log("los tipos son: ", data);
    });

    // agregar tipos de producto
    this.respuestaRegistrarTipoProducto().subscribe((data: any) => {
      console.log("exito Guardado", data);
      this.listTypeProduct.push(data);
    });
  }

  respuestaTipoProducto() {
    let observable = new Observable(observer => {
      this.productService.on('respuesta-listar-tiposproductos-negocio', (data) => {
        observer.next(data);
      });
    })
    return observable;
  }
  respuestaRegistrarTipoProducto() {
    let observable = new Observable(observer => {
      this.productService.on('respuesta-registro-tipoproducto', (data) => {
        observer.next(data);
      });
    })
    return observable;
  }
}
