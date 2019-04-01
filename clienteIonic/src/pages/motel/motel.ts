import { Component,ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, InfiniteScroll, LoadingController, ModalController } from 'ionic-angular';
import { Habitacion } from '../../models/Habitacion';
import { ProviderProductosProvider } from '../../providers/provider-productos/provider-productos';
import { Productos } from '../../models/Productos';
import { SocketConfigService } from '../../services/socket-config.service';
import { DescriptionMotelPage } from '../description-motel/description-motel';


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
  parte:number;
  searchQuery: string = '';
  items: string[];
  habitaciones:Habitacion;
  producto:Productos;
  listProductos:Productos[]=[];
  listauxProductos:Productos[]=[];
  loading:any;
  cont=0;

  constructor(public loadingCtrl: LoadingController,
    public navCtrl: NavController, 
    public navParams: NavParams,
    private socketservicio: SocketConfigService,
    public modalCtrl: ModalController) {
  this.respuestaProductosNegocioMoteles();
  this.parte=0;
    
  }
 
  ionViewWillEnter()
  {    
    this.obtenerdatosProductos();
    this.parte=0;
  }

  ionViewDidLoad() {

   
    console.log('ionViewDidLoad MotelPage');
  }

  //FUNCION PARA LOADING
    

  //FUNCION PARA SCROLL INFINITO
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
  }// FIN FUNCIONES DEL SCROLL INFINITO

  //FUNCIONES PARA BUSCAR POR NOMBRE EN UN ARRAY
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
  }//FIN FUNCIONES PARA BUSCAR POR NOMBRE EN ARRAY

  //FUNCIONES BASE DE DATOS
  obtenerdatosProductos(){
    let terminoL="Motel";    
    let newdata={termino:terminoL,parte:this.parte}
    
    console.log(newdata);
    this.socketservicio.emit('listar-producto-moteles', newdata);   
  }

  presentModal() {
    const modal = this.modalCtrl.create(DescriptionMotelPage);
    modal.present();
  }


  respuestaProductosNegocioMoteles() {
        
    this.socketservicio.on('respuesta-listado-producto-moteles',(data)=>{
        if(!data.error){
          console.log(data);
          this.listauxProductos=data;
          this.listProductos=data;
        }
        else{
          console.log("ocurrio un problema");
        }
      
         
    })
      
   }
}
