import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, ToastController, ViewController, Loading, LoadingController } from 'ionic-angular';
import { DescripcionProductoPage } from '../descripcion-producto/descripcion-producto';
import { DetallesTiendaPage } from '../detalles-tienda/detalles-tienda';
import { SocketConfigService, conexionSocketComportamiento } from '../../services/socket-config.service';
import { Subscription } from 'rxjs';
import { Productos } from '../../models/Productos';
import * as CryptoJS from 'crypto-js';
import { clave } from '../../app/cryptoclave';
import { UsuarioProvider } from '../../providers/usuario/usuario';

@IonicPage()
@Component({
  selector: 'page-tops',
  templateUrl: 'tops.html',
})
export class TopsPage {

  Negocios = "Moteles";
  listProductTop: any[] = [];
  suscripctionSocket: Subscription[]=[];
  calificarProducto: any = [];
  loading:Loading;
  constructor(
    public loadingCtrl: LoadingController,
    public navCtrl: NavController,
    public navParams: NavParams,
    public modalCtrl: ModalController,
    private userServ:UsuarioProvider,
    public toastCtrl: ToastController,
    public viewCtrl: ViewController,
    public productService: SocketConfigService,
    public comportamientoService: conexionSocketComportamiento) {
    //Inicializacion del constructor
    this.connectionBackendSocket();
    this.presentLoadingDefault();
    this.getProductTop();
  }

  productDescription(product: Productos) {
    const modal = this.modalCtrl.create(DescripcionProductoPage, { producto: product });
    modal.present();
  }

  ionViewDidLoad() {

  }
    //FUNCION PARA LOADING
    presentLoadingDefault() {
      console.log("contar loading");
      this.loading = this.loadingCtrl.create({
        content: 'Porfavor espere...',
         
      });
      this.loading.present(); 
     
    }
  

  presentToast(reserveMessage: string) {
    const toast = this.toastCtrl.create({
      message: reserveMessage,
      duration: 2000,
      position: 'buttom'
    });
    toast.present();
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

  encryptData(data) {
    try {
      return CryptoJS.AES.encrypt(JSON.stringify(data), clave.clave).toString();
    } catch (e) {
      console.log(e);
    }
  }

  //Consumo Socket 
  getProductTop() {
    let tipo = {};

    if (this.Negocios == "Moteles") {
      console.log("negocios motelesshhhhh hj");
      tipo = { tipo: "Motel" };
      this.productService.emit("top-productos", tipo);
    }
    if (this.Negocios == "Licorerias") {
      tipo = { tipo: "Licoreria" };
      this.productService.emit("top-productos", tipo);
    }
    if (this.Negocios == "Sexshops") {
      tipo = { tipo: "SexShop" };
      this.productService.emit("top-productos", tipo);
    }
  }

  likeProduct(idProducto){
    if(this.userServ.UserSeCion.datos){
      console.log("Producto: ", idProducto);
      var datos = { idcliente: this.userServ.UserSeCion.datos._id, idproducto: idProducto };
      var datosCrypt = this.encryptData(datos);
      this.comportamientoService.emit('calificar-producto', datosCrypt);
    }
    else{
      this.presentToast("Debes iniciar sesion primero!");
    }
  }

  dislikeProduct(idProducto){
    if(this.userServ.UserSeCion.datos){
      console.log("Producto: ", idProducto);
      var datos = { idcliente: this.userServ.UserSeCion.datos._id, idproducto: idProducto };
      var datosCrypt = this.encryptData(datos);
      this.comportamientoService.emit('descalificar-producto', datosCrypt);
    }
    else{
      this.presentToast("Debes iniciar sesion primero!");
    }
  }

  // Respuestas Socket
  connectionBackendSocket() {
    this.suscripctionSocket.push(this.respuestaProductTop().subscribe((data: any) => {
      console.log(data);
      if(data.error){
         alert("ocurrio un error inesperado");
      }else{
        this.listProductTop = data;
        this.loading.dismiss();   
      }
  
    }));

    this.suscripctionSocket.push(this.respuestaCalificarProducto().subscribe((data: any) => {
     
      if(!data.error){
           var producto= this.listProductTop.filter(producto=>producto._id==data.datos)[0]
       
           producto.likes = producto.likes+1;
      }else{
        this.presentToast(data.error);
      }
    }));

    this.suscripctionSocket.push(this.respuestaDescalificarProducto().subscribe((data: any) => {
     
      if(!data.error){
           var producto= this.listProductTop.filter(producto=>producto._id==data.datos)[0]
          
           producto.dislike = producto.dislike+1;
      }else{
         this.presentToast(data.error);
      }
    }));
  }

  respuestaProductTop() {
    return this.productService.fromEvent<any>('respuesta-top-productos').map(data => data)
  }

  respuestaCalificarProducto(){
    return this.comportamientoService.fromEvent<any>('respuesta-calificar-producto').map(data => data)
  }

  respuestaDescalificarProducto(){
    return this.comportamientoService.fromEvent<any>('respuesta-descalificar-producto').map(data => data)
  }

  ngOnDestroy() {
    this.suscripctionSocket.forEach(element => {
      element.unsubscribe();
    });
  
  }
}
