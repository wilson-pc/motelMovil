import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { EditLoginPage } from './edit-login';

@NgModule({
  declarations: [
    EditLoginPage,
  ],
  imports: [
    IonicPageModule.forChild(EditLoginPage),
  ],
})
export class EditLoginPageModule {}
