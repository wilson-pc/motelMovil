import { Component } from "@angular/core";
import { NavController, NavParams, ModalController } from "ionic-angular";
import { Negocio } from "../../models/Negocio";
import { UserOnlyProvider } from "../../providers/user-only/user-only";
import { SocketServiceCommerce } from "../../providers/socket-config/socket-config";
import { Observable } from "rxjs";
import * as CryptoJS from 'crypto-js';
import { clave } from "../../app/cryptoclave";
import { ModalViewStatisticsPage } from "../modal-view-statistics/modal-view-statistics";


@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})

export class HomePage {

  listCommerce: Negocio[] = [];

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
		this.commerceService.emit("listar-negocios-de-usuario", ciphertext.toString());
  }



  // Conexion con el Backend
  connectionBackendSocket() {
    this.respuestaVerificarNegocio().subscribe((data: any) => {
      this.listCommerce = data;
    });
    
  }

  respuestaVerificarNegocio() {
		let observable = new Observable(observer => {
			this.commerceService.on('respuesta-listar-negocio-de-usuario', (data) => {
				observer.next(data);
			});
		})
		return observable;
  }
  
  // Modal de estadisticas
  modalEstadisticas(negocio : Negocio) {
    const modal = this.navCtrl.push(ModalViewStatisticsPage, {id_negocio: negocio});
  }
}