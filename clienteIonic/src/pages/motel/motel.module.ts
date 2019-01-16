import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MotelPage } from './motel';

@NgModule({
  declarations: [
    MotelPage,
  ],
  imports: [
    IonicPageModule.forChild(MotelPage),
  ],
})
export class MotelPageModule {}
