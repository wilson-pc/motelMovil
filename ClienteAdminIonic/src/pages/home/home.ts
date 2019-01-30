import { Component } from "@angular/core";
import { NavController, NavParams } from "ionic-angular";
import { Negocio } from "../../models/Negocio";
import { Usuarios } from "../../models/Usuarios";
import { UserOnlyProvider } from "../../providers/user-only/user-only";


@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})

export class HomePage {

  listCommerce: Negocio[] = [];
  userOnly: Usuarios;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public userOnlyProvider: UserOnlyProvider) {

    this.getUserOnly()
  }

  ionViewWillEnter() {

  }

  getUserOnly() {
    console.log("usuario ingreso ++");
    console.log(this.userOnlyProvider.userSesion);
  }

  //Consumos de Servicios
  getAllCommerce() {

  }
}

//
