import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CercaDeMiPage } from './cerca-de-mi';

@NgModule({
  declarations: [
    CercaDeMiPage,
  ],
  imports: [
    IonicPageModule.forChild(CercaDeMiPage),
  ],
})
export class CercaDeMiPageModule {}
