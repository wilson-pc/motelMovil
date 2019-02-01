import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ListaReservasPage } from './lista-reservas';

@NgModule({
  declarations: [
    ListaReservasPage,
  ],
  imports: [
    IonicPageModule.forChild(ListaReservasPage),
  ],
})
export class ListaReservasPageModule {}
