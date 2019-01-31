import { Component, ViewChild } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { HomePage } from '../pages/home/home';
import { ListPage } from '../pages/list/list';
import { LocalWeatherPage } from '../pages/local-weather/local-weather';
import { LoginPage } from '../pages/login/login';
import { RegisterRoomPage } from '../pages/register-room/register-room';

import { TabsPage } from '../pages/tabs/tabs';
import { AuthProvider } from '../providers/auth/auth';


@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = TabsPage;

  moteles: Array<{title: string, component: any}>;
  licorerias: Array<{title: string, component: any}>;
  sexshops: Array<{title: string, component: any}>;
  mapas: Array<{title: string, component: any}>;

  verificacion:any=0;

  constructor(private proveedordata:AuthProvider,public platform: Platform, public statusBar: StatusBar, public splashScreen: SplashScreen) {
    this.initializeApp();
    console.log("este es el proveedor");
    console.log(proveedordata.auxflag);
    this.verificacion=proveedordata.auxflag;

    // used for an example of ngFor and navigation
    this.moteles = [
      
      { title: 'Lista de Compras', component: ListPage },
      { title: 'Lista de Favoritos', component: ListPage },
      { title: 'Lista de Deseos', component: ListPage },
      { title: 'Billetera', component: LocalWeatherPage},
      { title: 'Reservar Habitacion(es)', component: RegisterRoomPage}
    ];

    this.licorerias = [
      
      { title: 'Lista de Compras', component: ListPage },
      { title: 'Lista de Favoritos', component: ListPage },
      { title: 'Lista de Deseos', component: ListPage },
      { title: 'Billetera', component: LocalWeatherPage},
      { title: 'Reservar Bebida(s)', component: RegisterRoomPage}
    ];

    this.sexshops = [
      
      { title: 'Lista de Compras', component: ListPage },
      { title: 'Lista de Favoritos', component: ListPage },
      { title: 'Lista de Deseos', component: ListPage },
      { title: 'Billetera', component: LocalWeatherPage},
      { title: 'Reservar Producto(s)', component: RegisterRoomPage}
    ];

    this.mapas = [
      
      { title: 'Lugares cercanos', component: ListPage },
      { title: 'Lugares mas visitados', component: ListPage },
      { title: 'Lugares con puntuacion alta', component: ListPage },
      
    ];


  }

  initializeApp() {
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
    this.nav.setRoot(page.component);
  }
  logout() {
    this.nav.setRoot(LoginPage);
  }
}
