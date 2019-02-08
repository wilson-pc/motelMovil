import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import { Productos } from '../../models/Productos';
import { Habitacion } from '../../models/Habitacion';
import { ProviderProductosProvider } from '../../providers/provider-productos/provider-productos';
import { elementAt } from 'rxjs/operators';

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
  listProductossex:Productos[]=[];
  listauxProductossex:Productos[]=[];
  loading:any;
  aux:number= 0;
  cont=0;

  constructor(public loadingCtrl: LoadingController,public navCtrl: NavController, public navParams: NavParams, private provedorProductos:ProviderProductosProvider) {
    
    //this.initializeItems();
    
  }
  ionViewWillEnter(){
    //   this.listauxProductossex=[];
    this.getDatosProductos();    
     this.infiniteScroll="algo";
    //   this.response();
    }
    
  
    ionViewDidLoad() {
      console.log('ionViewDidLoad SexShopPage');
    }
  
    //FUNCIONES PARA EL LOADING
    // presentLoadingDefault() {
    //   this.loading = this.loadingCtrl.create({
    //     content: 'Porfavor espere...'
    //   });
    //   this.loading.present();    
    // }
  
  //FUNCIONES PARA EL BUSCADOR
    async initializeItems() {
      this.listauxProductossex=this.listProductossex;
      
      // console.log("lista aux" + this.listauxProductos);
    }
  
    
    getItems(ev: any) {
      // Reset items back to all of the items
      this.initializeItems();
  
      // set val to the value of the searchbar
      const val = ev.target.value;
  
      // if the value is an empty string don't filter the items
      if (val && val.trim() != '') {
        this.listauxProductossex = this.listauxProductossex.filter((item) => {
          return (item.nombre.toLowerCase().indexOf(val.toLowerCase()) > -1);
        })
      }
    }
  
    //FUNCIONES PARA CARGAR DATOS DESDE EL SCROLL
     loadData(event) {   
      this.cont++;  
      if(this.cont==1)
      {
        this.provedorProductos.sw=1;
        setTimeout(()=>{
          event.complete();
          this.parte++;        
          this.getDatosProductos();
          this.provedorProductos.sw=0;
          console.log("se termino el tiempo");
          this.aux=0;
          this.cont=0;
        },3000);
      }
          
      //this.infiniteScroll=event;    
      
    
    }

  
    toggleInfiniteScroll() {
      this.infiniteScroll.disabled = !this.infiniteScroll.disabled;
    }
  
    //FUNCIONES BASE DE DATOS
     async getDatosProductos(){
      let data="SexShop";
     
        this.listauxProductossex=this.listauxProductossex = await this.provedorProductos.obtenerdatosProductosSexshop(data,this.parte);
     
    
         
      // this.provedorProductos.obtenerdatosProductosSexshop(data,parte).forEach( element =>{
      //   this.listauxProductossex.push(element);
      // })  
     
    }
  
 
    
  
}
