import { Component,OnDestroy } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { Productos } from '../../models/Productos';
import {SocketConfigService, conexionSocketComportamiento} from '../../services/socket-config.service';
import { Subscription } from 'rxjs/Subscription';
import { UsuarioProvider } from '../../providers/usuario/usuario';
import { Favoritos } from '../../models/Favoritos';
import * as CryptoJS from 'crypto-js';
import { clave } from '../../app/cryptoclave';

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
export class DescriptionLicoreriaPage implements OnDestroy{
  productoRecibido:Productos;
  imagenProducto:any;
  cantidadReserva = 1;
  clientesSubscription: Subscription;
  favorito:Favoritos;

  constructor(public navCtrl: NavController, 
    public navParams: NavParams,
    public viewCtrl: ViewController,
    private productoServ: SocketConfigService,
    private provedorFavoritos:conexionSocketComportamiento,
    private usuarioLogin:UsuarioProvider) {

      this.favorito=new Favoritos();
      this.clientesSubscription=this.eventoSacarDatos().subscribe(data=>{
        this.imagenProducto=data.foto.normal;
        console.log("entrando",this.imagenProducto);
      })
      this.obtenerDatosProducto();
  }
  ngOnDestroy() {
    console.log("saliendo");
    this.clientesSubscription.unsubscribe();
  }
  obtenerDatosProducto(){
    this.productoRecibido=this.navParams.get("producto")
    console.log("esto es el producto",this.productoRecibido);
    this.sacarDatos();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad DescriptionLicoreriaPage');
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

  sacarDatos(){
    this.productoServ.emit("sacar-producto",{id:this.productoRecibido._id})
  }
  eventoSacarDatos(){
    console.log("entrando1");
    return this.productoServ.fromEvent<any> ('respuesta-sacar-producto').map(data=>data)
  }

  guardarFavorito(){
   
   let data={idproducto:this.productoRecibido._id, idsuario:this.usuarioLogin.UserSeCion.datos._id};
   
    console.log("datos favoritos:",data);
    this.provedorFavoritos.emit('agregar-favorito',this.encryptData(data));

  }
}
