import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DescripcionProductoPage } from './descripcion-producto';

@NgModule({
  declarations: [
    DescripcionProductoPage,
  ],
  imports: [
    IonicPageModule.forChild(DescripcionProductoPage),
  ],
})
export class DescripcionProductoPageModule {}
