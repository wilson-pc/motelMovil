import { UserOnlyProvider } from './../../providers/user-only/user-only';
import { Component, OnDestroy } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ReservationProvider } from '../../providers/reservation/reservation';
import { Subscription } from 'rxjs';

/**
 * Generated class for the ReservaPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-reserva',
  templateUrl: 'reserva.html',
})
export class ReservaPage  implements OnDestroy {

  tipo: String = "Reserva";
  Reservas:any[]=[];
  reservasCompletas:any[]=[];
  ReservaSubscription: Array<Subscription> = [];
  constructor(public navCtrl: NavController, public navParams: NavParams,public reservaService:ReservationProvider,
              private userOnly:UserOnlyProvider) {
                this.getReservas();
  }
  ionViewDidLoad() {
    console.log(this.userOnly.userSesion.datos._id);
   this.reservaService.sendEmitGetReservas({iddueno:this.userOnly.userSesion.datos._id,estado:"espera"});
  }
  getReservas(){
    this.ReservaSubscription.push(this.reservaService.getReservas().subscribe((data)=>{
      console.log(data);
     if(data.error){
        console.log(data);
     }else{
       data.forEach(element => {
        if(element.estado=="espera" ||element.estado=="confirmacion"){
          this.Reservas.push(element);
        }else{
          this.reservasCompletas=[];
          this.reservasCompletas.push(element);
        }
       });
     }
    }));
    this.ReservaSubscription.push(
      this.reservaService.cambiarReserva().subscribe((data)=>{
    
          if(data.error){
            
          }else{
            let reser=this.Reservas.filter(reser=>reser._id==data._id)[0];
           
            let index =this.Reservas.indexOf(reser);
          
            this.Reservas[index]=data;
          }
      })
    )
 
  }
  confirmarClick(item){
    let datos={_id:item._id,estado:"confirmacion",cliente:item.cliente._id}
    this.reservaService.sendEmitCambiarReserva(datos);
  }
  getReservasCompletas(){
    console.log("send Emit");
    this.reservaService.sendEmitGetReservas({iddueno:this.userOnly.userSesion.datos._id,estado:"completa"});
  }
  ngOnDestroy(): void {
    this.ReservaSubscription.forEach((subscription: Subscription) => {
      subscription.unsubscribe();
  });
  }
}
