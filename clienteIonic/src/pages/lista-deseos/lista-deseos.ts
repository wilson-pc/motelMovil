import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, ToastController, ViewController } from 'ionic-angular';
import { conexionSocketComportamiento } from '../../services/socket-config.service';
import { UsuarioProvider } from '../../providers/usuario/usuario';
import { Habitacion } from '../../models/Habitacion';
import { DescriptionLicoreriaPage } from '../description-licoreria/description-licoreria';

/**
 * Generated class for the ListaDeseosLicoresPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-lista-deseos',
  templateUrl: 'lista-deseos.html',
})
export class ListaDeseosPage {

  Deseos: Habitacion[] = [];

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private usuarioLogueado: UsuarioProvider,
    public provedorSocketFavoritos: conexionSocketComportamiento,
    public modalCtrl: ModalController,
    public viewCtrl: ViewController,
    public toastCtrl: ToastController) {
    this.connectSocket();

  }

  ionViewDidLoad() {
    this.obtenerListadeFavoritosMoteles();
    console.log('ionViewDidLoad ListaFavoritosLicoreriasPage');
  }

  quitar(item){
    console.log(item);
    let usuario = { idsuario: this.usuarioLogueado.UserSeCion.datos._id,idproducto:item._id };
    this.provedorSocketFavoritos.emit('quitar-deseos', usuario);
  }

  presentModal(item) {
    console.log(item);
    const modal = this.modalCtrl.create(DescriptionLicoreriaPage, { producto: item });
    modal.present();
  }

  presentToast(reserveMessage: string) {
    const toast = this.toastCtrl.create({
      message: reserveMessage,
      duration: 2000,
      position: 'buttom'
    });
    toast.present();
  }

  obtenerListadeFavoritosMoteles() {
    //console.log("este es el usuario:",usuario);
    if (this.usuarioLogueado.UserSeCion.datos) {
      console.log("nfr3ni");

      let usuario = { idusuario: this.usuarioLogueado.UserSeCion.datos._id };
      this.provedorSocketFavoritos.emit('listar-deseos-moteles', usuario);
      //await this.respuestaListaFavoritos();
    }
    else {
      this.presentToast("Debes iniciar sesion primero!");
    }

  }

  connectSocket() {
    this.respuestaListarDeseos().subscribe(data => {
      console.log(data);
      if (!data.error) {
        data.datos.forEach(element => {
          this.Deseos.push(element.producto)
        });
      } else {
        this.presentToast(data.error)
      }
    })
    this.respuestaQuitar().subscribe(data=>{
      if (!data.error) {
      for (let index = 0; index < this.Deseos.length; index++) {
        const element = this.Deseos[index];
        if(element._id==data.datos){
          this.Deseos.splice(index,1);
        }
        
      }
      } else {
        this.presentToast(data.error)
      }
    })
  }
  respuestaListarDeseos() {
    return this.provedorSocketFavoritos.fromEvent<any>('respuesta-listar-deseos-moteles').map(data => data)

  }
  respuestaQuitar() {
    return this.provedorSocketFavoritos.fromEvent<any>('respuesta-quitar-deseos').map(data => data)

  }



}
