import { Component, ElementRef, ViewChild } from '@angular/core';
import { NavController, NavParams, ViewController, AlertController, ToastController, ModalController } from 'ionic-angular';
import { resizeBase64 } from 'base64js-es6';
import { Negocio } from '../../models/Negocio';
import { Productos } from '../../models/Productos';
import { Observable, ReplaySubject } from 'rxjs';
import { Tipo } from '../../models/TipoProducto';
import { SocketServiceProduct } from '../../providers/socket-config/socket-config';
import * as CryptoJS from 'crypto-js';
import { clave } from '../../app/cryptoclave';
import { ProductProvider } from '../../providers/product/product';
import { FormBuilder, Validators } from '@angular/forms';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';

@Component({
  selector: 'page-register-products',
  templateUrl: 'register-products.html',
})
export class RegisterProductsPage {
  @ViewChild('fileInput') fileInput: ElementRef;

  // variables global para .ts y HTML
  commerceOnly: Negocio;
  product: Productos;
  nombreimagen: string = "selecciona una foto";
  listTypeProduct: Tipo[] = [];
  typeProduct: Tipo;

  submitAttempt: boolean;
  statusInput: boolean;
  productForm: any;

  constructor(
    private navCtrl: NavController,
    private navParams: NavParams,
    private viewCtrl: ViewController,
    private alertCtrl: AlertController,
    private productProvider: ProductProvider,
    private productService: SocketServiceProduct,
    private formBuilder: FormBuilder,
    private toastCtrl: ToastController) {
    //Inicializacion
    this.product = new Productos;
    this.typeProduct = new Tipo;
    this.getCommerceOnly();
    this.connectionBackendSocket();
    this.getTypeProducts();

    this.validInputFormProducts();
  }

  dismissModal(){
    this.viewCtrl.dismiss();
  }

  validInputFormProducts() {
    this.productForm = this.formBuilder.group({
      productNombre: ['', Validators.compose([Validators.maxLength(30), Validators.required])],
      productImg: ['', Validators.compose([])],
      productTipo: ['', Validators.compose([Validators.required])],
      productPrecio: ['', Validators.compose([Validators.maxLength(4), Validators.pattern('[0-9]*'), Validators.required])],
      productCantidad: ['', Validators.compose([Validators.maxLength(3), Validators.pattern('[0-9]*'), Validators.required])],
      productDescripcion: ['', Validators.compose([Validators.minLength(10), Validators.maxLength(80), Validators.required])]
    });
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

  ionViewDidLoad() {
  }

  filechoosser() {
    this.fileInput.nativeElement.click();
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
          }
        },
        {
          text: 'Guardar',
          handler: data => {
            let dato = data.tipo;
            this.addTypeProducts(dato);
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

  // Carga de la foto
  async fileChange(event) {
    this.readFile(event.srcElement.files[0]).subscribe(data => {
      resizeBase64(data, 90, 60).then((result) => {
        this.product.foto = { miniatura: result, normal: "" }
      });
      resizeBase64(data, 90, 60).then((result) => {
        this.product.foto.normal = result;
        console.log(this.product);
      });
      this.nombreimagen = event.srcElement.files[0].name;
    });
  }

  public readFile(fileToRead: File): Observable<MSBaseReader> {
    let base64Observable = new ReplaySubject<MSBaseReader>(1);
    let fileReader = new FileReader();

    fileReader.onload = event => {
      base64Observable.next(fileReader.result);
    };
    fileReader.readAsDataURL(fileToRead);
    return base64Observable;
  }

  //Consumos de Servicios
  getTypeProducts() {
    // Consulta tipos de producto
    let data = { tipo: this.commerceOnly.tipo.nombre }
    this.productService.emit("listar-tiposproductos-negocio", data);
  }

  addTypeProducts(typeNameProduct: string) {
    // Consulta tipos de producto
    this.typeProduct.tipo = typeNameProduct;
    this.typeProduct.negocio = this.commerceOnly.tipo.nombre;
    let data = this.typeProduct;
    this.productService.emit("registrar-tipo-producto", data);
    this.getTypeProducts();
  }

  registerProduct() {
    // Guardar producto
    if (this.product.foto == undefined) {
      this.product.foto = { miniatura: this.productProvider.imageDefault, normal: this.productProvider.imageDefault }
    }

    this.statusInput = true;
    if (!this.productForm.valid) {
      this.alertMessage("Imposible registrar verifique los campos de registro.")
    }
    else {
      var date = new Date().toUTCString();
      this.product.negocio = this.commerceOnly._id as any;
      this.product.creacion = { fecha: date };
      this.product.modificacion = { fecha: date };
      let data = this.product;

      console.log("Producto A GUARDAR", data);
      var ciphertext = CryptoJS.AES.encrypt(JSON.stringify({ producto: data }), clave.clave);
      this.productService.emit("registrar-producto", ciphertext.toString());
    }
  }

  registerHabitacion() {
    // Guardar producto
    if (this.product.foto == undefined) {
      this.product.foto = { miniatura: this.productProvider.imageDefault, normal: this.productProvider.imageDefault }
    }

    this.statusInput = true;
    if (!this.productForm.valid) {
      this.alertMessage("Imposible registrar verifique los campos de registro.")
    }
    else {
      // datos habitacion
      let estado = "Disponible";
      let seccionubicacion = "Piso 2";
    
      var date = new Date().toUTCString();
      this.product.negocio = this.commerceOnly._id as any;
      this.product.creacion = { fecha: date };
      this.product.modificacion = { fecha: date };
      let data = this.product;

      console.log("Producto A GUARDAR", data);
      var ciphertext = CryptoJS.AES.encrypt(JSON.stringify({ producto: data }), clave.clave);
      this.productService.emit("registrar-producto", ciphertext.toString());
    }
  }

  // Conexion con el Backend
  connectionBackendSocket() {
    // tipos de producto
    this.respuestaTipoProducto().subscribe((data: any) => {
      this.listTypeProduct = data;
    });

    // agregar tipos de producto
    this.respuestaRegistrarTipoProducto().subscribe((data: any) => {
      this.alertMessage("Tipo producto '"+ data.tipo + "', agregado.");
    });

    // agregar producto
    this.respuestaRegistrarProducto().subscribe((data: any) => {
      this.alertMessage("Producto '"+ data.nombre + "', registrado.");
      this.viewCtrl.dismiss();
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
  respuestaRegistrarProducto() {
    let observable = new Observable(observer => {
      this.productService.on('respuesta-producto', (data) => {
        observer.next(data);
      });
    })
    return observable;
  }
}
