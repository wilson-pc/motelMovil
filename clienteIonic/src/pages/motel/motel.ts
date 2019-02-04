import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Habitacion } from '../../models/Habitacion';

/**
 * Generated class for the MotelPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-motel',
  templateUrl: 'motel.html',
})
export class MotelPage {
  searchQuery: string = '';
  items: string[];
  habitaciones:Habitacion;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.initializeItems();
  }

  ionViewDidLoad() {

   
    console.log('ionViewDidLoad MotelPage');
  }

  initializeItems() {
    this.items = [
      'Amsterdam',
      'Bogota',
      'otros',
      'Batman'
    ];  
  }

  getItems(ev: any) {
    // Reset items back to all of the items
    this.initializeItems();

    // set val to the value of the searchbar
    const val = ev.target.value;

    // if the value is an empty string don't filter the items
    if (val && val.trim() != '') {
      this.items = this.items.filter((item) => {
        return (item.toLowerCase().indexOf(val.toLowerCase()) > -1);
      })
    }
  }

  //FUNCIONES BASE DE DATOS
  getDatosProductos(){
    
  }
}
