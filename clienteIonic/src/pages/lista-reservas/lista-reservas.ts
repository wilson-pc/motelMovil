import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';


@IonicPage()
@Component({
  selector: 'page-lista-reservas',
  templateUrl: 'lista-reservas.html',
})
export class ListaReservasPage {

  tipo: string = "Reserva";

  constructor(public navCtrl: NavController, 
              public navParams: NavParams) {
    // Inicializacion

  }

  ionViewDidLoad() {
    console.log('');
  }

  buscar(event){
    console.log("Buscando productos");
  }

}
