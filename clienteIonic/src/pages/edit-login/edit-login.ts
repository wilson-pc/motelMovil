import { UsuarioProvider } from './../../providers/usuario/usuario';
import { SocketUsuarioService2 } from './../../services/socket-config.service';

import { clave } from '../../app/cryptoclave';
import { Storage } from '@ionic/storage';
import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams,Nav, ViewController, ToastController} from 'ionic-angular';
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

  constructor(public toastCtrl: ToastController,public viewCtrl: ViewController,private storage: Storage,public navCtrl: NavController, public navParams: NavParams,private userSocket: SocketUsuarioService2,private usuarioActual:UsuarioProvider) {
    this.connection();
  }

  ionViewDidLoad() {
   
  }

  dismiss(){
    this.viewCtrl.dismiss();
  }
  guardarCambios(usuario,pass1,pass2){
    if(pass1==pass2){

      let nuevo={usuario:{id:this.usuarioActual.UserSeCion.datos._id,usuario:usuario,password:pass1}};
      var ciphertext = CryptoJS.AES.encrypt(JSON.stringify(nuevo), clave.clave);
          this.userSocket.emit("cambiar-login",ciphertext.toString());

    }else{
     this.mensaje="Las contraseñas tienen que ser iguales"
    }
  }

  connection(){
    this.userSocket.on("respuesta-cambiar-login",(data) => {
      if(!data.error){
        this.storage.remove("usuario");
     
       this.viewCtrl.dismiss({data:"exito"});
     
       let toast = this.toastCtrl.create({
        showCloseButton: true,
        cssClass: 'profile-bg',
        message: "datos cambiados con exito vuelva a iniciar secion",
        duration: 3000,
        position: 'bottom'
      });
      toast.present();
      }else{
     
       this.mensaje=data.error;
      }
     });
  }
}
