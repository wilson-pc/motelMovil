import { Component } from "@angular/core";
import { NavController, NavParams } from "ionic-angular";
import { Negocio } from "../../models/Negocio";


@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})

export class HomePage {

  listCommerce: Negocio[] = [];

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams) {
        
  }

  ionViewWillEnter() {

  }

  //Consumos de Servicios
  getAllCommerce() {

  }
}

//
