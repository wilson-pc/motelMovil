import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ListaFavoritosPage } from './lista-favoritos';

@NgModule({
  declarations: [
    ListaFavoritosPage,
  ],
  imports: [
    IonicPageModule.forChild(ListaFavoritosPage),
  ],
})
export class ListaFavoritosPageModule {}
