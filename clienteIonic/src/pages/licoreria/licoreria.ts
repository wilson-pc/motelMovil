import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, Loading } from 'ionic-angular';
import { ProviderProductosProvider } from '../../providers/provider-productos/provider-productos';
import { Productos } from '../../models/Productos';
import { Habitacion } from '../../models/Habitacion';
import { async } from 'rxjs/internal/scheduler/async';

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
   
   // this.initializeItems();  
   //this.listauxProductos=[];
    //this.response();  
   
  }


   ionViewWillEnter(){   
    this.listauxProductos=[];
    this.getDatosProductos(this.parte);      
    this.infiniteScroll="algo";
    console.log("esta es la lista=>"+ this.listauxProductos.length);
   }
 
  ionViewDidLoad() {
    console.log('ionViewDidLoad LicoreriaPage');
    
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
   async getDatosProductos(parte){
    let data="Licoreria";
    console.log(parte);
    this.listauxProductos=this.listProductos= await this.provedorProductos.obtenerdatosProductosLicoreria(data,parte);      
    await console.log( this.listauxProductos);
    if(this.infiniteScroll!="algo"){
        this.infiniteScroll.complete();         
      }          
   
  }

  //  responce(){
  
  //   if( this.listProductos.length==0){
  //     this.aux=1;
  //   }
  //   else{
  //     this.aux=0;      
  //   }

  //   this.guardarDatosenLista();
    
  // }

  // guardarDatosenLista(){


  //   if(this.aux==1)
  //   {
  //     this.provedorProductos.respuestaProductosNegocioLicoreria().subscribe( (data:any[])=>{
  //       this.listauxProductos=data;      
  //       this.listProductos=data;
  
  //       console.log("estas dentro de getdata");
  //       console.log(this.listauxProductos);
  //       // data.forEach(element => {
        
  //       //  this.listauxProductos.push(element);
  //       // });        
  
  //       // if(this.infiniteScroll!="algo"){
  //       //    this.infiniteScroll.complete();         
  //       // }          
  //     });   
  //   }
  //   else
  //   {
  //     console.log("datos llenos");
  //   }

   
  //}

}
