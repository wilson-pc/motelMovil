import { Socket } from 'ng-socket-io';
import { SocketServiceComportamiento} from './../../providers/socket-config/socket-config';
import { Component, OnDestroy } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Subscription } from 'rxjs';
import { from } from 'rxjs/observable/from';
import { UserOnlyProvider } from '../../providers/user-only/user-only';

/**
 * Generated class for the DenunciaPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-denuncia',
  templateUrl: 'denuncia.html',
})
export class DenunciaPage implements OnDestroy {

  Denuncias:any[]=[];
  ReservaSubscription: Array<Subscription> = [];
  constructor(public navCtrl: NavController, public navParams: NavParams,private SocketDenuncia:SocketServiceComportamiento,
    private userOnly:UserOnlyProvider) {
    this.ListarDenuncia().subscribe((data)=>{
      console.log(data);
      this.Denuncias=data;
    })
  }

  ionViewDidLoad() {
  this.sendEmitDenunciar();
  }
  ngOnDestroy(): void {
   
  }
  sendEmitDenunciar(){
    console.log("kcmkwmvrmvioenmi");
    this.SocketDenuncia.emit("listar-denuncia",{iddueno:this.userOnly.userSesion.datos._id})
  }
  ListarDenuncia(){
    return this.SocketDenuncia
    .fromEvent<any>("respuesta-listar-denuncia")
    .map( data => data );
  }
}
