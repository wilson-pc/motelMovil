import { UsuarioProvider } from './../../providers/usuario/usuario';
import { Component, ViewChild, ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { Usuarios } from '../../models/Usuarios';
import { defecto } from '../register/imagedefault';
import { Storage } from '@ionic/storage';
import { SocketUsuarioService2, SocketLoginService } from '../../services/socket-config.service';
import { clave } from '../../app/cryptoclave';
import { resizeBase64 } from 'base64js-es6';
import * as CryptoJS from 'crypto-js';
import { ReplaySubject, Observable } from 'rxjs';
/**
 * Generated class for the EditUserPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-edit-user',
  templateUrl: 'edit-user.html',
})
export class EditUserPage {
  usuario:Usuarios;
  nombreimagen: string = "selecciona una foto";
  @ViewChild('fileInput') fileInput: ElementRef;
  nombreDeUsuario:string;
  password:string;
  constructor(private storage: Storage,public serServ:UsuarioProvider,public toastCtrl: ToastController,private userSocket:SocketLoginService,public navCtrl: NavController, public navParams: NavParams) {
    this.usuario=new Usuarios;
    this.usuario=serServ.UserSeCion.datos;
    this.connection();
  }
  register() {
    this.usuario.login={usuario:this.nombreDeUsuario,password:this.password,estado:false};
    

if(this.usuario.nombre && this.usuario.email && this.usuario.apellidos){
  var date = new Date().toUTCString();
  this.usuario.modificacion = { fecha: date} as any;

  let data = { usuario: this.usuario}
 console.log(data)
  var ciphertext = CryptoJS.AES.encrypt(JSON.stringify(data), clave.clave);
  this.userSocket.emit("actualizar-usuario-cliente", ciphertext.toString());
  
}else{
  let toast = this.toastCtrl.create({
    showCloseButton: true,
    cssClass: 'profile-bg',
    message: 'error deve completar todos los campos',
    duration: 3000,
    position: 'bottom'
  });
  toast.present();
}
  //  this.nav.setRoot(HomePage);
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad EditUserPage');
  }

  
  connection(){
    this.userSocket.on('respuesta-actualizar-usuario-cliente', (data) => {
      if(!data.mensaje){
        var cache={datos:data,token:this.serServ.UserSeCion.token};
        this.serServ.UserSeCion=cache;
        console.log(cache);
        this.storage.set("usuario", this.encryptData(cache));
     this.navCtrl.pop();

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
  filechoosser() {
    this.fileInput.nativeElement.click();
  }

   // Carga de la foto
   async fileChange(event) {

    // alert(event.srcElement.files[0].name);
    this.readFile(event.srcElement.files[0]).subscribe(data => {
      resizeBase64(data, 200, 150).then((result) => {
        
        this.usuario.foto=result;
      //  console.log(this.usuario);
    
      });
     // this.nombreimagen=event.srcElement.files[0].name;
      //   alert(dec.substring(0, 10));

    });
  }


  public readFile(fileToRead: File): Observable<MSBaseReader> {
    let base64Observable = new ReplaySubject<MSBaseReader>(1);
    this.nombreimagen=fileToRead.name;
    let fileReader = new FileReader();
    fileReader.onload = event => {
      base64Observable.next(fileReader.result);
    };
    fileReader.readAsDataURL(fileToRead);

    return base64Observable;
  }

  encryptData(data) {
    try {
      return CryptoJS.AES.encrypt(JSON.stringify(data), clave.clave).toString();
    } catch (e) {
      console.log(e);
    }
  }
}
