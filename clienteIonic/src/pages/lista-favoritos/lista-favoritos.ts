import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Productos } from '../../models/Productos';
import { Negocio } from '../../models/Negocio';

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
  listaProductos: Productos[]=[];
  listabuscadorProductos:Productos[]=[];
  producto:Productos;
  items:string[]=[];

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.llenarDatos();
    this.initializeItems();
    this.producto=new Productos();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ListaFavoritosLicoreriasPage');
  }


  llenarDatos(){
    this.producto= new Productos();
    this.producto.nombre="Cocacola";
    this.producto.precio={precio:250,moneda:"Bs"};
    this.producto.descripcion="Refresco gaseoso con cafeina";

    this.listaProductos.push(this.producto);

    this.producto= new Productos();
    this.producto.nombre="Simba";
    this.producto.precio={precio:20,moneda:"Bs"};
    this.producto.descripcion="Refresco casi gaseoso con cafeina";

    this.listaProductos.push(this.producto);

    this.producto= new Productos();
    this.producto.nombre="Cascada";
    this.producto.precio={precio:250,moneda:"Bs"};
    this.producto.descripcion="Refresco unico gaseoso con cafeina";

    this.listaProductos.push(this.producto);

    this.producto= new Productos();
    this.producto.nombre="Sprite";
    this.producto.precio={precio:250,moneda:"Bs"};
    this.producto.descripcion="Refresco poco gaseoso con cafeina";

    this.listaProductos.push(this.producto);
   

    console.log("este es la lista:",this.listaProductos);
  }
//FUNCION PARA BUSCAR EN LA LISTA
  initializeItems(){
    //TODO Cargar datos al array;
   
    this.listabuscadorProductos=this.listaProductos;
    //console.log(this.listabuscadorProductos);
   
  }
  
  getItems(ev: any) {
    // Reset items back to all of the items
    this.initializeItems();

    // set val to the value of the searchbar
    const val = ev.target.value;

    // if the value is an empty string don't filter the items
    if (val && val.trim() != '') {
      this.listabuscadorProductos = this.listabuscadorProductos.filter((item) => {

        if(item.nombre.toLowerCase().indexOf(val.toLowerCase())>-1 || item.descripcion.toLowerCase().indexOf(val.toLowerCase())>-1){
          return item;
        }       
       
       // return (item['nombre'].toLowerCase().indexOf(val.toLowerCase())>-1);
        
      })
    }
    console.log(this.listabuscadorProductos);
    //item.toLowerCase().indexOf(val.toLowerCase()) > -1
  }

  //Metodos de obtencion de datos
  obtenerListadeFavoritos(){

  }
}
