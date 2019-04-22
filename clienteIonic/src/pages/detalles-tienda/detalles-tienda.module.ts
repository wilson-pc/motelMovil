import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DetallesTiendaPage } from './detalles-tienda';

@NgModule({
  declarations: [
    DetallesTiendaPage,
  ],
  imports: [
    IonicPageModule.forChild(DetallesTiendaPage),
  ],
})
export class DetallesTiendaPageModule {}
