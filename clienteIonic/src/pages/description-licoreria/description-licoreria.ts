import { Component,OnDestroy } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { Productos } from '../../models/Productos';
import {SocketConfigService} from '../../services/socket-config.service';
import { Subscription } from 'rxjs/Subscription';

/**
 * Generated class for the DescriptionLicoreriaPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-description-licoreria',
  templateUrl: 'description-licoreria.html',
})
export class DescriptionLicoreriaPage implements OnDestroy{
  productoRecibido:Productos;
  imagenProducto:any;
  cantidadReserva = 1;
  clientesSubscription: Subscription;

  constructor(public navCtrl: NavController, 
    public navParams: NavParams,
    public viewCtrl: ViewController,
    private productoServ: SocketConfigService) {
      this.clientesSubscription=this.eventoSacarDatos().subscribe(data=>{
        this.imagenProducto=data.foto.normal;
        console.log("entrando",this.imagenProducto);
      })
      this.obtenerDatosProducto();
  }
  ngOnDestroy() {
    console.log("saliendo");
    this.clientesSubscription.unsubscribe();
  }
  obtenerDatosProducto(){
    this.productoRecibido=this.navParams.get("producto")
    console.log("esto es el producto",this.productoRecibido);
    this.sacarDatos();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad DescriptionLicoreriaPage');
  }
  dismiss() {
    this.viewCtrl.dismiss();
  }

  sacarDatos(){
    this.productoServ.emit("sacar-producto",{id:this.productoRecibido._id})
  }
  eventoSacarDatos(){
    console.log("entrando1");
    return this.productoServ.fromEvent<any> ('respuesta-sacar-producto').map(data=>data)
  }

}
