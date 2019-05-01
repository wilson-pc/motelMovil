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
      this.reservasCompletas=[];
     if(data.error){
       
     }else{
       data.forEach(element => {
        if(element.estado=="espera" ||element.estado=="rechazado"){
          this.Reservas.push(element);
        }else{
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
            if(data.estado=="aceptado"){
               this.Reservas.splice(index,1);
            }else{
              this.Reservas[index]=data;
            }
          }
      })
    )
 
  }
  confirmarClick(item){
  
    let datos={_id:item._id,estado:"aceptado",cliente:item.cliente._id}
    this.reservaService.sendEmitCambiarReserva(datos);
  }
  CancelarClick(item){
    let datos={_id:item._id,estado:"rechazado",cliente:item.cliente._id}
    this.reservaService.sendEmitCambiarReserva(datos);
  }
  getReservasCompletas(){
    console.log("send Emit");
    this.reservaService.sendEmitGetReservas({iddueno:this.userOnly.userSesion.datos._id,estado:"aceptado"});
  }
  ngOnDestroy(): void {
    this.ReservaSubscription.forEach((subscription: Subscription) => {
      subscription.unsubscribe();
  });
  }
}
