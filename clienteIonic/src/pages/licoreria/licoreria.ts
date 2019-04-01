import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, Loading, ModalController } from 'ionic-angular';
import { ProviderProductosProvider } from '../../providers/provider-productos/provider-productos';
import { Productos } from '../../models/Productos';
import { Habitacion } from '../../models/Habitacion';
import {  SocketConfigService } from '../../services/socket-config.service';
import { DescriptionLicoreriaPage } from '../description-licoreria/description-licoreria';

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
  parte:number;  

  searchQuery: string = '';
  items: string[];
  habitaciones:Habitacion;
  producto:Productos;
  listProductos:Productos[]=[];
  listauxProductos:Productos[]=[];
  loading:Loading;
  aux:number=0;
  cont=0;
  constructor(public loadingCtrl: LoadingController,
    public navCtrl: NavController,
     public navParams: NavParams,
     private productService:SocketConfigService,
     public modalCtrl: ModalController) {
   this.parte=0;
    this.respuestaProductosNegocioLicores();   
  }
   async ionViewWillEnter(){   
    this.listauxProductos=[];
    this.listProductos=[];  
    this.parte=0;
    this.obtenerdatosProductos();          
  
   }
   presentModal() {
    const modal = this.modalCtrl.create(DescriptionLicoreriaPage);
    modal.present();
  }
 
  ionViewDidLoad() {
    console.log('ionViewDidLoad LicoreriaPage');
    
  }

   loadData(event) {
  
    this.cont++;  
    if(this.cont==1)
    {      
      setTimeout(()=>{
        event.complete();
        this.parte++;        
        this.obtenerdatosProductos();    
        console.log("se termino el tiempo");      
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

  obtenerdatosProductos(){
    let terminoL="Licoreria";    
    let newdata={termino:terminoL,parte:this.parte}
    
    console.log(newdata);
    this.productService.emit('listar-producto-licores', newdata);   
  }

  respuestaProductosNegocioLicores() {
        
    this.productService.on('respuesta-listado-producto-licores',(data)=>{
                      
          if(!data.error){
            console.log("este es el data:"+data);
            this.listauxProductos=data;
            this.listProductos=data;
           
          }
          else{
            console.log("error en la lista");
          }
        })
      
   }

}
