import { Component, OnDestroy } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, ToastController, AlertController, ModalController } from 'ionic-angular';
import { Productos } from '../../models/Productos';
import { Favoritos } from '../../models/Favoritos';
import * as CryptoJS from 'crypto-js';
import { clave } from '../../app/cryptoclave';
import { Subscription } from 'rxjs';
import { SocketReservaService, conexionSocketComportamiento, SocketConfigService } from '../../services/socket-config.service';
import { UsuarioProvider } from '../../providers/usuario/usuario';
import { DetallesTiendaPage } from '../detalles-tienda/detalles-tienda';

/**
 * Generated class for the DescriptionLicoreriaPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-description-licoreria',
  templateUrl: 'description-licoreria.html',
})
export class DescriptionLicoreriaPage implements OnDestroy {
  productoRecibido: Productos;
  imagenProducto: any;
  cantidadReserva = 1;
  clientesSubscription: Subscription;
  suscripctionSocket: Subscription;
  favorito: Favoritos;
  cantidad:number[]=[];
  motivo: string;
  slideData: any = [];

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public modalCtrl: ModalController,
    public viewCtrl: ViewController,
    public toastCtrl: ToastController,
    public alertCtrl: AlertController,
    private reservaProduct: SocketReservaService,
    private userService: UsuarioProvider,
    private productoServ: SocketConfigService,
    private provedorFavoritos: conexionSocketComportamiento,
    private usuarioLogin: UsuarioProvider) {
    //Incializacion del constrictor
    this.favorito = new Favoritos();
    this.clientesSubscription = this.eventoSacarDatos().subscribe(data => {
      this.imagenProducto = data.foto.normal;
    })
    this.obtenerDatosProducto();
    this.connectionBackendSocket();
  }

  ngOnDestroy() {
    this.clientesSubscription.unsubscribe();
    this.suscripctionSocket.unsubscribe();
  }

  obtenerDatosProducto() {
    this.productoRecibido = this.navParams.get("producto")
    console.log("producto",this.productoRecibido);
    this.sacarDatos();
  }

  productDescription(product: Productos) {
    const modal = this.modalCtrl.create(DetallesTiendaPage, { producto: product });
    modal.present();
  }

  ionViewDidLoad() {
 for (let index = 1; index < 20; index++) {
   this.cantidad.push(index);
   
 }
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
  reserveProduct() {
    let reserva = {
      idcliente: this.userService.UserSeCion.datos._id,
      cantidad: this.cantidadReserva,
      idproducto: this.productoRecibido._id
    }

    this.reservaProduct.emit("reserva-producto", reserva)
  }

  reportProduct() {
    if(this.userService.UserSeCion.datos){
      let denuncia = {
        idusuario: this.userService.UserSeCion.datos._id,
     //   idproducto: this.product._id,
        detalle: this.motivo
      }
      this.provedorFavoritos.emit('denuncia-producto', denuncia);
    }
    else{
      this.presentToast("Debes iniciar sesion primero!");
    }

  }

  likeProduct(idProducto){
    console.log("Producto: ", idProducto);
    var datos = { idcliente: this.userService.UserSeCion.datos._id, idproducto: idProducto };
    var datosCrypt = this.encryptData(datos);
    this.provedorFavoritos.emit('calificar-producto', datosCrypt);
  }

  dislikeProduct(idProducto){
    console.log("Producto: ", idProducto);
    var datos = { idcliente: this.userService.UserSeCion.datos._id, idproducto: idProducto };
    var datosCrypt = this.encryptData(datos);
    this.provedorFavoritos.emit('descalificar-producto', datosCrypt);
  }

  // Respuestas Socket
  connectionBackendSocket() {
    this.clientesSubscription = this.eventoSacarDatos().subscribe(data => {
      this.imagenProducto = data.foto.normal;
      this.slideData = data.fotos;
      console.log("Imagenes: ", this.slideData);
    })

    this.suscripctionSocket = this.respuestaReserva().subscribe((data: any) => {
      if (data.error) {
        this.presentToast(data.error);
      } else {
        this.presentToast("Producto Reservado");
        this.dismiss();
      }
    });

    this.suscripctionSocket = this.respuestaDenuncia().subscribe((data: any) => {
      if (data.error) {
        this.presentToast(data.error);
      } else {
        this.presentToast("Producto Denunciado");
        this.dismiss();
      }
    });

    this.suscripctionSocket = this.respuestaCalificarProducto().subscribe((data: any) => {
      console.log("Calificado ");
    });

    this.suscripctionSocket = this.respuestaDescalificarProducto().subscribe((data: any) => {
      console.log("Descalificado ");
    });
  }

  encryptData(data) {
    try {
      return CryptoJS.AES.encrypt(JSON.stringify(data), clave.clave).toString();
    } catch (e) {
      console.log(e);
    }
  }

  sacarDatos() {
    this.productoServ.emit("sacar-producto", this.productoRecibido)
  }

  eventoSacarDatos() {
    return this.productoServ.fromEvent<any>('respuesta-sacar-producto').map(data => data)
  }

  respuestaReserva() {
    return this.reservaProduct.fromEvent<any>('respuesta-reserva-producto').map(data => data)
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

  guardarFavorito() {

    let data = { 
      idproducto: this.productoRecibido._id,
      idsuario: this.usuarioLogin.UserSeCion.datos._id,
      tipoproducto:this.productoRecibido.tipo.tiponegocio };

    console.log("datos favoritos:", data);
    this.provedorFavoritos.emit('agregar-favorito', this.encryptData(data));

  }

  // Funciones de push visitas
  registrarVisita(){
    let data = { idcliente: this.usuarioLogin.UserSeCion.datos._id , idnegocio: this.productoRecibido.negocio };
    console.log("Cliente",data);
    this.provedorFavoritos.emit('visitar-negocio', data);
  }
}
