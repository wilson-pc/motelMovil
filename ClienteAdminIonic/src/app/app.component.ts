import { Component, ViewChild } from '@angular/core';
import { Nav, Platform, NavController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { HomePage } from '../pages/home/home';
import { LocalWeatherPage } from '../pages/local-weather/local-weather';
import { LoginPage } from '../pages/login/login';
import { RegisterRoomPage } from '../pages/register-room/register-room';
import { UserOnlyProvider } from '../providers/user-only/user-only';
import { Usuarios } from '../models/Usuarios';
import * as CryptoJS from 'crypto-js';
import { clave } from './cryptoclave';
import { SocketServiceUser } from '../providers/socket-config/socket-config';
import { Observable } from 'rxjs';
import { ngControlStatusHost } from '@angular/forms/src/directives/ng_control_status';
import { ListProductsPage } from '../pages/list-products/list-products';
import { EditLoginPage } from '../pages/edit-login/edit-login';


@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = HomePage;

  pages: Array<{ title: string, component: any }>;

  // variables locales
  userOnly: any;
  constructor(
    public platform: Platform,
    public statusBar: StatusBar,
    public splashScreen: SplashScreen,
    public userOnlyProvider: UserOnlyProvider,
    public userSocket: SocketServiceUser) {
    //Inicializacion
    this.initializeApp();
    
    // used for an example of ngFor and navigation
    this.pages = [
      { title: 'Inicio', component: HomePage },
      { title: 'Lista Productos', component: ListProductsPage }
    ];
    // Valid route
    this.validUserLocalStorage();
    this.connectionBackendSocket();
    
  }
  editLogin(){
  this.nav.setRoot(EditLoginPage);
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

  // Cerrar Sesion
  logout() {
    // Obteniendo usuario actual para cerrar sesion
    this.userOnly = this.userOnlyProvider.userSesion;

    // validacion para cerrar sesion
    var ciphertext = CryptoJS.AES.encrypt(JSON.stringify({ id: this.userOnly.datos._id }), clave.clave);
    this.userSocket.emit("cerrar-secion", ciphertext.toString());
  }

  //Validacion de datos en localStorage
  validUserLocalStorage() {
    let cache = localStorage.getItem("usuario");
    if (cache != undefined) {
      let data = this.decryptData(cache);
      this.userOnlyProvider.userSesion = data;
     
      console.log("Usuario Activo");
      console.log("es ->", this.userOnlyProvider.userSesion)
      // Redireccion de pagina
      this.rootPage = HomePage;
    } else {
      console.log("sin DATOS EN el browser");
      // Redireccion de pagina
      this.rootPage = LoginPage;
    }
  }

  //Desencriptacion para la carga de datos en localStorage
  decryptData(data) {
    try {
      const bytes = CryptoJS.AES.decrypt(data, clave.clave);
      if (bytes.toString()) {
        return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
      }
      return data;
    } catch (e) {
      console.log(e);
    }
  }
  // Consumo de servicios en el Backend
  connectionBackendSocket() {
    this.respuestaCerrar().subscribe((data: any) => {
      if (data) {
        // Borrar LocalStorage
        localStorage.clear();
        // Redirecionar al Login
        this.nav.setRoot(LoginPage);
        console.log("cerrando sesion de usuario");
        console.log(this.userOnly);
      } else {
        console.log("error");
      }
    });
  }

  respuestaCerrar() {
    let observable = new Observable(observer => {
      this.userSocket.on('respuesta-cerrar', (data) => {
        observer.next(data);
      });
    })
    return observable;
  }
}
