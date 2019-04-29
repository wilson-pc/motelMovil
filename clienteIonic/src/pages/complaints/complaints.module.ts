import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ComplaintsPage } from './complaints';

@NgModule({
  declarations: [
    ComplaintsPage,
  ],
  imports: [
    IonicPageModule.forChild(ComplaintsPage),
  ],
})
export class ComplaintsPageModule {}
