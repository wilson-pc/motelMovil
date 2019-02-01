import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ListaDeseosPage } from './lista-deseos';

@NgModule({
  declarations: [
    ListaDeseosPage,
  ],
  imports: [
    IonicPageModule.forChild(ListaDeseosPage),
  ],
})
export class ListaDeseosPageModule {}
