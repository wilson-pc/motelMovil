import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';
import { Productos } from '../../models/Productos';
import { conexionSocketComportamiento } from '../../services/socket-config.service';
import { UsuarioProvider } from '../../providers/usuario/usuario';
import { Habitacion } from '../../models/Habitacion';
import { Geolocation } from '@ionic-native/geolocation';
import { DescriptionLicoreriaPage } from '../description-licoreria/description-licoreria';

/**
 * Generated class for the ListaFavoritosLicoreriasPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-lista-favoritos',
  templateUrl: 'lista-favoritos.html',
})

export class ListaFavoritosPage {

  productos="licores";
  listaProductoslicores: Productos[]=[];
  listabuscadorProductoslicores:Productos[]=[];

  listamotel:Habitacion[]=[];
  listamotelbuscador:Habitacion[]=[];

  listasexshop:Productos[]=[];
  listasexshopbuscador:Productos[]=[];

  producto:Productos;
 
  latitud:number;
  longitud:number;

  latitud1:number;
  longitud1:number;

  other:any;
   constructor(public navCtrl: NavController,
     public navParams: NavParams,      
     private usuarioLogueado:UsuarioProvider,
     public provedorSocketFavoritos:conexionSocketComportamiento,
     public geolocalizacion: Geolocation,
     public modalCtrl: ModalController) {
      
        this.obtenerListadeFavoritosLicores();  
        this.respuestaListaFavoritosLicores();  

        this.obtenerListadeFavoritosMoteles();
        this.respuestaListaFavoritosMoteles();

        this.obtenerListadeFavoritosSexshop();
        this.respuestaListaFavoritosSexshop();
    

      
   // this.llenarDatos();
    
   // this.obtenerListadeFavoritos();
    this.producto=new Productos();

    this.getCurrentPosition();
    this.getPositionForObserver();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ListaFavoritosLicoreriasPage');   
  }

  getCurrentPosition(){
    this.geolocalizacion.getCurrentPosition().then(data =>{
      this.latitud= data.coords.latitude;
      this.longitud=data.coords.longitude;
    }).catch(error=>{
      console.log("error en:",error);
    });
  }

  getPositionForObserver(){
    let watch = this.geolocalizacion.watchPosition();
    watch.subscribe(data =>{
      this.latitud1= data.coords.latitude;
      this.longitud1=data.coords.longitude;
    });
  }


  
//FUNCION PARA BUSCAR EN LA LISTA
  initializeItems(){
    //TODO Cargar datos al array;
   
    this.listamotelbuscador=this.listamotel;
    this.listasexshopbuscador=this.listasexshop;
    this.listabuscadorProductoslicores=this.listaProductoslicores;
    console.log("lista de favoritos",this.listabuscadorProductoslicores);
   
  }
  presentModal(item) {
    console.log(item);
    const modal = this.modalCtrl.create(DescriptionLicoreriaPage,{producto:item});
      modal.present();
  }
  
  getItems(ev: any) {
    // Reset items back to all of the items
    this.initializeItems();

    // set val to the value of the searchbar
    const val = ev.target.value;

    // if the value is an empty string don't filter the items
    if (val && val.trim() != '') {
      this.listabuscadorProductoslicores = this.listabuscadorProductoslicores.filter((item) => {

        if(item.nombre.toLowerCase().indexOf(val.toLowerCase())>-1 || item.descripcion.toLowerCase().indexOf(val.toLowerCase())>-1){
          return item;
        }                   
      })
    }  
  }

  //Metodos de obtencion de datos
   async obtenerListadeFavoritosLicores(){
     let usuario={idusuario: this.usuarioLogueado.UserSeCion.datos._id};
     //console.log("este es el usuario:",usuario);
     if(usuario.idusuario != undefined || usuario.idusuario !=null)
     {
       console.log("entro if");
       await this.provedorSocketFavoritos.emit('listar-favorito-licores',usuario);
        //await this.respuestaListaFavoritos();

     }
     
   }

   respuestaListaFavoritosLicores(){
     this.provedorSocketFavoritos.on('respuesta-listar-favorito-licores',(data)=>{
      // console.log("datos",data.datos);
       for (let index = 0; index < data.datos.length; index++) {
         const element = data.datos[index];
        // console.log("productos:",element.producto);        

          this.listaProductoslicores.push(element.producto);
          this.listabuscadorProductoslicores.push(element.producto);
         
       }

       console.log("listas Buscador",this.listabuscadorProductoslicores);
     });    
   }

   async obtenerListadeFavoritosMoteles(){
    let usuario={idusuario: this.usuarioLogueado.UserSeCion.datos._id};
    //console.log("este es el usuario:",usuario);
    if(usuario.idusuario != undefined || usuario.idusuario !=null)
    {
      console.log("entro if");
      await this.provedorSocketFavoritos.emit('listar-favorito-moteles',usuario);
       //await this.respuestaListaFavoritos();

    }
    
  }


  respuestaListaFavoritosMoteles(){
    this.provedorSocketFavoritos.on('respuesta-listar-favorito-moteles',(data)=>{
      console.log(data);
     // console.log("datos",data.datos);
      for (let index = 0; index < data.datos.length; index++) {
        const element = data.datos[index];
       // console.log("productos:",element.producto);        

         this.listamotelbuscador.push(element.producto);
         this.listamotel.push(element.producto);
        
      }

      console.log("listas Buscador",this.listabuscadorProductoslicores);
    });      
    
  }

  async obtenerListadeFavoritosSexshop(){
    let usuario={idusuario: this.usuarioLogueado.UserSeCion.datos._id};
    //console.log("este es el usuario:",usuario);
    if(usuario.idusuario != undefined || usuario.idusuario !=null)
    {
      console.log("entro if");
      await this.provedorSocketFavoritos.emit('listar-favorito-sexshops',usuario);
       //await this.respuestaListaFavoritos();

    }
    
  }

  respuestaListaFavoritosSexshop(){
    this.provedorSocketFavoritos.on('respuesta-listar-favorito-sexshops',(data)=>{
     // console.log("datos",data.datos);
      for (let index = 0; index < data.datos.length; index++) {
        const element = data.datos[index];
       // console.log("productos:",element.producto);        

         this.listasexshop.push(element.producto);
         this.listasexshopbuscador.push(element.producto);
        
      }      
    });    
    
    
  }


}
