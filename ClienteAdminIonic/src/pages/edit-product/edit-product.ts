
import { Component, ElementRef, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, ViewController, AlertController } from 'ionic-angular';
import { FormBuilder, Validators } from '@angular/forms';
import { Observable, Subscription, ReplaySubject } from 'rxjs';
import { SocketServiceProduct } from '../../providers/socket-config/socket-config';
import { Tipo } from '../../models/TipoProducto';
import { Productos } from '../../models/Productos';
import { Negocio } from '../../models/Negocio';
import { resizeBase64 } from 'base64js-es6';
import * as CryptoJS from 'crypto-js';
import { clave } from '../../app/cryptoclave';
/**
 * Generated class for the EditProductPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-edit-product',
  templateUrl: 'edit-product.html',
})
export class EditProductPage {
  @ViewChild('fileInput') fileInput: ElementRef;
  @ViewChild('fileInput2') fileInput2: ElementRef;
  producto: Productos=new Productos();
  productForm: any;
  nombreimagen: string = "selecciona una foto";
  listTypeProduct: Tipo[] = [];
  statusInput: boolean;
  typeProduct: Tipo;
  commerceOnly: Negocio;
  private suscribe: Subscription[] = [];
  listImages:string[]=[];
  cambio:boolean=false;
  constructor(public navCtrl: NavController, public navParams: NavParams,
    private formBuilder: FormBuilder,
    public productService: SocketServiceProduct,
    private toastCtrl: ToastController,
    public alertCtrl: AlertController,
    public viewCtrl: ViewController) {
      this.typeProduct=new Tipo();
    this.validInputFormProducts();
    this.connectionBackendSocket();
    this.getCommerceAndProduct();
  }

  ionViewDidLoad() {

  }

  async getCommerceAndProduct() {
    console.log("wcokwovmowe");
    this.producto = this.navParams.get("product");
    this.productService.emit("sacar-producto", {_id:this.producto._id});
    this.commerceOnly = this.navParams.get("commerce");
    let data = { tipo: this.commerceOnly.tipo.nombre }
    this.productService.emit("listar-tiposproductos-negocio", data);
    console.log(this.producto);
    
  }
  validInputFormProducts() {
    this.productForm = this.formBuilder.group({
      productNombre: ['', Validators.compose([Validators.maxLength(30),Validators.required])],
      productImg: ['', Validators.compose([])],
      productTipoVal: ['', Validators.compose([])],
      productTipo: ['', Validators.compose([Validators.required])],
      productEstado: ['', Validators.compose([Validators.required])],
      productPrecio: ['', Validators.compose([Validators.required])],
      productCantidad: ['', Validators.compose([Validators.maxLength(3), Validators.pattern('[0-9]*'), Validators.required])],
      productDescripcion: ['', Validators.compose([Validators.minLength(10), Validators.maxLength(80), Validators.required])]
    });
  }
  filechoosser() {
    this.fileInput.nativeElement.click();
  }
  connectionBackendSocket() {
    // tipos de producto
   this.suscribe.push(this.respuestaTipoProducto().subscribe((data: any) => {
     console.log(data);
      this.listTypeProduct = data;
    }));

   this.suscribe.push(this.respuestaSacarProducto().subscribe((data: Productos) => {
 
    this.listImages=data.fotos;
        }));

    // agregar tipos de producto
   this.suscribe.push(this.respuestaRegistrarTipoProducto().subscribe((data: any) => {
      this.alertMessage("Tipo producto '" + data.tipo + "', agregado.");
      this.listTypeProduct.push(data);
    }));

    // actualizar producto
   this.suscribe.push(this.respuestaActualizarProducto().subscribe((data: any) => {
      this.alertMessage("Producto '" + this.producto.nombre + "' , actualizado con exito");
      this.viewCtrl.dismiss();
    }));
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
  respuestaTipoProducto() {
    let observable = new Observable(observer => {
      this.productService.on('respuesta-listar-tiposproductos-negocio', (data) => {
        observer.next(data);
      });
    })
    return observable;
  }

  respuestaSacarProducto() {
    let observable = new Observable(observer => {
      this.productService.on('respuesta-sacar-producto', (data) => {

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
  onLongPress(index){
   this.listImages.splice(index,1);
   this.cambio=true;
  
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
  //Consumos de Servicios
  updateProduct() {
    // Modificar producto

    this.statusInput = true;
    if (!this.productForm.valid) {
      this.alertMessage("Imposible Actualizar verifique los campos de actualizacion.")
    }
    else {
      if(this.cambio){
        this.producto.fotos=this.listImages;
      }
      var date = new Date().toUTCString();
      this.producto.negocio = this.commerceOnly._id as any;
      this.producto.modificacion = { fecha: date };

      let data = this.producto;
      var ciphertext = CryptoJS.AES.encrypt(JSON.stringify({ producto: data }), clave.clave);
      this.productService.emit("actualizar-producto", ciphertext.toString());
    }
  }

  async getTypeProducts() {
    // Consulta tipos de producto
    let data = { tipo: this.commerceOnly.tipo.nombre }
    this.productService.emit("listar-tiposproductos-negocio", data);
  }

  addTypeProducts(typeNameProduct: string) {
    console.log(typeNameProduct);
    // Consulta tipos de producto
    this.typeProduct.tipo=typeNameProduct;
    this.typeProduct.negocio = this.commerceOnly.tipo.nombre;
    let data = this.typeProduct;
    this.productService.emit("registrar-tipo-producto", data);
  }

  filechoosser2() {
    this.fileInput2.nativeElement.click();
  }
  async fileChange2(event) {
    // alert(event.srcElement.files[0].name);
    this.readFile(event.srcElement.files[0]).subscribe(data => {
      resizeBase64(data, 700, 500).then((result) => {
        this.cambio=true;
        this.listImages.push(result);


      });
    });
  }

  async fileChange(event) {
    // alert(event.srcElement.files[0].name);
    this.readFile(event.srcElement.files[0]).subscribe(data => {
      resizeBase64(data, 90, 60).then((result) => {
        this.producto.foto = { miniatura: result, normal: "" }


      });
      resizeBase64(data, 90, 60).then((result) => {
        this.producto.foto.normal = result;
     

      });
      this.nombreimagen = event.srcElement.files[0].name;
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

}
