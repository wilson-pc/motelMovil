import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { RegisterRoomPage } from './register-room';

@NgModule({
  declarations: [
    RegisterRoomPage,
  ],
  imports: [
    IonicPageModule.forChild(RegisterRoomPage),
  ],
})
export class RegisterRoomPageModule {}
