import { ProfileUserPage } from './../pages/profile-user/profile-user';
import { Component, ViewChild, ElementRef } from '@angular/core';
import { Nav, Platform, ToastController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import * as CryptoJS from 'crypto-js';
import { HomePage } from '../pages/home/home';
import { ListPage } from '../pages/list/list';
import { LocalWeatherPage } from '../pages/local-weather/local-weather';
import { LoginPage } from '../pages/login/login';
import { TabsPage } from '../pages/tabs/tabs';
import { AuthProvider } from '../providers/auth/auth';
import { clave } from '../app/cryptoclave';
import { Storage } from '@ionic/storage';
import { ListaReservasPage } from '../pages/lista-reservas/lista-reservas';
import { ListaFavoritosPage } from '../pages/lista-favoritos/lista-favoritos';
import {AndroidPermissions} from '@ionic-native/android-permissions'
import { ListaDeseosPage } from '../pages/lista-deseos/lista-deseos';
import { ComplaintsPage } from '../pages/complaints/complaints';
import { UsuarioProvider } from '../providers/usuario/usuario';
import { SocketUsuarioService2, SocketLoginService } from '../services/socket-config.service';


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
  constructor(public socketLogin:SocketLoginService, public socketUser:SocketUsuarioService2,public toastCtrl: ToastController,private storage: Storage,public userServ:UsuarioProvider, private androidPermissions: AndroidPermissions,public platform: Platform, public statusBar: StatusBar, public splashScreen: SplashScreen) {
       
    this.initializeApp();
    this.connection();
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
      let datos=this.decryptData(val);

          this.userServ.UserSeCion=datos;
        //  this.storage.remove("usuario");
        this.socketLogin.emit("verificar-suspencion", {id:datos.datos._id});
          console.log("soy datos en app",datos);
          //alert("con secion");
        }else{
         
          this.userServ.UserSeCion=false;
          console.log("sin cescion");
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
      { title: 'Mis Denuncias', component: ComplaintsPage},
    ];


  }



  initializeApp() {
    this.verificarSuspension().subscribe((dato)=>{
      console.log(dato);
      this.storage.remove("usuario");
      this.userServ.UserSeCion=false;
      this.nav.setRoot(LoginPage);
    })

  this.content=document.getElementsByTagName('ion-menu');
  if(this.content)
  {
    console.log("se abrio");
  }    

    console.log("entro app");
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }
  
  verificarSuspension() {
    return this.socketLogin.fromEvent<any>('respuesta-verificar-suspencion').map(data => data)
  }


  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
  }
  login(){
    this.userServ.UserSeCion=false;
    this.nav.setRoot(LoginPage);
  }
  logout() {
   var data={id:this.userServ.UserSeCion.datos._id}
    this.socketUser.emit("cerrar-secion", this.encryptData(data));
  }

  perfil(){
    this.nav.push(ProfileUserPage);
  }
  encryptData(data) {
    try {
      return CryptoJS.AES.encrypt(JSON.stringify(data), clave.clave).toString();
    } catch (e) {
      console.log(e);
    }
  }
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
  connection(){
    this.socketUser.on('respuesta-cerrar', (data) => {
      console.log(data);
      if(!data.mensaje){
        this.storage.remove("usuario");
        this.userServ.UserSeCion=false;
        this.nav.setRoot(LoginPage);
      }else{
        let toast = this.toastCtrl.create({
          showCloseButton: true,
          cssClass: 'profile-bg',
          message: data.mensaje,
          duration: 3000,
          position: 'bottom'
        });
        toast.present();
      }
    });
  }
}
