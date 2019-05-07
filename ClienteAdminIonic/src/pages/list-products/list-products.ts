import { Component, ViewChild, ElementRef } from '@angular/core';
import { NavController, NavParams, ModalController, AlertController, ToastController } from 'ionic-angular';
import { CommerceProvider } from '../../providers/commerce/commerce';
import { UserOnlyProvider } from '../../providers/user-only/user-only';
import { SocketServiceCommerce, SocketServiceProduct } from '../../providers/socket-config/socket-config';
import * as CryptoJS from 'crypto-js';
import * as XLSX from 'xlsx';
import { clave } from "../../app/cryptoclave";
import { Negocio } from '../../models/Negocio';
import { Observable } from 'rxjs';
import { Productos } from '../../models/Productos';
import { RegisterProductsPage } from '../register-products/register-products';
import { EditProductsPage } from '../edit-products/edit-products';
import { ViewProductsPage } from '../view-products/view-products';
import {imageDefault} from '../../app/imageDefualt'
import { Subscription } from 'rxjs/Subscription';
import { EditProductPage } from '../edit-product/edit-product';

type AOA = any[][];

@Component({
  selector: 'page-list-products',
  templateUrl: 'list-products.html',
})
export class ListProductsPage {
  @ViewChild('fileInput') fileInput: ElementRef;
  data: any[][] = [[1,2,3],[4,5,6]];
  private suscribe: Subscription = new Subscription();
  // variables de acceso interno y externo
  space: string = "   ";
  listCommerce: Negocio[] = [];
  listProducts: Productos[] = [];
  commerceName: string;
  cambio:boolean=false;
exceltojson:any[]=[];
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
    private toastCtrl: ToastController,
    private nav:NavController) {
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
    this.cambio=true;
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
    const modal = this.modalCtrl.create(ViewProductsPage, {product: product, commerce: this.commerceOnly });
    modal.present();
  }

  updateProduct(producto:Productos) {
      console.log(producto);
     // this.nav.push(EditProductPage, { product: producto, commerce: this.commerceOnly });
    const modal = this.modalCtrl.create(EditProductsPage, { product: producto, commerce: this.commerceOnly });
   modal.present();
    //this.getProductsCommerce();
  }

  saveExel(json){
    console.log(json);
    var ciphertext = CryptoJS.AES.encrypt(JSON.stringify(json), clave.clave);
   this.productService.emit("importar-productos", ciphertext.toString());
  }
  filechoosser() {
    
    this.fileInput.nativeElement.click();

  }
  read(bstr: string) {

    this.exceltojson=[];
    /* read workbook */
    const wb: XLSX.WorkBook = XLSX.read(bstr, {type: 'binary'});

    /* grab first sheet */
    const wsname: string = wb.SheetNames[0];
    const ws: XLSX.WorkSheet = wb.Sheets[wsname];

    /* save data */
    this.data = <AOA>(XLSX.utils.sheet_to_json(ws, {header: 1}));

    let header=this.data[0];
    let fecha=new Date().toUTCString();
    for (let index = 1; index < this.data.length; index++) {
      const element = this.data[index];
     this.exceltojson.push({"nombre":element[0],"precio":element[1],"precioreserva":element[2],
                            "tipo":{tipo:element[3],negocio:this.commerceOnly.tipo.nombre,idnegocio:this.commerceOnly._id},"descripcion":element[4],"negocio":this.commerceOnly._id,"foto":{"normal":imageDefault.image,"miniatura":imageDefault.Miniatura},
                             "creacion":{fecha:fecha},"modificacion":{fecha:fecha},eliminado:{estado:false,razon:""}});
      
    }
   
   this.saveExel(this.exceltojson);
  };

  onFileChange(evt: any) {
    console.log("llega al onchange");
    /* wire up file reader */
    const target: DataTransfer = <DataTransfer>(evt.target);
    if (target.files.length !== 1) throw new Error('Cannot use multiple files');
    const reader: FileReader = new FileReader();
    reader.onload = (e: any) => {
      const bstr: string = e.target.result;
      this.read(bstr);
    };
    reader.readAsBinaryString(target.files[0]);
  };
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
  this.suscribe=  this.respuestaProductosNegocio().subscribe((data: any) => {
      console.log(data);
      this.listProducts = data;
    });
    this.respuestaimportarproductos().subscribe((data:any)=>{
      if(data.error){
        let toast = this.toastCtrl.create({
          message: "ocurrio un error durante la importacion",
          duration: 3000,
          position: 'top'
        });
    
        toast.onDidDismiss(() => {
        });
    
        toast.present();
      }else{
        let toast = this.toastCtrl.create({
          message: "importacion completa",
          duration: 3000,
          position: 'top'
        });
    
        toast.onDidDismiss(() => {
        });
    
        toast.present();
        let data = { termino: this.commerceOnly._id }
        this.productService.emit("listar-producto-negocio", data);
      }
    })

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
  respuestaimportarproductos() {
    let observable = new Observable(observer => {
      this.productService.on('respuesta-importar-productos', (data) => {
        observer.next(data);
      });
    })
    return observable;
  }
  ionViewWillLeave() {
    this.suscribe.unsubscribe();
    }
}
