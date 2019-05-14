import { Component,ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, InfiniteScroll, LoadingController, ModalController, Loading } from 'ionic-angular';
import { Habitacion } from '../../models/Habitacion';
import { ProviderProductosProvider } from '../../providers/provider-productos/provider-productos';
import { Productos } from '../../models/Productos';
import { SocketConfigService } from '../../services/socket-config.service';
import { DescriptionMotelPage } from '../description-motel/description-motel';
import { DescriptionLicoreriaPage } from '../description-licoreria/description-licoreria';
import { Subscription } from 'rxjs';


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
  loading:Loading;
  cont=0;
  suscripctionSocket: Subscription;
  constructor(public loadingCtrl: LoadingController,
    public navCtrl: NavController, 
    public navParams: NavParams,
    private socketservicio: SocketConfigService,
    public modalCtrl: ModalController) {
      this.parte=0;
      this.presentLoadingDefault();
      this.obtenerdatosProductos();
  this.respuestaProductosNegocioMoteles();
  }

  ionViewDidLoad() {

   
    console.log('ionViewDidLoad MotelPage');
  }

  //FUNCION PARA LOADING
  presentLoadingDefault() {
    this.loading = this.loadingCtrl.create({
      content: 'Porfavor espere...',
       
    });
    this.loading.present(); 
   
  }

  //FUNCION PARA SCROLL INFINITO
  loadData(event) {
  
   
    this.infiniteScroll = event;
    this.cont++;  
    if(this.cont==1)
    {           
          setTimeout(()=>{
            this.parte++;        
          this.obtenerdatosProductos();    
          event.complete();
          console.log("se termino el tiempo");      
          this.cont=0;

          },3000)       
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

  presentModal(item) {
    const modal = this.modalCtrl.create(DescriptionLicoreriaPage,{producto:item});
      modal.present();
  }


  respuestaProductosNegocioMoteles() {
        
    this.socketservicio.on('respuesta-listado-producto-moteles',async (data)=>{
        if(!data.error){
          console.log(data);

          await data.forEach(element => {
            this.listauxProductos.push(element);
            this.listProductos.push(element);
          });         
          this.loading.dismiss();          
                   
        }
        else{
          console.log("ocurrio un problema");
        }
    })

    this.suscripctionSocket = this.respuestaNuevoProducto().subscribe(data=>{
      console.log("nuevo producto",data);
      this.listauxProductos.push(data[0]);
    })
      
   }
   respuestaNuevoProducto() {
    return this.socketservicio.fromEvent<any>('nuevo-producto').map(data => data)
  }
  ngOnDestroy() {
    console.log("unsuscribe");
    this.suscripctionSocket.unsubscribe();
  }
}
