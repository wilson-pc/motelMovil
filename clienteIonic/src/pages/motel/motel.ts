import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Habitacion } from '../../models/Habitacion';
import { ProviderProductosProvider } from '../../providers/provider-productos/provider-productos';
import { Productos } from '../../models/Productos';

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
  producto:Productos;
  listProductos:Productos[];
  listauxProductos:Productos[];

  constructor(public navCtrl: NavController, public navParams: NavParams,private provedorProductos: ProviderProductosProvider) {
    this.initializeItems();
    this.getDatosProductos();    
  }

  ionViewDidLoad() {

   
    console.log('ionViewDidLoad MotelPage');
  }

  async initializeItems() {
    this.listauxProductos = this.listProductos;
    console.log("lista aux" + this.listauxProductos);
  }

  getItems(ev: any) {
    // Reset items back to all of the items
    this.initializeItems();

    // set val to the value of the searchbar
    const val = ev.target.value;

    // if the value is an empty string don't filter the items
    if (val && val.trim() != '') {
      this.listauxProductos = this.listauxProductos.filter((item) => {
        return (item.nombre.toLowerCase().indexOf(val.toLowerCase()) > -1);
      })
    }
  }

  //FUNCIONES BASE DE DATOS
   getDatosProductos(){
    let data="Licoreria";
    
    this.provedorProductos.obtenerdatosProductos(data);
    this.provedorProductos.respuestaProductosNegocio().subscribe((data:any[])=>{
      console.log(data);
      this.listProductos=data;   
      this.listauxProductos=data;  
    })    

    
   
  }
}
