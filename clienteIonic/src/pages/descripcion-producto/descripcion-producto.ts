import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform, ViewController, ToastController, AlertController, ModalController } from 'ionic-angular';
import { Productos } from '../../models/Productos';
import { Observable, Subscription } from 'rxjs';
import { SocketReservaService, conexionSocketComportamiento, SocketConfigService } from '../../services/socket-config.service';
import { UsuarioProvider } from '../../providers/usuario/usuario';
import * as CryptoJS from 'crypto-js';
import { clave } from '../../app/cryptoclave';
import { DetallesTiendaPage } from '../detalles-tienda/detalles-tienda';

@IonicPage()
@Component({
  selector: 'page-descripcion-producto',
  templateUrl: 'descripcion-producto.html',
})
export class DescripcionProductoPage {

  cantidadReserva = 1;
  product: any;
  productID: Productos;
  suscripctionSocket: Subscription[]=[];
  cantidad:number[]=[];
  slideData: any = [];
  motivo: string;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public platform: Platform,
    public modalCtrl: ModalController,
    public viewCtrl: ViewController,
    public toastCtrl: ToastController,
    public alertCtrl: AlertController,
    public productService: SocketReservaService,
    public productoService: SocketConfigService,
    private provedorFavoritos: conexionSocketComportamiento,
    public userService: UsuarioProvider,
    private usuarioLogin: UsuarioProvider) {
    //Inicializacion del constructor
    this.getProduct();
    this.connectionBackendSocket();
  }

  ionViewDidLoad() {
    for (let index = 1; index < 20; index++) {
      this.cantidad.push(index);
      
    }
  }

  productDescription(product: Productos) {
    const modal = this.modalCtrl.create(DetallesTiendaPage, { producto: product });
    modal.present();
  }

  dismissModal() {
    this.viewCtrl.dismiss();
  }

  presentToast(reserveMessage: string) {
    const toast = this.toastCtrl.create({
      message: reserveMessage,
      duration: 2000,
      position: 'buttom'
    });
    toast.present();
  }

  //Confirmacion de Denuncia
  showPrompt() {
    const prompt = this.alertCtrl.create({
      title: '¿Denunciar producto?',
      message: "Escribe el motivo de la denuncia: ",
      inputs: [
        {
          name: 'motivo',
          placeholder: 'Motivo'
        },
      ],
      buttons: [
        {
          text: 'Cancelar',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Enviar',
          handler: data => {
            console.log('Saved clicked');
            console.log(data.motivo);
            this.motivo = data.motivo;
            this.reportProduct()
          }
        }
      ]
    });
    prompt.present();
  }

  //Consumo Socket 
   getProduct() {
    this.productID = this.navParams.get("producto");
    console.log("Producto saliente: ", this.productID);
    this.product = this.navParams.get("producto");
    this.productoService.emit("sacar-producto", {_id:this.productID._id});
    if(this.userService.UserSeCion.datos != undefined){
      this.registrarVisita();
    }
  }

  masTarde(id){
    if(this.userService.UserSeCion.datos){
    this.provedorFavoritos.emit("agregar-deseos", {idproducto:id,tipoproducto:"Motel",idsuario:this.userService.UserSeCion.datos._id})
    }else{
      this.presentToast("Debes iniciar sesion primero!");
    }
  }
  reserveProduct() {
    if(this.userService.UserSeCion.datos){
      let reserva = {
        idcliente: this.userService.UserSeCion.datos._id,
        cantidad: this.cantidadReserva,
        idproducto: this.product._id
      }
      
      this.productService.emit("reserva-producto", reserva)
    }
    else{
      this.presentToast("Debes iniciar sesion primero!");
    }
  }

  reportProduct() {
    if(this.userService.UserSeCion.datos){
      let denuncia = {
        idusuario: this.userService.UserSeCion.datos._id,
        idproducto: this.productID._id,
        detalle: this.motivo
      }
      this.provedorFavoritos.emit('denuncia-producto', denuncia);
    }
    else{
      this.presentToast("Debes iniciar sesion primero!");
    }

  }

  likeProduct(idProducto){
    if(this.userService.UserSeCion.datos){
      console.log("Producto: ", idProducto);
      var datos = { idcliente: this.userService.UserSeCion.datos._id, idproducto: idProducto };
      var datosCrypt = this.encryptData(datos);
      this.provedorFavoritos.emit('calificar-producto', datosCrypt);
    }
    else{
      this.presentToast("Debes iniciar sesion primero!");
    }
  }

  dislikeProduct(idProducto){
    if(this.userService.UserSeCion.datos){
      console.log("Producto: ", idProducto);
      var datos = { idcliente: this.userService.UserSeCion.datos._id, idproducto: idProducto };
      var datosCrypt = this.encryptData(datos);
      this.provedorFavoritos.emit('descalificar-producto', datosCrypt);
    }
    else{
      this.presentToast("Debes iniciar sesion primero!");
    }
  }

  // Respuestas Socket
  connectionBackendSocket() {

    this.suscripctionSocket.push(this.respuestaSacarProducto().subscribe((data: any) => {
      console.log("Producto", data);
      this.product = data;
      this.slideData = data.fotos;
    }))

    this.suscripctionSocket.push(this.respuestaReserva().subscribe((data: any) => {
      if(data.error){
        this.presentToast(data.error);
      }else{
        this.presentToast("Producto Reservado");
        this.dismissModal();
      }
    }))

    this.suscripctionSocket.push(this.respuestaDenuncia().subscribe((data: any) => {
      if (data.error) {
        this.presentToast(data.error);
      } else {
        this.presentToast("Producto Denunciado");
        this.dismissModal();
      }
    }))

    this.suscripctionSocket.push(this.respuestaCalificarProducto().subscribe((data: any) => {
      console.log("Calificado ");
    }))

    this.suscripctionSocket.push(this.respuestaDescalificarProducto().subscribe((data: any) => {
      console.log("Descalificado ");
    }))

    this.suscripctionSocket.push(this.respuestaDeseo().subscribe((data:any)=>{
      if(!data.error){
        this.presentToast(data.exito);
      }else{
        this.presentToast(data.error);
      }
    }))
  }

  encryptData(data) {
    try {
      return CryptoJS.AES.encrypt(JSON.stringify(data), clave.clave).toString();
    } catch (e) {
      console.log(e);
    }
  }

  respuestaSacarProducto() {
    return this.productoService.fromEvent<any> ('respuesta-sacar-producto').map(data=>data)
  }

  respuestaReserva() {
    return this.productService.fromEvent<any> ('respuesta-reserva-producto').map(data=>data)
  }

  respuestaDenuncia() {
    return this.provedorFavoritos.fromEvent<any>('respuesta-denuncia-negocio').map(data => data)
  }

  respuestaCalificarProducto(){
    return this.provedorFavoritos.fromEvent<any>('respuesta-calificar-producto').map(data => data)
  }

  respuestaDescalificarProducto(){
    return this.provedorFavoritos.fromEvent<any>('respuesta-descalificar-producto').map(data => data)
  }
  respuestaDeseo(){
    return this.provedorFavoritos.fromEvent<any>('respuesta-agregar-deseos').map(data => data)
  }


  irdetallestienda(){
    this.navCtrl.push(DetallesTiendaPage);
  }

  ngOnDestroy() {
    this.suscripctionSocket.forEach(element => {
      element.unsubscribe();
    });
  }
  registrarVisita(){
    let data = { idcliente: this.usuarioLogin.UserSeCion.datos._id , idnegocio: this.productID.negocio };
    console.log("Cliente",data);
    this.provedorFavoritos.emit('visitar-negocio', data);
  }
}
