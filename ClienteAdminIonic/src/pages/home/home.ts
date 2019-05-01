import { Component } from "@angular/core";
import { NavController, NavParams, ModalController } from "ionic-angular";
import { Negocio } from "../../models/Negocio";
import { UserOnlyProvider } from "../../providers/user-only/user-only";
import { SocketServiceCommerce } from "../../providers/socket-config/socket-config";
import { Observable, Subscription } from "rxjs";
import * as CryptoJS from 'crypto-js';
import { clave } from "../../app/cryptoclave";
import { ModalViewStatisticsPage } from "../modal-view-statistics/modal-view-statistics";


@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})

export class HomePage {

  listCommerce: Negocio[] = [];
  private suscribe: Subscription = new Subscription();
  
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public userOnlyProvider: UserOnlyProvider,
    public commerceService: SocketServiceCommerce,
    public modalController : ModalController) {
      //Inicializacion
    this.connectionBackendSocket();
    this.getAllCommerce();
  }

  ionViewWillEnter() {

  }

  doRefresh(event) {
    console.log('Comenzar la operación asíncrona');
    //this.getAllCommerce();
    setTimeout(() => {
      console.log('La operación asíncrona ha finalizado');
      this.getAllCommerce();
      event.complete();
    }, 2000);
  }

  //Consumos de Servicios
  getAllCommerce() {
    // Consulta todos los negocios de un usuario
    let data = { id: this.userOnlyProvider.userSesion.datos._id, tipo: "negocios" }
		var ciphertext = CryptoJS.AES.encrypt(JSON.stringify(data), clave.clave);
		this.commerceService.emit("listar-negocio-de-usuario-completo", ciphertext.toString());
  }



  // Conexion con el Backend
  connectionBackendSocket() {
 this.suscribe= this.respuestaVerificarNegocio().subscribe((data: any) => {
      console.log(data);
      this.listCommerce = data;
    });
    
  }

  respuestaVerificarNegocio() {
		let observable = new Observable(observer => {
			this.commerceService.on('listar-negocio-de-usuario-completo', (data) => {
				observer.next(data);
			});
		})
		return observable;
  }
  
  // Modal de estadisticas
  modalEstadisticas(negocio : Negocio) {
    const modal = this.navCtrl.push(ModalViewStatisticsPage, {id_negocio: negocio});
  }

  ionViewWillLeave() {
    this.suscribe.unsubscribe();
    }
}