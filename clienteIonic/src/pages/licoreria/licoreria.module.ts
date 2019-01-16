import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { LicoreriaPage } from './licoreria';

@NgModule({
  declarations: [
    LicoreriaPage,
  ],
  imports: [
    IonicPageModule.forChild(LicoreriaPage),
  ],
})
export class LicoreriaPageModule {}
