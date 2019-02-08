import { Component, ElementRef, ViewChild } from '@angular/core';
import { NavController, NavParams, AlertController, ViewController } from 'ionic-angular';
import { Productos } from '../../models/Productos';
import { Negocio } from '../../models/Negocio';
import { Observable, ReplaySubject } from 'rxjs';
import { Tipo } from '../../models/TipoProducto';
import { SocketServiceProduct } from '../../providers/socket-config/socket-config';
import * as CryptoJS from 'crypto-js';
import { clave } from '../../app/cryptoclave';
import { resizeBase64 } from 'base64js-es6';

@Component({
  selector: 'page-edit-products',
  templateUrl: 'edit-products.html',
})
export class EditProductsPage {
  @ViewChild('fileInput') fileInput: ElementRef;
  productOnly: Productos;
  commerceOnly: Negocio;
  actionSelectType: boolean;
  nombreimagen: string = "selecciona una foto";

  listTypeProduct: Tipo[] = [];
  typeProduct: Tipo;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public viewCtrl: ViewController,
    public alertCtrl: AlertController,
    public productService: SocketServiceProduct) {
    //Inicializacion
    this.actionSelectType = false;
    this.getCommerceAndProduct();
    this.connectionBackendSocket();
    this.typeProduct = new Tipo;
  }

  ionViewDidLoad() {
  }

  selectType(status: boolean){
    this.actionSelectType = status;
  }

  closeModal() {
    this.viewCtrl.dismiss();
  }

  filechoosser() {
    this.fileInput.nativeElement.click();
  }

  async getCommerceAndProduct() {
    this.productOnly = this.navParams.get("product");
    this.commerceOnly = this.navParams.get("commerce");
    console.log("Tipo: ", this.productOnly.tipo.tipo);
    this.getTypeProducts();
  }

   // Carga de la foto
   async fileChange(event) {
    // alert(event.srcElement.files[0].name);
    this.readFile(event.srcElement.files[0]).subscribe(data => {
      resizeBase64(data, 90, 60).then((result) => {
        this.productOnly.foto={miniatura:result,normal:""}
       
       
      });
      resizeBase64(data, 90, 60).then((result) => {
        this.productOnly.foto.normal=result;
        console.log(this.productOnly);
       
      });
      this.nombreimagen=event.srcElement.files[0].name;
      //   alert(dec.substring(0, 10));

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
  updateProduct() {
    console.log("Producto actualizado", this.productOnly);
    // Guardar producto
   var date = new Date().toUTCString();
    this.productOnly.negocio = this.commerceOnly._id as any;
    this.productOnly.modificacion = { fecha: date };

    let data = this.productOnly;
    var ciphertext = CryptoJS.AES.encrypt(JSON.stringify({producto: data}), clave.clave);
    this.productService.emit("actualizar-producto", ciphertext.toString());
    
    // cerrar MODAL
    this.viewCtrl.dismiss();
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
            console.log('Saved clicked');
          }
        }
      ]
    });
    prompt.present();
  }

  async getTypeProducts() {
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

  // Conexion con el Backend
  connectionBackendSocket() {
    // tipos de producto
    this.respuestaTipoProducto().subscribe((data: any) => {
      this.listTypeProduct = data;
      /*let auc = this.listTypeProduct.filter(tipoP => tipoP.tipo == this.productOnly.tipo.tipo)[0];
      let ouc = this.listTypeProduct.indexOf(auc);
      console.log(ouc, auc);
      this.listTypeProduct.splice(ouc,1);*/

      console.log("los tipos son: ", this.listTypeProduct);
    });

    // agregar tipos de producto
    this.respuestaRegistrarTipoProducto().subscribe((data: any) => {
      console.log("exito tipo producto Guardado", data);
    });

    // actualizar producto
    this.respuestaActualizarProducto().subscribe((data: any) => {
      console.log("Producto Modificado", data);
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
  respuestaActualizarProducto() {
    let observable = new Observable(observer => {
      this.productService.on('respuesta-actualizar-producto', (data) => {
        observer.next(data);
      });
    })
    return observable;
  }
}
