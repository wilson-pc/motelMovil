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

  constructor(public loadingCtrl: LoadingController,public navCtrl: NavController, public navParams: NavParams,private provedorProductos:ProviderProductosProvider) {
   
   
  }

  ionViewWillEnter(){
    this.listauxProductos=[];
    this.listProductos=[];
    this.aux=0;
    
   // this.initializeItems();
    this.presentLoadingDefault();
    this.getDatosProductos(this.parte);    
    this.infiniteScroll="algo";
    this.response();
    
  }

  // initializeItems() {
  //   this.listauxProductos = this.listProductos;
  //   console.log("lista aux" + this.listauxProductos);
  // }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LicoreriaPage');
  }

  

  //FUNCTION LOADING
    presentLoadingDefault() {
       
    this.loading = this.loadingCtrl.create({
      content: 'Porfavor espere...'
    });

    if( this.aux==0)
    {
      this.loading.present();
    }
    else{
      if( this.aux==1){
        this.loading.dismiss();
      }
    }

  }

   loadData(event,parte:number) {
  
    this.infiniteScroll=event;
    this.parte=parte;
    console.log(parte);
     this.getDatosProductos(parte);  
    
  }

  toggleInfiniteScroll() {
    this.infiniteScroll.disabled = !this.infiniteScroll.disabled;
  }

 
  getItems(ev: any) {
    // Reset items back to all of the items
    //this.initializeItems();

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
    let data="Licoreria";
    console.log(parte);
    this.provedorProductos.obtenerdatosProductos(data,parte);  
      
  }

 response(){ 
  
    this.provedorProductos.respuestaProductosNegocio().subscribe( (data:any[])=>{
      console.log(data);   
      
      this.loading.dismiss();

      this.listauxProductos=[];   
     
     
      data.forEach(element => {
      
       this.listauxProductos.push(element);
      });        

      if(this.infiniteScroll!="algo"){
         this.infiniteScroll.complete();         
      }    
     
    }); 

    this.aux=1;
    console.log("este es el aux");
    console.log(this.aux);
      
  }



}
