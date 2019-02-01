import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { HomePage } from '../home/home';
import { TopsPageModule } from '../tops/tops.module';
import { LicoreriaPage } from '../licoreria/licoreria';
import { TopsPage } from '../tops/tops';
import { AuthProvider } from '../../providers/auth/auth';
import { Moteles } from '../../models/Moteles';
import { MotelPage } from '../motel/motel';
import { MapsPage } from '../maps/maps';
import { SexShopPage } from '../sex-shop/sex-shop';


@IonicPage()
@Component({
  selector: 'page-tabs',
  templateUrl: 'tabs.html',
})
export class TabsPage {

  tab1Root = TopsPage;
  tab2Root = MotelPage;
  tab3Root = LicoreriaPage;
  tab4Root = SexShopPage;
  tab5Root = MapsPage;

  constructor(private proveedor:AuthProvider,public navCtrl: NavController, public navParams: NavParams) {
    
  }


  ionViewDidLoad() {
    console.log('ionViewDidLoad TabsPage');
  }

  //Modificar menu desplegable
  modificarMenuDesplegableIzquierdo(referencia){
    this.proveedor.auxflag=referencia;
  }  
 

}
