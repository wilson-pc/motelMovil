import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, ModalController } from 'ionic-angular';
import { Productos } from '../../models/Productos';
import { Habitacion } from '../../models/Habitacion';
import { ProviderProductosProvider } from '../../providers/provider-productos/provider-productos';
import { elementAt } from 'rxjs/operators';
import { SocketConfigService } from '../../services/socket-config.service';
import { Observable } from 'rxjs';
import { DEFAULT_INTERPOLATION_CONFIG } from '@angular/compiler';
import { DescriptionSexshopPage } from '../description-sexshop/description-sexshop';
import { DescripcionProductoPage } from '../descripcion-producto/descripcion-producto';
import { DescriptionLicoreriaPage } from '../description-licoreria/description-licoreria';

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
  parte:number;  

  searchQuery: string = '';
  items: string[];
  habitaciones:Habitacion;
  producto:Productos;
  listProductossex:Productos[]=[];
  listauxProductossex:Productos[]=[];
  loading:any;
  aux:number= 0;
  cont=0;
  
  

  constructor(public productService:SocketConfigService ,
    public loadingCtrl: LoadingController,
    public navCtrl: NavController, 
    public navParams: NavParams, 
    private provedorProductos:ProviderProductosProvider,
    public modalCtrl: ModalController) {
    
    //this.initializeItems();
    
    this.parte=0;       
    this.presentLoadingDefault();
    this.obtenerdatosProductos();
    this.respuestaProductosNegocioSexshop();
   
  }  

  // ionViewWillEnter(){  
  //   //   this.response();
  //   }    
    
    presentModal(item) {
      const modal = this.modalCtrl.create(DescriptionLicoreriaPage,{producto:item});
      modal.present();
    }
  
    ionViewDidLoad() {
      console.log('ionViewDidLoad SexShopPage');
    }
  
    //FUNCIONES PARA EL LOADING
   presentLoadingDefault() {
     this.loading = this.loadingCtrl.create({
       content: 'Porfavor espere...',
        
     });
     this.loading.present(); 
    
   }
  
  //FUNCIONES PARA EL BUSCADOR
     initializeItems() {
      this.listauxProductossex= this.listProductossex;
      
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
        setTimeout(()=>{
          event.complete();
          this.parte++;                  
         this.obtenerdatosProductos();                              
          this.cont=0;
        },3000);
      }          
      //this.infiniteScroll=event;  
    }

  
    toggleInfiniteScroll() {
      this.infiniteScroll.disabled = !this.infiniteScroll.disabled;
    }
  
    //FUNCIONES BASE DE DATOS  
  
    
    obtenerdatosProductos(){
      let terminoL="SexShop";    
      let newdata={termino:terminoL,parte:this.parte}
      
      console.log(newdata);
      this.productService.emit('listar-producto-sexshops', newdata);      
      
    }

    respuestaProductosNegocioSexshop() {
        
      this.productService.on('respuesta-listado-producto-sexshops',(data)=>{
                        
            if(!data.error){
              console.log("este es el data:",data);
              console.log(data); 

               data.forEach(element => {
                 this.listauxProductossex.push(element);
                 this.listProductossex.push(element);
               });    

              //this.listauxProductossex=data;
             
              this.loading.dismiss();          
              
            }
            else{
              console.log("error en la lista");
              this.loading.dismiss();  
            }
          })
        
     }
      
 
 
    
  
}
