import { EditUserPage } from './../edit-user/edit-user';
import { EditLoginPage } from './../edit-login/edit-login';
import { UsuarioProvider } from './../../providers/usuario/usuario';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,ModalController } from 'ionic-angular';
import { LoginPage } from '../login/login';

/**
 * Generated class for the ProfileUserPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-profile-user',
  templateUrl: 'profile-user.html',
})
export class ProfileUserPage {

  constructor(public navCtrl: NavController, public navParams: NavParams,public userServ:UsuarioProvider,private modalctrl:ModalController) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ProfileUserPage');
  }
  editUser(){
    this.navCtrl.push(EditUserPage);
  }
  editLogin(){

    let modal=this.modalctrl.create(EditLoginPage);
   modal.present();
   modal.onDidDismiss(data=>{
     if(data){
      
      this.navCtrl.setRoot(LoginPage).then(()=>{
        this.userServ.UserSeCion=undefined;
      });
     }
   });
    
  }

}
