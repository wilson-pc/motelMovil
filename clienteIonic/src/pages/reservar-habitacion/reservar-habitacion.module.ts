import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ReservarHabitacionPage } from './reservar-habitacion';

@NgModule({
  declarations: [
    ReservarHabitacionPage,
  ],
  imports: [
    IonicPageModule.forChild(ReservarHabitacionPage),
  ],
})
export class ReservarHabitacionPageModule {}
