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

  constructor(public loadingCtrl: LoadingController,public navCtrl: NavController, public navParams: NavParams, private provedorProductos:ProviderProductosProvider) {
    
    //this.initializeItems();
    
  }
  ionViewWillEnter(){
    //   this.listauxProductossex=[];
    this.getDatosProductos(this.parte);    
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
    
      this.infiniteScroll=event;
      this.aux=1;
      //this.infiniteScroll=event;
      if(this.aux==1){
        this.parte++;
       console.log(this.aux);
       console.log(this.parte);
       this.getDatosProductos(this.parte);
       

       if(this.infiniteScroll!="algo"){
        this.infiniteScroll.complete();         
        }    

      }    
      // this.parte=
      // console.log(parte);
      // this.getDatosProductos(parte);   
      //       
    }
  
    toggleInfiniteScroll() {
      this.infiniteScroll.disabled = !this.infiniteScroll.disabled;
    }
  
    //FUNCIONES BASE DE DATOS
     async getDatosProductos(parte){
      let data="SexShop";
      console.log(parte);
      this.listauxProductossex=this.listProductossex= await this.provedorProductos.obtenerdatosProductosSexshop(data,parte);
      this.aux=0;
      
      // this.provedorProductos.obtenerdatosProductosSexshop(data,parte).forEach( element =>{
      //   this.listauxProductossex.push(element);
      // })  
     
    }
  
 
    
  
}
