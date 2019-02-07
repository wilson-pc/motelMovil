import { Component, ViewChild, ElementRef } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { HomePage } from '../pages/home/home';
import { ListPage } from '../pages/list/list';
import { LocalWeatherPage } from '../pages/local-weather/local-weather';
import { LoginPage } from '../pages/login/login';
import { TabsPage } from '../pages/tabs/tabs';
import { AuthProvider } from '../providers/auth/auth';
import { Storage } from '@ionic/storage';
import { ListaReservasPage } from '../pages/lista-reservas/lista-reservas';
import { ListaFavoritosPage } from '../pages/lista-favoritos/lista-favoritos';
import {AndroidPermissions} from '@ionic-native/android-permissions'
import { ListaDeseosPage } from '../pages/lista-deseos/lista-deseos';
import { UsuarioProvider } from '../providers/usuario/usuario';


@Component({
  templateUrl: 'app.html'
})
export class MyApp {

 
  @ViewChild(Nav) nav: Nav;

  rootPage: any = TabsPage;

  menu: Array<{title: string, component: any}>;
  

  verificacion:any=0;
  content;
  navCtrl: any;



  constructor(private storage: Storage,private userServ:UsuarioProvider,public proveedordata:AuthProvider,private androidPermissions: AndroidPermissions,public platform: Platform, public statusBar: StatusBar, public splashScreen: SplashScreen) {
       
    this.initializeApp();
    platform.ready().then(() => {

      androidPermissions.requestPermissions(
        [
          androidPermissions.PERMISSION.STORAGE, 
          androidPermissions.PERMISSION.READ_EXTERNAL_STORAGE, 
          androidPermissions.PERMISSION.WRITE_EXTERNAL_STORAGE
        ]
      );
      storage.get('usuario').then((val) => {
        if(val){
        //  alert(val);
          this.userServ.UserSeCion=val;
          //alert("con secion");
        }else{
        //  alert("sin secion");
        }
      });

 }) 
    
    // used for an example of ngFor and navigation
    this.menu = [
      
      { title: 'Inicio ', component: TabsPage },
      { title: 'Mis Reservas ', component: ListaReservasPage },
      { title: 'Mis Favoritos', component: ListaFavoritosPage },
      { title: 'Deseos', component: ListaDeseosPage },
      { title: 'Billetera', component: LocalWeatherPage},
      
    ];


  }



  initializeApp() {

  this.content=document.getElementsByTagName('ion-menu');
  if(this.content)
  {
    console.log("se abrio");
  }    

    this.verificacion= this.proveedordata.auxflag;
    console.log("entro app");
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.verificacion=this.proveedordata.auxflag;
    console.log(this.verificacion);

    this.nav.setRoot(page.component);
  }
  logout() {
    this.storage.remove("usuario");
    this.userServ.UserSeCion=undefined;
    this.nav.setRoot(LoginPage);
  }
}
