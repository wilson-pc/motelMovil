import { Component } from "@angular/core";
import { NavController, NavParams } from "ionic-angular";
import { Negocio } from "../../models/Negocio";
import { UserOnlyProvider } from "../../providers/user-only/user-only";
import { SocketServiceCommerce } from "../../providers/socket-config/socket-config";
import { Observable } from "rxjs";
import * as CryptoJS from 'crypto-js';
import { clave } from "../../app/cryptoclave";


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
    public productService: SocketServiceCommerce) {
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
    // Consulta cantidad de negocios
    let data = { id: this.userOnlyProvider.userSesion.datos._id, tipo: "negocios" }
		var ciphertext = CryptoJS.AES.encrypt(JSON.stringify(data), clave.clave);
		this.productService.emit("listar-negocios-de-usuario", ciphertext.toString());
  }

  // Conexion con el Backend
  connectionBackendSocket() {
    this.respuestaVerificarNegocio().subscribe((data: any) => {
      this.listCommerce = data;
			console.log("Negocios: ", this.listCommerce);
		});
  }

  respuestaVerificarNegocio() {
		let observable = new Observable(observer => {
			this.productService.on('respuesta-listar-negocio-de-usuario', (data) => {
				observer.next(data);
			});
		})
		return observable;
	}
}