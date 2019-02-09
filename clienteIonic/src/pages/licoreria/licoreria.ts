import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, Loading } from 'ionic-angular';
import { ProviderProductosProvider } from '../../providers/provider-productos/provider-productos';
import { Productos } from '../../models/Productos';
import { Habitacion } from '../../models/Habitacion';

/**
 * Generated class for the LicoreriaPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-licoreria',
  templateUrl: 'licoreria.html',
})
export class LicoreriaPage {
  infiniteScroll:any;
  parte:number=1;  

  searchQuery: string = '';
  items: string[];
  habitaciones:Habitacion;
  producto:Productos;
  listProductos:Productos[]=[];
  listauxProductos:Productos[]=[];
  loading:Loading;
  aux:number=0;
  cont=0;
  constructor(public loadingCtrl: LoadingController,public navCtrl: NavController, public navParams: NavParams,private provedorProductos:ProviderProductosProvider) {
   this.listauxProductos=[];
   // this.initializeItems();  
   //this.listauxProductos=[];
    //this.response();  
   
  }
   async ionViewWillEnter(){   
    this.listauxProductos=[];
    this.listProductos=[];
    await this.provedorProductos.listSexshop;
    this.provedorProductos.listSexshop=[];
    this.provedorProductos.sw=0;
    this.getDatosProductos();    
  
      
  
   }
 
  ionViewDidLoad() {
    console.log('ionViewDidLoad LicoreriaPage');
    
  }

 
   loadData(event,parte:number) {
  
    this.cont++;  
    if(this.cont==1)
    {
      this.provedorProductos.sw=1;
      setTimeout(()=>{
        event.complete();
        this.parte++;        
        this.getDatosProductos();
        this.provedorProductos.sw=0;
        this.listProductos=[];
        this.listauxProductos=[];
        console.log("se termino el tiempo");
        this.aux=0;
        this.cont=0;
      },3000);
    }
        
     
    
  }

  toggleInfiniteScroll() {
    this.infiniteScroll.disabled = !this.infiniteScroll.disabled;
  }

  initializeItems(){
   this.listauxProductos=this.listProductos;
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
   async getDatosProductos(){
    let data="Licoreria";
    
    this.listauxProductos=this.listProductos= await this.provedorProductos.obtenerdatosProductosLicoreria(data,this.parte);   
      
   
  }

 

}
