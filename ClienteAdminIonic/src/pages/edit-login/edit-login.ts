import { UserOnlyProvider } from './../../providers/user-only/user-only';
import { clave } from '../../app/cryptoclave';
import { SocketServiceUser } from './../../providers/socket-config/socket-config';
import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams,Nav} from 'ionic-angular';
import * as CryptoJS from 'crypto-js';
import { LoginPage } from '../login/login';

/**
 * Generated class for the EditLoginPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-edit-login',
  templateUrl: 'edit-login.html',
})
export class EditLoginPage {
 mensaje:string;
 @ViewChild(Nav) nav: Nav;

  constructor(public navCtrl: NavController, public navParams: NavParams,private userSocket: SocketServiceUser,private usuarioActual:UserOnlyProvider) {
  }

  ionViewDidLoad() {
   
  }
  guardarCambios(usuario,pass1,pass2){
    if(pass1==pass2){

      let nuevo={usuario:{id:this.usuarioActual.userSesion.datos._id,usuario:usuario,password:pass1}};
      var ciphertext = CryptoJS.AES.encrypt(JSON.stringify(nuevo), clave.clave);
          this.userSocket.emit("cambiar-login",ciphertext.toString());
          this.userSocket.on("respuesta-cambiar-login",(data) => {
           if(!data.error){
            localStorage.clear();
            // Redirecionar al Login
            this.navCtrl.setRoot(LoginPage);
            console.log("cerrando sesion de usuario");
            this.usuarioActual.userSesion=undefined;
           }else{
          
            this.mensaje=data.error;
           }
          });
    }else{
     this.mensaje="Las contraseñas tienen que ser iguales"
    }
  }

}
