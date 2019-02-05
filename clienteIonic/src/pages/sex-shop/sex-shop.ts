import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import { Productos } from '../../models/Productos';
import { Habitacion } from '../../models/Habitacion';
import { ProviderProductosProvider } from '../../providers/provider-productos/provider-productos';

/**
 * Generated class for the SexShopPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-sex-shop',
  templateUrl: 'sex-shop.html',
})
export class SexShopPage {

  infiniteScroll:any;
  parte:number=1;  

  searchQuery: string = '';
  items: string[];
  habitaciones:Habitacion;
  producto:Productos;
  listProductos:Productos[]=[];
  listauxProductos:Productos[]=[];
  loading:any;


  constructor(public loadingCtrl: LoadingController,public navCtrl: NavController, public navParams: NavParams, public provedorProductos:ProviderProductosProvider) {
    this.presentLoadingDefault();
    this.initializeItems();
    this.getDatosProductos(this.parte);    
    this.infiniteScroll="algo";
    this.response();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SexShopPage');
  }

  //FUNCIONES PARA EL LOADING
  presentLoadingDefault() {
    this.loading = this.loadingCtrl.create({
      content: 'Porfavor espere...'
    });
    this.loading.present();    
  }

//FUNCIONES PARA EL BUSCADOR
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

  //FUNCIONES PARA CARGAR DATOS DESDE EL SCROLL
  async loadData(event,parte:number) {
  
    this.infiniteScroll=event;
    this.parte=parte;
    console.log(parte);
    await this.getDatosProductos(parte);  
    
  }

  toggleInfiniteScroll() {
    this.infiniteScroll.disabled = !this.infiniteScroll.disabled;
  }

  //FUNCIONES BASE DE DATOS
   getDatosProductos(parte){
    let data="SexShop";
    console.log(parte);
    this.provedorProductos.obtenerdatosProductos(data,parte);  
      
  }

  response(){
  
    this.provedorProductos.respuestaProductosNegocio().subscribe((data:any[])=>{
      console.log(data);   

      data.forEach(element => {
      //  this.listProductos.push(element);
       this.listauxProductos.push(element);
      });
      this.loading.dismiss();     

      if(this.infiniteScroll!="algo"){
         this.infiniteScroll.complete();
      }
     
    }); 
      
  }

}
