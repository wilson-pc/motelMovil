import { Component,ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, InfiniteScroll, LoadingController } from 'ionic-angular';
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

  infiniteScroll:any;
  parte:number=1;  

  searchQuery: string = '';
  items: string[];
  habitaciones:Habitacion;
  producto:Productos;
  listProductos:Productos[]=[];
  listauxProductos:Productos[]=[];
  loading:any;

  constructor(public loadingCtrl: LoadingController,public navCtrl: NavController, public navParams: NavParams,private provedorProductos: ProviderProductosProvider) {
  
    this.initializeItems();
    this.getDatosProductos(this.parte);    
    this.infiniteScroll="algo";
    //this.response();
  }

  ionViewDidLoad() {

   
    console.log('ionViewDidLoad MotelPage');
  }

  //FUNCION PARA LOADING
    

  toggleInfiniteScroll() {
    this.infiniteScroll.disabled = !this.infiniteScroll.disabled;
  }

  async initializeItems() {
    this.listauxProductos=this.listProductos;
    
    // console.log("lista aux" + this.listauxProductos);
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
   getDatosProductos(parte){
    let data="Motel";
    console.log(parte);
   // this.provedorProductos.obtenerdatosProductosLicoreria(data,parte);  
      
  }

  // response(){
  
  //   this.provedorProductos.respuestaProductosNegocio().subscribe((data:any[])=>{
  //     console.log(data);   

  //     data.forEach(element => {
  //     //  this.listProductos.push(element);
  //      this.listauxProductos.push(element);
  //     });
     

  //     if(this.infiniteScroll!="algo"){
  //        this.infiniteScroll.complete();
  //     }
     
  //   }); 
      
  // }
}
